#!/usr/bin/env node
import fs from 'node:fs';

function normalizeOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function validateServedIdentityEvidence(proof) {
  const errors = [];
  if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
    return { schema_version: '1.0.0', valid: false, errors: ['proof must be an object'] };
  }

  const deploymentOrigin = normalizeOrigin(proof.deployment_url);
  if (!deploymentOrigin) errors.push('deployment_url must be a valid https origin');
  if (!/^[0-9a-f]{40}$/i.test(proof.source_commit || '')) {
    errors.push('source_commit must be a 40-character git SHA');
  }

  const records = Array.isArray(proof.verifier_output) ? proof.verifier_output : [];
  const accepted = records.filter((record) => record?.ok === true);
  if (accepted.length !== 1) {
    errors.push('verifier_output must contain exactly one accepted served-identity record');
  }

  if (accepted.length === 1) {
    const record = accepted[0];
    const candidateOrigin = normalizeOrigin(record.candidate);
    const resolvedOrigin = normalizeOrigin(record.resolvedUrl);
    if (candidateOrigin !== deploymentOrigin) {
      errors.push('accepted verifier candidate must match deployment_url origin');
    }
    if (resolvedOrigin !== deploymentOrigin) {
      errors.push('accepted verifier resolvedUrl must preserve deployment_url origin');
    }
    if (record.status !== 200) errors.push('accepted verifier record must report HTTP 200');
    if (!Array.isArray(record.reasons) || record.reasons.length !== 0) {
      errors.push('accepted verifier record must have no rejection reasons');
    }
    if (record.deploymentManifest?.ok !== true) {
      errors.push('accepted verifier record must include a valid served deployment manifest');
    }
    if (record.deploymentManifest?.manifest?.source_commit !== proof.source_commit) {
      errors.push('served deployment manifest source_commit must match proof source_commit');
    }
  }

  return {
    schema_version: '1.0.0',
    valid: errors.length === 0,
    errors,
    checked_records: records.length,
    accepted_records: accepted.length
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] || 'cloudflare-deployment-proof.json';
  const outputPath = process.argv[3] || 'cloudflare-served-identity-evidence.json';
  const result = validateServedIdentityEvidence(JSON.parse(fs.readFileSync(inputPath, 'utf8')));
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.valid) process.exit(1);
}
