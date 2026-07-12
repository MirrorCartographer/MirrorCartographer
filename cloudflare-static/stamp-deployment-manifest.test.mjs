import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildDeploymentManifest, writeDeploymentManifest } from './stamp-deployment-manifest.mjs';

const SHA = '0123456789abcdef0123456789abcdef01234567';

test('builds a privacy-safe manifest bound to repository and source commit', () => {
  const result = buildDeploymentManifest({ sourceCommit: SHA, repository: 'MirrorCartographer/MirrorCartographer' });
  assert.equal(result.source_commit, SHA);
  assert.equal(result.repository, 'MirrorCartographer/MirrorCartographer');
  assert.equal(result.privacy.contains_secrets, false);
  assert.equal(result.privacy.contains_private_user_data, false);
});

test('rejects malformed commit and repository identities', () => {
  assert.throws(() => buildDeploymentManifest({ sourceCommit: 'main', repository: 'MirrorCartographer/MirrorCartographer' }), /40-character git SHA/);
  assert.throws(() => buildDeploymentManifest({ sourceCommit: SHA, repository: 'MirrorCartographer' }), /owner\/name/);
});

test('writes the expected well-known path', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-cloudflare-manifest-'));
  const result = writeDeploymentManifest(root, { sourceCommit: SHA, repository: 'MirrorCartographer/MirrorCartographer' });
  assert.equal(result.outputPath, path.join(root, '.well-known', 'mirror-cartographer-research.json'));
  const persisted = JSON.parse(fs.readFileSync(result.outputPath, 'utf8'));
  assert.deepEqual(persisted, result.manifest);
});
