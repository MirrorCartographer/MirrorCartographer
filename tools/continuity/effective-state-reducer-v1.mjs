const FORBIDDEN_CONSTRAINT_PATHS = new Set([
  '/hard_boundaries',
  '/specialist_registry_rule',
  '/retirement_rule'
]);

function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function clone(value) {
  return structuredClone(value);
}

function pointerSegments(pointer) {
  if (typeof pointer !== 'string' || !pointer.startsWith('/')) {
    throw new TypeError('patch path must be an absolute JSON pointer');
  }
  return pointer.slice(1).split('/').map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function getAt(root, pointer) {
  let current = root;
  for (const segment of pointerSegments(pointer)) {
    if (!current || typeof current !== 'object' || !(segment in current)) return undefined;
    current = current[segment];
  }
  return current;
}

function setAt(root, pointer, value) {
  const segments = pointerSegments(pointer);
  let current = root;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    if (!current[segment] || typeof current[segment] !== 'object' || Array.isArray(current[segment])) {
      current[segment] = {};
    }
    current = current[segment];
  }
  current[segments.at(-1)] = clone(value);
}

function sourceLocator(record) {
  return {
    record_id: record.record_id,
    source_path: record.source_path,
    source_commit: record.source_commit,
    committed_at: record.committed_at
  };
}

function validateRecord(record, owners, reachableCommits) {
  assertObject(record, 'record');
  for (const field of ['record_id', 'queue_item', 'owner', 'source_path', 'source_commit', 'committed_at', 'patches']) {
    if (record[field] === undefined) throw new Error(`record missing ${field}`);
  }
  if (!Array.isArray(record.patches) || record.patches.length === 0) throw new Error('record patches must be non-empty');
  if (owners[record.queue_item] !== record.owner) throw new Error(`owner mismatch for ${record.queue_item}`);
  if (!reachableCommits.has(record.source_commit)) throw new Error(`unreachable source commit ${record.source_commit}`);
  if (!Number.isFinite(Date.parse(record.committed_at))) throw new Error('record committed_at must be an ISO date-time');
  for (const patch of record.patches) {
    assertObject(patch, 'patch');
    if (!('path' in patch) || !('value' in patch)) throw new Error('patch requires path and value');
    pointerSegments(patch.path);
    if ([...FORBIDDEN_CONSTRAINT_PATHS].some((prefix) => patch.path === prefix || patch.path.startsWith(`${prefix}/`))) {
      throw new Error(`team-local record cannot modify protected constraint ${patch.path}`);
    }
  }
}

export function reduceEffectiveState({ baseline, baselineSource, records, owners, reachableCommits }) {
  assertObject(baseline, 'baseline');
  assertObject(baselineSource, 'baselineSource');
  assertObject(owners, 'owners');
  if (!Array.isArray(records)) throw new TypeError('records must be an array');
  if (!(reachableCommits instanceof Set)) throw new TypeError('reachableCommits must be a Set');

  const state = clone(baseline);
  const provenance = {};
  const conflicts = [];
  const applied = [];
  const rejected = [];

  const candidates = records.map((record) => {
    try {
      validateRecord(record, owners, reachableCommits);
      return { record, valid: true };
    } catch (error) {
      rejected.push({ record_id: record?.record_id ?? null, reason: error.message });
      return { record, valid: false };
    }
  }).filter((candidate) => candidate.valid)
    .sort((a, b) => Date.parse(a.record.committed_at) - Date.parse(b.record.committed_at) || a.record.record_id.localeCompare(b.record.record_id));

  const assertions = new Map();

  for (const { record } of candidates) {
    for (const patch of record.patches) {
      const previous = assertions.get(patch.path);
      const currentAssertion = { value: clone(patch.value), locator: sourceLocator(record), supersedes: record.supersedes ?? [] };

      if (previous && JSON.stringify(previous.value) !== JSON.stringify(currentAssertion.value)) {
        const causallySupersedes = currentAssertion.supersedes.includes(previous.locator.record_id);
        if (!causallySupersedes) {
          conflicts.push({
            path: patch.path,
            state: 'unresolved_conflict',
            assertions: [previous, currentAssertion]
          });
          provenance[patch.path] = { state: 'unresolved_conflict', sources: [previous.locator, currentAssertion.locator] };
          continue;
        }
      }

      setAt(state, patch.path, patch.value);
      assertions.set(patch.path, currentAssertion);
      provenance[patch.path] = { state: 'resolved', source: currentAssertion.locator };
    }
    applied.push(record.record_id);
  }

  return {
    schema_version: '1.0.0',
    baseline_source: clone(baselineSource),
    effective_state: state,
    provenance,
    conflicts,
    applied_records: applied,
    rejected_records: rejected,
    verified: conflicts.length === 0 && rejected.length === 0
  };
}

export function materializeQueueBaseline(activeQueue) {
  assertObject(activeQueue, 'activeQueue');
  if (!Array.isArray(activeQueue.items)) throw new TypeError('activeQueue.items must be an array');
  return {
    queue: Object.fromEntries(activeQueue.items.map((item) => [item.id, clone(item)])),
    hard_boundaries: []
  };
}
