import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateContinuity } from './validate-continuity-records.mjs';

const source = { type:'github_commit', locator:'abc', content_sha:'abc' };
const record = (id, patch={}) => ({
  id, kind:'decision', title:id, claim_state:'observed',
  evidence_strength:'primary_repository_source', sources:[source], summary:'x',
  privacy:'public_repository_safe', contradicts:[], supersedes:[],
  falsification_or_review_route:'fetch source', ...patch
});

function fixture(indexRecords, additive={}, memory={}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'continuity-'));
  const recordsDir = path.join(root, 'records'); fs.mkdirSync(recordsDir);
  const memoryDir = path.join(root, 'memory'); fs.mkdirSync(memoryDir);
  const indexFile = path.join(root, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify({records:indexRecords}));
  for (const [name, value] of Object.entries(additive)) fs.writeFileSync(path.join(recordsDir, name), JSON.stringify(value));
  for (const [name, value] of Object.entries(memory)) fs.writeFileSync(path.join(memoryDir, name), JSON.stringify(value));
  return { indexFile, recordsDir, memoryDir };
}

function validateFixture(f) {
  return validateContinuity({ indexFile:f.indexFile, recordDirs:[f.recordsDir, f.memoryDir] });
}

test('accepts unique linked records and returns relation summary', () => {
  const f = fixture([record('CM-0001')], {'CM-0002.json':record('CM-0002',{supersedes:['CM-0001']})});
  const out = validateFixture(f);
  assert.equal(out.ok, true);
  assert.equal(out.records_checked, 2);
  assert.equal(out.scanned_roots.length, 2);
  assert.equal(out.relation_integrity.relation_integrity, 'verified');
  assert.equal(out.relation_integrity.supersession_edges, 1);
});

test('preserves the legacy recordsDir interface', () => {
  const f = fixture([record('CM-0001')], {'CM-0002.json':record('CM-0002')});
  const out = validateContinuity({ indexFile:f.indexFile, recordsDir:f.recordsDir });
  assert.equal(out.ok, true);
  assert.equal(out.records_checked, 2);
  assert.equal(out.scanned_roots.length, 1);
});

test('rejects duplicate IDs across index and additive records', () => {
  const out = validateFixture(fixture([record('CM-0001')], {'duplicate.json':record('CM-0001')}));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /duplicate id CM-0001/);
});

test('rejects duplicate IDs across sanctioned storage roots', () => {
  const out = validateFixture(fixture([], {'history.json':record('CM-0010')}, {'layered.json':record('CM-0010')}));
  assert.equal(out.ok, false);
  assert.match(out.errors.join('\n'), /memory.*duplicate id CM-0010.*records/s);
});

test('rejects broken contradiction and supersession references', () => {
  const out = validateFixture(fixture([record('CM-0001',{contradicts:['CM-9998'],supersedes:['CM-9999']})]));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /missing CM-9998/); assert.match(out.errors.join('\n'), /missing CM-9999/);
});

test('requires superseded claims to identify what they supersede', () => {
  const out = validateFixture(fixture([record('CM-0001',{claim_state:'superseded'})]));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /requires at least one supersedes target/);
});

test('rejects duplicate relation targets in the aggregate gate', () => {
  const out = validateFixture(fixture([
    record('CM-0001'),
    record('CM-0002',{contradicts:['CM-0001','CM-0001']})
  ]));
  assert.equal(out.ok, false);
  assert.match(out.errors.join('\n'), /duplicate target: CM-0001/);
});

test('rejects supersession cycles in the aggregate gate', () => {
  const out = validateFixture(fixture([
    record('CM-0001',{supersedes:['CM-0002']}),
    record('CM-0002',{supersedes:['CM-0001']})
  ]));
  assert.equal(out.ok, false);
  assert.match(out.errors.join('\n'), /supersedes cycle/);
});
