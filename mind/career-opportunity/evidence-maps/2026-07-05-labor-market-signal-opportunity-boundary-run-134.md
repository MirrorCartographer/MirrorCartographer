# Evidence Map — Labor Market Signals Are Not Opportunity Proof

Date: 2026-07-05
Area: AI opportunity work / career-opportunity evidence
Status: Claim narrowed; evidence map + falsification checklist added

## Claim tested

**Original weak claim / assumption**

> Labor-market signals, job-posting trends, salary data, and occupational projections can identify the best AI opportunity or career direction.

## Updated claim status

**NARROWED**

Labor-market signals can support opportunity hypotheses, but they do not prove individual fit, near-term hiring probability, compensation reality, accessibility, or durable career value. They must be treated as inputs to an evidence stack, not as proof of opportunity.

## Source-quality boundary

### Fact record

1. The U.S. Bureau of Labor Statistics develops employment projections through a multi-step modeling process involving labor force, aggregate economy, final demand, industry output, industry employment, and occupational employment. These projections depend on models, assumptions, historical data, and expert review rather than direct observation of the future.
   - Source: BLS Employment Projections Methods Overview, last modified 2026-04-29
   - URL: https://www.bls.gov/emp/documentation/projections-methods.htm

2. BLS occupational employment projections use the National Employment Matrix, OEWS, CES, QCEW, CPS, structural-change analysis, scholarly sources, expert interviews, news sources, historical data, and externally produced projections.
   - Source: BLS Employment Projections Methods Overview
   - URL: https://www.bls.gov/emp/documentation/projections-methods.htm

3. O*NET describes itself as a comprehensive database of worker attributes and job characteristics. Its data collection is multi-method and draws on analyst ratings, employer job postings, government programs, job incumbents, machine learning, NLP, occupational experts, transactional data, and web research. Portions of profiles are refreshed annually, while job titles and software skills may be updated more frequently.
   - Source: O*NET Data Collection Overview, site updated 2026-05-19
   - URL: https://www.onetcenter.org/dataCollection.html

4. EEOC technical assistance states that employment tests and selection procedures can be effective but may violate federal anti-discrimination laws if used improperly. It distinguishes general measurement from job-related assessment and states that challenged practices must evaluate skills as related to the particular job in question.
   - Source: EEOC Employment Tests and Selection Procedures, issued 2007-12-01
   - URL: https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures

5. Recent labor-market data research notes that online job postings are difficult to access and are not always standard or transparent, while O*NET is structured but may be updated less frequently and based on survey methods.
   - Source: Meisenbacher, Nestorov, and Norlander, "Extracting O*NET Features from the NLx Corpus to Build Public Use Aggregate Labor Market Data" (arXiv, 2025)
   - URL: https://arxiv.org/abs/2510.01470

## Fact vs inference separation

### Facts

- Occupational projections are modeled outputs, not guarantees.
- O*NET is structured and high-value but compiled through mixed methods and update cycles.
- Job postings are useful for current demand signals but can be incomplete, duplicated, opaque, or non-standardized.
- Selection evidence must be job-related; general ability or market demand does not prove fit for a particular job.

### Inferences

- MC/AI-opportunity work should treat job-market data as a hypothesis generator.
- A career or opportunity recommendation becomes stronger only when labor-market evidence is joined with role-specific requirements, user constraints, work samples, application outcomes, and external feedback.
- High salary, growth, or posting frequency should raise investigation priority, not confidence by itself.

## Evaluation criterion added

### MC-OPPORTUNITY-SIGNAL-VALIDATION-01

Any AI opportunity or career recommendation must classify each supporting signal into one of five evidence layers:

| Layer | Evidence type | Required status |
|---|---|---|
| L1 Market signal | BLS/O*NET/job postings/salary reports | Hypothesis only |
| L2 Role specification | Real job descriptions and task requirements | Must be mapped to the user or project |
| L3 Capability evidence | Resume evidence, artifacts, tests, portfolio, work samples | Must be externally interpretable |
| L4 Access evidence | Application response, recruiter reply, interview, client inquiry, warm intro, purchase, user test | Needed before claiming opportunity traction |
| L5 Outcome evidence | Offer, paid contract, conversion, sustained use, income, retention, or measured benefit | Needed before claiming validated opportunity |

## Claim-status update

- Previous: "AI can find the best opportunity by scanning market demand and matching the user/project pattern."
- Updated: "AI can generate opportunity hypotheses from market demand. Opportunity strength requires validated mapping to real roles, proof artifacts, access signals, and outcomes."

## Falsification checklist

A claimed AI opportunity should be downgraded if any of the following are true:

- The opportunity is supported only by salary or trend data.
- The role title is broad but no current postings are mapped.
- Required credentials, schedule, communication load, location, clearance, or degree requirements conflict with user constraints.
- The recommendation lacks a work-sample bridge.
- No external human or market actor has responded positively.
- The opportunity depends on an unverified assumption about automated hiring systems.
- The opportunity cannot be tested with a low-cost application, pitch, prototype, or portfolio artifact within a short cycle.

## Test plan

### MC-LABOR-MARKET-SIGNAL-PILOT-01

1. Select 15 candidate AI-opportunity directions.
2. For each, collect:
   - BLS/O*NET occupational mapping where available.
   - 5 current job postings or client/project analogs.
   - Salary/rate range, remote status, credential constraints, communication burden, and tool requirements.
3. Score each opportunity on the five evidence layers above.
4. Build one proof artifact or application packet for the top 3 opportunities.
5. Track external outcomes for 30 days: views, replies, interviews, client interest, paid work, or rejection reasons.
6. Reclassify each opportunity as:
   - Market-only hypothesis
   - Role-mapped hypothesis
   - Artifact-supported hypothesis
   - Access-confirmed opportunity
   - Outcome-validated opportunity
   - Falsified / blocked by constraints

## Confidence

Medium confidence for the boundary claim. The sources strongly support the distinction between market signals, structured occupational data, and job-related validation. They do not identify which specific opportunity is best for the user or MC; that requires the pilot above.

## Next proof needed

**MC-LABOR-MARKET-SIGNAL-PILOT-01**

Run a 15-opportunity audit using current postings, occupational data, proof artifacts, and 30-day external response tracking. Do not promote any opportunity above "hypothesis" until it has role mapping plus either artifact evidence or access evidence.
