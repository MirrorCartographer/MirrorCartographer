# Evidence Map: ATS Optimization vs Job-Fit Evidence Boundary

Date: 2026-07-05
Area: AI opportunity work / career evidence / GitHub mind
Status: Claim narrowed

## Claim tested

AI opportunity work can make a resume or portfolio “work” by optimizing for ATS / AI screening.

## Updated claim status

Previous working assumption:

> Resume and portfolio artifacts can be optimized so AI hiring systems will not skip them.

Updated bounded claim:

> Resume and portfolio artifacts can be made more machine-readable and better aligned to job requirements, but ATS/AI-screening optimization is not evidence of job fit. Job fit requires role-specific mapping, work-sample evidence, and outcome tracking against actual postings and selection results.

## Why this weak point matters

The GitHub mind has been building career artifacts around high-paying AI work, portfolio proof, and applicant visibility. A hidden weak point is that “passing the screen” can be confused with “proving capability.” These are different claims.

- Search visibility is an access problem.
- Job fit is an evidence problem.
- Hiring outcome is an external validation problem.

Treating keyword optimization as proof risks overclaiming the value of AI-generated resumes, portfolios, or GitHub artifacts.

## Evidence found

### Facts

1. The EEOC states that employment tests and selection procedures can be effective for identifying qualified applicants, but can violate federal anti-discrimination laws if they intentionally discriminate or disproportionately exclude protected groups unless legally justified. Source: EEOC, “Employment Tests and Selection Procedures,” issue date 2007-12-01.

2. EEOC guidance distinguishes disparate treatment from disparate impact. For disparate impact, the relevant question is whether a selection procedure disproportionately excludes a protected group and, if so, whether it is job-related and consistent with business necessity. The EEOC also notes that determining disparate impact ordinarily requires statistical analysis.

3. EEOC guidance says the challenged policy or practice should be associated with skills needed to perform the job successfully, and that a general measurement of skill is not enough; the measure must evaluate skills as related to the particular job in question.

4. EEOC guidance states that the Uniform Guidelines on Employee Selection Procedures describe test validation methods for demonstrating job-relatedness and business necessity.

5. NIST’s AI Risk Management Framework is intended to help incorporate trustworthiness considerations into design, development, use, and evaluation of AI products, services, and systems. NIST frames AI risk as something managed through evaluation and lifecycle risk management rather than assumed from system claims.

### Inferences

1. If employers’ tools must be job-related and validated, then MC career artifacts should also be judged by job-related evidence rather than generic persuasive strength.

2. A resume that contains the right keywords may improve discoverability, but discoverability does not establish competence, role fit, or selection validity.

3. AI opportunity work should separate three layers:
   - Visibility: can the artifact be parsed and found?
   - Relevance: does it map to the posting’s actual tasks, skills, and constraints?
   - Proof: does the user have work samples, experience evidence, or evaluations that support the claims?

4. The GitHub mind should avoid language like “impossible for AI to skip” unless supported by observed screening outcomes across real applications.

## Claim boundary

Do not claim:

- “This resume will pass ATS.”
- “This artifact proves job fit.”
- “AI screening will recognize the user’s unique value.”
- “Keyword optimization makes the application competitive.”

Permitted narrower claims:

- “This artifact is structured for machine readability.”
- “This resume maps selected evidence to the stated job requirements.”
- “This portfolio artifact provides partial evidence for specific competencies.”
- “This application strategy requires outcome tracking before claiming effectiveness.”

## Evaluation criterion added

### MC-CAREER-EVIDENCE-ATS-01

Every AI opportunity artifact must be scored across four independent dimensions:

| Dimension | Pass condition | Failure signal |
|---|---|---|
| Parseability | Standard headings, clear dates, role titles, skills, and no layout-dependent meaning | Visually impressive but hard to extract |
| Job mapping | Each major claim maps to a specific posting requirement or occupational task | Generic strengths without role anchor |
| Proof evidence | Claims are backed by work history, artifact, project, metric, training, or plausible demonstration | Claims rely on personality framing only |
| Outcome tracking | Application result is logged: submitted, screened, interview, rejection, no response, referral | No feedback loop from real hiring outcomes |

Classification labels:

- Machine-readable
- Role-mapped
- Evidence-supported
- Outcome-tested
- Overclaimed
- Unsupported

## Falsification checklist

The claim “this artifact improves AI-job opportunity” should be downgraded if any of the following occur:

- The artifact cannot be parsed into role, dates, skills, and evidence without visual context.
- The artifact contains high-value claims that do not map to the target posting.
- The same artifact is used across materially different roles without remapping.
- No applications using the artifact produce interviews, recruiter replies, referrals, or useful feedback after a defined sample size.
- Human reviewers report confusion, overstatement, or unclear authorship.
- The artifact performs better as self-expression than as selection evidence.

## Test plan

### MC-ATS-JOB-FIT-PILOT-01

1. Select 20 real job postings across target opportunity categories:
   - AI evaluation / red teaming
   - AI safety operations
   - prompt / model behavior evaluation
   - technical writing / knowledge systems
   - product research / user insight
   - remote operations roles

2. For each posting, extract:
   - Required skills
   - Preferred skills
   - Evidence requested
   - Communication load
   - Degree requirements
   - Portfolio / work sample opportunities

3. Score the current resume and GitHub/MC artifacts using MC-CAREER-EVIDENCE-ATS-01.

4. Produce a gap matrix:
   - proven
   - partially supported
   - unsupported but testable
   - irrelevant
   - overclaimed

5. Submit or simulate structured applications and track outcomes.

6. Update claim confidence only after outcome evidence exists.

## Next proof needed

MC-ATS-JOB-FIT-PILOT-01 should be run on 20 real postings and at least 5 submitted applications. The next proof is not a better resume sentence; it is a measured relationship between artifact structure, job mapping, and real selection response.

## Source notes

- EEOC, “Employment Tests and Selection Procedures,” 2007-12-01. Key support: selection procedures can violate anti-discrimination law if they disproportionately exclude protected groups unless justified; disparate impact usually requires statistical analysis; selection procedures must be job-related and consistent with business necessity; UGESP describes validation methods.
- NIST, “AI Risk Management Framework,” released 2023-01-26, current page notes AI RMF 1.0 is being revised and describes the framework as supporting trustworthiness considerations in design, development, use, and evaluation.
