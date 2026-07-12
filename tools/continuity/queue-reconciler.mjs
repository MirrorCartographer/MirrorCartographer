const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);

function parseTime(value, field) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new TypeError(`${field} must be an ISO-8601 timestamp`);
  return time;
}

function evidenceSatisfied(required, update) {
  const evidence = new Set(update.evidence_types || []);
  return required.every((item) => evidence.has(item));
}

export function reconcileQueueItem({ aggregate, updates = [], resolvableCommits = [], resolvableEvidencePaths = [] }) {
  if (!aggregate || typeof aggregate !== 'object') throw new TypeError('aggregate is required');
  if (!aggregate.id || !aggregate.owner) throw new TypeError('aggregate id and owner are required');

  const commitSet = new Set(resolvableCommits);
  const evidenceSet = new Set(resolvableEvidencePaths);
  const accepted = [];
  const rejected = [];

  for (const update of updates) {
    const reasons = [];
    if (update.queue_item !== aggregate.id) reasons.push('queue_item_mismatch');
    if (update.owner !== aggregate.owner) reasons.push('owner_mismatch');
    if (!CLAIM_STATES.has(update.claim_state)) reasons.push('invalid_claim_state');
    let recordedAt = null;
    try { recordedAt = parseTime(update.recorded_at, 'recorded_at'); } catch { reasons.push('invalid_timestamp'); }

    const missingCommits = (update.source_commits || []).filter((sha) => !commitSet.has(sha));
    const missingEvidence = (update.evidence_paths || []).filter((path) => !evidenceSet.has(path));
    if (missingCommits.length) reasons.push('unresolvable_commit');
    if (missingEvidence.length) reasons.push('unresolvable_evidence');

    const normalized = { ...update, recorded_at_epoch_ms: recordedAt, missing_commits: missingCommits, missing_evidence_paths: missingEvidence };
    (reasons.length ? rejected : accepted).push({ ...normalized, rejection_reasons: reasons });
  }

  accepted.sort((a,b) => a.recorded_at_epoch_ms - b.recorded_at_epoch_ms || String(a.record_id).localeCompare(String(b.record_id)));
  const latest = accepted.at(-1) || null;
  const required = aggregate.required_evidence || [];
  const completionClaimed = Boolean(latest && latest.status === 'completed');
  const complete = Boolean(completionClaimed && evidenceSatisfied(required, latest));
  const unsupportedCompletion = completionClaimed && !complete;

  return {
    schema_version: '1.1.0',
    queue_item: aggregate.id,
    owner: aggregate.owner,
    aggregate_snapshot: aggregate,
    accepted_updates: accepted,
    rejected_updates: rejected,
    latest_temporal_update: latest,
    effective_status: complete ? 'completed' : (unsupportedCompletion ? aggregate.status : (latest?.status || aggregate.status)),
    required_evidence: required,
    required_evidence_complete: complete,
    claim_state: unsupportedCompletion ? 'unresolved' : (latest ? 'inferred' : 'observed'),
    mutation_performed: false,
    superseded_claims: unsupportedCompletion ? [{ source_record_id: latest.record_id || null, claim: 'completed', reason: 'required_evidence_incomplete' }] : [],
    unresolved: complete ? [] : [unsupportedCompletion ? 'completion_claim_not_supported_by_required_evidence' : 'required_evidence_not_complete_or_not_resolvable'],
    review_route: 'Re-fetch aggregate and append-only records, resolve referenced commits and evidence paths, then rerun without mutating source records.'
  };
}
