# Frontier To Build: Provenance-Gated RAG Evaluation

Date: 2026-07-05

## Public-safe finding

Mirror Cartographer should treat retrieval provenance as an executable safety surface, not as explanatory decoration. The strongest current frontier signal is convergence across RAG evaluation, clinical AI provenance, AI audit trails, and HCI trust work: systems that generate source-bound answers need explicit traceability from query, retrieval, evidence rank, source permission, source class, answer claim, and final user-facing boundary display.

## Source status

- Source class: public web research only.
- Private-context use: none in this artifact except abstract architectural continuity from prior MC public-safe requirements.
- Source boundary: no raw chats, personal data, household details, health details, animal-care details, financial details, relationship details, credential details, or location details are included.
- Primary/high-quality sources preferred: arXiv/academic papers, PMC/Frontiers article, AMA policy reporting, ACM/HCI venue page, and technical RAG evaluation literature.

## Claim status

- Claim A: Audit trails are becoming a core requirement for accountable LLM systems.
  - Status: supported by public 2026 audit-trail literature.
  - Caveat: implementation norms are still emerging and not standardized across consumer AI products.
- Claim B: Clinical and evidence-based domains require source verification, provenance metadata, and retrospective auditability for trustworthy AI support.
  - Status: supported by 2026 clinical AI provenance framework and AMA transparency/evidence-based-care reporting.
  - Caveat: MC should not claim clinical decision-support capability without domain-specific validation and regulatory review.
- Claim C: RAG quality must be evaluated at retrieval and generation levels, including evidence perturbation/ablation rather than only answer readability.
  - Status: supported by current RAG evaluation work and production RAG practice discussions.
  - Caveat: MC should distinguish academic findings from vendor/practitioner claims.

## Privacy status

Public-safe. This file contains only abstract architecture, product requirements, evaluation criteria, and implementation planning. It contains no personal/private transcript content.

## Missingness

- No full repository-wide coverage audit was performed in this run.
- No code file was changed in this run; this is a requirements/evaluation artifact.
- No MC runtime logs were inspected.
- No private files were used.
- Need follow-up implementation: create a machine-readable schema and test fixture for provenance-gated answer evaluation.

## Meaningful revision reason

Prior MC research artifacts established public-safe retrieval boundaries and provenance compression. This update strengthens the executable layer: every answer should be testable against source provenance requirements before display.

## Implementation requirement: Provenance-Gated RAG Evaluation

### Product requirement

Before an MC answer is shown, the system should produce a compact provenance capsule for each material claim. The display layer may compress this for users, but the evaluation layer must retain enough structure to audit whether the answer was source-grounded, permission-safe, and privacy-safe.

### Minimum provenance capsule fields

```json
{
  "answer_id": "string",
  "claim_id": "string",
  "claim_text": "string",
  "claim_type": "fact | inference | design_decision | speculation | recommendation | refusal | uncertainty",
  "retrieval_used": true,
  "source_ids": ["string"],
  "source_classes": ["public_web | public_repo | private_context_abstracted | user_provided | internal_generated | none"],
  "source_permission": "public | private_allowed_for_reasoning_only | user_supplied_current_turn | unavailable",
  "privacy_status": "public_safe | private_context_abstracted | blocked_private_detail | needs_review",
  "evidence_strength": "strong | moderate | weak | unsupported | contradictory",
  "missingness": ["string"],
  "display_boundary_required": true,
  "allowed_to_publish": false,
  "review_notes": "string"
}
```

### Gate rules

1. If `claim_type` is `fact` and `source_ids` is empty, mark `evidence_strength=unsupported` and require either abstention, caveat, or source search.
2. If `source_classes` includes `private_context_abstracted`, public output must not include raw details and must include a privacy boundary label.
3. If `privacy_status` is `blocked_private_detail` or `needs_review`, block public publication.
4. If `claim_type` is `recommendation` in medical, veterinary, legal, financial, or safety-sensitive contexts, require current source verification and boundary language.
5. If retrieved sources conflict, answer must include uncertainty/missingness rather than collapse to one confident claim.
6. If a source is used only to inspire architecture and not to support a factual claim, label it as `design_context`, not `evidence`.

### Evaluation criteria

- Traceability: Can each material claim be traced to source IDs or explicitly labeled as inference/design/speculation?
- Boundary clarity: Can a reviewer tell which parts came from public sources, private abstraction, or generated synthesis?
- Privacy safety: Does the answer avoid raw private details when publishing to GitHub or public artifacts?
- Contradiction behavior: Does the system surface conflict instead of flattening it?
- Missingness honesty: Does the answer state what was not inspected or not verified?
- Actionability: Does the output produce a next executable artifact, not just a concept?

### Synthetic fixture idea

Create three synthetic answer cases:

1. `public_source_supported`: all factual claims have public source IDs; publication allowed.
2. `private_context_leak_attempt`: answer tries to include raw private details; publication blocked.
3. `conflicting_sources`: sources disagree; answer must retain uncertainty and mark missingness.

### Acceptance criteria

- A linter can reject publication when a provenance capsule contains blocked private detail.
- A test suite can verify that unsupported factual claims are flagged.
- A UI contract can show a compressed source-boundary badge without exposing private source content.
- A repository artifact can distinguish evidence, inference, design choice, and speculative research question.

## Source index

- Audit Trails for Accountability in Large Language Models, arXiv, 2026-01-28.
- An auditable and source-verified framework for clinical AI decision support integrating RAG with data provenance, Frontiers/PMC, 2026.
- AMA reporting on transparency and evidence-based care in health AI, 2026-06-10.
- A Retrieval-Augmented Generation Evaluation Framework, arXiv, 2026.
- Re-examining XAI in the Era of Agentic AI, ACM IUI Workshop, 2026.
- Frontiers article on AI authorship/provenance and trust in news, 2026.

## Implementation status

- GitHub artifact added: this requirements/evaluation note.
- Code status: not yet implemented.
- Next executable action: add `schemas/provenance-capsule.schema.json` and `tests/fixtures/provenance_gate_cases.json` with the three synthetic fixture cases above.
