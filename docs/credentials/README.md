# Mirror Cartographer Credential Program

**Program:** MC Credential Program  
**Version:** 1.1  
**Status:** Established as a pilot framework; no competency credentials have yet been awarded.  
**Issuer for internal records:** Mirror Cartographer project  
**Public project:** https://github.com/MirrorCartographer/MirrorCartographer

## Purpose

The program turns real project work into inspectable evidence of capability. It recognizes systems thinking, human-centered interaction design, evidence governance, and practical software delivery without confusing project leadership, AI-assisted collaboration, independent technical proficiency, and external certification.

The program has two separate credential lanes:

1. **AI-assessed Mirror Cartographer credentials** — awarded after a published rubric is applied to inspectable evidence and candidate responses. These are project-issued credentials and must explicitly disclose the AI assessor and the founder/issuer relationship. They are not accredited or industry certifications.
2. **Human-reviewed Mirror Cartographer credentials** — an optional additional track with a named human assessor and conflict disclosure.
3. **External credentials** — awarded only by the named external provider after the candidate completes that provider's requirements. Mirror Cartographer can map project evidence to the provider's syllabus and prepare the candidate, but cannot issue or guarantee those credentials.

## Internal credential suite

| Credential ID | Name | What it validates |
|---|---|---|
| MC-SD-01 | Systems Design & Architecture | System boundaries, architecture reasoning, state and data flow, trade-offs, failure analysis |
| MC-HC-01 | Human-Centered Interactive Systems | Interaction design, accessibility, usability evaluation, sensory and multimodal interface reasoning |
| MC-EG-01 | Evidence Governance & Responsible AI | Provenance, uncertainty, source evaluation, human oversight, correction and auditability |
| MC-AD-01 | Applied Digital Systems Delivery | Git/GitHub workflow, testing, debugging, release discipline, documentation and operational verification |

The first three are the initial assessment cohort. Applied Digital Systems Delivery is a separate practical credential and must not be inferred from having directed or reviewed AI-generated code.

## Levels

Each credential uses a four-level rubric:

- **Level 1 — Foundational:** explains concepts, recognizes risks, and locates relevant evidence.
- **Level 2 — Applied:** completes a bounded task with guidance and explains the result.
- **Level 3 — Independent:** completes, tests, troubleshoots, and justifies the task independently.
- **Level 4 — Advanced:** designs and evaluates systems under realistic constraints, including trade-offs and failure conditions.

A level is awarded per credential, not globally. No level is assumed from project ownership or title.

## Assessment rules

- Publish criteria and tasks before assessment.
- Require both a portfolio review and a candidate-performed assessment.
- Distinguish authored decisions, AI-assisted artifacts, and independently demonstrated skills.
- Record evidence links, assessor identity, date, rubric scores, limitations, and appeal/retake outcome.
- Award thresholds are level-specific: Level 1 (25–49) is formative only; Level 2 (50–74) may be awarded after a guided practical task with no dimension below 1; Level 3 (75–89) requires no dimension below 2 and independent practical completion; Level 4 (90–100) requires no dimension below 3, advanced practical evidence, and a second reviewer. No level overrides a critical failure.
- For Level 3 or 4, the practical task must be completed independently under documented conditions.
- Assessors must disclose conflicts of interest. Where possible, a second reviewer validates Level 3/4 decisions.
- Do not award a credential retroactively from a project description alone.

See [AI-Assessed Credential Policy](AI_ASSESSED_CREDENTIAL_POLICY.md) and [LinkedIn Publishing Guide](LINKEDIN_PUBLISHING_GUIDE.md) for the AI assessor rules and profile publication requirements.

## Issuance and verification

An issued record must contain:

- unique credential ID and verification URL;
- recipient name as the recipient chooses to publish it;
- issuer identity and contact route;
- exact achievement title and level;
- criteria and assessment version;
- issue date and, if applicable, expiry/reassessment date;
- evidence reviewed and assessment method;
- assessor(s), result, and explicit limitations;
- revocation/correction status.

The pilot may publish a human-readable credential record first. Before claiming Open Badges 3.0 compatibility, the issuer must implement and validate the specification, issuer identity, credential data, proof/signature, status, and verification workflow. A badge image or JSON file alone does not make a credential externally accredited.

## External pathway

The initial external sequence is:

1. **GitHub Foundations (GH-900)** — strongest first external credential for GitHub collaboration, repositories, project workflows, privacy/security basics, and community practices. Official exam is proctored; current listed price is USD $99, subject to region and change. The exam does not require renewal.
2. **GitHub Copilot (GH-300)** — a later option after practical preparation in responsible AI use, Copilot workflows, testing, privacy and human review.
3. **Microsoft Applied Skills** — choose a current lab-based credential that maps to the actual tools used in a demonstrable project; these validate scenario-based tasks rather than general project ownership.
4. **IBM SkillsBuild AI learning/badges** — a lower-cost or free learning route for foundational AI literacy; verify the current course and badge criteria before listing a specific badge as earned.

External registration, exam fees, identity checks, accommodations and issuance are controlled by the provider and the candidate. No exam has been booked and no external credential is claimed as earned in this program record.

## Standards and integrity

- Open Badges 3.0 is a technical standard for portable, verifiable achievement credentials. It is not an accreditor and does not itself validate the quality of a course or issuer.
- Mirror Cartographer is not currently an accredited education provider or an independently endorsed certification body.
- Do not use seals, language, or visual treatments that imply university, government, standards-body, or vendor accreditation.
- Internal credentials must be titled **Mirror Cartographer Internal Competency Credential** and identify the project as issuer.
- External credentials must be listed under the external issuer's exact official title and only after successful award.

## Current candidate status

**Candidate:** project founder / program designer  
**Portfolio evidence:** project direction, requirements, design decisions, iterative review, and collaborative artifacts are documented in the repository and related project records.  
**Assessment status:** competency assessments not yet completed; AI assessment is an approved assessor track under policy v1.1.  
**Credentials awarded under this program:** none.  
**Next step:** complete the first candidate assessment sequence in `ASSESSMENT_PLAN.md`.

This status is deliberate: the program is designed to make the work credible, not to manufacture a credential before the evidence has been tested.
