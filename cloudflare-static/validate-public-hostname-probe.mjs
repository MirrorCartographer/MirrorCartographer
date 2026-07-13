import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const CLASSIFICATIONS = new Set([
  'unresolved',
  'http_unreachable',
  'reachable_wrong_or_unverified_surface',
  'identity_verified'
]);

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validIsoTimestamp(value) {
  return nonEmptyString(value) && Number.isFinite(Date.parse(value));
}

export function validatePublicHostnameProbe(packet) {
  const errors = [];
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) {
    return { ok: false, errors: ['packet must be an object'], acceptance: 'rejected' };
  }

  if (packet.schemaVersion !== '1.0.0') errors.push('schemaVersion must equal 1.0.0');
  if (!validIsoTimestamp(packet.checkedAt)) errors.push('checkedAt must be an ISO-compatible timestamp');
  if (!nonEmptyString(packet.hostname)) errors.push('hostname must be a non-empty string');
  if (packet.url !== `https://${packet.hostname}/`) errors.push('url must be the canonical HTTPS root for hostname');
  if (!CLASSIFICATIONS.has(packet.classification)) errors.push('classification is not recognized');
  if (!nonEmptyString(packet.claim)) errors.push('claim must be a non-empty string');

  const dns = packet.dns;
  if (!dns || typeof dns !== 'object') {
    errors.push('dns evidence is required');
  } else {
    if (!Array.isArray(dns.ipv4)) errors.push('dns.ipv4 must be an array');
    if (!Array.isArray(dns.ipv6)) errors.push('dns.ipv6 must be an array');
    if (!Array.isArray(dns.errors)) errors.push('dns.errors must be an array');
  }

  const resolved = Array.isArray(dns?.ipv4) && Array.isArray(dns?.ipv6)
    && (dns.ipv4.length > 0 || dns.ipv6.length > 0);

  if (packet.classification === 'unresolved') {
    if (resolved) errors.push('unresolved classification cannot contain resolved addresses');
    if (packet.http !== null) errors.push('unresolved classification requires http=null');
    if (packet.identity !== null) errors.push('unresolved classification requires identity=null');
  }

  if (packet.classification === 'http_unreachable') {
    if (!resolved) errors.push('http_unreachable requires DNS resolution evidence');
    if (!nonEmptyString(packet.http?.error)) errors.push('http_unreachable requires http.error');
    if (packet.identity !== null) errors.push('http_unreachable requires identity=null');
  }

  if (packet.classification === 'reachable_wrong_or_unverified_surface' || packet.classification === 'identity_verified') {
    if (!resolved) errors.push('reachable classifications require DNS resolution evidence');
    if (!Number.isInteger(packet.http?.status)) errors.push('reachable classifications require integer http.status');
    if (!nonEmptyString(packet.http?.finalUrl)) errors.push('reachable classifications require http.finalUrl');
    if (typeof packet.http?.redirected !== 'boolean') errors.push('reachable classifications require boolean http.redirected');
    if (!packet.identity || typeof packet.identity !== 'object') errors.push('reachable classifications require identity evidence');
  }

  if (packet.classification === 'identity_verified' && packet.identity?.ok !== true) {
    errors.push('identity_verified requires identity.ok=true');
  }
  if (packet.classification === 'reachable_wrong_or_unverified_surface' && packet.identity?.ok === true) {
    errors.push('unverified classification cannot contain identity.ok=true');
  }

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    acceptance: ok ? 'structurally_valid' : 'rejected',
    authorizedClaim: ok && packet.classification === 'identity_verified'
      ? 'public_reachability_and_surface_identity_only'
      : 'none',
    limits: [
      'Structural validity does not prove DNS or HTTP observations were honestly collected.',
      'Identity verification is not exact-commit, control-plane, or Cloudflare account proof.',
      'A valid packet does not authorize medical diagnosis or treatment claims.'
    ]
  };
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error('usage: node validate-public-hostname-probe.mjs <packet.json> [result.json]');
  const packet = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = validatePublicHostnameProbe(packet);
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv[3]) fs.writeFileSync(process.argv[3], serialized);
  process.stdout.write(serialized);
  if (!result.ok) process.exitCode = 2;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
