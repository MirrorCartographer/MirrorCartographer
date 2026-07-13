import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkflowInvocationReceipt } from './build-workflow-invocation-receipt.mjs';
import { REQUIRED_EVIDENCE_FILES } from './build-deployment-evidence-manifest.mjs';

const context = {
  repository: 'MirrorCartographer/MirrorCartographer',
  repository_id: '1014575224',
  repository_owner_id: '216780403',
  workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/cloudflare-pages-research.yml@refs/heads/main',
  workflow_sha: 'a'.repeat(40),
  ref: 'refs/heads/main',
  event_name: 'workflow_dispatch',
  environment: 'cloudflare-research',
  run_id: '123456789',
  run_attempt: '1',
  run_number: '42',
  actor_id: '1001',
  triggering_actor: 'mirror-operator',
  source_sha: 'b'.repeat(40)
};
const policy = {
  enabled: true,
  repository: context.repository,
  repository_id: context.repository_id,
  repository_owner_id: context.repository_owner_id,
  workflow_ref: context.workflow_ref,
  ref: context.ref,
  event_name: context.event_name,
  environment: context.environment
};

test('accepted workflow invocation receipt is a required evidence-manifest subject', () => {
  const receipt = buildWorkflowInvocationReceipt({ context, policy, generatedAt: '2026-07-13T04:06:29.000Z' });
  assert.equal(receipt.accepted, true);
  assert.match(receipt.replay_key_sha256, /^[0-9a-f]{64}$/);
  assert.equal(REQUIRED_EVIDENCE_FILES.includes('cloudflare-workflow-invocation-receipt.json'), true);
});

test('lookalike workflow identity cannot produce accepted manifest evidence', () => {
  const receipt = buildWorkflowInvocationReceipt({
    context: { ...context, workflow_ref: 'MirrorCartographer/MirrorCartographer/.github/workflows/lookalike.yml@refs/heads/main' },
    policy,
    generatedAt: '2026-07-13T04:06:29.000Z'
  });
  assert.equal(receipt.accepted, false);
  assert.equal(receipt.replay_key_sha256, null);
});
