# Evidence Map — AI Opportunity Salary Signal Boundary

Date: 2026-07-01
Run: Evidence Engine run 43
Claim ID: C-AI-OPPORTUNITY-SALARY-SIGNAL-01R
Status: supported evidence-boundary requirement; implementation unvalidated

## Claim tested

Weak claim / assumption tested:

> AI opportunity work can use high salary numbers from job posts, online claims, or occupational averages as reliable proof that a specific role is a strong opportunity.

## Result

The claim is not supported as stated.

A safer replacement claim is:

> Salary signals are useful for screening, but they are not proof of accessible opportunity. A role should not be treated as high-value until the salary source, employer legitimacy, job existence, work mode, task match, location constraints, selection requirements, and scam/ghost-posting risks are verified.

## Sources reviewed

1. U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics overview. BLS states that OEWS produces employment and wage estimates for approximately 830 occupations based on a survey of business establishments. OEWS covers wage and salary workers in nonfarm establishments and excludes self-employed workers, owners/partners in unincorporated firms, household workers, and unpaid family workers. BLS also states that OEWS estimates use a sample of about 1.1 million establishments collected over a 3-year period.
   Source: https://www.bls.gov/oes/oes_emp.htm

2. O*NET Resource Center, O*NET 30.3 Database. O*NET states that the database describes work and worker characteristics, including skill requirements, and covers work performed in the U.S. economy. It also states that O*NET updates the database quarterly, with a primary update in the third quarter of each year.
   Source: https://www.onetcenter.org/database.html

3. Federal Trade Commission, Job Scams. FTC states that scammers advertise jobs in many of the same places honest employers do and may promise jobs while seeking money or personal information. FTC warns against work-from-home offers promising high pay with little effort, paying for the promise of a job, and fake-check job schemes.
   Source: https://consumer.ftc.gov/articles/job-scams

## Fact vs inference

### Supported by sources

- BLS wage estimates are occupational and statistical; they are not proof that a specific opening exists or is accessible to a specific applicant.
- BLS OEWS excludes important categories relevant to AI opportunity work, including self-employed workers and owners/partners in unincorporated firms.
- O*NET is a structured occupational database for tasks, skills, and work characteristics; it is useful for task mapping but does not validate any particular job post.
- FTC identifies job scams that use ordinary job-ad channels and warns that high-pay, low-effort, remote-style claims can be deceptive.

### Reasonable inference for MC / AI opportunity work

- A salary number should be treated as a signal, not a conclusion.
- High salary alone can increase risk because scams and misleading listings often exploit large income promises.
- Opportunity ranking should require evidence for legitimacy, fit, and feasibility, not just income ceiling.
- AI-generated opportunity recommendations should separate occupational wage evidence from specific job-opening evidence.

### Not established

- That any current AI opportunity recommendation in the GitHub mind has verified employer-side salary evidence.
- That prior recommendations separated occupational wage averages from specific role compensation.
- That the current opportunity pipeline checks scam signals, stale listings, ghost postings, or unrealistic remote-work claims.
- That a high-paying role is actually reachable for the user without credential, location, portfolio, interview, clearance, or full-time availability constraints.

## Claim-status update

Retire:

- C-AI-OPPORTUNITY-SALARY-PROOF-01: "High posted salary or high occupational wage proves a strong AI opportunity."

Replace with:

- C-AI-OPPORTUNITY-SALARY-SIGNAL-01R: "Salary data is a screening signal only. Opportunity confidence requires verified employer/source evidence, job existence, task fit, constraints fit, and scam/ghost-posting checks."

Confidence: high for salary-as-signal boundary; low for current implementation adequacy.

## Evaluation criterion

An AI opportunity artifact may use salary to rank a role only if it records:

1. Salary source type: employer-posted range, recruiter claim, BLS/OEWS occupational estimate, O*NET-related task evidence, third-party salary site, or inferred estimate.
2. Whether the salary applies to the specific job opening or only the broader occupation.
3. Employer legitimacy evidence: official company careers page, verified domain, or other direct employer source.
4. Posting freshness: date found, date posted, and date last verified.
5. Work mode evidence: remote, hybrid, onsite, travel, schedule, full-time/part-time/contract.
6. Task-level fit: mapped to O*NET or direct job duties rather than title alone.
7. Constraint fit: location, credential, degree, clearance, availability, meetings, communication load, portfolio, and application friction.
8. Scam/low-trust flags: upfront payment, fake-check behavior, vague employer identity, unrealistic income, little-work promise, off-platform messaging pressure, personal-information request before verification.
9. Confidence level and reason for confidence.
10. Next verification step before application or recommendation escalation.

## Falsification checklist

A salary-based opportunity recommendation fails if any of the following are true:

- It treats BLS/OEWS occupational wage as proof of a specific opening's pay.
- It treats a recruiter or job-board salary claim as verified without employer-source confirmation.
- It ranks a role as high-value without checking whether the posting is still active.
- It ignores work-mode constraints while recommending remote or low-meeting work.
- It ignores required credentials, degree, clearance, schedule, or geography.
- It recommends a role with upfront-payment, fake-check, or high-pay/low-effort scam signals.
- It maps fit by title alone rather than tasks and work activities.
- It uses salary as the primary ranking factor without feasibility and legitimacy scores.
- It fails to record source date and verification date.
- It provides confidence language stronger than the evidence supports.

## Test plan: OPP-SALARY-SIGNAL-GATE-01

Audit the last 25 AI opportunity artifacts or recommendations.

For each role, record:

- role title,
- salary claim,
- salary source type,
- whether the salary is specific-opening evidence or occupational evidence,
- employer-source verification status,
- posting active/inactive/unknown,
- work-mode evidence,
- task-fit score,
- constraint-fit score,
- scam/low-trust flags,
- final opportunity confidence after downgrade.

Pass threshold before salary can be used as a high-confidence ranking signal:

- 100% of high-confidence recommendations must have employer-source verification or clearly marked occupational-only evidence.
- 100% must separate salary signal from job-existence signal.
- 100% must include scam/low-trust flag review.
- 90% or more must include task-level mapping, not title-only mapping.

## Next proof needed

Run OPP-SALARY-SIGNAL-GATE-01 across the last 25 AI opportunity artifacts and publish a salary-source ledger. Downgrade every recommendation where salary is occupational-only, unverified, stale, contradicted by constraints, or attached to scam/low-trust signals.

Until that ledger exists, AI opportunity work should say:

> Salary is a screening signal, not proof of opportunity. A role becomes actionable only after employer verification, freshness review, task fit, constraint fit, and scam/ghost-posting checks.
