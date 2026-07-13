const SHA_RE = /^[0-9a-f]{40}$/i;

export function classifyWorkflowRunObservation(input) {
  if (!input || typeof input !== 'object') throw new TypeError('input must be an object');
  const { commitSha, runs, query = {}, source = {} } = input;
  if (!SHA_RE.test(commitSha ?? '')) throw new Error('commitSha must be a 40-character git SHA');
  if (!Array.isArray(runs)) throw new Error('runs must be an array');

  const limitations = [];
  if (source.firstPageOnly === true) limitations.push('first_page_only');
  if (source.eventFiltered === true) limitations.push('event_filtered');
  if (source.completePagination !== true) limitations.push('pagination_not_proven_complete');
  if (query.head_sha !== commitSha) limitations.push('exact_commit_filter_missing');
  if ((query.per_page ?? 0) < 100) limitations.push('non_maximal_page_size');

  const exactRuns = runs.filter((run) => run?.head_sha === commitSha);
  if (exactRuns.length > 0) {
    return {
      state: 'observed_exact_run',
      claim: 'At least one workflow run for the exact commit was observed.',
      exactRunCount: exactRuns.length,
      limitations,
      evidenceStrength: limitations.length === 0 ? 'strong' : 'bounded'
    };
  }

  if (limitations.length > 0) {
    return {
      state: 'indeterminate_incomplete_observation',
      claim: 'No exact-commit run was observed, but the observation cannot establish absence.',
      exactRunCount: 0,
      limitations,
      evidenceStrength: 'weak'
    };
  }

  return {
    state: 'bounded_no_match',
    claim: 'No exact-commit workflow run was returned by a complete bounded query.',
    exactRunCount: 0,
    limitations: ['github_filtered_search_cap_1000_results'],
    evidenceStrength: 'bounded'
  };
}
