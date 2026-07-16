function reject(reason) {
  return Object.freeze({ accepted: false, reason });
}

function accept(value) {
  return Object.freeze({ accepted: true, reason: null, value: Object.freeze(value) });
}

const FORBIDDEN_REMOTE_KEY_HEADERS = Object.freeze(['jku', 'x5u']);
const SUPPORTED_CRITICAL_HEADERS = Object.freeze(new Set());

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function evaluateGithubOidcJoseHeader({
  header,
  selectedKey,
  allowedAlgorithms = ['RS256'],
  requiredType = 'JWT'
}) {
  if (!isPlainObject(header)) return reject('invalid-jose-header');
  if (!isPlainObject(selectedKey)) return reject('missing-selected-key');

  const { alg, kid, typ, crit } = header;
  if (typeof alg !== 'string' || !alg) return reject('missing-algorithm');
  if (!Array.isArray(allowedAlgorithms) || allowedAlgorithms.length === 0 ||
      allowedAlgorithms.some((item) => typeof item !== 'string' || !item)) {
    return reject('invalid-algorithm-policy');
  }
  if (!allowedAlgorithms.includes(alg)) return reject('algorithm-not-allowed');
  if (alg === 'none' || alg.startsWith('HS')) return reject('algorithm-confusion-risk');

  if (typeof kid !== 'string' || !kid) return reject('missing-kid');
  if (selectedKey.kid !== kid) return reject('selected-key-kid-mismatch');

  for (const name of FORBIDDEN_REMOTE_KEY_HEADERS) {
    if (Object.hasOwn(header, name)) return reject(`forbidden-${name}-header`);
  }

  if (crit !== undefined) {
    if (!Array.isArray(crit) || crit.length === 0 ||
        crit.some((name) => typeof name !== 'string' || !name)) {
      return reject('invalid-critical-header-list');
    }
    if (new Set(crit).size !== crit.length) return reject('duplicate-critical-header');
    if (crit.some((name) => !SUPPORTED_CRITICAL_HEADERS.has(name))) {
      return reject('unsupported-critical-header');
    }
  }

  if (requiredType !== null) {
    if (typeof requiredType !== 'string' || !requiredType) return reject('invalid-type-policy');
    if (typ !== requiredType) return reject('unexpected-token-type');
  }

  if (selectedKey.use !== 'sig') return reject('key-not-authorized-for-signature');
  if (selectedKey.alg !== alg) return reject('key-algorithm-mismatch');

  const expectedKeyType = alg.startsWith('RS') || alg.startsWith('PS') ? 'RSA'
    : alg.startsWith('ES') ? 'EC'
    : alg === 'EdDSA' ? 'OKP'
    : null;
  if (!expectedKeyType) return reject('unsupported-algorithm-family');
  if (selectedKey.kty !== expectedKeyType) return reject('key-type-mismatch');

  if (selectedKey.key_ops !== undefined) {
    if (!Array.isArray(selectedKey.key_ops) || !selectedKey.key_ops.includes('verify')) {
      return reject('key-operations-do-not-allow-verify');
    }
  }

  return accept({
    algorithm: alg,
    kid,
    tokenType: typ ?? null,
    keyType: selectedKey.kty,
    remoteKeyHeadersAccepted: false,
    cryptographicSignatureVerified: false
  });
}
