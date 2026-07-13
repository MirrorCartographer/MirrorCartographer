import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function runWorker(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [fileURLToPath(new URL('./filesystem-peer-terminal-worker.mjs', import.meta.url)), ...args],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) resolve(JSON.parse(stdout));
      else reject(new Error(`worker-exit:${code}:${stderr}:${stdout}`));
    });
  });
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
