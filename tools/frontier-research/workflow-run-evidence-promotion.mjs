import { aggregateWorkflowRunPages } from './workflow-run-enumerator.mjs';
import { classifyWorkflowRunEnumeration } from './workflow-run-enumeration-integrity.mjs';

const SHA_RE = /^[0-9a-f]{40}$/i;

function reject(reason, details = {}) {
  return {
    classification: 'workflow_run_evidence_not_promotable',
    accepted: false,
    reason,
    details,
    claim_boundary: [
      'does_not_prove_authentication_scope',
      'does_not_prove_workflow_execution',
      'does_not_prove_deployment_identity_or_runtime_behavior'
    ]
  };
}

export function promoteWorkflowRunEvidence({ commitSha, pages }) {
  if (!SHA_RE.test(commitSha ?? '')) return reject('invalid_commit_sha');

  const integrity = classifyWorkflowRunEnumeration({ commitSha, pages });
  if (!integrity.accepted) {
    return reject('enumeration_integrity_not_proven', { integrity });
  }

  let aggregate;
  try {
    aggregate = aggregateWorkflowRunPages({ commitSha, pages });
  } catch (error) {
    return reject('aggregation_failed', { message: error instanceof Error ? error.message : String(error) });
  }

  if (!aggregate.source.completePagination) {
    return reject('pagination_not_proven_complete', { aggregate });
  }

  if (aggregate.runs.length !== integrity.retained_run_count) {
    return reject('aggregate_integrity_count_disagreement', {
      aggregate_count: aggregate.runs.length,
      integrity_count: integrity.retained_run_count
    });
  }

  if (aggregate.exactRunCount !== aggregate.runs.length) {
    return reject('aggregate_contains_foreign_rows', {
      aggregate_count: aggregate.runs.length,
      exact_run_count: aggregate.exactRunCount
    });
  }

  const providerCapApplies = integrity.classification === 'enumeration_integrity_proven_with_provider_cap';
  return {
    classification: providerCapApplies
      ? 'workflow_run_evidence_promotable_with_provider_cap'
      : 'workflow_run_evidence_promotable',
    accepted: true,
    commit_sha: commitSha.toLowerCase(),
    run_count: aggregate.runs.length,
    run_ids: aggregate.runs.map((run) => run.id),
    pages_observed: integrity.pages_observed,
    declared_total: integrity.declared_total,
    absence_claim_allowed: !providerCapApplies && aggregate.runs.length === 0,
    completeness_claim_allowed: !providerCapApplies,
    limitations: providerCapApplies ? ['github_filtered_search_cap_1000_results'] : [],
    claim_boundary: [
      'promotes_only_retained_exact_sha_enumeration_evidence',
      'does_not_prove_authentication_scope',
      'does_not_prove_workflow_execution',
      'does_not_prove_deployment_identity_or_runtime_behavior'
    ],
    falsification_route: 'Provide any retained page set that passes one component while producing a count, SHA membership, page-continuity, or provider-cap disagreement in the other.'
  };
}
