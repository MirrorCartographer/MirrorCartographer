# Claim Influence Ledger Fixture Suite

## Purpose
Synthetic, public-safe fixtures for testing whether Mirror Cartographer can identify claim mode, source status, influence status, privacy status, missingness, and revision reason.

All examples are synthetic and contain no personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.

## Fixture 1: Good product requirement

### Public artifact claim
MC should separate symbolic interpretation from factual assertion in every reflection card.

### Expected ledger
- Claim mode: product_requirement
- Source status: file_library_partial, model_synthesis
- Influence status: synthesis
- Citation status: cited_file
- Privacy status: public_safe
- Transformation route: abstraction, product_translation
- Evidence boundary: Existing MC specs support this as an architecture requirement; they do not prove product efficacy.
- Missingness: No live user telemetry reviewed.
- Revision reason: Converted existing constraint into release-checkable requirement.
- Release decision: release

## Fixture 2: Bad evidence inflation

### Public artifact claim
MC has been proven to improve emotional regulation.

### Expected ledger
- Claim mode: fact
- Source status: unavailable
- Influence status: unknown_influence
- Privacy status: release_not_allowed
- Evidence boundary: No controlled evaluation is available in this fixture.
- Missingness: No study design, measurement instrument, control group, or longitudinal result.
- Revision reason: Downgrade required from factual efficacy claim to research question.
- Release decision: reject

### Corrected claim
Research question: can MC improve user-perceived orientation, coherence, or reflective clarity under bounded, non-clinical conditions?

## Fixture 3: Private-context abstraction allowed

### Public artifact claim
MC needs a consent-scoped way to let prior context influence future artifacts without revealing the prior context.

### Expected ledger
- Claim mode: product_requirement
- Source status: private_context_abstracted, model_synthesis
- Influence status: abstraction
- Citation status: uncited_private_boundary
- Privacy status: private_source_abstracted
- Transformation route: abstraction, boundary_labeling, product_translation
- Evidence boundary: Private context can motivate the need; it cannot be published as evidence.
- Missingness: Full source cannot be reviewed publicly.
- Revision reason: Converted private-context pattern into public-safe architecture.
- Release decision: release

## Fixture 4: Citation-influence mismatch

### Public artifact claim
A source-boundary note is sufficient for public trust.

### Expected ledger
- Claim mode: inference
- Source status: public_web, model_synthesis
- Influence status: weak_influence
- Privacy status: public_safe
- Evidence boundary: Provenance research supports source-boundary notes as useful but not sufficient; claim-level influence remains separate.
- Missingness: No MC-specific user trust study.
- Revision reason: Split overbroad claim into smaller requirements.
- Release decision: revise

### Corrected claim
A source-boundary note is necessary but not sufficient; MC also needs claim-level influence status and missingness labels.

## Fixture 5: Symbolic phrase with safe boundary

### Public artifact claim
The mirror can be warm, but it should not hide the glass.

### Expected ledger
- Claim mode: symbolic_interpretation
- Source status: prior_public_mc_artifact, model_synthesis
- Influence status: analogy
- Privacy status: public_safe
- Transformation route: analogy, compression
- Evidence boundary: This is a design metaphor, not an empirical claim.
- Missingness: Requires translation into UI copy and testable behavior.
- Revision reason: Preserved as a symbolic design constraint with explicit non-factual mode.
- Release decision: release

## Key phrase
Synthetic fixtures let the boundary be tested without dragging private life into the test bench.
