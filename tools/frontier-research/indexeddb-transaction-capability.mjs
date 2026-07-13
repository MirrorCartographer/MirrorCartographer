const VALID_DURABILITY = new Set(['default', 'strict', 'relaxed']);

export function validateTransactionRequest({ storeNames, mode = 'readonly', durability = 'default' } = {}) {
  const names = Array.isArray(storeNames) ? storeNames : [storeNames];
  if (!names.length || names.some((name) => typeof name !== 'string' || name.length === 0)) {
    throw new Error('indexeddb_store_names_invalid');
  }
  if (mode !== 'readonly' && mode !== 'readwrite') throw new Error('indexeddb_transaction_mode_invalid');
  if (!VALID_DURABILITY.has(durability)) throw new Error('indexeddb_durability_invalid');
  return { storeNames: names, mode, durability };
}

export function openCapabilityNegotiatedTransaction(db, {
  storeNames,
  mode = 'readonly',
  durability = 'default'
} = {}) {
  if (!db || typeof db.transaction !== 'function') throw new Error('indexeddb_database_invalid');
  const request = validateTransactionRequest({ storeNames, mode, durability });

  try {
    const transaction = db.transaction(request.storeNames, request.mode, { durability: request.durability });
    return {
      transaction,
      requested_durability: request.durability,
      transaction_options_supported: true,
      fallback_reason: null
    };
  } catch (error) {
    // Older engines may reject the third argument even though the two-argument
    // transaction form is valid. Retry only capability-shape failures; do not
    // hide lifecycle, scope, or state errors from the caller.
    if (!(error instanceof TypeError) && error?.name !== 'TypeError') throw error;
    const transaction = db.transaction(request.storeNames, request.mode);
    return {
      transaction,
      requested_durability: request.durability,
      transaction_options_supported: false,
      fallback_reason: 'transaction_options_typeerror'
    };
  }
}

export function describeTransactionDurability(negotiated) {
  if (!negotiated?.transaction) throw new Error('indexeddb_transaction_missing');
  return {
    requested_durability: negotiated.requested_durability,
    observed_durability: negotiated.transaction.durability ?? 'unknown',
    transaction_options_supported: negotiated.transaction_options_supported,
    fallback_reason: negotiated.fallback_reason,
    persistence_claim: 'not_proven'
  };
}
