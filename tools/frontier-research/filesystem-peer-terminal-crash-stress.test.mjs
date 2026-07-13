import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workerPath = fileURLToPath(new URL('./filesystem-peer-terminal-worker.mjs', import.meta.url));
const crashPoints = ['before-rename', 'after-rename-before-directory-sync', 'before-lock-release'];
const cyclesPerPoint = 4;

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

function isResidualArtifact(name) {
  return name.endsWith('.lock') || name.includes('.stale.') || name.endsWith('.tmp');
}

test('repeated process crashes recover without residual coordination artifacts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'peer-terminal-stress-'));
  const observations = [];

  try {
    for (const crashPoint of crashPoints) {
      for (let cycle = 0; cycle < cyclesPerPoint; cycle += 1) {
        const directory = join(root, `${crashPoint}-${cycle}`);
        const journalPath = join(directory, 'journal.json');
        const barrierPath = join(directory, 'go');
        const lockOwnerPath = `${journalPath}.lock/owner.json`;
        await writeFile(barrierPath, 'go', { flag: 'wx' }).catch(async error => {
          if (error?.code !== 'ENOENT') throw error;
          const { mkdir } = await import('node:fs/promises');
          await mkdir(directory, { recursive: true });
          await writeFile(barrierPath, 'go', { flag: 'wx' });
        });

        const crashed = spawnWorker([
          journalPath,
          barrierPath,
          `crash-${crashPoint}-${cycle}`,
          'executed',
          `crash-digest-${crashPoint}-${cycle}`,
          crashPoint
        ]);
        await waitForPath(lockOwnerPath);
        const crashResult = await crashed.completion;
        assert.equal(crashResult.signal, 'SIGKILL');

        const successor = await runWorker([
          journalPath,
          barrierPath,
          `successor-${crashPoint}-${cycle}`,
          'failed',
          `successor-digest-${crashPoint}-${cycle}`
        ]);
        assert.equal(successor.ok, true);
        assert.ok(['recorded', 'already-recorded'].includes(successor.result.state));

        const document = JSON.parse(await readFile(journalPath, 'utf8'));
        assert.equal(Object.keys(document.terminals).length, 1);
        const terminal = document.terminals['shared-trigger'];
        assert.ok(terminal);
        const expectedPrefix = crashPoint === 'before-rename' ? 'successor-' : 'crash-';
        assert.ok(terminal.terminal_event.id.startsWith(expectedPrefix));

        const residuals = (await readdir(directory)).filter(isResidualArtifact);
        assert.deepEqual(residuals, []);
        observations.push({ crashPoint, cycle, terminal: terminal.terminal_event.id, residuals });
      }
    }

    assert.equal(observations.length, crashPoints.length * cyclesPerPoint);

    if (process.env.EVIDENCE_SUMMARY_PATH) {
      const summary = {
        schema_version: '1.0.0',
        cycles_completed: observations.length,
        terminal_records: observations.length,
        residual_artifact_count: observations.reduce((total, item) => total + item.residuals.length, 0),
        crash_points: crashPoints,
        cycles_per_point: cyclesPerPoint
      };
      await writeFile(process.env.EVIDENCE_SUMMARY_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});