# Evidence Map Run 28 — AI Opportunity Job-Posting Signal Boundary

Date: 2026-06-30
Status: new evidence map + claim-status update + falsification checklist
Repository area: `mind/evidence-maps/`

## Claim tested

C-JOB-POSTING-SIGNAL-01:

> AI opportunity work can treat public job postings, AI-role counts, and visible hiring pages as strong proof of real market demand, role availability, or personal opportunity value.

## Status update

Retire C-JOB-POSTING-SIGNAL-01.

Replace with C-JOB-POSTING-SIGNAL-01R:

> Public job postings are useful opportunity-discovery signals, but they are not strong proof of real hiring demand, compensation value, or candidate fit unless triangulated against official labor data, occupational taxonomies, employer verification, posting freshness, application response evidence, and outcome tracking.

Confidence: moderate for the governance boundary; unvalidated for MC/AI-opportunity implementation.

## Why this weak point matters

The AI opportunity work can accidentally overstate weak market signals. A role page, LinkedIn listing, or spike in AI-skill mentions can feel like proof that a path is open and high value. That is not enough. The system needs a gate that separates:

- fact: a listing exists;
- evidence-backed inference: a skill appears in a growing share of postings;
- unsupported leap: this role is actively hiring, likely reachable, well-paid, and strategically worth pursuing.

## Source evidence

### 1. BLS employment projections are modeled, multi-step, and assumption-dependent

The U.S. Bureau of Labor Statistics describes occupational employment projections as a six-step process involving labor force, aggregate economy, final demand, industry output, industry employment, and occupational employment. BLS states these steps use different procedures, models, and assumptions, with feedback for consistency.

Source: https://www.bls.gov/emp/documentation/projections-methods.htm

Evidence role: high-quality official source.

Implication: BLS projections are stronger than scraped job listings for long-range occupational context, but even they are projections, not guarantees of individual opportunity.

### 2. BLS occupational employment projections combine official survey data with structural-change review

BLS says base-year occupational employment uses sources including OEWS, CES, QCEW, and CPS. For projected-year employment, BLS uses a conceptual framework and economist review of qualitative and quantitative sources, including scholarly articles, expert interviews, news, historical data, and external projections.

Source: https://www.bls.gov/emp/documentation/projections-methods.htm

Evidence role: high-quality official source.

Implication: opportunity claims should triangulate job postings with official labor-market sources and should label projections as projections.

### 3. O*NET is a stronger occupational taxonomy source than arbitrary role-title matching

O*NET describes itself as a comprehensive database of worker attributes and job characteristics. It uses a multi-method collection program including job incumbents, occupational experts, analyst ratings, employer job postings, machine learning, NLP, government programs, and web research.

Source: https://www.onetcenter.org/dataCollection.html

Evidence role: high-quality official/Department of Labor-linked source.

Implication: AI opportunity maps should normalize roles to O*NET/SOC-style occupational constructs before claiming skill fit or market direction.

### 4. O*NET is updated, but not instant or individually predictive

O*NET states it spans 900 occupation profiles and over 55,000 jobs, with portions refreshed annually and job titles/software skills updated more frequently.

Source: https://www.onetcenter.org/dataCollection.html

Evidence role: high-quality occupational-information source.

Implication: O*NET supports structured role analysis, not proof that a specific listing is active or that a specific candidate will be selected.

### 5. Online job-posting datasets are valuable but difficult to access, standardize, and validate

A 2025 labor-market data paper on extracting O*NET features from the National Labor Exchange corpus states that online job-posting data are difficult to access and are not built in a standard or transparent manner. The same work treats job postings as a corpus needing extraction, benchmarking, and validation rather than as direct truth.

Source: Meisenbacher, Nestorov, Norlander, 2025, `Extracting O*NET Features from the NLx Corpus to Build Public Use Aggregate Labor Market Data`.

Evidence role: recent research source; not official policy; useful for method caution.

Implication: AI opportunity work should log dataset provenance, deduplication, posting age, employer source, and extraction confidence.

### 6. Ghost jobs and non-filled postings create a real distortion risk

Reporting based on Greenhouse client data described 18% to 22% of 2024 advertised roles as postings that never actually got filled. This is not a universal labor-market statistic, but it is strong enough to justify a falsification check against stale, evergreen, or non-hiring listings.

Source: Wall Street Journal, 2025-01-13, `Fake Job Postings Are Becoming a Real Problem`.

Evidence role: high-quality journalism using platform data; not a government estimate.

Implication: an opportunity map must not equate listing count with active hiring.

## Fact / inference separation

### Facts supported by sources

- BLS occupational projections are modeled through a multi-step process using official datasets and assumptions.
- BLS projections include economist review of structural changes and multiple source types.
- O*NET uses multi-method occupational data collection and is updated over time.
- Online job-posting data can be useful but require normalization, extraction, deduplication, and validation.
- Some visible job postings may not correspond to a role that is actively filled.

### Reasonable inferences

- AI opportunity work should treat job postings as opportunity-discovery signals, not proof.
- A strong opportunity packet should triangulate postings against BLS/O*NET, direct employer evidence, recruiter/hiring-manager activity, response rate, and actual application outcomes.
- Posting freshness, repost patterns, vague descriptions, and employer verification should become downgrade triggers.

### Not supported

- That a visible AI job posting proves a real opening exists.
- That a rise in AI-skill mentions proves a specific person can get hired.
- That job-posting counts alone prove compensation, role quality, remote availability, or selection likelihood.
- That MC/AI opportunity work currently performs adequate labor-market validation.

## Evaluation criterion added

OPP-SIGNAL-VALIDITY-GATE-01

An AI opportunity claim may be upgraded only if it passes all required fields below:

1. Role identity
   - normalized occupation family or O*NET/SOC-aligned category;
   - direct employer source when possible;
   - no reliance on title alone.

2. Posting integrity
   - posting date captured;
   - source URL captured;
   - employer careers-page verification attempted;
   - duplicate/repost pattern checked;
   - evergreen/pool listing marked.

3. Market triangulation
   - BLS/O*NET or equivalent official occupational source checked;
   - at least one current market source checked;
   - claim separates long-range occupational outlook from immediate hiring.

4. Candidate-fit evidence
   - required tasks extracted;
   - required skills separated from preferred skills;
   - proof packet maps evidence to tasks, not vibes;
   - missing requirements listed.

5. Outcome feedback
   - application sent/not sent logged;
   - response/no response logged;
   - interview/rejection/ghosting logged;
   - confidence updated from outcomes.

## Falsification checklist

Downgrade any AI opportunity claim if one or more is true:

- The role is only found on an aggregator and not on the employer career page.
- The posting is older than 30 days with no update.
- The same role appears repeatedly with identical language across many locations.
- The listing has no hiring manager, team, salary, location, or active requisition signal.
- The claim uses `AI is booming` as evidence for a specific role.
- The claim maps the user's fit to broad traits instead of actual job tasks.
- The claim cites salary without source date, geography, and compensation type.
- No application outcome data exists after repeated recommendations.

## Implementation instruction for future AI opportunity artifacts

Every opportunity artifact must label each role signal as one of:

- `verified active opening`
- `likely active opening`
- `weak posting signal`
- `evergreen/pool signal`
- `market-trend signal only`
- `discarded / stale / non-actionable`

No role may be called `high-confidence opportunity` without employer verification and task-level fit mapping.

## Current conclusion

C-JOB-POSTING-SIGNAL-01R is a supported evaluation-governance boundary. It does not prove the AI opportunity system is accurate. It only defines the minimum evidence discipline needed before opportunity claims can be upgraded.

## Next proof needed

Run `OPP-SIGNAL-VALIDITY-GATE-01` on the last 20 AI opportunity recommendations or role packets.

Produce a ledger with:

- number of roles verified on employer career pages;
- number downgraded as weak aggregator signals;
- number likely stale or evergreen;
- number with task-level fit mapping;
- number with actual application outcome feedback;
- confidence change for each recommendation.

If fewer than 50% pass employer verification and task-level fit mapping, downgrade the AI opportunity work from `actionable opportunity map` to `exploratory market scan` until evidence improves.
