import fs from 'node:fs';
import { validateDelta } from './validate-continuity-delta.mjs';

export function mergeContinuityDelta(base, delta, baseContentSha) {
  const baseClone = structuredClone(base);
  const deltaClone = structuredClone(delta);
  baseClone.__content_sha = baseContentSha;
  const validation = validateDelta(baseClone, deltaClone);
  delete baseClone.__content_sha;
  if (!validation.valid) {
    const error = new Error('continuity delta rejected');
    error.code = 'CONTINUITY_DELTA_INVALID';
    error.validation = validation;
    throw error;
  }
  const existingIds = new Set((baseClone.records ?? []).map((record) => record.id));
  const additions = [...(deltaClone.records ?? [])]
    .filter((record) => !existingIds.has(record.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  const merged = {
    ...baseClone,
    generated_at: deltaClone.generated_at ?? baseClone.generated_at,
    records: [...(baseClone.records ?? []), ...additions],
    merge_history: [
      ...(baseClone.merge_history ?? []),
      {
        base_content_sha: baseContentSha,
        delta_generated_at: deltaClone.generated_at ?? null,
        delta_base_path: deltaClone.base_index?.path ?? null,
        appended_record_ids: additions.map((record) => record.id),
        historical_artifact_retained: deltaClone.supersedes_artifact ?? null
      }
    ]
  };
  return { merged, validation, appended_record_ids: additions.map((record) => record.id) };
}

if (process.argv[1]?.endsWith('merge-continuity-delta.mjs')) {
  const [basePath, deltaPath, baseSha, outputPath] = process.argv.slice(2);
  if (!basePath || !deltaPath || !baseSha || !outputPath) {
    console.error('usage: node merge-continuity-delta.mjs <base-index.json> <delta.json> <base-content-sha> <output.json>');
    process.exit(2);
  }
  try {
    const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    const delta = JSON.parse(fs.readFileSync(deltaPath, 'utf8'));
    const result = mergeContinuityDelta(base, delta, baseSha);
    fs.writeFileSync(outputPath, `${JSON.stringify(result.merged, null, 2)}\n`);
    console.log(JSON.stringify({ valid: true, appended_record_ids: result.appended_record_ids, output: outputPath }, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ valid: false, code: error.code ?? 'MERGE_FAILED', validation: error.validation ?? null, message: error.message }, null, 2));
    process.exit(1);
  }
}
