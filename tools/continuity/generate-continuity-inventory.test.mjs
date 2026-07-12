import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { generateContinuityInventory } from './generate-continuity-inventory.mjs';

async function withRepository(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'continuity-inventory-'));
  await mkdir(path.join(root, 'operations', 'queue-updates'), { recursive: true });
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function queueRecord(id, dependencies = []) {
  return JSON.stringify({
    schema_version: '1.0.0',
    id,
    owner: 'continuity_mining',
    priority: 0,
    status: 'completed',
    action: `Complete ${id}`,
    dependencies,
    unresolved_inherited: [],
    resolved_claims: [],
  });
}

test('generates a deterministic repository inventory and writes the requested artifact', async () => {
  await withRepository(async (root) => {
    const queueDir = path.join(root, 'operations', 'queue-updates');
    await writeFile(path.join(queueDir, 'M-002-second.json'), queueRecord('M-002', ['M-001']));
    await writeFile(path.join(queueDir, 'M-001-first.json'), queueRecord('M-001'));
    await writeFile(path.join(queueDir, 'R-001-other-team.json'), queueRecord('R-001'));

    const generatedAt = '2026-07-12T03:33:43.000Z';
    const outputPath = 'continuity-inventory.json';
    const { report, serialized } = await generateContinuityInventory({ rootDir: root, outputPath, generatedAt });

    assert.equal(report.generated_at, generatedAt);
    assert.equal(report.discovery.discovered_count, 2);
    assert.deepEqual(report.discovery.discovered_paths, [
      'operations/queue-updates/M-001-first.json',
      'operations/queue-updates/M-002-second.json',
    ]);
    assert.equal(report.discovery.history_modified, false);
    assert.equal(serialized, await readFile(path.join(root, outputPath), 'utf8'));
    assert.ok(serialized.endsWith('\n'));
  });
});

test('does not write an artifact when outputPath is omitted', async () => {
  await withRepository(async (root) => {
    await writeFile(
      path.join(root, 'operations', 'queue-updates', 'M-001.json'),
      queueRecord('M-001'),
    );

    const { report, serialized } = await generateContinuityInventory({
      rootDir: root,
      generatedAt: '2026-07-12T03:33:43.000Z',
    });

    assert.equal(report.summary.entry_count, 1);
    assert.equal(JSON.parse(serialized).report_type, 'continuity_queue_inventory');
  });
});

test('requires an explicit repository root', async () => {
  await assert.rejects(() => generateContinuityInventory(), /rootDir is required/);
});
