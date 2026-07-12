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

function assertUpdate(update, path) {
  if (!update || typeof update !== 'object' || Array.isArray(update)) {
    throw new TypeError(`${path}: update must be an object`);
  }
  for (const key of ['queue_item', 'owner', 'status', 'completed_at']) {
    if (typeof update[key] !== 'string' || update[key].length === 0) {
      throw new Error(`${path}: missing ${key}`);
    }
  }
  const completed = Date.parse(update.completed_at);
  if (!Number.isFinite(completed)) {
    throw new Error(`${path}: completed_at is not parseable`);
  }
  return completed;
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

  const normalized = updateDocuments.map(({ path, document, blob_sha = null }) => {
    const completedMs = assertUpdate(document, path);
    return { path, document, blob_sha, completedMs };
  }).filter(({ document }) => document.owner === owner)
    .sort((a, b) => a.completedMs - b.completedMs
      || a.document.queue_item.localeCompare(b.document.queue_item)
      || a.path.localeCompare(b.path));

  const applied = [];
  const duplicateKeys = new Set();
  for (const entry of normalized) {
    const key = `${entry.document.queue_item}\u0000${entry.document.completed_at}`;
    if (duplicateKeys.has(key)) {
      throw new Error(`duplicate continuity update identity: ${entry.document.queue_item} at ${entry.document.completed_at}`);
    }
    duplicateKeys.add(key);
    state.set(entry.document.queue_item, {
      id: entry.document.queue_item,
      owner,
      status: entry.document.status,
      action: entry.document.action ?? null,
      completed_at: entry.document.completed_at,
      source_layer: 'append_only_update',
      source_path: entry.path,
      source_blob_sha: entry.blob_sha
    });
    applied.push({
      queue_item: entry.document.queue_item,
      completed_at: entry.document.completed_at,
      path: entry.path,
      blob_sha: entry.blob_sha
    });
  }

  return {
    owner,
    completeness_claim: 'eligible only when the supplied recursive tree is non-truncated and every enumerated update path was fetched and parsed',
    ordering_rule: ['completed_at ascending', 'queue_item lexical ascending', 'path lexical ascending'],
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
  for (const path of paths) {
    const fetched = await fetchDocument(path);
    if (!fetched || typeof fetched.content !== 'string') {
      throw new Error(`${path}: fetch did not return string content`);
    }
    let document;
    try {
      document = JSON.parse(fetched.content);
    } catch (error) {
      throw new Error(`${path}: invalid JSON: ${error.message}`);
    }
    updateDocuments.push({ path, document, blob_sha: fetched.sha ?? null });
  }
  const currentView = reduceOwnedCurrentView({ canonicalQueue, updateDocuments, owner });
  return {
    tree_sha: tree.sha ?? null,
    enumerated_path_count: paths.length,
    enumerated_paths: paths,
    fetched_path_count: updateDocuments.length,
    completeness_verified: paths.length === updateDocuments.length && tree.truncated !== true,
    current_view: currentView
  };
}
