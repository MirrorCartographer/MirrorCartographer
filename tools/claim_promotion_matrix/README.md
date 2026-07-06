# Claim Promotion Matrix

The Claim Promotion Matrix is a public-safe Mirror Cartographer evaluation component that decides whether a research claim is ready to move forward, stay in evidence gathering, route to contradiction review, or be blocked.

It supports cure/discovery infrastructure by preventing claims from advancing on expressive force alone. Promotion requires measurable variables, provenance, falsification route, privacy boundary, implementation status, and contradiction handling.

## Input

A JSON file containing a list of claim packets.

Each packet uses this shape:

- `id`: stable public-safe packet id
- `claim`: concise claim text
- `domain`: one of `scientific_ai`, `medical_ai_evidence`, `mechanistic_biology`, `neuroscience`, `animal_health_research`, `longitudinal_data`, `hci`, `privacy_memory`, `symbolic_translation`
- `source_status`: one of `synthetic`, `primary`, `secondary`, `mixed`, `unknown`
- `claim_status`: one of `hypothesis`, `supported`, `contradicted`, `inconclusive`, `overclaimed`
- `privacy_status`: one of `public_safe`, `deidentified`, `private_risk`, `blocked`
- `implementation_status`: one of `not_started`, `specified`, `implemented`, `tested`
- `measurable_variables`: list of measurable variable names
- `evidence_links`: list of evidence/provenance references
- `falsification_route`: concrete route that could disconfirm the claim
- `missingness`: list of known missing items
- `contradictions`: list of known contradictions or failed results
- `next_executable_action`: concrete next action

## Output

The CLI emits a JSON list of decisions:

- `promote`: claim may move to prototype/test planning
- `gather_evidence`: claim is plausible but under-supported
- `contradiction_review`: claim has unresolved contradictions
- `block`: claim is private-risk, overclaimed, unmeasurable, or unfalsifiable

## Acceptance criteria

A packet can be promoted only when it is public-safe/deidentified, not overclaimed, contains at least two measurable variables, has evidence/provenance, has a falsification route, has a concrete next executable action, and has no unresolved contradictions.

## Test command

`python tools/claim_promotion_matrix/test_score_claim_promotion_matrix.py`
