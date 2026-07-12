const DEFAULT_PROJECT = 'mirror-cartographer-research';

function normalizeAllowedHosts(projectName = DEFAULT_PROJECT, customHosts = []) {
  const project = String(projectName || '').trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(project)) throw new Error('invalid-project-name');
  const exact = `${project}.pages.dev`;
  const hosts = new Set([exact]);
  for (const host of customHosts) {
    const normalized = String(host || '').trim().toLowerCase().replace(/\.$/, '');
    if (!normalized || normalized.includes('/') || normalized.includes(':')) throw new Error('invalid-custom-host');
    hosts.add(normalized);
  }
  return { project, exact, hosts };
}

export function evaluateDeploymentUrl(urlValue, options = {}) {
  const { projectName = DEFAULT_PROJECT, customHosts = [] } = options;
  const allowed = normalizeAllowedHosts(projectName, customHosts);
  let parsed;
  try { parsed = new URL(urlValue); }
  catch { return { ok: false, reason: 'invalid-url', url: String(urlValue || '') }; }

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (parsed.protocol !== 'https:') return { ok: false, reason: 'https-required', hostname, url: parsed.href };
  if (parsed.username || parsed.password) return { ok: false, reason: 'credentials-forbidden', hostname, url: parsed.href };
  if (parsed.port && parsed.port !== '443') return { ok: false, reason: 'nonstandard-port-forbidden', hostname, url: parsed.href };

  const isPagesHost = hostname === allowed.exact || hostname.endsWith(`.${allowed.exact}`);
  const isCustomHost = allowed.hosts.has(hostname);
  if (!isPagesHost && !isCustomHost) {
    return { ok: false, reason: 'host-not-allowed', hostname, expected_project_host: allowed.exact, url: parsed.href };
  }

  return {
    ok: true,
    reason: isPagesHost ? 'cloudflare-pages-host' : 'approved-custom-host',
    hostname,
    expected_project_host: allowed.exact,
    url: parsed.href
  };
}
