import assert from 'node:assert/strict';
import test from 'node:test';
import { buildQueueUpdateDiscoveryManifest } from './queue-update-discovery-manifest.mjs';

const sha = char => char.repeat(40);
const content = (id = 'M-006', owner = 'continuity_mining') => JSON.stringify({
  created_at: '2026-07-12T16:03:24-04:00',
  queue_item: { id, owner }
});

function candidate(overrides = {}) {
  return {
    path: 'operations/queue-updates/M-006-2026-07-12T1603-0400.json',
    blob_sha: sha('a'),
    commit: sha('b'),
    content: content(),
    file_verified: true,
    commit_verified: true,
    ...overrides
  };
}

test('emits exact inventory entries with retained provenance', () => {
  const result = buildQueueUpdateDiscoveryManifest([candidate()], {
    expected_paths: ['operations/queue-updates/M-006-2026-07-12T1603-0400.json']
  });
  assert.equal(result.complete, true);
  assert.deepEqual(result.entries, [{
    path: candidate().path,
    commit: sha('b'),
    content: content()
  }]);
  assert.equal(result.provenance[0].blob_sha, sha('a'));
});

test('reports expected records that were not discovered', () => {
  const result = buildQueueUpdateDiscoveryManifest([], {
    expected_paths: ['operations/queue-updates/M-005-2026-07-12T1557-0400.json']
  });
  assert.equal(result.complete, false);
  assert.equal(result.missing.length, 1);
});

test('rejects unverified file bytes', () => {
  const result = buildQueueUpdateDiscoveryManifest([candidate({ file_verified: false })]);
  assert.equal(result.entries.length, 0);
  assert.match(result.rejected[0].reason, /file bytes not verified/);
});

test('rejects unverified commits', () => {
  const result = buildQueueUpdateDiscoveryManifest([candidate({ commit_verified: false })]);
  assert.match(result.rejected[0].reason, /commit not verified/);
});

test('reports duplicate paths without silently replacing the first record', () => {
  const result = buildQueueUpdateDiscoveryManifest([
    candidate(),
    candidate({ blob_sha: sha('c'), commit: sha('d') })
  ]);
  assert.equal(result.entries.length, 1);
  assert.equal(result.duplicates[0].kind, 'path');
});

test('reports identical blobs presented under multiple paths', () => {
  const result = buildQueueUpdateDiscoveryManifest([
    candidate(),
    candidate({
      path: 'operations/queue-updates/M-007-2026-07-12T1604-0400.json',
      commit: sha('d'),
      content: content('M-007')
    })
  ]);
  assert.equal(result.entries.length, 1);
  assert.equal(result.duplicates[0].kind, 'blob_sha');
});
