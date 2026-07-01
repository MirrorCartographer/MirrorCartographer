# Obligation Ledger Protocol

**Attractor:** Continuity  
**Status:** Public-safe genesis artifact  
**Created:** 2026-07-01  
**Privacy:** No private user medical, financial, location, or identity details included.  
**Revision:** v1.0  
**Supersedes:** Nothing.  
**Related primitives:** Claim Card Schema, Consent Authority Envelope, Decision Record Protocol, Action Certificate Protocol, Recovery Drill Ledger, Failover Custody Protocol.

## Core claim

**An action is not complete when it is executed. It is complete only when its remaining obligations are either fulfilled, transferred, retired, or explicitly marked unresolved.**

The GitHub Mind already separates:

- what is believed: Claim Card;
- what is permitted: Consent Authority Envelope;
- why something was chosen: Decision Record;
- what was done: Action Certificate.

The missing object is what remains owed after action.

## New primitive

**Obligation Ledger**

A durable record of duties created by a claim, decision, consent boundary, action, incident, handoff, or unresolved missingness.

## Minimum fields

- `obligation_id`
- `source_object`
- `trigger_type`
- `owed_to`
- `responsible_actor`
- `authority_basis`
- `consent_basis`
- `description`
- `due_condition`
- `evidence_required_for_closure`
- `current_state`
- `handoff_state`
- `failure_state`
- `review_trigger`
- `closure_record`
- `revision_history`
- `privacy_boundary`
- `missingness_label`

## Canonical states

- Proposed
- Active
- Waiting on Evidence
- Waiting on Actor
- Escalated
- Transferred
- Fulfilled
- Retired
- Unresolved
- Archived

## What counts as an obligation

An obligation may be created when:

1. a decision requires follow-up;
2. an action creates external effects;
3. consent requires future review or deletion;
4. missingness could change the validity of a claim;
5. a recovery or rollback path must be tested;
6. a care-support artifact requires human review;
7. a governance state transition requires later evidence;
8. a claim is reused in a new context and needs provenance carry-forward.

## Boundary rule

An obligation ledger is not a task list. It does not merely say what someone wants to do. It records a duty created by reliance, authority, consent, missingness, or external effect.

## Closure rule

An obligation can close only when there is evidence for one of the following:

- fulfilled;
- transferred to a named custodian;
- retired because the parent claim/action was superseded;
- unresolved with an explicit missingness note;
- archived with no remaining action authority.

## Income lane

**AI Obligation Trace Review**

A realistic Mirror Cartographer adjacent service: audit whether AI-enabled workflows preserve obligations after decisions and actions.

Deliverables:

- obligation inventory;
- action-to-obligation map;
- unresolved duty register;
- handoff and escalation audit;
- closure-evidence review;
- missingness and residual-risk report.

This can be positioned for teams using AI agents, clinical documentation tools, customer-support automation, or compliance workflows.

## Medical / social-care lane

**Care Obligation Ledger**

A public-safe care-support artifact that tracks follow-up duties without replacing clinicians or case workers.

Potential records:

- observation needing review;
- referral needing confirmation;
- medication question needing clinician response;
- symptom log needing triage;
- social-care request needing follow-up;
- record correction needing verification.

The ledger improves continuity by making unfinished care visible.

## Source labels

- Source: 2026 public research on runtime AI compliance, healthcare agent lifecycle governance, explicit provenance, and AI accountability tracing.
- Claim: Operational systems need a first-class object for post-action obligations.
- Evidence maturity: Conceptual synthesis from governance and healthcare AI literature; not yet empirically validated as a named MC primitive.
- Confidence: Medium-high for the need; medium for the exact schema.
- Missingness: Needs implementation tests, example ledgers, failure-mode review, and comparison against legal/compliance duty-tracking systems.
- Privacy: Public-safe abstraction only.
- Revision path: Update after implementation in real or simulated workflows.

## Supporting sources

- Agentic AI Governance and Lifecycle Management in Healthcare, 2026: https://arxiv.org/abs/2601.15630
- Runtime Compliance Verification for AI Agents, 2026: https://arxiv.org/abs/2606.19242
- Responsible Agentic AI Requires Explicit Provenance, 2026: https://arxiv.org/abs/2605.17169
- Hybrid Responsible AI-Stochastic Approach for SLA Compliance in Multivendor 6G Networks, 2026: https://arxiv.org/abs/2602.09841
