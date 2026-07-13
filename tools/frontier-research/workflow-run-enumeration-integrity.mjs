const SHA_RE = /^[0-9a-f]{40}$/i;
const LINK_PART_RE = /<([^>]+)>\s*;\s*rel="([^"]+)"/g;

function parseLinkHeader(value = '') {
  const links = {};
  for (const match of value.matchAll(LINK_PART_RE)) links[match[2]] = match[1];
  return links;
}

function fail(reason, details = {}) {
  return {
    classification: 'enumeration_integrity_not_proven',
    accepted: false,
    reason,
    details,
    claim_boundary: [
      'does_not_prove_authentication_scope',
      'does_not_bypass_github_1000_result_filtered_search_cap',
      'does_not_prove_workflow_execution_or_deployment_behavior'
    ]
  };
}

export function classifyWorkflowRunEnumeration({ commitSha, pages }) {
  if (!SHA_RE.test(commitSha ?? '')) return fail('invalid_commit_sha');
  if (!Array.isArray(pages) || pages.length === 0) return fail('pages_missing');

  const normalizedSha = commitSha.toLowerCase();
  const observedPages = new Set();
  const totals = new Set();
  const runIds = new Set();
  let retainedRunCount = 0;
  let terminalPages = 0;

  for (const page of pages) {
    if (!Number.isInteger(page?.page) || page.page < 1) return fail('invalid_page_number');
    if (observedPages.has(page.page)) return fail('duplicate_page_number', { page: page.page });
    observedPages.add(page.page);

    if (!Number.isInteger(page.total_count) || page.total_count < 0) {
      return fail('invalid_total_count', { page: page.page });
    }
    totals.add(page.total_count);

    if (!Array.isArray(page.workflow_runs)) return fail('workflow_runs_missing', { page: page.page });

    const links = parseLinkHeader(page.link ?? '');
    if (!links.next) terminalPages += 1;

    for (const run of page.workflow_runs) {
      retainedRunCount += 1;
      if (run?.head_sha?.toLowerCase() !== normalizedSha) {
        return fail('foreign_head_sha', { page: page.page, run_id: run?.id ?? null, observed_head_sha: run?.head_sha ?? null });
      }
      if (run?.id == null) return fail('run_id_missing', { page: page.page });
      if (runIds.has(run.id)) return fail('duplicate_run_id', { run_id: run.id });
      runIds.add(run.id);
    }
  }

  const pageNumbers = [...observedPages].sort((a, b) => a - b);
  for (let index = 0; index < pageNumbers.length; index += 1) {
    if (pageNumbers[index] !== index + 1) return fail('page_sequence_gap', { pages: pageNumbers });
  }

  if (totals.size !== 1) return fail('total_count_drift', { totals: [...totals] });
  if (terminalPages !== 1) return fail('terminal_page_not_unique', { terminal_pages: terminalPages });

  const declaredTotal = [...totals][0];
  if (declaredTotal <= 1000 && retainedRunCount !== declaredTotal) {
    return fail('retained_count_mismatch', { declared_total: declaredTotal, retained_count: retainedRunCount });
  }

  return {
    classification: declaredTotal > 1000
      ? 'enumeration_integrity_proven_with_provider_cap'
      : 'enumeration_integrity_proven',
    accepted: true,
    commit_sha: normalizedSha,
    pages_observed: pageNumbers,
    declared_total: declaredTotal,
    retained_run_count: retainedRunCount,
    unique_run_ids: runIds.size,
    limitations: declaredTotal > 1000 ? ['github_filtered_search_cap_1000_results'] : [],
    claim_boundary: [
      'verifies_retained_page_and_row_integrity_only',
      'does_not_prove_authentication_scope',
      'does_not_prove_workflow_execution_or_deployment_behavior'
    ],
    falsification_route: 'Present a duplicate run id, foreign head_sha, page gap, inconsistent total_count, non-unique terminal page, or retained-count mismatch.'
  };
}
