const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const STATUS_RANK = Object.freeze({
  queued: 0,
  active: 1,
  blocked: 1,
  blocked_external_configuration: 1,
  completed: 2,
  retired: 3
});

function parseTime(value, field) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) throw new TypeError(`${field} must be an ISO-8601 timestamp`);
  return time;
}

function evidenceSatisfied(required, update) {
  const evidence = new Set(update.evidence_types || []);
  return required.every((item) => evidence.has(item));
}

function stablePayload(update) {
  return JSON.stringify({
    status: update.status ?? null,
    claim_state: update.claim_state ?? null,
    source_commits: [...(update.source_commits || [])].sort(),
    evidence_paths: [...(update.evidence_paths || [])].sort(),
    evidence_types: [...(update.evidence_types || [])].sort()
  });
}

export function reconcileQueueItem({ aggregate, updates = [], resolvableCommits = [], resolvableEvidencePaths = [] }) {
  if (!aggregate || typeof aggregate !== 'object') throw new TypeError('aggregate is required');
  if (!aggregate.id || !aggregate.owner) throw new TypeError('aggregate id and owner are required');
  if (!(aggregate.status in STATUS_RANK)) throw new TypeError(`unsupported aggregate status: ${aggregate.status}`);

  const commitSet = new Set(resolvableCommits);
  const evidenceSet = new Set(resolvableEvidencePaths);
  const accepted = [];
  const rejected = [];
  const seenRecordIds = new Set();
  const seenTimestampPayloads = new Map();
  let lastAcceptedTime = Number.NEGATIVE_INFINITY;
  let lastAcceptedStatus = aggregate.status;

  for (const update of updates) {
    const reasons = [];
    const recordId = update.record_id;

    if (!recordId || typeof recordId !== 'string') reasons.push('missing_record_id');
    else if (seenRecordIds.has(recordId)) reasons.push('duplicate_record_id');
    else seenRecordIds.add(recordId);

    if (update.queue_item !== aggregate.id) reasons.push('queue_item_mismatch');
    if (update.owner !== aggregate.owner) reasons.push('owner_mismatch');
    if (!CLAIM_STATES.has(update.claim_state)) reasons.push('invalid_claim_state');
    if (!(update.status in STATUS_RANK)) reasons.push('invalid_status');

    let recordedAt = null;
    try { recordedAt = parseTime(update.recorded_at, 'recorded_at'); } catch { reasons.push('invalid_timestamp'); }

    const missingCommits = (update.source_commits || []).filter((sha) => !commitSet.has(sha));
    const missingEvidence = (update.evidence_paths || []).filter((path) => !evidenceSet.has(path));
    if (missingCommits.length) reasons.push('unresolvable_commit');
    if (missingEvidence.length) reasons.push('unresolvable_evidence');

    if (recordedAt !== null) {
      if (recordedAt < lastAcceptedTime) reasons.push('timestamp_reversal');
      const timestampKey = String(recordedAt);
      const payload = stablePayload(update);
      const priorPayload = seenTimestampPayloads.get(timestampKey);
      if (priorPayload && priorPayload !== payload) reasons.push('conflicting_same_timestamp_projection');
      else if (!priorPayload) seenTimestampPayloads.set(timestampKey, payload);
    }

    if (update.status in STATUS_RANK && STATUS_RANK[update.status] < STATUS_RANK[lastAcceptedStatus]) {
      reasons.push('status_regression');
    }

    const normalized = {
      ...update,
      recorded_at_epoch_ms: recordedAt,
      missing_commits: missingCommits,
      missing_evidence_paths: missingEvidence,
      rejection_reasons: [...new Set(reasons)]
    };

    if (normalized.rejection_reasons.length) {
      rejected.push(normalized);
      continue;
    }

    accepted.push(normalized);
    lastAcceptedTime = recordedAt;
    lastAcceptedStatus = update.status;
  }

  const latest = accepted.at(-1) || null;
  const required = aggregate.required_evidence || [];
  const completionClaimed = Boolean(latest && latest.status === 'completed');
  const complete = Boolean(completionClaimed && evidenceSatisfied(required, latest));
  const unsupportedCompletion = completionClaimed && !complete;

  return {
    schema_version: '1.2.0',
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
    materialization_allowed: rejected.length === 0 && !unsupportedCompletion,
    superseded_claims: unsupportedCompletion ? [{ source_record_id: latest.record_id || null, claim: 'completed', reason: 'required_evidence_incomplete' }] : [],
    unresolved: [
      ...(unsupportedCompletion ? ['completion_claim_not_supported_by_required_evidence'] : []),
      ...(rejected.length ? ['one_or_more_queue_projections_rejected'] : []),
      ...(!complete && !unsupportedCompletion && !latest ? ['required_evidence_not_complete_or_not_resolvable'] : [])
    ],
    review_route: 'Re-fetch aggregate and append-only records, verify chronological input order, resolve referenced commits and evidence paths, then rerun without mutating source records.'
  };
}

export { CLAIM_STATES, STATUS_RANK };
