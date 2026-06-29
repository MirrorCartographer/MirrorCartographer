# Minimum Viable Trace

Status: Experimental Genesis artifact
Attractor: Compression
Privacy: Public-safe

## Core claim

A Mirror Cartographer claim should not be allowed to move toward use unless it carries a minimum trace that can reconstruct how it moved from input to possible action.

The repository has been accumulating related structures: Evidence Chain, Claim Custody Chain, Action Authority Ladder, Source-to-Action Pipeline, Context Lineage, and Nondelegable Accountability Boundary. The compression is that all of them require the same smallest object:

**source -> claim -> transformation -> authority -> action boundary -> outcome/revision**

This is the Minimum Viable Trace.

## Why this belongs in the GitHub Mind

A trace is stronger than a note and lighter than a full audit. It is the smallest public-safe record that preserves enough evidence for later review without pretending to be a complete compliance system.

## Required fields

1. Source
   - What information entered the system?
   - Was it observed, quoted, measured, inferred, retrieved, or generated?

2. Claim
   - What is being asserted?
   - What is not being asserted?

3. Transformation
   - What changed between source and claim?
   - Summarization, classification, metaphor, diagnosis-like interpretation, recommendation, prioritization, or rewrite.

4. Authority
   - What is the claim allowed to do now?
   - Park, explore, draft, review route, controlled use, audit-ready, or museum candidate.

5. Action boundary
   - What actions are explicitly prohibited without further review?
   - Medical, legal, financial, psychological, employment, safety, and privacy-sensitive uses require stronger review.

6. Outcome or revision
   - What happened after use?
   - Was the claim corrected, validated, contradicted, retired, promoted, or left unresolved?

## Practical lane 1: income

The Minimum Viable Trace can become the core unit of a small service offering:

**AI Evidence Hygiene Review**

A realistic first paid deliverable could review AI-assisted documents, workflows, or recommendations and return:

- minimum viable trace map,
- missingness report,
- fluent ambiguity risk notes,
- action-authority rating,
- revision recommendations,
- public-safe executive summary.

This is narrower and more sellable than "Mirror Cartographer" as a whole. It maps to the growing AI assurance market without claiming certification authority.

## Practical lane 2: medical and social care

In medical or social-care contexts, the Minimum Viable Trace should only support continuity, documentation quality, and uncertainty visibility. It must not replace clinical judgment, diagnosis, treatment, crisis response, or licensed care.

Useful care-adjacent application:

- preserve observations over time,
- label uncertainty,
- distinguish patient-reported information from interpretation,
- show what changed between visits or notes,
- flag what requires clinician review.

## Source labels

- Source: Victor Ojewale, Harini Suresh, Suresh Venkatasubramanian, "Audit Trails for Accountability in Large Language Models," arXiv, 2026-01-28. https://arxiv.org/abs/2601.20727
- Source: Ciprian Paduraru, Petru-Liviu Bouruc, Alin Stefanescu, "A Trace-Based Assurance Framework for Agentic AI Orchestration," arXiv, 2026-03-18. https://arxiv.org/abs/2603.18096
- Source: Eranga Bandara et al., "AI Trust OS," arXiv, 2026-04-06. https://arxiv.org/abs/2604.04749
- Source: Chandra Prakash, Mary Lind, Avneesh Sisodia, "Agentic AI Governance and Lifecycle Management in Healthcare," arXiv, 2026-01-22. https://arxiv.org/abs/2601.15630
- Source: Reuters, "Thomson Reuters reaffirms forecasts, highlights fiduciary-grade AI demand," 2026-05-05. https://www.reuters.com/business/thomson-reuters-first-quarter-revenue-rises-10-reaffirms-full-year-forecast-2026-05-05/
- Source: Financial News London, "Deloitte UK aims to move hundreds of juniors into AI audits," 2026-05. https://www.fnlondon.com/articles/deloitte-uk-aims-to-move-hundreds-of-juniors-into-ai-audits-70eccfec

## Claim labels

- Claim: Minimum Viable Trace is the smallest practical record that can connect MC's evidence, authority, custody, and revision concepts.
- Claim type: Synthesis; not an established external standard.
- Confidence: Medium-high.
- Validation status: Needs implementation fixtures and adversarial review.

## Privacy label

Public-safe. This artifact contains no personal medical details, private user data, or private repository secrets.

## Missingness label

Missing:

- real examples scored against the trace fields,
- failure cases where a trace is still insufficient,
- comparison against formal ISO 42001 / SOC 2 / EU AI Act evidence requirements,
- evidence that customers will pay for this narrow review service.

## Revision label

Initial version. Should be revised after at least three applied reviews or one failed attempt to use it in practice.
