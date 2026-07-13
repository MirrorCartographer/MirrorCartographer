import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildCorpusManifest } from './build-corpus-manifest.mjs';

async function fixture(snapshotRecords, standaloneRecords = []) {
  const dir = await mkdtemp(join(tmpdir(), 'continuity-manifest-'));
  const snapshotPath = join(dir, 'continuity-index.json');
  await writeFile(snapshotPath, JSON.stringify({ generated_at: '2026-07-12T08:04:41Z', records: snapshotRecords }));
  const standalonePaths = [];
  for (const record of standaloneRecords) {
    const path = join(dir, `${record.id}.json`);
    await writeFile(path, JSON.stringify(record));
    standalonePaths.push(path);
  }
  return { snapshotPath, standalonePaths };
}

test('combines snapshot and explicit standalone records without claiming completeness', async () => {
  const input = await fixture([{ id: 'CM-0001' }], [{ id: 'CM-1004' }]);
  const manifest = await buildCorpusManifest({ ...input, generatedAt: '2026-07-13T18:45:00Z' });
  assert.equal(manifest.authoritative, false);
  assert.equal(manifest.completeness, 'bounded_to_explicit_inputs');
  assert.deepEqual(manifest.records.map((record) => record.id), ['CM-0001', 'CM-1004']);
});

test('is deterministic across standalone input order', async () => {
  const input = await fixture([], [{ id: 'CM-1005' }, { id: 'CM-1004' }]);
  const forward = await buildCorpusManifest({ ...input, generatedAt: 'fixed' });
  const reverse = await buildCorpusManifest({ snapshotPath: input.snapshotPath, standalonePaths: [...input.standalonePaths].reverse(), generatedAt: 'fixed' });
  assert.deepEqual(forward, reverse);
});

test('retains duplicate identifiers instead of silently merging records', async () => {
  const input = await fixture([{ id: 'CM-1004' }], [{ id: 'CM-1004' }]);
  const manifest = await buildCorpusManifest({ ...input, generatedAt: 'fixed' });
  assert.deepEqual(manifest.duplicate_ids, ['CM-1004']);
  assert.equal(manifest.records.length, 2);
});

test('rejects malformed record identifiers', async () => {
  const input = await fixture([{ id: 'private-note' }]);
  await assert.rejects(() => buildCorpusManifest({ ...input, generatedAt: 'fixed' }), /invalid record id/);
});
