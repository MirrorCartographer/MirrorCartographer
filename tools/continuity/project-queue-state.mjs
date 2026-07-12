const TERMINAL = new Set(['completed', 'cancelled', 'superseded', 'failed']);

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(stable(value));
}

function timestampOf(record) {
  return record.recorded_at ?? record.updated_at ?? record.generated_at ?? null;
}

function validateTimestamp(value, label) {
  if (value === null) return;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} has an invalid timestamp`);
  }
}

function normalizeSource(record, index) {
  const source = record.__source ?? `delta:${String(index).padStart(6, '0')}`;
  return String(source);
}

function compareClaims(a, b) {
  const at = timestampOf(a.record);
  const bt = timestampOf(b.record);
  if (at !== bt) {
    if (at === null) return -1;
    if (bt === null) return 1;
    return at.localeCompare(bt);
  }
  return a.source.localeCompare(b.source) || canonicalJson(a.record).localeCompare(canonicalJson(b.record));
}

function publicRecord(record) {
  return Object.fromEntries(Object.entries(record).filter(([key]) => !key.startsWith('__')));
}

export function projectQueueState({ canonical, deltas }) {
  if (!canonical || !Array.isArray(canonical.items)) throw new Error('canonical.items must be an array');
  if (!Array.isArray(deltas)) throw new Error('deltas must be an array');

  const owners = new Map();
  const histories = new Map();

  canonical.items.forEach((item, index) => {
    if (!item?.id || !item?.owner || !item?.status) throw new Error(`canonical item ${index} is incomplete`);
    if (owners.has(item.id)) throw new Error(`duplicate canonical id: ${item.id}`);
    owners.set(item.id, item.owner);
    histories.set(item.id, [{ source: 'operations/ACTIVE_QUEUE.json', record: item, layer: 'canonical' }]);
  });

  deltas.forEach((delta, index) => {
    if (!delta?.id || !delta?.owner || !delta?.status) throw new Error(`delta ${index} is incomplete`);
    validateTimestamp(timestampOf(delta), `delta ${delta.id}`);
    const knownOwner = owners.get(delta.id);
    if (knownOwner && knownOwner !== delta.owner) {
      throw new Error(`ownership mutation rejected for ${delta.id}: ${knownOwner} -> ${delta.owner}`);
    }
    owners.set(delta.id, delta.owner);
    const history = histories.get(delta.id) ?? [];
    history.push({ source: normalizeSource(delta, index), record: delta, layer: 'delta' });
    histories.set(delta.id, history);
  });

  const items = [...histories.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, claims]) => {
    const ordered = [...claims].sort(compareClaims);
    const terminalStatuses = [...new Set(ordered.map(({ record }) => record.status).filter((status) => TERMINAL.has(status)))];
    const hasTerminalConflict = terminalStatuses.length > 1;
    const latest = ordered.at(-1);
    return {
      id,
      owner: owners.get(id),
      derived_status: hasTerminalConflict ? 'conflicted' : latest.record.status,
      effective_claim: hasTerminalConflict ? null : { source: latest.source, record: publicRecord(latest.record) },
      conflicts: hasTerminalConflict ? terminalStatuses.sort() : [],
      history: ordered.map(({ source, layer, record }) => ({ source, layer, record: publicRecord(record) }))
    };
  });

  return stable({
    schema_version: '1.0.0',
    authority: 'derived_non_authoritative',
    source_snapshot: 'operations/ACTIVE_QUEUE.json',
    item_count: items.length,
    items
  });
}

export function serializeProjectedQueue(input) {
  return `${JSON.stringify(projectQueueState(input), null, 2)}\n`;
}
