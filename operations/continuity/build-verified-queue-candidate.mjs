import { materializeQueue, sha256Json } from './queue-state-materializer.mjs';
import { verifyQueueUpdateReferences } from './queue-reference-verifier.mjs';

function requireArray(value, name) {
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function buildVerifiedQueueCandidate({
  baseline,
  updates,
  inventories,
  baselinePath = 'operations/ACTIVE_QUEUE.json',
  updatePaths = []
}) {
  requireArray(updates, 'updates');
  requireArray(inventories, 'inventories');
  if (updates.length !== inventories.length) {
    throw new Error('inventories length must match updates length');
  }
  if (updatePaths.length && updatePaths.length !== updates.length) {
    throw new Error('updatePaths length must match updates length');
  }

  const acceptedUpdates = [];
  const acceptedPaths = [];
  const verification = [];
  const rejected = [];

  for (let index = 0; index < updates.length; index += 1) {
    const update = updates[index];
    const path = updatePaths[index] ?? `update:${index}`;
    const result = verifyQueueUpdateReferences(update, inventories[index]);
    const record = {
      path,
      item_id: update?.item_id ?? null,
      update_digest_sha256: sha256Json(update),
      inventory_digest_sha256: sha256Json(inventories[index]),
      result
    };
    verification.push(record);

    if (!result.verified) {
      rejected.push({
        path,
        item_id: update?.item_id ?? null,
        code: result.code,
        detail: result.detail
      });
      continue;
    }

    acceptedUpdates.push(update);
    acceptedPaths.push(path);
  }

  const candidate = materializeQueue({
    baseline,
    updates: acceptedUpdates,
    baselinePath,
    updatePaths: acceptedPaths
  });

  return stable({
    schema_version: '1.0.0',
    claim_ceiling: 'verified-reference-candidate-compaction-only',
    baseline: candidate.baseline,
    totals: {
      supplied_updates: updates.length,
      accepted_updates: acceptedUpdates.length,
      rejected_updates: rejected.length
    },
    candidate,
    verification,
    invalid_reference_report: rejected,
    review_required: true,
    limits: [
      'Reference acceptance proves only authenticated inventory binding, not semantic correctness.',
      'Rejected updates are excluded from the candidate and preserved in the invalid-reference report.',
      'The candidate must not replace operations/ACTIVE_QUEUE.json without explicit reviewed compaction.',
      'Does not prove deployments, tests, peer execution, private-source claims, or human outcomes.'
    ]
  });
}
