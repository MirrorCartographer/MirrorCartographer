import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { materializeFromRepositoryTree } from './repository-tree-current-view.mjs';

function requireValue(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`${name} is required`);
  return value;
}

function git(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

export async function buildTreeBoundCurrentView({
  repository,
  commitSha,
  owner = 'continuity_mining',
  cwd = process.cwd()
}) {
  requireValue(repository, 'repository');
  requireValue(commitSha, 'commitSha');
  requireValue(owner, 'owner');

  const commit = git(['rev-parse', '--verify', `${commitSha}^{commit}`], cwd).trim();
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('resolved commit is not immutable');
  const commitTreeSha = git(['rev-parse', `${commit}^{tree}`], cwd).trim();
  const treeText = git(['ls-tree', '-r', '-z', '--full-tree', commit], cwd);
  const entries = treeText.split('\0').filter(Boolean).map((entry) => {
    const tab = entry.indexOf('\t');
    const [mode, type, sha] = entry.slice(0, tab).split(' ');
    return { mode, type, sha, path: entry.slice(tab + 1) };
  });
  const tree = { sha: commitTreeSha, truncated: false, tree: entries };
  const entryByPath = new Map(entries.map((entry) => [entry.path, entry]));

  const canonicalQueuePath = 'operations/ACTIVE_QUEUE.json';
  const canonicalQueue = JSON.parse(git(['show', `${commit}:${canonicalQueuePath}`], cwd));
  const canonicalQueueBlobSha = git(['rev-parse', `${commit}:${canonicalQueuePath}`], cwd).trim();

  const result = await materializeFromRepositoryTree({
    tree,
    canonicalQueue,
    owner,
    fetchDocument: async (path) => {
      const entry = entryByPath.get(path);
      if (!entry || entry.type !== 'blob') throw new Error(`${path}: repository tree has no regular blob`);
      return { content: git(['cat-file', 'blob', entry.sha], cwd), sha: entry.sha };
    }
  });

  if (!result.completeness_verified) throw new Error('repository snapshot completeness was not verified');

  return {
    schema_version: '1.0.0',
    repository,
    commit_sha: commit,
    commit_tree_sha: commitTreeSha,
    recursive_tree_sha: result.tree_sha,
    canonical_queue_blob_sha: canonicalQueueBlobSha,
    generated_at: new Date().toISOString(),
    ...result
  };
}

export async function main(env = process.env) {
  const outputPath = env.CONTINUITY_OUTPUT ?? 'continuity-current-view.json';
  const manifest = await buildTreeBoundCurrentView({
    repository: env.GITHUB_REPOSITORY,
    commitSha: env.GITHUB_SHA,
    owner: env.CONTINUITY_OWNER ?? 'continuity_mining'
  });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((manifest) => {
    console.log(JSON.stringify({
      output: process.env.CONTINUITY_OUTPUT ?? 'continuity-current-view.json',
      commit_sha: manifest.commit_sha,
      tree_sha: manifest.recursive_tree_sha,
      enumerated_path_count: manifest.enumerated_path_count,
      completeness_verified: manifest.completeness_verified
    }));
  }).catch((error) => {
    console.error(error.stack ?? error.message);
    process.exitCode = 1;
  });
}
