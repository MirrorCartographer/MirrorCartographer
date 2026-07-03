# Provenance-Risk Crosswalk

## Core finding

Mirror Cartographer needs a **Provenance-Risk Crosswalk**: a public-safe method for tying every durable artifact to its source boundary, derivation path, claim strength, privacy exposure, and permitted action level before it is treated as knowledge.

Operating line:

> A map should not become actionable until its origin, risk, and allowed use have crossed the same bridge.

## Source status

- **Private context:** Used only as architectural substrate. No raw chat text, personal details, household details, health details, animal-care details, financial details, location details, relationship details, credentials, or private identifiers are included here.
- **Repository context:** Public repository README states that Mirror Cartographer tracks evidence boundaries, source status, claim status, user correction, outcome feedback, and public/private boundaries. This research note extends that public framing into an implementation requirement.
- **External reference context:**
  - NIST AI RMF: risk management should be incorporated into AI design, development, use, and evaluation; NIST notes AI RMF 1.0 is voluntary and was released January 26, 2023. Source: https://www.nist.gov/itl/ai-risk-management-framework
  - W3C PROV: provenance supports assessments of quality, reliability, and trustworthiness by representing entities, activities, agents, and derivations. Source: https://www.w3.org/TR/prov-overview/
  - OWASP Top 10 for LLM Applications: LLM systems need controls for prompt injection, sensitive information disclosure, excessive agency, and overreliance. Source: https://owasp.org/www-project-top-10-for-large-language-model-applications/

## Claim status

- **Supported:** Public MC artifacts need explicit source, claim, privacy, and boundary labels.
- **Supported by external standards direction:** Provenance and risk-management frameworks already treat origin, derivation, trustworthiness, misuse, disclosure, and overreliance as design-relevant dimensions.
- **Inferred:** MC should join those dimensions into one artifact-level crosswalk rather than storing them as separate notes.
- **Not claimed:** This does not prove MC outputs are true, clinically valid, therapeutic, diagnostic, or safe for high-stakes action without external review.

## Privacy status

- **Public-safe:** This note contains only abstract method, source-boundary logic, implementation requirements, evaluation criteria, and research questions.
- **Excluded:** Personal, household, health, animal-care, financial, location, relationship, credential, and raw transcript material.
- **Publication rule:** Any future example must use synthetic or consent-cleared data.

## Missingness

- No automated repository-wide lint currently verifies that each public artifact contains source status, claim status, privacy status, missingness, and revision reason.
- No schema currently joins provenance record, risk class, allowed action, and publication audience into one machine-checkable object.
- No public example set yet demonstrates the same artifact passing through draft, review, correction, publication, and revision stages.

## Product requirement

Create an artifact metadata block required for public MC outputs:

1. **Artifact identity**
   - artifact_id
   - title
   - created_at
   - revised_at
   - audience_lane

2. **Source boundary**
   - source_type: public / private-derived / synthetic / external-reference / mixed
   - source_access: public / restricted / unavailable / redacted
   - source_confidence: direct / summarized / inferred / unknown

3. **Provenance path**
   - input_entity
   - transformation_activity
   - responsible_agent
   - derivation_notes
   - removed_private_payload: yes / no / not_applicable

4. **Claim classification**
   - claim_type: observation / interpretation / hypothesis / requirement / evaluation / plan
   - claim_strength: low / medium / high
   - verification_status: untested / internally checked / externally sourced / externally reviewed

5. **Risk and action boundary**
   - risk_class: low / medium / high / prohibited
   - allowed_action: reflect / organize / research / prototype / publish / seek expert review
   - forbidden_action: diagnose / replace professional care / expose private context / imply proof without verification

6. **Privacy boundary**
   - privacy_status: public-safe / redacted / sensitive / blocked
   - consent_layer: none-needed / consent-required / consent-granted / unavailable
   - example_policy: synthetic-only / anonymized / citation-only / prohibited

7. **Revision account**
   - revision_reason
   - changed_claim_status
   - changed_privacy_status
   - unresolved_missingness

## Evaluation criteria

A public artifact passes only if:

- It can state what kind of source produced it without exposing the private source.
- It separates observation, interpretation, hypothesis, requirement, and plan.
- It identifies what a reader is allowed to do with the artifact.
- It names what the artifact is not allowed to claim.
- It can be revised without rewriting history.
- It can be audited by someone who never sees the private substrate.

## Research questions

1. What is the smallest metadata schema that preserves provenance without encouraging overcollection?
2. Can MC assign risk class automatically, or should risk classification always require human review before publication?
3. Which artifacts should be blocked from publication even after redaction because the derivation path itself is too private?
4. How should symbolic resonance be stored when it is meaningful but not evidentiary?
5. Can artifact-level provenance support both public trust and private dignity without collapsing one into the other?

## Implementation plan

1. Add a reusable `public_artifact_metadata` schema.
2. Add a publication lint that rejects missing source, claim, privacy, missingness, or revision fields.
3. Add a provenance-risk crosswalk table to the public research index.
4. Add synthetic examples for each artifact type.
5. Add a review checklist that distinguishes public-safe abstraction from unsafe transcript leakage.
6. Add revision logging so claim status and privacy status can change without erasing earlier boundaries.

## Meaningful revision reason

This note extends earlier MC boundary protocols by adding a single crosswalk between provenance, AI risk, privacy boundary, and allowed action. The revision is meaningful because prior notes define separate gates; this one specifies the shared inspection surface that lets those gates work together.
