const ORDER = [
  'activation_observed',
  'context_running',
  'render_advancing',
  'route_bound',
  'physical_output_observed',
  'human_audibility_reported'
];
const STATES = new Set(['observed','inferred','proposed','superseded','unresolved']);
const FORBIDDEN = /\b(audio works|sound works|audio fixed|sound fixed)\b/i;

export function validateAudioClaimPacket(packet) {
  const errors = [];
  if (!packet || typeof packet !== 'object' || Array.isArray(packet)) return { valid:false, errors:['packet must be an object'] };
  if (!Array.isArray(packet.claims) || packet.claims.length === 0) errors.push('claims must be a non-empty array');
  if (FORBIDDEN.test(String(packet.summary ?? ''))) errors.push('summary uses an unqualified collapsed audio-success phrase');
  const seen = new Set();
  for (const [i, claim] of (packet.claims ?? []).entries()) {
    const p = `claims[${i}]`;
    if (!ORDER.includes(claim.layer)) errors.push(`${p}.layer is not in the controlled vocabulary`);
    if (seen.has(claim.layer)) errors.push(`${p}.layer duplicates an earlier layer`);
    seen.add(claim.layer);
    if (!STATES.has(claim.claim_state)) errors.push(`${p}.claim_state is invalid`);
    if (!claim.source || typeof claim.source !== 'object') errors.push(`${p}.source is required`);
    if (!claim.observed_at || Number.isNaN(Date.parse(claim.observed_at))) errors.push(`${p}.observed_at must be an ISO timestamp`);
    if (!claim.environment || typeof claim.environment !== 'object') errors.push(`${p}.environment is required`);
    if (!claim.falsification_route || typeof claim.falsification_route !== 'string') errors.push(`${p}.falsification_route is required`);
    if (FORBIDDEN.test(String(claim.statement ?? ''))) errors.push(`${p}.statement uses an unqualified collapsed audio-success phrase`);
  }
  const ordered = [...(packet.claims ?? [])].sort((a,b)=>ORDER.indexOf(a.layer)-ORDER.indexOf(b.layer));
  for (let i=0;i<ordered.length;i++) {
    const claim = ordered[i];
    const stronger = ordered.slice(i+1).filter(x=>x.claim_state==='observed');
    if (claim.claim_state !== 'observed' && stronger.length && claim.statement?.toLowerCase().includes('proves')) {
      errors.push(`claim at ${claim.layer} uses proof language without observed state`);
    }
  }
  return { valid: errors.length===0, errors, normalized: errors.length ? undefined : { ...packet, claims: ordered } };
}

export const AUDIO_CLAIM_LAYERS = Object.freeze([...ORDER]);
