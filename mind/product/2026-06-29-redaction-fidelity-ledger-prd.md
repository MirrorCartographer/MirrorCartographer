# PRD: Redaction Fidelity Ledger

Status: product requirement draft
Privacy status: public-safe
Claim status: design requirement

## Problem

MC research and product artifacts can be shaped by private-context understanding. Publishing raw source material is unsafe and inappropriate, but publishing only generic abstractions can erase the method. MC needs a repeatable way to show that private detail was removed while structural insight survived.

## Product goal

Create a ledger layer that accompanies public-safe MC artifacts and records:

- what kind of source shaped the artifact;
- what detail classes were removed;
- what invariant was preserved;
- what claim mode is being made;
- what is missing;
- why the artifact was revised or released.

## Non-goals

- Do not expose private source text.
- Do not create a re-identification trail.
- Do not imply legal, medical, therapeutic, veterinary, financial, or diagnostic authority.
- Do not treat symbolic fit as evidence of factual correctness.

## User-visible behavior

For each public-safe artifact, show a compact boundary bill:

- Source status.
- Claim status.
- Privacy status.
- Missingness.
- Revision reason.

Expanded mode reveals the Redaction Fidelity Ledger without revealing private content.

## System behavior

Before release, the system checks:

1. Are private details absent?
2. Is the preserved invariant explicit?
3. Is the claim mode downgraded when evidence is weak?
4. Is missingness visible?
5. Is the artifact useful without becoming personally revealing?

## Acceptance criteria

- A reviewer can identify the preserved method without seeing private source details.
- A reviewer cannot infer specific private facts from the artifact.
- Claim status is visible and conservative.
- Missingness is not buried.
- Revision reason explains why the artifact exists.
- The artifact can be contested or downgraded.

## Future implementation

- Add ledger metadata to public-safe compiler outputs.
- Add automatic private-class risk scan.
- Add reviewer checklist before public release.
- Add fixture suite with synthetic examples only.
- Add exportable boundary bill for public artifacts.
