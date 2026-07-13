import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function materializeQueueState({ baseQueue, updates, enumerationComplete = false }) {
  if (!baseQueue || !Array.isArray(baseQueue.items)) throw new Error('invalid base queue');
  if (!Array.isArray(updates)) throw new Error('updates must be an array');

  const orders = new Set();
  const ids = new Set();
  const normalized = updates.map((entry, index) => {
    if (!entry || !Number.isInteger(entry.event_order)) throw new Error(`update ${index} missing integer event_order`);
    if (orders.has(entry.event_order)) throw new Error(`event_order collision: ${entry.event_order}`);
    orders.add(entry.event_order);
    const item = entry.queue_item;
    if (!item || typeof item.id !== 'string' || typeof item.owner !== 'string') throw new Error(`update ${entry.event_order} has invalid queue_item`);
    if (ids.has(item.id)) throw new Error(`duplicate queue item update in explicit set: ${item.id}`);
    ids.add(item.id);
    return { event_order: entry.event_order, observed_at: entry.observed_at ?? null, queue_item: structuredClone(item) };
  }).sort((a, b) => a.event_order - b.event_order);

  const items = new Map(baseQueue.items.map(item => [item.id, structuredClone(item)]));
  for (const update of normalized) items.set(update.queue_item.id, update.queue_item);

  return {
    schema_version: '1.0.0',
    authoritative: Boolean(enumerationComplete),
    authority_reason: enumerationComplete
      ? 'caller attested complete repository enumeration for the supplied update set'
      : 'explicit update set was materialized without proof of complete repository enumeration',
    base: {
      schema_version: baseQueue.schema_version ?? null,
      updated_at: baseQueue.updated_at ?? null,
      item_count: baseQueue.items.length
    },
    applied_events: normalized.map(({ event_order, observed_at, queue_item }) => ({ event_order, observed_at, queue_item_id: queue_item.id })),
    items: [...items.values()]
  };
}

function parseArgs(argv) {
  const result = { updates: [], enumerationComplete: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base') result.base = argv[++i];
    else if (arg === '--update') result.updates.push(argv[++i]);
    else if (arg === '--enumeration-complete') result.enumerationComplete = true;
    else if (arg === '--out') result.out = argv[++i];
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!result.base) throw new Error('--base is required');
  return result;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const output = materializeQueueState({
      baseQueue: readJson(args.base),
      updates: args.updates.map(readJson),
      enumerationComplete: args.enumerationComplete
    });
    const serialized = `${JSON.stringify(output, null, 2)}\n`;
    if (args.out) {
      fs.mkdirSync(path.dirname(args.out), { recursive: true });
      fs.writeFileSync(args.out, serialized, { flag: 'wx' });
    } else process.stdout.write(serialized);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
