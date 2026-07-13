import assert from 'node:assert/strict';
import { reconcileQueueItem } from './queue-reconciler.mjs';

const aggregate = { id:'V-001', owner:'vercel_studio', status:'active', required_evidence:['source commit','deployment identity','phone retest or runtime meter'] };
const base = {queue_item:'V-001',owner:'vercel_studio',claim_state:'observed',source_commits:['abc'],evidence_paths:['e1']};
const resolve = {resolvableCommits:['abc'],resolvableEvidencePaths:['e1']};

{
  const result = reconcileQueueItem({aggregate, updates:[{...base,record_id:'u1',recorded_at:'2026-07-11T19:00:00-04:00',status:'active',evidence_types:['source commit']}],...resolve});
  assert.equal(result.accepted_updates.length,1); assert.equal(result.effective_status,'active'); assert.equal(result.mutation_performed,false); assert.equal(result.materialization_allowed,true);
}
{
  const result = reconcileQueueItem({aggregate, updates:[{...base,record_id:'u2',owner:'cloudflare_research',recorded_at:'2026-07-11T19:01:00-04:00',status:'completed',evidence_types:aggregate.required_evidence}],...resolve});
  assert.deepEqual(result.rejected_updates[0].rejection_reasons,['owner_mismatch']); assert.equal(result.effective_status,'active'); assert.equal(result.materialization_allowed,false);
}
{
  const result = reconcileQueueItem({aggregate, updates:[{...base,record_id:'u3',recorded_at:'2026-07-11T19:02:00-04:00',status:'completed',source_commits:['missing'],evidence_types:aggregate.required_evidence}],resolvableCommits:[],resolvableEvidencePaths:['e1']});
  assert.ok(result.rejected_updates[0].rejection_reasons.includes('unresolvable_commit')); assert.equal(result.required_evidence_complete,false);
}
{
  const result = reconcileQueueItem({aggregate, updates:[{...base,record_id:'u4',recorded_at:'2026-07-11T19:03:00-04:00',status:'completed',evidence_types:['source commit','deployment identity']}],...resolve});
  assert.equal(result.effective_status,'active'); assert.equal(result.required_evidence_complete,false); assert.equal(result.claim_state,'unresolved'); assert.deepEqual(result.unresolved,['completion_claim_not_supported_by_required_evidence']); assert.equal(result.superseded_claims[0].claim,'completed');
}
{
  const result = reconcileQueueItem({aggregate, updates:[{...base,record_id:'u5',recorded_at:'2026-07-11T19:04:00-04:00',status:'completed',evidence_types:aggregate.required_evidence}],...resolve});
  assert.equal(result.effective_status,'completed'); assert.equal(result.required_evidence_complete,true); assert.deepEqual(result.unresolved,[]); assert.deepEqual(result.superseded_claims,[]);
}
{
  const updates = [
    {...base,record_id:'u6',recorded_at:'2026-07-11T19:05:00-04:00',status:'active',evidence_types:['source commit']},
    {...base,record_id:'u6',recorded_at:'2026-07-11T19:06:00-04:00',status:'active',evidence_types:['source commit']}
  ];
  const result = reconcileQueueItem({aggregate,updates,...resolve});
  assert.equal(result.accepted_updates.length,1); assert.ok(result.rejected_updates[0].rejection_reasons.includes('duplicate_record_id'));
}
{
  const updates = [
    {...base,record_id:'u7',recorded_at:'2026-07-11T19:07:00-04:00',status:'active',evidence_types:['source commit']},
    {...base,record_id:'u8',recorded_at:'2026-07-11T19:06:00-04:00',status:'active',evidence_types:['source commit']}
  ];
  const result = reconcileQueueItem({aggregate,updates,...resolve});
  assert.ok(result.rejected_updates[0].rejection_reasons.includes('timestamp_reversal'));
}
{
  const completedAggregate = {...aggregate,status:'completed'};
  const result = reconcileQueueItem({aggregate:completedAggregate,updates:[{...base,record_id:'u9',recorded_at:'2026-07-11T19:08:00-04:00',status:'active',evidence_types:['source commit']}],...resolve});
  assert.ok(result.rejected_updates[0].rejection_reasons.includes('status_regression'));
}
{
  const updates = [
    {...base,record_id:'u10',recorded_at:'2026-07-11T19:09:00-04:00',status:'active',evidence_types:['source commit']},
    {...base,record_id:'u11',recorded_at:'2026-07-11T19:09:00-04:00',status:'blocked',evidence_types:['source commit']}
  ];
  const result = reconcileQueueItem({aggregate,updates,...resolve});
  assert.ok(result.rejected_updates[0].rejection_reasons.includes('conflicting_same_timestamp_projection'));
}

console.log('queue-reconciler: 9 tests passed');
