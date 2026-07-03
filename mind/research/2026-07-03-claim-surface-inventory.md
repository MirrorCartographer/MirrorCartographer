# Claim Surface Inventory

Date: 2026-07-03
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a **Claim Surface Inventory**: a governance layer that lists every surface where MC makes, implies, formats, visualizes, exports, or routes a claim, then assigns the required source, evidence, privacy, style, and release boundaries for that surface.

Operating line: **A claim is not only what the system says; it is where, how, and under what surface it becomes legible.**

## Source status

- Source class: mixed architecture review.
- Inputs used: existing repository governance notes, public-safe file-library summaries, abstracted private-context orientation, and prior MC product/research direction.
- Private-context use: architecture-orientation only.
- Published content: abstracted method only; no raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying operational details.

## Claim status

- Claim type: product/governance architecture requirement.
- Confidence: medium-high.
- Evidence basis: MC materials describe multiple output surfaces: reflective dialogue, symbolic mapping, session memory, exportable artifacts, governance/provenance framing, public packets, runtime specs, indexes, and evaluation notes. Existing governance notes already define gates for evidence, privacy, missingness, release, visual grammar, consent projection, mode/claim separation, and gate dependency. This note adds an inventory layer so the system can locate where claims actually appear before applying gates.
- Not claimed: that every current MC surface has been enumerated, implemented, or empirically validated.

## Privacy status

- Public-safe: yes.
- Contains private details: no.
- Re-identification risk: low, because the note describes claim-routing architecture rather than source content.
- Publication boundary: suitable for repository documentation, product requirements, evaluation criteria, implementation planning, and future schema design.

## Missingness

Current missing items:

1. A canonical list of claim surfaces.
2. A typed distinction between explicit, implied, visual, narrative, interface, memory, and action claims.
3. A machine-readable claim-surface manifest.
4. A mapping from each surface to required gates.
5. Tests proving that claims cannot move to stronger surfaces without upgraded evidence and privacy status.
6. A report view showing which public artifacts contain unsupported, ambiguous, or over-styled claims.

## Revision reason

Earlier notes defined gates and dependencies, but a gate cannot protect a claim if the system has not first identified the surface where the claim appears. This note adds the inventory step before routing, evidence grading, redaction, release, or implementation.

## Claim surface types

MC should classify surfaces at minimum as:

- `reflection_surface`: conversational or session output returned to a user.
- `memory_surface`: persisted continuity state, symbol history, or state graph entry.
- `export_surface`: downloadable or shareable artifact.
- `public_surface`: website, packet, README, whitepaper, social thread, or repo note.
- `visual_surface`: diagram, body map, glyph, chart, interface state, or spatial arrangement.
- `implementation_surface`: schema, code behavior, route, component, API, or product requirement.
- `evaluation_surface`: test, rubric, benchmark, audit, review, or release checklist.
- `action_surface`: recommendation, next step, operational instruction, or external handoff.

## Minimum inventory fields

For each claim surface, record:

- surface_id
- surface_type
- artifact_or_route
- claim_text_or_claim_pointer
- claim_mode
- explicit_or_implied
- source_status
- claim_status
- privacy_status
- evidence_tier
- missingness_status
- required_gates
- allowed_destinations
- disallowed_destinations
- revision_reason
- last_reviewed

## Product requirement

MC should run a claim-surface inventory before public release, memory persistence, export, implementation, or action routing. The system should not assume that only plain declarative sentences carry claims. Visuals, poetic voice, interface labels, mode names, examples, demos, and product flows can all imply claims.

## Evaluation criteria

A Claim Surface Inventory passes if:

1. It detects claims in public packets, README-style descriptions, whitepaper sections, diagrams, interface copy, and implementation notes.
2. It distinguishes explicit claims from implied claims.
3. It routes symbolic or mythopoetic surfaces through style and evidence gates before publication.
4. It prevents private-context-shaped claims from entering public artifacts without source-boundary labeling.
5. It marks unverified product capability claims as draft, planned, simulated, or implemented.
6. It makes unsupported claims visible as missingness rather than converting them into polished certainty.
7. It produces a reviewable manifest that another evaluator can inspect without needing private source access.

## Implementation plan

1. Create `/mind/indexes/claim-surfaces.yml` with canonical surface types and definitions.
2. Create `/mind/indexes/claim-surface-rules.yml` mapping surface types to required gates.
3. Add a scanner checklist for public artifacts that flags claim verbs, capability verbs, causal language, mode labels, evidence language, and action language.
4. Add a release-check rule: no public artifact can publish without a completed claim-surface pass.
5. Add tests for explicit claim detection, implied claim detection, visual claim detection, unsupported capability language, private-context boundary language, and overclaim downgrade.

## Example abstract manifest

```yaml
surface_id: cs-001
surface_type: public_surface
artifact_or_route: public-readme
claim_pointer: project-definition-paragraph
claim_mode: canonical
explicit_or_implied: explicit
source_status: repo_review_plus_public_safe_file_summary
claim_status: architecture_positioning
privacy_status: public_safe
evidence_tier: source_bounded_conceptual\missingness_status: implementation_evidence_partial
required_gates:
  - evidence_tier_output_router
  - mode_claim_separation_contract
  - public_artifact_release_gate
  - gate_dependency_ledger
allowed_destinations:
  - repository_documentation
  - product_requirement
  - evaluation_plan
disallowed_destinations:
  - clinical_claim
  - verified_user_outcome_claim
  - private_case_example
revision_reason: inventory before release routing
```

## Research question opened

How can MC inventory claims across language, visual structure, memory state, implementation behavior, and public artifacts without turning every creative or reflective output into a slow compliance burden?
