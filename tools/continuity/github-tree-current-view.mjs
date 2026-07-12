import { writeFile } from 'node:fs/promises';
import { materializeFromRepositoryTree } from './repository-tree-current-view.mjs';

function requireValue(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`${name} is required`);
  return value;
}

export async function fetchJson(url, { token, fetchImpl = fetch } = {}) {
  const response = await fetchImpl(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${requireValue(token, 'token')}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${url}`);
  return response.json();
}

export async function buildTreeBoundCurrentView({
  repository,
  commitSha,
  token,
  owner = 'continuity_mining',
  fetchImpl = fetch
}) {
  requireValue(repository, 'repository');
  requireValue(commitSha, 'commitSha');
  requireValue(owner, 'owner');
  const api = `https://api.github.com/repos/${repository}`;
  const commit = await fetchJson(`${api}/git/commits/${commitSha}`, { token, fetchImpl });
  const tree = await fetchJson(`${api}/git/trees/${commit.tree.sha}?recursive=1`, { token, fetchImpl });
  const queueFile = await fetchJson(`${api}/contents/operations/ACTIVE_QUEUE.json?ref=${commitSha}`, { token, fetchImpl });
  const canonicalQueue = JSON.parse(Buffer.from(queueFile.content, 'base64').toString('utf8'));

  const result = await materializeFromRepositoryTree({
    tree,
    canonicalQueue,
    owner,
    fetchDocument: async (path) => {
      const file = await fetchJson(`${api}/contents/${path}?ref=${commitSha}`, { token, fetchImpl });
      return {
        content: Buffer.from(file.content, 'base64').toString('utf8'),
        sha: file.sha
      };
    }
  });

  if (!result.completeness_verified) {
    throw new Error('repository snapshot completeness was not verified');
  }

  return {
    schema_version: '1.0.0',
    repository,
    commit_sha: commitSha,
    commit_tree_sha: commit.tree.sha,
    recursive_tree_sha: result.tree_sha,
    generated_at: new Date().toISOString(),
    ...result
  };
}

export async function main(env = process.env, fetchImpl = fetch) {
  const outputPath = env.CONTINUITY_OUTPUT ?? 'continuity-current-view.json';
  const manifest = await buildTreeBoundCurrentView({
    repository: env.GITHUB_REPOSITORY,
    commitSha: env.GITHUB_SHA,
    token: env.GITHUB_TOKEN,
    owner: env.CONTINUITY_OWNER ?? 'continuity_mining',
    fetchImpl
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
