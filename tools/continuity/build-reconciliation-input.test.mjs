import assert from 'node:assert/strict';
import { buildReconciliationInput } from './build-reconciliation-input.mjs';

const aggregate = { id:'M-002', owner:'continuity_mining', status:'active', required_evidence:['implementation module'] };
const commit = 'a'.repeat(40);
const updatePath = 'operations/queue-updates/M-002-test.json';
const evidencePath = 'operations/evidence/M-002-test.json';

{
  const result = buildReconciliationInput({
    aggregate,
    commits:[commit],
    records:[
      {path:updatePath,blob_sha:'b'.repeat(40),content:{record_id:'u1',queue_item:'M-002',owner:'continuity_mining',recorded_at:'2026-07-11T20:00:00-04:00',claim_state:'observed',status:'active',source_commits:[commit],evidence_paths:[evidencePath]}},
      {path:evidencePath,blob_sha:'c'.repeat(40),content:{record_id:'e1'}}
    ]
  });
  assert.equal(result.updates.length,1);
  assert.deepEqual(result.resolvableCommits,[commit]);
  assert.deepEqual(result.resolvableEvidencePaths,[evidencePath]);
  assert.equal(result.mutation_performed,false);
}

{
  const result = buildReconciliationInput({aggregate,commits:[],records:[{path:updatePath,blob_sha:'b'.repeat(40),content:{queue_item:'M-002',source_commits:[commit],evidence_paths:['operations/evidence/missing.json']}}]});
  assert.deepEqual(result.unresolvableCommits,[commit]);
  assert.deepEqual(result.unresolvableEvidencePaths,['operations/evidence/missing.json']);
}

{
  const result = buildReconciliationInput({aggregate,records:[{path:'operations/queue-updates/V-001-test.json',blob_sha:'d'.repeat(40),content:{queue_item:'V-001'}}]});
  assert.equal(result.updates.length,0);
  assert.equal(result.ignoredRecords[0].reason,'different_queue_item');
}

assert.throws(() => buildReconciliationInput({aggregate,records:[{path:'private/chat.json',blob_sha:'e'.repeat(40),content:{}}]}),/outside continuity-safe roots/);
assert.throws(() => buildReconciliationInput({aggregate,records:[{path:updatePath,blob_sha:'short',content:{}}]}),/blob_sha/);

console.log('build-reconciliation-input: 5 tests passed');
