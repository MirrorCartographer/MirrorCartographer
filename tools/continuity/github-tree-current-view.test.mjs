import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildTreeBoundCurrentView } from './github-tree-current-view.mjs';

async function makeRepository({ badUpdate = false, omitQueue = false } = {}) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'mc-current-view-'));
  const git = (args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  await mkdir(path.join(cwd, 'operations', 'queue-updates'), { recursive: true });
  if (!omitQueue) {
    await writeFile(path.join(cwd, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({
      items: [{ id: 'M-001', owner: 'continuity_mining', status: 'completed', action: 'Build index' }]
    }));
  }
  await writeFile(path.join(cwd, 'operations', 'queue-updates', 'M-006.json'), badUpdate ? '{not-json' : JSON.stringify({
    queue_item: 'M-006', owner: 'continuity_mining', status: 'completed',
    completed_at: '2026-07-12T00:48:47Z', action: 'Prove repository-tree completeness'
  }));
  await writeFile(path.join(cwd, 'operations', 'queue-updates', 'V-002.json'), JSON.stringify({
    queue_item: 'V-002', owner: 'vercel_studio', status: 'completed',
    completed_at: '2026-07-12T00:20:00Z', action: 'Other team'
  }));
  git(['init', '--initial-branch=main']);
  git(['config', 'user.email', 'fixture@example.test']);
  git(['config', 'user.name', 'Continuity Fixture']);
  git(['add', '.']);
  git(['commit', '-m', 'immutable fixture']);
  const commitSha = git(['rev-parse', 'HEAD']);
  const commitTreeSha = git(['rev-parse', 'HEAD^{tree}']);
  const updateBlobSha = git(['rev-parse', 'HEAD:operations/queue-updates/M-006.json']);
  return { cwd, git, commitSha, commitTreeSha, updateBlobSha };
}

test('materializes every queue-update blob from the exact immutable local commit', async () => {
  const fixture = await makeRepository();
  try {
    const manifest = await buildTreeBoundCurrentView({
      repository: 'MirrorCartographer/MirrorCartographer',
      commitSha: fixture.commitSha,
      cwd: fixture.cwd
    });
    assert.equal(manifest.commit_sha, fixture.commitSha);
    assert.equal(manifest.commit_tree_sha, fixture.commitTreeSha);
    assert.equal(manifest.recursive_tree_sha, fixture.commitTreeSha);
    assert.equal(manifest.canonical_queue_blob_sha, fixture.git(['rev-parse', 'HEAD:operations/ACTIVE_QUEUE.json']));
    assert.equal(manifest.completeness_verified, true);
    assert.equal(manifest.enumerated_path_count, 2);
    assert.equal(manifest.fetched_path_count, 2);
    assert.equal(manifest.current_view.items.find((item) => item.id === 'M-006').source_blob_sha, fixture.updateBlobSha);
    assert.deepEqual(manifest.current_view.items.map((item) => item.id), ['M-001', 'M-006']);
  } finally {
    await rm(fixture.cwd, { recursive: true, force: true });
  }
});

test('fails closed when an enumerated queue-update blob is invalid JSON', async () => {
  const fixture = await makeRepository({ badUpdate: true });
  try {
    await assert.rejects(
      buildTreeBoundCurrentView({
        repository: 'MirrorCartographer/MirrorCartographer',
        commitSha: fixture.commitSha,
        cwd: fixture.cwd
      }),
      /invalid JSON/
    );
  } finally {
    await rm(fixture.cwd, { recursive: true, force: true });
  }
});

test('fails closed when the immutable commit has no canonical queue snapshot', async () => {
  const fixture = await makeRepository({ omitQueue: true });
  try {
    await assert.rejects(
      buildTreeBoundCurrentView({
        repository: 'MirrorCartographer/MirrorCartographer',
        commitSha: fixture.commitSha,
        cwd: fixture.cwd
      })
    );
  } finally {
    await rm(fixture.cwd, { recursive: true, force: true });
  }
});

test('rejects a commit identity that is not present in the local repository', async () => {
  const fixture = await makeRepository();
  try {
    await assert.rejects(
      buildTreeBoundCurrentView({
        repository: 'MirrorCartographer/MirrorCartographer',
        commitSha: '0000000000000000000000000000000000000000',
        cwd: fixture.cwd
      })
    );
  } finally {
    await rm(fixture.cwd, { recursive: true, force: true });
  }
});
