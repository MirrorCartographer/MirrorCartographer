import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTreeBoundCurrentView } from './github-tree-current-view.mjs';

const enc = (value) => Buffer.from(JSON.stringify(value)).toString('base64');

function makeFetch({ truncated = false, badUpdate = false } = {}) {
  const update = badUpdate
    ? '{not-json'
    : JSON.stringify({
        queue_item: 'M-006',
        owner: 'continuity_mining',
        status: 'completed',
        completed_at: '2026-07-12T00:48:47Z',
        action: 'Prove repository-tree completeness'
      });
  return async (url) => {
    let body;
    if (url.includes('/git/commits/')) body = { tree: { sha: 'tree-root' } };
    else if (url.includes('/git/trees/')) body = {
      sha: 'tree-recursive',
      truncated,
      tree: [{ type: 'blob', path: 'operations/queue-updates/M-006.json' }]
    };
    else if (url.includes('operations/ACTIVE_QUEUE.json')) body = {
      sha: 'queue-blob',
      content: enc({ items: [{ id: 'M-001', owner: 'continuity_mining', status: 'completed', action: 'Build index' }] })
    };
    else if (url.includes('operations/queue-updates/M-006.json')) body = {
      sha: 'update-blob',
      content: Buffer.from(update).toString('base64')
    };
    else return new Response('{}', { status: 404 });
    return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
  };
}

const input = {
  repository: 'MirrorCartographer/MirrorCartographer',
  commitSha: 'abc123',
  token: 'test-token'
};

test('binds a complete current view to commit and recursive tree identities', async () => {
  const manifest = await buildTreeBoundCurrentView({ ...input, fetchImpl: makeFetch() });
  assert.equal(manifest.commit_sha, 'abc123');
  assert.equal(manifest.commit_tree_sha, 'tree-root');
  assert.equal(manifest.recursive_tree_sha, 'tree-recursive');
  assert.equal(manifest.completeness_verified, true);
  assert.equal(manifest.enumerated_path_count, 1);
  assert.equal(manifest.current_view.items.find((item) => item.id === 'M-006').source_blob_sha, 'update-blob');
});

test('rejects a truncated recursive tree', async () => {
  await assert.rejects(
    buildTreeBoundCurrentView({ ...input, fetchImpl: makeFetch({ truncated: true }) }),
    /truncated/
  );
});

test('rejects an invalid queue update instead of silently omitting it', async () => {
  await assert.rejects(
    buildTreeBoundCurrentView({ ...input, fetchImpl: makeFetch({ badUpdate: true }) }),
    /invalid JSON/
  );
});

test('rejects failed GitHub API responses', async () => {
  const failingFetch = async () => new Response('{}', { status: 403 });
  await assert.rejects(
    buildTreeBoundCurrentView({ ...input, fetchImpl: failingFetch }),
    /GitHub API 403/
  );
});
