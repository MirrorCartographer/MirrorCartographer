# Medical and Scientific Source Boundary Evaluation Schema

Date: 2026-07-05
Lane: medical research / scientific research / evaluations
Privacy class: public-safe abstraction only
Implementation status: initial GitHub artifact; ready to convert into JSON Schema and tests
Revision reason: build rotation identified that medical/scientific research needed executable structure rather than concept-only notes.

## Public-safe purpose

Mirror Cartographer needs a stricter boundary layer for medical, scientific, animal-care, and embodied-system reasoning. The system may use private context to understand user needs, but public artifacts must only contain abstracted methods, source-boundary rules, evaluation criteria, and implementation plans.

This artifact defines a public-safe evaluation schema for any MC output that touches medical or scientific claims. It is not medical advice, does not encode private cases, and does not contain personal, household, animal, financial, credential, location, relationship, or transcript details.

## Source status

External source status: current public sources checked on 2026-07-05.

Primary sources and high-quality references:

1. FDA, "Marketing Submission Recommendations for a Predetermined Change Control Plan for Artificial Intelligence-Enabled Device Software Functions," final guidance, August 2025. The FDA states that PCCPs should describe planned modifications, methodology to develop/validate/implement modifications, and impact assessment to support safety and effectiveness without requiring new marketing submissions for each planned modification. URL: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence
2. NIST, AI Risk Management Framework page. NIST states that AI RMF 1.0 is intended for voluntary use to incorporate trustworthiness considerations into AI design, development, use, and evaluation, and that NIST AI 600-1 identifies generative-AI-specific risks and risk management actions. URL: https://www.nist.gov/itl/ai-risk-management-framework
3. FUTURE-AI international consensus guideline. The guideline defines six principles for trustworthy AI in healthcare: Fairness, Universality, Traceability, Usability, Robustness, and Explainability. URL: https://arxiv.org/abs/2309.12325
4. MI-CLAIM-GEN checklist proposal for clinical generative modeling research. The proposal emphasizes reporting differences in training, evaluation, interpretability, reproducibility, cohort selection with unstructured clinical data, and ethical alignment for clinical generative AI. URL: https://arxiv.org/abs/2403.02558
5. TRIPOD-Code scoping review / emerging extension. It identifies code availability and repository documentation as reproducibility gaps in prediction model research. URL: https://arxiv.org/abs/2604.06212

Internal source status: private MC chats, saved context, and GitHub materials may inform architecture only. No private details are reproduced here.

## Claim status

Claim A: MC needs a stricter medical/scientific claim boundary than ordinary reflective or symbolic outputs.
Status: supported as a design requirement by external guidance emphasizing trustworthiness, traceability, validation, reproducibility, and change-control for AI systems in health-related contexts.

Claim B: Medical/scientific claims should carry source-grade labels and claim-strength labels before being reused downstream.
Status: supported as an implementation inference from NIST AI RMF trustworthiness framing, FDA PCCP change-control logic, FUTURE-AI traceability/robustness principles, and MI-CLAIM-GEN reproducibility/evaluation reporting expectations.

Claim C: MC can safely research medical/scientific topics if it separates public evidence, private context, inference, speculation, and action boundaries.
Status: plausible design decision; requires evaluation through synthetic fixtures and red-team tests.

## Privacy status

Allowed in public artifacts:

- Abstract medical/scientific evaluation methods
- Source-boundary labels
- Claim-strength taxonomies
- Research questions
- Synthetic examples
- Non-personal test fixtures
- Product requirements
- Implementation plans
- Safety warnings and escalation boundaries

Forbidden in public artifacts:

- Personal medical facts or symptoms
- Animal-care case details
- Household details
- Location details
- Relationship details
- Financial details
- Credentials or identity traces
- Raw transcripts
- Directly re-identifying combinations of facts
- Any inference that reconstructs private cases from abstractions

## Missingness

Missing from this initial artifact:

- Machine-readable JSON Schema file
- Test fixture suite
- Repository linter that rejects missing labels
- CI check for public-safe medical/scientific artifacts
- Crosswalk table mapping MC labels to NIST/FDA/FUTURE-AI/MI-CLAIM-GEN/TRIPOD-Code concepts
- Animal-care-specific adaptation using veterinary/public animal-health sources

## Evaluation schema

Each medical/scientific MC artifact should contain the following fields.

### 1. source_status

Required values:

- `primary_source`: official agency, guideline, peer-reviewed paper, standards body, clinical trial registry, or direct dataset documentation
- `secondary_source`: review, textbook-like explainer, reputable institutional summary
- `news_or_public_commentary`: reporting or opinion; useful for awareness, not dispositive evidence
- `private_context_only`: used only to select relevance; cannot be cited publicly or used as public evidence
- `unsourced`: allowed only for clearly marked hypotheses, questions, or design choices

Validation rule:

- Any medical/scientific claim with action implications must have at least one `primary_source` or be downgraded to `question`, `hypothesis`, or `needs_verification`.

### 2. claim_status

Required values:

- `established_fact`: strong consensus or authoritative standard
- `supported_finding`: evidence-backed but context-dependent
- `design_inference`: engineering/product inference derived from evidence
- `hypothesis`: plausible but not verified
- `speculation`: exploratory; not actionable
- `contraindicated_or_unsafe`: explicitly warned against or materially risky
- `needs_verification`: insufficient evidence or source conflict

Validation rule:

- `hypothesis`, `speculation`, and `needs_verification` cannot be presented as instructions.
- `contraindicated_or_unsafe` must include a boundary statement.

### 3. privacy_status

Required values:

- `public_safe`: contains no private details and no re-identifying composites
- `abstracted_from_private_context`: private material influenced the problem shape but no private details are exposed
- `private_do_not_publish`: may remain local/private only
- `redaction_required`: contains material that must be removed before publication

Validation rule:

- GitHub publication is allowed only for `public_safe` or `abstracted_from_private_context` artifacts.

### 4. action_boundary

Required values:

- `information_only`: explanatory content only
- `research_next_step`: recommends further reading, evidence collection, or professional consultation
- `engineering_next_step`: recommends schema, test, fixture, UI, or code work
- `clinical_or_veterinary_escalation`: directs user to qualified care without attempting diagnosis or treatment
- `do_not_act`: explicitly blocks unsafe self-directed action

Validation rule:

- Medical/scientific artifacts must not produce diagnosis/treatment instructions unless framed as general information and bounded by qualified-care guidance.

### 5. change_control

Required fields:

- `revision_reason`
- `source_date_checked`
- `material_change_detected`
- `downstream_artifacts_to_review`
- `rollback_needed`

Implementation inference:

- FDA PCCP logic is useful beyond regulated devices as a general design pattern: planned modifications, validation method, implementation method, and impact assessment should be tracked before MC changes medical/scientific reasoning behavior.

### 6. reproducibility_pack

Required fields:

- `source_urls`
- `query_or_search_terms`
- `artifact_path`
- `evidence_summary`
- `known_limits`
- `next_test`

Implementation inference:

- TRIPOD-Code and MI-CLAIM-GEN point toward explicit reporting of code, evaluation, cohort/data boundaries, interpretability, and reproducibility. MC should mirror this with a lightweight reproducibility pack even when the artifact is product research rather than a clinical model.

## Minimal synthetic fixture

```json
{
  "artifact_id": "synthetic-med-sci-boundary-001",
  "domain": "medical_scientific_reasoning",
  "source_status": ["primary_source", "abstracted_private_context_not_published"],
  "claim_status": "design_inference",
  "privacy_status": "abstracted_from_private_context",
  "action_boundary": "engineering_next_step",
  "claim": "Health-adjacent AI outputs require stricter provenance, claim-strength, and action-boundary labels than ordinary reflective outputs.",
  "evidence_basis": [
    "NIST AI RMF trustworthiness and evaluation framing",
    "FDA PCCP change-control framing for AI-enabled device software",
    "FUTURE-AI traceability/robustness principles",
    "MI-CLAIM-GEN reporting/reproducibility concerns"
  ],
  "forbidden_content_check": {
    "personal_health_details": false,
    "animal_case_details": false,
    "location_details": false,
    "raw_transcript": false,
    "reidentifying_composite": false
  },
  "next_test": "Create fixtures that intentionally omit source_status, claim_status, privacy_status, or action_boundary and verify that the linter rejects them."
}
```

## Acceptance criteria for next implementation

A follow-up implementation is complete when:

1. A JSON Schema exists for medical/scientific artifacts.
2. At least five synthetic pass/fail fixtures exist.
3. A linter or validation script rejects artifacts missing source, claim, privacy, action-boundary, missingness, revision, and implementation labels.
4. The linter rejects any artifact that contains private-like fields marked for public GitHub publication.
5. The artifact includes a source-boundary display suitable for answer-time summaries.
6. The schema can be reused for animal-care research without inserting private animal details.

## Next executable action

Create `schemas/medical_scientific_boundary.schema.json` and `tests/fixtures/medical_scientific_boundary/` with pass/fail fixtures for missing labels, unsupported action claims, private-context leakage, and stale source dates.
