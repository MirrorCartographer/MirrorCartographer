import fs from 'node:fs';
import { evaluateCloudflarePagesUrlPolicy } from './cloudflare-pages-url-policy.mjs';

function readJsonIfPresent(path) {
  if (!path || !fs.existsSync(path)) return null;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function readNdjsonIfPresent(path) {
  if (!path || !fs.existsSync(path)) return [];
  return fs.readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

export function buildDeploymentProof(input = {}) {
  const authority = evaluateCloudflarePagesUrlPolicy({
    deployment_url: input.deployment_url,
    alias_url: input.alias_url
  }, { project: input.project });

  return {
    schema_version: '1.1.0',
    source_commit: input.source_commit || null,
    workflow_run: input.workflow_run || null,
    deployment_url: input.deployment_url || null,
    alias_url: input.alias_url || null,
    url_authority: authority,
    readiness: input.readiness ?? null,
    access_probe: input.access_probe ?? null,
    blocker: input.blocker ?? null,
    deployment_decision: input.deployment_decision ?? null,
    verifier_output: input.verifier_output ?? [],
    generated_at: input.generated_at || new Date().toISOString()
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] || 'cloudflare-deployment-proof.json';
  const proof = buildDeploymentProof({
    project: process.env.CLOUDFLARE_PAGES_PROJECT || 'mirror-cartographer-research',
    source_commit: process.env.GITHUB_SHA,
    workflow_run: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null,
    deployment_url: process.env.DEPLOYMENT_URL || null,
    alias_url: process.env.ALIAS_URL || null,
    readiness: readJsonIfPresent('cloudflare-deployment-readiness.json'),
    access_probe: readJsonIfPresent('cloudflare-access-probe.json'),
    blocker: readJsonIfPresent('cloudflare-deployment-blocker.json'),
    deployment_decision: readJsonIfPresent('cloudflare-deployment-decision.json'),
    verifier_output: readNdjsonIfPresent('cloudflare-deployment-proof.ndjson')
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(proof, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ valid: proof.url_authority.valid, errors: proof.url_authority.errors })}\n`);
  if (proof.deployment_decision?.decision === 'deploy' && !proof.url_authority.valid) process.exit(1);
}
