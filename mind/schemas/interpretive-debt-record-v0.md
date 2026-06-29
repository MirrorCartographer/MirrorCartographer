# InterpretiveDebtRecord v0

## Public-safe status

- Source status: Abstracted schema proposal from MC governance work and public accountability research.
- Claim status: Schema proposal; not a runtime implementation.
- Privacy status: Public-safe. Contains no private examples or raw source material.
- Missingness: Field names may need revision after implementation against real artifact workflows.
- Revision reason: Adds a structured way to preserve uncertainty created by interpretation before verification.

## Purpose

Track the review debt created when an interpretive move is useful enough to influence MC output but not yet verified enough to act as settled authority.

## Record fields

| Field | Required | Description |
|---|---:|---|
| debt_id | yes | Stable identifier for the debt record. |
| created_at | yes | Date/time the debt was opened. |
| artifact_path | yes | Public-safe path or artifact identifier influenced by the interpretation. |
| interpretive_move | yes | Public-safe description of the abstraction, inference, metaphor, compression, or synthesis. |
| source_boundary_class | yes | Public, private-context-derived, mixed, synthetic, external-research-derived, or unknown. |
| claim_mode | yes | Fact, inference, symbolic interpretation, speculation, product requirement, research question, evaluation criterion, or implementation plan. |
| claim_status | yes | Confirmed, inferred, bounded speculation, unresolved, contradicted, retired, or needs review. |
| privacy_status | yes | Public-safe, internal-only, needs redaction, unsafe to publish, or blocked. |
| missingness | yes | What is not known, not checked, or not available. |
| reliance_risk | yes | Low, medium, high, or forbidden. |
| authority_risk | yes | Whether the interpretation could be mistaken for diagnosis, instruction, proof, identity labeling, legal/financial/medical/veterinary authority, or objective truth. |
| counterexample_needed | no | What evidence would weaken or overturn the interpretation. |
| allowed_use_before_repayment | yes | What the interpretation may influence while still unpaid. |
| disallowed_use_before_repayment | yes | What the interpretation may not influence while still unpaid. |
| repayment_action | yes | Verification, user review, external citation, design test, source audit, redaction review, counterexample search, or retirement. |
| revision_reason | yes | Why the interpretation changed, survived, was demoted, or was retired. |
| status | yes | Open, reduced, repaid, retired, escalated, or blocked. |

## Status semantics

- Open: useful but not yet checked.
- Reduced: some evidence or constraint lowered the risk, but debt remains.
- Repaid: sufficient review exists for the intended claim mode.
- Retired: no longer used.
- Escalated: requires stronger review before use.
- Blocked: cannot be resolved with available sources or permissions.

## Non-goals

- Does not expose private source text.
- Does not prove an interpretation true.
- Does not replace citations, user consent, release gates, or safety boundaries.
- Does not convert symbolic resonance into factual authority.
