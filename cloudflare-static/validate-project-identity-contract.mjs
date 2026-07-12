#!/usr/bin/env node
import fs from 'node:fs';

function parseJsonc(text) {
  return JSON.parse(text.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}

export function validateProjectIdentityContract({ wranglerText, workflowText, expectedProject = 'mirror-cartographer-research' }) {
  const config = parseJsonc(wranglerText);
  const workflowProjectMatches = [...workflowText.matchAll(/(?:--project-name=|CLOUDFLARE_PAGES_PROJECT:\s*)([a-z0-9-]+)/g)].map((m) => m[1]);
  const uniqueWorkflowProjects = [...new Set(workflowProjectMatches)];
  const errors = [];

  if (config.name !== expectedProject) errors.push('wrangler_project_mismatch');
  if (uniqueWorkflowProjects.length === 0) errors.push('workflow_project_missing');
  if (uniqueWorkflowProjects.some((name) => name !== expectedProject)) errors.push('workflow_project_mismatch');
  if (uniqueWorkflowProjects.length > 1) errors.push('workflow_project_ambiguous');
  if (config.pages_build_output_dir !== '.') errors.push('unexpected_pages_output_dir');

  return {
    schema_version: '1.0.0',
    valid: errors.length === 0,
    expected_project: expectedProject,
    wrangler_project: config.name ?? null,
    workflow_projects: uniqueWorkflowProjects,
    pages_build_output_dir: config.pages_build_output_dir ?? null,
    expected_production_hostname: `${expectedProject}.pages.dev`,
    errors,
    trust_limit: 'This proves source-level project identity consistency only; it does not prove that the project exists, credentials are authorized, or a deployment resolves.'
  };
}

function main() {
  const wranglerPath = process.argv[2] || 'cloudflare-static/wrangler.jsonc';
  const workflowPath = process.argv[3] || '.github/workflows/cloudflare-pages-research.yml';
  const outputPath = process.argv[4] || 'cloudflare-project-identity-contract.json';
  const result = validateProjectIdentityContract({
    wranglerText: fs.readFileSync(wranglerPath, 'utf8'),
    workflowText: fs.readFileSync(workflowPath, 'utf8')
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ valid: result.valid, output: outputPath, project: result.expected_project })}\n`);
  if (!result.valid) process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
