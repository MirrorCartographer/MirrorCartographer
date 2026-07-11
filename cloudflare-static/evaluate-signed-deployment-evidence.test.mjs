import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  CLOUDFLARE_RESEARCH_IDENTITY_POLICY,
  evaluateSignedDeploymentEvidence
} from './evaluate-signed-deployment-evidence.mjs';

const statement_json = JSON.stringify({ _type: 'https://in-toto.io/Statement/v1', subject: [] });
const digest = createHash('sha256').update(statement_json, 'utf8').digest('hex');

function input(overrides = {}) {
  const verifier_result = {
    payloadSha256: digest,
    cryptographicSignatureVerified: true,
    transparencyVerified: true,
    certificateTimeVerified: true,
    certificateIssuer: CLOUDFLARE_RESEARCH_IDENTITY_POLICY.issuer,
    certificateSubject: CLOUDFLARE_RESEARCH_IDENTITY_POLICY.subject,
    verifier: {
      name: 'cosign',
      version: 'pinned-test-version',
      invocation: 'cosign verify-blob --bundle bundle.json statement.json'
    },
    ...(overrides.verifier_result || {})
  };

  return {
    statement_json,
    bundle: {
      mediaType: 'application/vnd.dev.sigstore.bundle.v0.3+json',
      dsseEnvelope: {
        payloadType: 'application/vnd.in-toto+json',
        payload: Buffer.from(statement_json).toString('base64'),
        signatures: [{ sig: 'test-signature' }]
      }
    },
    verifier_result,
    ...overrides,
    verifier_result
  };
}

test('accepts exact workflow identity with complete external verification', () => {
  const result = evaluateSignedDeploymentEvidence(input());
  assert.equal(result.accepted, true);
  assert.equal(result.decision, 'accept-signed-deployment-evidence');
  assert.equal(result.checks.subjectMatch, true);
});

test('rejects lookalike workflow identity', () => {
  const result = evaluateSignedDeploymentEvidence(input({ verifier_result: {
    certificateSubject: `${CLOUDFLARE_RESEARCH_IDENTITY_POLICY.subject}-lookalike`
  }}));
  assert.equal(result.accepted, false);
  assert.equal(result.checks.subjectMatch, false);
});

test('rejects missing transparency verification', () => {
  const result = evaluateSignedDeploymentEvidence(input({ verifier_result: {
    transparencyVerified: false
  }}));
  assert.equal(result.accepted, false);
  assert.equal(result.checks.transparencyVerified, false);
});

test('rejects payload digest disagreement', () => {
  const result = evaluateSignedDeploymentEvidence(input({ verifier_result: {
    payloadSha256: '0'.repeat(64)
  }}));
  assert.equal(result.accepted, false);
  assert.equal(result.checks.payloadDigestMatch, false);
});
