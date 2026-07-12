#!/usr/bin/env node
import fs from 'node:fs';

export function auditCloudflareWorkflowSecurity(workflowText) {
  const text = typeof workflowText === 'string' ? workflowText : '';
  const permissionsBlock = text.match(/^permissions:\s*\n((?:^[ \t]+[^\n]+\n?)*)/m)?.[1] || '';
  const observedPermissions = Object.fromEntries(
    [...permissionsBlock.matchAll(/^\s{2}([a-z-]+):\s*([^\s#]+)\s*$/gm)].map((m) => [m[1], m[2]])
  );
  const runLines = text.split('\n').filter((line) => /^\s*-?\s*run:/.test(line));
  const secretRefsInRun = runLines.some((line) => /\$\{\{\s*secrets\./.test(line))
    || [...text.matchAll(/run:\s*[>|-]?\s*\n((?:^\s{10,}.*\n?)*)/gm)].some((m) => /\$\{\{\s*secrets\./.test(m[1] || ''));
  const hasWorkflowDispatch = /^\s{2}workflow_dispatch:\s*$/m.test(text);
  const hasAutomaticTrigger = /^\s{2}(push|pull_request|pull_request_target|schedule):/m.test(text);
  const checks = {
    manual_dispatch_only: hasWorkflowDispatch && !hasAutomaticTrigger,
    least_privilege_permissions: observedPermissions.contents === 'read'
      && observedPermissions.deployments === 'write'
      && observedPermissions['id-token'] === 'write'
      && observedPermissions.attestations === 'write'
      && Object.keys(observedPermissions).length === 4,
    serialized_production_deployments: /group:\s*cloudflare-research-production/.test(text)
      && /cancel-in-progress:\s*false/.test(text),
    protected_environment_present: /^\s{4}environment:\s*cloudflare-research\s*$/m.test(text),
    no_secret_interpolation_in_run_blocks: !secretRefsInRun,
    no_vercel_or_payment_coupling: !/vercel/i.test(text)
      && !/(stripe|payment|billing|checkout-session|checkout_url)/i.test(text)
  };
  const actionRefs = [...text.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)\s*$/gm)].map((m) => m[1]);
  const floatingActionRefs = actionRefs.filter((ref) => !/@[0-9a-f]{40}$/i.test(ref));
  return {
    schema_version: '1.0.0',
    status: Object.values(checks).every(Boolean) ? 'security_contract_satisfied' : 'security_contract_failed',
    checks,
    observed_permissions: observedPermissions,
    action_refs: actionRefs,
    warnings: floatingActionRefs.length ? [{
      code: 'floating_action_refs',
      severity: 'advisory',
      refs: floatingActionRefs,
      implication: 'Major-version action tags are mutable references; pinning exact commit SHAs would strengthen supply-chain reproducibility.'
    }] : [],
    privacy: {
      secret_values_read: false,
      secret_values_emitted: false,
      scope: 'Static workflow source only.'
    },
    limit: 'Static source auditing cannot prove GitHub environment protection rules, secret existence, credential validity, action integrity, or deployment success.'
  };
}

function main() {
  const workflowPath = process.argv[2] || '.github/workflows/cloudflare-pages-research.yml';
  const outputPath = process.argv[3] || 'cloudflare-workflow-security-audit.json';
  const result = auditCloudflareWorkflowSecurity(fs.readFileSync(workflowPath, 'utf8'));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: result.status, warnings: result.warnings.length, output: outputPath })}\n`);
  process.exitCode = result.status === 'security_contract_satisfied' ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
