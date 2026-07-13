import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTransactionRequest,
  openCapabilityNegotiatedTransaction,
  describeTransactionDurability
} from './indexeddb-transaction-capability.mjs';

test('uses the options form when supported', () => {
  const calls = [];
  const db = { transaction(...args) { calls.push(args); return { durability: 'strict' }; } };
  const result = openCapabilityNegotiatedTransaction(db, { storeNames: 'acceptance_ids', mode: 'readwrite', durability: 'strict' });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], [['acceptance_ids'], 'readwrite', { durability: 'strict' }]);
  assert.equal(result.transaction_options_supported, true);
  assert.equal(describeTransactionDurability(result).persistence_claim, 'not_proven');
});

test('falls back from a TypeError for any valid requested durability', () => {
  const calls = [];
  const db = { transaction(...args) { calls.push(args); if (args.length === 3) throw new TypeError('unsupported options'); return {}; } };
  const result = openCapabilityNegotiatedTransaction(db, { storeNames: ['acceptance_ids'], mode: 'readwrite', durability: 'strict' });
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], [['acceptance_ids'], 'readwrite']);
  assert.equal(result.transaction_options_supported, false);
  assert.equal(result.fallback_reason, 'transaction_options_typeerror');
});

test('does not mask non-capability transaction failures', () => {
  const error = Object.assign(new Error('database closing'), { name: 'InvalidStateError' });
  const db = { transaction() { throw error; } };
  assert.throws(
    () => openCapabilityNegotiatedTransaction(db, { storeNames: 'acceptance_ids', mode: 'readwrite', durability: 'strict' }),
    (caught) => caught === error
  );
});

test('rejects malformed scope, mode, and durability', () => {
  assert.throws(() => validateTransactionRequest({ storeNames: [] }), /store_names_invalid/);
  assert.throws(() => validateTransactionRequest({ storeNames: 'x', mode: 'versionchange' }), /mode_invalid/);
  assert.throws(() => validateTransactionRequest({ storeNames: 'x', durability: 'forever' }), /durability_invalid/);
});

test('reports unknown observed durability without upgrading it into proof', () => {
  const report = describeTransactionDurability({
    transaction: {},
    requested_durability: 'strict',
    transaction_options_supported: false,
    fallback_reason: 'transaction_options_typeerror'
  });
  assert.deepEqual(report, {
    requested_durability: 'strict',
    observed_durability: 'unknown',
    transaction_options_supported: false,
    fallback_reason: 'transaction_options_typeerror',
    persistence_claim: 'not_proven'
  });
});
