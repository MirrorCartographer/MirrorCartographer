import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAttestation } from './evidence-attestation.mjs';
import { createTrustedBuilderPolicy } from './trusted-builder-policy.mjs';
import { verifyPeerExecutionProof } from './peer-execution-proof.mjs';

const ids = {
  requested: '11111111-1111-4111-8111-111111111111',
  accepted: '22222222-2222-4222-8222-222222222222',
  executed: '33333333-3333-4333-8333-333333333333'
};

function event({ id, phase, source, cause, time, evidence, completed }) {
  return {
    specversion: '1.0', id, source,
    type: `org.mirrorcartographer.peer-trigger.${phase}`,
    subject: 'vercel_studio', time, datacontenttype: 'application/json',
    data: {
      phase, trigger_id: 'trigger-1', requesting_team: 'frontier_research', target_team: 'vercel_studio',
      queue_item: 'R-006', idempotency_key: 'frontier:R-006:vercel',
      ...(cause ? { causation_event_id: cause } : {}),
      ...(evidence ? { execution_evidence: evidence } : {}),
      ...(completed ? { completed_queue_item: completed } : {})
    }
  };
}

function fixture() {
  const envelope = {
    schema_version: '1.0.0',
    traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    created_at: '2026-07-13T08:16:03Z', team: 'vercel_studio', queue_item: 'V-001',
    claim_state: 'observed', evidence_state: 'test-verified', summary: 'Peer completed a tested queue slice.',
    sources: ['operations/ACTIVE_QUEUE.json'], artifacts: ['operations/evidence/v-001.json'],
    verification: ['node --test'], falsification_routes: ['Re-run tests and compare committed bytes.'], peer_triggers: []
  };
  const envelope_text = JSON.stringify(envelope);
  const attestation = createEvidenceAttestation({
    artifactName: 'peer-execution-envelope.json', artifactText: envelope_text,
    sourceRepository: 'MirrorCartographer/MirrorCartographer', sourceCommit: 'a'.repeat(40),
    builderId: 'https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/frontier.yml@refs/heads/main',
    invocationId: 'run-1', startedOn: '2026-07-13T08:16:00Z', finishedOn: '2026-07-13T08:16:04Z'
  });
  const policy = createTrustedBuilderPolicy({
    allowedBuilderIds: [attestation.predicate.runDetails.builder.id],
    allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
    allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
  });
  const events = [
    event({ id: ids.requested, phase: 'requested', source: '/teams/frontier_research', time: '2026-07-13T08:15:00Z' }),
    event({ id: ids.accepted, phase: 'accepted', source: '/teams/frontier_research', cause: ids.requested, time: '2026-07-13T08:15:01Z' }),
    event({ id: ids.executed, phase: 'executed', source: '/teams/vercel_studio', cause: ids.accepted, time: '2026-07-13T08:16:00Z', evidence: ['operations/evidence/v-001.json'], completed: 'V-001' })
  ];
  return { packet: { events, envelope, envelope_text, attestation, signature_verification: { verified: true, signer_identity: attestation.predicate.runDetails.builder.id } }, policy };
}

test('accepts a causally linked, attested, trusted and signed execution packet', () => {
  const { packet, policy } = fixture();
  assert.equal(verifyPeerExecutionProof(packet, policy).accepted, true);
});

test('rejects scheduler acceptance without execution', () => {
  const { packet, policy } = fixture();
  packet.events = packet.events.slice(0, 2);
  const result = verifyPeerExecutionProof(packet, policy);
  assert.equal(result.accepted, false);
  assert.match(result.errors.join(','), /lifecycle:accepted-not-executed/);
});

test('rejects an executed event emitted by the requesting team', () => {
  const { packet, policy } = fixture();
  packet.events[2].source = '/teams/frontier_research';
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /terminal-source-not-target-team/);
});

test('rejects a second terminal occurrence', () => {
  const { packet, policy } = fixture();
  packet.events.push({ ...packet.events[2], id: '44444444-4444-4444-8444-444444444444' });
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /exactly-one-terminal-event-required/);
});

test('rejects evidence omitted from the envelope', () => {
  const { packet, policy } = fixture();
  packet.envelope.artifacts = [];
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /undeclared-envelope-artifact/);
});

test('rejects attestation digest substitution', () => {
  const { packet, policy } = fixture();
  packet.envelope_text += ' ';
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /attestation-envelope-digest-mismatch/);
});

test('rejects an unverified signature', () => {
  const { packet, policy } = fixture();
  packet.signature_verification.verified = false;
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /cryptographic-signature-unverified/);
});

test('rejects causal timestamp regression', () => {
  const { packet, policy } = fixture();
  packet.events[2].time = '2026-07-13T08:14:59Z';
  assert.match(verifyPeerExecutionProof(packet, policy).errors.join(','), /causal-time-regression/);
});
