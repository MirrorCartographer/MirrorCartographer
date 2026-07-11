import test from 'node:test';
import assert from 'node:assert/strict';
import { createProvenanceExpectations, evaluateProvenanceExpectations } from './provenance-expectations.mjs';

const expectations = createProvenanceExpectations({
  buildType: 'https://mirrorcartographer.org/build-types/evidence/v1',
  externalParameters: {
    sourceRepository: 'https://github.com/MirrorCartographer/MirrorCartographer',
    workflow: '.github/workflows/cloudflare-pages-research.yml',
    environment: 'cloudflare-research'
  }
});

function statement(externalParameters = expectations.externalParameters, buildType = expectations.buildType) {
  return { predicate: { buildDefinition: { buildType, externalParameters } } };
}

test('accepts exact build type and external parameters regardless of key order', () => {
  const result = evaluateProvenanceExpectations(statement({
    environment: 'cloudflare-research',
    workflow: '.github/workflows/cloudflare-pages-research.yml',
    sourceRepository: 'https://github.com/MirrorCartographer/MirrorCartographer'
  }), expectations);
  assert.deepEqual(result, { accepted: true, reasons: [] });
});

test('rejects an unrecognized external parameter', () => {
  const result = evaluateProvenanceExpectations(statement({ ...expectations.externalParameters, command: 'deploy-unreviewed.sh' }), expectations);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['externalParameters.unknown:command']);
});

test('rejects a changed expected parameter', () => {
  const result = evaluateProvenanceExpectations(statement({ ...expectations.externalParameters, environment: 'production' }), expectations);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, ['externalParameters.value:environment']);
});

test('rejects missing parameters and unexpected build type', () => {
  const result = evaluateProvenanceExpectations(statement({ sourceRepository: expectations.externalParameters.sourceRepository }, 'https://example.invalid/build'), expectations);
  assert.equal(result.accepted, false);
  assert.deepEqual(result.reasons, [
    'buildType',
    'externalParameters.missing:environment,workflow'
  ]);
});
