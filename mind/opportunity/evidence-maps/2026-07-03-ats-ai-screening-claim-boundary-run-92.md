# ATS / AI Screening Claim Boundary — Run 92

Date: 2026-07-03  
Status: evidence map added; claim downgraded  
Domain: AI opportunity work / resume strategy / hiring-screening evidence

## Claim tested

A broadly optimized resume can be made “impossible for an ATS or AI hiring screen to skip.”

## Result

The claim is rejected as stated.

A resume can be made more parsable, more role-aligned, and more legible to human and automated review systems. It cannot honestly be described as impossible for ATS, AI screening, recruiters, or hiring managers to skip.

## Fact vs. inference

### Facts

- Automated and AI-supported employment tools are used in hiring contexts, including screening and assessment, but their operation varies by vendor, employer configuration, job family, data source, and selection workflow.
- NIST AI RMF 1.0 warns that AI risks are context-dependent, hard to measure, affected by third-party systems/data, and may differ between developer and deployer use contexts.
- NIST identifies valid and reliable behavior, accountability/transparency, explainability, privacy, and harmful-bias management as characteristics of trustworthy AI systems.
- NIST also warns that risk metrics can be oversimplified, gamed, context-blind, or relied upon in unexpected ways.
- Employment selection procedures require job-relatedness, validity evidence, and adverse-impact review when used as selection mechanisms. The existence of a polished resume does not control all downstream selection criteria.
- Current litigation and regulatory scrutiny around AI hiring tools shows that automated screening is contested and not fully transparent to applicants.

### Inference

Resume optimization should be treated as a probabilistic opportunity-improvement strategy, not as a deterministic bypass of ATS or AI screening.

A stronger claim is:

> A role-targeted, plain-structured, evidence-rich resume can improve parse quality, keyword alignment, and human legibility, but cannot guarantee selection or prevent automated rejection.

## Source review

### NIST AI RMF 1.0

Source: National Institute of Standards and Technology, *Artificial Intelligence Risk Management Framework (AI RMF 1.0)*, NIST AI 100-1, January 2023.  
URL: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

Role: high-quality governance source.  
Directness: indirect but strong for AI-risk and measurement limits.  
Use: supports the boundary that AI screening systems are context-dependent and cannot be treated as predictable or fully controllable by applicant-side formatting.

Relevant evidence:

- AI systems can amplify or perpetuate inequitable outcomes without proper controls.
- AI risk measurement can be complicated by third-party data, third-party systems, and deployment context.
- Metrics can be oversimplified, gamed, or fail to account for affected-group differences and context.

### EEOC / employment selection principles

Source class: official civil-rights / employment-selection governance.  
Role: legal and selection-procedure boundary.  
Directness: strong for selection-tool validity and adverse-impact obligations; indirect for individual resume strategy.

Use: supports the claim that hiring screens are selection procedures requiring job-relatedness and validity logic. It does not support a claim that any applicant can force passage through a screen.

### Reuters reporting on Workday AI screening litigation

Source: Reuters legal reporting, 2024–2026.  
Role: current public signal about legal scrutiny of AI screening.  
Directness: indirect but useful context.  
Use: supports the point that AI hiring tools are contested, opaque, and consequential enough to generate litigation. It does not prove a specific ATS will reject or accept a given resume.

Relevant evidence:

- Reuters reported that a federal judge allowed major claims against Workday’s AI-powered screening tools to proceed in 2024.
- Reuters reported in June 2026 that Workday must face California claims alleging AI screening tools violated state law and disability-discrimination protections.

### Algorithmic hiring audit literature

Source class: academic / technical audit research.  
Role: evidence that hiring algorithms can require validity, stability, and fairness auditing.  
Directness: indirect but useful for evaluation design.

Use: supports the need for applicant-side claims to be tested empirically, not assumed.

## Claim-status update

Previous implied claim:

> AI/ATS-optimized resumes can be made impossible for screening systems to skip.

Updated claim:

> AI/ATS-aware resumes can improve parseability, role alignment, and reviewer legibility, but selection remains probabilistic and depends on job-specific criteria, vendor behavior, employer configuration, candidate pool, legal constraints, and human review.

Status: downgraded from overclaim to bounded strategy.

## Evaluation criterion: ATS-OPP-01

A resume optimization claim passes only if it defines the exact target system and outcome.

Required fields:

1. Target role and employer.
2. Job posting text and date captured.
3. Resume version tested.
4. Parsing format tested: PDF, DOCX, plain text, or application form.
5. Outcome measured: parsing accuracy, callback, recruiter view, interview, screen pass, or offer.
6. Comparator: generic resume, role-targeted resume, or alternate format.
7. Number of applications or tests.
8. Evidence of outcome.
9. Confounders: referral, timing, location, clearance, degree requirement, salary band, relocation, disability disclosure, assessment score, duplicate application, or internal candidate.
10. Claim allowed after test.

## Falsification checklist

Downgrade resume-screening claims if any are true:

- The claim says “guaranteed,” “impossible to skip,” “ATS-proof,” or “AI-proof.”
- The resume has not been tested against a real job posting or parser.
- The claim treats all ATS systems as equivalent.
- The claim ignores employer configuration and human review.
- The claim ignores knockout questions, degree filters, location filters, clearance filters, assessment tests, referrals, or internal candidates.
- The claim counts a submitted application as evidence of screening success.
- The claim uses keyword density as a substitute for demonstrated role fit.
- The claim optimizes for machine parsing while harming human readability.

## Test plan: RESUME-SCREEN-PILOT-01

Purpose: estimate whether a role-targeted MC-style resume improves screen outcomes compared with a generic broad resume.

Design:

- Select 30 job postings across 3 target lanes:
  - AI evaluation / human-AI interaction;
  - operations / systems analyst;
  - trust, safety, or evidence-quality roles.
- For each lane, create:
  - Version A: broad master resume;
  - Version B: role-targeted resume with exact evidence bullets and keyword alignment;
  - Version C: plain-text parser-safe resume.
- Run each version through at least two resume parsers where allowed.
- Track parsing accuracy for:
  - work history;
  - dates;
  - skills;
  - military/nuclear experience;
  - AI work;
  - nervous-system/somatic work;
  - projects / Mirror Cartographer.
- Submit only ethically and according to platform rules. Do not spam employers or submit duplicate applications where prohibited.
- Track outcomes by posting and version.

Minimum success condition:

- The targeted resume must improve either parser accuracy or real screening outcomes over the broad resume without reducing human readability.

## Current confidence

- High confidence that “impossible to skip” is an overclaim.
- Moderate confidence that role-targeted, parser-safe resumes improve screening odds in some contexts.
- Low confidence about magnitude of improvement until tested with real applications and known outcomes.

## Next proof needed

Run RESUME-SCREEN-PILOT-01.

The strongest next proof is not another resume draft. It is a controlled application/outcome ledger showing which resume versions produce parser accuracy, recruiter views, callbacks, interviews, or rejections across real target roles.
