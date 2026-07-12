import fs from 'node:fs';
import path from 'node:path';

const CONDITIONAL = {
  'cloudflare-pages-hostname-authority.json': 'hostname-authority-unavailable',
  'cloudflare-deployment-metadata.json': 'deployment-metadata-unavailable'
};

export function materializeMissingDeploymentEvidence(rootDir = '.', context = process.env) {
  const sourceCommit = String(context.GITHUB_SHA || '').trim();
  const runId = String(context.GITHUB_RUN_ID || '').trim();
  const runAttempt = String(context.GITHUB_RUN_ATTEMPT || '').trim();
  if (!/^[0-9a-f]{40}$/i.test(sourceCommit)) throw new Error('valid GITHUB_SHA required');
  if (!/^\d+$/.test(runId)) throw new Error('numeric GITHUB_RUN_ID required');
  if (!/^\d+$/.test(runAttempt)) throw new Error('numeric GITHUB_RUN_ATTEMPT required');
  const written = [];
  for (const [filename, reasonCode] of Object.entries(CONDITIONAL)) {
    const target = path.join(rootDir, filename);
    if (fs.existsSync(target)) continue;
    const record = {
      schema_version: '1.0.0', evidence_type: 'conditional-deployment-evidence', status: 'unavailable',
      reason_code: reasonCode, source_commit: sourceCommit,
      workflow_run: { id: runId, attempt: runAttempt }, acceptance_capability: 'none',
      trust_limit: 'This record proves only that conditional evidence was unavailable in this workflow run; it cannot prove deployment, hostname authority, or served identity.'
    };
    fs.writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
    written.push(filename);
  }
  return { written };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdout.write(`${JSON.stringify(materializeMissingDeploymentEvidence(process.argv[2] || '.'))}\n`);
}
