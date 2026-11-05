import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN is required (provided by GitHub Actions).');
const targets = ['MirrorCartographer/MirrorCartographer', 'MirrorCartographer/mirror-cartographer-ui'];
const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'mirror-cartographer-public-evidence-audit'
};

async function api(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status} for ${path}: ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

async function allBranches(fullName) {
  const branches = [];
  for (let page = 1; page <= 20; page++) {
    const batch = await api(`/repos/${fullName}/branches?per_page=100&page=${page}`);
    branches.push(...batch.map(b => ({ name: b.name, head_sha: b.commit?.sha ?? null, protected: Boolean(b.protected) })));
    if (batch.length < 100) break;
  }
  return branches.sort((a, b) => a.name.localeCompare(b.name));
}

async function snapshot(fullName) {
  const meta = await api(`/repos/${fullName}`);
  if (meta.private) return { repository: fullName, private: true, omitted: 'private repository excluded from public census' };
  const branches = await allBranches(fullName);
  const main = branches.find(b => b.name === meta.default_branch);
  let combined = null;
  let checkRuns = [];
  if (main?.head_sha) {
    const [status, checks] = await Promise.all([
      api(`/repos/${fullName}/commits/${main.head_sha}/status`),
      api(`/repos/${fullName}/commits/${main.head_sha}/check-runs?per_page=100`)
    ]);
    combined = { state: status.state, total_count: status.total_count, statuses: (status.statuses ?? []).map(s => ({ context: s.context, state: s.state, description: s.description, target_url: s.target_url })) };
    checkRuns = (checks.check_runs ?? []).map(x => ({ name: x.name, status: x.status, conclusion: x.conclusion, html_url: x.html_url }));
  }
  const prefixCounts = {};
  const fiaFamilies = {};
  for (const b of branches) {
    const prefix = b.name.includes('/') ? b.name.split('/')[0] : '(no-prefix)';
    prefixCounts[prefix] = (prefixCounts[prefix] ?? 0) + 1;
    if (b.name.startsWith('fia/')) {
      const family = /artifact-registry/.test(b.name) ? 'artifact-registry'
        : /self-hosted-worker|worker/.test(b.name) ? 'workers-and-isolation'
        : /release/.test(b.name) ? 'release-evidence-and-promotion'
        : /reproducibility|hermetic/.test(b.name) ? 'reproducibility'
        : /deployment|deploy/.test(b.name) ? 'deployment-and-rollback'
        : /evidence|provenance|identity/.test(b.name) ? 'evidence-and-provenance'
        : /security|admission|cgroup|sandbox/.test(b.name) ? 'security-and-admission'
        : 'other-fia';
      fiaFamilies[family] = (fiaFamilies[family] ?? 0) + 1;
    }
  }
  const heads = new Map();
  for (const b of branches) if (b.head_sha) heads.set(b.head_sha, [...(heads.get(b.head_sha) ?? []), b.name]);
  const sharedHeads = [...heads.entries()].filter(([, names]) => names.length > 1).map(([sha, names]) => ({ sha, branches: names }));
  return {
    repository: fullName, visibility: meta.visibility, default_branch: meta.default_branch,
    default_branch_head_sha: main?.head_sha ?? null, branch_count: branches.length,
    unique_branch_heads: heads.size, shared_head_groups: sharedHeads, prefix_counts: prefixCounts, fia_family_counts: fiaFamilies, branches,
    default_branch_status: combined, default_branch_check_runs: checkRuns
  };
}

const capturedAt = new Date().toISOString();
const date = capturedAt.slice(0, 10);
const reports = await Promise.all(targets.map(snapshot));
const output = {
  schema_version: '1.0', captured_at_utc: capturedAt,
  scope: 'public repositories only; no private repository source or metadata is collected',
  reports
};
const folder = resolve('evidence/branch-census');
mkdirSync(folder, { recursive: true });
const json = JSON.stringify(output, null, 2) + '\n';
writeFileSync(resolve(folder, 'latest.json'), json);
writeFileSync(resolve(folder, `snapshot-${date}.json`), json);
console.log(`Captured ${reports.map(r => `${r.repository}: ${r.branch_count ?? 'private/omitted'} branches`).join('; ')}`);
