import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyPreflightReleasePacket } from './verify-preflight-release-packet.mjs';

const sha = 'a'.repeat(40);
const repository = 'MirrorCartographer/MirrorCartographer';
const base = () => ({
  manifest: { repository, commit_sha: sha, artifacts: ['cloudflare-environment-preflight-run.json','cloudflare-environment-preflight-verdict.json','cloudflare-dispatch-decision.json'] },
  verdict: { ok: true, classification: 'repository_declarations_verified', source: { repository, commit_sha: sha } },
  decision: { allowed: true, classification: 'dispatch_ready', target: { repository, commit_sha: sha, ref: sha, workflow: '.github/workflows/cloudflare-pages-research.yml' }, preflight: { classification: 'repository_declarations_verified' } },
  expected: { repository, commit_sha: sha }
});

test('accepts a coherent exact-commit release packet', () => {
  assert.equal(verifyPreflightReleasePacket(base()).classification, 'release_packet_verified');
});

test('rejects a mismatched decision commit', () => {
  const input = base(); input.decision.target.commit_sha = 'b'.repeat(40);
  assert.equal(verifyPreflightReleasePacket(input).reason, 'decision-target-mismatch');
});

test('rejects a verdict from another repository', () => {
  const input = base(); input.verdict.source.repository = 'other/repo';
  assert.equal(verifyPreflightReleasePacket(input).reason, 'verdict-source-mismatch');
});

test('rejects an incomplete manifest artifact set', () => {
  const input = base(); input.manifest.artifacts = ['cloudflare-environment-preflight-run.json'];
  assert.equal(verifyPreflightReleasePacket(input).reason, 'manifest-artifact-set-incomplete');
});

test('rejects a non-ready dispatch decision', () => {
  const input = base(); input.decision.allowed = false;
  assert.equal(verifyPreflightReleasePacket(input).reason, 'decision-not-ready');
});
