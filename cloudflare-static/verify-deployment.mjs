#!/usr/bin/env node

const candidates = process.argv.slice(2);
if (candidates.length === 0) {
  console.error('Usage: node verify-deployment.mjs https://<project>.pages.dev [...]');
  process.exit(2);
}

const requiredMarkers = [
  '<title>Mirror Cartographer Research Field</title>',
  'Build theories that can survive contact with evidence.',
  'Theory instrument'
];

let verified = false;
for (const candidate of candidates) {
  try {
    const response = await fetch(candidate, { redirect: 'follow' });
    const body = await response.text();
    const missing = requiredMarkers.filter((marker) => !body.includes(marker));
    const result = {
      candidate,
      resolvedUrl: response.url,
      status: response.status,
      ok: response.ok && missing.length === 0,
      missingMarkers: missing
    };
    console.log(JSON.stringify(result));
    verified ||= result.ok;
  } catch (error) {
    console.log(JSON.stringify({ candidate, ok: false, error: String(error?.message || error) }));
  }
}

process.exit(verified ? 0 : 1);
