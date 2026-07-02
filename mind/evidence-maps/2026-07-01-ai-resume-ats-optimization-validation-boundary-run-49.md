# Evidence Map — AI Resume / ATS Optimization Validation Boundary

Date: 2026-07-01
Run: Evidence Engine 49

## Claim tested

**C-AI-RESUME-ATS-OPTIMIZATION-01:** AI opportunity work can produce an “ATS-optimized” or “AI-flagging” resume that materially improves hiring outcomes because automated hiring systems will recognize the candidate as unusually important.

## Why this claim needed stronger evidence

Prior opportunity artifacts used language implying that a resume could be shaped to trigger AI sorting systems or be immediately recognized as high-value. That is a stronger claim than the evidence supports. It risks confusing three different things:

1. Formatting a resume so it can be parsed.
2. Aligning claims to job-related criteria.
3. Proving that an employer’s proprietary screening system will rank the applicant higher or produce an interview.

Only the first two can be reasonably controlled from outside the employer. The third requires employer-specific validation data that MC does not currently have.

## High-quality sources checked

- NIST AI Risk Management Framework page. NIST describes the AI RMF as a framework for managing AI risks to individuals, organizations, and society and for incorporating trustworthiness into AI design, development, use, and evaluation. Source: https://www.nist.gov/itl/ai-risk-management-framework
- EEOC / UGESP baseline as summarized in federal employment-selection guidance: selection procedures should be job-related and validated for their intended purpose. Search result evidence located EEOC/UGESP guidance around employment tests and selection procedures, including the requirement that tests and selection tools be properly validated for the positions and purposes for which they are used.
- FTC deceptive AI and job-opportunity enforcement/news. Recent FTC-related reporting and public guidance identify deceptive AI claims, passive-income claims, work-from-home scams, and high-pay/low-effort job claims as risk areas. Sources checked through Reuters/The Verge summaries of FTC actions and warnings.
- High-quality secondary synthesis on automated hiring risk: employment-selection and algorithmic-hiring research repeatedly treats automated hiring as a high-stakes sociotechnical system requiring validation, fairness review, context limits, and human accountability.

## Fact / inference split

### Supported facts

- AI hiring and screening systems are high-stakes decision-support tools; trustworthiness requires evaluation, governance, and risk management rather than mere persuasive formatting.
- Employment selection procedures are expected to be job-related and validated for their intended use. A resume strategy is not validated merely because it sounds optimized.
- Salary, prestige, keyword match, and resume polish are screening signals, not proof of hiring likelihood.
- Deceptive AI claims and high-pay / low-effort opportunity claims are known enforcement and consumer-protection risk areas.
- Outside an employer’s internal hiring pipeline, MC cannot know the exact weighting, model behavior, recruiter behavior, or ATS ranking function for a specific role.

### Inferences / unproven for MC

- MC can improve interview probability by rewriting a resume.
- A resume can be made to “flag” as important to OpenAI, Anthropic, Google, or another target employer.
- A nontraditional resume will outperform a conventional role-targeted resume.
- ATS optimization can be generalized across employers.
- A hiring AI will interpret symbolic, unusual, or highly aesthetic language as evidence of job fit rather than noise, risk, or lack of role alignment.

## Claim-status update

**Retire:** C-AI-RESUME-ATS-OPTIMIZATION-01

**Replace with:** C-AI-RESUME-JOB-RELATED-EVIDENCE-01R

**Status:** Partially supported boundary requirement; outcome claim unvalidated.

**Revised claim:** AI opportunity work may help produce clearer, more parseable, role-targeted application materials when each resume claim is tied to job requirements, evidence, and truthful source material. It may not claim validated improvement in ATS ranking, recruiter response, interview probability, hiring probability, or employer-specific AI recognition unless measured with outcome data.

## Evaluation criterion added

A resume or opportunity artifact passes the **JOB-RELATED-EVIDENCE-GATE** only if it includes:

1. Target role and employer.
2. Source job posting date and URL or copied posting text.
3. Required qualifications extracted from the posting.
4. Preferred qualifications extracted from the posting.
5. Candidate evidence mapped to each qualification.
6. Unsupported or aspirational claims clearly labeled.
7. No claim that the artifact will beat, trigger, bypass, or manipulate ATS/AI screening unless validated by real outcome data.
8. Plain-language version and conventional version when using unusual symbolic language.
9. Outcome ledger field: submitted / response / interview / rejection / unknown.
10. Post-submission update requirement before increasing confidence.

## Falsification checklist

The claim fails if any of the following are true:

- The resume uses “AI will flag this” language without employer-specific evidence.
- The artifact optimizes for buzzwords without mapping them to role tasks.
- It implies guaranteed or likely hiring outcomes without submission data.
- It uses salary or prestige as proof of accessibility.
- It presents symbolic identity language as job-fit evidence without a task bridge.
- It omits a conventional recruiter-readable version.
- It cannot identify which claims are verified by work history, project artifacts, GitHub commits, public demos, references, or measurable outputs.

## Test plan

**OPP-RESUME-VALIDATION-GATE-01**

Sample: last 20 AI opportunity / resume artifacts in the GitHub mind.

For each artifact, score:

- Parseability: 0–2
- Truthfulness / source support: 0–2
- Job-posting alignment: 0–2
- Evidence specificity: 0–2
- Outcome-data availability: 0–2
- Overclaim risk: 0–2, reverse scored
- Recruiter-readable conventional path present: 0–2
- Symbolic-to-task bridge present: 0–2

Required outputs:

- Role-fit ledger
- Unsupported-claim ledger
- ATS-overclaim ledger
- Submitted-outcome ledger
- Revision list separating conventional resume edits from experimental/symbolic variants

## Current confidence

Low-to-moderate confidence that AI can improve clarity, formatting, and role alignment.

Low confidence that AI-generated resume changes improve actual hiring outcomes without controlled or at least longitudinal submission data.

No current evidence that MC can reliably cause an ATS or employer-side AI to flag a candidate as unusually important.

## Next proof needed

Run **OPP-RESUME-VALIDATION-GATE-01** on the last 20 opportunity/resume artifacts. Then run a real-world outcome ledger across at least 30 applications: role, version submitted, source posting, response outcome, days to response, interview/no interview, and whether a conventional or symbolic variant was used. Confidence should not increase until submission outcomes show a measurable pattern.
