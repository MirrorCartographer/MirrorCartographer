function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function parseTimestamp(value, label) {
  const time = Date.parse(value || '');
  if (!Number.isFinite(time)) throw new Error(`${label} must contain a valid timestamp`);
  return time;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function resolveEffectiveQueue(baseQueue, updateRecords, options = {}) {
  assertObject(baseQueue, 'baseQueue');
  if (!Array.isArray(baseQueue.items)) throw new TypeError('baseQueue.items must be an array');
  if (!Array.isArray(updateRecords)) throw new TypeError('updateRecords must be an array');

  const requireCompleteManifest = options.require_complete_manifest !== false;
  if (requireCompleteManifest && options.discovery_complete !== true) {
    return {
      schema_version: '1.0.0',
      status: 'absence_unproven',
      effective_items: clone(baseQueue.items),
      applied_updates: [],
      rejected_updates: [],
      interpretation: {
        observed: 'The canonical base queue is readable, but additive update discovery is not proven complete.',
        inferred: 'The base queue may be stale relative to immutable additive queue-update records.',
        proposed: 'Do not call the resulting queue exhaustive until discovery coverage is complete.',
        superseded: 'Treating ACTIVE_QUEUE.json alone as current operational truth.',
        unresolved: 'Undiscovered queue-update records may still exist.'
      }
    };
  }

  const state = new Map(baseQueue.items.map(item => [item.id, clone(item)]));
  const applied = [];
  const rejected = [];

  const normalized = updateRecords.map((record, index) => {
    try {
      assertObject(record, `updateRecords[${index}]`);
      assertObject(record.queue_item, `updateRecords[${index}].queue_item`);
      const id = String(record.queue_item.id || '').trim();
      if (!id) throw new Error('queue_item.id is required');
      const owner = String(record.queue_item.owner || '').trim();
      if (!owner) throw new Error('queue_item.owner is required');
      const createdAt = parseTimestamp(record.created_at, `updateRecords[${index}].created_at`);
      const recordId = String(record.record_id || '').trim();
      if (!recordId) throw new Error('record_id is required');
      return { ok: true, index, id, owner, createdAt, recordId, record };
    } catch (error) {
      return { ok: false, index, reason: error.message };
    }
  });

  for (const entry of normalized.filter(entry => !entry.ok)) {
    rejected.push({ index: entry.index, reason: entry.reason });
  }

  const valid = normalized.filter(entry => entry.ok).sort((a, b) =>
    a.createdAt - b.createdAt || a.recordId.localeCompare(b.recordId)
  );

  const seenRecordIds = new Set();
  for (const entry of valid) {
    if (seenRecordIds.has(entry.recordId)) {
      rejected.push({ index: entry.index, record_id: entry.recordId, reason: 'duplicate record_id' });
      continue;
    }
    seenRecordIds.add(entry.recordId);

    const previous = state.get(entry.id);
    if (previous && previous.owner && previous.owner !== entry.owner) {
      rejected.push({
        index: entry.index,
        record_id: entry.recordId,
        queue_item_id: entry.id,
        reason: `owner mismatch: ${previous.owner} -> ${entry.owner}`
      });
      continue;
    }

    state.set(entry.id, clone(entry.record.queue_item));
    applied.push({
      record_id: entry.recordId,
      queue_item_id: entry.id,
      owner: entry.owner,
      created_at: entry.record.created_at,
      replaced_existing: Boolean(previous)
    });
  }

  return {
    schema_version: '1.0.0',
    status: rejected.length === 0 ? 'effective_state_resolved' : 'effective_state_with_rejections',
    effective_items: [...state.values()].sort((a, b) =>
      (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER) ||
      String(a.id).localeCompare(String(b.id))
    ),
    applied_updates: applied,
    rejected_updates: rejected,
    interpretation: {
      observed: 'The effective queue is a deterministic replay of immutable additive records over the canonical base snapshot.',
      inferred: 'ACTIVE_QUEUE.json is a bootstrap snapshot, not sufficient evidence of latest state when later update records exist.',
      proposed: 'Use complete discovery plus ordered replay as the authoritative read path while preserving the base file unchanged.',
      superseded: 'Overwriting prior queue history or selecting whichever queue representation was read most recently.',
      unresolved: rejected.length ? 'One or more update records require manual provenance review.' : null
    }
  };
}
