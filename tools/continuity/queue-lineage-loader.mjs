import { validateInheritedUnresolved } from './inherited-unresolved-invariant.mjs';

function strings(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))];
}

function nestedUnresolved(record) {
  return strings(record?.progress?.claim_states?.unresolved);
}

export function normalizeContinuityRecord(record, sourcePath = null) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new TypeError('continuity record must be an object');
  }
  if (typeof record.id !== 'string' || !record.id.trim()) {
    throw new TypeError('continuity record id is required');
  }

  const unresolved = strings([
    ...strings(record.unresolved),
    ...nestedUnresolved(record),
  ]);

  return {
    id: record.id.trim(),
    owner: typeof record.owner === 'string' ? record.owner : null,
    status: typeof record.status === 'string' ? record.status : null,
    dependencies: strings(record.dependencies),
    unresolved,
    unresolved_inherited: strings(record.unresolved_inherited),
    resolved_claims: strings(record.resolved_claims),
    source_path: sourcePath,
    normalization: {
      unresolved_from_top_level: strings(record.unresolved).length,
      unresolved_from_claim_states: nestedUnresolved(record).length,
    },
  };
}

export function loadContinuityQueueEntries(entries) {
  if (!Array.isArray(entries)) throw new TypeError('entries must be an array');

  const records = [];
  const errors = [];

  for (const entry of entries) {
    const path = entry?.path ?? null;
    try {
      const raw = typeof entry?.content === 'string' ? JSON.parse(entry.content) : entry?.content;
      const normalized = normalizeContinuityRecord(raw, path);
      if (normalized.owner === 'continuity_mining' || /^M-\d+$/.test(normalized.id)) {
        records.push(normalized);
      }
    } catch (error) {
      errors.push({
        path,
        type: error instanceof SyntaxError ? 'invalid_json' : 'invalid_record',
        message: error.message,
      });
    }
  }

  const duplicateIds = [];
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.id)) duplicateIds.push(record.id);
    seen.add(record.id);
  }

  const lineage = duplicateIds.length === 0
    ? validateInheritedUnresolved(records)
    : { valid: false, violations: duplicateIds.map((id) => ({ type: 'duplicate_id', record_id: id })) };

  return {
    valid: errors.length === 0 && lineage.valid,
    records,
    errors,
    violations: lineage.violations,
  };
}

export function assertContinuityQueueEntries(entries) {
  const result = loadContinuityQueueEntries(entries);
  if (!result.valid) {
    const error = new Error('continuity queue lineage gate failed');
    error.code = 'CONTINUITY_QUEUE_LINEAGE_INVALID';
    error.result = result;
    throw error;
  }
  return result;
}
