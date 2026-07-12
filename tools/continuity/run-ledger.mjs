import { createHash } from 'node:crypto';

const OWNERS = new Set([
  'vercel_studio',
  'cloudflare_research',
  'independent_creative_web',
  'continuity_mining',
  'frontier_research'
]);

const METHODS = new Set(['direct_trigger', 'automation_reschedule', 'trigger_request_append']);
const OUTCOMES = new Set(['attempted', 'recorded', 'failed']);
const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function canonicalEntryPayload(entry) {
  const { entry_digest_sha256: _ignored, ...payload } = entry;
  return stable(payload);
}

export function digestRunLedgerEntry(entry) {
  return createHash('sha256').update(JSON.stringify(canonicalEntryPayload(entry))).digest('hex');
}

export function buildRunLedgerEntry({
  sequence,
  recordedAt = new Date().toISOString(),
  owner,
  queueItemId,
  teamStartDigestSha256,
  implementationCommits = [],
  verificationEvidence = [],
  peerTriggerAttempts = [],
  previousEntryDigestSha256 = null
} = {}) {
  const entry = {
    sequence,
    recorded_at: recordedAt,
    owner,
    queue_item_id: queueItemId,
    team_start_digest_sha256: teamStartDigestSha256,
    implementation_commits: [...implementationCommits],
    verification_evidence: [...verificationEvidence],
    peer_trigger_attempts: peerTriggerAttempts.map((attempt) => ({ ...attempt })),
    previous_entry_digest_sha256: previousEntryDigestSha256,
    entry_digest_sha256: null
  };
  entry.entry_digest_sha256 = digestRunLedgerEntry(entry);
  return entry;
}

function entryErrors(entry, index, previous) {
  const errors = [];
  const add = (code, message) => errors.push({ code, index, message });

  if (!Number.isInteger(entry?.sequence) || entry.sequence !== index) add('RLE-001', 'sequence must equal the zero-based ledger position');
  if (!entry?.recorded_at || Number.isNaN(Date.parse(entry.recorded_at))) add('RLE-002', 'recorded_at must be an ISO-compatible date-time');
  if (!OWNERS.has(entry?.owner)) add('RLE-003', 'owner is not registered');
  if (typeof entry?.queue_item_id !== 'string' || entry.queue_item_id.length === 0) add('RLE-004', 'queue_item_id is required');
  if (!SHA256.test(entry?.team_start_digest_sha256 ?? '')) add('RLE-005', 'team_start digest must be a SHA-256 hex value');
  if (!Array.isArray(entry?.implementation_commits) || entry.implementation_commits.some((sha) => !COMMIT.test(sha)) || new Set(entry.implementation_commits).size !== entry.implementation_commits.length) add('RLE-006', 'implementation commits must be unique full commit SHAs');
  if (!Array.isArray(entry?.verification_evidence) || entry.verification_evidence.some((value) => typeof value !== 'string' || value.length === 0) || new Set(entry.verification_evidence).size !== entry.verification_evidence.length) add('RLE-007', 'verification evidence must be unique non-empty references');
  if (!Array.isArray(entry?.peer_trigger_attempts) || entry.peer_trigger_attempts.some((attempt) => !OWNERS.has(attempt?.peer_owner) || !METHODS.has(attempt?.method) || !OUTCOMES.has(attempt?.outcome))) add('RLE-008', 'peer trigger attempts contain an invalid owner, method, or outcome');

  const expectedPrevious = index === 0 ? null : previous?.entry_digest_sha256;
  if (entry?.previous_entry_digest_sha256 !== expectedPrevious) add('RLE-009', 'previous entry digest does not match the preceding immutable record');

  const calculated = entry ? digestRunLedgerEntry(entry) : null;
  if (!SHA256.test(entry?.entry_digest_sha256 ?? '') || entry.entry_digest_sha256 !== calculated) add('RLE-010', 'entry digest is absent or does not match canonical entry bytes');
  return errors;
}

export function validateRunLedger(ledger) {
  const errors = [];
  if (ledger?.schema_version !== '1.0.0') errors.push({ code: 'RLL-001', message: 'unsupported schema_version' });
  if (ledger?.artifact_type !== 'continuity_run_ledger') errors.push({ code: 'RLL-002', message: 'artifact_type must be continuity_run_ledger' });
  if (!Array.isArray(ledger?.entries)) errors.push({ code: 'RLL-003', message: 'entries must be an array' });
  else ledger.entries.forEach((entry, index) => errors.push(...entryErrors(entry, index, ledger.entries[index - 1])));
  return { valid: errors.length === 0, errors };
}

export function appendRunLedgerEntry(ledger, input) {
  const current = validateRunLedger(ledger);
  if (!current.valid) return { accepted: false, ledger, errors: current.errors };

  const previous = ledger.entries.at(-1) ?? null;
  const entry = buildRunLedgerEntry({
    ...input,
    sequence: ledger.entries.length,
    previousEntryDigestSha256: previous?.entry_digest_sha256 ?? null
  });
  const next = { ...ledger, entries: [...ledger.entries, entry] };
  const validation = validateRunLedger(next);
  return { accepted: validation.valid, ledger: next, entry, errors: validation.errors };
}
