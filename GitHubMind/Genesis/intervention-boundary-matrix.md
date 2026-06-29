# Intervention Boundary Matrix

## Status

- Source: Multi-source public synthesis
- Claim: Mirror Cartographer should distinguish documentation support, decision support, and intervention authority as separate layers.
- Privacy: Public-safe; no personal medical details, private identities, or private case facts included.
- Missingness: Needs testing against real non-private examples before it can be treated as validated.
- Revision: Initial version.
- Confidence: Medium-high.
- Validation status: Genesis candidate; not Museum-stable.

## Core compression

A living knowledge system becomes dangerous when a well-structured claim quietly turns into an authorized action.

The matrix separates four questions:

1. What was observed?
2. What claim was formed?
3. What support or documentation may be produced?
4. What intervention, if any, is authorized?

The boundary matters because current AI governance and healthcare/social-care examples show both benefit and risk. AI can reduce administrative burden, improve continuity records, and support monitoring. It can also introduce hallucinated or distorted documentation into records that affect later human decisions.

## Matrix

| Layer | Permitted role | Boundary question | Required trace |
|---|---|---|---|
| Observation | Capture what was seen, heard, measured, or reported | Is this raw, interpreted, or transformed? | Source, time, context, observer, uncertainty |
| Documentation support | Organize notes, timelines, summaries, and missingness | Does the document preserve source fidelity? | Source-to-summary mapping, omissions, uncertainty labels |
| Decision support | Compare evidence, guidelines, risks, and options | Is the claim strong enough for the decision being considered? | Evidence chain, confidence, reversal threshold, human review route |
| Intervention authority | Trigger action, escalation, referral, treatment, payment, denial, or policy change | Who is authorized and accountable? | Action authority level, accountable person/institution, outcome review |

## New invariant

Documentation support is not intervention authority.

A clear record may justify review, but it does not automatically justify action.

## Why this belongs in the GitHub Mind

Recent repository concepts already established source, claim, trace, custody, sufficiency, readiness, accountability, and authority. The Intervention Boundary Matrix connects those concepts to the practical medical/social-care lane without letting Mirror Cartographer drift into diagnosis, therapy, or unsupported intervention.

## Relation to prior artifacts

- Evidence Chain: supplies the support path.
- Claim Custody Chain: tracks movement and transformation.
- Minimum Viable Trace: supplies the smallest acceptable trace unit.
- Trace Sufficiency Test: asks whether the trace is strong enough.
- Action Authority Ladder: asks what the claim is allowed to do.
- Nondelegable Accountability Boundary: keeps responsibility attached to humans/institutions.
- Two-Plane Governance: separates belief quality from action permission.

## Public source anchors

- Reuters, 2026-06-24: RBI proposed AI/ML risk guidelines for banks requiring ongoing model risk assessment, independent validation, enhanced controls, limits on model use, decommissioning where excessive risk is detected, and human oversight for automated decision-making.
- arXiv, 2026-01-22: Agentic AI Governance and Lifecycle Management in Healthcare proposes a Unified Agent Lifecycle Management blueprint with identity/persona registry, orchestration, PHI-bounded context and memory, runtime policy enforcement with kill-switch triggers, lifecycle management, credential revocation, and audit logging.
- The Guardian, 2026-02-11: reporting on Ada Lovelace Institute research found AI transcription and summarization errors in social work records, including fabricated or distorted content, while also noting potential time savings and relational benefits when used appropriately.
- arXiv, 2026-02-14: Human Oversight-by-Design for Accessible Generative IUIs argues that high-stakes generative interfaces need escalation policies, explicit UI controls, risk signalling, intervention thresholds, and traceable audit logs.
- arXiv, 2026-03-14: Six Interventions for Responsible and Ethical Implementation of Medical AI Agents proposes auditable ethical reasoning modules, explicit human override conditions, patient preference profiles, ethics oversight tools, benchmark repositories, and regulatory sandboxes.

## Practical lane 1: income

The most realistic adjacent offer is not broad "Mirror Cartographer therapy" or vague "AI reflection." It is a narrow review service:

AI Documentation Risk and Evidence Review

Deliverables:

- Documentation fidelity check
- Source-to-summary map
- Missingness map
- Claim-to-action boundary review
- Human review and escalation threshold recommendations
- Public-safe executive summary

Likely customers or collaborators:

- small clinics adopting AI scribes
- social-care nonprofits using AI documentation tools
- legal/advocacy groups reviewing AI-generated case records
- startups needing evidence hygiene before selling into regulated spaces
- internal teams using AI for summaries, intake, triage, or case notes

## Practical lane 2: medical/social-care support

The evidence-based contribution is continuity and documentation hygiene, not diagnosis.

Potential safe use:

- Maintain longitudinal observation timelines.
- Preserve exact source vs summary distinction.
- Flag missingness and uncertainty.
- Identify when a new finding should trigger professional review.
- Record what would reverse or revise a claim.
- Keep human/institutional accountability explicit.

Unsafe drift:

- Treating a summary as a clinical conclusion.
- Treating confidence language as treatment authority.
- Allowing AI-generated documentation to overwrite original accounts without review.
- Acting on hallucinated, inferred, or tone-shifted content as if it were source evidence.

## Decision reversal threshold

Revise or withdraw this artifact if:

- Future evidence shows documentation-support boundaries do not reduce downstream harm.
- Real-world tests show the matrix is too complex for actual users to apply.
- Better established standards provide a more precise action-authority model.
- Medical or social-care regulators issue specific guidance that conflicts with this structure.

## Museum status

Do not promote yet. The concept is coherent and useful, but needs implementation evidence.