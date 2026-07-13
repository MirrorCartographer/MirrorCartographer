import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

function git(root, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || '').trim()}`);
  }
  return result;
}

function assertRepositoryPath(path, field = 'repository path') {
  if (typeof path !== 'string' || !path.trim()) throw new TypeError(`${field} must be a non-empty string`);
  if (path.startsWith('/') || path.includes('\\') || path.split('/').includes('..')) {
    throw new Error(`${field} must stay inside the repository`);
  }
  return path.replace(/^\.\//, '');
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function readBlob(root, commit, repositoryPath) {
  const path = assertRepositoryPath(repositoryPath);
  const type = git(root, ['cat-file', '-t', `${commit}:${path}`], { allowFailure: true });
  if (type.status !== 0 || type.stdout.trim() !== 'blob') return null;
  const content = git(root, ['show', `${commit}:${path}`]).stdout;
  return {
    path,
    byte_length: Buffer.byteLength(content),
    sha256: sha256(Buffer.from(content)),
    content
  };
}

function listJsonBlobs(root, commit, directory) {
  const path = assertRepositoryPath(directory, 'projection directory');
  const result = git(root, ['ls-tree', '-r', '--name-only', commit, '--', path], { allowFailure: true });
  if (result.status !== 0) return [];
  return result.stdout.split('\n').map((value) => value.trim()).filter((value) => value.endsWith('.json')).sort();
}

function parseJson(blob, label) {
  try { return JSON.parse(blob.content); }
  catch (error) { throw new Error(`${label} is invalid JSON: ${error.message}`); }
}

export function resolveSnapshotCommit(repositoryRoot, ref = 'HEAD') {
  const root = resolve(repositoryRoot);
  const result = git(root, ['rev-parse', '--verify', `${ref}^{commit}`]);
  const commit = result.stdout.trim();
  if (!/^[0-9a-f]{40}$/i.test(commit)) throw new Error(`resolved ref is not a full commit SHA: ${ref}`);
  return commit;
}

export function buildQueueSnapshotBinding({
  repositoryRoot,
  ref = 'HEAD',
  activeQueuePath = 'operations/ACTIVE_QUEUE.json',
  projectionDirectory = 'operations/queue-updates'
}) {
  const root = resolve(repositoryRoot);
  const commit = resolveSnapshotCommit(root, ref);
  const queueBlob = readBlob(root, commit, activeQueuePath);
  if (!queueBlob) throw new Error(`canonical queue missing from snapshot: ${activeQueuePath}`);
  const queue = parseJson(queueBlob, 'canonical queue');
  if (!Array.isArray(queue.items)) throw new TypeError('canonical queue items must be an array');

  const projectionPaths = listJsonBlobs(root, commit, projectionDirectory);
  const projections = [];
  const malformed = [];
  const evidencePaths = new Set();

  for (const path of projectionPaths) {
    const blob = readBlob(root, commit, path);
    try {
      const value = parseJson(blob, `projection ${path}`);
      projections.push({ path, sha256: blob.sha256, record_id: value.record_id ?? null, queue_item: value.queue_item ?? null });
      for (const evidencePath of value.evidence_paths || []) evidencePaths.add(assertRepositoryPath(evidencePath, 'evidence path'));
    } catch (error) {
      malformed.push({ path, sha256: blob.sha256, reason: 'invalid_projection_json', detail: error.message });
    }
  }

  const evidence = [];
  const missingEvidence = [];
  for (const path of [...evidencePaths].sort()) {
    const blob = readBlob(root, commit, path);
    if (!blob) missingEvidence.push(path);
    else evidence.push({ path, sha256: blob.sha256, byte_length: blob.byte_length });
  }

  const source = {
    commit,
    canonical_queue: { path: queueBlob.path, sha256: queueBlob.sha256, byte_length: queueBlob.byte_length },
    projections,
    evidence
  };
  const sourceDigest = sha256(Buffer.from(JSON.stringify(source)));
  const materializationBlocked = malformed.length > 0 || missingEvidence.length > 0;

  return {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    mutation_performed: false,
    source_commit: commit,
    source_digest: sourceDigest,
    snapshot_consistent: true,
    materialization_allowed: false,
    materialization_blockers: [
      'canonical_materialization_authority_not_defined',
      ...(materializationBlocked ? ['snapshot_contains_unresolved_sources'] : [])
    ],
    source,
    malformed_projections: malformed,
    missing_evidence_paths: missingEvidence,
    counts: {
      canonical_queue_items: queue.items.length,
      projection_files: projectionPaths.length,
      parsed_projections: projections.length,
      evidence_files: evidence.length
    },
    review_route: 'Verify the source commit and digest, inspect unresolved sources, then apply a separately defined materialization-authority policy. Snapshot consistency is not authorization.'
  };
}

async function main() {
  const [rootArg = '.', refArg = 'HEAD', outputArg] = process.argv.slice(2);
  const binding = buildQueueSnapshotBinding({ repositoryRoot: rootArg, ref: refArg });
  const serialized = `${JSON.stringify(binding, null, 2)}\n`;
  if (!outputArg) return void process.stdout.write(serialized);
  const root = resolve(rootArg);
  const output = resolve(root, outputArg);
  const rel = relative(root, output);
  if (rel === '..' || rel.startsWith(`..${sep}`)) throw new Error('output path escapes repository root');
  try { await writeFile(output, serialized, { encoding: 'utf8', flag: 'wx' }); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`refusing to overwrite existing output: ${outputArg}`);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
