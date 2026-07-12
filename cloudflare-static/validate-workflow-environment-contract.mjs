import fs from 'node:fs';

export const REQUIRED_ENVIRONMENT = 'cloudflare-research';
export const REQUIRED_SECRETS = Object.freeze([
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_API_TOKEN'
]);

function unique(values) {
  return [...new Set(values)];
}

export function inspectWorkflowEnvironmentContract(workflowText) {
  if (typeof workflowText !== 'string' || workflowText.trim() === '') {
    return {
      ok: false,
      environment: null,
      referencedSecrets: [],
      missingSecrets: [...REQUIRED_SECRETS],
      unexpectedCloudflareSecrets: [],
      errors: ['workflow-text-missing']
    };
  }

  const environmentMatch = workflowText.match(/^\s*environment:\s*([^\s#]+)\s*$/m);
  const environment = environmentMatch?.[1] ?? null;
  const referencedSecrets = unique(
    [...workflowText.matchAll(/secrets\.([A-Z0-9_]+)/g)].map((match) => match[1])
  ).sort();
  const missingSecrets = REQUIRED_SECRETS.filter((name) => !referencedSecrets.includes(name));
  const unexpectedCloudflareSecrets = referencedSecrets.filter(
    (name) => name.startsWith('CLOUDFLARE_') && !REQUIRED_SECRETS.includes(name)
  );

  const errors = [];
  if (environment !== REQUIRED_ENVIRONMENT) errors.push('environment-name-mismatch');
  if (missingSecrets.length > 0) errors.push('required-secret-reference-missing');
  if (unexpectedCloudflareSecrets.length > 0) errors.push('unexpected-cloudflare-secret-reference');

  return {
    ok: errors.length === 0,
    environment,
    referencedSecrets,
    missingSecrets,
    unexpectedCloudflareSecrets,
    errors
  };
}

export function validateWorkflowEnvironmentContract(workflowPath) {
  const workflowText = fs.readFileSync(workflowPath, 'utf8');
  return inspectWorkflowEnvironmentContract(workflowText);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const workflowPath = process.argv[2] ?? '.github/workflows/cloudflare-pages-research.yml';
  let result;
  try {
    result = validateWorkflowEnvironmentContract(workflowPath);
  } catch (error) {
    result = {
      ok: false,
      environment: null,
      referencedSecrets: [],
      missingSecrets: [...REQUIRED_SECRETS],
      unexpectedCloudflareSecrets: [],
      errors: ['workflow-read-failed'],
      errorCode: error?.code ?? 'unknown'
    };
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}
