import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { reconcileQueueItem } from './queue-reconciler.mjs';

function assertInside(root, candidate, field) {
  const rel = relative(root, candidate);
  if (rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !resolve(candidate).startsWith(`${resolve(root)}${sep}`))) return;
  if (rel.startsWith(`..${sep}`) || rel === '..') throw new Error(`${field} escapes repository root`);
}

async function readJson(path, label) {
  let text;
  try { text = await readFile(path, 'utf8'); }
  catch (error) { throw new Error(`${label} unreadable: ${error.message}`); }
  try { return JSON.parse(text); }
  catch (error) { throw new Error(`${label} invalid JSON: ${error.message}`); }
}

function commitExists(root, sha) {
  if (typeof sha !== 'string' || !/^[0-9a-f]{40}$/i.test(sha)) return false;
  const result = spawnSync('git', ['cat-file', '-e', `${sha}^{commit}`], {
    cwd: root,
    stdio: 'ignore'
  });
  return result.status === 0;
}

async function pathExists(root, repositoryPath) {
  if (typeof repositoryPath !== 'string' || !repositoryPath.trim()) return false;
  const absolute = resolve(root, repositoryPath);
  try { assertInside(root, absolute, 'evidence path'); }
  catch { return false; }
  try {
    const info = await stat(absolute);
    return info.isFile();
  } catch { return false; }
}

export async function discoverQueueProjections({ repositoryRoot, queueDirectory = 'operations/queue-updates' }) {
  const root = resolve(repositoryRoot);
  const directory = resolve(root, queueDirectory);
  assertInside(root, directory, 'queue directory');
  const entries = await readdir(directory, { withFileTypes: true });
  const projections = [];
  const rejectedFiles = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const absolute = resolve(directory, entry.name);
    try {
      const projection = await readJson(absolute, `projection ${entry.name}`);
      projections.push({ ...projection, source_path: relative(root, absolute).split(sep).join('/') });
    } catch (error) {
      rejectedFiles.push({
        source_path: relative(root, absolute).split(sep).join('/'),
        rejection_reasons: ['invalid_projection_file'],
        detail: error.message
      });
    }
  }
  return { projections, rejected_files: rejectedFiles };
}

export async function buildQueueMaterializationCandidate({
  repositoryRoot,
  activeQueuePath = 'operations/ACTIVE_QUEUE.json',
  queueDirectory = 'operations/queue-updates'
}) {
  const root = resolve(repositoryRoot);
  const queuePath = resolve(root, activeQueuePath);
  assertInside(root, queuePath, 'active queue path');
  const activeQueue = await readJson(queuePath, 'active queue');
  if (!Array.isArray(activeQueue.items)) throw new TypeError('active queue items must be an array');

  const { projections, rejected_files } = await discoverQueueProjections({ repositoryRoot: root, queueDirectory });
  const aggregates = new Map(activeQueue.items.map((item) => [item.id, item]));
  const grouped = new Map();
  const orphanProjections = [];

  for (const projection of projections) {
    if (!aggregates.has(projection.queue_item)) {
      orphanProjections.push({
        ...projection,
        rejection_reasons: ['queue_item_not_in_canonical_queue']
      });
      continue;
    }
    const list = grouped.get(projection.queue_item) || [];
    list.push(projection);
    grouped.set(projection.queue_item, list);
  }

  const items = [];
  for (const aggregate of activeQueue.items) {
    const updates = (grouped.get(aggregate.id) || []).sort((a, b) => {
      const time = Date.parse(a.recorded_at) - Date.parse(b.recorded_at);
      return Number.isNaN(time) || time === 0 ? String(a.record_id).localeCompare(String(b.record_id)) : time;
    });
    const referencedCommits = [...new Set(updates.flatMap((update) => update.source_commits || []))];
    const referencedPaths = [...new Set(updates.flatMap((update) => update.evidence_paths || []))];
    const resolvableCommits = referencedCommits.filter((sha) => commitExists(root, sha));
    const pathChecks = await Promise.all(referencedPaths.map(async (path) => [path, await pathExists(root, path)]));
    const resolvableEvidencePaths = pathChecks.filter(([, exists]) => exists).map(([path]) => path);

    items.push(reconcileQueueItem({
      aggregate,
      updates,
      resolvableCommits,
      resolvableEvidencePaths
    }));
  }

  const blocked = rejected_files.length > 0 || orphanProjections.length > 0 || items.some((item) => !item.materialization_allowed);
  return {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    source: {
      canonical_queue: activeQueuePath,
      projection_directory: queueDirectory
    },
    mutation_performed: false,
    materialization_allowed: !blocked,
    items,
    rejected_files,
    orphan_projections: orphanProjections,
    unresolved: [
      ...(rejected_files.length ? ['one_or_more_projection_files_invalid'] : []),
      ...(orphanProjections.length ? ['one_or_more_projections_have_no_canonical_queue_item'] : []),
      ...(items.some((item) => !item.materialization_allowed) ? ['one_or_more_queue_items_block_materialization'] : []),
      'canonical_materialization_authority_not_defined'
    ],
    review_route: 'Review rejected files, orphan projections, unresolved commit/path references, chronology, evidence completeness, and authority before any canonical queue change.'
  };
}

async function main() {
  const [rootArg = '.', outputArg] = process.argv.slice(2);
  const candidate = await buildQueueMaterializationCandidate({ repositoryRoot: rootArg });
  const serialized = `${JSON.stringify(candidate, null, 2)}\n`;
  if (!outputArg) {
    process.stdout.write(serialized);
    return;
  }
  const output = resolve(rootArg, outputArg);
  assertInside(resolve(rootArg), output, 'output path');
  try {
    await writeFile(output, serialized, { encoding: 'utf8', flag: 'wx' });
  } catch (error) {
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
