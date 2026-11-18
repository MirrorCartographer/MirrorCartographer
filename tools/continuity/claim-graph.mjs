const STATES = new Set(['observed', 'inferred', 'proposed', 'superseded', 'unresolved']);

// "supersedes" points from a newer claim TO the older claim it replaces.
// A historical claim is superseded when it is the TARGET of that relation.
function refs(record, field) {
  return Array.isArray(record?.[field]) ? record[field] : [];
}

export function validateClaimGraph(index) {
  const errors = [];
  if (!index || !Array.isArray(index.records)) {
    return {
      valid: false,
      errors: [{ code: 'CG-000', message: 'index.records must be an array; missing data is not an empty, valid history' }]
    };
  }

  const byId = new Map();

  for (const [position, record] of index.records.entries()) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      errors.push({ code: 'CG-009', position, message: 'record must be an object' });
      continue;
    }
    if (!record.id || typeof record.id !== 'string' || !record.id.trim()) {
      errors.push({ code: 'CG-001', position, message: 'record id is required' });
      continue;
    }
    if (byId.has(record.id)) {
      errors.push({ code: 'CG-002', record_id: record.id, message: 'record ids must be unique' });
    } else {
      byId.set(record.id, record);
    }
    if (!STATES.has(record.claim_state)) {
      errors.push({ code: 'CG-003', record_id: record.id, message: 'claim_state is invalid' });
    }
  }

  const replacedIds = new Set();
  for (const record of byId.values()) {
    for (const field of ['contradicts', 'supersedes']) {
      if (record[field] !== undefined && !Array.isArray(record[field])) {
        errors.push({ code: 'CG-010', record_id: record.id, field, message: 'relation must be an array' });
        continue;
      }
      const values = refs(record, field);
      if (new Set(values).size !== values.length) {
        errors.push({ code: 'CG-004', record_id: record.id, field, message: 'relation targets must be unique' });
      }
      for (const target of values) {
        if (typeof target !== 'string' || !target.trim()) {
          errors.push({ code: 'CG-011', record_id: record.id, field, message: 'relation targets must be nonempty ids' });
        } else if (target === record.id) {
          errors.push({ code: 'CG-005', record_id: record.id, field, message: 'self-relations are forbidden' });
        } else if (!byId.has(target)) {
          errors.push({ code: 'CG-006', record_id: record.id, field, target, message: 'relation target does not exist' });
        } else if (field === 'supersedes') {
          replacedIds.add(target);
        }
      }
    }
  }

  for (const record of byId.values()) {
    if (record.claim_state === 'superseded' && !replacedIds.has(record.id)) {
      errors.push({
        code: 'CG-007',
        record_id: record.id,
        message: 'a superseded claim must be named by a newer claim\'s supersedes relation'
      });
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function walk(id) {
    if (visiting.has(id)) {
      errors.push({ code: 'CG-008', record_id: id, message: 'supersession cycles are forbidden' });
      return;
    }
    if (visited.has(id) || !byId.has(id)) return;
    visiting.add(id);
    for (const target of refs(byId.get(id), 'supersedes')) {
      if (typeof target === 'string' && byId.has(target)) walk(target);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) walk(id);

  return { valid: errors.length === 0, errors };
}
