# PRD: Admissible Memory Contract Layer

Status: product requirement draft
Privacy status: public-safe
Revision reason: MC needs a concrete product layer that prevents retrieved memory, private context, or symbolic recurrence from bypassing source, claim, privacy, and temporal boundaries.

## Problem

A reflective AI interface can become unsafe or misleading if it treats retrieved memory as automatically relevant, current, public-safe, or authoritative. Semantic similarity is not enough. A memory can be related to the current task while still being private, stale, superseded, overclaiming, or domain-incompatible.

## Product objective

Before any memory-like source influences an output, MC must decide whether that source is admissible for the current lane and output type.

## Users

- Individual user using reflective sessions
- Researcher evaluating bounded human-AI interaction
- Reviewer inspecting public proof artifacts
- Developer implementing persistent memory, echo tracker, or export archive

## Non-goals

- No diagnosis
- No therapy replacement
- No truth oracle
- No hidden private-source publication
- No claim that memory admission solves every safety issue

## Requirements

### R1: Source classification

Every source entering an interpretation must be classified as one of: current user input, public repository, private file, saved context, external research, generated summary, or unknown.

### R2: Privacy classification

Every source must carry public-safe, private-context-only, restricted, or unknown privacy status.

### R3: Claim-lane routing

Every claim must be routed to a lane: evidence, hypothesis, metaphor, design requirement, implementation plan, evaluation criterion, or unknown.

### R4: Temporal status

Every remembered source must be current, possibly stale, superseded, undated, or unknown.

### R5: Admission decision

The interface must explicitly decide: admit, admit with boundary, summarize only, reject, or quarantine.

### R6: Revision custody

When a source, claim, or interpretation changes status, the system must store a revision reason without exposing private correction content in public artifacts.

### R7: Public export filter

A public export cannot include private-context-only or restricted records except as abstracted methods, product requirements, evaluation criteria, research questions, or source-boundary notes.

## Acceptance tests

1. Private but relevant memory is summarized only and does not appear verbatim in public output.
2. Stale memory is marked possibly_stale or superseded and cannot support a current implementation claim.
3. Symbolic recurrence cannot become evidence without a separate source-bound evidence record.
4. Unknown source status blocks unbounded admission.
5. Health-adjacent or authority-sensitive content is routed away from diagnosis-like claims.
6. User correction creates a revision reason and downgrades the prior interpretation.
7. Exported proof packets include source status, claim status, privacy status, missingness, and revision reason.

## UX copy pattern

- Source status: private architecture source, abstracted
- Claim status: design requirement, not verified implementation
- Privacy status: public-safe abstraction
- Missingness: runtime enforcement not yet verified
- Revision reason: created to prevent private memory from acting as public proof

## Success metric

A reviewer can inspect a reflection or public artifact and tell which sources were allowed to speak, which were only allowed to inform architecture, what was missing, and why the output is not overclaiming.
