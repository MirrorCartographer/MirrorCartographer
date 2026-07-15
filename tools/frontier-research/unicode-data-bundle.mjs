import { createHash } from 'node:crypto';

const REQUIRED = Object.freeze({
  confusables: 'security/confusables.txt',
  identifierStatus: 'security/IdentifierStatus.txt',
  derivedCoreProperties: 'ucd/DerivedCoreProperties.txt'
});

function sha256(text) {
  return createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex');
}

export function exactUnicodeUrl(version, relativePath) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new TypeError('exact Unicode version is required');
  if (!Object.values(REQUIRED).includes(relativePath)) throw new TypeError('unsupported Unicode data path');
  const root = relativePath.startsWith('security/')
    ? `https://www.unicode.org/Public/security/${version}/`
    : `https://www.unicode.org/Public/${version}/`;
  return new URL(relativePath.replace(/^security\//, '').replace(/^ucd\//, 'ucd/'), root).href;
}

export function inspectUnicodeHeader(text, expectedVersion) {
  if (typeof text !== 'string' || text.length === 0) throw new TypeError('Unicode data must be non-empty text');
  const head = text.split(/\r?\n/).slice(0, 12).join('\n');
  const match = head.match(/(?:Unicode|DerivedCoreProperties|confusables|IdentifierStatus)[^\n]*?(\d+\.\d+\.\d+)/i);
  if (!match) throw new TypeError('Unicode version header not found');
  if (match[1] !== expectedVersion) {
    throw new TypeError(`Unicode version mismatch: expected ${expectedVersion}, found ${match[1]}`);
  }
  return match[1];
}

export function verifyUnicodeDataBundle(manifest, files) {
  if (!manifest || !/^\d+\.\d+\.\d+$/.test(manifest.version ?? '')) {
    throw new TypeError('manifest.version must be exact');
  }

  const output = {};
  for (const [name, relativePath] of Object.entries(REQUIRED)) {
    const spec = manifest.files?.[name];
    const text = files?.[name];
    if (!spec || typeof spec.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(spec.sha256)) {
      throw new TypeError(`${name} requires a lowercase SHA-256 digest`);
    }
    const expectedUrl = exactUnicodeUrl(manifest.version, relativePath);
    if (spec.url !== expectedUrl) throw new TypeError(`${name} URL is not exact-version canonical URL`);
    inspectUnicodeHeader(text, manifest.version);
    const actual = sha256(text);
    if (actual !== spec.sha256) throw new TypeError(`${name} digest mismatch`);
    output[name] = Object.freeze({
      url: spec.url,
      sha256: actual,
      bytes: Buffer.byteLength(text, 'utf8'),
      version: manifest.version
    });
  }

  return Object.freeze({
    version: manifest.version,
    authenticated: true,
    files: Object.freeze(output)
  });
}

export async function fetchUnicodeDataBundle(manifest, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation is required');
  const files = {};

  for (const [name, relativePath] of Object.entries(REQUIRED)) {
    const expectedUrl = exactUnicodeUrl(manifest.version, relativePath);
    if (manifest.files?.[name]?.url !== expectedUrl) {
      throw new TypeError(`${name} URL is not exact-version canonical URL`);
    }
    const response = await fetchImpl(expectedUrl, {
      redirect: 'error',
      headers: { accept: 'text/plain' }
    });
    if (!response?.ok) {
      throw new Error(`${name} download failed with status ${response?.status ?? 'unknown'}`);
    }
    if (response.url && response.url !== expectedUrl) throw new Error(`${name} response URL changed`);
    files[name] = await response.text();
  }

  return verifyUnicodeDataBundle(manifest, files);
}

export const UNICODE_DATA_REQUIREMENTS = REQUIRED;

export const TRUST_LIMIT = Object.freeze({
  digestOrigin: 'digests must be supplied through an independently authenticated channel',
  transport: 'HTTPS and exact URLs do not replace digest authentication',
  freshness: 'version pinning prevents silent upgrades; it does not establish that the pinned version is currently recommended',
  claim: 'a verified bundle authenticates bytes and cross-file version consistency, not identifier safety'
});
