// Governance artifact manifest helper for MC durable artifacts.
// Public-safe: contains no private user material.
// Purpose: create deterministic, digest-verifiable manifest.json files for governance replay artifact directories.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { canonicalize } from './governance-canonical-json.mjs';

export class GovernanceArtifactManifestError extends Error {
  constructor(code, message, detail = {}) {
    super(`${code}: ${message}`);
    this.name = 'GovernanceArtifactManifestError';
    this.code = code;
    this.detail = detail;
  }
}

const DEFAULT_PUBLIC_SAFETY_POLICY = {
  id: 'governance-public-safe.v1',
  textMediaTypePrefixes: ['text/', 'application/json', 'application/ld+json', 'application/schema+json', 'application/problem+json'],
  blockedPatterns: [
    { code: 'GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK', label: 'secret-like assignment', pattern: /(?:api[_-]?key|secret|token|password|passwd)\s*[:=]\s*[^\s,;}]+/i },
    { code: 'GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK', label: 'private key block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    { code: 'GOVERNANCE_ARTIFACT_PUBLIC_SAFETY_BLOCK', label: 'absolute home path', pattern: /(?:\/Users\/|\/home\/|C:\\Users\\)[^\s]+/i }
  ]
};

export function normalizeArtifactPath(relativePath) {
  if (typeof relativePath !== 'string') {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path must be a string');
  }

  const raw = relativePath.trim();
  if (!raw) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path must not be empty');
  }
  if (raw.includes('\\')) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path must use forward slashes', { path: raw });
  }
  if (raw.startsWith('/') || raw.startsWith('~') || /^[A-Za-z]:/.test(raw)) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path must be relative', { path: raw });
  }

  const normalized = path.posix.normalize(raw);
  if (normalized === '.' || normalized.startsWith('../') || normalized === '..') {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path must not escape the artifact root', { path: raw });
  }
  if (normalized.split('/').some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact path contains unsafe segment', { path: raw });
  }
  return normalized;
}

export function resolveArtifactRoot(outDir) {
  if (typeof outDir !== 'string' || !outDir.trim()) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact root must be a non-empty path');
  }
  return path.resolve(outDir);
}

export function hashFileSha256(filePath) {
  try {
    return createHash('sha256').update(readFileSync(filePath)).digest('hex');
  } catch (error) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_DIGEST_UNREADABLE', 'unable to digest artifact file', { filePath, cause: error.message });
  }
}

export function describeArtifactFile({ root, path: relativePath, role, mediaType = 'application/octet-stream' }) {
  const normalizedPath = normalizeArtifactPath(relativePath);
  if (typeof role !== 'string' || !role.trim()) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_PATH_INVALID', 'artifact file role must be a non-empty string', { path: normalizedPath });
  }

  const filePath = path.join(root, normalizedPath);
  if (!existsSync(filePath)) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_FILE_MISSING', 'declared artifact file does not exist', { path: normalizedPath });
  }

  const stats = statSync(filePath);
  if (!stats.isFile()) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_FILE_MISSING', 'declared artifact path is not a file', { path: normalizedPath });
  }

  return {
    path: normalizedPath,
    role: role.trim(),
    mediaType,
    bytes: stats.size,
    digest: {
      algorithm: 'sha256',
      value: hashFileSha256(filePath),
      uri: `sha256:${hashFileSha256(filePath)}`
    }
  };
}

export function scanArtifactPublicSafety({ root, files, policy = DEFAULT_PUBLIC_SAFETY_POLICY } = {}) {
  const checks = [];
  for (const file of files) {
    const mediaType = file.mediaType || 'application/octet-stream';
    const shouldScan = policy.textMediaTypePrefixes.some((prefix) => mediaType === prefix || mediaType.startsWith(prefix));
    if (!shouldScan) continue;

    const filePath = path.join(root, normalizeArtifactPath(file.path));
    const body = readFileSync(filePath, 'utf8');
    for (const blocked of policy.blockedPatterns) {
      if (blocked.pattern.test(body)) {
        checks.push({
          code: blocked.code,
          severity: 'error',
          path: file.path,
          message: `Public-safety policy blocked generated text: ${blocked.label}. Offending content is intentionally not copied.`
        });
      }
    }
  }
  return checks;
}

export function buildArtifactManifest({ artifactKind, producer, root, files, summary, exitBehavior, publicSafety = {} }) {
  if (!artifactKind || typeof artifactKind !== 'string') {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', 'artifactKind is required');
  }
  if (!producer || typeof producer.tool !== 'string' || typeof producer.version !== 'string') {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', 'producer.tool and producer.version are required');
  }

  const describedFiles = files
    .map((file) => describeArtifactFile({ root, ...file }))
    .sort((a, b) => a.path.localeCompare(b.path));

  const publicSafetyChecks = scanArtifactPublicSafety({ root, files: describedFiles, policy: publicSafety.policy || DEFAULT_PUBLIC_SAFETY_POLICY });
  const publicSafetyStatus = publicSafetyChecks.length === 0 ? 'pass' : 'fail';

  return {
    schema: 'governance.replay.artifact.manifest.v1',
    artifactKind,
    producer: {
      tool: producer.tool,
      version: producer.version,
      deterministicPolicy: producer.deterministicPolicy || 'deterministic-build-no-wall-clock'
    },
    summary: {
      primaryStatus: summary?.primaryStatus || (publicSafetyStatus === 'pass' ? 'pass' : 'fail'),
      description: summary?.description || 'Governance replay artifact manifest.'
    },
    exitBehavior: {
      expectedExitCode: Number.isInteger(exitBehavior?.expectedExitCode) ? exitBehavior.expectedExitCode : 0,
      stableExitPolicy: exitBehavior?.stableExitPolicy || 'status-derived-exit-code'
    },
    publicSafety: {
      policyId: publicSafety.policyId || DEFAULT_PUBLIC_SAFETY_POLICY.id,
      status: publicSafetyStatus,
      checks: publicSafetyChecks
    },
    files: describedFiles
  };
}

export function validateArtifactManifest({ manifest }) {
  const checks = [];
  const requiredTop = ['schema', 'artifactKind', 'producer', 'summary', 'exitBehavior', 'publicSafety', 'files'];
  for (const key of requiredTop) {
    if (!(key in manifest)) {
      checks.push({ code: 'GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', severity: 'error', path: '$', message: `missing required field: ${key}` });
    }
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    checks.push({ code: 'GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', severity: 'error', path: '$.files', message: 'manifest must describe at least one file' });
  }
  for (const [index, file] of (manifest.files || []).entries()) {
    if (!file.path || !file.role || !file.digest?.value || !file.digest?.uri) {
      checks.push({ code: 'GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', severity: 'error', path: `$.files[${index}]`, message: 'file record must include path, role, digest.value, and digest.uri' });
    }
  }
  if (manifest.publicSafety?.status === 'fail') {
    checks.push(...manifest.publicSafety.checks);
  }
  return checks;
}

export function writeArtifactManifest({ root, manifest }) {
  const checks = validateArtifactManifest({ manifest });
  if (checks.some((check) => check.severity === 'error')) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_MANIFEST_SCHEMA_INVALID', 'manifest did not pass helper validation', { checks });
  }

  mkdirSync(root, { recursive: true });
  const finalPath = path.join(root, 'manifest.json');
  const tmpPath = path.join(root, 'manifest.json.tmp');
  try {
    writeFileSync(tmpPath, `${canonicalize(manifest)}\n`, 'utf8');
    renameSync(tmpPath, finalPath);
  } catch (error) {
    throw new GovernanceArtifactManifestError('GOVERNANCE_ARTIFACT_MANIFEST_WRITE_FAILED', 'unable to write artifact manifest', { cause: error.message });
  }
  return finalPath;
}

export function createArtifactManifestDirectory({ root: outDir, files, manifestInput }) {
  const root = resolveArtifactRoot(outDir);
  const manifest = buildArtifactManifest({ root, files, ...manifestInput });
  const pathWritten = writeArtifactManifest({ root, manifest });
  return {
    manifest,
    path: pathWritten,
    checks: validateArtifactManifest({ manifest })
  };
}
