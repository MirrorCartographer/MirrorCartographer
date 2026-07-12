const SHA_PATTERN = /^[0-9a-f]{40}$/;
const SAFE_PATH_PATTERN = /^(operations\/(queue-updates|evidence)\/)[A-Za-z0-9._\/-]+\.json$/;

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
}

function normalizeRecord(entry) {
  assertObject(entry, 'record entry');
  const { path, blob_sha, content } = entry;
  if (!SAFE_PATH_PATTERN.test(path || '')) throw new TypeError('record path is outside continuity-safe roots');
  if (!SHA_PATTERN.test(blob_sha || '')) throw new TypeError('blob_sha must be a 40-character lowercase git SHA');
  assertObject(content, 'record content');
  return { path, blob_sha, content };
}

export function buildReconciliationInput({ aggregate, records = [], commits = [] }) {
  assertObject(aggregate, 'aggregate');
  if (!aggregate.id || !aggregate.owner) throw new TypeError('aggregate id and owner are required');

  const commitSet = new Set(commits.filter((sha) => SHA_PATTERN.test(sha)));
  const normalized = records.map(normalizeRecord);
  const queueUpdates = normalized.filter((entry) => entry.path.startsWith('operations/queue-updates/'));
  const evidence = normalized.filter((entry) => entry.path.startsWith('operations/evidence/'));
  const evidencePathSet = new Set(evidence.map((entry) => entry.path));

  const selectedUpdates = [];
  const ignoredRecords = [];
  for (const entry of queueUpdates) {
    const update = entry.content;
    if (update.queue_item !== aggregate.id) {
      ignoredRecords.push({ path: entry.path, blob_sha: entry.blob_sha, reason: 'different_queue_item' });
      continue;
    }
    selectedUpdates.push({ ...update, source_path: entry.path, source_blob_sha: entry.blob_sha });
  }

  const referencedCommits = [...new Set(selectedUpdates.flatMap((update) => update.source_commits || []))];
  const referencedEvidencePaths = [...new Set(selectedUpdates.flatMap((update) => update.evidence_paths || []))];

  return {
    schema_version: '1.0.0',
    queue_item: aggregate.id,
    owner: aggregate.owner,
    aggregate,
    updates: selectedUpdates,
    resolvableCommits: referencedCommits.filter((sha) => commitSet.has(sha)),
    unresolvableCommits: referencedCommits.filter((sha) => !commitSet.has(sha)),
    resolvableEvidencePaths: referencedEvidencePaths.filter((path) => evidencePathSet.has(path)),
    unresolvableEvidencePaths: referencedEvidencePaths.filter((path) => !evidencePathSet.has(path)),
    ignoredRecords,
    source_inventory: normalized.map(({ path, blob_sha }) => ({ path, blob_sha })),
    mutation_performed: false,
    privacy_boundary: 'Accept only append-only queue updates and evidence JSON under operations/. Raw chat, health, credentials, and unrelated files are out of scope.',
    review_route: 'Verify repository commit existence and file blob SHAs before passing this derived input to queue-reconciler.mjs.'
  };
}
