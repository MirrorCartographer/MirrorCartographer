# Evidence Map: System Card Documentation Boundary (Run 104)

## Claim tested

Mirror Cartographer can be considered understandable, reviewable, or externally auditable because its GitHub mind contains many evidence maps and files.

## Status update

Downgraded / narrowed.

A large GitHub knowledge base can support review, but file volume is not enough to make a system understandable or auditable. Reviewability requires structured documentation that states intended use, out-of-scope use, system components, data/memory behavior, evaluation methods, known limitations, risk controls, and unresolved uncertainties.

## Why this matters

MC now has many individual evidence maps. That creates traceability at the artifact level, but not necessarily system-level legibility. A reviewer, collaborator, employer, safety evaluator, or future AI agent needs a compressed system-level document that explains what MC is, what it is not, what claims are supported, what claims are unvalidated, and where the proof gaps remain.

## Evidence found

### Facts

1. NIST AI RMF 1.0 is intended to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST describes AI risk management as a lifecycle practice rather than a one-time documentation claim.
   Source: NIST AI Risk Management Framework overview, accessed 2026-07-04. https://www.nist.gov/itl/ai-risk-management-framework

2. The OECD AI Principles promote trustworthy, human-centric AI and explicitly include transparency and explainability, robustness/security/safety, and accountability as values-based principles. The OECD also defines AI systems as machine-based systems that can influence physical or virtual environments, with varying autonomy and adaptiveness after deployment.
   Source: OECD AI Principles overview, accessed 2026-07-04. https://oecd.ai/en/ai-principles

3. Model Cards for Model Reporting propose documentation that clarifies intended use cases, contexts where models are not well suited, performance characteristics, evaluation procedures, and other relevant information.
   Source: Mitchell et al., Model Cards for Model Reporting, 2018/2019. https://arxiv.org/abs/1810.03993

4. Datasheets for Datasets argue that the lack of standardized dataset documentation can cause severe consequences in high-stakes domains, and propose documenting motivation, composition, collection process, recommended uses, and related details to support transparency and accountability.
   Source: Gebru et al., Datasheets for Datasets, 2018. https://arxiv.org/abs/1803.09010

### Inferences

1. MC should not treat repository size or evidence-map count as equivalent to system auditability.

2. MC needs a system-card layer above individual evidence maps. This should summarize system purpose, boundaries, components, evaluation state, memory/data handling, risk controls, known failure modes, and live proof gaps.

3. A system card would not prove MC is safe, useful, clinically valid, or commercially valuable. It would make the current state easier to inspect and falsify.

## Claim-status update

Previous implicit claim:

- The GitHub mind is auditable because its files are versioned and numerous.

Updated claim:

- The GitHub mind is partially traceable through versioned files. It is not system-auditable until MC has a maintained system card or equivalent review packet that links claims, components, evidence, limits, risks, and tests.

## Evaluation criterion added

### MC-SYSTEM-CARD-01

Before MC is described as externally reviewable, it must include a system card with at least these sections:

1. System purpose: what MC is intended to do.
2. Non-purpose / out-of-scope use: what MC must not be used for.
3. Primary users and contexts.
4. Major components: interface, memory, symbolic reflection, body map, evidence engine, GitHub mind, any automations.
5. Data and memory behavior: what is stored, why, retention, deletion/export path, and risk class.
6. Evidence status: validated, partially supported, unvalidated, contradicted, deprecated.
7. Evaluation methods: tests run, tests planned, pass/fail criteria, uncertainty.
8. Known failure modes: overclaiming, anthropomorphic trust, medical interpretation drift, inaccessible visual interactions, stale evidence, source misfit.
9. Safety boundaries: crisis handling, medical/legal/financial limits, user control, escalation rules.
10. Version/provenance: date, commit, maintainer/agent, source links, change history.
11. Next proofs needed: highest-impact tests required before stronger claims are allowed.

## Falsification checklist

The claim that MC is externally reviewable should fail if any of the following are true:

- A reviewer cannot identify what MC is intended to do within 10 minutes.
- A reviewer cannot identify what MC is not allowed to claim.
- A reviewer cannot distinguish validated claims from unvalidated design intentions.
- A reviewer cannot trace a high-level claim to evidence and uncertainty.
- A reviewer cannot identify how memory/data are handled.
- A reviewer cannot identify known failure modes.
- The system card is older than the last major architecture change.
- The system card presents aspirational features as implemented features.

## Test plan

### MC-SYSTEM-CARD-PILOT-01

1. Draft a one-page and a long-form MC System Card.
2. Select 5 reviewers or simulated reviewer roles:
   - safety reviewer,
   - accessibility reviewer,
   - technical collaborator,
   - potential employer/funder,
   - future AI agent continuing the project.
3. Give each reviewer the system card and 20 minutes.
4. Ask them to answer:
   - What is MC?
   - What is it not?
   - What is implemented versus proposed?
   - What are the top 5 risks?
   - Which claims are supported?
   - Which claims need proof?
   - What would you test next?
5. Score answers for accuracy, completeness, and overtrust.
6. Revise the system card where reviewers misunderstand scope, evidence, risk, or status.

## Next proof needed

Create `mind/system-card/Mirror-Cartographer-System-Card-v0.1.md` and run `MC-SYSTEM-CARD-PILOT-01` against the current GitHub mind. The next proof is not another evidence map; it is whether a structured system card lets a reviewer reconstruct MC's purpose, boundaries, evidence state, and failure modes without relying on conversational context.
