# TikTok Connector Privacy and Safety

## Principle

TikTok content can feel personally meaningful, but the connector must not treat platform behavior as direct psychological truth. It should help the user organize meaning while preserving uncertainty, consent, and source boundaries.

## Privacy classes

### Public source

A public TikTok URL or public metadata that can be cited as a source.

Allowed:

- store canonical URL
- store caption/hashtags when available
- store creator handle when public
- link to source index if relevant

### Private user note

A note supplied by the user about why the item matters.

Allowed:

- store privately with explicit user approval
- use for private MC organization

Blocked:

- publish raw note to GitHub
- convert personal meaning into public claim

### Public-safe abstraction

A transformed version that removes personal/private details while preserving design value.

Example:

Private note: `This video reminds me of a specific traumatic feeling.`

Public-safe abstraction: `Short-form media can act as a memory trigger and should be handled with user-controlled interpretation boundaries.`

### Sensitive/private do not publish

Any item involving personal health, animal health, location, private relationships, financial state, identity documents, credentials, or raw personal distress.

Allowed:

- session-only handling
- private note if user approves

Blocked:

- public GitHub publication
- source-index entry if it reveals private context

## Safety rules

1. Do not infer diagnosis, identity, trauma, sexual orientation, political belief, or protected traits from TikTok behavior.
2. Do not treat liking, saving, or watching as endorsement.
3. Do not claim a TikTok video is true without external evidence.
4. Do not convert creator advice into medical, veterinary, legal, or financial guidance without reliable sources.
5. Do not republish media content.
6. Do not scrape behind authentication or bypass access controls.
7. Do not make MC's interpretation durable without review status.
8. Do not merge TikTok items into the user's identity graph without explicit permission.

## Research API caution

Independent audits have reported that TikTok Research API data can be incomplete, filtered, metadata-stripped, and operationally constrained. MC should therefore label Research API-derived records as partial data.

## Connector refusal conditions

The connector should refuse or block:

- requests to scrape private accounts
- requests to bypass login walls
- requests to download copyrighted videos for republication
- requests to identify private individuals from TikTok content
- requests to infer hidden traits or diagnoses from viewing behavior
- requests to publish private saved-video meaning without abstraction

## MC-safe transformation pattern

Raw TikTok item
→ public metadata or user-authorized data
→ private user note
→ system interpretation with claim label
→ user review
→ memory decision
→ optional public-safe abstraction

## Recommended default

Default every imported TikTok item to:

- memory_status: `session_only`
- review_state: `unreviewed`
- claim_status: `unknown`
- privacy_level: `private_note` if user comment is included

Only upgrade after user review.
