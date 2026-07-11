import crypto from 'node:crypto';

const STATUS_ALIASES = { blocked_external_configuration: 'blocked' };
const STATUS_CLASSES = new Set(['queued','active','blocked','completed','superseded','unknown']);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(canonical(value), null, 2) + '\n';
}

function normalizeStatus(status) {
  const normalized = STATUS_ALIASES[status] ?? status ?? 'unknown';
  return STATUS_CLASSES.has(normalized) ? normalized : 'unknown';
}

function effectiveTimestamp(record) {
  return record.completed_at ?? record.updated_at ?? record.created_at ?? record.git_commit_committer_time ?? null;
}

function provenance(record) {
  return {
    source_path: record.__source_path ?? null,
    source_blob_sha: record.__source_blob_sha ?? null,
    source_commit_sha: record.__source_commit_sha ?? null,
    effective_timestamp: effectiveTimestamp(record)
  };
}

function historyRecord(item, sourceKind) {
  return {
    item_id: item.item_id ?? item.id,
    owner: item.owner,
    normalized_status: normalizeStatus(item.status),
    original_status: item.status ?? 'unknown',
    claim_state: item.claim_state ?? 'observed',
    action: item.action ?? null,
    handoff: item.handoff ?? null,
    source_kind: sourceKind,
    ...provenance(item)
  };
}

function compareRecords(a, b) {
  const at = a.effective_timestamp;
  const bt = b.effective_timestamp;
  if (at && bt && at !== bt) return at < bt ? -1 : 1;
  if (a.source_commit_sha && b.source_commit_sha && a.source_commit_sha === b.source_commit_sha) {
    return String(a.source_path).localeCompare(String(b.source_path));
  }
  return 0;
}

export function reconcileQueue({ baseline, updates }) {
  const history = [];
  const validation_errors = [];
  const conflicts = [];
  const provenance_edges = [];
  const baselineById = new Map();

  for (const item of baseline.items ?? []) {
    const id = item.id;
    baselineById.set(id, item);
    history.push(historyRecord(item, 'baseline'));
  }

  for (const update of updates ?? []) {
    const id = update.item_id ?? update.id;
    const base = baselineById.get(id);
    if (!id || !update.owner) {
      validation_errors.push({ type: 'malformed_update', source_path: update.__source_path ?? null });
      continue;
    }
    if (base && base.owner !== update.owner) {
      validation_errors.push({
        type: 'owner_mismatch', item_id: id, expected_owner: base.owner, observed_owner: update.owner,
        source_path: update.__source_path ?? null
      });
      continue;
    }
    history.push(historyRecord(update, 'owner_update'));
  }

  const grouped = new Map();
  for (const record of history) {
    if (!grouped.has(record.item_id)) grouped.set(record.item_id, []);
    grouped.get(record.item_id).push(record);
  }

  const current_items = [];
  for (const [item_id, records] of [...grouped.entries()].sort(([a],[b]) => a.localeCompare(b))) {
    records.sort((a,b) => compareRecords(a,b) || String(a.source_path).localeCompare(String(b.source_path)));
    let current = records[0];
    let unresolved = false;
    for (let i = 1; i < records.length; i++) {
      const next = records[i];
      const cmp = compareRecords(current, next);
      if (cmp === 0 && current.normalized_status !== next.normalized_status) {
        conflicts.push({
          item_id,
          conflict_type: 'incomparable_status_updates',
          competing_records: [current.source_path, next.source_path],
          reason_unresolved: 'No decisive timestamp or shared commit identity orders the conflicting states.',
          review_route: 'Inspect commit ancestry or add an explicit later owner-scoped update.'
        });
        unresolved = true;
        break;
      }
      if (cmp <= 0) {
        provenance_edges.push({ from: current.source_path, to: next.source_path, relation: 'superseded_by' });
        current = next;
      }
    }
    if (!unresolved) current_items.push({ ...current });
  }

  history.sort((a,b) => a.item_id.localeCompare(b.item_id) || compareRecords(a,b) || String(a.source_path).localeCompare(String(b.source_path)));
  conflicts.sort((a,b) => a.item_id.localeCompare(b.item_id));
  validation_errors.sort((a,b) => String(a.source_path).localeCompare(String(b.source_path)));
  provenance_edges.sort((a,b) => String(a.from).localeCompare(String(b.from)) || String(a.to).localeCompare(String(b.to)));

  const output = { schema_version: '1.0.0', current_items, history, provenance_edges, validation_errors, conflicts };
  return { ...output, canonical_sha256: crypto.createHash('sha256').update(stableStringify(output)).digest('hex') };
}
