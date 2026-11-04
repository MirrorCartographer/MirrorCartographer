/**
 * Provenance-native neurological research ledger.
 * Stores claims and their lineage; it does not infer diagnoses or treatment effects.
 */
export const CLAIM_TYPES = new Set(["source_fact","observation","hypothesis","interpretation","decision","verified_result","unknown","contradiction"]);
export const STATUSES = new Set(["verified","implemented-unverified","hypothesis","superseded","disputed","unknown"]);
export const ORIGINS = new Set(["user-authored","assistant-generated","tool-observed","external-source","repository-record"]);
const required = ["id","type","status","text","origin","authorship","source","created_at","confidence","uncertainty"];
const clone = value => JSON.parse(JSON.stringify(value));
const nonempty = value => typeof value === "string" && value.trim().length > 0;
export function validateRecord(record, records = []) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["record must be an object"];
  for (const key of required) if (!(key in record)) errors.push("missing " + key);
  if (!nonempty(record.id)) errors.push("id must be non-empty");
  if (!CLAIM_TYPES.has(record.type)) errors.push("invalid type");
  if (!STATUSES.has(record.status)) errors.push("invalid status");
  if (!ORIGINS.has(record.origin)) errors.push("invalid origin");
  if (!["user-authored","assistant-generated","unverified"].includes(record.authorship)) errors.push("invalid authorship");
  if (!nonempty(record.text)) errors.push("text must be non-empty");
  if (!Array.isArray(record.source) || record.source.length === 0 || record.source.some(x => !nonempty(x))) errors.push("source must contain at least one source locator");
  if (!nonempty(record.created_at) || Number.isNaN(Date.parse(record.created_at))) errors.push("created_at must be an ISO-compatible date");
  if (!nonempty(record.uncertainty)) errors.push("uncertainty must explicitly describe limits or say 'not assessed'");
  if (record.confidence !== null && (!Number.isFinite(record.confidence) || record.confidence < 0 || record.confidence > 1)) errors.push("confidence must be null or between 0 and 1");
  if (record.origin === "assistant-generated" && record.authorship !== "assistant-generated") errors.push("assistant-generated origin requires assistant-generated authorship");
  if (record.origin === "user-authored" && record.authorship !== "user-authored") errors.push("user-authored origin requires user-authored authorship");
  if (record.authorship === "assistant-generated" && record.origin !== "assistant-generated") errors.push("assistant-generated authorship requires assistant-generated origin");
  if (record.tags !== undefined && (!Array.isArray(record.tags) || record.tags.some(tag => !nonempty(tag)))) errors.push("tags must be an array of non-empty strings");
  for (const field of ["method","population"]) if (record[field] !== undefined && record[field] !== null && typeof record[field] !== "string") errors.push(field + " must be text or null");
  if (record.decision_link !== undefined && record.decision_link !== null && !nonempty(record.decision_link)) errors.push("decision_link must be non-empty text or null");
  for (const relation of ["supersedes","contradicts","supports","derived_from"]) {
    if (record[relation] !== undefined && (!Array.isArray(record[relation]) || record[relation].some(x => !nonempty(x)))) errors.push(relation + " must be an array of record IDs");
    for (const id of record[relation] || []) {
      if (id === record.id) errors.push(relation + " cannot point to itself");
      if (!records.some(item => item.id === id)) errors.push(relation + " references missing record " + id);
    }
  }
  return errors;
}
export function createRecord(input, records = []) {
  const record = {
    id: input.id,
    type: input.type,
    status: input.status ?? "hypothesis",
    text: input.text,
    origin: input.origin ?? "repository-record",
    authorship: input.authorship ?? "unverified",
    source: Array.isArray(input.source) ? [...input.source] : [],
    created_at: input.created_at ?? new Date().toISOString(),
    confidence: input.confidence ?? null,
    uncertainty: input.uncertainty ?? "not assessed",
    method: input.method ?? null,
    population: input.population ?? null,
    tags: Array.isArray(input.tags) ? [...input.tags] : [],
    supports: Array.isArray(input.supports) ? [...input.supports] : [],
    contradicts: Array.isArray(input.contradicts) ? [...input.contradicts] : [],
    supersedes: Array.isArray(input.supersedes) ? [...input.supersedes] : [],
    derived_from: Array.isArray(input.derived_from) ? [...input.derived_from] : [],
    decision_link: input.decision_link ?? null
  };
  const errors = validateRecord(record, records);
  if (errors.length) throw new TypeError("Invalid provenance record: " + errors.join("; "));
  return record;
}
export function addRecord(ledger, input) {
  const record = createRecord(input, ledger);
  if (ledger.some(item => item.id === record.id)) throw new Error("duplicate record id: " + record.id);
  const errors = validateRecord(record, ledger);
  if (errors.length) throw new TypeError(errors.join("; "));
  const next = clone(ledger);
  next.push(record);
  return next;
}
export function auditLedger(ledger) {
  const errors = [], warnings = [];
  if (!Array.isArray(ledger)) return { valid:false, errors:["ledger must be an array"], warnings:[], counts:{} };
  const ids = new Set();
  for (const record of ledger) {
    if (ids.has(record?.id)) errors.push("duplicate id: " + record.id);
    ids.add(record?.id);
    errors.push(...validateRecord(record, ledger).map(error => (record?.id || "unknown") + ": " + error));
  }
  for (const record of ledger) {
    for (const relation of ["supersedes","contradicts","supports","derived_from"]) {
      for (const id of record?.[relation] || []) if (!ids.has(id)) errors.push((record.id || "unknown") + ": dangling " + relation + " -> " + id);
    }
    if (record?.type === "hypothesis" && record?.status === "verified") warnings.push(record.id + ": hypothesis is marked verified; verify the underlying claim type and evidence");
    if (record?.type === "unknown" && record?.confidence !== null) warnings.push(record.id + ": unknown record carries numeric confidence; explain what the confidence refers to");
  }
  const visiting = new Set(), visited = new Set();
  const visitSupersession = id => {
    if (visiting.has(id)) { errors.push("supersession cycle detected at " + id); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const record = ledger.find(item => item.id === id);
    for (const priorId of record?.supersedes || []) visitSupersession(priorId);
    visiting.delete(id); visited.add(id);
  };
  for (const record of ledger) visitSupersession(record.id);
  const counts = Object.fromEntries([...CLAIM_TYPES].map(type => [type, ledger.filter(x => x.type === type).length]));
  return { valid:errors.length===0, errors, warnings, counts };
}
export function effectiveStatus(ledger, id) {
  const record = ledger.find(item => item.id === id);
  if (!record) return null;
  if (ledger.some(item => (item.supersedes || []).includes(id))) return "superseded";
  return record.status;
}
export function lineage(ledger, id) {
  const record = ledger.find(item => item.id === id);
  if (!record) return { found:false, record:null, incoming:[], outgoing:[] };
  const incoming = [], outgoing = [];
  for (const item of ledger) for (const relation of ["supports","contradicts","supersedes","derived_from"]) {
    if ((item[relation] || []).includes(id)) incoming.push({id:item.id, relation, text:item.text});
    if ((record[relation] || []).includes(item.id)) outgoing.push({id:item.id, relation, text:item.text});
  }
  return { found:true, record:clone(record), incoming, outgoing };
}
export function searchLedger(ledger, query) {
  const terms = String(query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return clone(ledger);
  return ledger.filter(record => terms.every(term => [record.text,record.id,record.type,...(record.tags||[]),...(record.source||[])].join(" ").toLowerCase().includes(term))).map(clone);
}
export function exportLedger(ledger) {
  const audit = auditLedger(ledger);
  if (!audit.valid) throw new Error("Cannot export invalid ledger: " + audit.errors.join("; "));
  return JSON.stringify({schema:"mc-neurology-provenance",schema_version:1,exported_at:new Date().toISOString(),records:ledger},null,2);
}
export function importLedger(payload) {
  const parsed = typeof payload === "string" ? JSON.parse(payload) : clone(payload);
  if (parsed?.schema !== "mc-neurology-provenance" || parsed?.schema_version !== 1 || !Array.isArray(parsed.records)) throw new TypeError("Unsupported provenance export format");
  const audit = auditLedger(parsed.records);
  if (!audit.valid) throw new TypeError("Imported ledger failed audit: " + audit.errors.join("; "));
  return clone(parsed.records);
}
