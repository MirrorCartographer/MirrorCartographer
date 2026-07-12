import { validateHandoffPromotion } from './handoff-promotion-validator.mjs';

const EXECUTABLE = new Set(['queued', 'active', 'verified']);

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function uniqueIndex(items, key, label) {
  const index = new Map();
  for (const item of items) {
    const value = item?.[key];
    requireValue(typeof value === 'string' && value.length > 0, `${label} missing ${key}`);
    requireValue(!index.has(value), `duplicate ${label}: ${value}`);
    index.set(value, item);
  }
  return index;
}

function sameArray(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
}

export function validateQueuePromotionGate({ queue, promotions, queueBlobSha }) {
  requireValue(queue && Array.isArray(queue.items), 'queue.items must be an array');
  requireValue(Array.isArray(promotions), 'promotions must be an array');
  requireValue(/^[0-9a-f]{40}$/.test(queueBlobSha), 'invalid queue blob sha');

  const queueById = uniqueIndex(queue.items, 'id', 'queue item');
  uniqueIndex(promotions, 'promotion_id', 'promotion');
  const targets = new Set();
  const results = [];

  for (const promotion of promotions) {
    const source = queueById.get(promotion.source_item?.queue_id);
    requireValue(source, `promotion source missing: ${promotion.source_item?.queue_id}`);
    requireValue(source.status === promotion.source_item.terminal_status, `source status mismatch: ${source.id}`);
    requireValue(typeof source.handoff === 'string' && source.handoff.length > 0, `source handoff missing: ${source.id}`);
    requireValue(promotion.source_item.source_blob_sha === queueBlobSha, `source blob mismatch: ${promotion.promotion_id}`);

    const result = validateHandoffPromotion(promotion, {
      expectedHandoffText: source.handoff,
      receivingOwner: promotion.new_work.owner,
    });

    requireValue(!targets.has(result.new_queue_id), `multiple promotions target: ${result.new_queue_id}`);
    targets.add(result.new_queue_id);
    const queueItem = queueById.get(result.new_queue_id);

    if (result.executable) {
      requireValue(queueItem, `authorized promotion missing queue item: ${result.new_queue_id}`);
      requireValue(EXECUTABLE.has(queueItem.status), `authorized promotion is not executable: ${result.new_queue_id}`);
      requireValue(queueItem.owner === promotion.new_work.owner, `owner mismatch: ${result.new_queue_id}`);
      requireValue(queueItem.action === promotion.new_work.action, `action mismatch: ${result.new_queue_id}`);
      requireValue(queueItem.priority === promotion.new_work.priority, `priority mismatch: ${result.new_queue_id}`);
      requireValue(sameArray(queueItem.required_evidence, promotion.new_work.required_evidence), `evidence mismatch: ${result.new_queue_id}`);
    } else {
      requireValue(!queueItem || !EXECUTABLE.has(queueItem.status), `unauthorized promotion is executable: ${result.new_queue_id}`);
    }

    results.push({ promotion_id: result.promotion_id, source_queue_id: result.source_queue_id, new_queue_id: result.new_queue_id, executable: result.executable, canonical_queue_match: Boolean(queueItem) });
  }

  return { valid: true, queue_blob_sha: queueBlobSha, promotions_checked: results.length, executable_promotions: results.filter(x => x.executable).length, results };
}
