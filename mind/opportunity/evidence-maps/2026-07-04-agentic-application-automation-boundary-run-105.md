# Evidence Map — Agentic Application Automation Boundary

Date: 2026-07-04
Area: AI opportunity work / career automation / GitHub mind evidence quality
Run: Evidence Engine 105

## Claim tested

AI opportunity work can safely scale job-search/application labor by using AI agents or automation to research roles, tailor materials, and submit applications at high volume.

## Claim status update

**Downgraded / narrowed.**

AI can assist with role research, resume tailoring, application tracking, gap analysis, and draft preparation. It should not be treated as safe to autonomously submit applications, represent the applicant, fabricate fit, bypass platform rules, or optimize purely for volume without explicit review and evidence.

The stronger claim is now:

> AI-assisted career tooling is acceptable as a preparation and decision-support layer when it preserves truthful representation, user consent, platform compliance, audit logs, and human review before submission.

## Evidence found

### Facts

1. NIST AI RMF 1.0 is intended to help organizations manage AI risks to individuals, organizations, and society across AI design, development, use, and evaluation. It is voluntary, but it frames AI trustworthiness as lifecycle risk management, not raw capability or efficiency.
   - Source: NIST AI Risk Management Framework overview, https://www.nist.gov/itl/ai-risk-management-framework

2. NIST states that the AI RMF is meant to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. This supports treating agentic application tooling as a governed workflow requiring evaluation and risk controls.
   - Source: NIST AI Risk Management Framework overview, https://www.nist.gov/itl/ai-risk-management-framework

3. The EEOC has treated AI/software screening in employment as legally meaningful where software may determine whether applicants are ever considered. Reuters reported that the EEOC argued Workday may qualify as an employment agency in litigation involving AI-powered applicant screening.
   - Source: Reuters, 2024-04-11, https://www.reuters.com/legal/transactional/eeoc-says-workday-covered-by-anti-bias-laws-ai-discrimination-case-2024-04-11/

4. FTC enforcement around AI claims shows that claims about AI replacing professional services or producing high-value outcomes require substantiation. Reuters reported FTC action against multiple companies for deceptive AI claims and schemes in September 2024.
   - Source: Reuters, 2024-09-25, https://www.reuters.com/technology/artificial-intelligence/ftc-announces-crackdown-deceptive-ai-claims-schemes-2024-09-25/

5. Public reporting on the FTC DoNotPay case states that DoNotPay was penalized after allegedly making broad AI legal-service claims without adequate testing or qualified professional review. This is not a hiring case, but it is a useful analogy for career automation claims that imply professional-grade replacement without validation.
   - Source: The Verge, 2024-09-25, https://www.theverge.com/2024/9/25/24254405/federal-trade-commission-donotpay-robot-lawyers-artificial-intelligence-scams

### Inferences

1. Career automation is not automatically unsafe, but the risk changes when the system moves from **drafting/support** to **acting/submitting/representing**.

2. The correct MC boundary is not "never automate." The boundary is: do not automate actions that materially represent the user to employers unless the user has reviewed, approved, and can audit the exact content and target.

3. High-volume automation may create false-positive opportunity signals: more applications does not prove better fit, higher truthfulness, better accessibility, or better career alignment.

4. The AI-opportunity work should treat application automation as a regulated-adjacent, reputation-sensitive workflow because it involves employment, identity, truthfulness, disability/veteran status choices, and platform rules.

## Unsupported or overbroad interpretations

- This evidence does not prove that all job-application automation is illegal.
- This evidence does not prove that human review eliminates all risk.
- This evidence does not prove that platform rules are identical across LinkedIn, Workday, Greenhouse, Lever, Google, Apple, OpenAI, or other hiring systems.
- This evidence does not prove that AI-generated resumes perform better than human-written resumes.
- This evidence does not justify promising callbacks, job offers, ATS passage, or guaranteed income.

## Evaluation criterion added

### CAREER-AUTOMATION-BOUNDARY-01

Any AI-assisted job application workflow must classify each action into one of five levels:

1. **Research only** — gathers roles, requirements, salary, company context, constraints.
2. **Draft support** — prepares resume bullets, cover letters, application answers, gap analysis.
3. **Decision support** — recommends prioritization and explains fit / mismatch.
4. **Submission preparation** — fills forms locally or prepares exact fields for review.
5. **External action** — submits, messages, signs, certifies, or represents the user externally.

Levels 1–3 are allowed with normal evidence and review.
Level 4 requires exact field preview, source-role mapping, and user approval.
Level 5 is blocked unless all of the following are true:

- the user explicitly authorizes the specific submission or message;
- the exact content is visible before action;
- no material facts are fabricated or exaggerated;
- platform terms and employer instructions are not bypassed;
- an audit record stores target, date, content, sources, and approval;
- sensitive disclosures are never inferred or inserted without explicit instruction.

## Falsification checklist

The claim "this career automation workflow is safe enough to use" fails if any answer is **yes**:

- Does the workflow submit or message externally without explicit approval for that specific target?
- Does it invent education, credentials, employment dates, titles, clearances, salary history, references, disability/veteran claims, or portfolio proof?
- Does it hide AI involvement where disclosure is required by the employer/platform?
- Does it optimize for application count without measuring fit, response quality, or downstream harm?
- Does it bypass CAPTCHA, authentication, rate limits, anti-bot systems, or platform restrictions?
- Does it store sensitive personal/career data without retention, deletion, and access rules?
- Does it lack a replayable record of what was submitted and why?

## Test plan

### CAREER-AUTOMATION-PILOT-01

Purpose: determine whether AI-assisted application preparation improves application quality without increasing misrepresentation or compliance risk.

Sample:
- 20 real job postings across AI, operations, support, research, accessibility, creative tooling, and systems-analysis roles.
- 3 workflow variants:
  1. manual-only baseline;
  2. AI draft + human review;
  3. AI draft + structured evidence/claim boundary checklist.

Measures:
- truthfulness errors per application;
- unsupported claim count;
- role-fit score with cited evidence;
- missing requirement count;
- application readability;
- recruiter-facing clarity;
- time saved;
- callback/interview/rejection outcome where available;
- user stress/friction score;
- audit completeness.

Pass condition:
- Variant 3 must reduce unsupported claims and missing requirements without increasing fabrication, hidden disclosure risk, or platform-rule risk.

Fail condition:
- Any material misrepresentation, unverifiable credential, undisclosed sensitive inference, or external action without explicit approval fails the pilot regardless of response rate.

## Next proof needed

Run **CAREER-AUTOMATION-PILOT-01** on 20 real roles and compare output quality against manual-only and unstructured AI-assisted drafts. The next proof is not whether automation can create more applications; it is whether the structured workflow creates better, truer, more auditable applications without increasing risk.
