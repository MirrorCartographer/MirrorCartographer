// Stable governance output helper for MC durable artifacts.
// Public-safe: contains no private user material.
// Purpose: shared deterministic JSON, Markdown, path, digest, and redaction primitives for replay tools.

import { createHash } from 'node:crypto';
import path from 'node:path';

export class StableGovernanceOutputError extends Error {
  constructor(code, message, detail = {}) {
    super(`${code}: ${message}`);
    this.name = 'StableGovernanceOutputError';
    this.code = code;
    this.detail = detail;
  }
}

export const STABLE_OUTPUT_SCHEMA_ID = 'stable.governance.output.v1';

const SECRET_LIKE_PATTERN = /(?:ghp_|github_pat_|sk-[A-Za-z0-9]|BEGIN [A-Z ]*PRIVATE KEY|password=|token=|api[_-]?key\s*[:=]|authorization:\s*bearer)/i;
const ABSOLUTE_PATH_PATTERN = /(?:^|\s)(?:\/Users\/|\/home\/|C:\\Users\\|[A-Za-z]:\\)[^\s]*/i;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SAFE_RELATIVE_POSIX_PATH_PATTERN = /^(?!\/)(?!~)(?!.*(?:^|\/)\.\.(?:\/|$))(?!.*\/\/)[A-Za-z0-9._/-]{1,240}$/;

export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function assertStableJsonValue(value, pointer = '') {
  if (value === null) return;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return;
  if (type === 'number') {
    if (!Number.isFinite(value)) {
      throw new StableGovernanceOutputError('STABLE_OUTPUT_NONFINITE_NUMBER', 'Stable JSON cannot encode non-finite numbers.', { pointer });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertStableJsonValue(item, `${pointer}/${index}`));
    return;
  }
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (typeof key !== 'string' || !key.length) {
        throw new StableGovernanceOutputError('STABLE_OUTPUT_INVALID_KEY', 'Stable JSON object keys must be non-empty strings.', { pointer });
      }
      assertStableJsonValue(child, `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`);
    }
    return;
  }
  throw new StableGovernanceOutputError('STABLE_OUTPUT_UNSUPPORTED_TYPE', 'Stable JSON supports only JSON values.', { pointer, type });
}

export function stableSortValue(value) {
  assertStableJsonValue(value);
  if (Array.isArray(value)) return value.map((item) => stableSortValue(item));
  if (isPlainObject(value)) {
    const output = {};
    for (const key of Object.keys(value).sort()) output[key] = stableSortValue(value[key]);
    return output;
  }
  return value;
}

export function stableJson(value, options = {}) {
  const sorted = stableSortValue(value);
  const spaces = Number.isInteger(options.spaces) ? options.spaces : 2;
  return `${JSON.stringify(sorted, null, spaces)}\n`;
}

export function sha256Hex(bytes) {
  const input = typeof bytes === 'string' || Buffer.isBuffer(bytes) ? bytes : stableJson(bytes);
  return createHash('sha256').update(input).digest('hex');
}

export function hasUnsafePublicText(value) {
  if (typeof value !== 'string') return false;
  return SECRET_LIKE_PATTERN.test(value) || ABSOLUTE_PATH_PATTERN.test(value) || CONTROL_CHAR_PATTERN.test(value);
}

export function redactPublicText(value, fallback = '[redacted]') {
  if (value === undefined || value === null) return fallback;
  const text = String(value).replace(CONTROL_CHAR_PATTERN, ' ').trim();
  if (!text) return fallback;
  if (hasUnsafePublicText(text)) return fallback;
  return text.length > 240 ? `${text.slice(0, 237)}...` : text;
}

export function sanitizePublicScalar(value) {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : '[redacted-nonfinite-number]';
  if (typeof value === 'string') return redactPublicText(value);
  return '[redacted-non-scalar]';
}

export function sanitizePublicObject(value, options = {}) {
  const maxEntries = Number.isInteger(options.maxEntries) ? options.maxEntries : 24;
  if (!isPlainObject(value)) return undefined;
  const output = {};
  for (const [key, child] of Object.entries(value).slice(0, maxEntries)) {
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(key)) continue;
    output[key] = sanitizePublicScalar(child);
  }
  return Object.keys(output).length ? output : undefined;
}

export function normalizeRepositoryPath(input) {
  const raw = String(input || '').trim().replaceAll('\\', '/');
  const normalized = path.posix.normalize(raw);
  if (normalized === '.' || !SAFE_RELATIVE_POSIX_PATH_PATTERN.test(normalized)) {
    throw new StableGovernanceOutputError('STABLE_OUTPUT_UNSAFE_PATH', 'Output path must be repository-relative POSIX without parent traversal.', { input: redactPublicText(raw) });
  }
  return normalized;
}

export function markdownEscape(value) {
  return redactPublicText(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('`', '\\`')
    .replaceAll('\n', ' ')
    .replaceAll('\r', ' ');
}

export function markdownTable(headers, rows) {
  const safeHeaders = headers.map(markdownEscape);
  const lines = [
    `| ${safeHeaders.join(' | ')} |`,
    `| ${safeHeaders.map(() => '---').join(' | ')} |`
  ];
  for (const row of rows) {
    lines.push(`| ${row.map(markdownEscape).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export function stableOutputRecord({ kind, path: outputPath, body, safeDetails }) {
  const normalizedPath = normalizeRepositoryPath(outputPath);
  const bytes = typeof body === 'string' ? body : stableJson(body);
  return Object.freeze({
    schema: STABLE_OUTPUT_SCHEMA_ID,
    kind: redactPublicText(kind || 'governance.output'),
    path: normalizedPath,
    bytesSha256: sha256Hex(bytes),
    byteLength: Buffer.byteLength(bytes),
    safeDetails: sanitizePublicObject(safeDetails) || undefined
  });
}

export function recordsManifest(records = []) {
  const normalized = records.map((record) => stableSortValue(record)).sort((a, b) => a.path.localeCompare(b.path));
  return Object.freeze({
    schema: STABLE_OUTPUT_SCHEMA_ID,
    kind: 'governance.output.records_manifest',
    records: normalized,
    recordsSha256: sha256Hex(stableJson(normalized))
  });
}
