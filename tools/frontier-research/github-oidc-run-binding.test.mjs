import test from 'node:test';
import assert from 'node:assert/strict';
import { createGitHubOidcRunBindingPolicy, evaluateGitHubOidcRunBinding } from './github-oidc-run-binding.mjs';

const now = 1_800_000_000;
const sha = 'a'.repeat(40);
const policy = createGitHubOidcRunBindingPolicy({
  audience: 'mirrorcartographer-deploy', repositoryId: '123', ownerId: '456',
  workflowRef: 'MirrorCartographer/MirrorCartographer/.github/workflows/deploy.yml@refs/heads/main',
  jobWorkflowRef: 'MirrorCartographer/MirrorCartographer/.github/workflows/deploy.yml@refs/heads/main', workflowSha: sha
});
const valid = { iss: 'https://token.actions.githubusercontent.com', aud: 'mirrorcartographer-deploy', repository_id: '123', repository_owner_id: '456', workflow_ref: policy.workflowRef, job_workflow_ref: policy.jobWorkflowRef, workflow_sha: sha, iat: now - 30, exp: now + 270 };

test('accepts exact fresh workflow-bound claims', () => assert.equal(evaluateGitHubOidcRunBinding(valid, policy, now).accepted, true));
test('rejects reusable token from wrong workflow', () => assert.ok(evaluateGitHubOidcRunBinding({ ...valid, workflow_ref: 'evil/repo/.github/workflows/x.yml@refs/heads/main' }, policy, now).reasons.includes('workflow_ref')));
test('rejects stale token despite matching identity', () => assert.ok(evaluateGitHubOidcRunBinding({ ...valid, iat: now - 1000, exp: now + 10 }, policy, now).reasons.includes('token-too-old')));
test('rejects workflow commit substitution', () => assert.ok(evaluateGitHubOidcRunBinding({ ...valid, workflow_sha: 'b'.repeat(40) }, policy, now).reasons.includes('workflow_sha')));
test('rejects impossible chronology', () => assert.ok(evaluateGitHubOidcRunBinding({ ...valid, exp: now - 40, iat: now - 30 }, policy, now).reasons.includes('exp-not-after-iat')));
