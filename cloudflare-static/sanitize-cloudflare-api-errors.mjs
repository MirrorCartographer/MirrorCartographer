const ALLOWED_CODES = new Set([
  10000,
  10001,
  10002,
  10003,
  7000,
  7003,
  9109,
  1001,
  1002,
  1003,
  1004
]);

function normalizeCode(value) {
  if (Number.isInteger(value)) return value;
  if (typeof value === 'string' && /^\d{1,8}$/.test(value.trim())) return Number(value.trim());
  return null;
}

export function sanitizeCloudflareApiErrors(errors) {
  if (!Array.isArray(errors)) return [];

  const sanitized = [];
  for (const entry of errors.slice(0, 8)) {
    const code = normalizeCode(entry?.code);
    sanitized.push({
      code: code !== null && ALLOWED_CODES.has(code) ? code : null,
      classification: code !== null && ALLOWED_CODES.has(code) ? 'recognized_cloudflare_code' : 'unrecognized_provider_error'
    });
  }

  return sanitized;
}

export function assertSanitizedCloudflareErrors(errors) {
  if (!Array.isArray(errors)) throw new Error('errors-must-be-an-array');
  if (errors.length > 8) throw new Error('too-many-provider-errors');

  for (const entry of errors) {
    const keys = Object.keys(entry || {}).sort();
    if (keys.join(',') !== 'classification,code') throw new Error('provider-error-shape-not-redacted');
    if (entry.code !== null && !ALLOWED_CODES.has(entry.code)) throw new Error('provider-error-code-not-allowlisted');
    if (!['recognized_cloudflare_code', 'unrecognized_provider_error'].includes(entry.classification)) {
      throw new Error('provider-error-classification-invalid');
    }
  }

  return true;
}
