#!/usr/bin/env node
import fs from 'node:fs';

export function inspectCloudflareSecurityGateWorkflow(text) {
  const source = typeof text === 'string' ? text : '';
  const checks = {
    watches_deployment_workflow: source.includes('.github/workflows/cloudflare-pages-research.yml'),
    runs_audit_tests: source.includes('node --test cloudflare-static/audit-cloudflare-workflow-security.test.mjs'),
    runs_gate_contract_tests: source.includes('node --test cloudflare-static/cloudflare-security-gate-workflow-contract.test.mjs'),
    audits_committed_workflow: /node cloudflare-static\/audit-cloudflare-workflow-security\.mjs\s+\.github\/workflows\/cloudflare-pages-research\.yml\s+cloudflare-workflow-security-audit\.json/m.test(source),
    uploads_audit_artifact: source.includes('cloudflare-workflow-security-audit.json') && source.includes('actions/upload-artifact@v4'),
    read_only_repository_permission: /^permissions:\s*\n\s{2}contents:\s*read\s*$/m.test(source),
    no_cloudflare_credentials: !/(CLOUDFLARE_ACCOUNT_ID|CLOUDFLARE_API_TOKEN|secrets\.)/.test(source),
    no_deployment_command: !/(wrangler-action|pages deploy|wrangler pages deploy)/i.test(source),
    no_vercel_or_payment_logic: !/(vercel|stripe|payment|billing|checkout-session|checkout_url)/i.test(source)
  };
  return {
    schema_version: '1.0.0',
    status: Object.values(checks).every(Boolean) ? 'gate_contract_satisfied' : 'gate_contract_failed',
    checks,
    limit: 'Static contract inspection proves workflow intent only; it does not prove GitHub executed the gate or that a Cloudflare deployment succeeded.'
  };
}

function main() {
  const input = process.argv[2] || '.github/workflows/cloudflare-deployment-security-gate.yml';
  const result = inspectCloudflareSecurityGateWorkflow(fs.readFileSync(input, 'utf8'));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.status === 'gate_contract_satisfied' ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
