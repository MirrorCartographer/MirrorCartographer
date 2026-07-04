# Public-Safe Traceability Manifest

## Core finding

Mirror Cartographer needs a **Public-Safe Traceability Manifest**: a lightweight manifest attached to each public artifact, research note, demo, export, evaluation, or implementation plan that records what kind of source material informed it, what claim strength is allowed, what privacy boundary applies, what is missing, and why the artifact changed from any earlier form.

## Operating line

**A public artifact should not only be safe at the moment it is written; it should remain traceable enough that future maintainers can see what source class, claim class, privacy class, and revision reason produced it.**

## Source status

- **Available private-context class:** prior Mirror Cartographer conversations, saved architecture memory, and recurring public-safe research outputs.
- **Available GitHub class:** connected private GitHub repository metadata and write access confirmation.
- **Unavailable / not inspected in full:** raw chat transcripts, full repository tree, complete prior research file bodies, live production telemetry, user studies, legal review, and third-party security review.
- **Source-boundary rule:** private-context material may inform architecture understanding only. It is not public evidence and must not be quoted, reconstructed, indexed by personal detail, or used as demo data.

## Claim status

- **Claim type:** product-method requirement and governance architecture proposal.
- **Claim strength:** design recommendation, not empirical validation.
- **Evidence basis:** repeated architecture pattern across prior public-safe research increments: source boundaries, claim gates, maturity ladders, redaction regression, source rehydration gates, and boundary-compatible evidence compilation.
- **Not claimed:** that this protocol is legally sufficient, externally audited, empirically validated, or already implemented in runtime code.

## Privacy status

- **Public-safe:** yes, if kept abstract and method-level.
- **Private details included:** none.
- **Forbidden content classes:** personal, household, health, animal-care, financial, location, relationship, credential, raw transcript, screenshots of private work, or identifying examples.
- **Fixture rule:** examples must be synthetic, generic, or externally sourceable. No private-context-derived examples should be transformed into public fixtures.

## Missingness

The current architecture lacks a visible manifest standard that can travel with public artifacts across repositories, demos, exports, docs, and evaluation harnesses. Prior notes define gates and compilers, but a future maintainer still needs a compact object that answers:

1. What source classes informed this artifact?
2. Which sources are allowed to be cited publicly?
3. What claim strength is allowed?
4. What privacy status applies?
5. What evidence is missing?
6. What revision reason produced the current version?
7. What demotion path exists if a claim is later found too strong?

## Proposed manifest fields

```yaml
artifact_id: ""
artifact_type: "research_note | demo | export | evaluation | requirement | implementation_plan | interface_copy"
source_status:
  private_context_used_for_architecture: true
  public_sources_cited: []
  github_material_used: []
  unavailable_sources: []
claim_status:
  type: "method | requirement | hypothesis | evaluation_result | implementation_fact"
  strength: "draft | design_recommendation | tested_internal | externally_validated"
  allowed_public_language: ""
privacy_status:
  classification: "public_safe_abstract | public_with_citations | private_do_not_publish"
  forbidden_detail_classes_checked: true
  synthetic_fixture_required: true
missingness:
  known_gaps: []
  evidence_needed_before_stronger_claim: []
revision:
  revision_reason: "new | correction | boundary_tightening | demotion | implementation_update"
  meaningful_change_summary: ""
  previous_artifact_relation: "none | supersedes | narrows | expands | corrects"
demotion_path:
  trigger: ""
  action: "relabel | redact | retract | move_private | split_claim"
```

## Product requirement

Every public-facing MC artifact should include either:

- a full traceability manifest, or
- a short manifest header linking to a full manifest stored beside the artifact.

Minimum required labels:

- Source status
- Claim status
- Privacy status
- Missingness
- Revision reason

## Evaluation criteria

A public artifact passes the traceability check if a reviewer can answer the following without reading private source material:

1. Is the artifact based on private architecture context, public evidence, implementation inspection, or synthetic examples?
2. Does the artifact clearly distinguish design recommendation from tested behavior?
3. Does the artifact avoid private or identifying examples?
4. Does the artifact state what evidence is missing?
5. Does the artifact explain why it exists or why it changed?
6. Can a future reviewer demote or retract the claim without reconstructing private context?

## Implementation plan

1. Add a reusable manifest template under `mind/templates/public-safe-traceability-manifest.yaml`.
2. Add a short markdown version for research notes.
3. Add a review checklist to public-safe publication workflow.
4. Add a redaction-regression test that fails if a manifest contains forbidden private-detail classes.
5. Add a maturity transition rule: no artifact can move from private architecture note to public demo without a traceability manifest.

## Revision reason

This note extends prior public-safe research by shifting from individual gates and checklists toward a portable traceability object that can accompany any MC artifact across modes, repositories, demos, and evaluations.

## Public-safe index tags

- public-safe
- traceability
- source-boundary
- claim-status
- privacy-status
- missingness
- revision-ledger
- evaluation-criteria
- implementation-plan
