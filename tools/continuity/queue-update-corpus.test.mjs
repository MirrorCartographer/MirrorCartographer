import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildQueueUpdateCorpusReport } from './queue-update-corpus.mjs';

async function makeDir() {
  return mkdtemp(path.join(tmpdir(), 'mc-corpus-'));
}

const conformant = {
  item_id: 'M-1',
  updated_at: '2026-07-12T00:00:00Z',
  owner: 'continuity_mining',
  status: 'completed'
};

test('allows reconciliation only when every file parses and conforms', async () => {
  const rootDir = await makeDir();
  await writeFile(path.join(rootDir, 'a.json'), JSON.stringify(conformant));
  const report = await buildQueueUpdateCorpusReport({
    rootDir,
    generatedAt: '2026-07-12T00:00:00Z',
    sourceCommit: 'abc'
  });
  assert.equal(report.reconciliation_allowed, true);
  assert.equal(report.corpus.parsed_records, 1);
});

test('fails closed on malformed JSON', async () => {
  const rootDir = await makeDir();
  await writeFile(path.join(rootDir, 'bad.json'), '{');
  const report = await buildQueueUpdateCorpusReport({ rootDir });
  assert.equal(report.reconciliation_allowed, false);
  assert.equal(report.blocking[0].classification, 'blocking_parse_failure');
});

test('fails closed on uncovered schema defects', async () => {
  const rootDir = await makeDir();
  await writeFile(path.join(rootDir, 'old.json'), JSON.stringify({ id: 'M-old' }));
  const report = await buildQueueUpdateCorpusReport({ rootDir });
  assert.equal(report.reconciliation_allowed, false);
  assert.equal(report.blocking[0].classification, 'blocking_incompatible');
});

test('accepts only an explicit narrow reviewed exception', async () => {
  const rootDir = await makeDir();
  await writeFile(path.join(rootDir, 'old.json'), JSON.stringify({ id: 'M-old' }));
  const source_path = 'operations/queue-updates/old.json';
  const manifest = {
    exceptions: [{
      source_path,
      allowed_defects: ['missing_or_invalid_timestamp', 'missing_owner', 'missing_status'],
      rationale: 'legacy record retained unchanged',
      reviewed_by: 'continuity_mining',
      replacement_path: 'operations/queue-updates/M-old-replacement.json',
      expires_at: '2099-01-01T00:00:00Z'
    }]
  };
  const report = await buildQueueUpdateCorpusReport({ rootDir, manifest });
  assert.equal(report.reconciliation_allowed, true);
  assert.equal(report.results[0].classification, 'compatible_via_explicit_exception');
});
