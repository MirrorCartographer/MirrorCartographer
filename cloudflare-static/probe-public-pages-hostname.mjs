import dns from 'node:dns/promises';
import fs from 'node:fs';
import { inspectResearchSurfaceIdentity } from './research-surface-identity.mjs';

export async function probePublicPagesHostname({
  hostname = 'mirror-cartographer-research.pages.dev',
  fetchImpl = globalThis.fetch,
  resolve4 = dns.resolve4,
  resolve6 = dns.resolve6,
  now = () => new Date().toISOString()
} = {}) {
  const url = `https://${hostname}/`;
  const dnsEvidence = { ipv4: [], ipv6: [], errors: [] };

  for (const [family, resolver] of [['ipv4', resolve4], ['ipv6', resolve6]]) {
    try {
      dnsEvidence[family] = await resolver(hostname);
    } catch (error) {
      dnsEvidence.errors.push({ family, code: error?.code ?? 'UNKNOWN', message: String(error?.message ?? error) });
    }
  }

  const resolved = dnsEvidence.ipv4.length > 0 || dnsEvidence.ipv6.length > 0;
  if (!resolved) {
    return {
      schemaVersion: '1.0.0',
      checkedAt: now(),
      hostname,
      url,
      classification: 'unresolved',
      claim: 'No public deployment claim is authorized.',
      dns: dnsEvidence,
      http: null,
      identity: null
    };
  }

  try {
    const response = await fetchImpl(url, { redirect: 'follow', headers: { 'user-agent': 'MirrorCartographer-public-hostname-probe/1.0' } });
    const body = await response.text();
    const identity = inspectResearchSurfaceIdentity(body, { status: response.status, resolvedUrl: response.url });
    const classification = identity.ok ? 'identity_verified' : 'reachable_wrong_or_unverified_surface';
    return {
      schemaVersion: '1.0.0',
      checkedAt: now(),
      hostname,
      url,
      classification,
      claim: identity.ok
        ? 'Public hostname serves the expected research-surface identity; this is not exact-commit or control-plane deployment proof.'
        : 'Hostname is reachable but does not verify as the expected research surface.',
      dns: dnsEvidence,
      http: { status: response.status, finalUrl: response.url, redirected: response.url !== url },
      identity
    };
  } catch (error) {
    return {
      schemaVersion: '1.0.0',
      checkedAt: now(),
      hostname,
      url,
      classification: 'http_unreachable',
      claim: 'DNS resolved, but no served deployment claim is authorized.',
      dns: dnsEvidence,
      http: { error: String(error?.message ?? error) },
      identity: null
    };
  }
}

async function main() {
  const outputPath = process.argv[2] ?? 'cloudflare-public-hostname-probe.json';
  const result = await probePublicPagesHostname();
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.classification !== 'identity_verified') process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
