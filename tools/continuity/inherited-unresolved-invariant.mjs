function unresolvedClaims(record) {
  return [
    ...(Array.isArray(record.unresolved) ? record.unresolved : []),
    ...(Array.isArray(record.unresolved_inherited) ? record.unresolved_inherited : []),
  ];
}

export function validateInheritedUnresolved(records) {
  if (!Array.isArray(records)) throw new TypeError('records must be an array');

  const byId = new Map(records.map((record) => [record.id, record]));
  const violations = [];

  for (const record of records) {
    const dependencies = Array.isArray(record.dependencies) ? record.dependencies : [];
    const inherited = new Set(Array.isArray(record.unresolved_inherited) ? record.unresolved_inherited : []);
    const resolved = new Set(Array.isArray(record.resolved_claims) ? record.resolved_claims : []);

    for (const dependencyId of dependencies) {
      const predecessor = byId.get(dependencyId);
      if (!predecessor) {
        violations.push({
          type: 'missing_dependency',
          record_id: record.id,
          dependency_id: dependencyId,
        });
        continue;
      }

      for (const claim of unresolvedClaims(predecessor)) {
        if (!inherited.has(claim) && !resolved.has(claim)) {
          violations.push({
            type: 'dropped_unresolved_claim',
            record_id: record.id,
            dependency_id: dependencyId,
            claim,
          });
        }
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function assertInheritedUnresolved(records) {
  const result = validateInheritedUnresolved(records);
  if (!result.valid) {
    const error = new Error('continuity lineage dropped unresolved claims');
    error.code = 'CONTINUITY_UNRESOLVED_DROPPED';
    error.violations = result.violations;
    throw error;
  }
  return result;
}
