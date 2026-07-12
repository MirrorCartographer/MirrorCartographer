import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runEffectiveQueueDiscovery } from './discover-effective-queue.mjs';

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function stableItem(item) {
  return {
    id: item.id,
    owner: item.owner,
    priority: item.priority,
    status: item.status,
    action: item.action,
    dependencies: item.dependencies,
    updated_at: item.updated_at,
    source: item.source,
    path: item.path,
    blob_sha: item.blob_sha
  };
}

export function verifyEffectiveQueueArtifact({ cwd = '.', artifact, expectedCommit = 'HEAD' } = {}) {
  const errors = [];
  const commit = git(['rev-parse', '--verify', `${expectedCommit}^{commit}`], cwd);

  if (!artifact || typeof artifact !== 'object') {
    return { accepted: false, commit, errors: [{ code: 'EQA-000', message: 'artifact must be an object' }] };
  }
  if (artifact.gate_status !== 'accepted') errors.push({ code: 'EQA-001', message: 'artifact gate_status must be accepted' });
  if (artifact.source_commit !== commit) errors.push({ code: 'EQA-002', message: 'artifact source_commit does not match checked-out commit' });

  let regenerated;
  try {
    regenerated = runEffectiveQueueDiscovery({ cwd, sourceCommit: commit });
  } catch (error) {
    errors.push({ code: 'EQA-003', message: `immutable corpus regeneration failed: ${error.message}` });
  }

  if (regenerated) {
    if (regenerated.gate_status !== 'accepted') errors.push({ code: 'EQA-004', message: 'current immutable corpus is not accepted' });
    if (artifact.canonical_queue_blob_sha !== regenerated.canonical_queue_blob_sha) errors.push({ code: 'EQA-005', message: 'canonical queue blob identity mismatch' });
    if (artifact.input_manifest_sha256 !== regenerated.input_manifest_sha256) errors.push({ code: 'EQA-006', message: 'queue input manifest mismatch' });
    if (artifact.discovered_update_count !== regenerated.discovered_update_count || artifact.parsed_update_count !== regenerated.parsed_update_count) errors.push({ code: 'EQA-007', message: 'queue update count mismatch' });
    if (digest(artifact.input_update_blob_shas ?? []) !== digest(regenerated.input_update_blob_shas)) errors.push({ code: 'EQA-008', message: 'queue update blob set mismatch' });
    if (digest((artifact.effective_items ?? []).map(stableItem)) !== digest(regenerated.effective_items.map(stableItem))) errors.push({ code: 'EQA-009', message: 'effective queue contents mismatch' });
  }

  return {
    schema_version: '1.0.0',
    artifact_type: 'effective_queue_consumer_verification',
    accepted: errors.length === 0,
    commit,
    artifact_source_commit: artifact.source_commit ?? null,
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const artifactPath = process.argv[2] ?? 'operations/effective-queue.json';
  const cwd = process.argv[3] ?? '.';
  const expectedCommit = process.argv[4] ?? 'HEAD';
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
  const result = verifyEffectiveQueueArtifact({ cwd, artifact, expectedCommit });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.accepted) process.exitCode = 1;
}
