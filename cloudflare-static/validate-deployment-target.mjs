#!/usr/bin/env node
import fs from 'node:fs';

export function validateDeploymentTarget({ wranglerText, workflowText, expectedProject = 'mirror-cartographer-research' }) {
  const errors = [];
  const nameMatch = wranglerText.match(/"name"\s*:\s*"([^"]+)"/);
  const outputMatch = wranglerText.match(/"pages_build_output_dir"\s*:\s*"([^"]+)"/);
  const wranglerProject = nameMatch?.[1] ?? null;
  const outputDir = outputMatch?.[1] ?? null;

  const commandProjects = [...workflowText.matchAll(/--project-name=([^\s"']+)/g)].map((m) => m[1]);
  const envProjects = [...workflowText.matchAll(/CLOUDFLARE_PAGES_PROJECT:\s*([^\s#]+)/g)].map((m) => m[1]);

  if (!wranglerProject) errors.push('wrangler-project-missing');
  if (wranglerProject && wranglerProject !== expectedProject) errors.push('wrangler-project-mismatch');
  if (outputDir !== '.') errors.push('pages-output-dir-must-be-dot');
  if (commandProjects.length === 0) errors.push('workflow-project-argument-missing');
  if (commandProjects.some((value) => value !== expectedProject)) errors.push('workflow-project-argument-mismatch');
  if (envProjects.length === 0) errors.push('workflow-project-env-missing');
  if (envProjects.some((value) => value !== expectedProject)) errors.push('workflow-project-env-mismatch');

  return {
    schemaVersion: '1.0.0',
    status: errors.length === 0 ? 'valid' : 'invalid',
    expectedProject,
    observed: {
      wranglerProject,
      pagesBuildOutputDir: outputDir,
      workflowProjectArguments: commandProjects,
      workflowProjectEnvironmentValues: envProjects
    },
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const wranglerPath = process.argv[2] ?? new URL('./wrangler.jsonc', import.meta.url);
  const workflowPath = process.argv[3] ?? new URL('../.github/workflows/cloudflare-pages-research.yml', import.meta.url);
  const result = validateDeploymentTarget({
    wranglerText: fs.readFileSync(wranglerPath, 'utf8'),
    workflowText: fs.readFileSync(workflowPath, 'utf8')
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== 'valid') process.exitCode = 1;
}
