import fs from 'node:fs';

const SHA_PATTERN = /^[0-9a-f]{40}$/i;

export function validateDeploymentProofContext(proof, context = {}) {
  const errors = [];
  const nowMs = context.nowMs ?? Date.now();
  const maxAgeMs = context.maxAgeMs ?? 2 * 60 * 60 * 1000;
  const maxFutureSkewMs = context.maxFutureSkewMs ?? 5 * 60 * 1000;
  const expectedCommit = context.expectedCommit;
  const expectedWorkflowRun = context.expectedWorkflowRun;

  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    return { valid: false, errors: ['proof must be an object'] };
  }

  if (!SHA_PATTERN.test(proof.source_commit || '')) {
    errors.push('source_commit must be a 40-character git SHA');
  }

  if (expectedCommit && proof.source_commit !== expectedCommit) {
    errors.push('source_commit does not match the current workflow commit');
  }

  if (expectedWorkflowRun && proof.workflow_run !== expectedWorkflowRun) {
    errors.push('workflow_run does not match the current workflow invocation');
  }

  const generatedAtMs = Date.parse(proof.generated_at || '');
  if (Number.isNaN(generatedAtMs)) {
    errors.push('generated_at must be an ISO-compatible timestamp');
  } else {
    const ageMs = nowMs - generatedAtMs;
    if (ageMs > maxAgeMs) errors.push('deployment proof is older than the allowed freshness window');
    if (ageMs < -maxFutureSkewMs) errors.push('deployment proof timestamp is too far in the future');
  }

  return {
    valid: errors.length === 0,
    errors,
    context: {
      expectedCommit: expectedCommit || null,
      expectedWorkflowRun: expectedWorkflowRun || null,
      maxAgeMs,
      maxFutureSkewMs
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] || 'cloudflare-deployment-proof.json';
  const proof = JSON.parse(fs.readFileSync(path, 'utf8'));
  const expectedWorkflowRun = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined;
  const result = validateDeploymentProofContext(proof, {
    expectedCommit: process.env.GITHUB_SHA || undefined,
    expectedWorkflowRun
  });
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.valid) process.exit(1);
}
