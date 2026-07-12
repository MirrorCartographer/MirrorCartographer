import crypto from 'node:crypto';

function requireHttpsUrl(value, label) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label}-invalid-url`); }
  if (url.protocol !== 'https:') throw new Error(`${label}-must-use-https`);
  if (url.username || url.password || url.port) throw new Error(`${label}-unexpected-authority-components`);
  return url;
}

export function resolvePagesHostname(projectResponse, deploymentUrl = null) {
  const project = projectResponse?.result ?? projectResponse;
  if (!project || typeof project !== 'object') throw new Error('project-response-missing');
  if (typeof project.name !== 'string' || !project.name.trim()) throw new Error('project-name-missing');
  if (typeof project.subdomain !== 'string' || !project.subdomain.trim()) throw new Error('project-subdomain-missing');

  const canonicalUrl = requireHttpsUrl(project.subdomain, 'project-subdomain');
  const canonicalHostname = canonicalUrl.hostname.toLowerCase();
  if (!canonicalHostname.endsWith('.pages.dev')) throw new Error('project-subdomain-not-pages-dev');
  if (canonicalUrl.pathname !== '/' || canonicalUrl.search || canonicalUrl.hash) {
    throw new Error('project-subdomain-must-be-origin');
  }

  const aliases = Array.isArray(project.domains)
    ? [...new Set(project.domains.filter((v) => typeof v === 'string').map((v) => v.toLowerCase()))].sort()
    : [];

  let deployment = null;
  if (deploymentUrl) {
    const parsed = requireHttpsUrl(deploymentUrl, 'deployment-url');
    const hostname = parsed.hostname.toLowerCase();
    const relation = hostname === canonicalHostname
      ? 'canonical'
      : hostname.endsWith(`.${canonicalHostname}`)
        ? 'pages-preview'
        : aliases.includes(hostname)
          ? 'declared-custom-domain'
          : 'unbound';
    deployment = { url: parsed.href, hostname, relation, bound: relation !== 'unbound' };
  }

  const record = {
    schema_version: '1.0.0',
    project: project.name,
    canonical_origin: canonicalUrl.origin,
    canonical_hostname: canonicalHostname,
    authority: 'cloudflare-pages-project-api',
    aliases,
    deployment,
    claim: deployment?.bound ? 'hostname-control-plane-bound' : 'canonical-hostname-observed',
    epistemic_limit: 'Control-plane hostname binding does not prove DNS resolution, HTTP reachability, served identity, or deployed commit.'
  };
  return { ...record, digest_sha256: crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex') };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const fs = await import('node:fs');
  const [inputPath, outputPath, deploymentUrl] = process.argv.slice(2);
  if (!inputPath || !outputPath) throw new Error('usage: node resolve-pages-hostname.mjs <project.json> <output.json> [deployment-url]');
  const result = resolvePagesHostname(JSON.parse(fs.readFileSync(inputPath, 'utf8')), deploymentUrl ?? null);
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}
