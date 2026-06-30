# Sequence Risk Ledger

## Status labels

- Source: Fresh public research synthesis, 2026-06-30
- Claim: Individually permitted actions can compose into an unauthorized or unsafe workflow; governance must evaluate action sequences, not only single actions.
- Privacy: Public-safe. No personal health data, private user data, credentials, or non-public repository information included.
- Missingness: Needs testing against existing Mirror Cartographer artifacts and at least three practical workflow examples.
- Revision: Initial Genesis artifact.
- Confidence: High for the governance pattern; medium for Mirror Cartographer implementation details until used in repository review.
- Evidence maturity: Early operational design pattern supported by current AI-agent governance literature.

## Core concept

A **Sequence Risk Ledger** records when a chain of individually acceptable steps creates a combined effect that was never explicitly authorized.

The important unit is not only:

> Is this action allowed?

The stronger governance question is:

> What process is being created by this sequence of allowed actions?

## Why this belongs in the GitHub Mind

Mirror Cartographer has already developed primitives for claim custody, action authority, exit authority, handoff integrity, trace sufficiency, continuity review, and threshold-linked governance. The missing connective tissue is sequence-level risk.

A claim can be sourced correctly, transferred with context, reviewed on schedule, and still become unsafe if later steps compose into a higher-authority workflow.

## Pattern

1. A source is gathered.
2. A claim is formed.
3. A tool or document uses the claim.
4. Another tool inherits the output.
5. A later action relies on accumulated context.
6. The total workflow now has more consequence than any single step appeared to have.

The ledger exists to preserve that sequence.

## Ledger fields

| Field | Purpose |
|---|---|
| Sequence ID | Stable identifier for the action chain |
| Starting observation | What began the sequence |
| Intermediate transformations | How the claim changed between steps |
| Tool or actor at each step | Who or what changed the state |
| Authority at each step | What permission level each step had |
| Combined effect | What the sequence now enables |
| New risk created by composition | The risk that did not exist in any single step |
| Required checkpoint | Pause, review, escalation, rollback, or retirement |
| Exit authority | Who or what can stop the sequence |
| Revision trigger | What new evidence or context changes the sequence status |

## Governance invariant

**Permission does not automatically compose.**

A step that is safe alone may become unsafe when chained with other safe steps.

## Relationship to existing GitHub Mind primitives

- Evidence Chain: records why the claim exists.
- Claim Custody Chain: records who handled the claim.
- Action Authority Ladder: records what action level is permitted.
- Handoff Integrity: prevents orphaned claims during transfer.
- Exit Authority: defines how continuation can be stopped.
- Continuity Review Loop: rechecks state over time.
- Sequence Risk Ledger: records whether the combined workflow has exceeded its intended authority.

## Practical use

Before any artifact moves from documentation support toward decision support or intervention authority, ask:

1. What actions have already occurred because this claim exists?
2. What future actions does this chain now make easier?
3. Did any person explicitly authorize the whole sequence, not just the parts?
4. Does the sequence need a pause, review, or exit trigger?

## Public sources

- Christopher Koch, "From Governance Norms to Enforceable Controls: A Layered Translation Method for Runtime Guardrails in Agentic AI," arXiv, 2026-04-06. https://arxiv.org/abs/2604.05229
- Krti Tallam, "A Five-Plane Reference Architecture for Runtime Governance of Production AI Agents," arXiv, 2026-06-10. https://arxiv.org/abs/2606.12320
- Rafflesia Khan, Declan Joyce, Mansura Habiba, "AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI," arXiv, 2025-12-02. https://arxiv.org/abs/2512.03180
- Chandra Prakash, Mary Lind, Avneesh Sisodia, "Agentic AI Governance and Lifecycle Management in Healthcare," arXiv, 2026-01-22. https://arxiv.org/abs/2601.15630
- Reuters, "US HHS launches AI initiative to detect fraud and waste in health programs," 2026-05-21. https://www.reuters.com/legal/litigation/us-hhs-launches-ai-initiative-detect-fraud-waste-health-programs-2026-05-21/
- Financial Times, "You can't blame AI for mistakes, regulator tells auditors," 2026-03-30. https://www.ft.com/content/f39c0d8d-c15a-4143-9baf-464d7c5e5b01

## Revision path

Promote only after this ledger successfully identifies a sequence-level risk that was not visible from source, claim, or authority labels alone.