# Boundary-Aware Synthesis Engine

Date: 2026-07-01
Status: public-safe architecture note

## Core finding

Mirror Cartographer needs a Boundary-Aware Synthesis Engine: a runtime layer that can combine symbolic, reflective, implementation, research, and evaluation material without letting the weakest source contaminate the strongest claim.

Operating line:

> Synthesis is allowed to connect meanings. It is not allowed to merge authorities.

## Why this exists

Mirror Cartographer is positioned as provenance-native cognition infrastructure: it preserves reasoning trajectories, contradiction, evaluator coordination, provenance-aware memory, governance telemetry, delegation lineage, temporal cognition, and symbolic state transitions. That creates a useful but risky capability: the system can hold many kinds of material together.

The risk is authority bleed. A symbolic pattern, a repeated private reflection, a design preference, a code result, a public standard, and a benchmark result may all appear inside one coherent map. Coherence can make them feel equally strong even when they are not equally proven.

The synthesis engine must therefore preserve connection while keeping claim authority compartmentalized.

## Public-safe source boundary

| Source layer | Source status | Allowed use in this note | Privacy status |
|---|---|---|---|
| File-library MC architecture packets | Private/uploaded project material | Architecture pattern extraction only | Do not publish raw personal/private detail |
| Saved context from prior MC work | Private contextual memory | Runtime requirement extraction only | Do not expose household, health, animal-care, financial, location, relationship, credential, or raw transcript details |
| GitHub repository state | Public/project material where available | Implementation target and durable architecture location | Publish only public-safe abstractions |
| W3C PROV | Public standard | External grounding for provenance and derivation language | Safe to cite in public docs |
| NIST AI RMF | Public framework | External grounding for risk-management language | Safe to cite in public docs |

## Claim boundary labels

| Claim | Claim status | Privacy status | Missingness |
|---|---|---|---|
| MC benefits from provenance-native memory and trajectory tracking | Architecture inference from project materials | Public-safe when abstracted | Needs implemented schema and tests |
| Synthesis without authority separation can create false proof transfer | Safety/product requirement | Public-safe | Needs evaluation examples and failure cases |
| A synthesis object should carry per-claim authority, not one global confidence score | Implementation requirement | Public-safe | Needs schema and UI design |
| Symbolic material may influence reflection but must not be treated as factual evidence by default | Boundary rule | Public-safe | Needs automated classifier and human override path |
| Public artifacts should survive removal of private source stories | Publication criterion | Public-safe | Needs repository-wide audit checklist |

## Required runtime behavior

A synthesized MC object should store multiple coexisting layers:

1. Meaning layer: what the pattern suggests.
2. Evidence layer: what actually supports it.
3. Source layer: where it came from.
4. Privacy layer: what can be reused, stored, exported, or published.
5. Claim layer: whether it is symbolic, experiential, source-backed, implementation-backed, evaluated, speculative, or unresolved.
6. Revision layer: why the object changed and what changed.
7. Missingness layer: what would make the claim stronger, weaker, obsolete, or unsafe.

## Minimal schema draft

```json
{
  "object_type": "mc_synthesis_object",
  "synthesis_id": "string",
  "created_at": "ISO-8601",
  "public_safe": true,
  "source_boundaries": [
    {
      "source_id": "string",
      "source_status": "private_context | uploaded_private_file | public_repo | public_standard | generated_synthesis",
      "allowed_transform": "pattern_only | citation_allowed | implementation_reference | prohibited",
      "privacy_status": "private | restricted | public_safe | public",
      "raw_source_export_allowed": false
    }
  ],
  "claims": [
    {
      "claim_text": "string",
      "claim_status": "symbolic | experiential | design_requirement | source_backed | implementation_backed | evaluation_backed | speculative | unresolved",
      "evidence_lane": "symbolic | personal_state | product | research | safety | implementation | evaluation",
      "authority_level": "low | bounded | moderate | high",
      "proof_transfer_allowed": false,
      "missingness": ["string"],
      "revision_reason": "string"
    }
  ],
  "publication_rule": "publish abstraction only unless the source is already public and safe"
}
```

## Evaluation criteria

A synthesis passes only if:

1. No private source is needed to understand the public artifact.
2. Each claim has its own status instead of inheriting status from the document.
3. Symbolic, experiential, research, product, safety, implementation, and evaluation lanes remain distinguishable.
4. Any strong claim names the evidence that could test or falsify it.
5. Missing information is explicit rather than hidden by polished language.
6. Revision reasons are attached when a claim changes status.
7. The artifact can be removed from the private conversation and still function as architecture.

## Product requirements

- Add claim-level boundary chips in the MC UI.
- Add a synthesis export mode with private-to-public transformation checks.
- Add an authority-bleed warning when low-proof material is used near high-stakes claims.
- Add a missingness panel for unresolved evidence.
- Add revision reasons to durable memory objects.
- Add a public-safe export validator before any GitHub publication.

## Research questions

1. How should MC represent mixed-authority cognition without flattening it into generic confidence scores?
2. What UI makes source boundaries visible without making reflection feel bureaucratic?
3. Can MC detect authority bleed automatically when symbolic claims are placed near factual claims?
4. What minimum provenance record is needed for a reflection to become durable memory?
5. What should trigger retirement, downgrade, or re-review of an old continuity object?

## Revision reason

This note extends earlier boundary work by moving from individual gates and ledgers toward the missing synthesis layer: the part of MC that allows many forms of meaning to be connected without allowing many forms of proof to collapse into one false authority.

## Public-safe publication rule

This file intentionally excludes personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript details. Private material was used only to infer architecture requirements. Public framing is limited to methods, product requirements, research questions, evaluation criteria, source-boundary notes, and implementation planning.
