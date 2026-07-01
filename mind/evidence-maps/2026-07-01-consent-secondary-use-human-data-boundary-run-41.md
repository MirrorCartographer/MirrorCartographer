# Evidence Map — Consent and Secondary Use Boundary for MC Conversation Data

Date: 2026-07-01
Run: Evidence Engine 41
Claim ID: C-CONSENT-SECONDARY-USE-01R
Status: Supported governance boundary; MC implementation unvalidated

## Claim tested

Weak claim / assumption:

> Mirror Cartographer conversation logs, symbolic reflections, resonance statements, and user feedback can be reused as evidence for the GitHub mind if they are useful, anonymized, summarized, or privately held.

## Result

Not supported as stated.

Conversation-derived evidence may be useful, but it should not be treated as automatically reusable evidence. The stronger boundary is:

> Human-centered MC data may only be used as evidence when its consent basis, identifiability status, intended use, storage period, sharing boundary, withdrawal/retirement path, and risk controls are explicitly recorded. Summaries and anonymization reduce some risk but do not remove the need for governance.

## Primary / high-quality sources checked

1. HHS / OHRP — 45 CFR 46
   URL: https://www.hhs.gov/ohrp/regulations-and-policy/regulations/45-cfr-46/index.html
   Relevant support: HHS describes 45 CFR 46 as the human-subjects research protection framework. Subpart A, the Common Rule, provides protections for research subjects.

2. eCFR — 45 CFR 46.102 Definitions
   URL: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.102
   Relevant support: A human subject includes a living individual about whom an investigator obtains information through interaction and uses/studies/analyzes it, or obtains/uses/studies/analyzes/generates identifiable private information. Private information includes information provided for specific purposes when the person can reasonably expect it will not be made public. Identifiable private information is private information where identity is or may readily be ascertained or associated with the information.

3. eCFR — 45 CFR 46.116 General requirements for informed consent
   URL: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46/subpart-A/section-46.116
   Relevant support: Informed consent must be obtained before involving a human subject in covered research unless an exception applies. Consent must give enough understandable information for a reasonable person to decide whether to participate. Basic consent elements include research purpose, risks, benefits, confidentiality, voluntariness, contacts, and future use/distribution statements for identifiable private information.

4. HHS / OHRP — The Belmont Report
   URL: https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/index.html
   Relevant support: HHS describes the Belmont Report as establishing core ethical principles and guidelines for human subject research. HHS also links respect for persons to informed consent training.

5. NIST AI Risk Management Framework
   URL: https://airc.nist.gov/airmf-resources/airmf/
   Relevant support: NIST frames trustworthy AI through risk management, governance, mapping, measurement, and management. Identifying and managing AI risks requires lifecycle actors and attention to impacts, harms, and trustworthiness criteria.

6. OECD AI Principles
   URL: https://oecd.ai/en/ai-principles
   Relevant support: OECD principles promote trustworthy, human-centric AI respecting human rights and democratic values. Values-based principles include human rights and democratic values, fairness and privacy, transparency and explainability, robustness/security/safety, and accountability.

## Fact vs inference

### Supported by sources

- Human-subjects research protections are triggered by systematic investigation designed to contribute to generalizable knowledge when living-person information is obtained through interaction or identifiable private information is used.
- Private or symbolic conversation content may be identifiable even when summarized if the identity can be readily associated with the information.
- Informed consent is not just a generic disclaimer; it needs understandable, decision-relevant information about purpose, risk, confidentiality, voluntariness, and future use.
- Broad or secondary use of identifiable private information requires explicit boundary description: what may be stored, used, shared, for how long, and for what types of research.
- Trustworthy AI governance requires lifecycle risk management, accountability, transparency, and attention to privacy.

### Inference for Mirror Cartographer

- MC conversation data can become human-subject or human-centered evidence if it is used to validate generalized claims about MC usefulness, safety, accuracy, emotional mapping, user resonance, or cognition support.
- Symbolic-emotional content may remain identifying even after names are removed because unusual phrasing, life events, pets, health details, locations, and project-specific symbols can re-identify a person.
- The current GitHub mind should not upgrade confidence using conversation-derived evidence unless consent and secondary-use metadata are attached.
- Anonymized or summarized MC artifacts should be treated as risk-reduced, not risk-free.

## Claim-status update

Retire:

C-CONSENT-SECONDARY-USE-01:

> Internal or user-provided MC conversations can be reused as evidence when the use feels aligned, helpful, or anonymized.

Replace with:

C-CONSENT-SECONDARY-USE-01R:

> Conversation-derived MC evidence requires explicit consent/use-basis metadata, identifiability assessment, storage/use/sharing boundaries, withdrawal or retirement path, and privacy-risk review before it can raise confidence in any public, research, product, or generalizable claim.

Status: Supported governance boundary; MC implementation unvalidated.

## Evaluation criterion: HUMAN-DATA-EVIDENCE-GATE-01

A GitHub mind claim may use MC conversation-derived evidence only if the linked evidence record includes all required fields:

1. Data origin
   - user-provided text
   - assistant-generated interpretation
   - user feedback / resonance statement
   - conversation summary
   - derived metric
   - external source

2. Use category
   - private reflection aid
   - product design signal
   - usability evidence
   - research evidence
   - public marketing claim
   - safety claim
   - clinical/wellness-adjacent claim

3. Consent/use basis
   - explicit user consent for this use
   - explicit public artifact consent
   - private operational use only
   - no consent recorded
   - unknown

4. Identifiability status
   - direct identifiers present
   - indirect identifiers present
   - symbolically identifying details present
   - de-identified with method recorded
   - aggregated only
   - unknown

5. Future-use boundary
   - may be reused for same claim only
   - may be reused for related MC design claims
   - may not be reused
   - unknown

6. Storage and retirement
   - storage path
   - review date
   - deletion/retirement trigger
   - withdrawal process

7. Evidence weight limit
   - user-specific anecdote only
   - usability signal
   - hypothesis generator
   - validation evidence
   - cannot be used until reviewed

## Falsification checklist

The claim that MC handles conversation-derived evidence responsibly fails if any of the following are found:

- A public or generalizable MC claim cites a conversation summary without consent/use-basis metadata.
- An evidence map uses user resonance, symbolic phrases, health details, pet details, or personal history as proof without identifiability review.
- A summarized conversation is treated as de-identified solely because names were removed.
- A claim confidence score increases from human-centered data without recording whether the data was anecdotal, usability-only, research-grade, or public-claim-grade.
- Public artifacts include sensitive symbolic-emotional material without a documented permission boundary.
- A user withdrawal or correction cannot be propagated to dependent claims.
- A secondary-use evidence item lacks storage duration, sharing boundary, and retirement conditions.

## Test plan: CONSENT-SECONDARY-USE-AUDIT-01

Scope:

- Review the last 50 GitHub mind evidence maps and claim-status updates.
- Flag every item that relies on user conversation, user feedback, resonance, symbolic interpretation, body language, pet/health context, or private autobiographical detail.

Procedure:

1. Create a ledger with columns:
   - artifact path
   - claim ID
   - human-data present? yes/no
   - data origin
   - use category
   - consent/use basis present? yes/no
   - identifiability risk: low/medium/high/unknown
   - direct identifiers present? yes/no
   - indirect identifiers present? yes/no
   - symbolic identifiers present? yes/no
   - evidence weight assigned
   - maximum allowed evidence weight after audit
   - required downgrade
   - retirement/correction path present? yes/no

2. Downgrade any claim using private conversation-derived evidence without metadata to:
   - hypothesis generator, or
   - usability signal only, or
   - evidence blocked until consent review.

3. Mark any public-facing claim using sensitive data without permission boundary as publication-blocked.

4. Produce dependency list of all claims whose confidence must be recalculated after human-data downgrade.

## Next proof needed

Run CONSENT-SECONDARY-USE-AUDIT-01 across the GitHub mind and publish a human-data evidence ledger showing which claims depend on conversation-derived evidence and whether each one has consent/use-basis metadata, identifiability review, and a retirement path.

Confidence cannot increase from MC conversation-derived evidence until that ledger exists.
