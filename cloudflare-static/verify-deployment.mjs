#!/usr/bin/env node
import { inspectResearchSurfaceIdentity } from './research-surface-identity.mjs';

const candidates = process.argv.slice(2);
if (candidates.length === 0) {
  console.error('Usage: node verify-deployment.mjs https://<project>.pages.dev [...]');
  process.exit(2);
}

let verified = false;
for (const candidate of candidates) {
  try {
    const response = await fetch(candidate, { redirect: 'follow' });
    const body = await response.text();
    const identity = inspectResearchSurfaceIdentity(body, {
      status: response.status,
      resolvedUrl: response.url
    });
    const result = {
      candidate,
      resolvedUrl: identity.resolved_url,
      status: identity.status,
      ok: identity.ok,
      missingMarkers: identity.missing_markers
    };
    console.log(JSON.stringify(result));
    verified ||= result.ok;
  } catch (error) {
    console.log(JSON.stringify({ candidate, ok: false, error: String(error?.message || error) }));
  }
}

process.exit(verified ? 0 : 1);
