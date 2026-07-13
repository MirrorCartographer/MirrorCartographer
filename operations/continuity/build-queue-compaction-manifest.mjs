import crypto from 'node:crypto';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
};

export function buildQueueCompactionManifest({ baselineBytes, candidates, decisions, proposedQueue }) {
  if (typeof baselineBytes !== 'string' || baselineBytes.length === 0) throw new Error('baselineBytes required');
  if (!Array.isArray(candidates) || candidates.length === 0) throw new Error('candidates required');
  if (!Array.isArray(decisions) || decisions.length !== candidates.length) throw new Error('one decision per candidate required');
  if (!proposedQueue || typeof proposedQueue !== 'object') throw new Error('proposedQueue required');

  const allowed = new Set(['accepted', 'rejected', 'deferred']);
  const byLocator = new Map();
  for (const candidate of candidates) {
    if (!candidate?.locator || typeof candidate.bytes !== 'string') throw new Error('candidate locator and bytes required');
    if (byLocator.has(candidate.locator)) throw new Error(`duplicate candidate: ${candidate.locator}`);
    byLocator.set(candidate.locator, candidate);
  }

  const seen = new Set();
  const classified = decisions.map(decision => {
    if (!allowed.has(decision?.disposition)) throw new Error('invalid disposition');
    if (!byLocator.has(decision.locator)) throw new Error(`unknown candidate: ${decision.locator}`);
    if (seen.has(decision.locator)) throw new Error(`duplicate decision: ${decision.locator}`);
    seen.add(decision.locator);
    if (!decision.rationale || !decision.reviewer) throw new Error('rationale and reviewer required');
    const candidate = byLocator.get(decision.locator);
    return {
      locator: decision.locator,
      digest_sha256: sha256(candidate.bytes),
      disposition: decision.disposition,
      rationale: decision.rationale,
      reviewer: decision.reviewer
    };
  });

  if (seen.size !== candidates.length) throw new Error('unclassified candidate');

  const manifest = {
    schema_version: '1.0.0',
    baseline: { locator: 'operations/ACTIVE_QUEUE.json', digest_sha256: sha256(baselineBytes) },
    candidates: classified.sort((a, b) => a.locator.localeCompare(b.locator)),
    proposed_result: {
      locator: 'operations/ACTIVE_QUEUE.json',
      digest_sha256: sha256(stable(proposedQueue)),
      mutation_performed: false
    },
    preservation_rule: 'Candidate artifacts remain immutable historical evidence regardless of disposition.',
    review_gate: 'Canonical mutation requires a separate reviewed commit whose input digests match this manifest.'
  };
  return { ...manifest, manifest_digest_sha256: sha256(stable(manifest)) };
}
