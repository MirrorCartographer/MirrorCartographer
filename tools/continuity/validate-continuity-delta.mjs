import fs from 'node:fs';

export const ALLOWED_KINDS = new Set(['operating_rule','queue_item','decision','artifact','commit','language_term','contradiction','unresolved_question']);
export const ALLOWED_STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
export const ALLOWED_PRIVACY = new Set(['public_repository_safe','restricted_reference_only','do_not_publish']);
export const FORBIDDEN_PATTERNS = [/raw private chat/i,/health or pet-health details/i,/credential|token|password/i,/private contact/i];

export function validateDelta(base, delta) {
  const errors = [];
  const warnings = [];
  const baseIds = new Set((base.records ?? []).map(r => r.id));
  const seen = new Set(baseIds);
  const deltaIds = new Set((delta.records ?? []).map(r => r.id));
  if (delta.base_index?.content_sha !== base.__content_sha) errors.push('base_index.content_sha does not match supplied base index blob');
  for (const [i, r] of (delta.records ?? []).entries()) {
    const p = `records[${i}]`;
    if (!/^CM-\d{4}$/.test(r.id ?? '')) errors.push(`${p}.id invalid`);
    if (seen.has(r.id)) errors.push(`${p}.id duplicates existing record ${r.id}`); else seen.add(r.id);
    if (!ALLOWED_KINDS.has(r.kind)) errors.push(`${p}.kind unsupported: ${r.kind}`);
    if (!ALLOWED_STATES.has(r.claim_state)) errors.push(`${p}.claim_state unsupported: ${r.claim_state}`);
    if (!ALLOWED_PRIVACY.has(r.privacy)) errors.push(`${p}.privacy unsupported: ${r.privacy}`);
    if (!Array.isArray(r.sources) || r.sources.length === 0) errors.push(`${p}.sources must be non-empty`);
    for (const [j, s] of (r.sources ?? []).entries()) {
      if (!s.locator) errors.push(`${p}.sources[${j}].locator missing`);
      if (!s.content_sha) errors.push(`${p}.sources[${j}].content_sha missing`);
    }
    for (const field of ['contradicts','supersedes']) {
      for (const ref of (r[field] ?? [])) {
        if (!baseIds.has(ref) && !deltaIds.has(ref)) errors.push(`${p}.${field} references unknown record ${ref}`);
      }
    }
    const text = JSON.stringify(r);
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(text) && r.privacy === 'public_repository_safe') warnings.push(`${p} contains privacy-boundary language requiring review`);
    }
  }
  const ordered = [...(delta.records ?? [])].map(r => r.id);
  const sorted = [...ordered].sort();
  if (ordered.join('\0') !== sorted.join('\0')) errors.push('records are not deterministically ordered by id');
  return {valid: errors.length === 0, errors, warnings};
}

if (process.argv[1] && process.argv[1].endsWith('validate-continuity-delta.mjs')) {
  const [basePath, deltaPath, baseSha] = process.argv.slice(2);
  if (!basePath || !deltaPath || !baseSha) {
    console.error('usage: node validate-continuity-delta.mjs <base-index.json> <delta.json> <base-content-sha>');
    process.exit(2);
  }
  const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
  const delta = JSON.parse(fs.readFileSync(deltaPath, 'utf8'));
  base.__content_sha = baseSha;
  const result = validateDelta(base, delta);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.valid ? 0 : 1);
}
