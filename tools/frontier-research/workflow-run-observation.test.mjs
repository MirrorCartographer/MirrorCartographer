import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyWorkflowRunObservation } from './workflow-run-observation.mjs';

const sha = 'e35a5e264d6d4f0535d236c6f0b17f2813efa665';

test('accepts an exact observed run while retaining query limits', () => {
  const result = classifyWorkflowRunObservation({
    commitSha: sha,
    runs: [{ head_sha: sha, id: 1 }],
    query: { head_sha: sha, per_page: 100 },
    source: { completePagination: true }
  });
  assert.equal(result.state, 'observed_exact_run');
  assert.equal(result.evidenceStrength, 'strong');
});

test('empty first-page event-filtered connector result is indeterminate', () => {
  const result = classifyWorkflowRunObservation({
    commitSha: sha,
    runs: [],
    query: { head_sha: sha, per_page: 30 },
    source: { firstPageOnly: true, eventFiltered: true, completePagination: false }
  });
  assert.equal(result.state, 'indeterminate_incomplete_observation');
  assert.ok(result.limitations.includes('first_page_only'));
  assert.ok(result.limitations.includes('event_filtered'));
});

test('complete exact-commit query can state only bounded no-match', () => {
  const result = classifyWorkflowRunObservation({
    commitSha: sha,
    runs: [],
    query: { head_sha: sha, per_page: 100 },
    source: { completePagination: true }
  });
  assert.equal(result.state, 'bounded_no_match');
  assert.deepEqual(result.limitations, ['github_filtered_search_cap_1000_results']);
});

test('rejects malformed commit identity', () => {
  assert.throws(() => classifyWorkflowRunObservation({ commitSha: 'abc', runs: [] }), /40-character/);
});
