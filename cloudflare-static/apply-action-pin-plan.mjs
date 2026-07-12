#!/usr/bin/env node
import fs from 'node:fs';

const SHA40 = /^[0-9a-f]{40}$/i;

export function applyActionPinPlan(workflowText, plan) {
  if (typeof workflowText !== 'string') throw new TypeError('workflowText must be a string');
  const entries = Array.isArray(plan?.entries) ? plan.entries : [];
  if (plan?.status !== 'approved_pin_plan' || entries.length === 0) {
    throw new Error('approved non-empty pin plan required');
  }

  let output = workflowText;
  const findings = [];
  for (const entry of entries) {
    if (!entry?.ref || !entry?.action || !SHA40.test(String(entry.resolved_sha || ''))) {
      throw new Error(`invalid pin entry: ${entry?.ref || 'unknown'}`);
    }
    const replacement = `${entry.action}@${entry.resolved_sha} # ${entry.upstream_tag}`;
    const occurrences = output.split(entry.ref).length - 1;
    output = output.split(entry.ref).join(replacement);
    findings.push({ ref: entry.ref, occurrences, replacement });
  }

  const remainingMutable = [...output.matchAll(/^\s*uses:\s*([^\s#@]+)@([^\s#]+)/gim)]
    .filter((match) => !SHA40.test(match[2]))
    .map((match) => match[0].trim());

  return {
    schema_version: '1.0.0',
    status: remainingMutable.length === 0 ? 'workflow_pins_applied' : 'mutable_references_remain',
    workflow: output,
    findings,
    remaining_mutable: remainingMutable,
    limits: [
      'This performs exact textual replacement from a reviewed manifest; it does not resolve tags.',
      'A commit pin prevents tag movement but does not prove upstream code or transitive dependencies are safe.'
    ]
  };
}

function main() {
  const [workflowPath, planPath, outputPath] = process.argv.slice(2);
  if (!workflowPath || !planPath || !outputPath) {
    throw new Error('usage: apply-action-pin-plan.mjs <workflow.yml> <plan.json> <output.yml>');
  }
  const result = applyActionPinPlan(
    fs.readFileSync(workflowPath, 'utf8'),
    JSON.parse(fs.readFileSync(planPath, 'utf8'))
  );
  fs.writeFileSync(outputPath, result.workflow);
  process.stdout.write(`${JSON.stringify({ status: result.status, findings: result.findings, remaining_mutable: result.remaining_mutable })}\n`);
  if (result.status !== 'workflow_pins_applied') process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
