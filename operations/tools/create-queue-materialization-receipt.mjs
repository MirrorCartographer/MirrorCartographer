import crypto from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;

function sha256(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function parseJson(raw, label) {
  if (typeof raw !== 'string') throw new Error(`${label} must be raw UTF-8 JSON text`);
  try { return JSON.parse(raw); } catch { throw new Error(`${label} must be valid JSON`); }
}

export function createQueueMaterializationReceipt({
  baseQueueRaw,
  manifestRaw,
  materializedRaw,
  sourceCommit,
  generatedAt
}) {
  const baseQueue = parseJson(baseQueueRaw, 'baseQueueRaw');
  const manifest = parseJson(manifestRaw, 'manifestRaw');
  const materialized = parseJson(materializedRaw, 'materializedRaw');

  if (!/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) throw new Error('sourceCommit must be a full 40-character git SHA');
  if (Number.isNaN(Date.parse(generatedAt ?? ''))) throw new Error('generatedAt must be an ISO-8601 timestamp');
  if (!SHA256.test(manifest.manifest_sha256 ?? '')) throw new Error('manifest must contain a valid manifest_sha256');
  if (materialized.manifest?.manifest_sha256 !== manifest.manifest_sha256) {
    throw new Error('materialized output is not bound to the supplied manifest');
  }
  if (typeof materialized.authoritative !== 'boolean') throw new Error('materialized output must declare authoritative as boolean');
  if (materialized.authoritative === true && manifest.authoritative !== true) {
    throw new Error('materialized output cannot be authoritative when manifest is not authoritative');
  }
  if (!Array.isArray(baseQueue.items)) throw new Error('base queue must contain items');

  return {
    schema_version: '1.0.0',
    receipt_type: 'queue_materialization_provenance',
    generated_at: generatedAt,
    source_commit: sourceCommit,
    subjects: {
      base_queue: { sha256: sha256(baseQueueRaw), item_count: baseQueue.items.length },
      update_manifest: { sha256: sha256(manifestRaw), declared_manifest_sha256: manifest.manifest_sha256, entry_count: manifest.entries?.length ?? null },
      materialized_queue: { sha256: sha256(materializedRaw), item_count: materialized.items?.length ?? null }
    },
    authority: {
      materialized_authoritative: materialized.authoritative,
      manifest_authoritative: manifest.authoritative === true,
      classification: materialized.authoritative ? 'authoritative_projection' : 'reproducible_noncanonical_projection'
    },
    claim_states: {
      observed: 'Exact base, manifest, and materialized bytes are digest-bound in this receipt.',
      inferred: 'Reproduction with identical bytes should produce identical subject digests.',
      proposed: 'Require this receipt before promoting a materialized projection into canonical queue state.',
      superseded: 'A manifest-bound output alone is sufficient provenance for canonical promotion.',
      unresolved: 'Independent repository enumeration and semantic truth of queue claims remain outside this receipt.'
    },
    mutation_performed: false,
    trust_limit: 'This receipt proves byte relationships and declared authority consistency; it does not prove repository completeness, signature authenticity, or claim truth.'
  };
}
