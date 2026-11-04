import assert from 'node:assert/strict';
import test from 'node:test';
import {
  enumerateQueueUpdatePaths,
  materializeFromRepositoryTree,
  reduceOwnedCurrentView
} from './repository-tree-current-view.mjs';

const canonicalQueue = {
  items: [
    { id: 'M-001', owner: 'continuity_mining', status: 'completed', action: 'Build index' },
    { id: 'V-001', owner: 'vercel_studio', status: 'active', action: 'Audio' }
  ]
};

const files = {
  'operations/queue-updates/M-003.json': {
    sha: 'sha-m3',
    content: JSON.stringify({
      queue_item: 'M-003', owner: 'continuity_mining', status: 'completed',
      completed_at: '2026-07-12T00:29:26Z', action: 'Decision chain'
    })
  },
  'operations/queue-updates/V-002.json': {
    sha: 'sha-v2',
    content: JSON.stringify({
      queue_item: 'V-002', owner: 'vercel_studio', status: 'completed',
      completed_at: '2026-07-12T00:20:00Z', action: 'Other team'
    })
  },
  'operations/queue-updates/M-002.json': {
    sha: 'sha-m2',
    content: JSON.stringify({
      queue_item: 'M-002', owner: 'continuity_mining', status: 'completed',
      completed_at: '2026-07-12T00:23:06Z', action: 'Commit history'
    })
  }
};

const tree = {
  sha: 'recursive-tree-sha',
  truncated: false,
  tree: [
    { type: 'blob', path: 'README.md' },
    { type: 'blob', path: 'operations/queue-updates/M-003.json' },
    { type: 'tree', path: 'operations/queue-updates' },
    { type: 'blob', path: 'operations/queue-updates/V-002.json' },
    { type: 'blob', path: 'operations/queue-updates/M-002.json' }
  ]
};

test('enumerates every queue-update blob in lexical path order', () => {
  assert.deepEqual(enumerateQueueUpdatePaths(tree), [
    'operations/queue-updates/M-002.json',
    'operations/queue-updates/M-003.json',
    'operations/queue-updates/V-002.json'
  ]);
});

test('rejects a truncated recursive tree rather than claiming completeness', () => {
  assert.throws(
    () => enumerateQueueUpdatePaths({ ...tree, truncated: true }),
    /completeness cannot be claimed/
  );
});

test('materializes only owned state while proving all enumerated paths were fetched', async () => {
  const result = await materializeFromRepositoryTree({
    tree,
    canonicalQueue,
    owner: 'continuity_mining',
    fetchDocument: async (path) => files[path]
  });
  assert.equal(result.completeness_verified, true);
  assert.equal(result.enumerated_path_count, 3);
  assert.equal(result.fetched_path_count, 3);
  assert.deepEqual(result.current_view.items.map((item) => item.id), ['M-001', 'M-002', 'M-003']);
  assert.deepEqual(result.current_view.applied_updates.map((item) => item.queue_item), ['M-002', 'M-003']);
});

test('orders same-time updates deterministically and rejects duplicate identities', () => {
  const base = {
    queue_item: 'M-010', owner: 'continuity_mining', status: 'completed',
    completed_at: '2026-07-12T01:00:00Z'
  };
  assert.throws(() => reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'continuity_mining',
    updateDocuments: [
      { path: 'operations/queue-updates/a.json', document: base },
      { path: 'operations/queue-updates/b.json', document: { ...base } }
    ]
  }), /duplicate continuity update identity/);
});

test('fails closed when an enumerated file cannot be parsed', async () => {
  await assert.rejects(
    materializeFromRepositoryTree({
      tree: { sha: 'x', truncated: false, tree: [{ type: 'blob', path: 'operations/queue-updates/bad.json' }] },
      canonicalQueue,
      owner: 'continuity_mining',
      fetchDocument: async () => ({ sha: 'bad', content: '{' })
    }),
    /invalid JSON/
  );
});

 
test('accepts updated_at for blocked work but requires completed_at for completed work', () => {
  const blocked = {
    queue_item: 'C-001', owner: 'cloudflare_research', status: 'blocked_external_configuration',
    updated_at: '2026-07-11T17:07:00-04:00'
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001.json', document: blocked }]
  });
  assert.equal(view.items[0].status, 'blocked_external_configuration');
  assert.equal(view.items[0].updated_at, blocked.updated_at);
  assert.equal('completed_at' in view.items[0], false);
  assert.throws(() => reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-002.json', document: {
      queue_item: 'C-002', owner: 'cloudflare_research', status: 'completed',
      updated_at: '2026-07-11T17:07:00-04:00'
    }}]
  }), /missing completed_at/);
});

 
test('derives an update timestamp from the immutable filename for blocked records', () => {
  const blocked = {
    queue_item: 'C-001', owner: 'cloudflare_research', status: 'blocked_external_configuration'
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'cloudflare_research',
    updateDocuments: [{
      path: 'operations/queue-updates/C-001-2026-07-11T1715-0400.json',
      document: blocked
    }]
  });
  assert.equal(view.items[0].updated_at, '2026-07-11T17:15:00-04:00');
  assert.equal(view.items[0].timestamp_source, 'filename');
  assert.equal(view.applied_updates[0].timestamp_source, 'filename');
  assert.throws(() => reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-no-time.json', document: blocked }]
  }), /no timestamp is encoded in the filename/);
});
