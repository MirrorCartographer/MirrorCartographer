function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be an object`);
}

function iso(value, label) {
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be an ISO date-time`);
  return new Date(value).toISOString();
}

function pointerEscape(value) {
  return String(value).replace(/~/g, '~0').replace(/\//g, '~1');
}

const STATUS_MAP = new Set(['queued','active','completed','blocked','blocked_external_configuration','superseded']);

export function normalizeQueueUpdate(update, { sourcePath, sourceCommit, committedAt, owners }) {
  assertObject(update, 'update');
  assertObject(owners, 'owners');
  for (const field of ['queue_item', 'owner', 'status']) if (update[field] === undefined) throw new Error(`update missing ${field}`);
  if (owners[update.queue_item] !== update.owner) throw new Error(`owner mismatch for ${update.queue_item}`);
  if (!STATUS_MAP.has(update.status)) throw new Error(`unsupported queue status ${update.status}`);
  if (typeof sourcePath !== 'string' || !sourcePath.startsWith('operations/queue-updates/')) throw new Error('sourcePath must be an operations/queue-updates path');
  if (!/^[0-9a-f]{40}$/i.test(sourceCommit)) throw new Error('sourceCommit must be a 40-character git SHA');

  const when = iso(committedAt ?? update.recorded_at, 'committedAt');
  const base = `/queue/${pointerEscape(update.queue_item)}`;
  const patches = [{ path: `${base}/status`, value: update.status }];

  if ('completed_slice' in update) patches.push({ path: `${base}/progress/completed_slice`, value: update.completed_slice });
  if ('handoff' in update) patches.push({ path: `${base}/handoff`, value: update.handoff });
  if ('remaining' in update) patches.push({ path: `${base}/progress/remaining`, value: update.remaining });
  if ('verification' in update) patches.push({ path: `${base}/progress/verification`, value: update.verification });
  if ('artifacts' in update) patches.push({ path: `${base}/progress/artifacts`, value: update.artifacts });
  if ('commits' in update) patches.push({ path: `${base}/progress/commits`, value: update.commits });
  if ('memory_record' in update) patches.push({ path: `${base}/progress/memory_record`, value: update.memory_record });
  if ('blocker' in update) patches.push({ path: `${base}/blocker`, value: update.blocker });

  return {
    record_id: `normalized:${sourceCommit}:${update.queue_item}`,
    queue_item: update.queue_item,
    owner: update.owner,
    source_path: sourcePath,
    source_commit: sourceCommit.toLowerCase(),
    committed_at: when,
    patches,
    supersedes: Array.isArray(update.supersedes) ? [...update.supersedes] : [],
    claim_state: 'observed',
    evidence_strength: 'repository_record',
    normalization: { schema_version: '1.0.0', omitted_fields: Object.keys(update).filter((key) => !['queue_item','owner','status','completed_slice','handoff','remaining','verification','artifacts','commits','memory_record','blocker','recorded_at','supersedes'].includes(key)) }
  };
}
