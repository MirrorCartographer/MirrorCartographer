# FREE 2.0 — Recursive Consequence and Integrity Engine
Version: 2.0.0
Status: executable core scaffold; schema and policy subject to review.

## Purpose
FREE 2.0 converts a proposal into a traceable decision process. It follows first-order effects and downstream consequences, preserves contradictions, and supports continue / modify / pause / reverse / reject decisions. It does not make high-impact decisions autonomously.

## Core objects
- Proposal: intervention, baseline, scope, owner, authority, affected parties, assumptions, expected outcomes, constraints.
- Impact: predicted or observed effect, affected party, distribution, time horizon, evidence, severity, reversibility.
- Contradiction: two or more incompatible records or interpretations, with source and resolution state.
- Consequence: downstream effect created by an impact or prior consequence; has parent link, owner, horizon, monitoring method, and status.
- Decision: action, rationale, evidence basis, dissent, reviewer, date, revisit trigger.
- Review: measured outcomes against baseline and predictions.

## Repeatable lifecycle
1. REGISTER — freeze the proposal version and identify owner, scope, authority, baseline, affected groups.
2. MAP — record direct effects, resource transfers, displaced services, incentives, power shifts, and distribution.
3. CHALLENGE — generate rival explanations, contradictions, abuse cases, missing data, and falsifiers.
4. GATE — evaluate rights, legality, privacy, safety, reversibility, monitoring, and accountability.
5. TEST — select the smallest reversible experiment with predeclared metrics and stop conditions.
6. OBSERVE — compare actual outcomes to baseline and expected outcomes; preserve adverse and null results.
7. RECUR — create a child consequence record for every material new effect; follow it until closed, contained, or explicitly accepted with owner.
8. DECIDE — continue, modify, pause, reverse, reject, or escalate to human/institutional authority.
9. REVISIT — reopen when new evidence, harm, drift, changed law, or threshold breach appears.

## Mandatory questions
Who benefits? Who pays? Who loses access, agency, privacy, power, or opportunity? What is displaced? What happens when the system is wrong, exploited, scaled, underfunded, or unavailable? Who is excluded? Can people refuse and appeal? Can we reverse it? What would falsify our thesis? What evidence would make us stop?

## Hard gates
- No authority / permission for the proposed activity: BLOCK.
- A rights violation or unmitigated severe harm: BLOCK or STOP.
- No baseline or measurable outcome for a consequential pilot: RETURN FOR REVISION.
- No named accountable owner: BLOCK.
- No rollback or containment plan for a reversible pilot: BLOCK.
- High-impact decision delegated to a model: BLOCK.
- Evidence conflict: preserve and escalate; do not average away.
- Missing data: mark unknown; do not infer absence.
- Material downstream consequence without owner/monitoring: OPEN; no closure claim.

## Decision states
PROPOSED → REGISTERED → REVIEW_REQUIRED → APPROVED_FOR_TEST → ACTIVE → REVIEW_DUE → CONTINUE | MODIFY | PAUSE | REVERSE | REJECT | ESCALATE.
A technical implementation may automate reminders and consistency checks; only authorized humans approve consequential actions.

## Recursion and termination
Recursion is not an instruction to chase every imaginable possibility forever. Follow material consequences according to severity, plausibility, reach, irreversibility, and affected-party vulnerability. Every branch receives one of: monitored, mitigated, accepted with rationale, rejected as unsupported, or deferred with trigger. Unbounded speculative chains remain hypotheses, not action blockers.

## Required audit record
Record ID, version, created/updated time, actor, proposal parent, evidence refs, assumptions, confidence, evidence quality, dissent, affected parties, harms, mitigations, metrics, threshold, reviewer, decision, and next review date.

## Evaluation
Test completeness, traceability, contradiction preservation, correct blocking, recursive child creation, rollback triggers, and resistance to false closure. The engine is decision support, not an ethics oracle.
