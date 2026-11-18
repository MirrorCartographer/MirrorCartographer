import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventoryContinuitySources } from './source-corpus-inventory.mjs';

test('compartments are detected without promoting source bundles to atomic claims', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-source-inventory-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (name, value) => {
    const dest = path.join(root, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(value));
  };
  write('operations/continuity/continuity-index.json', {
    records: [{ id: 'CM-0001', claim_state: 'observed' }]
  });
  write('operations/continuity/records/atomic.json', {
    id: 'CM-0002', claim_state: 'observed',
    supersedes: ['CM-0001:proposed'], summary: 'PRIVATE SOURCE NOT FOR REPORT'
  });
  write('operations/continuity/records/bundle.json', {
    claims: [{ id: 'CM-0002', claim_state: 'observed' }, { id: 'CM-0003', claim_state: 'proposed' }]
  });
  write('operations/continuity/memory/memo.json', {
    record_id: 'CM-0004', memory: { inferred: 'PRIVATE SOURCE NOT FOR REPORT' }
  });
  const report = inventoryContinuitySources(root);
  assert.equal(report.source_count, 4);
  assert.equal(report.source_families.atomic_claim, 1);
  assert.equal(report.source_families.claim_bundle, 1);
  assert.equal(report.source_families.structured_memory, 1);
  assert.equal(report.source_families.claim_index, 1);
  assert.deepEqual(report.collisions.map(x => x.id), ['CM-0002']);
  assert.equal(report.malformed_relation_count, 1);
  assert.equal(report.malformed_relations[0].defect, 'not_canonical_id');
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE SOURCE NOT FOR REPORT|CM-0001:proposed/);
  assert.equal(report.sources.every(x => /^[0-9a-f]{64}$/.test(x.sha256)), true);
});

test('real public corpus includes separate bundles and atomic records', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const report = inventoryContinuitySources(root);
  assert.ok(report.source_count > 10);
  assert.ok(report.source_families.claim_bundle > 0);
  assert.ok(report.source_families.atomic_claim > 0);
  assert.ok(report.collisions.length > 0);
});
