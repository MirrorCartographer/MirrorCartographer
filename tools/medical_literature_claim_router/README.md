# Medical Literature Claim Router

Executable Mirror Cartographer component for routing medical/scientific literature notes by claim strength, source type, missingness, and review readiness.

Purpose: support cure/discovery ambition by preventing literature snippets from being treated as evidence, advice, or falsified discovery claims before source boundaries are explicit.

Public safety: this tool uses synthetic examples only. It is not medical advice and does not diagnose, treat, or recommend care.

## Input shape

JSON array of literature note objects:

- `note_id`: stable string
- `topic`: public-safe topic label
- `source_type`: one of `systematic_review`, `randomized_trial`, `observational_study`, `case_report`, `preprint`, `expert_opinion`, `unknown`
- `claim_text`: public-safe paraphrase
- `claim_status`: one of `background`, `candidate_association`, `mechanistic_hypothesis`, `clinical_guidance`, `cure_claim`, `unknown`
- `has_contradictions`: boolean
- `human_or_animal`: one of `human`, `animal`, `mixed`, `unknown`
- `privacy_status`: must be `public_safe` for pass
- `missingness`: array of missing fields or uncertainty labels
- `revision_reason`: why the note is being routed now

## Output shape

JSON object:

- `accepted`: notes safe for research memory
- `blocked`: notes blocked from promotion
- `routes`: route decisions by note id
- `summary`: counts by decision

## Routing rules

- Cure claims are always blocked.
- Clinical guidance requires systematic review or randomized trial and no contradictions.
- Preprints, case reports, expert opinion, and unknown sources cannot become guidance.
- Any private residue blocks the note.
- Any unknown source, unknown claim status, or missingness routes to `needs_review`.
- Contradictions route to `falsification_queue` unless privacy or cure-claim blocking applies first.

## Acceptance criteria

1. Valid synthetic fixtures produce deterministic routing.
2. Private residue is blocked.
3. Cure claims are blocked.
4. Contradictory non-private notes route to falsification.
5. Missing source/status metadata prevents promotion.

## Run

`python tools/medical_literature_claim_router/route_medical_literature_claims.py tools/medical_literature_claim_router/fixtures.synthetic.json`

## Test

`python tools/medical_literature_claim_router/test_route_medical_literature_claims.py`
