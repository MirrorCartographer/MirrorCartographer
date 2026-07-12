import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGhAttestationVerifyArgs, assessGhAttestationVerifyArgs } from './gh-attestation-command-policy.mjs';

const input = {
  artifactPath: 'evidence.json',
  repository: 'MirrorCartographer/MirrorCartographer',
  signerWorkflow: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml',
  sourceDigest: 'a'.repeat(40),
};

test('builds exact deny-by-default verifier arguments', () => {
  const args = buildGhAttestationVerifyArgs(input);
  assert.deepEqual(assessGhAttestationVerifyArgs(args), {
    accepted: true,
    missing: [],
    exactSource: true,
    denySelfHosted: true,
    trustLimit: 'Command policy constrains verifier inputs; it does not establish that workflow-controlled predicate claims or downstream deployment/scientific claims are true.',
  });
});

test('rejects owner-only or under-scoped policy', () => {
  const result = assessGhAttestationVerifyArgs(['attestation','verify','evidence.json','--owner','MirrorCartographer','--format','json']);
  assert.equal(result.accepted, false);
  assert.ok(result.missing.includes('--repo'));
  assert.ok(result.missing.includes('--signer-workflow'));
});

test('rejects mutable or malformed source identity', () => {
  assert.throws(() => buildGhAttestationVerifyArgs({ ...input, sourceDigest: 'main' }), /40-character git commit SHA/);
});

test('rejects signer workflow outside the repository workflow path', () => {
  assert.throws(() => buildGhAttestationVerifyArgs({ ...input, signerWorkflow: 'other/repo/.github/workflows/build.yml' }), /exact workflow path/);
});
