import test from 'node:test';
import assert from 'node:assert/strict';
import { wireFinalizeDeploymentEvidence } from './wire-finalize-deployment-evidence.mjs';

const fixture = `name: Deploy
jobs:
  deploy:
    steps:
      - name: Test deployment evidence contracts
        run: |
          node --test cloudflare-static/verify-cloudflare-deployment-metadata.test.mjs

      - name: Assert acceptance invariants
        run: true

      - name: Upload proof artifacts
        with:
          path: |
            cloudflare-deployment-acceptance.json

      - name: Publish run summary
        run: |
          {
            echo "- Acceptance decision: \`cloudflare-deployment-acceptance.json\`"
          }
`;

test('wires test, finalizer, artifact, and summary in required order', () => {
  const result = wireFinalizeDeploymentEvidence(fixture);
  assert.equal(result.changed, true);
  assert.match(result.source, /finalize-deployment-evidence\.test\.mjs/);
  assert.match(result.source, /name: Finalize and verify exact deployment evidence manifest/);
  assert.match(result.source, /cloudflare-deployment-evidence-manifest\.json/);
  assert.ok(result.source.indexOf('Finalize and verify exact deployment evidence manifest') < result.source.indexOf('Upload proof artifacts'));
});

test('is idempotent after successful wiring', () => {
  const first = wireFinalizeDeploymentEvidence(fixture);
  const second = wireFinalizeDeploymentEvidence(first.source);
  assert.equal(second.changed, false);
  assert.equal(second.source, first.source);
});

test('fails closed when an expected workflow anchor disappears', () => {
  assert.throws(
    () => wireFinalizeDeploymentEvidence(fixture.replace('      - name: Upload proof artifacts', '      - name: Upload something else')),
    /workflow-anchor-missing/
  );
});
