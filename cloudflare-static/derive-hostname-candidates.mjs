import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeProjectName(value) {
  if (!nonEmptyString(value)) throw new Error('project name must be a non-empty string');
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(normalized)) {
    throw new Error('project name is not a valid bounded hostname label');
  }
  return normalized;
}

export function deriveHostnameCandidates(config, options = {}) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('config must be an object');
  }

  const projectName = normalizeProjectName(config.name);
  const accountSubdomain = nonEmptyString(options.accountSubdomain)
    ? normalizeProjectName(options.accountSubdomain)
    : null;

  const candidates = [
    {
      hostname: `${projectName}.pages.dev`,
      basis: 'cloudflare_pages_default_hostname_convention',
      claimState: 'candidate_only'
    }
  ];

  if (accountSubdomain) {
    candidates.push({
      hostname: `${projectName}.${accountSubdomain}.workers.dev`,
      basis: 'worker_custom_subdomain_candidate',
      claimState: 'candidate_only'
    });
  }

  return {
    schemaVersion: '1.0.0',
    projectName,
    candidates,
    authorizedClaim: 'candidate_generation_only',
    requiredVerification: [
      'DNS resolution evidence',
      'HTTPS response evidence',
      'research-surface identity evidence',
      'Cloudflare control-plane or deployment proof for exact commit attribution'
    ],
    limits: [
      'A configured project name does not prove that a Pages project exists.',
      'A conventional pages.dev hostname is a probe candidate, not a resolved deployment hostname.',
      'Public reachability does not prove exact commit identity.',
      'This artifact does not authorize diagnosis, treatment, payment, or conversion claims.'
    ]
  };
}

async function main() {
  const configPath = process.argv[2];
  if (!configPath) throw new Error('usage: node derive-hostname-candidates.mjs <wrangler.json> [result.json]');
  const raw = fs.readFileSync(configPath, 'utf8').replace(/^\s*\/\/.*$/gm, '');
  const config = JSON.parse(raw);
  const result = deriveHostnameCandidates(config);
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv[3]) fs.writeFileSync(process.argv[3], serialized);
  process.stdout.write(serialized);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
