import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workerPath = fileURLToPath(new URL('./filesystem-peer-terminal-worker.mjs', import.meta.url));

function spawnWorker(args) {
  const child = spawn(process.execPath, [workerPath, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const completion = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
  return { child, completion };
}

async function runWorker(args) {
  const result = await spawnWorker(args).completion;
  if (result.code !== 0) throw new Error(`worker-exit:${result.code}:${result.signal}:${result.stderr}:${result.stdout}`);
  return JSON.parse(result.stdout);
}

async function waitForPath(path, timeoutMs = 1000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await access(path);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }
  throw new Error(`path-timeout:${path}`);
}

test('two OS processes persist exactly one conflicting terminal', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'peer-terminal-'));
  const journalPath = join(directory, 'journal.json');
  const barrierPath = join(directory, 'go');

  try {
    const first = runWorker([journalPath, barrierPath, 'event-a', 'executed', 'digest-a']);
    const second = runWorker([journalPath, barrierPath, 'event-b', 'failed', 'digest-b']);
    await writeFile(barrierPath, 'go');

    const results = await Promise.all([first, second]);
    assert.equal(results.filter(result => result.ok && result.result.state === 'recorded').length, 1);
    assert.equal(results.filter(result => !result.ok && result.error === 'terminal-conflict').length, 1);

    const document = JSON.parse(await readFile(journalPath, 'utf8'));
    assert.equal(Object.keys(document.terminals).length, 1);
    assert.ok(['event-a', 'event-b'].includes(document.terminals['shared-trigger'].terminal_event.id));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

for (const crashPoint of ['before-rename', 'after-rename-before-directory-sync', 'before-lock-release']) {
  test(`a successor recovers a dead process lock after ${crashPoint}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'peer-terminal-crash-'));
    const journalPath = join(directory, 'journal.json');
    const barrierPath = join(directory, 'go');
    const lockOwnerPath = `${journalPath}.lock/owner.json`;

    try {
      const crashed = spawnWorker([
        journalPath,
        barrierPath,
        'crash-event',
        'executed',
        'crash-digest',
        crashPoint
      ]);
      await writeFile(barrierPath, 'go');
      await waitForPath(lockOwnerPath);
      const crashResult = await crashed.completion;
      assert.equal(crashResult.signal, 'SIGKILL');

      const successor = await runWorker([
        journalPath,
        barrierPath,
        'successor-event',
        'failed',
        'successor-digest'
      ]);
      assert.equal(successor.ok, true);
      assert.ok(['recorded', 'already-recorded'].includes(successor.result.state));

      const document = JSON.parse(await readFile(journalPath, 'utf8'));
      assert.equal(Object.keys(document.terminals).length, 1);
      const terminal = document.terminals['shared-trigger'];
      assert.ok(terminal);
      if (crashPoint === 'before-rename') {
        assert.equal(terminal.terminal_event.id, 'successor-event');
      } else {
        assert.equal(terminal.terminal_event.id, 'crash-event');
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
