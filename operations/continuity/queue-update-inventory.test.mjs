import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCanonicalChangeProposal } from './queue-update-inventory.mjs';

const canonicalText = JSON.stringify({ schema_version:'1.0.0', items:[{id:'R-004',owner:'frontier_research',status:'completed',priority:3,action:'x'}] });
const update = (id, status='completed') => ({ path:`operations/queue-updates/${id}.json`, text:JSON.stringify({schema_version:'1.0.0',queue_item:{id,owner:'frontier_research',status,priority:4,action:'y'},canonical_queue_mutated:false}) });

test('discovers missing additive records and emits a digest-bound review-only proposal', () => {
  const result = buildCanonicalChangeProposal({ canonicalText, updates:[update('R-005'), update('R-006')] });
  assert.equal(result.valid, true);
  assert.equal(result.lag.state, 'canonical-lag-observed');
  assert.deepEqual(result.proposal.proposed_items.map(x=>x.id), ['R-005','R-006']);
  assert.match(result.proposal.proposal_sha256, /^[0-9a-f]{64}$/);
  assert.equal(result.proposal.adoption_authorized, false);
  assert.equal(result.proposal.requires_manual_review, true);
});

test('proposal digest changes when an update byte changes', () => {
  const a = buildCanonicalChangeProposal({ canonicalText, updates:[update('R-005')] });
  const changed = update('R-005'); changed.text += '\n';
  const b = buildCanonicalChangeProposal({ canonicalText, updates:[changed] });
  assert.notEqual(a.proposal.proposal_sha256, b.proposal.proposal_sha256);
});

test('rejects conflicting additive records', () => {
  const result = buildCanonicalChangeProposal({ canonicalText, updates:[update('R-005','active'), update('R-005','completed')] });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(','), /conflicting-update-records:R-005/);
});

test('rejects a record that claims canonical mutation', () => {
  const bad = JSON.parse(update('R-005').text); bad.canonical_queue_mutated = true;
  const result = buildCanonicalChangeProposal({ canonicalText, updates:[{path:'operations/queue-updates/R-005.json',text:JSON.stringify(bad)}] });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(','), /non-append-only-update:R-005/);
});

test('rejects malformed update JSON without authorizing adoption', () => {
  const result = buildCanonicalChangeProposal({ canonicalText, updates:[{path:'operations/queue-updates/bad.json',text:'{'}] });
  assert.equal(result.valid, false);
  assert.equal(result.proposal.adoption_authorized, false);
});
