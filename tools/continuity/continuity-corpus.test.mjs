import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContinuity } from './validate-continuity-records.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const indexFile = path.join(root, 'operations/continuity/continuity-index.json');
const recordsDir = path.join(root, 'operations/continuity/records');
const idPattern = /^CM-\d{4}$/;

function loadCorpusRecords() {
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const additive = fs.existsSync(recordsDir)
    ? fs.readdirSync(recordsDir)
        .filter(name => name.endsWith('.json'))
        .sort()
        .map(name => {
          const raw = JSON.parse(fs.readFileSync(path.join(recordsDir, name), 'utf8'));
          return raw.id ? raw : raw.record;
        })
    : [];
  return [...(index.records ?? []), ...additive];
}

test('committed continuity corpus passes the aggregate validator', () => {
  const result = validateContinuity({ indexFile, recordsDir });
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.relation_integrity?.relation_integrity, 'verified');
  assert.ok(result.ids.includes('CM-1000'));
  assert.ok(result.ids.includes('CM-1001'));
  assert.ok(result.ids.includes('CM-1002'));
});

test('committed machine-relation arrays contain only resolvable CM record IDs', () => {
  const records = loadCorpusRecords();
  const ids = new Set(records.map(record => record.id));
  for (const record of records) {
    for (const relation of ['contradicts', 'supersedes']) {
      for (const target of record[relation] ?? []) {
        assert.equal(typeof target, 'string', `${record.id}.${relation} target must be a string`);
        assert.match(target, idPattern, `${record.id}.${relation} contains non-ID prose: ${target}`);
        assert.ok(ids.has(target), `${record.id}.${relation} references missing ${target}`);
      }
    }
  }
});
