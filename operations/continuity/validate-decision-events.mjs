import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const EVENT_ID = /^DE-[0-9]{4}$/;
const COMMIT_SHA = /^[0-9a-f]{40}$/;
const EVENT_TYPES = new Set(['observe', 'infer', 'propose', 'correct', 'supersede', 'resolve', 'reopen']);
const CLAIM_STATES = new Set(['observed', 'inferred', 'proposed', 'superseded', 'unresolved', 'resolved']);
const PRIVACY = new Set(['public_repository_safe', 'restricted_reference_only', 'do_not_publish']);
const SOURCE_TYPES = new Set(['github_file', 'github_commit', 'public_document', 'restricted_reference']);

function isDateTime(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function add(errors, path, message) {
  errors.push({ path, message });
}

export function validateDecisionEvents(document) {
  const errors = [];
  if (!document || typeof document !== 'object' || Array.isArray(document)) {
    return { valid: false, errors: [{ path: '$', message: 'document must be an object' }] };
  }
  if (document.schema_version !== '1.0.0') add(errors, '$.schema_version', 'must equal 1.0.0');
  if (!isDateTime(document.generated_at)) add(errors, '$.generated_at', 'must be an ISO-compatible date-time');
  if (!Array.isArray(document.events)) {
    add(errors, '$.events', 'must be an array');
    return { valid: false, errors };
  }

  const ids = new Set();
  const links = [];
  document.events.forEach((event, index) => {
    const p = `$.events[${index}]`;
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      add(errors, p, 'must be an object');
      return;
    }
    if (event.schema_version !== '1.0.0') add(errors, `${p}.schema_version`, 'must equal 1.0.0');
    if (!EVENT_ID.test(event.event_id ?? '')) add(errors, `${p}.event_id`, 'must match DE-0000');
    else if (ids.has(event.event_id)) add(errors, `${p}.event_id`, 'must be unique');
    else ids.add(event.event_id);
    if (typeof event.subject_id !== 'string' || event.subject_id.length === 0) add(errors, `${p}.subject_id`, 'must be a non-empty string');
    if (!EVENT_TYPES.has(event.event_type)) add(errors, `${p}.event_type`, 'is not allowed');
    if (!CLAIM_STATES.has(event.claim_state)) add(errors, `${p}.claim_state`, 'is not allowed');
    if (!event.valid_time || !isDateTime(event.valid_time.from)) add(errors, `${p}.valid_time.from`, 'must be a date-time');
    if (event.valid_time?.to !== null && event.valid_time?.to !== undefined && !isDateTime(event.valid_time.to)) add(errors, `${p}.valid_time.to`, 'must be null or a date-time');
    if (isDateTime(event.valid_time?.from) && isDateTime(event.valid_time?.to) && Date.parse(event.valid_time.to) < Date.parse(event.valid_time.from)) add(errors, `${p}.valid_time.to`, 'must not precede valid_time.from');
    if (!event.transaction_time || !isDateTime(event.transaction_time.recorded_at)) add(errors, `${p}.transaction_time.recorded_at`, 'must be a date-time');
    const recordedCommit = event.transaction_time?.recorded_commit;
    if (recordedCommit !== null && recordedCommit !== undefined && !COMMIT_SHA.test(recordedCommit)) add(errors, `${p}.transaction_time.recorded_commit`, 'must be null or a 40-character lowercase commit SHA');
    if (typeof event.summary !== 'string' || event.summary.length === 0) add(errors, `${p}.summary`, 'must be a non-empty string');
    if (!Array.isArray(event.sources) || event.sources.length === 0) add(errors, `${p}.sources`, 'must contain at least one source');
    else event.sources.forEach((source, sourceIndex) => {
      const sp = `${p}.sources[${sourceIndex}]`;
      if (!source || typeof source !== 'object') return add(errors, sp, 'must be an object');
      if (!SOURCE_TYPES.has(source.type)) add(errors, `${sp}.type`, 'is not allowed');
      if (typeof source.locator !== 'string' || source.locator.length === 0) add(errors, `${sp}.locator`, 'must be a non-empty string');
      if (source.content_sha !== null && source.content_sha !== undefined && typeof source.content_sha !== 'string') add(errors, `${sp}.content_sha`, 'must be a string or null');
      if (source.observed_at !== null && source.observed_at !== undefined && !isDateTime(source.observed_at)) add(errors, `${sp}.observed_at`, 'must be null or a date-time');
    });
    for (const field of ['supersedes_event_ids', 'contradicts_event_ids']) {
      if (!Array.isArray(event[field])) add(errors, `${p}.${field}`, 'must be an array');
      else event[field].forEach((id, linkIndex) => {
        if (!EVENT_ID.test(id ?? '')) add(errors, `${p}.${field}[${linkIndex}]`, 'must match DE-0000');
        else links.push({ from: event.event_id, to: id, path: `${p}.${field}[${linkIndex}]` });
      });
    }
    if (!PRIVACY.has(event.privacy)) add(errors, `${p}.privacy`, 'is not allowed');
    if (typeof event.review_route !== 'string' || event.review_route.length === 0) add(errors, `${p}.review_route`, 'must be a non-empty string');
  });

  for (const link of links) {
    if (link.from === link.to) add(errors, link.path, 'must not self-reference');
    if (!ids.has(link.to)) add(errors, link.path, 'must reference an event in this ledger');
  }

  return { valid: errors.length === 0, errors };
}

async function main() {
  const path = process.argv[2] ?? 'operations/continuity/decision-events.json';
  const document = JSON.parse(await fs.readFile(path, 'utf8'));
  const result = validateDecisionEvents(document);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.valid) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
