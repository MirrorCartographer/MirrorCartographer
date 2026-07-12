#!/usr/bin/env node
import fs from 'node:fs';

export function buildCloudflareDispatchDecision(verdict, options = {}) {
  const errors = [];
  const repository = options.repository || verdict.repository || null;
  const commit_sha = options.commit_sha || verdict.commit_sha || null;
  const branch = options.branch || 'main';

  if (verdict.ok !== true) errors.push('preflight-verdict-not-ok');
  if (verdict.classification !== 'repository_declarations_verified') errors.push('preflight-classification-not-verified');
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '')) errors.push('invalid-repository');
  if (!/^[a-f0-9]{40}$/.test(commit_sha || '')) errors.push('invalid-commit-sha');
  if (verdict.repository !== repository) errors.push('repository-binding-mismatch');
  if (verdict.commit_sha !== commit_sha) errors.push('commit-binding-mismatch');
  if (!/^[A-Za-z0-9._/-]{1,128}$/.test(branch) || branch.includes('..') || branch.startsWith('/') || branch.endsWith('/')) errors.push('invalid-branch');
  if (!verdict.run_id) errors.push('missing-preflight-run-id');

  const allowed = errors.length === 0;
  return {
    schema_version: '1.0.0',
    allowed,
    classification: allowed ? 'dispatch_ready' : 'dispatch_denied',
    errors,
    target: {
      repository,
      commit_sha,
      workflow: '.github/workflows/cloudflare-pages-research.yml',
      ref: commit_sha,
      inputs: { branch }
    },
    preflight: {
      run_id: verdict.run_id || null,
      classification: verdict.classification || null
    },
    claim_boundary: 'Authorizes an exact-repository, exact-commit workflow dispatch request only. It does not prove credentials, Cloudflare authorization, workflow execution, deployment, hostname resolution, served identity, or scientific truth.'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [verdictPath, repository, commit_sha, branch = 'main', outputPath] = process.argv.slice(2);
  if (!verdictPath || !repository || !commit_sha) {
    console.error('usage: build-cloudflare-dispatch-decision.mjs <verdict.json> <repository> <commit-sha> [branch] [output.json]');
    process.exit(2);
  }
  try {
    const verdict = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    const result = buildCloudflareDispatchDecision(verdict, { repository, commit_sha, branch });
    const body = `${JSON.stringify(result, null, 2)}\n`;
    if (outputPath) fs.writeFileSync(outputPath, body); else process.stdout.write(body);
    if (!result.allowed) process.exit(1);
  } catch (error) {
    const result = { allowed: false, classification: 'dispatch_denied', errors: [`exception:${error.message}`] };
    const body = `${JSON.stringify(result, null, 2)}\n`;
    if (outputPath) fs.writeFileSync(outputPath, body); else process.stdout.write(body);
    process.exit(1);
  }
}
