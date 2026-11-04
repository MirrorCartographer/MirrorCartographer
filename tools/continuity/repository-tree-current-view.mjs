const UPDATE_PREFIX = 'operations/queue-updates/';
const JSON_SUFFIX = '.json';

export function enumerateQueueUpdatePaths(tree) {
  if (!tree || !Array.isArray(tree.tree)) {
    throw new TypeError('tree.tree must be an array');
  }
  if (tree.truncated === true) {
    throw new Error('repository tree is truncated; completeness cannot be claimed');
  }

  return [...new Set(tree.tree
    .filter((entry) => entry?.type === 'blob')
    .map((entry) => entry.path)
    .filter((path) => typeof path === 'string' && path.startsWith(UPDATE_PREFIX) && path.endsWith(JSON_SUFFIX)))]
    .sort((a, b) => a.localeCompare(b));
}

function timestampFromPath(path) {
  const match = path.match(/(\d{4}-\d{2}-\d{2})T(\d{2})(\d{2})(\d{2})?(Z|[+-]\d{4})/);
  if (!match) return null;
  const [, date, hour, minute, seconds, zone] = match;
  const offset = zone === 'Z' ? 'Z' : zone.slice(0, 3) + ':' + zone.slice(3);
  return date + 'T' + hour + ':' + minute + ':' + (seconds ?? '00') + offset;
}

function candidateQueueItem(update, path) {
  const nested = update?.queue_item && typeof update.queue_item === 'object' ? update.queue_item : null;
  const fromDocument = update?.canonical_queue_item
    ?? (typeof update?.queue_item === 'string' ? update.queue_item : nested?.id)
    ?? update?.item_id
    ?? update?.id;
  if (typeof fromDocument === 'string' && fromDocument.length) return fromDocument;
  return path.match(/(?:^|\/)([A-Z]+-\d+)(?:-|\.json$)/)?.[1] ?? null;
}

function buildOwnerMaps(canonicalQueue) {
  const canonicalById = new Map();
  const prefixOwners = new Map();
  const ambiguousPrefixes = new Set();
  for (const item of canonicalQueue.items) {
    if (!item || typeof item.id !== 'string' || typeof item.owner !== 'string') continue;
    canonicalById.set(item.id, item);
    const prefix = item.id.match(/^([A-Z]+)-/)?.[1];
    if (!prefix || ambiguousPrefixes.has(prefix)) continue;
    const previous = prefixOwners.get(prefix);
    if (previous && previous !== item.owner) {
      prefixOwners.delete(prefix);
      ambiguousPrefixes.add(prefix);
    } else {
      prefixOwners.set(prefix, item.owner);
    }
  }
  return { canonicalById, prefixOwners };
}

function inferRecordOwner(update, queueItem, canonicalById, prefixOwners) {
  const nested = update?.queue_item && typeof update.queue_item === 'object' ? update.queue_item : null;
  const canonical = canonicalById.get(queueItem);
  const prefix = queueItem?.match(/^([A-Z]+)-/)?.[1];
  return update?.owner
    ?? update?.team
    ?? nested?.owner
    ?? update?.canonical_queue_owner
    ?? canonical?.owner
    ?? prefixOwners.get(prefix)
    ?? null;
}

function normalizeOwnedUpdate(update, path, queueItem, recordOwner, canonicalById) {
  if (!update || typeof update !== 'object' || Array.isArray(update)) {
    throw new TypeError(`${path}: update must be an object`);
  }
  if (!queueItem) throw new Error(`${path}: missing queue item identity`);
  const nested = update.queue_item && typeof update.queue_item === 'object' ? update.queue_item : null;
  const canonical = canonicalById.get(queueItem);
  if (canonical?.owner && canonical.owner !== recordOwner) {
    throw new Error(`${path}: update owner ${recordOwner} conflicts with canonical owner ${canonical.owner}`);
  }
  const recordStatus = update.canonical_status
    ?? update.canonical_item_status
    ?? update.observed_canonical_status
    ?? update.canonical_status_observed
    ?? nested?.status
    ?? update.projection?.status
    ?? update.status
    ?? update.durable_slice?.status
    ?? canonical?.status;
  const statusSource = update.canonical_status ? 'canonical_status'
    : update.canonical_item_status ? 'canonical_item_status'
    : update.observed_canonical_status ? 'observed_canonical_status'
    : update.canonical_status_observed ? 'canonical_status_observed'
    : nested?.status ? 'queue_item.status'
    : update.projection?.status ? 'projection.status'
    : update.status ? 'status'
    : update.durable_slice?.status ? 'durable_slice.status'
    : 'canonical_queue';
  if (typeof recordStatus !== 'string' || recordStatus.length === 0) {
    throw new Error(`${path}: missing canonical status`);
  }
  let timestampField = update.completed_at ? 'completed_at' : 'updated_at';
  let timestampValue = update.completed_at ?? update.updated_at ?? update.recorded_at ?? update.generated_at;
  let timestampSource = 'document';
  if (typeof timestampValue !== 'string' || timestampValue.length === 0) {
    timestampValue = timestampFromPath(path);
    timestampField = 'updated_at';
    timestampSource = 'filename';
  }
  if (!timestampValue) throw new Error(`${path}: missing event timestamp and no timestamp is encoded in the filename`);
  const timestampMs = Date.parse(timestampValue);
  if (!Number.isFinite(timestampMs)) throw new Error(`${path}: event timestamp is not parseable`);
  const action = update.action
    ?? nested?.action
    ?? update.projection?.durable_improvement
    ?? update.durable_slice?.summary
    ?? canonical?.action
    ?? null;
  return {
    path, document: update, queueItem, recordOwner, recordStatus, statusSource,
    timestampField, timestampValue, timestampMs, timestampSource, action,
    blob_sha: null
  };
}

export function reduceOwnedCurrentView({ canonicalQueue, updateDocuments, owner }) {
  if (!canonicalQueue || !Array.isArray(canonicalQueue.items)) {
    throw new TypeError('canonicalQueue.items must be an array');
  }
  if (!Array.isArray(updateDocuments)) {
    throw new TypeError('updateDocuments must be an array');
  }
  if (typeof owner !== 'string' || owner.length === 0) {
    throw new TypeError('owner must be a non-empty string');
  }

  const state = new Map();
  for (const item of canonicalQueue.items.filter((item) => item?.owner === owner)) {
    if (typeof item.id !== 'string' || item.id.length === 0) {
      throw new Error('canonical owned item is missing id');
    }
    state.set(item.id, {
      id: item.id,
      owner,
      status: item.status ?? 'unknown',
      action: item.action ?? null,
      source_layer: 'canonical_snapshot'
    });
  }

  const { canonicalById, prefixOwners } = buildOwnerMaps(canonicalQueue);
  const normalized = [];
  const validationErrors = [];
  const unattributedUpdatePaths = [];
  let ignoredOtherOwnerCount = 0;
  for (const { path, document, blob_sha = null } of updateDocuments) {
    const queueItem = candidateQueueItem(document, path);
    const recordOwner = inferRecordOwner(document, queueItem, canonicalById, prefixOwners);
    if (!recordOwner) {
      unattributedUpdatePaths.push(path);
      continue;
    }
    if (recordOwner !== owner) {
      ignoredOtherOwnerCount++;
      continue;
    }
    try {
      normalized.push({
        ...normalizeOwnedUpdate(document, path, queueItem, recordOwner, canonicalById),
        blob_sha
      });
    } catch (error) {
      validationErrors.push(error.message);
    }
  }
  if (validationErrors.length) {
    throw new Error(`queue update validation failed (${validationErrors.length} record(s)):\n${validationErrors.join('\n')}`);
  }
  normalized.sort((a, b) => a.timestampMs - b.timestampMs
    || a.queueItem.localeCompare(b.queueItem)
    || a.path.localeCompare(b.path));

  const applied = [];
  const duplicateKeys = new Set();
  for (const entry of normalized) {
    const key = `${entry.queueItem}\u0000${entry.timestampValue}`;
    if (duplicateKeys.has(key)) {
      throw new Error(`duplicate continuity update identity: ${entry.queueItem} at ${entry.timestampValue}`);
    }
    duplicateKeys.add(key);
    state.set(entry.queueItem, {
      id: entry.queueItem,
      owner,
      status: entry.recordStatus,
      status_source: entry.statusSource,
      action: entry.action,
      [entry.timestampField]: entry.timestampValue,
      timestamp_source: entry.timestampSource,
      source_layer: 'append_only_update',
      source_path: entry.path,
      source_blob_sha: entry.blob_sha
    });
    applied.push({
      queue_item: entry.queueItem,
      [entry.timestampField]: entry.timestampValue,
      timestamp_source: entry.timestampSource,
      path: entry.path,
      blob_sha: entry.blob_sha
    });
  }

  return {
    owner,
    ignored_other_owner_count: ignoredOtherOwnerCount,
    unattributed_update_paths: unattributedUpdatePaths,
    completeness_claim: 'eligible only when the supplied recursive tree is non-truncated, every enumerated update path was fetched and parsed, and every update was attributed to an owner',
    ordering_rule: ['completed_at or updated_at ascending', 'queue_item lexical ascending', 'path lexical ascending'],
    applied_updates: applied,
    items: [...state.values()].sort((a, b) => a.id.localeCompare(b.id))
  };
}

export async function materializeFromRepositoryTree({ tree, fetchDocument, canonicalQueue, owner }) {
  if (typeof fetchDocument !== 'function') {
    throw new TypeError('fetchDocument must be a function');
  }
  const paths = enumerateQueueUpdatePaths(tree);
  const updateDocuments = [];
  const fetchErrors = [];
  for (const path of paths) {
    try {
      const fetched = await fetchDocument(path);
      if (!fetched || typeof fetched.content !== 'string') {
        fetchErrors.push(`${path}: fetch did not return string content`);
        continue;
      }
      let document;
      try { document = JSON.parse(fetched.content); }
      catch (error) {
        fetchErrors.push(`${path}: invalid JSON: ${error.message}`);
        continue;
      }
      updateDocuments.push({ path, document, blob_sha: fetched.sha ?? null });
    } catch (error) {
      fetchErrors.push(`${path}: ${error.message}`);
    }
  }
  if (fetchErrors.length) {
    throw new Error(`queue update fetch/parse failed (${fetchErrors.length} record(s)):\n${fetchErrors.join('\n')}`);
  }
  const currentView = reduceOwnedCurrentView({ canonicalQueue, updateDocuments, owner });
  return {
    tree_sha: tree.sha ?? null,
    enumerated_path_count: paths.length,
    enumerated_paths: paths,
    fetched_path_count: updateDocuments.length,
    completeness_verified: paths.length === updateDocuments.length && tree.truncated !== true && currentView.unattributed_update_paths.length === 0,
    current_view: currentView
  };
}
