import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePagesProjectIdentity } from './validate-pages-project-identity.mjs';

const proof = {
  deployment_url: 'https://abc123.mirror-cartographer-research.pages.dev',
  alias_url: 'https://mirror-cartographer-research.pages.dev',
  project_name: 'mirror-cartographer-research'
};

test('accepts immutable preview and canonical alias for expected project', () => {
  assert.equal(validatePagesProjectIdentity(proof, 'mirror-cartographer-research').valid, true);
});

test('rejects deployment from another Pages project', () => {
  const result = validatePagesProjectIdentity({ ...proof, deployment_url: 'https://abc123.other-project.pages.dev' }, 'mirror-cartographer-research');
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /immutable preview/);
});

test('rejects alias for another Pages project', () => {
  const result = validatePagesProjectIdentity({ ...proof, alias_url: 'https://other-project.pages.dev' }, 'mirror-cartographer-research');
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /canonical Pages project hostname/);
});

test('rejects mismatched explicit project name', () => {
  const result = validatePagesProjectIdentity({ ...proof, project_name: 'other-project' }, 'mirror-cartographer-research');
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /project_name/);
});

test('rejects malformed expected project names', () => {
  assert.equal(validatePagesProjectIdentity(proof, 'Bad_Project').valid, false);
});
