import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const SHA256 = /^[a-f0-9]{64}$/;
const SAFE_PATH = /^operations\/queue-updates\/[A-Za-z0-9._-]+\.json$/;

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function buildQueueUpdateManifest({ entries, enumeration = null }) {
  if (!Array.isArray(entries)) throw new Error('entries must be an array');
  const paths = new Set();
  const orders = new Set();
  const normalized = entries.map((entry, index) => {
    if (!entry || !SAFE_PATH.test(entry.path ?? '')) throw new Error(`entry ${index} has invalid path`);
    if (!SHA256.test(entry.sha256 ?? '')) throw new Error(`entry ${index} has invalid sha256`);
    if (!Number.isInteger(entry.event_order)) throw new Error(`entry ${index} has invalid event_order`);
    if (paths.has(entry.path)) throw new Error(`duplicate path: ${entry.path}`);
    if (orders.has(entry.event_order)) throw new Error(`event_order collision: ${entry.event_order}`);
    paths.add(entry.path);
    orders.add(entry.event_order);
    return { path: entry.path, sha256: entry.sha256, event_order: entry.event_order };
  }).sort((a, b) => a.event_order - b.event_order || a.path.localeCompare(b.path));

  const enumerationValid = Boolean(
    enumeration &&
    enumeration.complete === true &&
    typeof enumeration.tree_sha === 'string' &&
    /^[a-f0-9]{40}$/.test(enumeration.tree_sha) &&
    enumeration.entry_count === normalized.length
  );

  const payload = {
    schema_version: '1.0.0',
    entries: normalized,
    enumeration: enumerationValid ? {
      complete: true,
      tree_sha: enumeration.tree_sha,
      entry_count: enumeration.entry_count,
      method: enumeration.method ?? null
    } : null
  };
  const digest = crypto.createHash('sha256').update(canonicalJson(payload)).digest('hex');

  return {
    ...payload,
    manifest_sha256: digest,
    authoritative: enumerationValid,
    authority_reason: enumerationValid
      ? 'caller supplied a structurally valid complete-enumeration attestation bound to a repository tree SHA'
      : 'manifest is explicit and digest-bound but complete repository enumeration is not structurally attested',
    trust_limit: 'Structural validity and hashing do not prove that the enumerator was independent, complete, or truthful.'
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    process.stdout.write(`${JSON.stringify(buildQueueUpdateManifest(input), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
