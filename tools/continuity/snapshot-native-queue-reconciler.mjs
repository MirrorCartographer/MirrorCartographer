import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { reconcileQueueItem } from './queue-reconciler.mjs';
import { resolveSnapshotCommit } from './queue-snapshot-binding.mjs';

function git(root, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || '').trim()}`);
  }
  return result;
}

function repositoryPath(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string`);
  if (value.startsWith('/') || value.includes('\\') || value.split('/').includes('..')) {
    throw new Error(`${field} must stay inside the repository`);
  }
  return value.replace(/^\.\//, '');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function readBlob(root, commit, path) {
  const safePath = repositoryPath(path, 'repository path');
  const type = git(root, ['cat-file', '-t', `${commit}:${safePath}`], { allowFailure: true });
  if (type.status !== 0 || type.stdout.trim() !== 'blob') return null;
  const content = git(root, ['show', `${commit}:${safePath}`]).stdout;
  return { path: safePath, content, sha256: sha256(content), byte_length: Buffer.byteLength(content) };
}

function parseBlob(blob, label) {
  if (!blob) throw new Error(`${label} missing from snapshot`);
  try { return JSON.parse(blob.content); }
  catch (error) { throw new Error(`${label} invalid JSON: ${error.message}`); }
}

function listJsonPaths(root, commit, directory) {
  const safeDirectory = repositoryPath(directory, 'projection directory');
  const result = git(root, ['ls-tree', '-r', '--name-only', commit, '--', safeDirectory], { allowFailure: true });
  if (result.status !== 0) return [];
  return result.stdout.split('\n').map((line) => line.trim()).filter((path) => path.endsWith('.json')).sort();
}

function commitExistsInRepository(root, sha) {
  if (typeof sha !== 'string' || !/^[0-9a-f]{40}$/i.test(sha)) return false;
  return git(root, ['cat-file', '-e', `${sha}^{commit}`], { allowFailure: true }).status === 0;
}

export function buildSnapshotNativeQueueCandidate({
  repositoryRoot,
  ref = 'HEAD',
  activeQueuePath = 'operations/ACTIVE_QUEUE.json',
  projectionDirectory = 'operations/queue-updates'
}) {
  const root = resolve(repositoryRoot);
  const sourceCommit = resolveSnapshotCommit(root, ref);
  const queueBlob = readBlob(root, sourceCommit, activeQueuePath);
  const activeQueue = parseBlob(queueBlob, 'canonical queue');
  if (!Array.isArray(activeQueue.items)) throw new TypeError('canonical queue items must be an array');

  const projectionPaths = listJsonPaths(root, sourceCommit, projectionDirectory);
  const parsed = [];
  const rejectedFiles = [];
  for (const path of projectionPaths) {
    const blob = readBlob(root, sourceCommit, path);
    try {
      parsed.push({ ...parseBlob(blob, `projection ${path}`), source_path: path, source_sha256: blob.sha256 });
    } catch (error) {
      rejectedFiles.push({ source_path: path, source_sha256: blob?.sha256 ?? null, rejection_reasons: ['invalid_projection_file'], detail: error.message });
    }
  }

  const canonicalIds = new Set(activeQueue.items.map((item) => item.id));
  const orphanProjections = parsed.filter((projection) => !canonicalIds.has(projection.queue_item));
  const grouped = new Map();
  for (const projection of parsed) {
    if (!canonicalIds.has(projection.queue_item)) continue;
    const list = grouped.get(projection.queue_item) || [];
    list.push(projection);
    grouped.set(projection.queue_item, list);
  }

  const items = activeQueue.items.map((aggregate) => {
    const updates = (grouped.get(aggregate.id) || []).sort((a, b) => {
      const timeA = Date.parse(a.recorded_at);
      const timeB = Date.parse(b.recorded_at);
      if (Number.isFinite(timeA) && Number.isFinite(timeB) && timeA !== timeB) return timeA - timeB;
      return String(a.record_id).localeCompare(String(b.record_id));
    });
    const referencedCommits = [...new Set(updates.flatMap((update) => update.source_commits || []))];
    const referencedEvidence = [...new Set(updates.flatMap((update) => update.evidence_paths || []))];
    const resolvableCommits = referencedCommits.filter((sha) => commitExistsInRepository(root, sha));
    const resolvableEvidencePaths = referencedEvidence.filter((path) => Boolean(readBlob(root, sourceCommit, path)));
    return reconcileQueueItem({ aggregate, updates, resolvableCommits, resolvableEvidencePaths });
  });

  const sourceInventory = {
    source_commit: sourceCommit,
    canonical_queue: { path: queueBlob.path, sha256: queueBlob.sha256, byte_length: queueBlob.byte_length },
    projections: parsed.map(({ source_path, source_sha256, record_id = null, queue_item = null }) => ({ source_path, source_sha256, record_id, queue_item })),
    rejected_files: rejectedFiles.map(({ source_path, source_sha256 }) => ({ source_path, source_sha256 }))
  };
  const candidateCore = { source_commit: sourceCommit, items, orphan_projections: orphanProjections, rejected_files: rejectedFiles };
  const sourceDigest = sha256(JSON.stringify(sourceInventory));
  const candidateDigest = sha256(JSON.stringify(candidateCore));
  const blocked = rejectedFiles.length > 0 || orphanProjections.length > 0 || items.some((item) => !item.materialization_allowed);

  return {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    mutation_performed: false,
    source_commit: sourceCommit,
    source_digest: sourceDigest,
    candidate_digest: candidateDigest,
    snapshot_native: true,
    materialization_allowed: false,
    materialization_blockers: [
      'canonical_materialization_authority_not_defined',
      ...(blocked ? ['candidate_contains_unresolved_or_rejected_records'] : [])
    ],
    source_inventory: sourceInventory,
    items,
    rejected_files: rejectedFiles,
    orphan_projections: orphanProjections,
    review_route: 'Verify source_commit, source_digest, and candidate_digest; inspect rejected or unresolved records; then apply a separately defined authority policy. This artifact never mutates canonical state.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const [root = '.', ref = 'HEAD'] = process.argv.slice(2);
    process.stdout.write(`${JSON.stringify(buildSnapshotNativeQueueCandidate({ repositoryRoot: root, ref }), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
