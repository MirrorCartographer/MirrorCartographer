function uniqueStrings(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))];
}

export function detectQueueLineageForks(records) {
  if (!Array.isArray(records)) throw new TypeError('records must be an array');

  const byId = new Map();
  const malformed = [];

  for (const record of records) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      malformed.push({ type: 'invalid_record', record_id: null });
      continue;
    }
    const id = typeof record.id === 'string' ? record.id.trim() : '';
    if (!id) {
      malformed.push({ type: 'missing_id', record_id: null });
      continue;
    }
    if (byId.has(id)) {
      malformed.push({ type: 'duplicate_id', record_id: id });
      continue;
    }
    byId.set(id, {
      id,
      dependencies: uniqueStrings(record.dependencies),
      source_path: record.source_path ?? null,
    });
  }

  const successors = new Map();
  const missingDependencies = [];

  for (const record of byId.values()) {
    for (const dependency of record.dependencies) {
      if (!byId.has(dependency)) {
        missingDependencies.push({
          type: 'missing_dependency',
          record_id: record.id,
          dependency,
          source_path: record.source_path,
        });
        continue;
      }
      const current = successors.get(dependency) ?? [];
      current.push(record.id);
      successors.set(dependency, current);
    }
  }

  const forks = [...successors.entries()]
    .filter(([, children]) => children.length > 1)
    .map(([dependency, children]) => ({
      type: 'lineage_fork',
      dependency,
      successors: [...children].sort(),
    }))
    .sort((a, b) => a.dependency.localeCompare(b.dependency));

  const dependedOn = new Set([...successors.keys()]);
  const heads = [...byId.keys()].filter((id) => !dependedOn.has(id)).sort();

  return {
    valid: malformed.length === 0 && missingDependencies.length === 0 && forks.length === 0 && heads.length <= 1,
    record_count: byId.size,
    heads,
    forks,
    missing_dependencies: missingDependencies,
    malformed,
    interpretation: forks.length > 0 || heads.length > 1
      ? 'Preserve each branch as unresolved evidence until an explicit reconciliation record names all predecessor heads.'
      : 'No queue-lineage fork was detected in the supplied record set.',
  };
}

export function assertSingleQueueLineage(records) {
  const result = detectQueueLineageForks(records);
  if (!result.valid) {
    const error = new Error('continuity queue lineage fork detected');
    error.code = 'CONTINUITY_QUEUE_LINEAGE_FORK';
    error.result = result;
    throw error;
  }
  return result;
}
