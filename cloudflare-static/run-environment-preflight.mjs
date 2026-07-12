import fs from 'node:fs';
import { validateWorkflowEnvironmentContract } from './validate-workflow-environment-contract.mjs';
import { buildEnvironmentPreflightEvidence, canonicalJson } from './build-environment-preflight-evidence.mjs';

export function runEnvironmentPreflight({ workflowPath, requirementsPath, contractOutputPath, evidenceOutputPath, source = {} }) {
  const requirements = JSON.parse(fs.readFileSync(requirementsPath, 'utf8'));
  const workflowContract = validateWorkflowEnvironmentContract(workflowPath);
  fs.writeFileSync(contractOutputPath, canonicalJson(workflowContract));
  const evidence = buildEnvironmentPreflightEvidence({
    requirements,
    workflowContract,
    source: { ...source, requirements_path: requirementsPath }
  });
  fs.writeFileSync(evidenceOutputPath, canonicalJson(evidence));
  return { workflowContract, evidence };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const workflowPath = process.argv[2] ?? '.github/workflows/cloudflare-pages-research.yml';
  const requirementsPath = process.argv[3] ?? 'cloudflare-static/cloudflare-environment-requirements.json';
  const contractOutputPath = process.argv[4] ?? 'cloudflare-workflow-environment-contract.json';
  const evidenceOutputPath = process.argv[5] ?? 'cloudflare-environment-preflight.json';
  const result = runEnvironmentPreflight({
    workflowPath,
    requirementsPath,
    contractOutputPath,
    evidenceOutputPath,
    source: {
      repository: process.env.GITHUB_REPOSITORY ?? null,
      commit_sha: process.env.GITHUB_SHA ?? null
    }
  });
  process.stdout.write(`${JSON.stringify({
    ok: result.evidence.ready_for_dispatch,
    contractOutputPath,
    evidenceOutputPath,
    packet_sha256: result.evidence.packet_sha256
  })}\n`);
  if (!result.evidence.ready_for_dispatch) process.exitCode = 1;
}
