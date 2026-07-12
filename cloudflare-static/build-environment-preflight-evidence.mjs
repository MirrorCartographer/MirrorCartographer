import fs from 'node:fs';
import crypto from 'node:crypto';

const FORBIDDEN_KEYS = /^(value|secret|token|credential|password|api[_-]?key)$/i;

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function canonicalJson(value) {
  return `${JSON.stringify(stable(value), null, 2)}\n`;
}

export function sha256Text(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function assertNoSecretMaterial(value, path = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretMaterial(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.test(key)) throw new Error(`forbidden-secret-material:${path}.${key}`);
    assertNoSecretMaterial(child, `${path}.${key}`);
  }
}

export function buildEnvironmentPreflightEvidence({ requirements, workflowContract, source = {} }) {
  assertNoSecretMaterial(requirements);
  assertNoSecretMaterial(workflowContract);
  assertNoSecretMaterial(source);

  const requiredSecrets = (requirements?.required_secrets ?? []).map((entry) => entry?.name).filter(Boolean).sort();
  const contractReferenced = [...(workflowContract?.referencedSecrets ?? [])].sort();
  const declarationsMatch = workflowContract?.ok === true
    && requirements?.environment === workflowContract?.environment
    && requiredSecrets.every((name) => contractReferenced.includes(name));

  const packet = {
    schema_version: '1.0.0',
    evidence_type: 'cloudflare_environment_preflight',
    claim_state: declarationsMatch ? 'configuration_declared' : 'configuration_contract_failed',
    ready_for_dispatch: declarationsMatch,
    environment: requirements?.environment ?? null,
    provider: requirements?.provider ?? null,
    project_name: requirements?.project_name ?? null,
    required_secret_names: requiredSecrets,
    workflow_referenced_secret_names: contractReferenced,
    workflow_contract_errors: [...(workflowContract?.errors ?? [])].sort(),
    source: {
      repository: source.repository ?? null,
      commit_sha: source.commit_sha ?? null,
      workflow_path: requirements?.workflow ?? null,
      requirements_path: source.requirements_path ?? null
    },
    evidence_strength: 'repository_declaration_only',
    proves: [
      'required environment and secret names are declared consistently in repository artifacts'
    ],
    does_not_prove: [
      'GitHub environment exists',
      'required secrets are installed or correct',
      'Cloudflare token is authorized',
      'Cloudflare project exists in the configured account',
      'deployment succeeded',
      'served hostname resolves',
      'scientific or medical claims are true'
    ],
    falsification_route: [
      'fail if workflow contract validation fails',
      'fail if requirements and workflow environment names differ',
      'fail if any required secret name is not referenced by the workflow',
      'reject any packet containing secret values or credential material'
    ]
  };

  const canonical = canonicalJson(packet);
  return { ...packet, packet_sha256: sha256Text(canonical) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const requirementsPath = process.argv[2] ?? 'cloudflare-static/cloudflare-environment-requirements.json';
  const workflowContractPath = process.argv[3] ?? 'cloudflare-workflow-environment-contract.json';
  const outputPath = process.argv[4] ?? 'cloudflare-environment-preflight.json';
  const requirements = JSON.parse(fs.readFileSync(requirementsPath, 'utf8'));
  const workflowContract = JSON.parse(fs.readFileSync(workflowContractPath, 'utf8'));
  const result = buildEnvironmentPreflightEvidence({
    requirements,
    workflowContract,
    source: {
      repository: process.env.GITHUB_REPOSITORY ?? null,
      commit_sha: process.env.GITHUB_SHA ?? null,
      requirements_path: requirementsPath
    }
  });
  fs.writeFileSync(outputPath, canonicalJson(result));
  process.stdout.write(`${JSON.stringify({ ok: result.ready_for_dispatch, outputPath, packet_sha256: result.packet_sha256 })}\n`);
  if (!result.ready_for_dispatch) process.exitCode = 1;
}
