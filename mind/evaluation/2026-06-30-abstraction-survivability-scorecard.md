# Abstraction Survivability Scorecard

Status: public-safe evaluation criteria
Date: 2026-06-30

## Purpose

Score whether a private-context-informed Mirror Cartographer artifact can safely become public method without exposing private content or becoming empty.

## Scoring scale

0 = fail
1 = weak / incomplete
2 = adequate
3 = strong

## Criteria

### 1. Source labeling

- 0: no source status
- 1: vague source status
- 2: source status present but missing partiality or limits
- 3: source status includes public/private/missing/partial boundaries

### 2. Claim routing

- 0: claim lane absent or overclaimed
- 1: claim lane implied but not explicit
- 2: claim lane labeled but not downgraded when needed
- 3: every claim is routed to supported, hypothesis, research question, implementation proposal, or rejected

### 3. Privacy preservation

- 0: exposes private detail
- 1: removes direct details but allows reconstruction
- 2: mostly public-safe with minor review risk
- 3: no sensitive private detail and no reconstructive path

### 4. Abstraction utility

- 0: nothing useful remains after redaction
- 1: general principle only
- 2: reusable but incomplete method
- 3: reusable method with clear application path

### 5. Missingness disclosure

- 0: missing sources hidden
- 1: missingness mentioned generically
- 2: missingness listed
- 3: missingness tied to claim downgrade or next research step

### 6. Revision trace

- 0: no reason for creation/change
- 1: generic revision note
- 2: meaningful revision reason
- 3: revision reason explains what gap was closed relative to prior artifacts

### 7. Evidence-load fit

- 0: source is asked to carry too much
- 1: source mismatch risk
- 2: source generally fits the claim
- 3: source load is explicitly bounded and downgraded where needed

## Pass threshold

Publishable requires:

- total score of at least 18 out of 21;
- privacy preservation score of 3;
- claim routing score of at least 2;
- missingness disclosure score of at least 2;
- no automatic quarantine trigger.

## Automatic failure

A candidate fails immediately if it includes private household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Recommended output labels

- Publishable: score 18-21 and no hard failure.
- Revise: score 12-17 or incomplete labels.
- Quarantine: privacy risk or reconstruction risk.
- Reject: low utility or unsafe claim.

## Revision reason

This scorecard operationalizes the Abstraction Survivability Test so reviewers can apply it consistently instead of relying on intuition.
