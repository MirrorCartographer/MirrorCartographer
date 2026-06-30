# Layer Drift Sentinel

## Status labels

- Source: public research and public news sources only.
- Claim: governance and care-support explanations can become unsafe when audience-specific summaries drift away from the same underlying claim.
- Privacy: no private user, patient, clinician, client, or household information included.
- Missingness: previously referenced explanatory-layer artifact was not available at the expected repository path during this run; this primitive treats that as a continuity risk.
- Revision: revise when the missing artifact is found, restored, renamed, or intentionally superseded.
- Confidence: medium-high for the governance need; medium for commercial packaging.
- Evidence maturity: emerging but convergent across agentic AI governance, healthcare agent lifecycle management, runtime guardrails, and social-care documentation risk.

## Definition

A **Layer Drift Sentinel** is a public-safe governance primitive that watches for divergence between multiple presentations of the same claim.

Mirror Cartographer often needs several views of one thing:

- kernel specification;
- operational checklist;
- scientific evidence note;
- executive summary;
- human-readable explanation;
- care-support summary.

These layers are useful only if they preserve the same claim boundary. If the human layer softens uncertainty, the executive layer overstates readiness, or the care layer implies diagnosis where the source only supports observation, the system has drifted.

## Core rule

**Changing the explanation must not change the claim.**

If a layer changes authority, certainty, evidence maturity, action ceiling, privacy boundary, or revision state, it is not merely a different explanation. It is a different claim and must be assigned a new claim identifier or returned for correction.

## Sentinel fields

Each claim with multiple layers should preserve:

1. Claim ID.
2. Source ID.
3. Evidence maturity.
4. Authority boundary.
5. Intended audience.
6. Explanation layer.
7. Allowed action ceiling.
8. Missingness statement.
9. Revision trigger.
10. Drift check result.
11. Human-review status.
12. Supersession or retirement path.

## Drift types

### Certainty drift

A layer turns uncertain evidence into a confident instruction.

### Authority drift

A support artifact begins to sound like a clinical, legal, financial, or institutional authority.

### Privacy drift

A public-safe layer carries details that should remain private or contextual.

### Action drift

A descriptive claim becomes an instruction to act.

### Scope drift

A narrow finding is generalized beyond its source.

### Beauty drift

A more compelling explanation becomes more persuasive than the evidence can support.

## Runtime behavior

When drift is detected:

1. Pause publication or handoff.
2. Mark the affected layer as `drifted`.
3. Identify the field that changed.
4. Restore alignment or create a new claim ID.
5. Preserve revision history.
6. Record residual uncertainty.

## Practical lane 1: income

Potential offer: **Layer Drift Audit**.

Deliverable:

- map one AI product's public, executive, technical, and user-facing claims;
- identify where certainty, authority, action, or privacy changes across layers;
- produce a correction table;
- recommend claim-ID, revision, and approval workflow.

Why realistic:

Organizations are moving from static AI policies toward runtime controls, audit trails, and lifecycle governance. Multi-audience documentation is now a governance surface, not a cosmetic layer.

## Practical lane 2: medical and social-care support

Potential public-safe artifact: **Care Summary Drift Review**.

Purpose:

Compare patient-facing, caregiver-facing, clinician-facing, and administrative summaries of the same observation to ensure the summary does not become a diagnosis, erase uncertainty, or hide follow-up needs.

This is support for communication and continuity, not medical diagnosis or treatment.

## Sources

- Reuters, June 30, 2026: Bank of England warning on agentic AI regulatory reform, recovery capabilities, and kill switches.
- Prakash, Lind, Sisodia, 2026: Agentic AI Governance and Lifecycle Management in Healthcare.
- Koch, 2026: From Governance Norms to Enforceable Controls.
- Bisson et al., 2026: Six Interventions for Responsible and Ethical Implementation of Medical AI Agents.
- Guardian, February 11, 2026: AI transcript errors in social work documentation.
- Guardian, June 9, 2026: legal accountability concerns for AI medical-tool mistakes.
