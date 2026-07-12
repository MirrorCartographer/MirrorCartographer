const CLAIM_KEYS = new Set(['deployment_succeeded','tests_passed','peer_ran','runtime_verified']);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function hasDirectEvidence(update) {
  const progress = update.progress || {};
  return Boolean(
    progress.verification ||
    progress.evidence ||
    progress.evidence_commit ||
    progress.commits ||
    progress.runtime_evidence ||
    progress.deployment_evidence
  );
}

function rejectUnsupportedClaims(update) {
  const progress = update.progress || {};
  const asserted = Object.entries(progress)
    .filter(([key, value]) => CLAIM_KEYS.has(key) && value === true)
    .map(([key]) => key);
  if (asserted.length && !hasDirectEvidence(update)) {
    throw new Error(`unsupported execution claim(s): ${asserted.join(', ')}`);
  }
}

export function resolveEffectiveQueueState(canonicalQueue, additiveRecords) {
  assertObject(canonicalQueue, 'canonicalQueue');
  if (!Array.isArray(canonicalQueue.items)) throw new TypeError('canonicalQueue.items must be an array');
  if (!Array.isArray(additiveRecords)) throw new TypeError('additiveRecords must be an array');

  const items = new Map(canonicalQueue.items.map((item) => [item.id, clone(item)]));
  const provenance = new Map(canonicalQueue.items.map((item) => [item.id, [{ layer: 'canonical', owner: item.owner }]]));
  const rejected = [];

  for (const record of additiveRecords) {
    try {
      assertObject(record, 'additive record');
      const update = record.queue_item;
      assertObject(update, 'additive record.queue_item');
      if (!update.id || !update.owner) throw new Error('queue_item requires id and owner');
      const existing = items.get(update.id);
      if (existing && existing.owner !== update.owner) {
        throw new Error(`cross-owner mutation refused for ${update.id}: ${update.owner} cannot replace ${existing.owner}`);
      }
      if (record.owner && record.owner !== update.owner) {
        throw new Error(`record owner ${record.owner} does not match queue item owner ${update.owner}`);
      }
      rejectUnsupportedClaims(update);

      items.set(update.id, existing ? { ...existing, ...clone(update), owner: existing.owner } : clone(update));
      const trail = provenance.get(update.id) || [];
      trail.push({
        layer: 'additive',
        owner: update.owner,
        record_id: record.record_id || null,
        path: record.path || null,
        commit: record.commit || null,
        created_at: record.created_at || null
      });
      provenance.set(update.id, trail);
    } catch (error) {
      rejected.push({ record_id: record?.record_id || null, reason: error.message });
    }
  }

  return {
    schema_version: '1.0.0',
    canonical_updated_at: canonicalQueue.updated_at || null,
    items: [...items.values()].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || a.id.localeCompare(b.id)),
    provenance: Object.fromEntries(provenance),
    rejected,
    interpretation: {
      observed: 'Canonical and accepted additive records were read as separate provenance layers.',
      inferred: 'Later owner-scoped records refine effective state without erasing historical snapshots.',
      proposed: 'Consumers should display rejection reasons and provenance alongside effective queue state.',
      superseded: 'Canonical-only queue reading is insufficient once accepted additive records exist.',
      unresolved: 'This resolver validates record structure and ownership, not the truth of externally asserted deployments, tests, or peer execution.'
    }
  };
}
