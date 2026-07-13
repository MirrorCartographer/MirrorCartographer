import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildQueueMaterializationCandidate, discoverQueueProjections } from './queue-projection-loader.mjs';

async function makeRepository() {
  const root = await mkdtemp(join(tmpdir(), 'mc-queue-loader-'));
  await mkdir(join(root, 'operations', 'queue-updates'), { recursive: true });
  await mkdir(join(root, 'operations', 'evidence'), { recursive: true });
  await writeFile(join(root, 'operations', 'evidence', 'proof.json'), '{}\n');
  await writeFile(join(root, 'operations', 'ACTIVE_QUEUE.json'), JSON.stringify({
    schema_version: '1.0.0',
    items: [{
      id: 'M-100',
      owner: 'continuity_mining',
      status: 'active',
      required_evidence: ['implementation']
    }]
  }));
  spawnSync('git', ['init'], { cwd: root });
  spawnSync('git', ['config', 'user.email', 'continuity@example.invalid'], { cwd: root });
  spawnSync('git', ['config', 'user.name', 'Continuity Test'], { cwd: root });
  spawnSync('git', ['add', '.'], { cwd: root });
  spawnSync('git', ['commit', '-m', 'fixture'], { cwd: root });
  const sha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
  return { root, sha };
}

function projection({ sha, queueItem = 'M-100', recordId = 'M-100-a', status = 'completed' }) {
  return {
    schema_version: '1.0.0',
    record_id: recordId,
    queue_item: queueItem,
    owner: 'continuity_mining',
    recorded_at: '2026-07-13T02:00:00Z',
    claim_state: 'observed',
    status,
    source_commits: [sha],
    evidence_paths: ['operations/evidence/proof.json'],
    evidence_types: ['implementation']
  };
}

test('discovers JSON projections and records malformed files without throwing', async () => {
  const { root, sha } = await makeRepository();
  await writeFile(join(root, 'operations', 'queue-updates', 'valid.json'), JSON.stringify(projection({ sha })));
  await writeFile(join(root, 'operations', 'queue-updates', 'broken.json'), '{');
  await writeFile(join(root, 'operations', 'queue-updates', 'ignored.txt'), 'not a projection');

  const result = await discoverQueueProjections({ repositoryRoot: root });
  assert.equal(result.projections.length, 1);
  assert.equal(result.rejected_files.length, 1);
  assert.deepEqual(result.rejected_files[0].rejection_reasons, ['invalid_projection_file']);
});

test('permits a fully resolvable projection while preserving no-mutation semantics', async () => {
  const { root, sha } = await makeRepository();
  await writeFile(join(root, 'operations', 'queue-updates', 'valid.json'), JSON.stringify(projection({ sha })));

  const result = await buildQueueMaterializationCandidate({ repositoryRoot: root });
  assert.equal(result.materialization_allowed, true);
  assert.equal(result.mutation_performed, false);
  assert.equal(result.items[0].effective_status, 'completed');
  assert.equal(result.items[0].required_evidence_complete, true);
});

test('fails closed when a projection references an unknown commit', async () => {
  const { root } = await makeRepository();
  await writeFile(join(root, 'operations', 'queue-updates', 'unknown.json'), JSON.stringify(projection({ sha: 'a'.repeat(40) })));

  const result = await buildQueueMaterializationCandidate({ repositoryRoot: root });
  assert.equal(result.materialization_allowed, false);
  assert.deepEqual(result.items[0].rejected_updates[0].rejection_reasons, ['unresolvable_commit']);
});

test('fails closed and preserves orphan projections whose item is absent from the canonical queue', async () => {
  const { root, sha } = await makeRepository();
  await writeFile(join(root, 'operations', 'queue-updates', 'orphan.json'), JSON.stringify(projection({ sha, queueItem: 'M-999' })));

  const result = await buildQueueMaterializationCandidate({ repositoryRoot: root });
  assert.equal(result.materialization_allowed, false);
  assert.equal(result.orphan_projections.length, 1);
  assert.deepEqual(result.orphan_projections[0].rejection_reasons, ['queue_item_not_in_canonical_queue']);
});

test('fails closed when an evidence path escapes or does not resolve to a file', async () => {
  const { root, sha } = await makeRepository();
  const record = projection({ sha });
  record.evidence_paths = ['../private-chat.json'];
  await writeFile(join(root, 'operations', 'queue-updates', 'escape.json'), JSON.stringify(record));

  const result = await buildQueueMaterializationCandidate({ repositoryRoot: root });
  assert.equal(result.materialization_allowed, false);
  assert.deepEqual(result.items[0].rejected_updates[0].rejection_reasons, ['unresolvable_evidence']);
});
