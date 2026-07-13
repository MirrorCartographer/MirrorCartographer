import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateWorkflowRunPages, buildWorkflowRunRequest, parseLinkHeader } from './workflow-run-enumerator.mjs';

const SHA = 'e35a5e264d6d4f0535d236c6f0b17f2813efa665';

test('builds an exact-commit maximal-page request without event filtering', () => {
  const request = buildWorkflowRunRequest({ owner: 'MirrorCartographer', repo: 'MirrorCartographer', commitSha: SHA });
  const url = new URL(request.url);
  assert.equal(url.searchParams.get('head_sha'), SHA);
  assert.equal(url.searchParams.get('per_page'), '100');
  assert.equal(url.searchParams.get('page'), '1');
  assert.equal(url.searchParams.has('event'), false);
});

test('parses next and last pagination links', () => {
  const links = parseLinkHeader('<https://api.github.com/x?page=2>; rel="next", <https://api.github.com/x?page=4>; rel="last"');
  assert.match(links.next, /page=2/);
  assert.match(links.last, /page=4/);
});

test('marks contiguous terminal pages complete and retains exact runs', () => {
  const result = aggregateWorkflowRunPages({
    commitSha: SHA,
    pages: [
      { page: 1, link: '<https://api.github.com/x?page=2>; rel="next"', workflow_runs: [] },
      { page: 2, link: '<https://api.github.com/x?page=1>; rel="prev"', workflow_runs: [{ id: 7, head_sha: SHA }] }
    ]
  });
  assert.equal(result.source.completePagination, true);
  assert.equal(result.exactRunCount, 1);
});

test('refuses to call a missing next page complete', () => {
  const result = aggregateWorkflowRunPages({
    commitSha: SHA,
    pages: [{ page: 1, link: '<https://api.github.com/x?page=2>; rel="next"', workflow_runs: [] }]
  });
  assert.equal(result.source.completePagination, false);
  assert.deepEqual(result.limitations, ['pagination_not_proven_complete']);
});

test('rejects page gaps even without a next link', () => {
  const result = aggregateWorkflowRunPages({
    commitSha: SHA,
    pages: [
      { page: 1, workflow_runs: [] },
      { page: 3, workflow_runs: [] }
    ]
  });
  assert.equal(result.source.completePagination, false);
});
