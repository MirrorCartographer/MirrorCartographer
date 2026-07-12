import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePagesHostname } from './resolve-pages-hostname.mjs';

const project = { result: { name: 'mirror-cartographer-research', subdomain: 'https://mirror-cartographer-research-a1b.pages.dev', domains: ['research.example.com'] } };

test('uses API subdomain rather than deriving hostname from project name', () => {
  const out = resolvePagesHostname(project);
  assert.equal(out.canonical_hostname, 'mirror-cartographer-research-a1b.pages.dev');
  assert.equal(out.authority, 'cloudflare-pages-project-api');
  assert.equal(out.claim, 'canonical-hostname-observed');
});

test('accepts a Pages preview URL under the authoritative subdomain', () => {
  const out = resolvePagesHostname(project, 'https://9f0c2d.mirror-cartographer-research-a1b.pages.dev/');
  assert.deepEqual(out.deployment, {
    url: 'https://9f0c2d.mirror-cartographer-research-a1b.pages.dev/',
    hostname: '9f0c2d.mirror-cartographer-research-a1b.pages.dev',
    relation: 'pages-preview',
    bound: true
  });
});

test('accepts only custom domains declared by the control plane', () => {
  assert.equal(resolvePagesHostname(project, 'https://research.example.com/').deployment.relation, 'declared-custom-domain');
  assert.equal(resolvePagesHostname(project, 'https://lookalike.example.com/').deployment.relation, 'unbound');
});

test('rejects inferred, non-HTTPS, or non-Pages canonical origins', () => {
  assert.throws(() => resolvePagesHostname({ result: { name: 'x' } }), /project-subdomain-missing/);
  assert.throws(() => resolvePagesHostname({ result: { name: 'x', subdomain: 'http://x.pages.dev' } }), /must-use-https/);
  assert.throws(() => resolvePagesHostname({ result: { name: 'x', subdomain: 'https://example.com' } }), /not-pages-dev/);
});

test('digest is deterministic for identical evidence', () => {
  assert.equal(resolvePagesHostname(project).digest_sha256, resolvePagesHostname(project).digest_sha256);
});
