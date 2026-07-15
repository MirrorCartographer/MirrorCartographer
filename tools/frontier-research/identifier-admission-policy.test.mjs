import assert from 'node:assert/strict';
import test from 'node:test';
import { decideIdentifierAdmission } from './identifier-admission-policy.mjs';

const valid = {
  identifier: 'example',
  profileVersion: 'Unicode-17.0.0',
  confusablesVersion: 'Unicode-17.0.0',
  profileEligible: true,
  skeletonUnique: true,
  profileComplete: true,
  confusablesComplete: true,
};

test('allows only when both mechanisms are complete and affirmative', () => {
  const result = decideIdentifierAdmission(valid);
  assert.equal(result.outcome, 'allow');
  assert.deepEqual(result.reasons, []);
});

test('a unique skeleton cannot override profile rejection', () => {
  const result = decideIdentifierAdmission({ ...valid, profileEligible: false });
  assert.equal(result.outcome, 'reject');
  assert.deepEqual(result.reasons, ['identifier_profile_rejected']);
});

test('profile eligibility cannot override a skeleton collision', () => {
  const result = decideIdentifierAdmission({ ...valid, skeletonUnique: false });
  assert.equal(result.outcome, 'reject');
  assert.deepEqual(result.reasons, ['confusable_skeleton_collision']);
});

test('incomplete evidence fails closed and preserves all reasons', () => {
  const result = decideIdentifierAdmission({
    ...valid,
    profileComplete: false,
    confusablesComplete: false,
    profileEligible: false,
    skeletonUnique: false,
  });
  assert.equal(result.outcome, 'reject');
  assert.deepEqual(result.reasons, [
    'profile_evidence_incomplete',
    'confusables_evidence_incomplete',
    'identifier_profile_rejected',
    'confusable_skeleton_collision',
  ]);
});

test('versions and booleans are mandatory', () => {
  assert.throws(() => decideIdentifierAdmission({ ...valid, profileVersion: '' }), /profileVersion/);
  assert.throws(() => decideIdentifierAdmission({ ...valid, skeletonUnique: 'yes' }), /skeletonUnique/);
});
