#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateContinuityRelations } from '../../operations/continuity/validate-continuity-relations.mjs';

const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const KINDS = new Set(['operating_rule','queue_item','decision','artifact','commit','language_term','contradiction','unresolved_question','implementation_decision','continuity_model_decision','decision_history']);
const EVIDENCE = new Set(['primary_repository_source','corroborated_repository_sources','single_secondary_source','unverified','tested_repository_artifact','committed_source_with_unexecuted_tests','committed_source_with_local_deterministic_tests','committed_repository_state_and_commit_metadata']);
const PRIVACY = new Set(['public_repository_safe','restricted_reference_only','do_not_publish']);
const SOURCE_TYPES = new Set(['github_file','github_commit','public_document','private_chat_reference','uploaded_file_reference']);

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`${file}: invalid JSON: ${error.message}`); }
}

function validateRecord(record, locator) {
  const errors = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return [`${locator}: record must be an object`];
  }
  const req = ['id','kind','title','claim_state','evidence_strength','sources','summary','privacy','falsification_or_review_route'];
  for (const key of req) if (!(key in record)) errors.push(`${locator}: missing ${key}`);
  for (const key of ['title','summary','falsification_or_review_route']) {
    if (typeof record[key] !== 'string' || !record[key].trim()) {
      errors.push(`${locator}: ${key} must be a non-empty string`);
    }
  }
  if (!/^CM-\d{4}$/.test(record.id ?? '')) errors.push(`${locator}: invalid id ${record.id}`);
  if (!KINDS.has(record.kind)) errors.push(`${locator}: invalid kind ${record.kind}`);
  if (!CLAIM_STATES.has(record.claim_state)) errors.push(`${locator}: invalid claim_state ${record.claim_state}`);
  if (!EVIDENCE.has(record.evidence_strength)) errors.push(`${locator}: invalid evidence_strength ${record.evidence_strength}`);
  if (!PRIVACY.has(record.privacy)) errors.push(`${locator}: invalid privacy ${record.privacy}`);
  if (!Array.isArray(record.sources) || record.sources.length === 0) errors.push(`${locator}: sources must be non-empty`);
  else record.sources.forEach((source, i) => {
    const p = `${locator}.sources[${i}]`;
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      errors.push(`${p}: source must be an object`);
      return;
    }
    if (!SOURCE_TYPES.has(source.type)) errors.push(`${p}: invalid type ${source.type}`);
    if (typeof source.locator !== 'string' || !source.locator.trim()) errors.push(`${p}: locator must be a non-empty string`);
    if (typeof source.content_sha !== 'string' || !source.content_sha.trim()) errors.push(`${p}: content_sha must be a non-empty string`);
  });
  for (const relation of ['contradicts','supersedes']) {
    if (relation in record && !Array.isArray(record[relation])) {
      errors.push(`${locator}: ${relation} must be an array`);
    } else if (Array.isArray(record[relation])) {
      record[relation].forEach((target, i) => {
        if (typeof target !== 'string' || !/^CM-\\d{4}$/.test(target)) {
          errors.push(`${locator}.${relation}[${i}]: relation target must be a canonical CM record ID`);
        }
      });
    }
  }
  return errors;
}

function normalizedRecordDirs({ recordsDir, recordDirs }) {
  const dirs = recordDirs ?? (recordsDir ? [recordsDir] : []);
  return [...new Set(dirs.filter(Boolean).map(dir => path.resolve(dir)))];
}

export function validateContinuity({ indexFile, recordsDir, recordDirs }) {
  const index = readJson(indexFile);
  const entries = [];
  for (const [i, record] of (index.records ?? []).entries()) entries.push({ record, locator: `${indexFile}#records[${i}]` });

  const errors = [];
  const skippedLegacyFiles = [];
  const scannedRoots = normalizedRecordDirs({ recordsDir, recordDirs });
  for (const dir of scannedRoots) {
    if (!fs.existsSync(dir)) continue;
    const directoryNames = new Set(fs.readdirSync(dir));
    for (const name of [...directoryNames].filter(n => n.endsWith('.json')).sort()) {
      const file = path.join(dir, name);
      const raw = readJson(file);
      if (raw.legacy_id || raw.migration) {
        skippedLegacyFiles.push(file + ' (migrated legacy alias)');
        continue;
      }
      const records = raw.id && raw.claim_state ? [raw] : raw.record ? [raw.record]
        : Array.isArray(raw.records) ? raw.records
        : Array.isArray(raw.claims) ? raw.claims
        : [];
      if (records.length > 1 && records.every(record => record?.id && directoryNames.has(record.id + '.json'))) {
        skippedLegacyFiles.push(file + ' (superseded aggregate; individual CM files are canonical)');
        continue;
      }
      if (!records.length) {
        if (raw.record_id || raw.claim_states || raw.team === 'continuity_mining' || (raw.claims && !Array.isArray(raw.claims))) {
          skippedLegacyFiles.push(file);
          continue;
        }
        errors.push(`${file}: expected a canonical record, record wrapper, records array, or claims array`);
        continue;
      }
      records.forEach((record, i) => {
        const suffix = records.length === 1 ? '' : `#records[${i}]`;
        entries.push({ record, locator: file + suffix });
      });
    }
  }

  const byId = new Map();
  for (const entry of entries) {
    errors.push(...validateRecord(entry.record ?? {}, entry.locator));
    const id = entry.record?.id;
    if (!id) continue;
    if (byId.has(id)) errors.push(`${entry.locator}: duplicate id ${id}; first seen at ${byId.get(id).locator}`);
    else byId.set(id, entry);
  }

  for (const { record, locator } of entries) {
    for (const relation of ['contradicts','supersedes']) {
      for (const target of record?.[relation] ?? []) {
        if (target === record.id) errors.push(`${locator}: ${relation} cannot self-reference ${target}`);
        else if (!byId.has(target)) errors.push(`${locator}: ${relation} references missing ${target}`);
      }
    }
    if (record?.claim_state === 'superseded' && !(record.supersedes?.length)) {
      errors.push(`${locator}: superseded claim_state requires at least one supersedes target`);
    }
  }

  let relation_integrity = null;
  if (errors.length === 0) {
    try {
      relation_integrity = validateContinuityRelations({ records: entries.map(({ record }) => record) });
    } catch (error) {
      errors.push(`relation integrity: ${error.message}`);
    }
  }

  return {
    ok: errors.length === 0,
    records_checked: entries.length,
    scanned_roots: scannedRoots,
    skipped_legacy_files: skippedLegacyFiles,
    ids: [...byId.keys()].sort(),
    relation_integrity,
    errors
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? process.cwd();
  const result = validateContinuity({
    indexFile: path.join(root, 'operations/continuity/continuity-index.json'),
    recordDirs: [
      path.join(root, 'operations/continuity/records'),
      path.join(root, 'operations/continuity/memory')
    ]
  });
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
