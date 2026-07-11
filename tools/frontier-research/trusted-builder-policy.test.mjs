import test from 'node:test';
import assert from 'node:assert/strict';
import { createTrustedBuilderPolicy, evaluateTrustedBuilderPolicy } from './trusted-builder-policy.mjs';

const policy = createTrustedBuilderPolicy({
  allowedBuilderIds: ['https://github.com/MirrorCartographer/MirrorCartographer/.github/workflows/evidence.yml@refs/heads/main'],
  allowedSourceRepositories: ['MirrorCartographer/MirrorCartographer'],
  allowedBuildTypes: ['https://mirrorcartographer.org/build-types/evidence-envelope/v1']
});

function statement(overrides = {}) {
  return {
    _type: 'https://in-toto.io/Statement/v1',
    subject: [{ name: 'evidence.json', digest: { sha256: 'a'.repeat(64) } }],
    predicateType: 'https://slsa.dev/provenance/v1',
    predicate: {
      buildDefinition: {
        buildType: overrides.buildType ?? 'https://mirrorcartographer.org/build-types/evidence-envelope/v1',
        externalParameters: { sourceRepository: overrides.sourceRepository ?? 'MirrorCartographer/MirrorCartographer' },
        resolvedDependencies: [{ digest: { gitCommit: 'b'.repeat(40) } }]
      },
      runDetails: {
        builder: { id: overrides.builderId ?? policy.allowedBuilderIds[0] },
        metadata: { invocationId: overrides.invocationId === undefined ? 'run-123' : overrides.invocationId }
      }
    }
  };
}

test('accepts exact allowlisted builder, source, and build type', () => {
  assert.deepEqual(evaluateTrustedBuilderPolicy(statement(), policy), { trusted: true, reasons: [] });
});

test('rejects lookalike builder identity', () => {
  const result = evaluateTrustedBuilderPolicy(statement({ builderId: `${policy.allowedBuilderIds[0]}-evil` }), policy);
  assert.equal(result.trusted, false);
  assert.ok(result.reasons.includes('builder.id'));
});

test('rejects valid provenance from an untrusted repository', () => {
  const result = evaluateTrustedBuilderPolicy(statement({ sourceRepository: 'attacker/MirrorCartographer' }), policy);
  assert.equal(result.trusted, false);
  assert.ok(result.reasons.includes('sourceRepository'));
});

test('fails closed when invocation identity is absent', () => {
  const result = evaluateTrustedBuilderPolicy(statement({ invocationId: '' }), policy);
  assert.equal(result.trusted, false);
  assert.ok(result.reasons.includes('invocationId'));
});
