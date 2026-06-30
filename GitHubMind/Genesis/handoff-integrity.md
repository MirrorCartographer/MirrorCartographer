# Handoff Integrity

## Status

Genesis artifact. Public-safe. Initial version.

## Attractor

Contradiction.

The contradiction this artifact resolves: systems often preserve a claim but lose responsibility when that claim moves between people, tools, documents, workflows, or institutions.

Mirror Cartographer already separates symbol, claim, evidence, authority, action boundary, review, exit authority, and threshold-linked governance. The missing primitive is the transfer rule: what must remain intact when a claim moves from one context to another.

## Core claim

A claim is not safely transferred unless its governance state transfers with it.

Handoff Integrity means that any movement of a claim must preserve enough context for the receiver to know:

1. what the claim says,
2. where it came from,
3. what evidence supports it,
4. what is missing,
5. what authority it has,
6. what action boundary applies,
7. what would trigger review, escalation, pause, reversal, or retirement,
8. who remains accountable if it is used incorrectly.

## Public-safe definition

Handoff Integrity is the discipline of preventing orphaned claims.

An orphaned claim is a statement that survives after its source, uncertainty, authority boundary, or revision condition has been stripped away.

## Relation to existing GitHub Mind

Handoff Integrity connects and constrains these prior primitives:

- Evidence Chain: what must travel with the claim.
- Claim Custody Chain: who touched or transformed it.
- Minimum Viable Trace: the minimum transferable unit.
- Governed Trace: the full trace context.
- Two-Plane Governance: knowledge and action transfer separately.
- Nondelegable Accountability Boundary: responsibility does not disappear during transfer.
- Exit Authority: the receiver must know how to stop or reverse the workflow.
- Continuity Review Loop: transferred claims require later review.
- Threshold-Linked Governance: transfer must preserve advance, pause, escalate, and retire thresholds.

## Handoff rule

Before a claim crosses a boundary, attach a Handoff Card.

### Handoff Card fields

- Claim:
- Source status:
- Evidence maturity:
- Transformation history:
- Missingness:
- Confidence:
- Knowledge state:
- Action authority:
- Risk level:
- Allowed use:
- Not allowed use:
- Review trigger:
- Escalation trigger:
- Exit authority:
- Accountability holder:
- Revision status:

## Practical test

Ask:

Would the next person, tool, document, or workflow understand the limits of this claim without asking the original author?

If not, the handoff is not intact.

## Income lane

Handoff Integrity can become a concrete deliverable inside an AI Governance Readiness Assessment.

Possible service module:

AI Claim Handoff Audit

Deliverables:

- identify orphaned claims in AI-assisted documents,
- reconstruct missing source and authority labels,
- classify allowable and non-allowable downstream use,
- produce Handoff Cards for high-risk claims,
- recommend review and escalation thresholds.

This is commercially realistic because organizations using AI for audits, documentation, healthcare workflows, public services, and internal operations increasingly need proof that AI-assisted outputs can be reconstructed, governed, and reviewed.

## Medical and social-care lane

Handoff Integrity is especially important in care contexts because documentation can shape later decisions. The safe role for Mirror Cartographer is not diagnosis or treatment authority. The safe role is continuity support: preserving observations, uncertainty, sources, user corrections, clinician decisions, and review triggers so that later readers do not mistake a symbolic or AI-assisted interpretation for established clinical fact.

## Source labels

- Source 1: Audit Trails for Accountability in Large Language Models, arXiv, 2026-01-28. Supports durable lifecycle records, context-rich ledgers, approvals, waivers, attestations, and reconstructability.
- Source 2: Agentic AI Governance and Lifecycle Management in Healthcare, arXiv, 2026-01-22. Supports lifecycle controls, agent identity, runtime enforcement, kill-switch triggers, decommissioning, credential revocation, and audit logging.
- Source 3: AI Trust OS, arXiv, 2026-04-06. Supports telemetry-first continuous governance, observability, evidence over manual attestation, and architecture-backed proof.
- Source 4: The Guardian, 2026-02-11, reporting on Ada Lovelace Institute findings about AI-generated social-work record errors. Supports the care-documentation risk that inaccurate AI summaries may enter official records.
- Source 5: Financial Times, 2026-03, reporting UK FRC guidance that auditors cannot blame AI for mistakes. Supports nondelegable human or institutional accountability.

## Claim labels

- Claim: A claim is not safely transferred unless its governance state transfers with it.
- Claim type: Governance architecture.
- Confidence: Medium-high.
- Evidence maturity: External pattern support plus internal architecture fit; not yet validated through field deployment.
- Privacy: Public-safe. Contains no private user health or identity details beyond public Mirror Cartographer framing.
- Missingness: Needs applied examples across at least three existing repository artifacts and one practical client-style document.
- Revision trigger: Revise if implementation shows that full Handoff Cards are too heavy for low-risk claims, or if a lighter field set preserves sufficient context.
- Action authority: Documentation and design support only. Does not authorize medical, legal, financial, or clinical action.
- Validation status: Proposed primitive, not canonical Museum artifact.
