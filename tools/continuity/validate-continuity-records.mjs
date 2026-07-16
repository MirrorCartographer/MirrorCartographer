#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateContinuityRelations } from '../../operations/continuity/validate-continuity-relations.mjs';

const CLAIM_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const KINDS = new Set(['operating_rule','queue_item','decision','artifact','commit','language_term','contradiction','unresolved_question']);
const EVIDENCE = new Set(['primary_repository_source','corroborated_repository_sources','single_secondary_source','unverified']);
const PRIVACY = new Set(['public_repository_safe','restricted_reference_only','do_not_publish']);
const SOURCE_TYPES = new Set(['github_file','github_commit','public_document','private_chat_reference','uploaded_file_reference']);

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) { throw new Error(`${file}: invalid JSON: ${error.message}`); }
}

function validateRecord(record, locator) {
  const errors = [];
  const req = ['id','kind','title','claim_state','evidence_strength','sources','summary','privacy','falsification_or_review_route'];
  for (const key of req) if (!(key in record)) errors.push(`${locator}: missing ${key}`);
  if (!/^CM-\d{4}$/.test(record.id ?? '')) errors.push(`${locator}: invalid id ${record.id}`);
  if (!KINDS.has(record.kind)) errors.push(`${locator}: invalid kind ${record.kind}`);
  if (!CLAIM_STATES.has(record.claim_state)) errors.push(`${locator}: invalid claim_state ${record.claim_state}`);
  if (!EVIDENCE.has(record.evidence_strength)) errors.push(`${locator}: invalid evidence_strength ${record.evidence_strength}`);
  if (!PRIVACY.has(record.privacy)) errors.push(`${locator}: invalid privacy ${record.privacy}`);
  if (!Array.isArray(record.sources) || record.sources.length === 0) errors.push(`${locator}: sources must be non-empty`);
  else record.sources.forEach((source, i) => {
    const p = `${locator}.sources[${i}]`;
    if (!SOURCE_TYPES.has(source.type)) errors.push(`${p}: invalid type ${source.type}`);
    if (!source.locator || typeof source.locator !== 'string') errors.push(`${p}: missing locator`);
    if (!('content_sha' in source)) errors.push(`${p}: missing content_sha`);
  });
  for (const relation of ['contradicts','supersedes']) {
    if (relation in record && !Array.isArray(record[relation])) errors.push(`${locator}: ${relation} must be an array`);
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

  const scannedRoots = normalizedRecordDirs({ recordsDir, recordDirs });
  for (const dir of scannedRoots) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.json')).sort()) {
      const file = path.join(dir, name);
      const raw = readJson(file);
      entries.push({ record: raw.id ? raw : raw.record, locator: file });
    }
  }

  const errors = [];
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
