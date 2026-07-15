import test from 'node:test';
import assert from 'node:assert/strict';
import { sha256, verifyAfterimageDeployment } from './verify-deployment.mjs';

const entrypoint = '<title>Afterimage</title> No memory leaves this page. afterimage-scene/2';
const manifest = JSON.stringify({
  site_id: 'afterimage',
  root: 'independent/afterimage',
  verification: {
    receipt_schema: 'afterimage-deployment-receipt/1',
    required_markers: ['<title>Afterimage</title>', 'No memory leaves this page.', 'afterimage-scene/2']
  }
});
const receipt = {
  schema: 'afterimage-deployment-receipt/1',
  source_commit: 'a'.repeat(40),
  deployment_url: 'https://example.test/',
  deployed_at: '2026-07-15T17:28:00Z',
  entrypoint_sha256: sha256(entrypoint),
  manifest_sha256: sha256(manifest)
};

test('accepts exact immutable source and served bytes', () => {
  assert.equal(verifyAfterimageDeployment({ manifestText: manifest, entrypointText: entrypoint, receipt, servedHtml: entrypoint }).ok, true);
});

test('rejects non-https deployment URL', () => {
  assert.equal(verifyAfterimageDeployment({ manifestText: manifest, entrypointText: entrypoint, receipt: { ...receipt, deployment_url: 'http://example.test/' }, servedHtml: entrypoint }).reason, 'deployment_url_not_https');
});

test('rejects manifest drift', () => {
  assert.equal(verifyAfterimageDeployment({ manifestText: `${manifest} `, entrypointText: entrypoint, receipt, servedHtml: entrypoint }).reason, 'manifest_digest_mismatch');
});

test('rejects source-byte drift', () => {
  assert.equal(verifyAfterimageDeployment({ manifestText: manifest, entrypointText: `${entrypoint}x`, receipt, servedHtml: entrypoint }).reason, 'entrypoint_digest_mismatch');
});

test('rejects served-byte drift', () => {
  assert.equal(verifyAfterimageDeployment({ manifestText: manifest, entrypointText: entrypoint, receipt, servedHtml: `${entrypoint}x` }).reason, 'served_bytes_do_not_match_entrypoint');
});

test('rejects identity marker loss', () => {
  const plain = 'plain';
  assert.equal(verifyAfterimageDeployment({ manifestText: manifest, entrypointText: plain, receipt: { ...receipt, entrypoint_sha256: sha256(plain) }, servedHtml: plain }).reason.startsWith('served_marker_missing:'), true);
});
