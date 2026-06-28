# Public-Safe Fixture Library

## Summary
Mirror Cartographer's current gate and router architecture needs a testable fixture layer. The next public-safe evolution is a library of fictional or synthetic cases that exercise source, claim, privacy, audience, evidence, transformation, review, release, and revision gates without exposing private material.

## Strongest Attractor
Discovery.

The mind has moved from defining gates to routing gates. The missing step is proof-through-simulation: can the gates behave consistently on repeatable test cases?

## Core Finding
MC needs a Public-Safe Fixture Library.

A fixture is a synthetic source packet designed to test one or more gate behaviors. It should contain no real personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Why This Matters
The repository has already defined a Gate-to-Action Router. That router becomes much stronger if each routing state can be tested against known examples.

Without fixtures, MC risks judging artifacts only by intuition. With fixtures, the system can test whether a packet should be published, revised, narrowed, abstracted, reviewed, held private, or discarded.

## Fixture Types
1. `clean_public_method`: already abstracted method with no sensitive origin.
2. `overspecific_private_origin`: contains fictional details that must be abstracted.
3. `claim_overreach`: makes a stronger factual claim than the evidence supports.
4. `missing_source`: lacks provenance and must route to revise or hold.
5. `wrong_audience`: safe content aimed at the wrong reader.
6. `health_adjacent_observation`: fictional support observation that must stay non-diagnostic.
7. `income_offer_overclaim`: practical offer that promises results beyond proof.
8. `beautiful_but_uncertain`: polished language that hides missingness.
9. `generated_as_discovered`: symbolic/generated structure incorrectly treated as discovered evidence.
10. `review_required`: public-safe but requires qualified human review before release.

## Method
For each fixture:

1. Provide a fictional source packet.
2. Label source status.
3. Label claim status.
4. Label privacy status.
5. Identify missingness.
6. Assign evidence lane.
7. Define audience contract.
8. Compile a public-safe version.
9. Produce ViewDiff.
10. Apply gate-to-action router state.
11. Record expected outcome.
12. Record revision reason.

## Product Requirement
Every gate or compiler should have at least one fixture proving:

- expected pass behavior
- expected block behavior
- expected abstraction behavior
- expected review behavior
- expected revision behavior

## Research Questions
- Do multiple reviewers route the same fixture to the same state?
- Which labels most reduce accidental overclaiming?
- Does ViewDiff help users see what was transformed rather than merely removed?
- Can fictional fixtures train the system without leaking private origin material?
- Does a fixture library make MC more externally legible to governance, healthcare-adjacent, research, or documentation audiences?

## Evaluation Criteria
A fixture-library pass succeeds when:

- no fixture contains private real-world details
- every fixture has a declared expected router state
- every state is represented by at least one fixture
- every privacy boundary is visible
- every evidence lane stays lane-specific
- every revision reason is understandable
- every public output preserves missingness rather than smoothing it away

## Fresh Research Fit
Recent AI literacy work argues for movement from uncritical use toward critical evaluation and improvement-oriented practice. A fixture library operationalizes that idea by turning MC's own outputs into reviewable exercises.

Recent trust-and-reliance research warns that trust can reduce appropriate discrimination between correct and incorrect AI suggestions. Fixtures give reviewers a way to practice rejecting overclaims.

Ambient clinical documentation research shows that AI drafts may be substantially transformed by clinicians before final notes. This supports MC's need to preserve transformation records and distinguish draft, review, and final states.

Current reporting on ambient scribes reinforces privacy, consent, error, and oversight concerns. That makes fictional fixtures preferable to private transcript examples for public development.

## Source Status
- GitHub-derived: builds on the Gate-to-Action Router and its explicit missingness around lack of fixtures.
- File-library derived: public-safe abstraction from MC operational connector materials, proof lanes, evidence gates, and continuity maps.
- Web-derived: 2026 AI literacy, trust/reliance, ambient documentation, and AI-scribe governance research.

## Claim Status
Architectural proposal and implementation plan. Not empirical validation.

## Privacy Status
Public-safe. Uses synthetic case categories only. Contains no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Missingness
No executable fixture runner exists yet. No reviewer agreement testing has been performed. The fixture categories need conversion into concrete synthetic examples.

## Revision Reason
The prior router made gate outcomes actionable. This revision adds a testing layer so routing behavior can be evaluated without using private material.

## Key Phrase
A gate proves itself on fixtures before it earns trust on memory.
