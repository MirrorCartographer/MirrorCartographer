import fs from 'node:fs';
import { evaluateSignerAuthorization } from '../tools/frontier-research/signer-authorization-policy.mjs';

export const CLOUDFLARE_DEPLOYMENT_CLAIM = 'cloudflare.deployment-proof';

export function buildCloudflareSignerAuthorization(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('input must be an object');
  }

  const result = evaluateSignerAuthorization({
    verification: input.verification,
    identity: {
      repository: input.repository,
      workflow: input.workflow,
      ref: input.ref
    },
    claimClass: CLOUDFLARE_DEPLOYMENT_CLAIM,
    policy: input.policy
  });

  return {
    schema_version: '1.0.0',
    status: result.authorized ? 'authorized' : 'rejected',
    authorized: result.authorized,
    reasons: [...result.reasons],
    evaluated_fingerprints: [...result.evaluatedFingerprints],
    authorized_fingerprints: [...result.authorizedFingerprints],
    identity: result.identity,
    claim_class: result.claimClass,
    policy_mode: result.policyMode,
    trust_limit: result.trustLimit
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] || 'cloudflare-signer-authorization-input.json';
  const outputPath = process.argv[3] || 'cloudflare-signer-authorization.json';
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = buildCloudflareSignerAuthorization(input);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
  if (!result.authorized) process.exitCode = 1;
}
