# PRD: Context Distillation Receipt Layer

Date: 2026-06-29
Status: public-safe product requirement

## Problem

Mirror Cartographer uses public repository material, private files, saved context, and research to build public-safe architecture. Existing labels can say source status, claim status, privacy status, and missingness. They do not yet prove how sensitive context was converted into safe public methods.

Without a Context Distillation Receipt, public artifacts can become either unsafe or over-flattened:

- unsafe if private details leak into public docs,
- over-flattened if all private-derived architecture is discarded,
- unreviewable if the transformation step is invisible.

## Goal

Add a public-safe receipt layer that records the transformation from source class to public artifact class.

## Non-goals

- Do not publish raw private context.
- Do not store household, health, animal-care, financial, location, relationship, credential, or transcript details.
- Do not claim clinical, diagnostic, legal, veterinary, or objective authority.
- Do not replace source citations or repository history.

## User story

As a reviewer of an MC artifact, I need to see whether private context influenced the artifact and exactly what type of abstract signal survived, so I can evaluate trust without seeing protected source material.

## Functional requirements

1. Every public artifact derived from private or mixed context must produce a receipt.
2. The receipt must label source status, claim status, privacy status, missingness, and revision reason.
3. The receipt must list excluded sensitivity classes.
4. The receipt must identify the abstract signal retained: method, requirement, question, criterion, index, schema, or plan.
5. The receipt must include a release verdict.
6. The receipt must include a contestability route.
7. The receipt must be inspectable without exposing raw source.

## Interface requirements

For public docs, show a compact block:

- Source class: mixed/private/public/research
- Claim class: supported/inference/hypothesis/question
- Privacy class: public-safe/public-safe after abstraction/internal-only/blocked
- Excluded details: category labels only
- Retained signal: abstract method or requirement
- Missingness: known gaps
- Revision reason: why changed
- Verdict: release/quarantine/block

## Evaluation criteria

- No protected detail appears in receipt.
- The retained signal is specific enough to evaluate.
- Claim status does not exceed evidence.
- Missingness is concrete.
- Reviewer can understand why the artifact exists.
- Reviewer can challenge the abstraction.

## Failure modes

- Receipt repeats private content in disguised form.
- Receipt says “private context used” but gives no transformation explanation.
- Receipt labels everything public-safe without excluded-class audit.
- Receipt implies evidence where only resonance or design inference exists.
- Receipt becomes decorative boilerplate.

## Release gate

A public artifact passes only when its receipt shows:

- no raw private content,
- clear abstract signal retained,
- bounded claim status,
- explicit missingness,
- release verdict justified.

## Product phrase

The receipt does not open the private room. It labels the door, the crossing, and the object allowed to leave.