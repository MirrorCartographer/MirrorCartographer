import fs from 'node:fs';

const CLAIM_STATES = new Set(['observed', 'inferred', 'proposed', 'superseded', 'unresolved']);

function parseTime(value) {
  const ms = Date.parse(value ?? '');
  return Number.isFinite(ms) ? ms : null;
}

function normalizeUpdate(update, sourcePath, index) {
  const itemId = update.item_id ?? update.id;
  if (!itemId || typeof itemId !== 'string') {
    throw new Error(`Update ${sourcePath} is missing item_id`);
  }
  const timestamp = update.updated_at ?? update.observed_at ?? update.completed_at ?? update.created_at ?? null;
  return {
    itemId,
    owner: update.owner ?? null,
    status: update.status ?? null,
    priority: Number.isFinite(update.priority) ? update.priority : null,
    action: update.action ?? null,
    progress: update.progress ?? null,
    claims: update.claims ?? null,
    timestamp,
    timestampMs: parseTime(timestamp),
    sourcePath,
    sourceSha: update.source_sha ?? update.sha ?? null,
    sourceIndex: index,
    raw: update
  };
}

function compareUpdates(a, b) {
  if (a.timestampMs !== null && b.timestampMs !== null && a.timestampMs !== b.timestampMs) {
    return a.timestampMs - b.timestampMs;
  }
  if (a.timestampMs === null && b.timestampMs !== null) return -1;
  if (a.timestampMs !== null && b.timestampMs === null) return 1;
  const pathOrder = a.sourcePath.localeCompare(b.sourcePath);
  return pathOrder || a.sourceIndex - b.sourceIndex;
}

function materialFields(update) {
  return JSON.stringify({
    owner: update.owner,
    status: update.status,
    priority: update.priority,
    action: update.action,
    progress: update.progress,
    claims: update.claims
  });
}

export function reconcileEffectiveQueue(canonicalQueue, updateInputs) {
  if (!canonicalQueue || !Array.isArray(canonicalQueue.items)) {
    throw new Error('canonicalQueue.items must be an array');
  }

  const sourceItems = new Map(canonicalQueue.items.map((item) => [item.id, structuredClone(item)]));
  const normalized = updateInputs.map((entry, index) => normalizeUpdate(entry.update, entry.sourcePath, index));
  const grouped = new Map();
  for (const update of normalized) {
    if (!grouped.has(update.itemId)) grouped.set(update.itemId, []);
    grouped.get(update.itemId).push(update);
  }

  const effectiveItems = [];
  const conflicts = [];
  const provenance = [];
  const itemIds = new Set([...sourceItems.keys(), ...grouped.keys()]);

  for (const itemId of [...itemIds].sort()) {
    const base = sourceItems.get(itemId) ?? { id: itemId };
    const updates = (grouped.get(itemId) ?? []).sort(compareUpdates);
    const byTimestamp = new Map();
    for (const update of updates) {
      const key = update.timestamp ?? 'missing_timestamp';
      if (!byTimestamp.has(key)) byTimestamp.set(key, []);
      byTimestamp.get(key).push(update);
    }

    for (const [timestamp, peers] of byTimestamp) {
      const variants = new Map(peers.map((u) => [materialFields(u), u]));
      if (peers.length > 1 && variants.size > 1) {
        conflicts.push({
          item_id: itemId,
          timestamp,
          reason: 'concurrent_materially_different_updates',
          sources: peers.map((u) => u.sourcePath).sort()
        });
      }
    }

    let effective = structuredClone(base);
    for (const update of updates) {
      for (const field of ['owner', 'status', 'priority', 'action', 'progress', 'claims']) {
        if (update[field] !== null && update[field] !== undefined) effective[field] = structuredClone(update[field]);
      }
      provenance.push({
        item_id: itemId,
        source_path: update.sourcePath,
        source_sha: update.sourceSha,
        timestamp: update.timestamp,
        applied_order: provenance.length
      });
    }
    effectiveItems.push(effective);
  }

  return {
    schema_version: '1.0.0',
    generated_kind: 'derived_effective_queue',
    source_policy: 'canonical snapshot plus ordered append-only updates; source artifacts remain unchanged',
    ordering_rule: 'valid timestamp ascending, then source path lexicographically, then input order',
    conflict_policy: 'surface materially different updates sharing an item and timestamp; do not silently erase either source',
    effective_items: effectiveItems,
    conflicts,
    provenance,
    claim_states_supported: [...CLAIM_STATES]
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [canonicalPath, ...updatePaths] = process.argv.slice(2);
  if (!canonicalPath || updatePaths.length === 0) {
    console.error('Usage: node effective-queue-reconciler.mjs <ACTIVE_QUEUE.json> <queue-update.json> [...]');
    process.exit(2);
  }
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  const updates = updatePaths.map((sourcePath) => ({
    sourcePath,
    update: JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  }));
  process.stdout.write(`${JSON.stringify(reconcileEffectiveQueue(canonical, updates), null, 2)}\n`);
}
