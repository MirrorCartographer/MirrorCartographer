# PRD: Contestability Receipt Layer

## Product thesis

Mirror Cartographer should not only label claims at generation time. It should give each durable claim a visible path for correction, downgrading, redaction, retirement, or supersession.

## Source status

- Public repo derived: README confirms source status, claim status, audit labels, evidence boundaries, and user feedback loops.
- File-library derived: implementation materials confirm reflection modes, resonance feedback, contradiction logs, and exportable artifacts.
- Private-context-informed: only used to understand the architecture pressure toward public-safe publication; no private details are included.
- External-research aligned: current AI-memory research treats long-term memory/retrieval as a trust boundary.

## Claim status

Design proposal; implementation not verified in the current live UI.

## Privacy status

Public-safe. No private examples.

## Problem

MC can produce artifacts that compress private or mixed-source context into public-safe form. Existing gates protect release, but users and reviewers still need a post-release mechanism to dispute claims without forcing private-source exposure.

## Users

- artifact reviewer
- system maintainer
- researcher evaluating MC outputs
- user correcting their own reflection history
- downstream reader encountering a public-safe MC claim

## Requirements

### R1: Attach contestability metadata

Every durable claim should have a receipt with claim mode, source boundary, claim status, privacy status, missingness, revision reason, and challenge options.

### R2: Separate public challenge from private evidence

A public reviewer may challenge the public claim. They should not need access to private source material.

### R3: Permit downgrade

The system must support downgrading a claim from confirmed to bounded inference, from inference to hypothesis, from symbolic interpretation to speculation, or from released to retired.

### R4: Preserve revision reason

Every correction must state why the claim changed.

### R5: Preserve missingness

If a repository, file, live UI, citation, or source context was unavailable, unindexed, or not checked, the receipt must preserve that fact.

### R6: Block private leakage in challenges

If a user submits private details in a public challenge workflow, the system must route the challenge to private review or strip the private material before public handling.

### R7: Accessibility

The receipt must be readable as normal text and not depend only on code blocks, icons, color, or hover states.

## Non-goals

- exposing raw private evidence;
- making symbolic output authoritative;
- replacing legal, medical, clinical, veterinary, or financial review;
- proving private source truth publicly;
- preserving every generated sentence forever.

## Open research questions

1. What is the smallest receipt that still supports meaningful contestability?
2. Which challenge types should automatically trigger privacy review?
3. How should MC handle claims that are emotionally resonant but factually overstrong?
4. How should public artifacts show that a claim was private-context-informed without exposing source details?
5. Should user disagreement be treated as a correction, a contradiction node, or both?

## Acceptance criteria

- A claim can be challenged without private-source exposure.
- A claim can be downgraded without deleting the entire artifact.
- Every revision includes source status, claim status, privacy status, missingness, and revision reason.
- The UI can render the receipt beside a reflection or public artifact summary.
- The export format can preserve the receipt.

## Missingness

- No code-level implementation audit completed.
- GitHub code search returned no indexed `mind/` artifact results in this run.
- Live deployment was not tested.

## Revision reason

Added to close the post-release correction gap in MC's public-safe architecture.
