import assert from 'node:assert/strict';
import { assertInheritedUnresolved, validateInheritedUnresolved } from './inherited-unresolved-invariant.mjs';

const predecessor = {
  id: 'M-009',
  dependencies: [],
  unresolved: ['workflow artifact', 'adapter audit'],
};

const preservingSuccessor = {
  id: 'M-010',
  dependencies: ['M-009'],
  unresolved_inherited: ['workflow artifact', 'adapter audit'],
  resolved_claims: [],
};

const resolvingSuccessor = {
  id: 'M-011',
  dependencies: ['M-010'],
  unresolved_inherited: [],
  resolved_claims: ['workflow artifact', 'adapter audit'],
};

const droppingSuccessor = {
  id: 'M-012',
  dependencies: ['M-009'],
  unresolved_inherited: ['workflow artifact'],
  resolved_claims: [],
};

assert.deepEqual(validateInheritedUnresolved([predecessor, preservingSuccessor]), {
  valid: true,
  violations: [],
});

assert.deepEqual(validateInheritedUnresolved([predecessor, preservingSuccessor, resolvingSuccessor]), {
  valid: true,
  violations: [],
});

const dropped = validateInheritedUnresolved([predecessor, droppingSuccessor]);
assert.equal(dropped.valid, false);
assert.deepEqual(dropped.violations, [{
  type: 'dropped_unresolved_claim',
  record_id: 'M-012',
  dependency_id: 'M-009',
  claim: 'adapter audit',
}]);

assert.throws(
  () => assertInheritedUnresolved([predecessor, droppingSuccessor]),
  (error) => error.code === 'CONTINUITY_UNRESOLVED_DROPPED'
    && error.violations.length === 1,
);

const missing = validateInheritedUnresolved([{
  id: 'M-013',
  dependencies: ['M-404'],
  unresolved_inherited: [],
  resolved_claims: [],
}]);
assert.equal(missing.valid, false);
assert.equal(missing.violations[0].type, 'missing_dependency');

console.log('inherited unresolved continuity invariant: 5 checks passed');
