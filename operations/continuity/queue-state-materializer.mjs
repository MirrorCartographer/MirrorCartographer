import crypto from 'node:crypto';

const OWNER_PREFIX = Object.freeze({
  V: 'vercel_studio',
  C: 'cloudflare_research',
  W: 'independent_creative_web',
  M: 'continuity_mining',
  R: 'frontier_research'
});

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function sha256Json(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

function requireString(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`${name} must be a non-empty string`);
}

function parseTime(value, name) {
  requireString(value, name);
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw new Error(`${name} must be an ISO-8601 timestamp`);
  return ms;
}

export function validateUpdate(update) {
  if (!update || typeof update !== 'object' || Array.isArray(update)) throw new Error('update must be an object');
  requireString(update.item_id, 'item_id');
  requireString(update.owner, 'owner');
  requireString(update.status, 'status');
  requireString(update.action, 'action');
  parseTime(update.completed_at ?? update.updated_at, 'completed_at or updated_at');
  const prefix = update.item_id.split('-')[0];
  if (!OWNER_PREFIX[prefix]) throw new Error(`unknown item prefix: ${prefix}`);
  if (OWNER_PREFIX[prefix] !== update.owner) {
    throw new Error(`owner mismatch for ${update.item_id}: expected ${OWNER_PREFIX[prefix]}, received ${update.owner}`);
  }
  if (update.canonical_queue_update_policy && !update.canonical_queue_update_policy.includes('Append-only')) {
    throw new Error('canonical_queue_update_policy must declare append-only behavior');
  }
  return true;
}

export function materializeQueue({ baseline, updates, baselinePath = 'operations/ACTIVE_QUEUE.json', updatePaths = [] }) {
  if (!baseline || !Array.isArray(baseline.items)) throw new Error('baseline.items must be an array');
  if (!Array.isArray(updates)) throw new Error('updates must be an array');
  if (updatePaths.length && updatePaths.length !== updates.length) throw new Error('updatePaths length must match updates length');

  const state = new Map();
  const provenance = [];
  const conflicts = [];

  for (const item of baseline.items) {
    requireString(item.id, 'baseline item id');
    requireString(item.owner, `baseline owner for ${item.id}`);
    state.set(item.id, { ...item, provenance: [{ source: baselinePath, kind: 'baseline' }] });
  }

  const ordered = updates.map((update, index) => {
    validateUpdate(update);
    return {
      update,
      path: updatePaths[index] ?? `update:${index}`,
      time: parseTime(update.completed_at ?? update.updated_at, 'completed_at or updated_at'),
      digest: sha256Json(update)
    };
  }).sort((a, b) => a.time - b.time || a.path.localeCompare(b.path));

  const seenDigestByPath = new Map();
  for (const entry of ordered) {
    if (seenDigestByPath.has(entry.path) && seenDigestByPath.get(entry.path) !== entry.digest) {
      throw new Error(`same update path has different content: ${entry.path}`);
    }
    seenDigestByPath.set(entry.path, entry.digest);

    const prior = state.get(entry.update.item_id);
    const event = {
      source: entry.path,
      kind: 'append_only_update',
      digest: entry.digest,
      observed_at: new Date(entry.time).toISOString()
    };
    provenance.push({ item_id: entry.update.item_id, ...event });

    if (prior && prior.owner !== entry.update.owner) {
      conflicts.push({
        item_id: entry.update.item_id,
        type: 'owner_conflict',
        prior_owner: prior.owner,
        update_owner: entry.update.owner,
        source: entry.path
      });
      continue;
    }

    const next = {
      ...(prior ?? { id: entry.update.item_id }),
      owner: entry.update.owner,
      priority: entry.update.priority ?? prior?.priority ?? null,
      action: entry.update.action,
      status: entry.update.status,
      progress: entry.update,
      provenance: [...(prior?.provenance ?? []), event]
    };
    state.set(entry.update.item_id, next);
  }

  return stable({
    schema_version: '1.0.0',
    claim_ceiling: 'candidate_compaction_only',
    baseline: { path: baselinePath, digest: sha256Json(baseline) },
    applied_update_count: ordered.length,
    items: [...state.values()].sort((a, b) => a.id.localeCompare(b.id)),
    conflicts,
    provenance,
    limits: [
      'Does not prove referenced commits or evidence exist.',
      'Does not prove peer runs, deployments, tests, or human outcomes occurred.',
      'Must not replace the canonical queue without an explicit reviewed compaction record.'
    ]
  });
}
