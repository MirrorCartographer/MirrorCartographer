import { inspectServedDeploymentManifest } from './verify-served-deployment-manifest.mjs';

const PROBE_STATES = new Set([
  'unresolved',
  'http_unreachable',
  'reachable_wrong_or_unverified_surface',
  'identity_verified'
]);

export function classifyPublicHostnameProof(probe, manifest, expected = {}) {
  const reasons = [];
  if (!probe || typeof probe !== 'object' || Array.isArray(probe)) reasons.push('probe-not-object');
  const probeValue = probe && typeof probe === 'object' ? probe : {};
  if (!PROBE_STATES.has(probeValue.classification)) reasons.push('probe-classification-invalid');

  const manifestInspection = inspectServedDeploymentManifest(manifest, expected);
  const pageIdentityObserved = probeValue.classification === 'identity_verified' && probeValue.identity?.ok === true;
  const exactCommitObserved = pageIdentityObserved && manifestInspection.ok;

  let classification = 'indeterminate';
  let claim = 'The available packet is insufficient to classify public deployment identity.';

  if (probeValue.classification === 'unresolved') {
    classification = 'bounded_unresolved';
    claim = 'No public address was observed during the bounded hostname probe.';
  } else if (probeValue.classification === 'http_unreachable') {
    classification = 'bounded_http_unreachable';
    claim = 'DNS resolution was observed, but no HTTPS response was observed during the bounded probe.';
  } else if (probeValue.classification === 'reachable_wrong_or_unverified_surface') {
    classification = 'reachable_surface_unverified';
    claim = 'A public HTTPS surface was observed, but the research-surface identity contract was not satisfied.';
  } else if (pageIdentityObserved && !manifestInspection.ok) {
    classification = 'surface_identity_without_commit_proof';
    claim = 'The research surface was observed, but exact repository and commit identity were not proven.';
  } else if (exactCommitObserved) {
    classification = 'exact_commit_surface_verified';
    claim = 'The public research surface and its served deployment manifest matched the expected repository, surface, and source commit.';
  }

  return {
    schema_version: '1.0.0',
    classification,
    ok: exactCommitObserved && reasons.length === 0,
    claim,
    observed: {
      hostname: probeValue.hostname || null,
      checked_at: probeValue.checkedAt || null,
      page_identity: pageIdentityObserved,
      manifest_identity: manifestInspection.ok,
      source_commit: manifestInspection.observed.source_commit
    },
    reasons: [...new Set([...reasons, ...manifestInspection.reasons])],
    limits: [
      'A valid served manifest does not prove Cloudflare account ownership or control-plane configuration.',
      'This observation is time-bounded and can become stale after checked_at.',
      'This proof does not authorize diagnosis, treatment, payment, or conversion claims.'
    ]
  };
}
