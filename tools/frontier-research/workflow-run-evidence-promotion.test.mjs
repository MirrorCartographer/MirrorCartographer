import assert from 'node:assert/strict';
import test from 'node:test';
import { promoteWorkflowRunEvidence } from './workflow-run-evidence-promotion.mjs';

const SHA = 'a'.repeat(40);
const run = (id, head_sha = SHA) => ({ id, head_sha });
const page = ({ number, total, runs, link = '' }) => ({
  page: number,
  total_count: total,
  workflow_runs: runs,
  link
});

test('promotes exact-SHA complete evidence', () => {
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [page({ number: 1, total: 2, runs: [run(1), run(2)] })]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'workflow_run_evidence_promotable');
  assert.equal(result.completeness_claim_allowed, true);
  assert.equal(result.absence_claim_allowed, false);
});

test('permits bounded absence only below provider cap', () => {
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [page({ number: 1, total: 0, runs: [] })]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.absence_claim_allowed, true);
});

test('rejects foreign SHA rows before promotion', () => {
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [page({ number: 1, total: 1, runs: [run(1, 'b'.repeat(40))] })]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'enumeration_integrity_not_proven');
  assert.equal(result.details.integrity.reason, 'foreign_head_sha');
});

test('rejects retained count mismatch', () => {
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [page({ number: 1, total: 2, runs: [run(1)] })]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.details.integrity.reason, 'retained_count_mismatch');
});

test('preserves provider cap and forbids completeness claim', () => {
  const runs = Array.from({ length: 1000 }, (_, index) => run(index + 1));
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [page({ number: 1, total: 1001, runs })]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'workflow_run_evidence_promotable_with_provider_cap');
  assert.equal(result.completeness_claim_allowed, false);
  assert.equal(result.absence_claim_allowed, false);
});

test('rejects non-contiguous retained pages', () => {
  const result = promoteWorkflowRunEvidence({
    commitSha: SHA,
    pages: [
      page({ number: 1, total: 2, runs: [run(1)], link: '<https://api.github.com/example?page=2>; rel="next"' }),
      page({ number: 3, total: 2, runs: [run(2)] })
    ]
  });
  assert.equal(result.accepted, false);
  assert.equal(result.details.integrity.reason, 'page_sequence_gap');
});
