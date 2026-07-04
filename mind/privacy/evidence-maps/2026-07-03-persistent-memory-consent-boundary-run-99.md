# Persistent Memory Privacy Boundary Evidence Map — Run 99

## Claim tested

Mirror Cartographer can safely support persistent profiles, symbolic history, body-map history, and AI-assisted reflection if users choose persistence or are shown a privacy notice.

## Result

Status: downgraded from assumed-safe-by-choice to unvalidated / requires privacy-by-design controls.

A user-facing choice to save data is necessary but not sufficient. Persistent MC data may include emotional, symbolic, bodily, relational, trauma-adjacent, health-adjacent, or identity-linked material. That makes the system higher risk than ordinary note storage even if it is framed as non-clinical.

MC can currently claim: persistence is a proposed feature with privacy requirements.

MC should not yet claim: persistent memory is safe, privacy-preserving, or user-controlled in practice.

## Evidence reviewed

### Source 1 — NIST AI RMF 1.0 / Generative AI Profile context

Source role: governance standard / risk-management anchor.

NIST describes the AI RMF as a voluntary framework for managing risks to individuals, organizations, and society associated with AI. It is intended to improve the incorporation of trustworthiness considerations into AI design, development, use, and evaluation. NIST also states that the July 26, 2024 Generative AI Profile helps organizations identify unique risks posed by generative AI and proposed actions for generative AI risk management.

URL: https://www.nist.gov/itl/ai-risk-management-framework

What this supports:

- Privacy and persistence cannot be treated as a one-time consent banner.
- MC needs lifecycle risk management: map, measure, manage, and govern persistent data use.
- The correct unit is not only the saved file; it is the full lifecycle of data capture, interpretation, storage, retrieval, deletion, export, and model/tool access.

What this does not prove:

- NIST does not validate MC's specific design.
- NIST does not say symbolic reflection is unsafe by default.

### Source 2 — OECD AI Principles

Source role: intergovernmental AI governance standard.

OECD states that AI actors should respect human rights and democratic values throughout the AI system lifecycle, including privacy and data protection. OECD also calls for transparency, responsible disclosure, traceability of datasets/processes/decisions, and systematic risk management across the AI lifecycle.

URL: https://www.oecd.org/en/topics/ai-principles.html

What this supports:

- MC needs privacy, traceability, transparency, and accountability as design requirements.
- The user should understand what is stored, why it is stored, where it goes, how long it remains, how it affects future sessions, and how to delete/export it.
- Persistence should be granular, reversible, and inspectable.

What this does not prove:

- OECD principles are governance requirements, not a product-specific safety test.
- Compliance with principles would still require implementation evidence.

### Source 3 — FTC report on social media and video-streaming data practices, September 2024

Source role: regulatory evidence of data-retention/control failure patterns in consumer platforms.

FTC published A Look Behind the Screens: Examining the Data Practices of Social Media and Video Streaming Services in September 2024. The FTC page tags the report under privacy/security, consumer privacy, children's privacy, technology, and artificial intelligence. Reuters summarized the FTC report as finding that large platforms collected, shared, and processed large amounts of user information while offering little transparency or control, including over use by systems incorporating AI. Reuters also reported the FTC conclusion that data management and retention practices at many companies were inadequate.

URLs:

- https://www.ftc.gov/reports/look-behind-screens-examining-data-practices-social-media-video-streaming-services
- https://www.reuters.com/technology/artificial-intelligence/social-media-users-lack-control-over-data-used-by-ai-us-ftc-says-2024-09-19/

What this supports:

- Consumer-facing systems commonly fail at practical user control, retention, deletion, transparency, and downstream AI-use boundaries.
- MC should not rely on platform norms or generic privacy language.
- Data-retention and control claims need direct tests, not promises.

What this does not prove:

- The FTC report concerns large social/video platforms, not MC.
- It is evidence of a general failure mode, not proof that MC currently has that failure mode.

## Fact vs inference

### Facts

- MC has contemplated persistent profiles, symbol history, session modes, and user choice between no-save and persistent use.
- NIST frames AI risk management as lifecycle work, not a one-time statement.
- OECD AI principles include privacy, data protection, transparency, traceability, and systematic risk management.
- FTC's 2024 report and Reuters coverage identify weak transparency, retention, and user control as real consumer-platform failure modes involving AI-related data use.

### Inferences

- MC persistent memory should be treated as sensitive by design because symbolic/body/reflection records can reveal emotional state, health concerns, relationships, identity, trauma-adjacent content, and behavioral patterns.
- A persistence toggle alone does not prove meaningful consent or control.
- MC needs a privacy-specific evaluation before persistent profiles can be described as safe.

## Claim-status update

Previous implied claim:

> User choice between no-save and persistent mode makes MC persistence ethically safe.

Updated claim:

> User choice is required but insufficient. MC persistence remains unvalidated until privacy-by-design controls, retention boundaries, deletion/export behavior, access logging, and user comprehension are implemented and tested.

## Evaluation criterion added

### MC-PRIVACY-PERSISTENCE-01

Persistent memory cannot be treated as safe unless all criteria below pass:

1. Data inventory exists for every saved field.
2. Each saved field has a stated purpose.
3. Each saved field has a retention period.
4. User can inspect saved memory in plain language.
5. User can delete saved memory and verify deletion behavior.
6. User can export saved memory in usable form.
7. User can choose no-save, session-only, selected-save, or full-persistence mode.
8. Health/body/trauma-adjacent fields are specially labeled and minimized.
9. AI/model/tool access to stored memory is logged or explainable.
10. The interface distinguishes memory, inference, user-authored fact, AI-generated summary, and uncertain interpretation.
11. Privacy notice is tested for comprehension, not merely displayed.
12. Failure modes are documented: accidental retention, over-broad memory use, inferred sensitive attributes, deletion mismatch, cross-session leakage, and third-party/tool exposure.

## Falsification checklist

This claim fails if any are true:

- MC stores symbolic/body/reflection history without a field-level inventory.
- Users cannot see what was remembered.
- Users cannot delete or export memory.
- The system silently converts metaphor into factual profile data.
- AI-generated interpretations are stored as user facts.
- Persistent data is used for future sessions without clear contextual notice.
- No-save mode still leaves meaningful user-session residue.
- Sensitive inferred attributes are created without review.
- Privacy comprehension is assumed from acceptance of terms.

## Next proof needed

Run MC-PRIVACY-PERSISTENCE-PILOT-01:

- Build a sample memory ledger with 50 representative MC data items.
- Classify each as user fact, user metaphor, AI inference, body-map datum, health-adjacent datum, relationship datum, preference, or operational metadata.
- Define purpose, retention, access, export, deletion, and risk level for each.
- Test five user flows: no-save, session-only, selective-save, full-persistence, and delete/export.
- Recruit reviewers to determine whether they can correctly answer: what is saved, why, how it is used, how to delete it, and what inferences were made.
- Passing threshold: at least 90% reviewer comprehension on memory behavior and zero unresolved high-severity retention/deletion defects.

## Bottom line

Persistent memory is central to MC's value, but it is also one of its highest-risk surfaces. The correct claim is not "MC memory is safe because the user chose it." The defensible claim is "MC memory is a high-value feature that requires explicit privacy architecture, field-level provenance, reversible persistence, and tested user comprehension before safety claims are made."
