# PRD — Boundary Stack Manifest

## Product problem

Mirror Cartographer has many necessary boundary concepts. Without a compositional manifest, future artifacts can satisfy one label while bypassing another. This creates public-risk confusion: a text may be redacted but still overclaim, sourced but temporally stale, abstracted but not contestable, or resonant but unsupported.

## Product goal

Create a Boundary Stack Manifest that gives every public-safe MC artifact an ordered boundary pass before publication, evaluation, or reuse.

## Non-goals

- Do not expose private source material.
- Do not turn MC into a diagnostic, therapeutic, medical, legal, financial, or objective-truth authority.
- Do not collapse symbolic resonance into factual proof.
- Do not claim runtime implementation until verified in code.

## Users

- Public readers evaluating MC claims.
- Future implementers adding MC features.
- Researchers studying human-AI reflection boundaries.
- Safety reviewers testing overreach, memory, provenance, and privacy behavior.

## Functional requirements

1. Every artifact must declare `source_status`, `claim_status`, `privacy_status`, `temporal_status`, `release_scope`, `missingness`, and `revision_reason`.
2. Every artifact that uses mixed or private context must include a `gate_results` list.
3. The stack must distinguish pre-generation gates from post-generation review gates.
4. The UI must be able to collapse the full stack into a short visible label set.
5. Evaluation fixtures must test failures where redaction succeeds but release scope fails.
6. The manifest must support machine-readable schemas and human-readable explanations.

## Boundary order

1. Source Admission
2. Privacy Quarantine
3. Temporal Validity
4. Context Lineage
5. Evidence Before Belief
6. Operationalization Boundary
7. Release Scope
8. Public Proof Packet
9. Contestability Receipt
10. Compression Loss Ledger
11. Revision Provenance
12. Deployment Boundary

## Acceptance criteria

- A public artifact cannot pass without a release-scope verdict.
- A redacted artifact can still fail if the remaining claim overreaches.
- A symbolic interpretation must identify itself as symbolic, not factual authority.
- A memory-derived claim must include temporal status.
- A repo/demo claim must distinguish existence, implementation, readiness, and evidence.
- A reader can tell how to contest the claim without seeing the private source.

## Privacy requirements

The product must block raw transcript details, personal details, household facts, health details, animal-care details, financial facts, precise locations, relationship details, credentials, and private source excerpts.

## Implementation phases

### Phase 1 — Documentation
Add manifest, schema, scorecard, and fixtures.

### Phase 2 — Artifact linting
Add a simple artifact checklist that rejects missing labels.

### Phase 3 — Runtime metadata
Add `boundary_stack_version` and `gate_results` to generated reflection outputs.

### Phase 4 — UI display
Show compact visible labels: `source`, `claim`, `privacy`, `time`, `scope`, `contestability`.

### Phase 5 — Evaluation harness
Run fixtures against model outputs and mark pass/fail by boundary type.
