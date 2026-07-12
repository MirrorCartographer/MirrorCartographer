import test from 'node:test';
import assert from 'node:assert/strict';
import {
  accumulateObservationCallback,
  classifyObservationCompleteness
} from './performance-observation-completeness.mjs';

test('unsupported entry type cannot support an absence claim', () => {
  const result = classifyObservationCompleteness({ supported: false });
  assert.equal(result.classification, 'unsupported');
  assert.equal(result.completeEnoughForAbsenceClaim, false);
});

test('reported dropped entries make the observation known incomplete', () => {
  const result = classifyObservationCompleteness({
    supported: true,
    callbacks: 2,
    observedEntries: 7,
    droppedEntries: 3
  });
  assert.equal(result.classification, 'known_incomplete');
  assert.equal(result.completeEnoughForAbsenceClaim, false);
});

test('zero callbacks remains unconfirmed rather than complete', () => {
  const result = classifyObservationCompleteness({
    supported: true,
    callbacks: 0,
    observedEntries: 0,
    droppedEntries: 0
  });
  assert.equal(result.classification, 'unconfirmed');
  assert.equal(result.completeEnoughForAbsenceClaim, false);
});

test('callback with zero reported drops permits a bounded absence claim', () => {
  const result = classifyObservationCompleteness({
    supported: true,
    callbacks: 1,
    observedEntries: 0,
    droppedEntries: 0,
    bufferedRequested: true
  });
  assert.equal(result.classification, 'no_known_loss');
  assert.equal(result.completeEnoughForAbsenceClaim, true);
  assert.match(result.reason, /bounded/);
});

test('callback accumulator preserves counts without raw entry content', () => {
  let state = accumulateObservationCallback({}, { entryCount: 4, droppedEntriesCount: 2 });
  state = accumulateObservationCallback(state, { entryCount: 1, droppedEntriesCount: 0 });
  assert.deepEqual(state, { callbacks: 2, observedEntries: 5, droppedEntries: 2 });
  assert.equal('entries' in state, false);
});

test('negative and fractional counts are rejected', () => {
  assert.throws(
    () => classifyObservationCompleteness({ supported: true, callbacks: -1 }),
    /non-negative integer/
  );
  assert.throws(
    () => accumulateObservationCallback({}, { entryCount: 1.5 }),
    /non-negative integer/
  );
});
