# Trace Sufficiency Test

Status: Experimental Genesis artifact
Attractor: Discovery
Privacy: Public-safe

## Core claim

A trace is only useful if it is sufficient for the decision it is asked to support.

The GitHub Mind already contains the Minimum Viable Trace: source -> claim -> transformation -> authority -> action boundary -> outcome/revision. The missing next layer is a test that asks whether the trace is strong enough for its intended use.

**Trace Sufficiency Test:** before a claim moves toward action, ask whether the trace contains enough evidence, context, authority, and revision capacity to reconstruct, challenge, and correct the claim if it is wrong.

## Why this belongs in the GitHub Mind

Recent AI governance research keeps converging on traceability, audit trails, runtime controls, and lifecycle accountability. But the social-care AI transcript failure pattern shows a harder problem: a trace can exist and still be too weak if the original words, transformation errors, human review, and downstream authority are not clear enough to prevent harm.

The useful upgrade is not simply "make a trace." It is "prove this trace is sufficient for this action boundary."

## Test questions

1. Source adequacy
   - Is the original source recoverable?
   - Is it clear whether the source was observed, quoted, measured, inferred, retrieved, or generated?
   - Can a reviewer compare the claim against the source?

2. Transformation visibility
   - What changed between the source and the claim?
   - Was the change a summary, classification, interpretation, prioritization, recommendation, tone rewrite, or action proposal?
   - Could the transformation have added meaning that was not present in the source?

3. Authority fit
   - What is this claim allowed to do now?
   - Does the trace justify that level of authority?
   - If the claim affects medical, legal, financial, care, employment, safety, or privacy-sensitive decisions, has it been routed for stronger review?

4. Error recovery
   - If this claim is wrong, who can detect it?
   - What evidence would expose the error?
   - Can the claim be corrected before it causes downstream harm?

5. Missingness pressure
   - What is absent but needed for stronger confidence?
   - Is the missingness harmless, inconvenient, or dangerous?
   - Does missingness require parking, revision, human review, or prohibition from action?

6. Outcome linkage
   - Was the claim later validated, contradicted, corrected, retired, or promoted?
   - Does the repository preserve what changed after the claim was used?

## Scoring

- Insufficient: source, transformation, authority, or correction path is missing.
- Thin: the trace exists but cannot support consequential action.
- Usable draft: enough for non-consequential review or planning.
- Review-ready: enough for informed human review in a bounded domain.
- Audit-ready: enough to reconstruct what happened, why, under whose authority, and how it was checked.
- Museum candidate: repeatedly useful, externally supported, and revised through failures.

## Practical lane 1: income

The Trace Sufficiency Test can sharpen the AI Evidence Hygiene Review into a clearer paid offer.

Potential deliverable:

**Trace Sufficiency Review**

A focused review of an AI-assisted document, workflow, note, or decision path that returns:

- minimum viable trace reconstruction,
- trace sufficiency score,
- missingness severity map,
- authority/action boundary recommendation,
- review checkpoints,
- correction protocol,
- public-safe executive summary.

This is commercially realistic because organizations are adopting AI faster than their governance programs can verify. The market signal is that AI assurance and audit capacity are expanding while many executives report audit-readiness gaps.

## Practical lane 2: medical and social care

In medical or social-care contexts, the Trace Sufficiency Test should support documentation quality, continuity, and reviewability only. It must not diagnose, prescribe, replace clinical judgment, replace social-work judgment, or automate care decisions.

Care-adjacent use:

- distinguish original speech or observation from AI-generated summary,
- preserve uncertainty and missingness,
- flag invented or unsupported content,
- require human review before consequential use,
- keep revision history visible when records change.

This directly responds to documented risks in AI-generated care notes, where fabricated or distorted summaries can affect assessments, professional accountability, and service-user safety.

## Source labels

- Source: Victor Ojewale, Harini Suresh, Suresh Venkatasubramanian, "Audit Trails for Accountability in Large Language Models," arXiv, 2026-01-28. https://arxiv.org/abs/2601.20727
- Source: Ciprian Paduraru, Petru-Liviu Bouruc, Alin Stefanescu, "A Trace-Based Assurance Framework for Agentic AI Orchestration: Contracts, Testing, and Governance," arXiv, 2026-03-18. https://arxiv.org/abs/2603.18096
- Source: Christopher Koch, "From Governance Norms to Enforceable Controls: A Layered Translation Method for Runtime Guardrails in Agentic AI," arXiv, 2026-04-06. https://arxiv.org/abs/2604.05229
- Source: Chandra Prakash, Mary Lind, Avneesh Sisodia, "Agentic AI Governance and Lifecycle Management in Healthcare," arXiv, 2026-01-22. https://arxiv.org/abs/2601.15630
- Source: The Guardian, "Social workers' AI tool makes 'gibberish' transcripts of accounts from children," 2026-02-11. https://www.theguardian.com/education/2026/feb/11/ai-tools-potentially-harmful-errors-social-work
- Source: Axios, "The work AI boom is outrunning oversight," 2026-04-13. https://www.axios.com/2026/04/13/ai-boom-work-oversight
- Source: Financial News London, "Deloitte UK aims to move hundreds of juniors into AI audits," 2026-05. https://www.fnlondon.com/articles/deloitte-uk-aims-to-move-hundreds-of-juniors-into-ai-audits-70eccfec

## Claim labels

- Claim: Minimum Viable Trace needs a sufficiency test before it can safely support action.
- Claim type: Synthesis; not an established external standard.
- Confidence: Medium-high.
- Validation status: Needs use on real examples and adversarial review.

## Privacy label

Public-safe. This artifact contains no private user data, private medical details, secrets, or private repository credentials.

## Missingness label

Missing:

- applied examples scored against the sufficiency test,
- failure cases where a complete trace still fails,
- comparison against formal ISO/IEC 42001, SOC 2, HIPAA, and EU AI Act evidence requirements,
- evidence that buyers will pay for a standalone Trace Sufficiency Review,
- domain-specific thresholds for care, hiring, finance, and safety contexts.

## Revision label

Initial version. Revise after three applied reviews, one customer-style mock audit, or one discovered failure mode that the current test does not catch.
