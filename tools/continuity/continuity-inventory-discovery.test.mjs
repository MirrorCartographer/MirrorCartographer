import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { discoverContinuityQueueEntries, buildRepositoryContinuityInventory } from './continuity-inventory-discovery.mjs';

const root = await mkdtemp(path.join(os.tmpdir(), 'continuity-discovery-'));
try {
  const queueDir = path.join(root, 'operations', 'queue-updates');
  await mkdir(queueDir, { recursive: true });
  await writeFile(path.join(queueDir, 'M-002-later.json'), JSON.stringify({ id: 'M-002' }));
  await writeFile(path.join(queueDir, 'M-001-first.json'), JSON.stringify({ id: 'M-001' }));
  await writeFile(path.join(queueDir, 'C-001-ignore.json'), JSON.stringify({ id: 'C-001' }));
  await writeFile(path.join(queueDir, 'M-not-numeric.json'), '{}');

  const entries = await discoverContinuityQueueEntries(root);
  assert.deepEqual(entries.map((entry) => entry.path), [
    'operations/queue-updates/M-001-first.json',
    'operations/queue-updates/M-002-later.json',
  ]);

  const report = await buildRepositoryContinuityInventory(root, (supplied, generatedAt) => ({
    valid: true,
    generated_at: generatedAt,
    ids: supplied.map((entry) => JSON.parse(entry.content).id),
  }), '2026-07-11T23:24:00-04:00');
  assert.deepEqual(report.ids, ['M-001', 'M-002']);
  assert.equal(report.discovery.discovered_count, 2);
  assert.equal(report.discovery.history_modified, false);

  await assert.rejects(
    buildRepositoryContinuityInventory(root, null),
    /composeReport must be a function/,
  );

  console.log('continuity inventory discovery: 3 checks passed');
} finally {
  await rm(root, { recursive: true, force: true });
}
