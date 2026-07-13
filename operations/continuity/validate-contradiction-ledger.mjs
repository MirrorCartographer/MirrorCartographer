import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved','resolved']);
const OBSERVATION_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const RESOLUTION_STATES = new Set(['unresolved','resolved','provisional']);
const EVIDENCE_STRENGTHS = new Set(['direct','strong','moderate','weak']);

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} must be a non-empty string`);
}

export function validateContradictionLedger(ledger) {
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) throw new Error('ledger must be an object');
  if (ledger.schema_version !== '1.0.0') throw new Error('unsupported schema_version');
  requireString(ledger.updated_at, 'updated_at');
  requireString(ledger.privacy_boundary, 'privacy_boundary');
  if (!Array.isArray(ledger.records)) throw new Error('records must be an array');

  const ids = new Set();
  for (const [index, record] of ledger.records.entries()) {
    const label = `records[${index}]`;
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`${label} must be an object`);
    if (!/^CON-[0-9]{3,}$/.test(record.id ?? '')) throw new Error(`${label}.id is invalid`);
    if (ids.has(record.id)) throw new Error(`${label}.id is duplicated`);
    ids.add(record.id);
    requireString(record.subject, `${label}.subject`);
    if (!CLAIM_STATES.has(record.state)) throw new Error(`${label}.state is invalid`);

    if (!Array.isArray(record.observations) || record.observations.length < 2) {
      throw new Error(`${label}.observations must contain at least two entries`);
    }
    const independentlyReferenced = new Set();
    for (const [observationIndex, observation] of record.observations.entries()) {
      const observationLabel = `${label}.observations[${observationIndex}]`;
      if (!OBSERVATION_STATES.has(observation?.status)) throw new Error(`${observationLabel}.status is invalid`);
      requireString(observation.statement, `${observationLabel}.statement`);
      requireString(observation.source_ref, `${observationLabel}.source_ref`);
      independentlyReferenced.add(observation.source_ref.trim());
    }
    if (independentlyReferenced.size < 2) {
      throw new Error(`${label} must reference at least two distinct observation sources`);
    }

    if (!record.resolution || typeof record.resolution !== 'object' || Array.isArray(record.resolution)) {
      throw new Error(`${label}.resolution must be an object`);
    }
    if (!RESOLUTION_STATES.has(record.resolution.status)) throw new Error(`${label}.resolution.status is invalid`);
    requireString(record.resolution.interpretation, `${label}.resolution.interpretation`);
    requireString(record.resolution.preservation_rule, `${label}.resolution.preservation_rule`);

    if (!Array.isArray(record.sources) || record.sources.length < 2) {
      throw new Error(`${label}.sources must contain at least two entries`);
    }
    const sourceIdentities = new Set();
    for (const [sourceIndex, source] of record.sources.entries()) {
      const sourceLabel = `${label}.sources[${sourceIndex}]`;
      requireString(source?.path, `${sourceLabel}.path`);
      requireString(source?.ref, `${sourceLabel}.ref`);
      if (source.ref.length < 7) throw new Error(`${sourceLabel}.ref is too short`);
      if (!EVIDENCE_STRENGTHS.has(source.evidence_strength)) throw new Error(`${sourceLabel}.evidence_strength is invalid`);
      sourceIdentities.add(`${source.path.trim()}@${source.ref.trim()}`);
    }
    if (sourceIdentities.size < 2) throw new Error(`${label} must contain at least two distinct sources`);

    requireString(record.claim_ceiling, `${label}.claim_ceiling`);
    requireString(record.review_route, `${label}.review_route`);
  }
  return { valid: true, record_count: ledger.records.length };
}

async function main() {
  const path = process.argv[2];
  if (!path) throw new Error('usage: node validate-contradiction-ledger.mjs <ledger.json>');
  const ledger = JSON.parse(await readFile(path, 'utf8'));
  process.stdout.write(`${JSON.stringify(validateContradictionLedger(ledger))}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
