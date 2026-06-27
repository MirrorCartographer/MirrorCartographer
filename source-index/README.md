# Source Index

Purpose: maintain a public-safe, deduplicated index of external source links referenced while developing Mirror Cartographer and related research artifacts.

Scope boundary: this index can only include links that are visible in accessible ChatGPT/GitHub/file context or are added by future research runs. It cannot reconstruct links from deleted, inaccessible, or unavailable chats unless those links are later recovered.

Deduplication rule: each canonical URL appears once in `sources.md`. If the same source is relevant to many topics, add tags or notes to the existing row instead of duplicating the link.

Public-safety rule: do not include private chat transcripts, personal records, medical records, household details, credentials, account links, or raw private file links. Public sources, official documentation, public papers, public opportunity pages, and public project URLs are allowed.

Maintenance workflow:

1. Before adding a link, normalize the URL by removing tracking parameters such as `utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`, and similar analytics parameters.
2. Search `sources.md` for the normalized URL.
3. If it already exists, update tags or notes only if needed.
4. If it does not exist, append one new row.
5. Keep notes factual and short.
6. Mark source status as one of: official, paper, documentation, opportunity, article, project, repo, tool, dataset, unknown.
7. Mark claim status as one of: source-only, cited-in-chat, used-for-design, needs-review.

Files:

- `sources.md` — deduplicated source registry.
- Future optional files may group sources by domain, but the canonical URL should still appear once in `sources.md`.
