#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateHostnameAuthorityConsistency } from './validate-hostname-authority-consistency.mjs';

const INPUTS = Object.freeze({
  authority: 'cloudflare-pages-hostname-authority.json',
  gate: 'cloudflare-hostname-evidence-gate.json',
  metadata: 'cloudflare-deployment-metadata.json'
});

function readJson(directory, name) {
  return JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'));
}

export function materializeHostnameAuthorityConsistency({
  directory='.',
  output='cloudflare-hostname-authority-consistency.json',
  expectedCommit=process.env.GITHUB_SHA,
  expectedProject=process.env.CLOUDFLARE_PAGES_PROJECT || 'mirror-cartographer-research'
} = {}) {
  const outputPath = path.join(directory, output);
  if (fs.existsSync(outputPath)) throw new Error(`hostname-authority-consistency-output-exists:${output}`);
  const result = validateHostnameAuthorityConsistency({
    authority: readJson(directory, INPUTS.authority),
    gate: readJson(directory, INPUTS.gate),
    metadata: readJson(directory, INPUTS.metadata),
    expectedCommit,
    expectedProject
  });
  const evidence = {
    ...result,
    artifact_type: 'cloudflare-hostname-authority-consistency',
    source_inputs: INPUTS,
    deployment_claim_permitted: result.accepted === true,
    privacy: {
      secret_values_emitted: false,
      policy: 'Only public deployment identity fields, commit binding, and bounded consistency verdicts are retained.'
    }
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  return { output_path: outputPath, evidence };
}

function main() {
  const [directory='.', output='cloudflare-hostname-authority-consistency.json'] = process.argv.slice(2);
  const result = materializeHostnameAuthorityConsistency({ directory, output });
  process.stdout.write(`${JSON.stringify({ ok: true, accepted: result.evidence.accepted, output: result.output_path, errors: result.evidence.errors })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
