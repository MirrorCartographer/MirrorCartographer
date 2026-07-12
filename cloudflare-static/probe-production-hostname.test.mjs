import test from 'node:test';
import assert from 'node:assert/strict';
import { probeProductionHostname } from './probe-production-hostname.mjs';

const verifiedHtml = '<!doctype html><html><head><title>Mirror Cartographer Research</title></head><body><main data-research-surface="mirror-cartographer-research"><h1>Mirror Cartographer Research</h1></main></body></html>';

function response({ body = verifiedHtml, status = 200, url = 'https://mirror-cartographer-research.pages.dev/' } = {}) {
  return {
    status,
    url,
    async text() { return body; }
  };
}

test('classifies a resolving verified research surface', async () => {
  const result = await probeProductionHostname({
    checkedAt: '2026-07-12T06:12:00.000Z',
    fetchImpl: async () => response()
  });
  assert.equal(result.classification, 'research_surface_verified');
  assert.equal(result.resolves, true);
  assert.equal(result.http_status, 200);
});

test('classifies a resolving but unexpected surface without persisting body', async () => {
  const result = await probeProductionHostname({
    fetchImpl: async () => response({ body: '<html><body>unrelated</body></html>' })
  });
  assert.equal(result.classification, 'unexpected_or_unhealthy_surface');
  assert.equal(result.resolves, true);
  assert.equal('body' in result, false);
});

test('classifies DNS failure without exposing error detail', async () => {
  const error = new TypeError('fetch failed');
  error.cause = { code: 'ENOTFOUND' };
  const result = await probeProductionHostname({ fetchImpl: async () => { throw error; } });
  assert.equal(result.classification, 'dns_unresolved');
  assert.equal(result.resolves, false);
  assert.equal('error' in result, false);
});

test('rejects non-HTTPS targets', async () => {
  await assert.rejects(
    () => probeProductionHostname({ url: 'http://example.test/' }),
    /requires https/
  );
});
