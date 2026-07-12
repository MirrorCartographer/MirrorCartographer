const STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);

function refs(record, field) {
  return Array.isArray(record?.[field]) ? record[field] : [];
}

export function validateClaimGraph(index) {
  const errors = [];
  const records = Array.isArray(index?.records) ? index.records : [];
  const byId = new Map();

  for (const [position, record] of records.entries()) {
    if (!record?.id || typeof record.id !== 'string') {
      errors.push({code:'CG-001', position, message:'record id is required'});
      continue;
    }
    if (byId.has(record.id)) errors.push({code:'CG-002', record_id:record.id, message:'record ids must be unique'});
    byId.set(record.id, record);
    if (!STATES.has(record.claim_state)) errors.push({code:'CG-003', record_id:record.id, message:'claim_state is invalid'});
  }

  for (const record of records) {
    if (!record?.id) continue;
    for (const field of ['contradicts','supersedes']) {
      const values = refs(record, field);
      if (new Set(values).size !== values.length) errors.push({code:'CG-004', record_id:record.id, field, message:'relation targets must be unique'});
      for (const target of values) {
        if (target === record.id) errors.push({code:'CG-005', record_id:record.id, field, message:'self-relations are forbidden'});
        else if (!byId.has(target)) errors.push({code:'CG-006', record_id:record.id, field, target, message:'relation target does not exist'});
      }
    }
    if (record.claim_state === 'superseded' && refs(record,'supersedes').length === 0) {
      errors.push({code:'CG-007', record_id:record.id, message:'superseded records must identify the prior record they replace'});
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function walk(id) {
    if (visiting.has(id)) {
      errors.push({code:'CG-008', record_id:id, message:'supersession cycles are forbidden'});
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const target of refs(byId.get(id),'supersedes')) walk(target);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) walk(id);

  return {valid: errors.length === 0, errors};
}
