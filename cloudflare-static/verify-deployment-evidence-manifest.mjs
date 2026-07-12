import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { REQUIRED_EVIDENCE_FILES } from './build-deployment-evidence-manifest.mjs';

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function canonicalManifestPayload(manifest) {
  return {
    schema_version: manifest.schema_version,
    artifact_type: manifest.artifact_type,
    source_commit: manifest.source_commit,
    workflow_run_id: manifest.workflow_run_id,
    generated_at: manifest.generated_at,
    evidence_files: manifest.evidence_files
  };
}

export function verifyDeploymentEvidenceManifest({
  manifest,
  directory='.',
  expectedSourceCommit,
  expectedRunId,
  requiredFiles=REQUIRED_EVIDENCE_FILES
} = {}) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return { ok: false, errors: ['invalid-manifest'], checked_files: 0 };
  }
  if (manifest.schema_version !== '1.0.0') errors.push('unsupported-schema-version');
  if (manifest.artifact_type !== 'cloudflare-deployment-evidence-manifest') errors.push('invalid-artifact-type');
  if (!/^[0-9a-f]{40}$/.test(manifest.source_commit ?? '')) errors.push('invalid-source-commit');
  if (expectedSourceCommit && manifest.source_commit !== expectedSourceCommit.toLowerCase()) errors.push('source-commit-mismatch');
  if (!/^[1-9][0-9]*$/.test(manifest.workflow_run_id ?? '')) errors.push('invalid-run-id');
  if (expectedRunId && manifest.workflow_run_id !== String(expectedRunId)) errors.push('run-id-mismatch');
  if (!Number.isFinite(Date.parse(manifest.generated_at ?? ''))) errors.push('invalid-generated-at');
  if (!Array.isArray(manifest.evidence_files)) {
    errors.push('invalid-evidence-files');
    return { ok: false, errors, checked_files: 0 };
  }

  const entries = manifest.evidence_files;
  const paths = entries.map((entry) => entry?.path);
  if (new Set(paths).size !== paths.length) errors.push('duplicate-evidence-path');
  if (JSON.stringify(paths) !== JSON.stringify([...paths].sort())) errors.push('evidence-paths-not-sorted');
  const required = [...requiredFiles].sort();
  if (JSON.stringify(paths) !== JSON.stringify(required)) errors.push('required-evidence-set-mismatch');

  let checkedFiles = 0;
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object' || typeof entry.path !== 'string') {
      errors.push('invalid-evidence-entry');
      continue;
    }
    if (path.isAbsolute(entry.path) || entry.path.includes('..') || entry.path.includes('\\') || path.basename(entry.path) !== entry.path) {
      errors.push(`unsafe-evidence-path:${entry.path}`);
      continue;
    }
    const absolutePath = path.join(directory, entry.path);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`missing-evidence-file:${entry.path}`);
      continue;
    }
    const bytes = fs.readFileSync(absolutePath);
    checkedFiles += 1;
    if (bytes.length !== entry.size_bytes) errors.push(`size-mismatch:${entry.path}`);
    if (sha256(bytes) !== entry.sha256) errors.push(`digest-mismatch:${entry.path}`);
  }

  const computedManifestDigest = sha256(Buffer.from(JSON.stringify(canonicalManifestPayload(manifest))));
  if (computedManifestDigest !== manifest.manifest_sha256) errors.push('manifest-digest-mismatch');

  return {
    ok: errors.length === 0,
    errors,
    checked_files: checkedFiles,
    source_commit: manifest.source_commit ?? null,
    workflow_run_id: manifest.workflow_run_id ?? null,
    manifest_sha256: manifest.manifest_sha256 ?? null
  };
}

function main() {
  const [manifestPath='cloudflare-deployment-evidence-manifest.json', directory='.'] = process.argv.slice(2);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const result = verifyDeploymentEvidenceManifest({
    manifest,
    directory,
    expectedSourceCommit: process.env.GITHUB_SHA,
    expectedRunId: process.env.GITHUB_RUN_ID
  });
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
