#!/usr/bin/env node
import fs from 'node:fs';
import { buildVerificationPlan } from '../tools/frontier-research/browser-verification-transcript.mjs';

export function buildCloudflareBrowserVerificationPlan({ deploymentUrl, expectedCommit }) {
  if (typeof deploymentUrl !== 'string' || !deploymentUrl.startsWith('https://')) {
    throw new TypeError('deploymentUrl must be an https URL');
  }
  if (typeof expectedCommit !== 'string' || !/^[0-9a-f]{40}$/i.test(expectedCommit)) {
    throw new TypeError('expectedCommit must be a 40-character git SHA');
  }

  return {
    schema_version: '1.0.0',
    provider: 'cloudflare-pages',
    deployment_url: deploymentUrl,
    source_commit: expectedCommit.toLowerCase(),
    runtime_expression: `(() => ({ commit: document.documentElement.dataset.sourceCommit || document.querySelector('meta[name="mc-source-commit"]')?.content || null }))()`,
    webdriver_bidi: buildVerificationPlan({
      url: deploymentUrl,
      expectedCommit: expectedCommit.toLowerCase(),
      runtimeExpression: `(() => ({ commit: document.documentElement.dataset.sourceCommit || document.querySelector('meta[name="mc-source-commit"]')?.content || null }))()`
    }),
    acceptance_boundary: {
      required: ['same browsing context', 'successful document response', 'page load', 'runtime commit match', 'screenshot bytes'],
      excludes: ['scientific truth', 'diagnosis', 'treatment efficacy', 'physical audio output', 'human perception', 'cryptographic provenance']
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [deploymentUrl, expectedCommit, outputPath = 'cloudflare-browser-verification-plan.json'] = process.argv.slice(2);
  if (!deploymentUrl || !expectedCommit) {
    console.error('Usage: node build-browser-verification-plan.mjs <deployment-url> <40-char-commit> [output-path]');
    process.exit(2);
  }
  const plan = buildCloudflareBrowserVerificationPlan({ deploymentUrl, expectedCommit });
  fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ ok: true, outputPath, provider: plan.provider, sourceCommit: plan.source_commit })}\n`);
}
