#!/usr/bin/env node
import fs from 'node:fs';

const SHA40 = /^[0-9a-f]{40}$/i;

export function validateActionPinPlan(audit, plan) {
  const required = Array.isArray(audit?.required_resolution) ? audit.required_resolution : [];
  const entries = Array.isArray(plan?.entries) ? plan.entries : [];
  const byRef = new Map(entries.map((entry) => [entry.ref, entry]));
  const findings = [];

  for (const item of required) {
    const entry = byRef.get(item.ref);
    if (!entry) {
      findings.push({ ref: item.ref, status: 'missing_resolution' });
      continue;
    }
    const problems = [];
    if (entry.action !== item.action) problems.push('action_mismatch');
    if (!SHA40.test(String(entry.resolved_sha || ''))) problems.push('resolved_sha_not_40_hex');
    if (!String(entry.upstream_tag || '').trim()) problems.push('upstream_tag_missing');
    if (!String(entry.source_url || '').startsWith('https://github.com/')) problems.push('source_url_not_github');
    if (!String(entry.reviewed_by || '').trim()) problems.push('reviewer_missing');
    if (!/^\d{4}-\d{2}-\d{2}T/.test(String(entry.reviewed_at || ''))) problems.push('reviewed_at_invalid');
    if (!String(entry.review_scope || '').trim()) problems.push('review_scope_missing');
    findings.push({ ref: item.ref, status: problems.length ? 'invalid_resolution' : 'reviewed_resolution', problems });
  }

  const unexpected = entries.filter((entry) => !required.some((item) => item.ref === entry.ref));
  for (const entry of unexpected) findings.push({ ref: entry.ref, status: 'unexpected_resolution' });

  const valid = findings.length === required.length && findings.every((finding) => finding.status === 'reviewed_resolution');
  return {
    schema_version: '1.0.0',
    status: valid ? 'approved_pin_plan' : 'pin_plan_rejected',
    required_count: required.length,
    reviewed_count: findings.filter((finding) => finding.status === 'reviewed_resolution').length,
    findings,
    evidence_strength: 'reviewed_resolution_manifest',
    limits: [
      'This validates completeness and review metadata; it does not independently resolve tags or inspect upstream code.',
      'A reviewed immutable SHA reduces tag-drift risk but does not prove the action is safe.',
      'Workflow files must still be updated and re-audited after applying the plan.'
    ]
  };
}

function main() {
  const [auditPath, planPath, outputPath = 'cloudflare-action-pin-plan-validation.json'] = process.argv.slice(2);
  if (!auditPath || !planPath) throw new Error('usage: validate-action-pin-plan.mjs <audit.json> <plan.json> [output.json]');
  const result = validateActionPinPlan(JSON.parse(fs.readFileSync(auditPath, 'utf8')), JSON.parse(fs.readFileSync(planPath, 'utf8')));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ status: result.status, reviewed: result.reviewed_count, required: result.required_count })}\n`);
  if (result.status !== 'approved_pin_plan') process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
