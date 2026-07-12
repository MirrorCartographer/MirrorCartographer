import { inspectResearchSurfaceIdentity } from './research-surface-identity.mjs';

export const DEFAULT_MAX_BODY_BYTES = 1_000_000;

function normalizeContentType(value) {
  return String(value || '').split(';', 1)[0].trim().toLowerCase();
}

export function evaluateDeploymentResponse({
  body,
  status,
  resolvedUrl = null,
  contentType = '',
  contentLength = null,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES
} = {}) {
  const source = typeof body === 'string' ? body : '';
  const bodyBytes = Buffer.byteLength(source, 'utf8');
  const normalizedType = normalizeContentType(contentType);
  const declaredLength = contentLength == null || contentLength === ''
    ? null
    : Number(contentLength);
  const validLimit = Number.isInteger(maxBodyBytes) && maxBodyBytes > 0;
  if (!validLimit) throw new Error('invalid-max-body-bytes');

  const typeOk = normalizedType === 'text/html' || normalizedType === 'application/xhtml+xml';
  const declaredLengthOk = declaredLength == null || (Number.isFinite(declaredLength) && declaredLength >= 0 && declaredLength <= maxBodyBytes);
  const bodyLengthOk = bodyBytes <= maxBodyBytes;
  const identity = inspectResearchSurfaceIdentity(source, { status, resolvedUrl });

  const reasons = [];
  if (!typeOk) reasons.push('unexpected-content-type');
  if (!declaredLengthOk) reasons.push('declared-body-too-large-or-invalid');
  if (!bodyLengthOk) reasons.push('body-too-large');
  if (!identity.valid_status) reasons.push('invalid-http-status');
  if (identity.missing_markers.length > 0) reasons.push('research-identity-mismatch');

  return {
    schema_version: '1.0.0',
    ok: reasons.length === 0,
    reasons,
    resolved_url: identity.resolved_url,
    status: identity.status,
    content_type: normalizedType || null,
    declared_content_length: declaredLength,
    body_bytes: bodyBytes,
    max_body_bytes: maxBodyBytes,
    missing_markers: identity.missing_markers
  };
}
