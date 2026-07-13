import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySignerIdentity } from './signer-identity-policy.mjs';

const policy = {
  enabled: true,
  allowedIdentities: ['https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main'],
  allowedOidcIssuers: ['https://token.actions.githubusercontent.com'],
  allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
  allowedWorkflowRefs: ['MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main']
};

const verified = {
  certificateVerified: true,
  certificateIdentity: policy.allowedIdentities[0],
  certificateOidcIssuer: policy.allowedOidcIssuers[0],
  certificateSourceRepository: policy.allowedSourceRepositories[0],
  certificateWorkflowRef: policy.allowedWorkflowRefs[0],
  policy
};

test('accepts an exact authorized verified principal', () => {
  const result = classifySignerIdentity(verified);
  assert.equal(result.accepted, true);
  assert.equal(result.match_semantics, 'exact_string_match_only');
});

test('rejects identity data from an unverified certificate', () => {
  const result = classifySignerIdentity({ ...verified, certificateVerified: false });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'certificate_not_cryptographically_verified');
});

test('rejects a lookalike workflow identity', () => {
  const result = classifySignerIdentity({
    ...verified,
    certificateIdentity: `${verified.certificateIdentity}-lookalike`
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'certificate_identity_not_allowed');
});

test('rejects an unauthorized OIDC issuer', () => {
  const result = classifySignerIdentity({
    ...verified,
    certificateOidcIssuer: 'https://token.actions.githubusercontent.com.attacker.example'
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'oidc_issuer_not_allowed');
});

test('rejects the right workflow name from an unauthorized repository', () => {
  const result = classifySignerIdentity({
    ...verified,
    certificateSourceRepository: 'MirrorCartographer-lookalike/MirrorCartographer'
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'source_repository_not_allowed');
});

test('rejects a mutable or unexpected workflow ref', () => {
  const result = classifySignerIdentity({
    ...verified,
    certificateWorkflowRef: 'MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/feature'
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, 'workflow_ref_not_allowed');
});
