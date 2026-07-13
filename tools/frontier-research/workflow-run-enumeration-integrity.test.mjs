import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyWorkflowRunEnumeration } from './workflow-run-enumeration-integrity.mjs';

const sha = 'a'.repeat(40);
const run = (id, headSha = sha) => ({ id, head_sha: headSha });

test('accepts contiguous exact-sha pages with one terminal page', () => {
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: [
      { page: 1, total_count: 3, workflow_runs: [run(1), run(2)], link: '<https://api.github.com/x?page=2>; rel="next"' },
      { page: 2, total_count: 3, workflow_runs: [run(3)], link: '<https://api.github.com/x?page=1>; rel="prev"' }
    ]
  });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'enumeration_integrity_proven');
  assert.equal(result.retained_run_count, 3);
});

test('rejects a foreign head sha', () => {
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: [{ page: 1, total_count: 1, workflow_runs: [run(9, 'b'.repeat(40))], link: '' }]
  });
  assert.equal(result.reason, 'foreign_head_sha');
});

test('rejects duplicate run ids across pages', () => {
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: [
      { page: 1, total_count: 2, workflow_runs: [run(1)], link: '<https://api.github.com/x?page=2>; rel="next"' },
      { page: 2, total_count: 2, workflow_runs: [run(1)], link: '' }
    ]
  });
  assert.equal(result.reason, 'duplicate_run_id');
});

test('rejects total count drift', () => {
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: [
      { page: 1, total_count: 2, workflow_runs: [run(1)], link: '<https://api.github.com/x?page=2>; rel="next"' },
      { page: 2, total_count: 3, workflow_runs: [run(2)], link: '' }
    ]
  });
  assert.equal(result.reason, 'total_count_drift');
});

test('rejects a retained count mismatch below provider cap', () => {
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: [{ page: 1, total_count: 2, workflow_runs: [run(1)], link: '' }]
  });
  assert.equal(result.reason, 'retained_count_mismatch');
});

test('preserves the 1000-result provider cap as a limitation', () => {
  const runs = Array.from({ length: 1000 }, (_, index) => run(index + 1));
  const result = classifyWorkflowRunEnumeration({
    commitSha: sha,
    pages: Array.from({ length: 10 }, (_, index) => ({
      page: index + 1,
      total_count: 1001,
      workflow_runs: runs.slice(index * 100, (index + 1) * 100),
      link: index < 9 ? `<https://api.github.com/x?page=${index + 2}>; rel="next"` : ''
    }))
  });
  assert.equal(result.accepted, true);
  assert.equal(result.classification, 'enumeration_integrity_proven_with_provider_cap');
  assert.deepEqual(result.limitations, ['github_filtered_search_cap_1000_results']);
});
