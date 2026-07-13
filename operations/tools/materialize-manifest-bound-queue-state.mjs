import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeQueueState } from './materialize-queue-state.mjs';

const SHA256 = /^[a-f0-9]{64}$/;
const SAFE_PATH = /^operations\/queue-updates\/[A-Za-z0-9._-]+\.json$/;

function sha256(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function verifyManifestSelfDigest(manifest) {
  if (!manifest || !Array.isArray(manifest.entries)) throw new Error('invalid manifest');
  if (!SHA256.test(manifest.manifest_sha256 ?? '')) throw new Error('manifest missing valid manifest_sha256');
  const payload = {
    schema_version: manifest.schema_version,
    entries: manifest.entries,
    enumeration: manifest.enumeration ?? null
  };
  const computed = sha256(canonicalJson(payload));
  if (computed !== manifest.manifest_sha256) throw new Error('manifest self-digest mismatch');
}

export function materializeManifestBoundQueueState({ baseQueue, manifest, updateFiles }) {
  verifyManifestSelfDigest(manifest);
  if (!Array.isArray(updateFiles)) throw new Error('updateFiles must be an array');

  const byPath = new Map();
  for (const [index, file] of updateFiles.entries()) {
    if (!file || !SAFE_PATH.test(file.path ?? '')) throw new Error(`update file ${index} has invalid path`);
    if (typeof file.raw !== 'string') throw new Error(`update file ${file.path} raw must be a string`);
    if (byPath.has(file.path)) throw new Error(`duplicate update file path: ${file.path}`);
    byPath.set(file.path, file.raw);
  }

  const expectedPaths = new Set(manifest.entries.map(entry => entry.path));
  for (const suppliedPath of byPath.keys()) {
    if (!expectedPaths.has(suppliedPath)) throw new Error(`unmanifested update file: ${suppliedPath}`);
  }
  if (byPath.size !== manifest.entries.length) throw new Error('manifest/update file count mismatch');

  const updates = manifest.entries.map((entry, index) => {
    if (!entry || !SAFE_PATH.test(entry.path ?? '')) throw new Error(`manifest entry ${index} has invalid path`);
    if (!SHA256.test(entry.sha256 ?? '')) throw new Error(`manifest entry ${index} has invalid sha256`);
    if (!Number.isInteger(entry.event_order)) throw new Error(`manifest entry ${index} has invalid event_order`);
    const raw = byPath.get(entry.path);
    if (raw === undefined) throw new Error(`missing manifested update file: ${entry.path}`);
    if (sha256(raw) !== entry.sha256) throw new Error(`update digest mismatch: ${entry.path}`);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { throw new Error(`invalid JSON update file: ${entry.path}`); }
    if (parsed.event_order !== entry.event_order) throw new Error(`event_order mismatch: ${entry.path}`);
    return parsed;
  });

  const enumerationAgrees = Boolean(
    manifest.authoritative === true &&
    manifest.enumeration?.complete === true &&
    manifest.enumeration.entry_count === manifest.entries.length
  );
  const materialized = materializeQueueState({
    baseQueue,
    updates,
    enumerationComplete: enumerationAgrees
  });

  return {
    ...materialized,
    manifest: {
      manifest_sha256: manifest.manifest_sha256,
      entry_count: manifest.entries.length,
      exact_bytes_verified: true,
      authoritative_input: manifest.authoritative === true
    },
    authoritative: enumerationAgrees && materialized.authoritative === true,
    authority_reason: enumerationAgrees
      ? 'manifest self-digest, exact update bytes, event orders, and complete tree-bound enumeration structure all agreed'
      : 'exact manifest-bound update bytes were verified, but complete tree-bound enumeration authority was not established',
    trust_limit: 'Hash and structure agreement do not prove independent enumeration, repository completeness, or truth of queue claims.'
  };
}

function parseArgs(argv) {
  const result = { updates: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base') result.base = argv[++i];
    else if (arg === '--manifest') result.manifest = argv[++i];
    else if (arg === '--update') result.updates.push(argv[++i]);
    else if (arg === '--out') result.out = argv[++i];
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!result.base) throw new Error('--base is required');
  if (!result.manifest) throw new Error('--manifest is required');
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const output = materializeManifestBoundQueueState({
      baseQueue: JSON.parse(fs.readFileSync(args.base, 'utf8')),
      manifest: JSON.parse(fs.readFileSync(args.manifest, 'utf8')),
      updateFiles: args.updates.map(file => ({ path: file.replaceAll('\\', '/'), raw: fs.readFileSync(file, 'utf8') }))
    });
    const serialized = `${JSON.stringify(output, null, 2)}\n`;
    if (args.out) {
      fs.mkdirSync(path.dirname(args.out), { recursive: true });
      fs.writeFileSync(args.out, serialized, { flag: 'wx' });
    } else process.stdout.write(serialized);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
