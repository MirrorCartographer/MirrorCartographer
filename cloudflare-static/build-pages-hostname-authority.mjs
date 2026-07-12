import crypto from 'node:crypto';
import fs from 'node:fs';

function normalizeHostname(value) {
  if (typeof value !== 'string') throw new Error('canonical-hostname-missing');
  const hostname = value.trim().toLowerCase().replace(/\.$/, '');
  if (!hostname || !/^[a-z0-9.-]+$/.test(hostname) || hostname.includes('..')) {
    throw new Error('canonical-hostname-invalid');
  }
  if (!hostname.endsWith('.pages.dev')) throw new Error('canonical-hostname-not-pages-dev');
  return hostname;
}

function normalizeDeploymentUrl(value) {
  if (value == null || value === '') return null;
  let url;
  try { url = new URL(value); } catch { throw new Error('deployment-url-invalid'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) {
    throw new Error('deployment-url-invalid-authority');
  }
  return url;
}

export function buildPagesHostnameAuthority(accessProbe, deploymentUrl = null) {
  if (!accessProbe || typeof accessProbe !== 'object') throw new Error('access-probe-missing');
  if (accessProbe.ready !== true) throw new Error('access-probe-not-ready');
  if (accessProbe.privacy?.secret_values_emitted !== false) throw new Error('access-probe-privacy-unverified');
  if (accessProbe.privacy?.account_id_emitted !== false) throw new Error('access-probe-account-id-exposed');

  const project = accessProbe.target_project;
  if (!project || project.found !== true) throw new Error('target-project-not-found');
  if (typeof project.name !== 'string' || !/^[a-z0-9-]+$/.test(project.name)) {
    throw new Error('target-project-name-invalid');
  }

  const canonicalHostname = normalizeHostname(project.canonical_hostname);
  const aliases = Array.isArray(project.custom_domains)
    ? [...new Set(project.custom_domains.map((value) => {
        if (typeof value !== 'string') return null;
        const hostname = value.trim().toLowerCase().replace(/\.$/, '');
        return /^[a-z0-9.-]+$/.test(hostname) && !hostname.includes('..') ? hostname : null;
      }).filter(Boolean))].sort()
    : [];

  const deployment = normalizeDeploymentUrl(deploymentUrl);
  let deploymentBinding = null;
  if (deployment) {
    const hostname = deployment.hostname.toLowerCase();
    const relation = hostname === canonicalHostname
      ? 'canonical'
      : hostname.endsWith(`.${canonicalHostname}`)
        ? 'pages-preview'
        : aliases.includes(hostname)
          ? 'declared-custom-domain'
          : 'unbound';
    deploymentBinding = {
      url: deployment.href,
      hostname,
      relation,
      bound: relation !== 'unbound'
    };
  }

  const record = {
    schema_version: '1.0.0',
    project: project.name,
    canonical_origin: `https://${canonicalHostname}`,
    canonical_hostname: canonicalHostname,
    aliases,
    authority: 'sanitized-direct-pages-project-probe',
    source_probe_schema: accessProbe.schema_version ?? null,
    deployment: deploymentBinding,
    claim: deploymentBinding?.bound ? 'hostname-control-plane-bound' : 'canonical-hostname-observed',
    privacy: {
      secret_values_emitted: false,
      account_id_emitted: false,
      source_required_privacy_assertions: true
    },
    epistemic_limit: 'Control-plane hostname authority does not prove DNS resolution, HTTP reachability, served identity, deployed commit, or scientific truth.'
  };

  return {
    ...record,
    digest_sha256: crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex')
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [probePath, outputPath, deploymentUrl] = process.argv.slice(2);
  if (!probePath || !outputPath) {
    throw new Error('usage: node build-pages-hostname-authority.mjs <access-probe.json> <output.json> [deployment-url]');
  }
  const result = buildPagesHostnameAuthority(JSON.parse(fs.readFileSync(probePath, 'utf8')), deploymentUrl ?? null);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  process.stdout.write(`${JSON.stringify({ claim: result.claim, hostname: result.canonical_hostname, bound: result.deployment?.bound ?? null })}\n`);
}
