import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { assessCanonicalQueueLag, canonicalJson } from './canonical-queue-lag.mjs';

export function sha256Text(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function buildCanonicalChangeProposal({ canonicalText, updates }) {
  const errors = [];
  let canonical;
  try { canonical = JSON.parse(canonicalText); } catch { return { valid: false, errors: ['canonical-json-invalid'] }; }
  if (!Array.isArray(updates)) return { valid: false, errors: ['updates-array-required'] };

  const parsed = [];
  const sources = [];
  for (const entry of updates) {
    if (!entry || typeof entry.path !== 'string' || typeof entry.text !== 'string') {
      errors.push('invalid-update-entry');
      continue;
    }
    let record;
    try { record = JSON.parse(entry.text); } catch { errors.push(`invalid-json:${entry.path}`); continue; }
    parsed.push(record);
    sources.push({ path: entry.path, sha256: sha256Text(entry.text), queue_item: record?.queue_item?.id ?? null });
  }

  const lag = assessCanonicalQueueLag(canonical, parsed);
  errors.push(...(lag.errors ?? []));
  const proposalItems = [...lag.missing, ...lag.divergent].map(({ id, owner, update_status }) => {
    const candidates = parsed.filter((record) => record?.queue_item?.id === id).map((record) => record.queue_item);
    return { id, owner, proposed_status: update_status ?? candidates[0]?.status, candidates };
  });

  const proposalCore = {
    schema_version: '1.0.0',
    type: 'canonical-queue-change-proposal',
    canonical_source: { path: 'operations/ACTIVE_QUEUE.json', sha256: sha256Text(canonicalText) },
    update_sources: sources.sort((a,b) => a.path.localeCompare(b.path)),
    lag_state: lag.state,
    proposed_items: proposalItems.sort((a,b) => a.id.localeCompare(b.id)),
    requires_manual_review: true,
    reviewer_identity_required: true,
    post_application_verification_required: true,
    adoption_authorized: false,
    proves_peer_execution: false
  };
  return {
    valid: errors.length === 0 && lag.valid,
    errors,
    lag,
    proposal: { ...proposalCore, proposal_sha256: sha256Text(canonicalJson(proposalCore)) }
  };
}

export async function inventoryQueueUpdates({ canonicalPath, updatesDirectory }) {
  const canonicalText = await readFile(canonicalPath, 'utf8');
  const names = (await readdir(updatesDirectory)).filter((name) => name.endsWith('.json')).sort();
  const updates = await Promise.all(names.map(async (name) => ({ path: join('operations/queue-updates', basename(name)), text: await readFile(join(updatesDirectory, name), 'utf8') })));
  return buildCanonicalChangeProposal({ canonicalText, updates });
}
