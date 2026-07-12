const REQUIRED_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function classifyQueueUpdate(update, sourcePath, manifest = { exceptions: [] }) {
  const defects = [];
  const itemId = update?.item_id ?? update?.id ?? null;
  const timestamp = update?.updated_at ?? update?.observed_at ?? update?.completed_at ?? update?.created_at ?? null;

  if (!isObject(update)) defects.push('not_object');
  if (!itemId || typeof itemId !== 'string') defects.push('missing_item_identity');
  if (!timestamp || !Number.isFinite(Date.parse(timestamp))) defects.push('missing_or_invalid_timestamp');
  if (!update?.owner || typeof update.owner !== 'string') defects.push('missing_owner');
  if (!update?.status || typeof update.status !== 'string') defects.push('missing_status');

  if (update?.claims !== undefined) {
    if (!isObject(update.claims)) defects.push('claims_not_object');
    else {
      for (const key of Object.keys(update.claims)) {
        if (!REQUIRED_STATES.has(key)) defects.push(`unknown_claim_state:${key}`);
        if (!Array.isArray(update.claims[key])) defects.push(`claim_state_not_array:${key}`);
      }
    }
  }

  const exception = (manifest.exceptions ?? []).find((entry) => entry.source_path === sourcePath) ?? null;
  if (defects.length === 0) {
    return { source_path: sourcePath, item_id: itemId, classification: 'conformant', defects: [], exception: null };
  }

  if (!exception) {
    return { source_path: sourcePath, item_id: itemId, classification: 'blocking_incompatible', defects, exception: null };
  }

  const allowed = new Set(exception.allowed_defects ?? []);
  const uncovered = defects.filter((defect) => !allowed.has(defect));
  const expired = exception.expires_at ? Date.parse(exception.expires_at) <= Date.now() : false;
  const validReview = typeof exception.rationale === 'string' && exception.rationale.length > 0
    && typeof exception.reviewed_by === 'string' && exception.reviewed_by.length > 0
    && typeof exception.replacement_path === 'string' && exception.replacement_path.length > 0;

  if (uncovered.length > 0 || expired || !validReview) {
    return {
      source_path: sourcePath,
      item_id: itemId,
      classification: 'blocking_invalid_exception',
      defects,
      uncovered_defects: uncovered,
      exception
    };
  }

  return {
    source_path: sourcePath,
    item_id: itemId,
    classification: 'compatible_via_explicit_exception',
    defects,
    exception: {
      rationale: exception.rationale,
      reviewed_by: exception.reviewed_by,
      replacement_path: exception.replacement_path,
      expires_at: exception.expires_at ?? null
    }
  };
}

export function evaluateQueueUpdates(records, manifest) {
  const results = records.map(({ sourcePath, update }) => classifyQueueUpdate(update, sourcePath, manifest));
  return {
    schema_version: '1.0.0',
    policy: 'historical sources remain immutable; compatibility exceptions are explicit, narrow, reviewed, and non-authoritative',
    results,
    blocking: results.filter((result) => result.classification.startsWith('blocking_')),
    compatible: results.filter((result) => !result.classification.startsWith('blocking_'))
  };
}
