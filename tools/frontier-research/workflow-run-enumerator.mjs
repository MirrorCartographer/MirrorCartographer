const SHA_RE = /^[0-9a-f]{40}$/i;
const LINK_PART_RE = /<([^>]+)>\s*;\s*rel="([^"]+)"/g;

export function buildWorkflowRunRequest({ owner, repo, commitSha, page = 1, perPage = 100 }) {
  if (!owner || !repo) throw new Error('owner and repo are required');
  if (!SHA_RE.test(commitSha ?? '')) throw new Error('commitSha must be a 40-character git SHA');
  if (!Number.isInteger(page) || page < 1) throw new Error('page must be a positive integer');
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100) throw new Error('perPage must be between 1 and 100');

  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/actions/runs`);
  url.searchParams.set('head_sha', commitSha.toLowerCase());
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('page', String(page));

  return {
    method: 'GET',
    url: url.toString(),
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };
}

export function parseLinkHeader(linkHeader) {
  if (!linkHeader) return {};
  const links = {};
  for (const match of linkHeader.matchAll(LINK_PART_RE)) {
    links[match[2]] = match[1];
  }
  return links;
}

export function aggregateWorkflowRunPages({ commitSha, pages }) {
  if (!SHA_RE.test(commitSha ?? '')) throw new Error('commitSha must be a 40-character git SHA');
  if (!Array.isArray(pages) || pages.length === 0) throw new Error('pages must be a non-empty array');

  const runs = [];
  const pageNumbers = new Set();
  let completePagination = true;

  for (const page of pages) {
    if (!Number.isInteger(page?.page) || page.page < 1) throw new Error('each page must have a positive integer page number');
    if (pageNumbers.has(page.page)) throw new Error('duplicate page number');
    pageNumbers.add(page.page);
    if (!Array.isArray(page.workflow_runs)) throw new Error('each page must contain workflow_runs');
    runs.push(...page.workflow_runs);

    const links = parseLinkHeader(page.link ?? '');
    if (links.next && !pages.some((candidate) => candidate.page === page.page + 1)) completePagination = false;
  }

  const sortedPages = [...pageNumbers].sort((a, b) => a - b);
  for (let index = 0; index < sortedPages.length; index += 1) {
    if (sortedPages[index] !== index + 1) completePagination = false;
  }

  const exactRuns = runs.filter((run) => run?.head_sha?.toLowerCase() === commitSha.toLowerCase());
  return {
    commitSha: commitSha.toLowerCase(),
    query: { head_sha: commitSha.toLowerCase(), per_page: 100 },
    source: {
      firstPageOnly: pages.length === 1 && Boolean(parseLinkHeader(pages[0].link ?? '').next),
      eventFiltered: false,
      completePagination
    },
    pagesObserved: sortedPages,
    runs,
    exactRunCount: exactRuns.length,
    limitations: completePagination ? ['github_filtered_search_cap_1000_results'] : ['pagination_not_proven_complete']
  };
}
