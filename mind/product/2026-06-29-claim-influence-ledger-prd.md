# Product Requirement: Claim Influence Ledger

## Product thesis
Mirror Cartographer should expose a public-safe Claim Influence Ledger for released artifacts. The ledger shows how each claim was shaped without exposing protected source material.

## Problem
Public artifacts can be safe from direct leakage but still opaque. A reader may see citations, labels, or polished language without knowing whether the claim was grounded, inferred, symbolically interpreted, or mostly synthesized.

This creates four risks:
1. citation theater,
2. private-context laundering,
3. symbolic language being mistaken for evidence,
4. public artifacts becoming persuasive without inspectable influence boundaries.

## User-facing requirement
Every released MC artifact should include, or be able to generate, a compact influence ledger with:

- claim mode,
- source status,
- influence status,
- privacy status,
- missingness,
- evidence boundary,
- revision reason.

## Non-goals
- Do not reveal raw private context.
- Do not publish personal source excerpts.
- Do not imply that symbolic resonance proves correctness.
- Do not turn citations into authority if the source only weakly influenced the claim.
- Do not require users to read a full audit report before understanding the artifact.

## Functional requirements

### FR1: Claim extraction
The system splits a public artifact into claim units.

### FR2: Claim mode assignment
Each claim receives exactly one primary mode:
- fact,
- inference,
- symbolic interpretation,
- speculation,
- product requirement,
- research question,
- evaluation criterion,
- implementation plan.

### FR3: Influence classification
Each claim records whether it was shaped by:
- public web source,
- file-library source,
- GitHub source,
- private abstracted context,
- model synthesis,
- prior public MC artifact.

### FR4: Boundary statement
Each claim includes a plain-language boundary explaining what the sources can and cannot prove.

### FR5: Privacy-pass enforcement
If a claim depends on protected context, the ledger must show the influence class without exposing the raw content.

### FR6: Missingness disclosure
Every claim must name at least one relevant missingness item, even if minor.

### FR7: Revision reason
Any claim that changes between versions must record why: new source, privacy tightening, claim split, mode correction, evidence downgrade, or implementation clarification.

## Acceptance criteria
- A reader can identify which claims are factual versus interpretive.
- A reviewer can see when private context influenced a public artifact without seeing the private content.
- A symbolic claim cannot masquerade as empirical evidence.
- A public claim can be downgraded, split, or held without breaking the artifact.
- The ledger remains readable by screen readers and does not depend on code blocks.

## Public-safe fixture types
- Product requirement derived from abstracted private-context pattern.
- Research question derived from public research gap.
- Evaluation criterion derived from file-library architecture.
- Implementation plan derived from GitHub repository state.

## Release gate
Do not release an artifact if:
- claim mode is unclear,
- private source is visible,
- missingness is blank,
- evidence boundary overstates what the source proves,
- symbolic interpretation is framed as fact,
- influence status is unknown and the claim is high-impact.

## Key phrase
The claim may travel, but its influence boundary has to travel with it.
