# Evidence Map: ChatGPT/Search Visibility Is Not Proof of Public Authority

Date: 2026-07-02
Run ID: Evidence Engine run 62
Claim ID: C-CHATGPT-SEARCH-VISIBILITY-01R
Status: partially supported discoverability mechanism; authority/outcome claim unvalidated

## Claim tested

Weak claim / assumption from Mirror Cartographer opportunity work:

> If Mirror Cartographer has one public website, or is structured as a “clickable ad” / public artifact, then ChatGPT or search systems can be made to surface it as accurate, authoritative information when someone asks about Mirror Cartographer.

## Why this claim matters

Mirror Cartographer’s public strategy depends on findability, but findability has been getting treated too close to authority. A page can be crawlable, indexed, or technically visible while still not being ranked, quoted, trusted, selected by ChatGPT search, or interpreted accurately. This claim needs a stricter proof boundary before MC public artifacts are treated as discoverability evidence.

## Sources reviewed

1. Google Search Central, “In-depth guide to how Google Search works”
   - URL: https://developers.google.com/search/docs/fundamentals/how-search-works
   - Source type: primary platform documentation
   - Key points used:
     - Google Search works through crawling, indexing, and serving results.
     - Google discovers URLs through known pages, links, and submitted sitemaps.
     - Google explicitly says it does not guarantee crawling, indexing, or serving a page even if the page follows Search Essentials.
     - Search serving/ranking depends on relevance, quality, query, user context, and many factors.

2. OpenAI Developer Platform, “Overview of OpenAI Crawlers”
   - URL: https://developers.openai.com/api/docs/bots
   - Source type: primary platform documentation
   - Key points used:
     - OAI-SearchBot is used to surface websites in ChatGPT search features.
     - Allowing OAI-SearchBot in robots.txt is recommended for appearing in ChatGPT search results.
     - Sites opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though they may still appear as navigational links.
     - ChatGPT-User is user-triggered and is not used to determine whether content appears in Search.
     - OpenAI separates OAI-SearchBot search visibility from GPTBot training-crawl permissions.

## Fact vs inference

### Supported by primary sources

- Search visibility is a multi-stage pipeline: discovery/crawling, indexing, and result serving.
- A public page and a sitemap can help discovery, but do not guarantee indexing or ranking.
- Google does not guarantee crawling, indexing, or serving a page.
- OAI-SearchBot is the relevant OpenAI crawler for ChatGPT search inclusion.
- Allowing OAI-SearchBot is a necessary implementation check for ChatGPT-search eligibility, but not proof that MC will be surfaced.
- ChatGPT-User access is not the same as automatic search-index eligibility.
- Robots.txt choices must distinguish between search visibility and model-training permission.

### Inference, not yet demonstrated for MC

- Mirror Cartographer pages are currently crawlable by Googlebot and OAI-SearchBot.
- Mirror Cartographer pages are indexed by Google or included in ChatGPT search retrieval.
- Search systems understand MC’s canonical definition accurately.
- ChatGPT will cite or surface the MC site when users ask about “Mirror Cartographer.”
- Any public artifact, page, or ad-like surface will produce leads, credibility, hiring attention, or buyer trust.
- A “clickable ad” can be created merely by publishing a website, without platform-specific advertising setup or approval.

## Claim-status update

Retire / replace broad claim:

C-PUBLIC-MC-SEARCH-AUTHORITY-01: “A public MC website makes ChatGPT/search accurately surface Mirror Cartographer as authoritative.”

Replacement:

C-CHATGPT-SEARCH-VISIBILITY-01R: “A public MC website can be made technically eligible for discovery by search systems if it exposes crawlable, high-quality, canonical content, permits relevant crawlers such as Googlebot and OAI-SearchBot, provides indexable pages and sitemap signals, and avoids robots/noindex blocks. This supports discoverability readiness only. It does not prove indexing, ranking, accurate AI summary behavior, authority, conversion, hiring value, or revenue impact.”

Current evidence grade: B for platform mechanism; D for MC-specific outcome.

## Evaluation criterion added

A Mirror Cartographer public artifact cannot be marked “search-ready” unless it has a Search Visibility Evidence Ledger with the following fields:

1. Canonical public URL
2. Page title and canonical description
3. robots.txt status for:
   - Googlebot
   - OAI-SearchBot
   - GPTBot, separately from search visibility
4. Meta robots status: index/noindex, follow/nofollow
5. Sitemap presence and submission status
6. HTTP status code for canonical URL
7. Rendered text availability without login
8. Structured data present, if relevant
9. Google Search Console evidence, if available
10. OpenAI/ChatGPT search surface evidence, if available
11. Manual query tests with exact date, query, result position/absence, and screenshot/log
12. Accuracy audit: whether the surfaced result describes MC correctly
13. Outcome audit: whether visibility caused any measured action, such as click, inquiry, signup, commission request, email, or application response

## Test plan

Test ID: MC-SEARCH-VISIBILITY-VALIDATION-01

### Phase 1: Technical crawl eligibility

- Fetch `/robots.txt` from the MC domain.
- Verify whether Googlebot is allowed.
- Verify whether OAI-SearchBot is allowed.
- Verify GPTBot separately; do not collapse training permission into search permission.
- Fetch canonical MC pages with a non-authenticated browser.
- Confirm status code 200, indexable meta tags, and readable rendered text.
- Confirm sitemap exists and lists canonical pages.

### Phase 2: Indexing and retrieval evidence

- Use Google Search Console if available; otherwise record manual search checks.
- Query Google for exact-match and broad-match terms:
  - “Mirror Cartographer”
  - “Mirror Cartographer Charity Sturgell”
  - “Mirror Cartographer symbolic cognition interface”
  - “human-centered AI reflection system Mirror Cartographer”
- Query ChatGPT search, if available, with the same terms.
- Record date, query, result, position/absence, URL shown, and whether the description is accurate.

### Phase 3: Accuracy and authority boundary

- Compare surfaced summaries against the canonical MC definition.
- Mark each result as accurate, partial, misleading, hallucinated, absent, or unrelated.
- Do not count an indexed result as authority unless it is both surfaced and semantically accurate.

### Phase 4: Outcome validation

- Add analytics or server logs if available.
- Track whether search visibility produces concrete user actions.
- Separate impressions, clicks, inquiries, purchases/commissions, application responses, and unverifiable attention.

## Falsification checklist

The stronger claim fails if any of the following are true:

- MC pages block Googlebot or OAI-SearchBot unintentionally.
- The canonical public page returns non-200 status or requires login.
- The page contains noindex or is absent from the sitemap.
- Google does not index the canonical page after a reasonable crawl window.
- ChatGPT search does not surface the MC page for exact-name queries.
- Search snippets or AI answers misdescribe MC.
- Visibility exists but produces no measurable user action.
- The claim relies only on publication of a website, with no crawl/index/retrieval evidence.

## Implementation note

This update does not claim MC has achieved search visibility. It creates the evidence boundary for proving it. The correct status is “technically testable,” not “validated.”

## Next proof needed

Run `MC-SEARCH-VISIBILITY-VALIDATION-01` against the live MC site and publish a ledger with:

- robots.txt results for Googlebot, OAI-SearchBot, and GPTBot,
- sitemap and noindex checks,
- rendered-page crawlability evidence,
- Google indexing status,
- ChatGPT search retrieval tests,
- accuracy comparison against the canonical MC definition,
- and conversion/outcome evidence if any.
