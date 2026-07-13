export function validateContinuityRelations(index) {
  if (!index || typeof index !== 'object') throw new Error('index object required');
  if (!Array.isArray(index.records)) throw new Error('records array required');

  const byId = new Map();
  for (const record of index.records) {
    if (!record?.id || typeof record.id !== 'string') throw new Error('record id required');
    if (byId.has(record.id)) throw new Error(`duplicate record id: ${record.id}`);
    byId.set(record.id, record);
  }

  const edges = [];
  for (const record of index.records) {
    for (const relation of ['contradicts', 'supersedes']) {
      const targets = record[relation] ?? [];
      if (!Array.isArray(targets)) throw new Error(`${record.id}.${relation} must be an array`);
      const seen = new Set();
      for (const target of targets) {
        if (typeof target !== 'string' || target.length === 0) throw new Error(`${record.id}.${relation} target must be a record id`);
        if (target === record.id) throw new Error(`${record.id} cannot ${relation === 'contradicts' ? 'contradict' : 'supersede'} itself`);
        if (seen.has(target)) throw new Error(`${record.id}.${relation} contains duplicate target: ${target}`);
        seen.add(target);
        if (!byId.has(target)) throw new Error(`${record.id}.${relation} references missing record: ${target}`);
        edges.push({ from: record.id, relation, to: target });
      }
    }
  }

  const supersedes = new Map([...byId.keys()].map(id => [id, []]));
  for (const edge of edges) if (edge.relation === 'supersedes') supersedes.get(edge.from).push(edge.to);
  const visiting = new Set();
  const visited = new Set();
  const walk = (id, path = []) => {
    if (visiting.has(id)) throw new Error(`supersedes cycle: ${[...path, id].join(' -> ')}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const target of supersedes.get(id)) walk(target, [...path, id]);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of byId.keys()) walk(id);

  return {
    schema_version: '1.0.0',
    record_count: byId.size,
    relation_count: edges.length,
    contradiction_edges: edges.filter(edge => edge.relation === 'contradicts').length,
    supersession_edges: edges.filter(edge => edge.relation === 'supersedes').length,
    relation_integrity: 'verified',
    claim_boundary: 'Structural relation integrity does not prove that any indexed claim is true.'
  };
}
