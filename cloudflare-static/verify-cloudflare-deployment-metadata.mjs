import fs from 'node:fs';

const PROJECT = 'mirror-cartographer-research';

function normalizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function normalizeBranch(value) {
  if (typeof value !== 'string') return null;
  const branch = value.trim();
  if (!branch || branch.length > 255 || /[\u0000-\u001f\u007f]/.test(branch)) return null;
  return branch;
}

export function evaluateDeploymentMetadata({ deployments, expectedCommit, expectedUrl, expectedBranch, project = PROJECT } = {}) {
  const normalizedExpectedUrl = normalizeUrl(expectedUrl);
  const normalizedExpectedBranch = normalizeBranch(expectedBranch);
  const errors = [];
  if (!Array.isArray(deployments)) errors.push('deployments-must-be-array');
  if (!/^[0-9a-f]{40}$/i.test(expectedCommit || '')) errors.push('expected-commit-must-be-full-sha');
  if (!normalizedExpectedUrl) errors.push('expected-url-invalid');
  if (!normalizedExpectedBranch) errors.push('expected-branch-invalid');
  if (typeof project !== 'string' || !project) errors.push('project-required');
  if (errors.length) return { valid: false, classification: 'invalid-input', errors, match: null };

  const candidates = deployments.filter((deployment) => {
    const metadata = deployment?.deployment_trigger?.metadata;
    const commit = metadata?.commit_hash;
    const branch = normalizeBranch(metadata?.branch);
    const url = normalizeUrl(deployment?.url);
    return deployment?.project_name === project
      && commit === expectedCommit
      && branch === normalizedExpectedBranch
      && url === normalizedExpectedUrl;
  });

  if (candidates.length !== 1) {
    return {
      valid: false,
      classification: candidates.length === 0 ? 'no-exact-match' : 'ambiguous-exact-match',
      errors: [candidates.length === 0 ? 'deployment-metadata-not-bound' : 'multiple-deployment-metadata-matches'],
      match: null
    };
  }

  const deployment = candidates[0];
  const stage = deployment?.latest_stage;
  const success = stage?.name === 'deploy' && stage?.status === 'success';
  if (!success) {
    return {
      valid: false,
      classification: 'deployment-not-successful',
      errors: ['latest-deploy-stage-not-success'],
      match: {
        id: deployment.id || null,
        project_name: deployment.project_name,
        environment: deployment.environment || null,
        url: normalizeUrl(deployment.url),
        commit_hash: deployment.deployment_trigger?.metadata?.commit_hash || null,
        branch: normalizeBranch(deployment.deployment_trigger?.metadata?.branch),
        stage: stage ? { name: stage.name || null, status: stage.status || null } : null
      }
    };
  }

  return {
    valid: true,
    classification: 'exact-deployment-metadata-match',
    errors: [],
    match: {
      id: deployment.id || null,
      project_name: deployment.project_name,
      environment: deployment.environment || null,
      url: normalizeUrl(deployment.url),
      commit_hash: deployment.deployment_trigger.metadata.commit_hash,
      branch: normalizeBranch(deployment.deployment_trigger?.metadata?.branch),
      stage: { name: stage.name, status: stage.status },
      created_on: deployment.created_on || null
    }
  };
}

async function main() {
  const outputPath = process.argv[2] || 'cloudflare-deployment-metadata.json';
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const expectedCommit = process.env.GITHUB_SHA;
  const expectedUrl = process.env.DEPLOYMENT_URL;
  const expectedBranch = process.env.CLOUDFLARE_PAGES_BRANCH;
  const project = process.env.CLOUDFLARE_PAGES_PROJECT || PROJECT;

  if (!accountId || !token) {
    fs.writeFileSync(outputPath, `${JSON.stringify({ valid: false, classification: 'credentials-unavailable', errors: ['cloudflare-credentials-unavailable'], match: null }, null, 2)}\n`);
    process.exitCode = 2;
    return;
  }

  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/pages/projects/${encodeURIComponent(project)}/deployments`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success !== true || !Array.isArray(payload?.result)) {
    const result = { valid: false, classification: 'cloudflare-api-error', errors: [`cloudflare-api-status-${response.status}`], match: null };
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
    process.exitCode = 3;
    return;
  }

  const result = evaluateDeploymentMetadata({ deployments: payload.result, expectedCommit, expectedUrl, expectedBranch, project });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ valid: result.valid, classification: result.classification })}\n`);
  if (!result.valid) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
