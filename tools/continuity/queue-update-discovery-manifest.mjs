const SHA40 = /^[0-9a-f]{40}$/i;
const BLOB_SHA = /^[0-9a-f]{40}$/i;
const QUEUE_PATH = /^operations\/queue-updates\/[A-Z]-\d{3}-.+\.json$/;

function normalizePath(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function rejection(candidate, reason) {
  return { path: normalizePath(candidate?.path) || null, reason };
}

function validateCandidate(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new TypeError('candidate must be an object');
  }

  const path = normalizePath(candidate.path);
  if (!QUEUE_PATH.test(path)) throw new Error(`invalid queue-update path: ${path || '<missing>'}`);
  if (!BLOB_SHA.test(candidate.blob_sha || '')) throw new Error(`missing or invalid blob_sha for ${path}`);
  if (!SHA40.test(candidate.commit || '')) throw new Error(`missing or invalid immutable commit for ${path}`);
  if (candidate.file_verified !== true) throw new Error(`file bytes not verified for ${path}`);
  if (candidate.commit_verified !== true) throw new Error(`commit not verified for ${path}`);

  const content = typeof candidate.content === 'string'
    ? candidate.content
    : JSON.stringify(candidate.content);
  if (!content) throw new Error(`missing content for ${path}`);

  let record;
  try {
    record = JSON.parse(content);
  } catch {
    throw new Error(`invalid JSON content for ${path}`);
  }

  if (!record?.queue_item?.id || !record?.queue_item?.owner) {
    throw new Error(`queue_item id and owner required for ${path}`);
  }

  return {
    path,
    blob_sha: candidate.blob_sha.toLowerCase(),
    commit: candidate.commit.toLowerCase(),
    content,
    queue_item_id: record.queue_item.id,
    owner: record.queue_item.owner
  };
}

export function buildQueueUpdateDiscoveryManifest(candidates, options = {}) {
  if (!Array.isArray(candidates)) throw new TypeError('candidates must be an array');
  const expectedPaths = Array.isArray(options.expected_paths) ? options.expected_paths.map(normalizePath) : [];

  const accepted = [];
  const rejected = [];
  const duplicates = [];
  const seenPaths = new Map();
  const seenBlobShas = new Map();

  for (const candidate of candidates) {
    try {
      const entry = validateCandidate(candidate);
      if (seenPaths.has(entry.path)) {
        duplicates.push({
          kind: 'path',
          value: entry.path,
          first_index: seenPaths.get(entry.path),
          duplicate_index: accepted.length + rejected.length + duplicates.length
        });
        continue;
      }
      if (seenBlobShas.has(entry.blob_sha)) {
        duplicates.push({
          kind: 'blob_sha',
          value: entry.blob_sha,
          first_path: seenBlobShas.get(entry.blob_sha),
          duplicate_path: entry.path
        });
        continue;
      }
      seenPaths.set(entry.path, accepted.length);
      seenBlobShas.set(entry.blob_sha, entry.path);
      accepted.push(entry);
    } catch (error) {
      rejected.push(rejection(candidate, error.message));
    }
  }

  accepted.sort((a, b) => a.path.localeCompare(b.path));
  const acceptedPaths = new Set(accepted.map(entry => entry.path));
  const missing = expectedPaths
    .filter(path => QUEUE_PATH.test(path) && !acceptedPaths.has(path))
    .sort()
    .map(path => ({ path, reason: 'expected queue-update record was not discovered and verified' }));

  return {
    schema_version: '1.0.0',
    complete: rejected.length === 0 && duplicates.length === 0 && missing.length === 0,
    entries: accepted.map(({ path, commit, content }) => ({ path, commit, content })),
    provenance: accepted.map(({ path, blob_sha, commit, queue_item_id, owner }) => ({
      path,
      blob_sha,
      commit,
      queue_item_id,
      owner
    })),
    rejected,
    duplicates,
    missing,
    interpretation: {
      observed: 'Each emitted entry has verified file bytes, immutable commit identity, parseable queue-update content, and retained blob provenance.',
      inferred: 'Discovery completeness must be represented separately from record validity.',
      proposed: 'Only complete manifests should be promoted as exhaustive repository inventories.',
      superseded: 'A successful search response is not proof that every queue-update record was discovered.',
      unresolved: 'This pure adapter depends on its caller to perform exhaustive pagination and independently verify file and commit identities.'
    }
  };
}
