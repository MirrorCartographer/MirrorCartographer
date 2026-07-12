import assert from 'node:assert/strict';
import { reconcileQueueItem } from './queue-reconciler.mjs';

const aggregate = { id:'V-001', owner:'vercel_studio', status:'active', required_evidence:['source commit','deployment identity','phone retest or runtime meter'] };

{
 const result = reconcileQueueItem({aggregate, updates:[{record_id:'u1',queue_item:'V-001',owner:'vercel_studio',recorded_at:'2026-07-11T19:00:00-04:00',claim_state:'observed',status:'active',source_commits:['abc'],evidence_paths:['e1'],evidence_types:['source commit']}],resolvableCommits:['abc'],resolvableEvidencePaths:['e1']});
 assert.equal(result.accepted_updates.length,1); assert.equal(result.effective_status,'active'); assert.equal(result.mutation_performed,false);
}
{
 const result = reconcileQueueItem({aggregate, updates:[{record_id:'u2',queue_item:'V-001',owner:'cloudflare_research',recorded_at:'2026-07-11T19:01:00-04:00',claim_state:'observed',status:'completed',source_commits:['abc'],evidence_paths:['e1'],evidence_types:aggregate.required_evidence}],resolvableCommits:['abc'],resolvableEvidencePaths:['e1']});
 assert.deepEqual(result.rejected_updates[0].rejection_reasons,['owner_mismatch']); assert.equal(result.effective_status,'active');
}
{
 const result = reconcileQueueItem({aggregate, updates:[{record_id:'u3',queue_item:'V-001',owner:'vercel_studio',recorded_at:'2026-07-11T19:02:00-04:00',claim_state:'observed',status:'completed',source_commits:['missing'],evidence_paths:['e1'],evidence_types:aggregate.required_evidence}],resolvableCommits:[],resolvableEvidencePaths:['e1']});
 assert.ok(result.rejected_updates[0].rejection_reasons.includes('unresolvable_commit')); assert.equal(result.required_evidence_complete,false);
}
{
 const result = reconcileQueueItem({aggregate, updates:[{record_id:'u4',queue_item:'V-001',owner:'vercel_studio',recorded_at:'2026-07-11T19:03:00-04:00',claim_state:'observed',status:'completed',source_commits:['abc'],evidence_paths:['e1'],evidence_types:['source commit','deployment identity']}],resolvableCommits:['abc'],resolvableEvidencePaths:['e1']});
 assert.equal(result.effective_status,'active'); assert.equal(result.required_evidence_complete,false); assert.equal(result.claim_state,'unresolved'); assert.deepEqual(result.unresolved,['completion_claim_not_supported_by_required_evidence']); assert.equal(result.superseded_claims[0].claim,'completed');
}
{
 const result = reconcileQueueItem({aggregate, updates:[{record_id:'u5',queue_item:'V-001',owner:'vercel_studio',recorded_at:'2026-07-11T19:04:00-04:00',claim_state:'observed',status:'completed',source_commits:['abc'],evidence_paths:['e1'],evidence_types:aggregate.required_evidence}],resolvableCommits:['abc'],resolvableEvidencePaths:['e1']});
 assert.equal(result.effective_status,'completed'); assert.equal(result.required_evidence_complete,true); assert.deepEqual(result.unresolved,[]); assert.deepEqual(result.superseded_claims,[]);
}
console.log('queue-reconciler: 5 tests passed');
