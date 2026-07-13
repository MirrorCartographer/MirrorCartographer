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

function fixture(indexRecords, additive={}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'continuity-'));
  const dir = path.join(root, 'records'); fs.mkdirSync(dir);
  const index = path.join(root, 'index.json');
  fs.writeFileSync(index, JSON.stringify({records:indexRecords}));
  for (const [name, value] of Object.entries(additive)) fs.writeFileSync(path.join(dir, name), JSON.stringify(value));
  return { indexFile:index, recordsDir:dir };
}

test('accepts unique linked records', () => {
  const f = fixture([record('CM-0001')], {'CM-0002.json':record('CM-0002',{supersedes:['CM-0001']})});
  const out = validateContinuity(f);
  assert.equal(out.ok, true); assert.equal(out.records_checked, 2);
});

test('rejects duplicate IDs across index and additive records', () => {
  const out = validateContinuity(fixture([record('CM-0001')], {'duplicate.json':record('CM-0001')}));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /duplicate id CM-0001/);
});

test('rejects broken contradiction and supersession references', () => {
  const out = validateContinuity(fixture([record('CM-0001',{contradicts:['CM-9998'],supersedes:['CM-9999']})]));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /missing CM-9998/); assert.match(out.errors.join('\n'), /missing CM-9999/);
});

test('requires superseded claims to identify what they supersede', () => {
  const out = validateContinuity(fixture([record('CM-0001',{claim_state:'superseded'})]));
  assert.equal(out.ok, false); assert.match(out.errors.join('\n'), /requires at least one supersedes target/);
});
