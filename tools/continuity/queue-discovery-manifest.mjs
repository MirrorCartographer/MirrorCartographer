import { createHash } from 'node:crypto';

const PREFIX = 'operations/queue-updates/';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function buildQueueDiscoveryManifest({ repository, ref, treeSha, truncated, entries, observedAt }) {
  if (!repository || !ref || !treeSha || !observedAt) throw new Error('manifest_identity_incomplete');
  if (truncated !== false) throw new Error('repository_tree_not_exhaustive');
  if (!Array.isArray(entries)) throw new Error('tree_entries_missing');

  const files = entries
    .filter((entry) => entry?.type === 'blob' && typeof entry.path === 'string' && entry.path.startsWith(PREFIX) && entry.path.endsWith('.json'))
    .map((entry) => {
      if (!/^[0-9a-f]{40}$/.test(entry.sha ?? '')) throw new Error(`invalid_blob_sha:${entry.path}`);
      return { path: entry.path, blob_sha: entry.sha, size: Number.isInteger(entry.size) ? entry.size : null };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const paths = new Set();
  for (const file of files) {
    if (paths.has(file.path)) throw new Error(`duplicate_tree_path:${file.path}`);
    paths.add(file.path);
  }

  const subject = { repository, ref, tree_sha: treeSha, observed_at: observedAt, complete: true, files };
  return { ...subject, manifest_sha256: createHash('sha256').update(canonical(subject)).digest('hex') };
}
