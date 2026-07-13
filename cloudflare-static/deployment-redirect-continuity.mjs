import { evaluateDeploymentUrl } from './deployment-url-policy.mjs';

export function evaluateDeploymentRedirectContinuity(candidateUrl, resolvedUrl, options = {}) {
  const candidate = evaluateDeploymentUrl(candidateUrl, options);
  const resolved = evaluateDeploymentUrl(resolvedUrl, options);
  const reasons = [];

  if (!candidate.ok) reasons.push(`candidate:${candidate.reason}`);
  if (!resolved.ok) reasons.push(`resolved:${resolved.reason}`);

  if (candidate.ok && resolved.ok) {
    if (candidate.hostname !== resolved.hostname) reasons.push('hostname-changed-during-fetch');

    const candidateParsed = new URL(candidate.url);
    const resolvedParsed = new URL(resolved.url);
    if (candidateParsed.pathname !== resolvedParsed.pathname) reasons.push('path-changed-during-fetch');
    if (candidateParsed.search !== resolvedParsed.search) reasons.push('query-changed-during-fetch');
  }

  return {
    schema_version: '1.0.0',
    ok: reasons.length === 0,
    candidate_url: candidate.url || String(candidateUrl || ''),
    resolved_url: resolved.url || String(resolvedUrl || ''),
    candidate_hostname: candidate.hostname || null,
    resolved_hostname: resolved.hostname || null,
    reasons,
    claim_limit: 'This proves URL continuity inside one fetch. It does not prove DNS ownership, Cloudflare control-plane identity, source commit, or served-content truth.'
  };
}
