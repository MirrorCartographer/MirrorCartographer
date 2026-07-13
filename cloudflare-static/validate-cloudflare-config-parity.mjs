#!/usr/bin/env node
import fs from 'node:fs';

export function evaluateCloudflareConfigParity({ wranglerText, workflowText }) {
  const config = JSON.parse(wranglerText);
  const projectName = typeof config.name === 'string' ? config.name.trim() : '';
  const outputDir = typeof config.pages_build_output_dir === 'string' ? config.pages_build_output_dir.trim() : '';
  const checks = [
    { id: 'wrangler_project_name_present', pass: projectName.length > 0 },
    { id: 'wrangler_pages_output_dir_present', pass: outputDir.length > 0 },
    { id: 'workflow_project_name_matches_wrangler', pass: projectName.length > 0 && workflowText.includes(`--project-name=${projectName}`) && workflowText.includes(`CLOUDFLARE_PAGES_PROJECT: ${projectName}`) },
    { id: 'workflow_output_contract_matches_wrangler', pass: outputDir.length > 0 && workflowText.includes('workingDirectory: cloudflare-static') && workflowText.includes(`pages deploy ${outputDir}`) },
    { id: 'workflow_binds_exact_source_commit', pass: workflowText.includes('--commit-hash=${{ github.sha }}') },
    { id: 'workflow_uses_declared_branch_input', pass: workflowText.includes('--branch=${{ inputs.branch }}') }
  ];
  const failed = checks.filter((check) => !check.pass).map((check) => check.id);
  return {
    schema_version: '1.0.0',
    accepted: failed.length === 0,
    project_name: projectName || null,
    pages_build_output_dir: outputDir || null,
    checks,
    failed,
    claim_limit: 'Configuration parity reduces deployment-target drift; it does not prove credentials, provider deployment, hostname resolution, or served identity.'
  };
}

function main() {
  const [wranglerPath = 'cloudflare-static/wrangler.jsonc', workflowPath = '.github/workflows/cloudflare-pages-research.yml', outputPath] = process.argv.slice(2);
  const result = evaluateCloudflareConfigParity({
    wranglerText: fs.readFileSync(wranglerPath, 'utf8'),
    workflowText: fs.readFileSync(workflowPath, 'utf8')
  });
  const body = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) fs.writeFileSync(outputPath, body, { mode: 0o600 });
  process.stdout.write(body);
  process.exitCode = result.accepted ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
