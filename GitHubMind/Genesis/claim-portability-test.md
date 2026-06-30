# Claim Portability Test

## Status
Genesis artifact. Public-safe. Not promoted to Museum.

## Attractor
Discovery.

## Core discovery
A claim can be true, sourced, and useful in its original setting while becoming unsafe, misleading, or over-authorized when moved into a new setting.

**A claim does not travel safely just because it was safe where it began.**

## Core claim
Every claim that moves between people, tools, documents, workflows, organizations, or action domains should pass a Claim Portability Test before it is reused.

## Definition
A Claim Portability Test determines whether a claim may leave its original context and support a new use without losing source fidelity, authority boundaries, privacy protection, evidence maturity, or revision discipline.

## Test questions

1. Original context: Where did this claim originate?
2. Intended new context: Where is the claim being reused?
3. Source fidelity: Does the new version preserve the original source, uncertainty, and transformation history?
4. Authority match: Does the original authority cover the new use?
5. Action ceiling: Is the new use stronger than the original allowed action?
6. Evidence sufficiency: Is the evidence strong enough for the new use?
7. Privacy shift: Does the new context expose data, identity, health, legal, financial, or relational risk?
8. Drift change: Has time, evidence, user state, clinical state, organizational setting, or downstream consequence changed?
9. Handoff integrity: Does the governance state travel with the claim?
10. Reversal visibility: Would the new user know what evidence would change or retire the claim?

## Pass condition
A claim is portable only when all of the following are true:

- its source and transformation history remain attached,
- its uncertainty and missingness remain visible,
- its original authority covers the new use or new authority is granted,
- its action ceiling is not exceeded,
- its privacy status remains acceptable,
- its Context Lease is current,
- its revision and exit paths remain available.

## Fail condition
A claim fails portability if any of the following occurs:

- the claim becomes detached from its source,
- uncertainty is removed for readability or persuasion,
- a reflective claim becomes diagnostic, legal, financial, employment, or clinical evidence,
- a documentation note becomes decision support without review,
- a single-step permission becomes part of an unauthorized sequence,
- a time-bound Context Lease is treated as permanent,
- the receiving context cannot see missingness or reversal thresholds.

## Relationship to existing GitHub Mind primitives

- Minimum Viable Trace records the claim's movement.
- Trace Sufficiency asks whether the trace is strong enough for a proposed action.
- Intervention Boundary Matrix separates documentation, decision support, and intervention authority.
- Exit Authority defines who can stop continuation.
- Continuity Review Loop treats review as a control surface.
- Threshold-Linked Governance defines advance, pause, escalation, and retirement thresholds.
- Handoff Integrity requires governance state to travel with claims.
- Sequence Risk Ledger detects unsafe multi-step composition.
- Context Lease defines scope, duration, drift triggers, and action ceiling.
- Claim Portability Test decides whether a claim may cross into a new context.

## Practical lane: income
The Claim Portability Test can become a concrete service module inside an AI governance review.

Potential service package: **AI Claim Portability Audit**.

Deliverables:

- map where AI-generated claims are reused,
- identify claims crossing context without governance state,
- test source fidelity and evidence maturity,
- detect action-ceiling violations,
- identify privacy or authority shifts,
- recommend gates for reuse, escalation, or retirement.

This is commercially realistic because organizations adopting AI agents, AI scribes, copilots, and workflow automation need controls for claims that move across systems and influence downstream decisions.

## Practical lane: medical and social care
Care-adjacent documentation needs claim portability controls because notes, summaries, transcripts, forms, and referrals can be reused across time and institutions.

Care-safe role:

- preserve exact observation versus interpretation,
- keep source and uncertainty attached,
- mark when a summary is not verified,
- prevent reflective notes from becoming clinical claims,
- force review before documentation becomes decision support,
- keep human accountability explicit.

This does not diagnose, treat, replace professional judgment, or authorize intervention.

## Source index

- Chandra Prakash, Mary Lind, Avneesh Sisodia. "Agentic AI Governance and Lifecycle Management in Healthcare." arXiv, 2026-01-22. https://arxiv.org/abs/2601.15630
- Christopher Koch. "From Governance Norms to Enforceable Controls: A Layered Translation Method for Runtime Guardrails in Agentic AI." arXiv, 2026-04-06. https://arxiv.org/abs/2604.05229
- Ciprian Paduraru, Petru-Liviu Bouruc, Alin Stefanescu. "A Trace-Based Assurance Framework for Agentic AI Orchestration: Contracts, Testing, and Governance." arXiv, 2026-03-18. https://arxiv.org/abs/2603.18096
- Tom Bisson et al. "Six Interventions for the Responsible and Ethical Implementation of Medical AI Agents." arXiv, 2026-03-14. https://arxiv.org/abs/2603.13743
- Robert Booth. "Social workers' AI tool makes 'gibberish' transcripts of accounts from children." The Guardian, 2026-02-11. https://www.theguardian.com/education/2026/feb/11/ai-tools-potentially-harmful-errors-social-work
- Michael O'Dwyer. "You can't blame AI for mistakes, regulator tells auditors." Financial Times, 2026-03-23. https://www.ft.com/content/f39c0d8d-c15a-4143-9baf-464d7c5e5b01

## Labels

- Source: Multi-source synthesis from current agentic AI governance, trace assurance, healthcare lifecycle management, medical AI ethics, audit accountability, and social-care documentation risk literature.
- Claim: Claims require explicit portability testing before reuse across contexts.
- Privacy: Public-safe. No private user details included.
- Missingness: Needs repository-wide testing against existing Genesis artifacts and real workflows.
- Revision: Initial Genesis proposal.
- Confidence: Medium-high.
- Evidence maturity: Conceptual synthesis supported by current governance literature; not empirically validated as a named MC primitive.
- Action authority: Documentation, governance design, and review support only.
- Validation status: Proposed.
