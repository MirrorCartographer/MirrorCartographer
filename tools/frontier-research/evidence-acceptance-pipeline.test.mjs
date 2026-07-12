import assert from 'node:assert/strict';
import { createEvidenceEnvelope } from './run-evidence-envelope.mjs';
import { createEvidenceAttestation } from './evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from './trusted-builder-policy.mjs';
import { evaluateEvidenceAcceptance } from './evidence-acceptance-pipeline.mjs';

const now = '2026-07-12T06:35:00Z';
const artifactName = 'evidence.json';
const artifactText = '{"ok":true}';
const envelope = createEvidenceEnvelope({
  traceparent: '00-0123456789abcdef0123456789abcdef-0123456789abcdef-01',
  team: 'frontier_research',
  queue_item: 'R-006',
  claim_state: 'proposed',
  evidence_state: 'test-verified',
  summary: 'pipeline test',
  sources: ['W3C PROV-O'],
  artifacts: [artifactName],
  falsification_routes: ['mutate bytes']
});
const claim = {
  claim_id: 'claim-1',
  claim_state: 'proposed',
  evidence_strength: 'moderate',
  source_status: 'primary',
  observed_at: '2026-07-12T06:00:00Z',
  revalidate_after: '2026-08-12T06:00:00Z',
  falsification: {
    test: 'rerun contract',
    failure_signal: 'any rejected stage',
    action: 'block downstream acceptance'
  },
  sources: ['W3C PROV-O']
};
const attestation = createEvidenceAttestation({
  artifactName,
  artifactText,
  sourceRepository: 'MirrorCartographer/MirrorCartographer',
  sourceCommit: 'a'.repeat(40),
  builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main',
  invocationId: 'run-1',
  startedOn: '2026-07-12T06:30:00Z',
  finishedOn: '2026-07-12T06:31:00Z'
});
const policy = createTrustedBuilderPolicy({
  allowedBuilderIds: [attestation.predicate.runDetails.builder.id],
  allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
  allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
});
const base = { artifactName, artifactText, envelope, claim, attestation, policy, now };

assert.equal(evaluateEvidenceAcceptance(base).accepted, true);
assert.match(evaluateEvidenceAcceptance({ ...base, artifactText: 'tampered' }).reasons.join(','), /digest-or-name-mismatch/);
assert.match(evaluateEvidenceAcceptance({ ...base, claim: { ...claim, revalidate_after: '2026-07-12T06:34:00Z' } }).reasons.join(','), /revalidation_required/);
assert.match(evaluateEvidenceAcceptance({
  ...base,
  policy: createTrustedBuilderPolicy({
    allowedBuilderIds: ['other'],
    allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
    allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
  })
}).reasons.join(','), /builder_trust:builder.id/);
assert.match(evaluateEvidenceAcceptance({ ...base, envelope: { ...envelope, claim_state: 'observed' } }).reasons.join(','), /claim_identity:state-mismatch/);

console.log('5 evidence acceptance pipeline tests passed');
