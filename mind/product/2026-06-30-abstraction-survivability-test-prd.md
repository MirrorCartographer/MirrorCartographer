# PRD: Abstraction Survivability Test

Status: public-safe product requirement
Date: 2026-06-30

## Problem

Mirror Cartographer needs to learn from private context without turning private context into public material. Existing labels can mark source and claim boundaries, but they do not by themselves prove that a redacted finding remains useful after private details are removed.

## Goal

Add a reviewer-facing and eventually UI-facing gate that tests whether an abstracted finding can be safely published as method, schema, evaluation criteria, research question, product requirement, index, or implementation plan.

## Non-goals

- Publishing raw transcript content.
- Publishing personal, household, health, animal-care, financial, location, relationship, credential, or private biographical details.
- Claiming that symbolic recurrence proves factual truth.
- Replacing clinical, legal, financial, veterinary, or emergency authority.

## User story

As a reviewer or builder, I need to know whether an MC artifact derived from private interaction context has been transformed enough to be public-safe while still preserving real product value.

## Required interface fields

Each candidate public artifact should show:

- Source status
- Claim status
- Privacy status
- Missingness
- Revision reason
- Abstraction type
- Release reason
- Redaction reason
- Survivability result

## States

- Draft: artifact not yet checked.
- Revise: useful but labels or redaction are incomplete.
- Quarantine: depends on private detail or creates reconstruction risk.
- Publishable: abstraction survives without private details.
- Rejected: abstraction becomes empty or unsafe after redaction.

## Acceptance criteria

1. A candidate artifact cannot be marked Publishable unless it includes source status, claim status, privacy status, missingness, and revision reason.
2. Any private-sensitive category causes automatic Quarantine unless removed.
3. Any unsupported factual claim must downgrade to hypothesis, research question, or implementation proposal.
4. A public artifact must include a reusable rule, test, schema, product requirement, implementation plan, evaluation criterion, or research question.
5. The UI must make missingness visible rather than hiding it in footnotes.
6. The system must preserve user correction and reviewer downgrade history.

## Evaluation plan

Create a test set of candidate abstractions:

- clearly public-safe method;
- useful but under-labeled method;
- privacy-leaking example;
- overclaimed symbolic inference;
- source-missing factual claim;
- abstracted but empty statement;
- strong implementation plan derived from private architecture pressure.

Measure:

- privacy leak detection;
- claim downgrade accuracy;
- reviewer agreement;
- usefulness after redaction;
- false quarantine rate;
- false publishable rate.

## Revision reason

This PRD converts the research note into a buildable gate. It exists because boundary labels are necessary but not sufficient: public release also needs proof that the abstraction still does work after redaction.
