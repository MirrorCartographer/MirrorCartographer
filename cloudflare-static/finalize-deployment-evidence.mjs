import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDeploymentEvidenceManifest, REQUIRED_EVIDENCE_FILES } from './build-deployment-evidence-manifest.mjs';
import { verifyDeploymentEvidenceManifest } from './verify-deployment-evidence-manifest.mjs';
import { materializeMissingDeploymentEvidence } from './materialize-missing-deployment-evidence.mjs';

export function finalizeDeploymentEvidence({
  directory='.',
  output='cloudflare-deployment-evidence-manifest.json',
  sourceCommit,
  runId,
  generatedAt=new Date().toISOString(),
  files=REQUIRED_EVIDENCE_FILES
} = {}) {
  const outputPath = path.join(directory, output);
  if (fs.existsSync(outputPath)) throw new Error(`manifest-output-exists:${output}`);

  const closure = materializeMissingDeploymentEvidence({
    directory,
    sourceCommit,
    runId,
    generatedAt
  });
  const manifest = buildDeploymentEvidenceManifest({ directory, files, sourceCommit, runId, generatedAt });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });

  const verification = verifyDeploymentEvidenceManifest({
    manifest: JSON.parse(fs.readFileSync(outputPath, 'utf8')),
    directory,
    expectedSourceCommit: sourceCommit,
    expectedRunId: runId,
    requiredFiles: files
  });

  if (!verification.ok) {
    fs.rmSync(outputPath, { force: true });
    const error = new Error(`deployment-evidence-manifest-verification-failed:${verification.errors.join(',')}`);
    error.verification = verification;
    throw error;
  }

  return { manifest_path: outputPath, manifest, verification, closure };
}

function main() {
  const [directory='.', output='cloudflare-deployment-evidence-manifest.json'] = process.argv.slice(2);
  const result = finalizeDeploymentEvidence({
    directory,
    output,
    sourceCommit: process.env.GITHUB_SHA,
    runId: process.env.GITHUB_RUN_ID,
    generatedAt: process.env.RUN_STARTED_AT || new Date().toISOString()
  });
  process.stdout.write(`${JSON.stringify({ ok: true, manifest_path: result.manifest_path, closure: result.closure, ...result.verification })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
