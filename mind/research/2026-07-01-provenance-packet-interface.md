# Provenance Packet Interface

Date: 2026-07-01
Status: public-safe research note

## Core finding

Mirror Cartographer needs a Provenance Packet Interface: a compact, machine-readable wrapper that travels with every reflection, research note, export, public page, evaluation artifact, and implementation plan.

Operating line:

> MC should not only produce meaning. It should attach the custody record that lets meaning be trusted, limited, revised, or refused.

## Why this matters

MC is positioned across symbolic reflection, public explanation, implementation, governance, and evaluation. Prior notes already establish that MC must preserve claim type, source boundary, privacy status, missingness, and revision reason. The missing next layer is a portable packet shape that lets those labels move with the artifact instead of living only in prose.

A provenance packet makes each output inspectable without exposing the private material that shaped it. It lets public readers see whether a statement is private-context-derived architecture, GitHub-derived implementation evidence, web-derived research grounding, synthetic example, or unresolved requirement.

## External grounding

This note is aligned with public provenance and AI-risk patterns:

- W3C PROV defines provenance as information about entities, activities, and people involved in producing data or things, useful for assessing quality, reliability, and trustworthiness. Source: https://www.w3.org/TR/prov-overview/
- W3C PROV also emphasizes derivation, generation, attribution, versioning, reproducibility, and provenance-of-provenance as core provenance requirements. Source: https://www.w3.org/TR/prov-overview/
- NIST AI RMF frames AI governance as risk management across the AI lifecycle and provides a public reference point for documenting and managing AI system risk. Source: https://www.nist.gov/itl/ai-risk-management-framework
- OWASP LLM01:2025 identifies prompt injection risks from direct and indirect inputs and recommends clear boundaries, output validation, input/output filtering, least privilege, human approval for high-risk actions, external-content segregation, and adversarial testing. Source: https://genai.owasp.org/llmrisk/llm01-prompt-injection/

## MC-specific design implication

The packet should not reveal private source material. It should expose only the safety-critical metadata needed to decide whether an artifact can be reused, published, tested, implemented, or trusted.

Minimum packet fields:

1. `artifact_id` — stable identifier for the output.
2. `artifact_type` — reflection, research note, index, implementation plan, product requirement, evaluation, public explanation, synthetic example, or boundary note.
3. `source_status` — private-context-derived, GitHub-derived, web-derived, synthetic, mixed, or unknown.
4. `claim_status` — symbolic, product requirement, implementation, research question, evaluation, safety boundary, source boundary, or public explanation.
5. `privacy_status` — public-safe, transformed-private, synthetic-only, needs-review, or do-not-publish.
6. `authority_type` — experiential, symbolic, code-backed, source-backed, evaluator-backed, policy-backed, or unverified.
7. `allowed_uses` — publish, reuse internally, use as method, use as roadmap, test only, cite as source-backed, or block.
8. `forbidden_uses` — diagnosis, factual proof, personal reconstruction, implementation claim, public evidence, or automated action.
9. `missingness` — what was not inspected, unavailable, intentionally excluded, or unsafe to expose.
10. `revision_reason` — why the artifact was created or changed.
11. `revision_history` — previous status, new status, reason, reviewer or process label, and date.
12. `source_boundary_note` — short human-readable explanation of what private context was allowed to become.
13. `validation_state` — untested, self-audited, source-checked, code-verified, adversarially tested, or retired.

## Product requirement

MC exports should fail closed if a provenance packet is missing or internally contradictory.

Examples of fail-closed conditions:

- `privacy_status` is `needs-review` or `do-not-publish` and `allowed_uses` includes `publish`.
- `claim_status` is `implementation` but `validation_state` is not `code-verified` or source-backed.
- `source_status` is `private-context-derived` and `forbidden_uses` does not include `personal reconstruction`.
- `authority_type` is `symbolic` and `allowed_uses` includes `cite as source-backed`.
- `artifact_type` is `public explanation` and `missingness` is blank.

## Evaluation criteria

A provenance packet passes if:

1. A reader can tell what kind of artifact it is.
2. A reader can tell what kind of authority it carries.
3. A reader can tell what it is not allowed to prove.
4. A reviewer can block publication without inspecting private raw material.
5. The packet can survive export as structured data.
6. The packet makes revision history visible.
7. The artifact remains understandable after private details are removed.

## Research questions

- What is the smallest packet schema that preserves enough custody information without making the interface unusable?
- Should packets be visible to end users, administrators, public readers, or only export/review systems?
- How should MC represent symbolic resonance without letting it be mistaken for external evidence?
- Can packets be mapped to W3C PROV entities, activities, agents, derivations, and bundles without overengineering the MVP?
- What automated tests catch authority drift before publication?

## Implementation plan

1. Define a `ProvenancePacket` type in the durable-note/export layer.
2. Require packet generation before save, export, publish, or GitHub write.
3. Add deterministic validation for fail-closed contradictions.
4. Add a public-safe transformation checklist before `privacy_status` can become `public-safe`.
5. Add a `revision_history` array to every exported artifact.
6. Add adversarial fixtures for private-detail leakage, roadmap-as-implementation, symbolic-as-factual, and missingness omission.
7. Add a renderer that can show the packet as a compact public label or expanded audit view.

## Source status

Mixed: derived from public-safe MC File Library materials, prior GitHub mind notes, and public web standards/security references. Private context shaped the architectural need only. No raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying private details are included.

## Claim status

Product requirement, source-boundary note, research question, evaluation criterion, and implementation plan.

## Privacy status

Public-safe transformed architecture. No private source content is exposed.

## Missingness

This note did not inspect the full private UI repository code, database schema, deployed export behavior, or all historical MC files. It should be treated as a design requirement and schema proposal until code inspection and implementation verification are completed.

## Meaningful revision reason

Added because prior MC mind notes define boundaries, claim classes, and authority preservation, but they still need a portable structured packet that can travel with artifacts and be enforced by product code.
