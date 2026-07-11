import fs from 'node:fs';
import { evaluateSigstoreBundleVerification } from '../tools/frontier-research/sigstore-bundle-verification.mjs';

export const CLOUDFLARE_RESEARCH_IDENTITY_POLICY = Object.freeze({
  issuer: 'https://token.actions.githubusercontent.com',
  subject: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main'
});

function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
  return value;
}

export function evaluateSignedDeploymentEvidence(input) {
  requireObject(input, 'input');
  const statementJson = typeof input.statement_json === 'string'
    ? input.statement_json
    : JSON.stringify(requireObject(input.statement, 'input.statement'));

  const verification = evaluateSigstoreBundleVerification({
    statementJson,
    bundle: requireObject(input.bundle, 'input.bundle'),
    verifierResult: requireObject(input.verifier_result, 'input.verifier_result'),
    identityPolicy: CLOUDFLARE_RESEARCH_IDENTITY_POLICY
  });

  return Object.freeze({
    schema_version: '1.0.0',
    accepted: verification.accepted,
    decision: verification.accepted ? 'accept-signed-deployment-evidence' : 'reject-signed-deployment-evidence',
    statement_sha256: verification.statementSha256,
    checks: verification.checks,
    identity: verification.identity,
    verifier: verification.verifier,
    trust_limit: `${verification.trustLimit} Acceptance authenticates the signed statement and workflow identity only; it does not prove the deployed scientific claims are correct.`,
    falsification_route: verification.falsificationRoute
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2] || 'cloudflare-signed-evidence-input.json';
  const outputPath = process.argv[3] || 'cloudflare-signed-evidence-decision.json';
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = evaluateSignedDeploymentEvidence(input);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify(result) + '\n');
}
