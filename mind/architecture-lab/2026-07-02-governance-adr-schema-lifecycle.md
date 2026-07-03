# Governance ADR Schema + Lifecycle Pattern

Date: 2026-07-02
Status: proposed
Public-safety level: public-safe; private material must remain abstracted

## Architecture question

How should MC define an Architecture Decision Record (ADR) schema and lifecycle so every intentional governance change—new schema fields, compatibility policy changes, extension namespaces, graph semantics, runner behavior, or CI policy—has a durable, machine-readable decision artifact that can be referenced from `artifact.manifest.v1` and the governance graph?

## Research basis

Current ADR practice and recent research point to three useful constraints:

1. ADRs should preserve architectural rationale, not only the final choice. The durable unit is the decision plus context, consequences, alternatives, and status.
2. Lightweight templates are preferable for adoption. Recent empirical comparison found Nygard-style ADRs and MADR-style ADRs among the strongest candidates; Nygard favors concise objective documentation, while MADR adds more structure for architectural requirements.
3. Automated ADR generation and review are context-sensitive. Recent 2026 research indicates that generation quality improves when a small window of prior ADRs is supplied as context, while broad all-history context can add cost and noise.
4. Automated decision-compliance checks are useful for explicit, code-inferable decisions, but weaker for implicit deployment or organizational decisions. MC should therefore design ADRs so tool-checkable obligations are explicit and separately listed.
5. Architecture-description standards distinguish architecture from architecture descriptions and emphasize stakeholder concerns, viewpoints, rationale, and known inconsistencies. MC should preserve that separation: the ADR is a decision artifact inside the architecture-description layer, not the architecture itself.

Sources consulted:

- Michael Nygard / ADR pattern and adr-tools convention: https://github.com/joelparkerhenderson/architecture-decision-record
- MADR project/template: https://adr.github.io/madr/
- Thoughtworks Technology Radar on ADRs: https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records
- ISO/IEC/IEEE 42010 overview: https://www.iso.org/standard/74393.html
- Gupta et al., 2026, `Context Matters: Evaluating Context Strategies for Automated ADR Generation Using LLMs`: https://arxiv.org/abs/2604.03826
- Nogueira et al., 2026, `One Size Fits All? An Empirical Comparison of ADR Templates regarding Comprehension, Usability, and Ease of Adoption`: https://arxiv.org/abs/2604.27333
- Su et al., 2026, `Evaluating Large Language Models for Detecting Architectural Decision Violations`: https://arxiv.org/abs/2602.07609

## Change in understanding

The previous governance graph work defined artifacts, manifests, lineage, compatibility, graph indexing, and query/result contracts. The missing layer is not another generic note format. The missing layer is a **decision control plane**.

MC needs ADRs that are:

- human-readable enough to preserve rationale;
- machine-readable enough to be indexed into the governance graph;
- explicit about compatibility impact;
- explicit about enforceable checks;
- linked to manifests, schemas, fixtures, runners, and generated reports;
- public-safe by default.

This changes the architecture from:

```text
schema change -> commit
```

to:

```text
proposed governance change
        ↓
ADR
        ↓
compatibility classification
        ↓
affected artifacts
        ↓
new or updated fixtures
        ↓
CI-enforceable obligations
        ↓
manifest + graph references
        ↓
merge
```

## Design pattern

### Pattern name

Machine-readable governance ADR.

### Intent

Use an ADR as the canonical decision artifact for intentional changes to MC governance architecture.

### Applicability

Create a governance ADR when a change affects any of the following:

- schema fields or validation behavior;
- compatibility policy;
- artifact manifest structure;
- graph node or edge semantics;
- query/result contract;
- fixture corpus policy;
- runner/builder exit codes;
- check-code namespaces;
- extension namespaces;
- CI merge gates;
- public/private safety boundary for governance artifacts.

Do not require an ADR for typo fixes, prose clarification that does not alter behavior, or additive examples that do not change contracts.

## Proposed `governance.adr.v1` shape

This is a schema sketch, not yet the canonical JSON Schema file.

```json
{
  "adr_id": "ADR-0001",
  "title": "Adopt artifact.manifest.v1 as the discovery point for governance artifacts",
  "status": "proposed | accepted | superseded | rejected | deprecated",
  "decision_date": "2026-07-02",
  "deciders": ["mc-governance"],
  "public_safety": {
    "classification": "public-safe",
    "private_material_policy": "abstract-only"
  },
  "context": {
    "problem": "Governance artifacts need machine-traversable identity and lineage.",
    "forces": ["determinism", "compatibility", "human readability", "CI enforcement"],
    "prior_adrs": ["ADR-0000"]
  },
  "decision": {
    "summary": "Every governance artifact carries one manifest.",
    "chosen_option": "self-describing manifest",
    "alternatives_considered": [
      {
        "option": "infer identity from path",
        "reason_rejected": "filesystem layout is not a stable API"
      }
    ]
  },
  "consequences": {
    "positive": ["graph discovery becomes deterministic"],
    "negative": ["artifact authors must maintain manifest metadata"],
    "risks": ["stale manifests if CI does not validate them"]
  },
  "compatibility": {
    "classification": "backward-compatible | forward-compatible | full | breaking | none",
    "requires_major_version": false,
    "migration_required": false
  },
  "affected_artifacts": [
    {
      "artifact_id": "artifact.manifest.v1",
      "relationship": "defines | modifies | supersedes | constrains | validates"
    }
  ],
  "enforcement": {
    "check_codes": ["GOVERNANCE_ADR/ADR_PRESENT"],
    "required_fixtures": ["pass-basic-adr.json"],
    "ci_gate": true
  },
  "lineage": {
    "supersedes": [],
    "superseded_by": [],
    "related_to": []
  },
  "references": [
    {
      "label": "MADR template",
      "url": "https://adr.github.io/madr/"
    }
  ]
}
```

## Lifecycle rules

### Status values

- `proposed`: drafted but not yet authoritative.
- `accepted`: binding governance decision.
- `rejected`: considered and intentionally not adopted.
- `deprecated`: still historically valid but no longer preferred.
- `superseded`: replaced by another ADR; must include `superseded_by`.

### Immutability rule

Accepted ADRs are append-only except for metadata corrections. Material decision changes require a new ADR that supersedes the old one.

### Compatibility rule

Any ADR that changes a schema, query contract, manifest field, edge semantic, fixture policy, exit-code class, or check-code namespace must declare compatibility impact.

### Enforcement rule

If an ADR declares `ci_gate: true`, then the linked check codes must appear in the relevant validator, builder, runner, or compatibility report before the ADR can move to `accepted`.

### Graph rule

Every ADR becomes a node in `governance.graph.v1` with typed edges to affected artifacts.

Initial edge types:

- `decides`
- `modifies`
- `supersedes`
- `constrains`
- `requires_fixture`
- `requires_check`
- `references_source`

### Manifest rule

Every artifact manifest may reference ADRs under a future field such as:

```json
"decisions": {
  "defined_by": ["ADR-0001"],
  "modified_by": ["ADR-0007"],
  "superseded_by": []
}
```

This should be added only after `governance.adr.v1.schema.json` exists.

## Requirements update

1. Add `governance.adr.v1.schema.json` before the next round of schema expansion.
2. Add a tiny ADR fixture corpus:
   - `pass-basic-accepted-adr.json`
   - `fail-missing-status.json`
   - `fail-superseded-without-superseded-by.json`
   - `fail-ci-gate-without-check-code.json`
3. Extend the governance graph builder to index ADR nodes after manifest graph indexing is stable.
4. Extend `artifact.manifest.v1` with ADR references only after ADR schema and fixtures pass.
5. Keep all ADRs public-safe: no personal medical, financial, relational, or private identity details; use abstract system language.

## Public-safe abstraction rule

Private/personal material may influence what questions are important, but ADRs must record only reusable architecture decisions. Replace personal context with abstract terms such as:

- `operator`
- `user cognitive workflow`
- `private source`
- `sensitive input`
- `public-safe derived artifact`
- `governance boundary`

## Resulting architecture layer

```text
Architecture change
        ↓
Governance ADR
        ↓
ADR schema validation
        ↓
Compatibility declaration
        ↓
Affected artifact references
        ↓
Fixture obligations
        ↓
CI check-code obligations
        ↓
Manifest references
        ↓
Governance graph node + edges
```

## Next research question

How should MC define `governance.adr.v1.schema.json` and the first ADR fixture corpus so ADR lifecycle rules, supersession edges, compatibility declarations, public-safety fields, and CI-enforcement obligations are schema-valid before ADR graph indexing begins?
