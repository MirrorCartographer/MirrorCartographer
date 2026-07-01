# Evidence Map — AI Opportunity Fit Validation Boundary

Date: 2026-07-01
Run: Evidence Engine run 42
Area: AI opportunity work / GitHub mind claim governance
Status: Claim boundary update + evaluation criterion + falsification checklist

## Claim tested

**C-AI-OPPORTUNITY-FIT-01:** AI opportunity work can infer a person's job fit from conversation history, resume fragments, symbolic preference patterns, or assistant judgment strongly enough to recommend roles as if they are validated fits.

## Claim-status update

**Retire:** C-AI-OPPORTUNITY-FIT-01

**Replace with:** C-AI-OPPORTUNITY-FIT-01R

> AI opportunity work may generate candidate role hypotheses from conversation/profile evidence, but those hypotheses are not validated job-fit claims until they are linked to explicit job requirements, work behaviors, validated selection criteria, and outcome evidence. Conversation-derived fit is an exploratory signal, not proof of employability, likely performance, lawful selection validity, or hiring probability.

Status: **Supported boundary requirement; MC/opportunity implementation unvalidated.**

## Why this needed testing

The AI opportunity work has repeatedly tried to identify high-value roles, OpenAI/company targets, remote work paths, and "jobs that pay to think." A weak point is that role recommendations can sound precise even when they are produced from partial self-description, symbolic language, assistant interpretation, and public job descriptions. That can overstate certainty and create false proof of fit.

This matters because job-fit claims can become action-directing: they influence where effort goes, which applications get sent, which opportunities are ignored, and how the user's identity/work value gets framed.

## Primary / high-quality sources reviewed

1. U.S. Equal Employment Opportunity Commission, **Employment Tests and Selection Procedures**. The EEOC states that selection tools can be effective, but can violate anti-discrimination laws if they disproportionately exclude protected groups unless justified under the law. It also says selection procedures should be properly validated for the positions and purposes for which they are used, job-related, and appropriate for the employer's purpose.
   - Source: https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures

2. Electronic Code of Federal Regulations, **29 CFR Part 1607 — Uniform Guidelines on Employee Selection Procedures**. The Uniform Guidelines require attention to job analysis, criterion-related validity, content validity, construct validity, adverse impact documentation, and evidence that the selection procedure is related to work behaviors and job performance.
   - Source: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1607

3. O*NET Resource Center, **O*NET Content Model**. O*NET structures occupational information into worker characteristics, worker requirements, experience requirements, occupational requirements, work context, tasks, and occupation-specific information. This supports using structured occupational descriptors as role-fit inputs, not relying only on impressionistic role titles.
   - Source: https://www.onetcenter.org/content.html

## Evidence found

### Supported facts

- Employment tests and selection procedures include many assessment types, including cognitive tests, personality tests, sample job tasks, performance tests, interviews, and other screening methods.
- The EEOC warns that tests and selection procedures may violate federal anti-discrimination law when they disproportionately exclude protected groups and are not job-related and consistent with business necessity.
- EEOC best practices state that employment tests and selection procedures should be properly validated for the positions and purposes for which they are used.
- The Uniform Guidelines distinguish different validation strategies, including criterion-related, content, and construct validity.
- UGESP states that job analysis for content validity should analyze important work behaviors required for successful performance and their relative importance.
- UGESP warns that content validity is weaker when the selection procedure does not resemble actual work behavior, work context, or work product.
- O*NET provides structured occupational descriptors covering worker characteristics, worker requirements, experience requirements, occupational requirements, work context, and occupation-specific tasks.

### Inferences allowed

- AI opportunity recommendations should be treated as **role hypotheses** unless they map user evidence to explicit occupational requirements and task-level evidence.
- A recommendation based on conversation history can support exploration, prioritization, or resume tailoring, but not a validated claim that the person will succeed in the role.
- Stronger opportunity evidence requires triangulating at least three layers: user-side evidence, role-side requirements, and outcome-side feedback.

### Inferences not yet justified

- That the current GitHub mind can reliably infer the user's best career path.
- That symbolic/cognitive/emotional language is enough to validate role fit.
- That a role title such as "AI safety researcher," "prompt engineer," "AI evaluator," "research analyst," or "founder" is a validated fit without task-level comparison.
- That a high-paying or prestigious role is a good target without evidence of requirements, constraints, applicant funnel, and outcome probability.
- That assistant-generated resumes or applications are likely to pass screening without employer-specific feedback or application outcome data.

## Boundary rule

AI opportunity work must separate four levels:

1. **Interest signal** — user says the work sounds desirable or meaningful.
2. **Preference signal** — user constraints match some role features, such as remote work, low meetings, puzzle-like work, autonomy, or high pay.
3. **Task-fit hypothesis** — user evidence maps to actual tasks and work behaviors in the role.
4. **Validated fit claim** — task-fit hypothesis is supported by work sample results, employer feedback, interview outcomes, selection criteria, or longitudinal performance evidence.

Only level 4 may be treated as validated fit.

## Evaluation criterion: OPP-FIT-VALIDITY-GATE-01

A GitHub mind opportunity recommendation must include the following fields before it can be marked stronger than exploratory:

- **Role title and employer context**
- **Source date and posting/source URL**
- **Specific tasks or work behaviors required**
- **O*NET or equivalent occupational descriptor mapping, when applicable**
- **User evidence used** — resume, work history, portfolio, stated preference, work sample, prior performance, or conversation-derived signal
- **Evidence type label** — fact, self-report, assistant inference, public labor-market data, employer requirement, or outcome evidence
- **Fit claim level** — interest signal, preference signal, task-fit hypothesis, or validated fit claim
- **Known gaps** — missing credential, missing portfolio, missing work sample, unclear legal/employer requirement, unknown competition, uncertain communication burden
- **Adverse-impact / fairness caution** if used for selection, screening, ranking, or exclusion
- **Next test** — work sample, application, informational interview, recruiter feedback, portfolio artifact, or measured outcome

## Falsification checklist

A role-fit recommendation must be downgraded if any of these are true:

- The recommendation relies mainly on a role title rather than actual tasks.
- The recommendation uses personality, symbolism, or conversation tone as if it were validated work-performance evidence.
- The recommendation does not state what evidence is fact versus inference.
- The recommendation lacks a task-level comparison between user evidence and role requirements.
- The recommendation ignores constraints the user has repeatedly stated, such as low-meeting preference, need for money, remote/minimal communication preference, or dislike of generic business framing.
- The recommendation claims high probability of hire without application/interview/outcome data.
- The recommendation treats a public job posting as proof of accessible opportunity.
- The recommendation uses AI screening logic without validation, fairness, or adverse-impact caution.
- The recommendation omits the next test that could prove or disprove fit.

## Test plan

**Test name:** `OPP-FIT-VALIDITY-GATE-01`

**Sample:** Last 25 GitHub mind opportunity recommendations, resume artifacts, job-target lists, or role claims.

**Method:**

1. Extract each explicit or implied role-fit claim.
2. Assign claim level: interest signal, preference signal, task-fit hypothesis, validated fit claim.
3. Identify source of user evidence: direct fact, self-report, assistant inference, symbolic pattern, resume artifact, work sample, or external outcome.
4. Identify role evidence: posting, O*NET descriptor, employer page, BLS/O*NET occupation profile, interview/recruiter evidence, or none.
5. Score each claim against the evaluation criterion.
6. Downgrade any claim that lacks task-level mapping or outcome evidence.
7. Publish an opportunity-fit ledger with pass/fail status and next proof required.

**Pass condition:**

A recommendation may be marked as a **task-fit hypothesis** only if it includes explicit task/work-behavior mapping and evidence labels.

A recommendation may be marked as a **validated fit claim** only if it includes at least one direct outcome signal, such as employer response, interview progression, work-sample evaluation, portfolio review, or demonstrated performance on representative tasks.

## Confidence

Moderate confidence in the boundary rule. The evidence clearly supports the need for job-related validation and structured occupational analysis. Lower confidence in how this maps to every AI opportunity artifact because the current repository has not yet been audited end-to-end.

## Next proof needed

Run `OPP-FIT-VALIDITY-GATE-01` across the last 25 opportunity artifacts and produce a ledger with:

- claim text,
- claim level,
- evidence source,
- task mapping status,
- unsupported inference flags,
- missing proof,
- downgrade decision,
- and next test.

The strongest next proof would be a small portfolio/work-sample battery tied to 3 target role families, then tracking actual employer/reviewer response instead of relying on narrative fit.