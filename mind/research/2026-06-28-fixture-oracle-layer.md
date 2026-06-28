# Fixture Oracle Layer

## Source status
- Source type: public-safe synthesis from available Mirror Cartographer materials, repository README boundaries, and current AI transparency / AI literacy / clinical documentation reporting.
- Private-context use: private context was used only to understand the architecture's direction. No personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript detail is included.
- Repository comparison: builds after the public-safe fixture library and fixture runner concepts. The runner says synthetic cases should be runnable and allowed to fail the system safely; this note adds the missing expected-output oracle.

## Claim status
- Claim type: architectural proposal.
- Confidence: medium-high for product architecture; medium for market usefulness; low for any clinical or social-care outcome claim.
- Not claimed: this does not prove clinical validity, therapeutic effect, diagnostic ability, or regulatory compliance.

## Privacy status
- Public-safe.
- Uses only abstract methods, evaluation requirements, and source-boundary language.
- No private examples are included.

## Missingness
- No full automated test harness is inspected here.
- No canonical fixture corpus is yet confirmed.
- No human reviewer rubric is yet versioned.
- No inter-rater reliability process is yet defined.

## Revision reason
The previous fixture runner turns synthetic cases into runnable tests. A runner without an expected-output oracle can execute but cannot reliably decide whether the system preserved source boundaries, claim boundaries, privacy boundaries, audience contracts, and revision logic.

## Core finding
Mirror Cartographer now needs a Fixture Oracle Layer: a public-safe expected-output specification for each synthetic fixture.

A fixture is the fake case.
A runner is the execution path.
An oracle is the expected boundary behavior.

## Why this matters
The system should not merely ask whether an output sounds good. It should ask whether the output did what the fixture required.

The oracle checks whether the artifact:
1. preserves source status,
2. labels claim status,
3. avoids private leakage,
4. stays inside the intended evidence lane,
5. routes uncertainty into a next action,
6. refuses or narrows unsafe claims,
7. records missingness,
8. records the transformation from input to public output,
9. produces a reviewable release decision.

## Minimum oracle fields
- fixture_id
- input_lane
- intended_audience
- allowed_output_types
- blocked_output_types
- expected_source_status
- expected_claim_status
- expected_privacy_status
- expected_missingness
- expected_router_state
- expected_review_requirement
- expected_public_release_state
- expected_revision_reason
- failure_conditions
- reviewer_notes

## Example synthetic fixture class
Do not use real private material. Use abstract fixture classes such as:

- symbolic reflection with no evidence claim
- care-support observation requiring human review
- product artifact requiring public release check
- governance note requiring provenance disclosure
- audience mismatch requiring narrowing
- private-origin material requiring abstraction
- overclaim trap requiring refusal or downgrade

## Evaluation rule
A fixture run passes only when the actual output matches the expected oracle across source, claim, privacy, evidence lane, router state, and release state.

## Income lane
The practical wedge is a documentation-readiness / AI-output-governance audit:

"We test whether your AI-generated public artifacts preserve provenance, privacy boundaries, claim boundaries, and audience contracts under synthetic stress cases."

This is more concrete than selling Mirror Cartographer as a broad symbolic system. It creates a narrow service category: public-output boundary testing for AI-assisted documentation.

## Medical / social-care lane
The evidence-based lane remains communication support, not diagnosis or treatment. A fixture oracle can test whether care-support outputs preserve observation status, uncertainty, consent boundaries, and qualified human review requirements.

Safe support use cases:
- preparing questions for a professional,
- organizing observations,
- separating observation from interpretation,
- tracking what is unknown,
- making review needs explicit.

Unsafe claims remain blocked:
- diagnosis,
- treatment direction,
- emergency triage replacement,
- certainty from symbolic patterning,
- private-data publication.

## Research fit
Recent AI literacy work emphasizes moving from uncritical use toward critical evaluation. Provenance and transparency work supports process-level documentation rather than simple output labels. Ambient clinical documentation reporting reinforces review, consent, privacy, and error boundaries.

## Key phrase
A runner tells the case to move. An oracle tells the boundary what should survive.
