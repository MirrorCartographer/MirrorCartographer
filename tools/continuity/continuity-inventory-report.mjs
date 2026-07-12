import { loadContinuityQueueEntries } from './queue-lineage-loader.mjs';
import { detectQueueLineageForks } from './queue-lineage-fork-detector.mjs';

function countBy(records, field) {
  return records.reduce((counts, record) => {
    const key = record[field] ?? 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildContinuityInventoryReport(entries, generatedAt = null) {
  const loaded = loadContinuityQueueEntries(entries);
  const forkReport = detectQueueLineageForks(loaded.records);
  const violations = [...loaded.violations, ...forkReport.missing_dependencies, ...forkReport.malformed];

  return {
    schema_version: '1.0.0',
    report_type: 'continuity_queue_inventory',
    generated_at: generatedAt,
    valid: loaded.errors.length === 0 && violations.length === 0,
    acceptance: {
      history_preserved: true,
      no_branch_collapsed: true,
      single_current_head_required: false,
    },
    summary: {
      entry_count: entries.length,
      continuity_record_count: loaded.records.length,
      status_counts: countBy(loaded.records, 'status'),
      owner_counts: countBy(loaded.records, 'owner'),
      heads: forkReport.heads,
      fork_count: forkReport.forks.length,
      error_count: loaded.errors.length,
      violation_count: violations.length,
    },
    records: loaded.records,
    forks: forkReport.forks,
    errors: loaded.errors,
    violations,
    interpretation: forkReport.forks.length > 0
      ? 'Historical forks are retained as unresolved evidence. Reconciliation requires a later record that names every predecessor head; this report does not rewrite history.'
      : 'No historical fork was detected in the supplied inventory. This does not prove undiscovered repository records do not exist.',
  };
}
