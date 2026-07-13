#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EXPECTED_INPUTS = Object.freeze({
  authority: 'cloudflare-pages-hostname-authority.json',
  gate: 'cloudflare-hostname-evidence-gate.json',
  metadata: 'cloudflare-deployment-metadata.json'
});

export function verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit, expectedProject = 'mirror-cartographer-research' } = {}) {
  const errors = [];
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) errors.push('artifact.invalid');
  if (!/^[0-9a-f]{40}$/i.test(expectedCommit || '')) errors.push('expected-commit.invalid');
  if (typeof expectedProject !== 'string' || !expectedProject) errors.push('expected-project.invalid');
  if (errors.length) return { ok: false, verified: false, errors };

  if (artifact.schema_version !== '1.0.0') errors.push('schema-version.unsupported');
  if (artifact.artifact_type !== 'cloudflare-hostname-authority-consistency') errors.push('artifact-type.invalid');
  if (artifact.ok !== artifact.accepted) errors.push('verdict.inconsistent');
  if (artifact.deployment_claim_permitted !== artifact.accepted) errors.push('claim-permission.inconsistent');
  if (!Array.isArray(artifact.errors)) errors.push('errors.invalid');
  if (artifact.accepted === true && artifact.errors.length !== 0) errors.push('accepted-with-errors');
  if (artifact.accepted !== true && artifact.deployment_claim_permitted === true) errors.push('rejected-claim-permitted');

  const bindings = artifact.bindings;
  if (!bindings || typeof bindings !== 'object' || Array.isArray(bindings)) errors.push('bindings.invalid');
  else {
    if (bindings.project !== expectedProject) errors.push('bindings.project-mismatch');
    if (bindings.source_commit !== expectedCommit) errors.push('bindings.commit-mismatch');
    if (bindings.deployment_url !== null) {
      try {
        const url = new URL(bindings.deployment_url);
        if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash) errors.push('bindings.deployment-url-invalid');
        if (bindings.hostname !== url.hostname) errors.push('bindings.hostname-url-mismatch');
      } catch {
        errors.push('bindings.deployment-url-invalid');
      }
    } else if (artifact.accepted === true) errors.push('accepted-without-deployment-url');
    if (artifact.accepted === true && typeof bindings.metadata_deployment_id !== 'string') errors.push('accepted-without-deployment-id');
    if (artifact.accepted === true && !['canonical', 'pages-preview'].includes(bindings.authority_relation)) errors.push('accepted-with-untrusted-relation');
  }

  if (JSON.stringify(artifact.source_inputs) !== JSON.stringify(EXPECTED_INPUTS)) errors.push('source-inputs.invalid');
  if (artifact?.privacy?.secret_values_emitted !== false) errors.push('privacy.secret-emission-not-denied');
  if (typeof artifact.acceptance_rule !== 'string' || !artifact.acceptance_rule) errors.push('acceptance-rule.missing');
  if (typeof artifact.epistemic_limit !== 'string' || !artifact.epistemic_limit) errors.push('epistemic-limit.missing');

  const uniqueErrors = [...new Set(errors)];
  return {
    ok: uniqueErrors.length === 0,
    verified: uniqueErrors.length === 0,
    accepted: artifact.accepted === true,
    deployment_claim_permitted: uniqueErrors.length === 0 && artifact.deployment_claim_permitted === true,
    errors: uniqueErrors,
    claim_ceiling: uniqueErrors.length === 0 && artifact.accepted === true
      ? 'deployment-identity-consistency-only'
      : 'no-deployment-claim'
  };
}

function main() {
  const [artifactPath='cloudflare-hostname-authority-consistency.json', expectedCommit=process.env.GITHUB_SHA, expectedProject=process.env.CLOUDFLARE_PAGES_PROJECT || 'mirror-cartographer-research'] = process.argv.slice(2);
  const artifact = JSON.parse(fs.readFileSync(path.resolve(artifactPath), 'utf8'));
  const result = verifyHostnameAuthorityConsistencyArtifact({ artifact, expectedCommit, expectedProject });
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.verified) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
