#!/usr/bin/env node
import fs from 'node:fs';
import { collectHostnameObservation } from './collect-hostname-observation.mjs';
import { classifyHostnameResolution } from './classify-hostname-resolution.mjs';

function normalizeCommit(value) {
  const commit = String(value || '').trim().toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('expected-commit-invalid');
  return commit;
}

function normalizeRepository(value) {
  const repository = String(value || '').trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('repository-invalid');
  return repository;
}

export async function buildHostnameEvidencePacket(options, deps = {}) {
  const expectedCommit = normalizeCommit(options?.expectedCommit);
  const repository = normalizeRepository(options?.repository);
  const collector = deps.collector || collectHostnameObservation;
  const classifier = deps.classifier || classifyHostnameResolution;

  const observation = await collector({
    hostname: options?.hostname,
    expectedCommit,
    repository,
    surface: options?.surface || 'mirror-cartographer-research',
    observedAt: options?.observedAt,
    timeoutMs: options?.timeoutMs
  }, deps.collectorDeps || {});
  const classification = classifier(observation);

  const bindingErrors = [];
  if (classification.hostname !== observation.hostname) bindingErrors.push('hostname-classification-mismatch');
  if (observation.http?.deployed_commit_verified === true) {
    const manifestCommit = observation.http?.deployment_manifest?.actual?.source_commit
      || observation.http?.deployment_manifest?.source_commit
      || null;
    if (manifestCommit && String(manifestCommit).toLowerCase() !== expectedCommit) {
      bindingErrors.push('served-manifest-commit-mismatch');
    }
  }

  const accepted = classification.accepted === true && bindingErrors.length === 0;
  return {
    schema_version: '1.0.0',
    packet_type: 'cloudflare-hostname-deployment-evidence',
    expected: {
      repository,
      source_commit: expectedCommit,
      surface: options?.surface || 'mirror-cartographer-research'
    },
    observation,
    classification,
    binding_errors: bindingErrors,
    accepted,
    acceptance_rule: 'Accepted only when retained DNS, HTTP reachability, served research identity, and exact deployed commit all pass without contradictions or binding errors.',
    epistemic_limit: 'This packet proves only the observed deployment identity and commit at the retained time; it does not prove scientific, medical, diagnostic, or treatment claims.'
  };
}

async function main() {
  const [hostname, outputPath, expectedCommit = process.env.GITHUB_SHA] = process.argv.slice(2);
  if (!hostname || !outputPath) throw new Error('usage: node build-hostname-evidence-packet.mjs <hostname> <output.json> [expected-commit]');
  const result = await buildHostnameEvidencePacket({
    hostname,
    expectedCommit,
    repository: process.env.GITHUB_REPOSITORY || 'MirrorCartographer/MirrorCartographer',
    surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
  });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ hostname: result.observation.hostname, claim: result.classification.claim, accepted: result.accepted })}\n`);
  process.exitCode = result.accepted ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) main();
