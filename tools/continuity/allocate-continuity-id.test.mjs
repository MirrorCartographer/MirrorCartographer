import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { allocateContinuityId } from './allocate-continuity-id.mjs';

function record(id) {
  return {
    id,
    kind: 'decision',
    title: id,
    claim_state: 'observed',
    evidence_strength: 'primary_repository_source',
    sources: [{ type: 'github_file', locator: 'fixture', content_sha: 'fixture' }],
    summary: 'fixture',
    privacy: 'public_repository_safe',
    falsification_or_review_route: 'inspect fixture'
  };
}

function fixture(indexIds = [], recordIds = [], memoryIds = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'continuity-allocation-'));
  const recordsDir = path.join(root, 'records');
  const memoryDir = path.join(root, 'memory');
  fs.mkdirSync(recordsDir);
  fs.mkdirSync(memoryDir);
  const indexFile = path.join(root, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify({ records: indexIds.map(record) }));
  recordIds.forEach((id, index) => fs.writeFileSync(path.join(recordsDir, `${index}.json`), JSON.stringify(record(id))));
  memoryIds.forEach((id, index) => fs.writeFileSync(path.join(memoryDir, `${index}.json`), JSON.stringify(record(id))));
  return { indexFile, recordDirs: [recordsDir, memoryDir] };
}

test('allocates the next monotonic repository-wide ID', () => {
  const result = allocateContinuityId(fixture(['CM-0001'], ['CM-0010'], ['CM-0013']));
  assert.equal(result.ok, true);
  assert.equal(result.allocated_id, 'CM-0014');
  assert.equal(result.allocation, 'next_monotonic');
});

test('accepts an explicitly requested free ID', () => {
  const result = allocateContinuityId({ ...fixture(['CM-0001']), requestedId: 'CM-0042' });
  assert.equal(result.ok, true);
  assert.equal(result.allocated_id, 'CM-0042');
  assert.equal(result.allocation, 'requested');
});

test('rejects an explicitly requested occupied ID with provenance', () => {
  const result = allocateContinuityId({ ...fixture([], [], ['CM-0013']), requestedId: 'CM-0013' });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'requested_id_occupied');
  assert.equal(result.occupied_at.length, 1);
});

test('fails closed when the existing namespace already contains a collision', () => {
  const result = allocateContinuityId(fixture([], ['CM-0010'], ['CM-0010']));
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'existing_namespace_collision');
  assert.deepEqual(result.duplicate_ids.map(entry => entry.id), ['CM-0010']);
});

test('rejects malformed requested IDs', () => {
  const result = allocateContinuityId({ ...fixture([]), requestedId: 'CM-14' });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'invalid_requested_id');
});
