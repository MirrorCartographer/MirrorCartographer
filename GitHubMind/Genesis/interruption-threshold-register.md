# Interruption Threshold Register

## Attractor

Contradiction.

## Core claim

Human oversight is not a control unless the system defines the conditions that force interruption before reliance becomes harm.

Mirror Cartographer already separates claim, source, authority, capability, privacy, missingness, portability, delegation, assurance, and reversibility. The unresolved contradiction is that many systems claim human oversight while leaving the interruption point vague. If the pause trigger is undefined, oversight becomes symbolic: someone is nominally responsible, but the system gives them no reliable moment to intervene.

## Why this belongs in Genesis

The public repository defines Mirror Cartographer as a bounded symbolic reflection interface, not a therapy product, diagnostic authority, medical tool, oracle, source database, or objective truth engine. It also tracks contradictions, evidence boundaries, user feedback, action steps, and outcome feedback.

The Interruption Threshold Register turns that boundary into an executable governance question:

When must this claim, workflow, agent, export, summary, or recommendation stop moving until a responsible human reviews it?

## Minimum contract fields

Every governed artifact should expose:

1. **Interruption trigger** — the specific signal, event, uncertainty, contradiction, drift, user correction, tool error, source failure, privacy shift, authority mismatch, or high-impact action that requires pause.
2. **Threshold type** — evidence threshold, authority threshold, safety threshold, privacy threshold, action threshold, confidence threshold, drift threshold, or user-distress threshold.
3. **Detection surface** — where the trigger can be observed: UI, log, source packet, export, workflow state, telemetry, reviewer queue, or human report.
4. **Pause behavior** — what stops: claim reuse, export, automation, tool action, record conversion, recommendation, notification, or downstream handoff.
5. **Escalation route** — who or what receives the paused artifact for review.
6. **Fallback state** — what the user sees while paused: uncertainty note, safer next step, source request, clinician escalation, legal/financial review, or no-action state.
7. **Release condition** — what evidence, human approval, correction, or downgrade allows movement again.
8. **Incident boundary** — whether the event is merely a local pause, a reportable incident, or a decommission trigger.
9. **Audit trace** — where the pause, reviewer action, release, downgrade, or retirement is recorded.
10. **Privacy boundary** — what can remain public and what must move to private, clinical, legal, financial, or restricted handling.

## State rule

A system cannot claim meaningful human oversight unless the interruption threshold is visible before the action boundary.

## Relation to existing mind primitives

The Interruption Threshold Register connects:

- Assurance Interface Contract
- Reversibility Anchor
- Draft-to-Record Gate
- Delegation Lineage Ledger
- Claim Portability Test
- Control Placement Matrix
- Capability vs. Authority
- Context Lease
- Aesthetic Legibility Boundary

It is the pre-harm pause layer. Reversibility handles repair after reliance. Interruption handles the moment before a risky claim or action continues.

## Practical lane 1: income

Near-term service shape: **AI Interruption Threshold Audit**.

Deliverables:

- high-impact action inventory;
- oversight claim review;
- interruption trigger map;
- runtime pause checklist;
- escalation and reviewer routing map;
- incident/reporting boundary memo;
- rollback and release-condition design.

This is commercially realistic because enterprises adopting agentic AI need runtime monitoring, approval workflows, interruptibility, incident response, and audit evidence rather than static safety language alone.

## Practical lane 2: medical and social-care support

Public-safe contribution: **Care Pause Trigger Map**.

It can structure:

- symptoms or observations that require clinician review;
- AI-generated summary uncertainty that should not be converted into a record;
- conflicting caregiver/patient observations;
- missing source data;
- urgent red-flag boundaries;
- social-care escalation points;
- correction and release history.

It must not diagnose, prescribe, triage emergencies, replace clinicians, or alter official medical/social-care records without the responsible professional or institution.

## Source notes

- Mirror Cartographer README, retrieved from the public repository during this run.
- Reuters, "Bank of England's Breeden signals new rules to govern agentic AI," June 30, 2026. https://www.reuters.com/world/agentic-ai-may-require-regulatory-reform-boes-breeden-says-2026-06-30/
- Reuters, "US lawmaker introduces bill to require AI companies to report critical incidents," June 25, 2026. https://www.reuters.com/legal/litigation/us-lawmaker-proposes-bill-require-ai-companies-report-critical-incidents-2026-06-25/
- Chandra Prakash, Mary Lind, Avneesh Sisodia, "Agentic AI Governance and Lifecycle Management in Healthcare," arXiv, January 22, 2026. https://arxiv.org/abs/2601.15630
- Christopher Koch, "From Governance Norms to Enforceable Controls: A Layered Translation Method for Runtime Guardrails in Agentic AI," arXiv, April 6, 2026. https://arxiv.org/abs/2604.05229
- Rafflesia Khan, Declan Joyce, Mansura Habiba, "AGENTSAFE: A Unified Framework for Ethical Assurance and Governance in Agentic AI," arXiv, December 2, 2025. https://arxiv.org/abs/2512.03180

## Labels

- **Source:** Repository review plus fresh public research.
- **Claim:** Oversight requires explicit interruption thresholds at the point where claims, workflows, or actions could continue into harm.
- **Privacy:** Public-safe. No private user details included.
- **Missingness:** Requires testing against real UI flows, exports, agent logs, and care documentation workflows.
- **Revision:** Initial Genesis primitive.
- **Confidence:** Medium-high.
- **Evidence maturity:** Moderate external support; implementation untested.
- **Authority:** Documentation and governance-design support only.
- **Action ceiling:** May guide artifact structure; may not authorize medical, legal, financial, operational, or institutional action without domain review.
- **Validation status:** Proposed; not promoted to Museum.
