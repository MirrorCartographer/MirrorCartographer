import crypto from 'node:crypto';

const SHA_RE = /^[0-9a-f]{40}$/;
const SUPPORTED_SCHEMA = new Set(['1.0.0']);
const VALID_STATUS = new Set(['queued','active','blocked','blocked_external_configuration','completed','superseded','cancelled']);

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function reject(code, message, details = {}) {
  return { code, message, ...details };
}

function validItemShape(item) {
  return item && typeof item === 'object' &&
    typeof item.id === 'string' && item.id.length > 0 &&
    typeof item.owner === 'string' && item.owner.length > 0 &&
    Number.isInteger(item.priority) &&
    typeof item.status === 'string' && VALID_STATUS.has(item.status) &&
    Array.isArray(item.dependencies) && item.dependencies.every((d) => typeof d === 'string');
}

function normalizeUpdate(record) {
  return {
    id: record.item_id,
    owner: record.owner,
    priority: record.priority,
    status: record.status,
    action: record.action,
    dependencies: record.dependencies,
    updated_at: record.updated_at,
    source: 'append_only_update'
  };
}

export function buildEffectiveQueue(input) {
  const contradictions = [];
  const rejected_records = [];

  if (!input || typeof input !== 'object') {
    return { gate_status: 'rejected', contradictions, rejected_records: [reject('EQG-000','input must be an object')] };
  }

  const { source_commit, canonical_queue_blob_sha, canonical_queue, discovered_update_paths, updates } = input;

  if (!SHA_RE.test(source_commit ?? '')) rejected_records.push(reject('EQG-001','source_commit must be an immutable 40-character lowercase git SHA'));
  if (!SHA_RE.test(canonical_queue_blob_sha ?? '')) rejected_records.push(reject('EQG-007','canonical_queue_blob_sha must be a 40-character lowercase git SHA'));

  if (!canonical_queue || !SUPPORTED_SCHEMA.has(canonical_queue.schema_version) || !Array.isArray(canonical_queue.items)) {
    rejected_records.push(reject('EQG-002','canonical queue must parse with a supported schema and items array'));
  }

  if (!Array.isArray(discovered_update_paths) || !Array.isArray(updates)) {
    rejected_records.push(reject('EQG-004','discovered_update_paths and updates must both be arrays'));
  }

  const discoveredCount = Array.isArray(discovered_update_paths) ? discovered_update_paths.length : 0;
  const parsedCount = Array.isArray(updates) ? updates.length : 0;
  if (discoveredCount !== parsedCount) {
    rejected_records.push(reject('EQG-004','discovered and parsed update counts differ',{ discovered_count: discoveredCount, parsed_count: parsedCount }));
  }

  const pathSet = new Set(discovered_update_paths ?? []);
  if (pathSet.size !== discoveredCount) rejected_records.push(reject('EQG-004','discovered update paths must be unique'));

  const canonicalItems = canonical_queue?.items ?? [];
  for (const item of canonicalItems) {
    if (!validItemShape(item)) rejected_records.push(reject('EQG-005','canonical item has incompatible fields',{ item_id: item?.id ?? null }));
  }

  const normalizedUpdates = [];
  const input_update_blob_shas = [];
  for (const entry of updates ?? []) {
    const { path, blob_sha, record } = entry ?? {};
    if (!pathSet.has(path)) rejected_records.push(reject('EQG-004','parsed update path was not independently discovered',{ path }));
    if (!SHA_RE.test(blob_sha ?? '')) rejected_records.push(reject('EQG-007','update blob SHA is invalid',{ path }));
    else input_update_blob_shas.push(blob_sha);
    if (!record || !SUPPORTED_SCHEMA.has(record.schema_version)) {
      rejected_records.push(reject('EQG-003','update record has unsupported or missing schema',{ path }));
      continue;
    }
    const candidate = normalizeUpdate(record);
    if (!validItemShape(candidate) || typeof candidate.updated_at !== 'string' || Number.isNaN(Date.parse(candidate.updated_at))) {
      rejected_records.push(reject('EQG-005','update record has incompatible fields',{ path, item_id: record.item_id ?? null }));
      continue;
    }
    normalizedUpdates.push({ ...candidate, path, blob_sha });
  }

  const versions = new Map();
  for (const item of canonicalItems) {
    const version = { ...item, source: 'canonical_queue', updated_at: canonical_queue.updated_at ?? null, path: 'operations/ACTIVE_QUEUE.json', blob_sha: canonical_queue_blob_sha };
    versions.set(item.id, [version]);
  }
  for (const item of normalizedUpdates) {
    const list = versions.get(item.id) ?? [];
    list.push(item);
    versions.set(item.id, list);
  }

  const effective_items = [];
  for (const [itemId, itemVersions] of versions.entries()) {
    const sorted = [...itemVersions].sort((a,b) => Date.parse(a.updated_at ?? 0) - Date.parse(b.updated_at ?? 0));
    if (sorted.length > 1) {
      const newest = sorted.at(-1);
      const sameTime = sorted.filter((v) => v.updated_at === newest.updated_at);
      const distinct = new Set(sameTime.map((v) => digest({owner:v.owner,priority:v.priority,status:v.status,action:v.action,dependencies:v.dependencies})));
      if (sameTime.length > 1 && distinct.size > 1) {
        contradictions.push({ code:'EQG-006', item_id:itemId, type:'ambiguous_same_timestamp_precedence', versions:sameTime.map((v)=>({path:v.path,blob_sha:v.blob_sha,updated_at:v.updated_at})) });
        continue;
      }
    }
    effective_items.push(sorted.at(-1));
  }

  if (contradictions.length) rejected_records.push(reject('EQG-008','unresolved contradictions affect task selection',{ count: contradictions.length }));

  const gate_status = rejected_records.length === 0 ? 'accepted' : 'rejected';
  return {
    schema_version: '1.0.0',
    artifact_type: 'effective_queue',
    source_commit,
    canonical_queue_blob_sha,
    discovered_update_count: discoveredCount,
    parsed_update_count: parsedCount,
    input_update_blob_shas: [...new Set(input_update_blob_shas)].sort(),
    effective_items: gate_status === 'accepted' ? effective_items.sort((a,b)=>a.priority-b.priority || a.id.localeCompare(b.id)) : [],
    contradictions,
    rejected_records,
    gate_status,
    input_manifest_sha256: digest({ source_commit, canonical_queue_blob_sha, discovered_update_paths:[...(discovered_update_paths ?? [])].sort(), input_update_blob_shas:[...new Set(input_update_blob_shas)].sort() })
  };
}
