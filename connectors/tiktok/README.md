# TikTok Connector

Purpose: define a public-safe TikTok connector for Mirror Cartographer that can ingest user-authorized TikTok metadata, organize saved/liked/public content into MC-compatible structures, and support symbolic/media analysis without violating privacy, platform rules, or evidence boundaries.

This folder is a connector architecture package, not a live credentialed integration. It defines how the connector should be built once TikTok developer credentials, user authorization, and permitted API scopes are available.

## Primary use cases

1. Organize saved or referenced TikTok videos into a navigable field map.
2. Extract public-safe metadata such as URL, caption, creator handle, hashtags, timestamps, and user-provided notes.
3. Let MC classify content by symbolic, emotional, sensory, practical, animal-care, creative, research, and opportunity categories.
4. Preserve provenance: TikTok source data stays distinct from MC interpretation.
5. Allow the user to mark content as private, public-safe abstraction, project reference, or discard.

## Non-goals

- Do not scrape private TikTok content.
- Do not bypass TikTok access controls.
- Do not claim complete TikTok data coverage.
- Do not infer the user's psychology from viewing history as fact.
- Do not republish copyrighted TikTok media.
- Do not treat platform recommendation behavior as fully observable unless separately evidenced.

## Connector boundary

The connector should operate only on one of these input classes:

- User-pasted TikTok URLs.
- User-exported data explicitly supplied by the user.
- OAuth-authorized TikTok API data where scopes permit access.
- Public metadata permitted by TikTok's platform rules.
- Research API data only when the access pathway is lawful and approved for the use case.

## MC pipeline

TikTok URL or exported item
→ Source object
→ Metadata object
→ User note
→ Signal extraction
→ Symbolic category
→ Claim status
→ Privacy status
→ Project link
→ Review state

## Important evidence boundary

Research audits have reported incompleteness and metadata loss in TikTok Research API data. The connector must treat API results as partial, scoped, and potentially incomplete rather than as a full representation of TikTok reality.

## Files

- `connector-spec.md` — functional connector specification.
- `schema.json` — canonical data schema.
- `privacy-and-safety.md` — permission, storage, and public-safety boundary.
- `roadmap.md` — implementation phases.
