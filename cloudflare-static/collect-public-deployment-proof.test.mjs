import test from 'node:test';
import assert from 'node:assert/strict';
import { collectPublicDeploymentProof } from './collect-public-deployment-proof.mjs';

const COMMIT = 'a'.repeat(40);
const MANIFEST = {
  schema_version: '1.0.0',
  surface: 'mirror-cartographer-research',
  repository: 'MirrorCartographer/MirrorCartographer',
  source_commit: COMMIT,
  privacy: { contains_secrets: false, contains_private_user_data: false }
};

function response({ status = 200, url, body, contentType }) {
  return {
    status,
    ok: status >= 200 && status < 300,
    url,
    headers: { get: (name) => name.toLowerCase() === 'content-type' ? contentType : null },
    text: async () => body
  };
}

const expected = {
  repository: 'MirrorCartographer/MirrorCartographer',
  surface: 'mirror-cartographer-research',
  sourceCommit: COMMIT
};

const html = '<!doctype html><html><head><title>Mirror Cartographer Research</title></head><body><main data-research-surface="mirror-cartographer-research">Evidence provenance research medicine</main></body></html>';

test('collects page and manifest into exact commit proof', async () => {
  const fetchFn = async (url) => url.endsWith('.json')
    ? response({ url, body: JSON.stringify(MANIFEST), contentType: 'application/json' })
    : response({ url, body: html, contentType: 'text/html' });
  const result = await collectPublicDeploymentProof('research.example.com', expected, {
    checkedAt: '2026-07-13T17:46:00.000Z',
    resolve4Fn: async () => ['192.0.2.1'],
    resolve6Fn: async () => [],
    fetchFn
  });
  assert.equal(result.classification.classification, 'exact_commit_surface_verified');
  assert.equal(result.classification.ok, true);
  assert.equal(result.manifest_transport.attempted, true);
  assert.equal(result.manifest_transport.status, 200);
});

test('preserves manifest transport failure without overstating deployment absence', async () => {
  const fetchFn = async (url) => {
    if (url.endsWith('.json')) throw Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' });
    return response({ url, body: html, contentType: 'text/html' });
  };
  const result = await collectPublicDeploymentProof('research.example.com', expected, {
    checkedAt: '2026-07-13T17:46:00.000Z',
    resolve4Fn: async () => ['192.0.2.1'],
    resolve6Fn: async () => [],
    fetchFn
  });
  assert.equal(result.classification.classification, 'surface_identity_without_commit_proof');
  assert.equal(result.classification.ok, false);
  assert.match(result.classification.reasons.join(','), /manifest-transport:ETIMEDOUT/);
});

test('does not request manifest when page identity is not verified', async () => {
  const urls = [];
  const fetchFn = async (url) => {
    urls.push(url);
    return response({ url, body: '<html><body>other site</body></html>', contentType: 'text/html' });
  };
  const result = await collectPublicDeploymentProof('research.example.com', expected, {
    checkedAt: '2026-07-13T17:46:00.000Z',
    resolve4Fn: async () => ['192.0.2.1'],
    resolve6Fn: async () => [],
    fetchFn
  });
  assert.equal(result.classification.classification, 'reachable_surface_unverified');
  assert.equal(result.manifest_transport.attempted, false);
  assert.equal(urls.length, 1);
});

test('retains malformed manifest as bounded commit-proof failure', async () => {
  const fetchFn = async (url) => url.endsWith('.json')
    ? response({ url, body: 'not-json', contentType: 'text/plain' })
    : response({ url, body: html, contentType: 'text/html' });
  const result = await collectPublicDeploymentProof('research.example.com', expected, {
    checkedAt: '2026-07-13T17:46:00.000Z',
    resolve4Fn: async () => ['192.0.2.1'],
    resolve6Fn: async () => [],
    fetchFn
  });
  assert.equal(result.classification.classification, 'surface_identity_without_commit_proof');
  assert.match(result.classification.reasons.join(','), /response-not-json/);
});
