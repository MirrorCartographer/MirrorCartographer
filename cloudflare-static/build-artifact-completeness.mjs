import fs from 'node:fs';
import path from 'node:path';

export const ARTIFACT_RULES = Object.freeze([
  { name: 'cloudflare-deployment-readiness.json', alwaysRequired: true },
  { name: 'cloudflare-access-probe.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-blocker.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-decision.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-proof.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-proof.intoto.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-proof.signature-verification.json', alwaysRequired: true },
  { name: 'cloudflare-evidence-verification-input.json', alwaysRequired: true },
  { name: 'cloudflare-deployment-acceptance.json', alwaysRequired: true },
  { name: 'cloudflare-pages-hostname-authority.json', requiredWhen: 'access_authorized' },
  { name: 'cloudflare-deployment-metadata.json', requiredWhen: 'deployment_succeeded' },
  { name: 'cloudflare-deployment-proof.ndjson', requiredWhen: 'deployment_succeeded' }
]);

function readJsonIfPresent(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function accessAuthorized(accessProbe) {
  return accessProbe?.ok === true || accessProbe?.authorized === true || accessProbe?.status === 'authorized';
}

function deploymentSucceeded(decision) {
  return decision?.deployment?.status === 'succeeded'
    || decision?.deploymentStatus === 'succeeded'
    || decision?.status === 'deployed'
    || decision?.deployStepOutcome === 'success';
}

export function buildArtifactCompleteness({ directory = '.', rules = ARTIFACT_RULES } = {}) {
  const accessProbe = readJsonIfPresent(path.join(directory, 'cloudflare-access-probe.json'));
  const deploymentDecision = readJsonIfPresent(path.join(directory, 'cloudflare-deployment-decision.json'));
  const state = {
    access_authorized: accessAuthorized(accessProbe),
    deployment_succeeded: deploymentSucceeded(deploymentDecision)
  };

  const artifacts = rules.map((rule) => {
    const filePath = path.join(directory, rule.name);
    const present = fs.existsSync(filePath) && fs.statSync(filePath).isFile() && fs.statSync(filePath).size > 0;
    const required = rule.alwaysRequired === true || (rule.requiredWhen ? state[rule.requiredWhen] === true : false);
    return {
      name: rule.name,
      present,
      required,
      requirement: rule.alwaysRequired === true ? 'always' : rule.requiredWhen,
      classification: present ? 'present' : required ? 'missing_required' : 'missing_expected'
    };
  });

  const missingRequired = artifacts.filter((item) => item.classification === 'missing_required').map((item) => item.name);
  return {
    schema_version: '1.0.0',
    state,
    complete: missingRequired.length === 0,
    missing_required: missingRequired,
    artifacts,
    epistemic_limit: 'Artifact completeness proves expected files exist for the observed workflow state; it does not prove deployment success, hostname reachability, served identity, or claim truth.'
  };
}

export function writeArtifactCompleteness(outputPath, options = {}) {
  const result = buildArtifactCompleteness(options);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outputPath = process.argv[2] ?? 'cloudflare-artifact-completeness.json';
  const result = writeArtifactCompleteness(outputPath);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.complete) process.exitCode = 1;
}
