#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const COMMIT_RE = /^[a-f0-9]{40}$/i;
const REPOSITORY_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function buildDeploymentManifest({ sourceCommit, repository, surface = 'mirror-cartographer-research' } = {}) {
  if (!COMMIT_RE.test(sourceCommit || '')) throw new Error('sourceCommit must be a 40-character git SHA');
  if (!REPOSITORY_RE.test(repository || '')) throw new Error('repository must use owner/name form');
  if (!/^[a-z0-9-]+$/.test(surface || '')) throw new Error('surface must be a lowercase stable identifier');

  return {
    schema_version: '1.0.0',
    surface,
    repository,
    source_commit: sourceCommit.toLowerCase(),
    claim: 'This manifest identifies the committed source requested for this deployment; served presence must still be verified over HTTPS.',
    privacy: {
      contains_secrets: false,
      contains_private_user_data: false
    }
  };
}

export function writeDeploymentManifest(outputRoot, input) {
  const manifest = buildDeploymentManifest(input);
  const directory = path.join(outputRoot, '.well-known');
  const outputPath = path.join(directory, 'mirror-cartographer-research.json');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o644 });
  return { outputPath, manifest };
}

function main() {
  const outputRoot = process.argv[2] || '.';
  const result = writeDeploymentManifest(outputRoot, {
    sourceCommit: process.env.GITHUB_SHA,
    repository: process.env.GITHUB_REPOSITORY,
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
  });
  process.stdout.write(`${JSON.stringify({ output: result.outputPath, source_commit: result.manifest.source_commit })}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
