import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { materializeHostnameAuthorityConsistency } from './materialize-hostname-authority-consistency.mjs';

const commit = 'a'.repeat(40);
const url = 'https://abc123.mirror-cartographer-research.pages.dev';
const hostname = 'abc123.mirror-cartographer-research.pages.dev';

function writeFixture(directory, name, value) {
  fs.writeFileSync(path.join(directory, name), `${JSON.stringify(value, null, 2)}\n`);
}

function fixtureDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cf-authority-'));
  writeFixture(directory, 'cloudflare-pages-hostname-authority.json', {
    project: 'mirror-cartographer-research',
    deployment: { url, hostname, relation: 'pages-preview', bound: true }
  });
  writeFixture(directory, 'cloudflare-hostname-evidence-gate.json', {
    deployment_url: url,
    hostname,
    accepted: true,
    packet: { expected: { source_commit: commit }, observation: { hostname } }
  });
  writeFixture(directory, 'cloudflare-deployment-metadata.json', {
    valid: true,
    classification: 'exact-deployment-metadata-match',
    match: { id: 'deployment-1', project_name: 'mirror-cartographer-research', url, commit_hash: commit }
  });
  return directory;
}

test('materializes an accepted source-bound consistency artifact', () => {
  const directory = fixtureDirectory();
  const result = materializeHostnameAuthorityConsistency({ directory, expectedCommit: commit });
  assert.equal(result.evidence.accepted, true);
  assert.equal(result.evidence.deployment_claim_permitted, true);
  assert.equal(result.evidence.bindings.source_commit, commit);
  assert.equal(result.evidence.privacy.secret_values_emitted, false);
});

test('materializes a fail-closed verdict for unavailable conditional evidence', () => {
  const directory = fixtureDirectory();
  writeFixture(directory, 'cloudflare-deployment-metadata.json', {
    artifact_type: 'cloudflare-conditional-evidence-unavailable',
    status: 'unavailable'
  });
  const result = materializeHostnameAuthorityConsistency({ directory, expectedCommit: commit });
  assert.equal(result.evidence.accepted, false);
  assert.equal(result.evidence.deployment_claim_permitted, false);
  assert.ok(result.evidence.errors.includes('metadata.not-exact-match'));
});

test('refuses to overwrite retained consistency evidence', () => {
  const directory = fixtureDirectory();
  materializeHostnameAuthorityConsistency({ directory, expectedCommit: commit });
  assert.throws(
    () => materializeHostnameAuthorityConsistency({ directory, expectedCommit: commit }),
    /hostname-authority-consistency-output-exists/
  );
});
