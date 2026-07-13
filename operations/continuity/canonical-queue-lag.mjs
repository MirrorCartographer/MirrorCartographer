const VALID_STATES = new Set(["active","queued","completed","blocked_external_configuration","superseded"]);

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(stable(value));
}

export function assessCanonicalQueueLag(canonicalQueue, updateRecords) {
  const errors = [];
  if (!canonicalQueue || !Array.isArray(canonicalQueue.items)) {
    return Object.freeze({ valid: false, errors: ["canonical-items-required"] });
  }
  if (!Array.isArray(updateRecords)) {
    return Object.freeze({ valid: false, errors: ["update-records-array-required"] });
  }

  const canonical = new Map();
  for (const item of canonicalQueue.items) {
    if (!item?.id || !item?.owner || !VALID_STATES.has(item.status)) {
      errors.push(`invalid-canonical-item:${item?.id ?? "unknown"}`);
      continue;
    }
    if (canonical.has(item.id)) errors.push(`duplicate-canonical-id:${item.id}`);
    canonical.set(item.id, item);
  }

  const observed = new Map();
  for (const record of updateRecords) {
    const item = record?.queue_item;
    if (!item?.id || !item?.owner || !VALID_STATES.has(item.status)) {
      errors.push(`invalid-update-item:${item?.id ?? "unknown"}`);
      continue;
    }
    if (record.canonical_queue_mutated !== false) {
      errors.push(`non-append-only-update:${item.id}`);
      continue;
    }
    const previous = observed.get(item.id);
    if (previous && canonicalJson(previous) !== canonicalJson(item)) {
      errors.push(`conflicting-update-records:${item.id}`);
      continue;
    }
    observed.set(item.id, item);
  }

  const missing = [];
  const divergent = [];
  const consistent = [];

  for (const [id, item] of observed) {
    const current = canonical.get(id);
    if (!current) {
      missing.push({ id, owner: item.owner, update_status: item.status });
      continue;
    }
    if (canonicalJson(current) !== canonicalJson(item)) {
      divergent.push({
        id,
        owner: item.owner,
        canonical_status: current.status,
        update_status: item.status
      });
      continue;
    }
    consistent.push(id);
  }

  const state = errors.length
    ? "invalid"
    : missing.length || divergent.length
      ? "canonical-lag-observed"
      : "canonical-current-for-supplied-updates";

  return Object.freeze({
    valid: errors.length === 0,
    state,
    errors: Object.freeze(errors),
    missing: Object.freeze(missing),
    divergent: Object.freeze(divergent),
    consistent: Object.freeze(consistent),
    proves_peer_execution: false,
    adoption_authorized: false
  });
}
