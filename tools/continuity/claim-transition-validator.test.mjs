import test from 'node:test';
import assert from 'node:assert/strict';
import { validateClaimTransitionGraph } from './claim-transition-validator.mjs';

const claim = (id, scope = ['repo'], epistemic_class = 'observed', authority_class = 'repository_record') => ({
  claim_id: id,
  epistemic_class,
  statement: `claim ${id}`,
  source_locator: `git:${id}`,
  source_identity: { authority_class },
  scope,
  privacy_class: 'public_abstract',
  falsification_route: 'counterexample'
});

const edge = (id, from, to, type = 'superseded', extra = {}) => ({
  transition_id: id,
  from_claim_id: from,
  to_claim_id: to,
  transition_type: type,
  rationale: 'new evidence',
  evidence: {},
  authority_class: 'repository_record',
  created_at: '2026-07-15T01:50:00Z',
  falsification_route: 'counterexample',
  ...extra
});

test('valid supersession preserves both immutable claims', () => {
  const result = validateClaimTransitionGraph({
    claims: [claim('a'), claim('b')],
    transitions: [edge('t', 'a', 'b')]
  });
  assert.deepEqual(result.retained_claim_ids, ['a', 'b']);
});

test('rejects dangling references', () =>
  assert.throws(() => validateClaimTransitionGraph({
    claims: [claim('a')],
    transitions: [edge('t', 'a', 'missing')]
  }), /dangling/));

test('rejects cycles', () =>
  assert.throws(() => validateClaimTransitionGraph({
    claims: [claim('a'), claim('b')],
    transitions: [edge('t1', 'a', 'b'), edge('t2', 'b', 'a')]
  }), /cycle/));

test('rejects scope expansion without exhaustive evidence', () =>
  assert.throws(() => validateClaimTransitionGraph({
    claims: [claim('a', ['repo']), claim('b', ['repo', 'chat'])],
    transitions: [edge('t', 'a', 'b')]
  }), /exhaustive/));

test('rejects scope expansion with weaker authority', () =>
  assert.throws(() => validateClaimTransitionGraph({
    claims: [claim('a', ['repo'], 'observed', 'governance'), claim('b', ['repo', 'chat'])],
    transitions: [edge('t', 'a', 'b', 'superseded', { evidence: { exhaustive_coverage: true } })]
  }), /authority/));

test('accepts supported scope expansion at equal authority', () =>
  assert.equal(validateClaimTransitionGraph({
    claims: [claim('a', ['repo']), claim('b', ['repo', 'chat'])],
    transitions: [edge('t', 'a', 'b', 'superseded', { evidence: { exhaustive_coverage: true } })]
  }).valid, true));
