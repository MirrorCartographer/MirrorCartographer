import fs from 'node:fs';
import crypto from 'node:crypto';

const REQUIRED_SECRET_NAMES = new Set([
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN'
]);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function assertSafeReadiness(readiness) {
  if (!readiness || typeof readiness !== 'object') throw new Error('invalid-readiness');
  if (readiness.ready !== false) throw new Error('blocked-packet-requires-not-ready');
  const missing = readiness.missing || readiness.missing_secrets || [];
  if (!Array.isArray(missing) || missing.length === 0) throw new Error('missing-secret-list-required');
  for (const name of missing) {
    if (!REQUIRED_SECRET_NAMES.has(name)) throw new Error(`unexpected-secret-name:${name}`);
  }
  return [...new Set(missing)].sort();
}

export function buildBlockedDeploymentEvidence({
  readiness,
  blocker = null,
  sourceCommit,
  workflowRun = null,
  generatedAt = new Date().toISOString()
}) {
  if (!/^[0-9a-f]{40}$/.test(sourceCommit || '')) throw new Error('invalid-source-commit');
  const missingSecrets = assertSafeReadiness(readiness);
  const readinessBytes = `${JSON.stringify(readiness, null, 2)}\n`;

  return {
    schema_version: '1.0.0',
    claim_state: 'observed',
    deployment_state: 'blocked_external_configuration',
    source_commit: sourceCommit,
    workflow_run: workflowRun,
    deployment_url: null,
    deployed_commit: null,
    served_identity_verified: false,
    deployment_proven: false,
    missing_configuration: missingSecrets,
    blocker_reason_codes: Array.isArray(blocker?.reason_codes) ? blocker.reason_codes : [],
    readiness_sha256: sha256(readinessBytes),
    privacy: {
      secret_values_emitted: false,
      allowed_secret_names_only: true
    },
    epistemic_limit: 'This packet proves only that deployment was blocked by named configuration requirements; it does not prove a deployment occurred.',
    falsification_route: 'Provide a resolving Cloudflare deployment URL, verify served research-surface identity, and bind the served commit to an accepted signed evidence packet.',
    generated_at: generatedAt
  };
}

export function writeBlockedDeploymentEvidence(readinessPath, blockerPath, outputPath, options = {}) {
  const readiness = readJson(readinessPath);
  const blocker = blockerPath && fs.existsSync(blockerPath) ? readJson(blockerPath) : null;
  const packet = buildBlockedDeploymentEvidence({ readiness, blocker, ...options });
  fs.writeFileSync(outputPath, `${JSON.stringify(packet, null, 2)}\n`);
  return packet;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [readinessPath, blockerPath, outputPath] = process.argv.slice(2);
  if (!readinessPath || !outputPath) {
    throw new Error('usage: node build-blocked-deployment-evidence.mjs <readiness.json> <blocker.json|-> <output.json>');
  }
  const packet = writeBlockedDeploymentEvidence(
    readinessPath,
    blockerPath === '-' ? null : blockerPath,
    outputPath,
    {
      sourceCommit: process.env.GITHUB_SHA,
      workflowRun: process.env.GITHUB_RUN_ID && process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
        ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null
    }
  );
  process.stdout.write(`${JSON.stringify({ deployment_state: packet.deployment_state, deployment_proven: packet.deployment_proven })}\n`);
}
