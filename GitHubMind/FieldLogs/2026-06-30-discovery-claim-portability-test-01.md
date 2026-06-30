# Field Log: Discovery — Claim Portability Test

## Status
Field Log artifact. Public-safe.

## Attractor selected
Discovery.

## Why this attractor
The previous repository primitive, Context Lease, defined when a claim or workflow is valid, what it may support, when it expires, and what changes require review. The next strongest missing connector was not another internal label. It was a crossing test: whether a claim may leave one context and enter another.

## Existing repository comparison
Relevant existing primitives:

- Minimum Viable Trace: source to claim to transformation to authority to action boundary to outcome or revision.
- Trace Sufficiency Test: whether the trace is strong enough for the action.
- Intervention Boundary Matrix: separates documentation support, decision support, and intervention authority.
- Exit Authority: who can stop, reverse, escalate, or decommission.
- Continuity Review Loop: review as a control surface.
- Threshold-Linked Governance: thresholds for advance, pause, escalation, and retirement.
- Handoff Integrity: governance state must travel with claims.
- Sequence Risk Ledger: permission does not compose automatically.
- Context Lease: permission expires with context.

Gap found:

The repository had tools for tracing, leasing, reviewing, and stopping claims, but not a specific test for whether a claim can safely cross into a new context.

## New artifact added
GitHubMind/Genesis/claim-portability-test.md

## Core upgrade
**A claim does not travel safely just because it was safe where it began.**

## Practical lane 1: income
The strongest income-adjacent direction is a narrow audit service:

**AI Claim Portability Audit**

Possible clients:

- small organizations using AI scribes or copilots,
- clinics or care organizations using summaries,
- nonprofits using AI for case notes or reports,
- consultants producing AI-assisted client deliverables,
- teams using agents to move work between tools.

Deliverables:

- identify claims reused outside original context,
- check whether source and uncertainty travel,
- detect expired or missing Context Leases,
- map authority and action-ceiling violations,
- recommend handoff labels and review gates.

## Practical lane 2: medical and social care
The strongest care-adjacent direction is not diagnosis. It is safer longitudinal documentation:

- preserve observation versus interpretation,
- keep uncertainty visible,
- prevent AI summaries from becoming unsupported care claims,
- require review before reuse in decisions,
- keep human accountability explicit.

This aligns with current evidence showing both the promise and risk of AI documentation tools in healthcare and social-care settings.

## Missingness

- No repository-wide audit has yet applied the test to all existing Genesis artifacts.
- No external client workflow has validated the test.
- No formal scoring rubric exists yet.
- Care-adjacent use requires strict privacy and professional-boundary safeguards.

## Revision hooks

Revise this artifact if:

- stronger healthcare AI lifecycle guidance appears,
- regulatory guidance defines more specific audit requirements,
- repository use shows the test overlaps too much with Handoff Integrity or Context Lease,
- real workflows reveal missing fields,
- evidence shows portability risk is better modeled as lifecycle state rather than crossing gate.

## Labels

- Source: Current public research and reporting, compared against existing GitHub Mind primitives.
- Claim: Claim portability is a missing governance gate between Context Lease and Handoff Integrity.
- Privacy: Public-safe. No private user details included.
- Missingness: Needs repeated repository and workflow testing.
- Revision: Initial Field Log.
- Confidence: Medium-high.
- Evidence maturity: Public-source synthesis plus internal architecture comparison.
- Action authority: Repository evolution and governance-design support only.
