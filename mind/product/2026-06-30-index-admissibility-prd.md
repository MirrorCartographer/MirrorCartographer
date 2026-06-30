# Product Requirement: Index Admissibility Layer

Status: public-safe product requirement
Privacy status: abstracted; no private records included
Revision reason: added to convert repeated source-boundary research into an implementable product layer.

## Problem

Mirror Cartographer needs continuity, symbolic memory, echo tracking, and public proof artifacts. But an index that retrieves private or stale context without permission controls can create false continuity, privacy leakage, or unsupported public claims.

## Goal

Build an index layer that stores not only what an item is, but what it is allowed to do.

## Non-goals

- Store raw private transcripts in public GitHub.
- Convert personal records into public evidence.
- Diagnose or infer hidden truth from symbolic recurrence.
- Treat model-generated summaries as original sources.
- Treat retrieval similarity as authority.

## User stories

### Public reviewer

As a reviewer, I can see why a public claim is allowed, what source class supports it, and what missingness remains.

### System maintainer

As a maintainer, I can add a method or product requirement from private-context learning without exposing private facts.

### Evaluator

As an evaluator, I can test whether MC refuses to overuse stale, private, generated, or unsupported index entries.

### Future implementation agent

As an implementation agent, I can retrieve a record and know whether it may inspire design, support a requirement, or support a public factual claim.

## Functional requirements

1. Every indexed item must have source status, claim status, privacy status, missingness, revision reason, and authority limit.
2. Private-context records must default to non-public authority until abstracted.
3. Generated summaries must retain generated status even when echoed by trusted tools.
4. Stale-risk records must trigger review before being used as current product evidence.
5. Public claims must require public-safe source status or explicit bounded inference.
6. Evaluation artifacts must test false transfer from symbolic recurrence to evidence claim.
7. Implementation plans may be public if they contain no private facts or sensitive origin details.
8. The interface should display a compact permission tag when an indexed memory influences output.

## Required UI labels

- Source status
- Claim status
- Privacy status
- Missingness
- Revision reason
- Authority limit

## Acceptance criteria

- A private-context input can generate a public-safe product requirement without exposing private facts.
- A stale public claim is flagged before reuse.
- A generated summary cannot be promoted to original-source status.
- A symbolic pattern can be routed to reflection without becoming proof.
- A record marked blocked cannot appear in public output except as an abstracted boundary lesson.

## Research questions

- What is the minimum metadata needed to prevent false proof-transfer?
- Can public reviewers understand source authority without seeing private source material?
- How should MC represent uncertainty when the source exists but cannot be disclosed?
- Can a symbolic memory system remain useful when privacy constraints remove origin detail?
- What review triggers best catch stale or superseded claims?

## Implementation note

Start with Markdown records and scorecards. Later, convert to typed JSON records and enforce validation in the app before any memory or index entry influences a generated reflection.
