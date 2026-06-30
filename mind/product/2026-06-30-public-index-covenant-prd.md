# PRD: Public Index Covenant

## Problem

Mirror Cartographer can be informed by private, sensitive, or mixed-source context while still needing public artifacts that are reviewable, useful, and safe. A normal index can accidentally become a leakage surface by revealing what private sources contain or by letting hidden context silently support public claims.

## Goal

Create a public-safe index layer that exposes source boundaries, claim lanes, missingness, privacy status, and revision reasons without revealing private details.

## Non-goals

- Do not publish raw transcripts.
- Do not publish personal, household, health, animal-care, financial, location, relationship, credential, or identifying continuity details.
- Do not imply that private lived context is public evidence.
- Do not certify clinical, diagnostic, financial, or legal validity.

## Users

- Public reviewers evaluating Mirror Cartographer as a bounded human-AI interaction prototype.
- Builders implementing source/claim/privacy gates.
- Auditors checking overclaim, leakage, and misuse risk.
- Collaborators who need enough context to understand the architecture without access to the private corpus.

## Functional requirements

1. Every public artifact has a covenant record.
2. Every record labels source status, claim status, privacy status, missingness, and revision reason.
3. Private sources are represented only by source class and permitted use, never by sensitive content.
4. Public claims must be routed to allowed lanes before publication.
5. Abstracted methods must include a statement that private context shaped architecture but is not public evidence.
6. The UI should show a compact public label and an expandable boundary receipt.
7. The build process should fail if a public artifact lacks required covenant fields.

## Suggested UI labels

- Source boundary: `public / abstracted / excluded / mixed / unavailable`
- Claim lane: `method / requirement / research question / evaluation / implementation / governance`
- Privacy lane: `public-safe / abstracted / excluded / review-needed`
- Missingness: `none known / partial / blocked / stale / intentionally withheld`

## Success criteria

- A public reviewer can understand what the artifact is allowed to claim.
- Private source classes can inform architecture without becoming public content.
- Every release preserves uncertainty and missingness.
- Overclaiming is easier to detect than in the prior artifact.

## Failure modes

- The index becomes a map to private material.
- The artifact claims validation from private experience.
- Missingness is hidden to make the product appear more complete.
- Redaction is mistaken for evidence quality.
- Private context silently changes product claims without revision trace.
