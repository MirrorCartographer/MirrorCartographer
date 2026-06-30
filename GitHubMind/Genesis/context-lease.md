# Context Lease

## Status
Genesis artifact. Public-safe. Not promoted to Museum.

## Attractor
Contradiction.

## Core contradiction
A user, clinician, reviewer, organization, or agent may authorize a claim or workflow inside one context, but that authorization can silently become unsafe when the context changes.

**Permission does not last forever by default.**

## Core claim
Every claim, trace, automation, documentation workflow, or AI-assisted action should carry a Context Lease: an explicit statement of where the claim is valid, what it may support, when it expires, and what changes require re-review.

## Definition
A Context Lease is a bounded permission wrapper around a claim or workflow.

It records:

1. Scope: where this claim or workflow is valid.
2. Purpose: what it is allowed to support.
3. Authority: who or what granted the current use.
4. Duration: when the lease expires or must be renewed.
5. Drift triggers: what changes force re-review.
6. Action ceiling: the strongest action this claim may support.
7. Exit path: how to pause, reverse, retire, or escalate.

## Why this belongs in Mirror Cartographer
Mirror Cartographer already separates symbolic resonance from evidence, interpretation from diagnosis, and reflection from action. Context Lease adds a temporal boundary: even a well-labeled claim may become unsafe if it is reused after the situation, evidence, user state, clinical status, institutional setting, or downstream action changes.

## Relationship to existing GitHub Mind primitives

- Minimum Viable Trace records how information moved.
- Trace Sufficiency asks whether the trace is strong enough for the action.
- Intervention Boundary Matrix separates documentation, decision support, and intervention authority.
- Exit Authority defines who can stop or reverse continuation.
- Continuity Review Loop treats review as a control surface.
- Sequence Risk Ledger tracks multi-step permission composition.
- Context Lease adds expiration, scope, and renewal rules.

## Standard Context Lease fields

```text
Lease holder:
Claim or workflow:
Valid context:
Allowed use:
Action ceiling:
Evidence basis:
Known missingness:
Lease start:
Lease renewal condition:
Lease expiry condition:
Drift triggers:
Escalation trigger:
Exit authority:
Revision log:
```

## Example use: public-safe MC reflection

A symbolic reflection can be valid as a journal-facing interpretation, while invalid as a medical explanation, employment decision input, diagnosis, or instruction to act.

The Context Lease makes that boundary explicit:

- Valid context: reflective journaling session.
- Allowed use: self-orientation and pattern noticing.
- Action ceiling: non-clinical reflection only.
- Drift trigger: user asks for medical, legal, financial, or high-stakes action.
- Exit authority: stop, relabel, escalate to professional judgment, or retire the claim.

## Practical lane: income
Context Lease can become part of an AI governance review service.

Potential service package: **AI Context Lease Audit**.

Deliverables:

- identify where AI-generated claims are reused outside their original context,
- map lease fields for high-risk claims,
- define renewal and expiry triggers,
- locate orphaned permissions,
- recommend approval, escalation, and retirement controls.

This is realistic because organizations adopting agents and AI scribes increasingly need operational governance, audit trails, runtime controls, and clear accountability for AI-assisted outputs.

## Practical lane: medical and social care
Context Lease is useful for care-adjacent documentation because notes and summaries are often reused across time, providers, systems, and decisions.

Care-safe role:

- preserve what was observed,
- label what was inferred,
- mark what was not verified,
- state what the note may and may not support,
- force re-review when symptoms, source quality, risk, or authority changes.

It does not diagnose, treat, replace clinical judgment, or authorize intervention.

## Labels

- Source: Multi-source synthesis from current AI governance, healthcare-agent lifecycle, audit accountability, and social-care AI documentation risk literature.
- Claim: AI-assisted claims and workflows should expire or renew based on context, evidence, authority, and risk changes.
- Privacy: Public-safe. No private user details included.
- Missingness: Needs testing across existing repository artifacts and real workflows.
- Revision: Initial Genesis proposal.
- Confidence: Medium-high.
- Evidence maturity: Conceptual synthesis; not empirically validated as a named MC primitive.
- Action authority: Documentation and governance-design support only.
- Validation status: Proposed.
