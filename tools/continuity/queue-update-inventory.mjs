import { resolveEffectiveQueueState } from './effective-queue-state.mjs';

const SHA40 = /^[0-9a-f]{40}$/i;
const QUEUE_PATH = /^operations\/queue-updates\/[A-Z]-\d{3}-.+\.json$/;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new TypeError('inventory entry must be an object');
  if (!QUEUE_PATH.test(entry.path || '')) throw new Error(`invalid queue-update path: ${entry.path || '<missing>'}`);
  if (!SHA40.test(entry.commit || '')) throw new Error(`missing or invalid immutable commit for ${entry.path}`);

  const record = typeof entry.content === 'string' ? JSON.parse(entry.content) : clone(entry.content);
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`invalid JSON record at ${entry.path}`);
  if (!record.queue_item?.id || !record.queue_item?.owner) throw new Error(`queue_item id and owner required at ${entry.path}`);
  if (!record.created_at || Number.isNaN(Date.parse(record.created_at))) throw new Error(`valid created_at required at ${entry.path}`);

  return {
    ...record,
    record_id: record.record_id || `${record.queue_item.id}@${record.created_at}`,
    owner: record.owner || record.queue_item.owner,
    path: entry.path,
    commit: entry.commit,
    created_at: record.created_at
  };
}

export function inventoryQueueUpdates(entries) {
  if (!Array.isArray(entries)) throw new TypeError('entries must be an array');

  const accepted = [];
  const rejected = [];
  const seenPaths = new Set();
  const seenRecordIds = new Set();

  for (const entry of entries) {
    try {
      const record = parseEntry(entry);
      if (seenPaths.has(record.path)) throw new Error(`duplicate path: ${record.path}`);
      if (seenRecordIds.has(record.record_id)) throw new Error(`duplicate record_id: ${record.record_id}`);
      seenPaths.add(record.path);
      seenRecordIds.add(record.record_id);
      accepted.push(record);
    } catch (error) {
      rejected.push({ path: entry?.path || null, reason: error.message });
    }
  }

  accepted.sort((a, b) => {
    const time = Date.parse(a.created_at) - Date.parse(b.created_at);
    if (time) return time;
    const commit = a.commit.localeCompare(b.commit);
    if (commit) return commit;
    return a.path.localeCompare(b.path);
  });

  return {
    schema_version: '1.0.0',
    accepted,
    rejected,
    ordering: ['created_at', 'commit', 'path'],
    interpretation: {
      observed: 'Inventory entries were validated as immutable, owner-attributed queue-update records.',
      inferred: 'Temporal provenance must be retained independently from filenames.',
      proposed: 'Repository adapters should supply exact path, bytes, and commit for every candidate record.',
      superseded: 'Filename order alone is not a reliable continuity chronology.',
      unresolved: 'This adapter validates supplied inventory metadata; it does not independently query Git history or prove referenced claims.'
    }
  };
}

export function resolveInventoriedQueueState(canonicalQueue, entries) {
  const inventory = inventoryQueueUpdates(entries);
  const effective = resolveEffectiveQueueState(canonicalQueue, inventory.accepted);
  return { inventory, effective };
}
