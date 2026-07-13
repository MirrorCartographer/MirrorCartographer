import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyPagesHostname } from './classify-pages-hostname.mjs';

test('accepts exact production pages.dev host', () => {
  const result = classifyPagesHostname({ deployment_url: 'https://mirror-cartographer.pages.dev/', project_name: 'mirror-cartographer' });
  assert.equal(result.ok, true);
  assert.equal(result.binding.host_class, 'pages-production-host');
});

test('accepts project-bound preview host', () => {
  const result = classifyPagesHostname({ deployment_url: 'https://a1b2c3.mirror-cartographer.pages.dev/', project_name: 'mirror-cartographer' });
  assert.equal(result.ok, true);
  assert.equal(result.binding.host_class, 'pages-preview-host');
});

test('rejects lookalike pages.dev suffix', () => {
  const result = classifyPagesHostname({ deployment_url: 'https://mirror-cartographer.pages.dev.example.com/', project_name: 'mirror-cartographer' });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('hostname-not-bound-to-pages-project-or-allowlist'));
});

test('rejects insecure or credentialed URLs', () => {
  assert.equal(classifyPagesHostname({ deployment_url: 'http://mirror-cartographer.pages.dev/', project_name: 'mirror-cartographer' }).ok, false);
  assert.equal(classifyPagesHostname({ deployment_url: 'https://user@example.com/', project_name: 'mirror-cartographer' }).ok, false);
});

test('accepts only exact explicit custom host', () => {
  const accepted = classifyPagesHostname({ deployment_url: 'https://research.example.org/', project_name: 'mirror-cartographer', allowed_custom_hosts: ['research.example.org'] });
  const rejected = classifyPagesHostname({ deployment_url: 'https://sub.research.example.org/', project_name: 'mirror-cartographer', allowed_custom_hosts: ['research.example.org'] });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.binding.host_class, 'explicit-custom-host');
  assert.equal(rejected.ok, false);
});

test('rejects paths, queries, and fragments as deployment identity', () => {
  const result = classifyPagesHostname({ deployment_url: 'https://mirror-cartographer.pages.dev/proof?x=1#y', project_name: 'mirror-cartographer' });
  assert.equal(result.ok, false);
  assert.ok(result.reasons.includes('deployment-url-must-identify-origin-root'));
});
