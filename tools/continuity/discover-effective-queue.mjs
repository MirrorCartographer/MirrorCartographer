import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { buildEffectiveQueue } from './effective-queue-gate.mjs';

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding:'utf8', stdio:['ignore','pipe','pipe'] }).trim();
}

export function discoverQueueCorpus({ cwd='.', sourceCommit='HEAD' } = {}) {
  const commit = git(['rev-parse','--verify',`${sourceCommit}^{commit}`], cwd);
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('resolved commit is not immutable');
  const canonicalPath = 'operations/ACTIVE_QUEUE.json';
  const canonicalText = git(['show',`${commit}:${canonicalPath}`], cwd);
  const canonicalQueue = JSON.parse(canonicalText);
  const canonicalBlobSha = git(['rev-parse',`${commit}:${canonicalPath}`], cwd);
  const pathsText = git(['ls-tree','-r','--name-only',commit,'operations/queue-updates'], cwd);
  const discoveredUpdatePaths = pathsText ? pathsText.split('\n').filter(p=>p.endsWith('.json')).sort() : [];
  const updates = discoveredUpdatePaths.map((path) => ({
    path,
    blob_sha: git(['rev-parse',`${commit}:${path}`], cwd),
    record: JSON.parse(git(['show',`${commit}:${path}`], cwd))
  }));
  return { source_commit:commit, canonical_queue_blob_sha:canonicalBlobSha, canonical_queue:canonicalQueue, discovered_update_paths:discoveredUpdatePaths, updates };
}

export function runEffectiveQueueDiscovery(options = {}) {
  const corpus = discoverQueueCorpus(options);
  return buildEffectiveQueue(corpus);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cwd = process.argv[2] ?? '.';
  const sourceCommit = process.argv[3] ?? 'HEAD';
  const outputPath = process.argv[4] ?? 'operations/effective-queue.json';
  const result = runEffectiveQueueDiscovery({ cwd, sourceCommit });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  if (result.gate_status !== 'accepted') process.exitCode = 1;
}
