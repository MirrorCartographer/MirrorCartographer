import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ITEM_FIELDS = ['owner', 'priority', 'action', 'dependencies', 'required_evidence', 'status', 'progress', 'handoff', 'blocker'];

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function canonicalEvent(update, source) {
  const item = update?.queue_item;
  if (!item?.id || !item?.owner) throw new Error(`Invalid queue update ${source}: queue_item.id and owner are required`);
  const observedAt = update.observed_at ?? update.updated_at ?? update.created_at ?? null;
  return {
    source,
    item,
    eventOrder: update.event_order ?? null,
    observedAt,
  };
}

function compareEvents(a, b) {
  const ao = Number.isInteger(a.eventOrder) ? a.eventOrder : Number.MAX_SAFE_INTEGER;
  const bo = Number.isInteger(b.eventOrder) ? b.eventOrder : Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  const at = a.observedAt ?? '';
  const bt = b.observedAt ?? '';
  if (at !== bt) return at.localeCompare(bt);
  return a.source.localeCompare(b.source);
}

export function materializeQueue({ baseline, updates }) {
  if (!Array.isArray(baseline?.items)) throw new Error('Baseline must contain an items array');
  const items = new Map();
  const provenance = {};
  const conflicts = [];

  for (const item of baseline.items) {
    if (!item?.id || !item?.owner) throw new Error('Every baseline item requires id and owner');
    items.set(item.id, clone(item));
    provenance[item.id] = {};
    for (const field of ITEM_FIELDS) {
      if (item[field] !== undefined) provenance[item.id][field] = { source: 'operations/ACTIVE_QUEUE.json', kind: 'baseline' };
    }
  }

  const events = updates.map(({ document, source }) => canonicalEvent(document, source)).sort(compareEvents);
  const seenOrder = new Map();

  for (const event of events) {
    const orderKey = `${event.eventOrder ?? 'none'}|${event.observedAt ?? 'none'}`;
    const priorAtOrder = seenOrder.get(orderKey) ?? [];
    priorAtOrder.push(event);
    seenOrder.set(orderKey, priorAtOrder);

    const existing = items.get(event.item.id);
    if (existing && existing.owner !== event.item.owner) {
      conflicts.push({
        type: 'owner_mismatch',
        item_id: event.item.id,
        existing_owner: existing.owner,
        incoming_owner: event.item.owner,
        source: event.source,
      });
      continue;
    }

    const next = existing ?? { id: event.item.id, owner: event.item.owner };
    provenance[event.item.id] ??= {
      owner: { source: event.source, kind: 'overlay' },
    };

    for (const field of ITEM_FIELDS) {
      if (event.item[field] === undefined) continue;
      const previous = next[field];
      const previousSource = provenance[event.item.id][field];
      if (previousSource?.kind === 'overlay' && previousSource.order_key === orderKey && stable(previous) !== stable(event.item[field])) {
        conflicts.push({
          type: 'same_order_field_conflict',
          item_id: event.item.id,
          field,
          prior_source: previousSource.source,
          incoming_source: event.source,
          prior_value: clone(previous),
          incoming_value: clone(event.item[field]),
        });
        continue;
      }
      next[field] = clone(event.item[field]);
      provenance[event.item.id][field] = {
        source: event.source,
        kind: 'overlay',
        event_order: event.eventOrder,
        observed_at: event.observedAt,
        order_key: orderKey,
      };
    }
    items.set(event.item.id, next);
  }

  return {
    schema_version: '1.0.0',
    authoritative: false,
    baseline_source: 'operations/ACTIVE_QUEUE.json',
    ordering_rule: 'event_order ascending, then observed_at ascending, then source path lexical ascending',
    conflict_rule: 'owner mismatches and incompatible writes at the same effective order are retained as conflicts; conflicted incoming fields do not overwrite the prior value',
    items: [...items.values()].sort((a, b) => a.id.localeCompare(b.id)),
    provenance,
    conflicts,
    source_count: 1 + updates.length,
  };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

export async function materializeFromPaths({ baselinePath, updatePaths }) {
  const baseline = await readJson(baselinePath);
  const updates = [];
  for (const source of [...updatePaths].sort()) updates.push({ source, document: await readJson(source) });
  return materializeQueue({ baseline, updates });
}

async function main() {
  const [baselinePath, updatesDirectory, outputPath] = process.argv.slice(2);
  if (!baselinePath || !updatesDirectory || !outputPath) {
    throw new Error('Usage: node materialize-queue-overlays.mjs <baseline.json> <updates-directory> <output.json>');
  }
  const names = (await fs.readdir(updatesDirectory)).filter((name) => name.endsWith('.json'));
  const updatePaths = names.map((name) => path.join(updatesDirectory, name));
  const result = await materializeFromPaths({ baselinePath, updatePaths });
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  if (result.conflicts.length) process.exitCode = 2;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
