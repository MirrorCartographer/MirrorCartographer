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
  const completed = reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-002.json', document: {
      queue_item: 'C-002', owner: 'cloudflare_research', status: 'completed',
      updated_at: '2026-07-11T17:07:00-04:00'
    }}]
  });
  assert.equal(completed.items[0].status, 'completed');
  assert.equal(completed.items[0].updated_at, '2026-07-11T17:07:00-04:00');
  assert.equal('completed_at' in completed.items[0], false);
  assert.throws(() => reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-003.json', document: {
      queue_item: 'C-003', owner: 'cloudflare_research', status: 'blocked_external_configuration'
    }}]
  }), /missing event timestamp/);
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

 
test('normalizes legacy item_id and recorded_at fields without changing their provenance', () => {
  const legacy = {
    item_id: 'C-001', owner: 'cloudflare_research',
    status: 'blocked_external_configuration',
    recorded_at: '2026-07-11T18:16:51-04:00'
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue,
    owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-11T1816-0400.json', document: legacy }]
  });
  assert.equal(view.items[0].id, 'C-001');
  assert.equal(view.items[0].updated_at, legacy.recorded_at);
  assert.equal(view.items[0].timestamp_source, 'document');
  assert.equal(view.applied_updates[0].queue_item, 'C-001');
});

 
test('normalizes legacy team ownership without treating other teams as owned', () => {
  const legacy = {
    queue_item: 'C-001', team: 'cloudflare_research', status: 'blocked_external_configuration',
    updated_at: '2026-07-12T05:06:00-04:00'
  };
  const own = reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-12T0506-0400.json', document: legacy }]
  });
  assert.equal(own.items[0].id, 'C-001');
  const other = reduceOwnedCurrentView({
    canonicalQueue, owner: 'continuity_mining',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-12T0506-0400.json', document: legacy }]
  });
  assert.equal(other.items.some(item => item.id === 'C-001'), false);
});

 
test('preserves observed canonical status when legacy updates omit status', () => {
  const observed = {
    queue_item: 'C-001', owner: 'cloudflare_research',
    observed_canonical_status: 'blocked_external_configuration'
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-12T1035-0400.json', document: observed }]
  });
  assert.equal(view.items[0].status, 'blocked_external_configuration');
  assert.equal(view.items[0].status_source, 'observed_canonical_status');
  assert.equal(view.items[0].updated_at, '2026-07-12T10:35:00-04:00');
});

 
test('normalizes nested queue item identity, status, action, and generated timestamp', () => {
  const nested = {
    owner: 'cloudflare_research',
    generated_at: '2026-07-12T23:37:08Z',
    queue_item: {
      id: 'C-001', status: 'blocked_external_configuration',
      action: 'Resolve the deployed Pages hostname'
    }
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-12T2337Z.json', document: nested }]
  });
  assert.equal(view.items[0].id, 'C-001');
  assert.equal(view.items[0].status, 'blocked_external_configuration');
  assert.equal(view.items[0].action, 'Resolve the deployed Pages hostname');
  assert.equal(view.items[0].status_source, 'queue_item.status');
  assert.equal(view.items[0].updated_at, nested.generated_at);
  assert.equal(view.items[0].timestamp_source, 'document');
});


 
test('normalizes canonical_status_observed and projection state from historical updates', () => {
  const legacy = {
    team: 'cloudflare_research',
    queue_item: 'C-001',
    recorded_at: '2026-07-13T00:48:00-04:00',
    canonical_status_observed: 'blocked_external_configuration',
    projection: { status: 'blocked_external_configuration', durable_improvement: 'Integrated replay-ledger evidence.' }
  };
  const view = reduceOwnedCurrentView({
    canonicalQueue, owner: 'cloudflare_research',
    updateDocuments: [{ path: 'operations/queue-updates/C-001-2026-07-13T0048-0400.json', document: legacy }]
  });
  assert.equal(view.items[0].status, 'blocked_external_configuration');
  assert.equal(view.items[0].status_source, 'canonical_status_observed');
  assert.equal(view.items[0].action, 'Integrated replay-ledger evidence.');
});

 
test('aggregates multiple invalid queue-update shapes before failing closed', () => {
  assert.throws(() => reduceOwnedCurrentView({
    canonicalQueue, owner: 'continuity_mining',
    updateDocuments: [
      { path: 'operations/queue-updates/M-998.json', document: { queue_item: 'M-998', owner: 'continuity_mining', status: 'active', updated_at: 'bad-time-one' } },
      { path: 'operations/queue-updates/M-999.json', document: { queue_item: 'M-999', owner: 'continuity_mining', status: 'active', updated_at: 'bad-time-two' } }
    ]
  }), error => {
    assert.match(error.message, /M-998.json: event timestamp is not parseable/);
    assert.match(error.message, /M-999.json: event timestamp is not parseable/);
    return true;
  });
});

 
test('records unattributed paths and refuses a complete current-view claim', async () => {
  const result = await materializeFromRepositoryTree({
    tree: { sha: 'unknown-owner-tree', truncated: false, tree: [
      { type: 'blob', path: 'operations/queue-updates/unknown-event.json' }
    ] },
    canonicalQueue,
    owner: 'continuity_mining',
    fetchDocument: async () => ({ sha: 'unknown-sha', content: JSON.stringify({ queue_item: 'Q-001', status: 'active', updated_at: '2026-07-12T00:00:00Z' }) })
  });
  assert.deepEqual(result.current_view.unattributed_update_paths, ['operations/queue-updates/unknown-event.json']);
  assert.equal(result.completeness_verified, false);
});

 
test('excludes evidence-only and proposed-item records from canonical queue state', () => {
  const result = reduceOwnedCurrentView({
    canonicalQueue, owner: 'continuity_mining',
    updateDocuments: [
      { path: 'operations/queue-updates/CM-010-2026-07-12T1304-0400.json', document: {
        team: 'continuity_mining', id: 'CM-010',
        queue_selection: { selected_item: null, observed_item: 'M-001' },
        status: 'blocked_missing_owned_active_item'
      }},
      { path: 'operations/queue-updates/M-002-2026-07-12T1248-0400.json', document: {
        team: 'continuity_mining', proposed_item: { id: 'M-002', status: 'completed_slice' }
      }}
    ]
  });
  assert.equal(result.applied_updates.length, 0);
  assert.equal(result.excluded_non_queue_update_count, 2);
  assert.equal(result.items.find(item => item.id === 'M-001').status, 'completed');
});

test('keeps progress status separate from canonical queue status', () => {
  const result = reduceOwnedCurrentView({
    canonicalQueue, owner: 'continuity_mining',
    updateDocuments: [{ path: 'operations/queue-updates/M-QUEUE-FRESHNESS-003-2026-07-13T0652-0400.json', document: {
      team: 'continuity_mining', queue_reference: 'M-001',
      update_type: 'handoff_progress', status: 'implemented_local-runtime-verified',
      created_at: '2026-07-13T06:52:00-04:00',
      summary: 'Built the freshness witness validator.'
    }}]
  });
  const item = result.items.find(entry => entry.id === 'M-001');
  assert.equal(item.status, 'completed');
  assert.equal(item.progress_status, 'implemented_local-runtime-verified');
  assert.equal(item.action, 'Built the freshness witness validator.');
});
