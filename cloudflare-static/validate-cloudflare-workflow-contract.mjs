import fs from 'node:fs';

export function validateCloudflareWorkflowContract(source) {
  const failures = [];
  const requirePattern = (pattern, code) => {
    if (!pattern.test(source)) failures.push(code);
  };

  requirePattern(/environment:\s*cloudflare-research\b/, 'missing-cloudflare-research-environment');
  requirePattern(/CLOUDFLARE_ACCOUNT_ID:\s*\$\{\{\s*secrets\.CLOUDFLARE_ACCOUNT_ID\s*\}\}/, 'missing-account-id-secret-reference');
  requirePattern(/CLOUDFLARE_API_TOKEN:\s*\$\{\{\s*secrets\.CLOUDFLARE_API_TOKEN\s*\}\}/, 'missing-api-token-secret-reference');
  requirePattern(/accountId:\s*\$\{\{\s*secrets\.CLOUDFLARE_ACCOUNT_ID\s*\}\}/, 'wrangler-account-id-not-secret-bound');
  requirePattern(/apiToken:\s*\$\{\{\s*secrets\.CLOUDFLARE_API_TOKEN\s*\}\}/, 'wrangler-api-token-not-secret-bound');
  requirePattern(/--project-name=mirror-cartographer-research\b/, 'wrong-or-missing-pages-project');
  requirePattern(/--commit-hash=\$\{\{\s*github\.sha\s*\}\}/, 'missing-exact-commit-binding');
  requirePattern(/if:\s*steps\.access_probe\.outcome\s*==\s*'success'/, 'deployment-not-gated-by-access-probe');

  const unsafeShellDisclosure = /(?:echo|printf)[^\n]*(?:CLOUDFLARE_API_TOKEN|CLOUDFLARE_ACCOUNT_ID)/;
  if (unsafeShellDisclosure.test(source)) failures.push('possible-secret-disclosure-in-shell');

  return {
    schema_version: '1.0.0',
    valid: failures.length === 0,
    failures,
    contract: {
      environment: 'cloudflare-research',
      project: 'mirror-cartographer-research',
      required_secrets: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
      commit_binding: 'github.sha',
      deployment_gate: 'access_probe.success',
      secret_values_permitted_in_output: false
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] ?? '.github/workflows/cloudflare-pages-research.yml';
  const outputPath = process.argv[3];
  const result = validateCloudflareWorkflowContract(fs.readFileSync(inputPath, 'utf8'));
  const encoded = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) fs.writeFileSync(outputPath, encoded);
  else process.stdout.write(encoded);
  if (!result.valid) process.exitCode = 1;
}
