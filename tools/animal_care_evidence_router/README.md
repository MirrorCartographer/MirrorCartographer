# Animal Care Evidence Router

Executable Mirror Cartographer component for organizing animal-care observations into safe evidence-boundary routes.

Purpose: prevent pet-health notes from becoming premature cure claims or veterinary advice while preserving structured signals for longitudinal tracking, clinician review, and hypothesis generation.

Public-safety boundary:
- Uses synthetic fixture data only.
- Does not diagnose, prescribe, or recommend treatment.
- Routes records into evidence queues: `track`, `needs_vet_review`, `urgent_boundary`, `hypothesis_candidate`, or `insufficient_data`.

Input shape:

Each packet is an object with:
- `packet_id`: stable string id.
- `species`: `dog`, `cat`, or `other`.
- `observation_date`: ISO date string.
- `signals`: array of observable signs.
- `context`: array of non-identifying context tags.
- `source_status`: source label.
- `claim_status`: claim boundary label.
- `privacy_status`: privacy label.
- `missingness`: array of missing fields or uncertainties.

Output shape:

The CLI writes JSON with:
- `packet_id`
- `route`
- `risk_flags`
- `evidence_boundary`
- `safe_summary`
- `next_executable_action`

Acceptance criteria:

1. Blocks diagnosis/treatment wording into `needs_vet_review` or `urgent_boundary`.
2. Routes sparse packets to `insufficient_data`.
3. Routes repeated measurable signs to `hypothesis_candidate` when missingness is acceptable.
4. Keeps all summaries public-safe and non-identifying.
5. Emits deterministic JSON.

Run:

`python tools/animal_care_evidence_router/route_animal_care_evidence.py tools/animal_care_evidence_router/fixtures.synthetic.json`

Test:

`python tools/animal_care_evidence_router/test_route_animal_care_evidence.py`
