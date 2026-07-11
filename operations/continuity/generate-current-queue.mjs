import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { reconcileQueue, stableStringify } from './reconcile-queue.mjs';

function git(repoRoot, args) {
  return execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' }).trim();
}

export function readGitProvenance(repoRoot, relativePath) {
  const source_commit_sha = git(repoRoot, ['log', '-1', '--format=%H', '--', relativePath]) || null;
  let source_blob_sha = null;
  if (source_commit_sha) {
    try {
      source_blob_sha = git(repoRoot, ['rev-parse', `${source_commit_sha}:${relativePath}`]) || null;
    } catch {
      source_blob_sha = null;
    }
  }
  const git_commit_committer_time = source_commit_sha
    ? git(repoRoot, ['show', '-s', '--format=%cI', source_commit_sha]) || null
    : null;
  return { source_commit_sha, source_blob_sha, git_commit_committer_time };
}

export async function discoverQueueInputs(repoRoot) {
  const baselinePath = 'operations/ACTIVE_QUEUE.json';
  const updatesDirectory = path.join(repoRoot, 'operations/queue-updates');
  const baseline = JSON.parse(await fs.readFile(path.join(repoRoot, baselinePath), 'utf8'));
  const baselineProvenance = readGitProvenance(repoRoot, baselinePath);
  baseline.items = (baseline.items ?? []).map((item) => ({
    ...item,
    __source_path: baselinePath,
    __source_blob_sha: baselineProvenance.source_blob_sha,
    __source_commit_sha: baselineProvenance.source_commit_sha,
    git_commit_committer_time: baselineProvenance.git_commit_committer_time,
  }));

  const filenames = (await fs.readdir(updatesDirectory))
    .filter((name) => name.endsWith('.json'))
    .sort();
  const updates = [];
  for (const filename of filenames) {
    const relativePath = path.posix.join('operations/queue-updates', filename);
    const record = JSON.parse(await fs.readFile(path.join(repoRoot, relativePath), 'utf8'));
    const source = readGitProvenance(repoRoot, relativePath);
    updates.push({
      ...record,
      __source_path: relativePath,
      __source_blob_sha: source.source_blob_sha,
      __source_commit_sha: source.source_commit_sha,
      git_commit_committer_time: source.git_commit_committer_time,
    });
  }
  return { baseline, updates };
}

export async function generateCurrentQueueView(repoRoot = process.cwd()) {
  const inputs = await discoverQueueInputs(repoRoot);
  return reconcileQueue(inputs);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const repoRoot = path.resolve(process.argv[2] ?? process.cwd());
  const outputPath = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.join(repoRoot, 'operations/continuity/CURRENT_QUEUE_VIEW.generated.json');
  const view = await generateCurrentQueueView(repoRoot);
  await fs.writeFile(outputPath, stableStringify(view), 'utf8');
  process.stdout.write(`${outputPath}\n${view.canonical_sha256}\n`);
}
