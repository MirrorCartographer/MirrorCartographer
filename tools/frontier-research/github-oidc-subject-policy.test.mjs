import test from 'node:test';
import assert from 'node:assert/strict';
import { createGitHubOidcSubjectPolicy, evaluateGitHubOidcSubject, parseGitHubOidcSubject } from './github-oidc-subject-policy.mjs';

const base = Object.freeze({
  owner: 'example-owner',
  ownerId: '101',
  repository: 'example-repository',
  repositoryId: '202',
  qualifierType: 'ref',
  qualifier: 'refs/heads/main'
});

const immutable = 'repo:example-owner@101/example-repository@202:ref:refs/heads/main';
const legacy = 'repo:example-owner/example-repository:ref:refs/heads/main';

test('accepts an exact immutable subject', () => {
  const policy = createGitHubOidcSubjectPolicy({ ...base, requireImmutable: true });
  const result = evaluateGitHubOidcSubject(immutable, policy);
  assert.equal(result.accepted, true);
  assert.deepEqual(result.reasons, []);
});

test('rejects namespace lookalikes with different stable IDs', () => {
  const policy = createGitHubOidcSubjectPolicy({ ...base, requireImmutable: true });
  const result = evaluateGitHubOidcSubject('repo:example-owner@303/example-repository@404:ref:refs/heads/main', policy);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['ownerId', 'repositoryId']);
});

test('flags an accepted legacy subject for migration', () => {
  const policy = createGitHubOidcSubjectPolicy({ ...base, requireImmutable: false });
  const result = evaluateGitHubOidcSubject(legacy, policy);
  assert.equal(result.accepted, true);
  assert.equal(result.migrationRequired, true);
});

test('rejects legacy subjects after immutable enforcement', () => {
  const policy = createGitHubOidcSubjectPolicy({ ...base, requireImmutable: true });
  const result = evaluateGitHubOidcSubject(legacy, policy);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['immutable-subject-required']);
});

test('rejects malformed subjects and qualifier drift', () => {
  assert.equal(parseGitHubOidcSubject('repo:owner@abc/repository@1:ref:refs/heads/main').valid, false);
  const policy = createGitHubOidcSubjectPolicy({ ...base, requireImmutable: true });
  const result = evaluateGitHubOidcSubject('repo:example-owner@101/example-repository@202:environment:Production', policy);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['qualifierType', 'qualifier']);
});
