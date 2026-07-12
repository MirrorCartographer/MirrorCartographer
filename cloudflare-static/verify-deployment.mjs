#!/usr/bin/env node
import { evaluateDeploymentUrl } from './deployment-url-policy.mjs';
import { DEFAULT_MAX_BODY_BYTES, evaluateDeploymentResponse } from './deployment-response-contract.mjs';
import { verifyServedDeploymentManifest } from './verify-served-deployment-manifest.mjs';

const candidates = process.argv.slice(2);
if (candidates.length === 0) {
  console.error('Usage: node verify-deployment.mjs https://<project>.pages.dev [...]');
  process.exit(2);
}

let verified = false;
for (const candidate of candidates) {
  const candidatePolicy = evaluateDeploymentUrl(candidate);
  if (!candidatePolicy.ok) {
    console.log(JSON.stringify({ candidate, ok: false, urlPolicy: candidatePolicy }));
    continue;
  }

  try {
    const response = await fetch(candidate, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { accept: 'text/html,application/xhtml+xml' }
    });
    const resolvedPolicy = evaluateDeploymentUrl(response.url);
    if (!resolvedPolicy.ok) {
      console.log(JSON.stringify({
        candidate,
        resolvedUrl: response.url,
        ok: false,
        urlPolicy: resolvedPolicy,
        error: 'redirect-target-not-allowed'
      }));
      continue;
    }

    const declaredLength = response.headers.get('content-length');
    if (declaredLength != null && Number(declaredLength) > DEFAULT_MAX_BODY_BYTES) {
      console.log(JSON.stringify({
        candidate,
        resolvedUrl: response.url,
        ok: false,
        reasons: ['declared-body-too-large-or-invalid'],
        declaredContentLength: Number(declaredLength),
        maxBodyBytes: DEFAULT_MAX_BODY_BYTES,
        urlPolicy: resolvedPolicy
      }));
      continue;
    }

    const body = await response.text();
    const contract = evaluateDeploymentResponse({
      body,
      status: response.status,
      resolvedUrl: response.url,
      contentType: response.headers.get('content-type'),
      contentLength: declaredLength
    });
    const manifest = await verifyServedDeploymentManifest(contract.resolved_url, {
      sourceCommit: process.env.GITHUB_SHA,
      repository: process.env.GITHUB_REPOSITORY,
      surface: process.env.CLOUDFLARE_RESEARCH_SURFACE || 'mirror-cartographer-research'
    });
    const reasons = [...contract.reasons];
    if (!manifest.ok) reasons.push('served-deployment-manifest-invalid');
    const result = {
      candidate,
      resolvedUrl: contract.resolved_url,
      status: contract.status,
      ok: contract.ok && manifest.ok,
      reasons,
      missingMarkers: contract.missing_markers,
      contentType: contract.content_type,
      bodyBytes: contract.body_bytes,
      maxBodyBytes: contract.max_body_bytes,
      urlPolicy: resolvedPolicy,
      deploymentManifest: manifest
    };
    console.log(JSON.stringify(result));
    verified ||= result.ok;
  } catch (error) {
    console.log(JSON.stringify({ candidate, ok: false, error: String(error?.message || error) }));
  }
}

process.exit(verified ? 0 : 1);
