# PRD: Cross-Lane Contamination Firewall

Status: public-safe product requirement
Privacy status: abstract methods only
Revision reason: converts the cross-lane contamination finding into implementable MC requirements.

## Problem

Mirror Cartographer is designed to connect symbolic, emotional, somatic, narrative, technical, research, and governance structures. That connection is valuable. The risk is false proof transfer: a pattern from one lane begins to authorize a claim in another lane without meeting the receiving lane's proof standard.

## Goal

Add a firewall that lets MC connect meaning across lanes while keeping evidence, proof standards, safety boundaries, authority, and domain claims separate.

## Non-goals

- Do not publish private context.
- Do not infer clinical, legal, financial, or identity conclusions.
- Do not turn symbolic interpretations into facts.
- Do not claim deployment quality without build/deploy evidence.
- Do not claim product efficacy without user study or evaluation data.

## User-visible behavior

For any output with meaningful lane crossing, MC should display:

- source status
- claim status
- privacy status
- missingness
- revision reason when relevant
- connection map
- proof map
- grounded next step

## System behavior

When an output draws from multiple lanes, the system must create or simulate a bridge record containing:

- source lane
- destination lane
- transfer object
- transfer type
- allowed authority
- forbidden authority
- destination proof standard
- review trigger

## Modes

Canonical mode:

- strongest firewall
- claims must be source-bound
- interpretation must be minimal

Reflective mode:

- symbolic connection allowed
- proof authority remains explicitly limited

Mythopoetic mode:

- imaginative synthesis allowed
- must be labeled as symbolic/speculative
- must not produce factual or action-authorizing claims without Canonical review

## Acceptance tests

1. Given a symbolic input and a factual question, MC labels the symbolic material as meaning, not evidence.
2. Given a file artifact and a product claim, MC says the file proves artifact existence only, not product efficacy.
3. Given a public-safe summary derived from private context, MC labels it as abstracted private source shape, not publishable raw evidence.
4. Given stale and current repo-state signals, MC marks repository state as uncertain unless fresh file/build evidence is fetched.
5. Given a cross-domain output, MC lists what each lane may and may not prove.

## Implementation plan

1. Add `lane_id` and `proof_standard` to output metadata.
2. Add `connection_map` and `proof_map` sections to generated responses.
3. Add bridge-record generation for any cross-lane transfer.
4. Add hard fail rules for forbidden private categories.
5. Add evaluator prompts using the scorecard.
6. Add fixture suite with synthetic examples only.

## Public-safe release note

This feature is a claim-boundary and interpretation-governance layer for reflective AI UX. It is not a therapy, diagnosis, surveillance, or truth-certification feature.
