# Genesis — Failover Custody Protocol

## Attractor

Continuity.

## Claim

A governed system is incomplete unless it defines who inherits custody when the primary actor, tool, workflow, clinician, reviewer, or institution cannot continue safely.

Interruption pauses a system. Recovery restores or rolls back a system. Failover custody answers the next question: **who is allowed to hold the responsibility while the primary pathway is unavailable?**

## New primitive

**Failover Custody Protocol**

A public-safe governance primitive for defining temporary stewardship after disruption.

## Required fields

- **Primary custodian:** the person, system, team, or institution normally responsible.
- **Failure condition:** the concrete condition that makes primary custody unsafe, unavailable, or invalid.
- **Fallback custodian:** the temporary actor allowed to hold custody.
- **Custody scope:** what the fallback custodian may do.
- **Custody ceiling:** what the fallback custodian may not do.
- **Activation trigger:** event or evidence required to activate failover.
- **Activation authority:** who or what can trigger failover.
- **Duration limit:** how long failover custody can persist before review.
- **Evidence handoff:** minimum trace, source, and state required for safe transfer.
- **Return condition:** what must be true before primary custody resumes.
- **Escalation path:** where the case goes if fallback custody also fails.
- **Audit trail:** durable record of activation, decisions, limits, and return.

## Repository comparison

The GitHub Mind already includes related primitives:

- **Capability vs. Authority:** separates what can be done from what is allowed.
- **Delegation Lineage Ledger:** tracks how authority moves through a chain.
- **Interruption Threshold Register:** defines when a workflow must pause.
- **Recovery Drill Ledger:** tests interruption, rollback, fallback, restoration, and revision.
- **Governance Kernel Boundary:** compresses identity, authority, runtime policy, interruption, audit, rollback, and decommissioning into an execution layer.

The missing piece is **custody during disruption**. A paused or failed system may still contain obligations: records must be preserved, users may need support, money may be at risk, care may need continuity, and permissions may need revocation. Failover custody prevents a gap where no one owns the next safe move.

## Source labels

- **Source type:** current public governance reporting and research.
- **Reuters, 2026-06-30:** Bank of England Deputy Governor Sarah Breeden signaled that autonomous agentic AI in finance may require new regulation, including enhanced recovery, takeover of core operations during disruption, circuit breakers, and kill switches.
- **Agentic AI Governance and Lifecycle Management in Healthcare, 2026-01-22:** proposes identity/persona registries, PHI-bounded context, runtime policy enforcement with kill-switch triggers, lifecycle management, decommissioning, credential revocation, and audit logging.
- **Five-Plane Runtime Governance Architecture, 2026-06-10:** frames production-agent governance around composite principals, authority attenuation, stop-anywhere mediation, and audit as evidence substrate.
- **Trace-Based Assurance Framework, 2026-03-18:** instruments executions as message-action traces with contracts, replay, fault injection, and runtime governance.

## Public-safe claim labels

- **Claim:** failover custody is a distinct governance requirement when systems can affect external processes.
- **Privacy:** public-safe; no personal, medical, account, or private repository secrets included.
- **Missingness:** no live deployment evidence yet; this is an architectural primitive, not a validated operational control.
- **Revision trigger:** revise when repository contains a working governance-kernel implementation or when stronger regulatory guidance defines required failover mechanisms.
- **Confidence:** medium-high for governance relevance; medium for commercial fit until tested with real buyers.
- **Evidence maturity:** convergent early-2026 research and regulatory signal; not yet mature consensus.
- **Validation status:** conceptual artifact; requires future implementation drill.

## Invariant

A system that can pause, fail, or be decommissioned must name the temporary custodian before failure occurs.
