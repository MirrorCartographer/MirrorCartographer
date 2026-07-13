import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_STATES = new Set(['queued','active','blocked','blocked_external_configuration','completed','cancelled','superseded']);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function eventTime(record, fallback = null) {
  return record.completed_at ?? record.updated_at ?? record.created_at ?? fallback;
}

function compareProjection(a, b) {
  const at = eventTime(a.record, a.commit_time ?? '');
  const bt = eventTime(b.record, b.commit_time ?? '');
  if (at !== bt) return String(at).localeCompare(String(bt));
  return String(a.path).localeCompare(String(b.path));
}

function normalizeProjection(input) {
  const record = input.record ?? input;
  if (!record.item_id || !record.owner || !record.status) {
    throw new Error(`Invalid queue projection at ${input.path ?? '<memory>'}: item_id, owner, and status are required`);
  }
  if (!VALID_STATES.has(record.status)) {
    throw new Error(`Invalid queue status ${record.status} for ${record.item_id}`);
  }
  return {
    path: input.path ?? '<memory>',
    commit: input.commit ?? null,
    commit_time: input.commit_time ?? null,
    record: clone(record)
  };
}

export function reduceEffectiveQueue(snapshot, projectionInputs = []) {
  if (!snapshot || !Array.isArray(snapshot.items)) {
    throw new Error('Snapshot must contain an items array');
  }

  const projections = projectionInputs.map(normalizeProjection).sort(compareProjection);
  const items = new Map();
  const conflicts = [];

  for (const item of snapshot.items) {
    items.set(item.id, {
      ...clone(item),
      provenance: {
        source: 'operations/ACTIVE_QUEUE.json',
        snapshot_updated_at: snapshot.updated_at ?? null,
        fields: Object.fromEntries(Object.keys(item).map((key) => [key, { source: 'snapshot' }]))
      }
    });
  }

  const grouped = new Map();
  for (const projection of projections) {
    const list = grouped.get(projection.record.item_id) ?? [];
    list.push(projection);
    grouped.set(projection.record.item_id, list);
  }

  for (const [itemId, list] of grouped) {
    let effective = items.get(itemId) ?? {
      id: itemId,
      provenance: { source: null, snapshot_updated_at: snapshot.updated_at ?? null, fields: {} }
    };

    for (let index = 0; index < list.length; index += 1) {
      const current = list[index];
      const previous = index > 0 ? list[index - 1] : null;
      const currentTime = eventTime(current.record, current.commit_time);
      const previousTime = previous ? eventTime(previous.record, previous.commit_time) : null;

      if (previous && currentTime === previousTime) {
        const competingFields = ['status','owner','priority','action'];
        const differing = competingFields.filter((field) =>
          current.record[field] !== undefined && previous.record[field] !== undefined && current.record[field] !== previous.record[field]
        );
        if (differing.length > 0) {
          conflicts.push({
            item_id: itemId,
            event_time: currentTime,
            fields: differing,
            sources: [previous.path, current.path],
            resolution: 'unresolved_equal_time_conflict'
          });
          continue;
        }
      }

      for (const [field, value] of Object.entries(current.record)) {
        if (field === 'item_id' || field === 'schema_version') continue;
        effective[field] = clone(value);
        effective.provenance.fields[field] = {
          source: current.path,
          commit: current.commit,
          event_time: currentTime
        };
      }
      effective.id = itemId;
      effective.provenance.source = current.path;
      effective.provenance.commit = current.commit;
      effective.provenance.event_time = currentTime;
    }

    items.set(itemId, effective);
  }

  const effectiveItems = [...items.values()].sort((a, b) => {
    const owner = String(a.owner ?? '').localeCompare(String(b.owner ?? ''));
    if (owner !== 0) return owner;
    const priority = Number(a.priority ?? Number.MAX_SAFE_INTEGER) - Number(b.priority ?? Number.MAX_SAFE_INTEGER);
    if (priority !== 0) return priority;
    return String(a.id).localeCompare(String(b.id));
  });

  return {
    schema_version: '1.0.0',
    generated_from: {
      snapshot_updated_at: snapshot.updated_at ?? null,
      projection_count: projections.length,
      source_records_preserved: true
    },
    items: effectiveItems,
    conflicts,
    selection_safe: conflicts.length === 0,
    rule: 'Never rewrite source records. Refuse silent conflict collapse; equal-time contradictory projections remain unresolved.'
  };
}

export async function loadAndReduce({ repositoryRoot = process.cwd() } = {}) {
  const snapshotPath = path.join(repositoryRoot, 'operations', 'ACTIVE_QUEUE.json');
  const updatesDir = path.join(repositoryRoot, 'operations', 'queue-updates');
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
  const names = (await readdir(updatesDir)).filter((name) => name.endsWith('.json')).sort();
  const projections = await Promise.all(names.map(async (name) => ({
    path: path.posix.join('operations', 'queue-updates', name),
    record: JSON.parse(await readFile(path.join(updatesDir, name), 'utf8'))
  })));
  return reduceEffectiveQueue(snapshot, projections);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await loadAndReduce({ repositoryRoot: process.argv[2] ?? process.cwd() });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.selection_safe) process.exitCode = 2;
}
