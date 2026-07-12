import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const CONDITIONAL_EVIDENCE = Object.freeze({
  'cloudflare-pages-hostname-authority.json': 'hostname-authority-not-produced',
  'cloudflare-deployment-metadata.json': 'deployment-metadata-not-produced'
});

export function materializeMissingDeploymentEvidence({
  directory='.',
  sourceCommit=process.env.GITHUB_SHA ?? null,
  runId=process.env.GITHUB_RUN_ID ?? null,
  generatedAt=process.env.RUN_STARTED_AT ?? new Date().toISOString(),
  files=CONDITIONAL_EVIDENCE
} = {}) {
  const written = [];
  const preserved = [];

  for (const [name, reason] of Object.entries(files)) {
    const path = `${directory}/${name}`;
    if (fs.existsSync(path)) {
      preserved.push(name);
      continue;
    }
    const record = {
      schema_version: '1.0.0',
      artifact_type: 'cloudflare-conditional-evidence-unavailable',
      evidence_file: name,
      status: 'unavailable',
      reason,
      source_commit: sourceCommit,
      workflow_run_id: runId,
      generated_at: generatedAt,
      acceptance_effect: 'must-not-support-deployment-acceptance'
    };
    fs.writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
    written.push(name);
  }

  return { written, preserved };
}

function main() {
  const [directory='.'] = process.argv.slice(2);
  const result = materializeMissingDeploymentEvidence({ directory });
  process.stdout.write(`${JSON.stringify({ ok: true, ...result })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
