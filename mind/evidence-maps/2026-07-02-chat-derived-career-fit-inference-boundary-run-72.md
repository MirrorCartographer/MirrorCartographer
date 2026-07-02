# Evidence Map — Chat-Derived Career Fit Inference Boundary

Date: 2026-07-02
Run ID: evidence-engine-run-72
Area: AI opportunity work / career trajectory mapping
Status: claim weakened and bounded

## Claim tested

AI opportunity work can infer a person's true career fit, passion, or best life trajectory from chat history and symbolic preference patterns.

## Why this needed stronger evidence

The current opportunity work often uses conversation history, symbolic preferences, frustration patterns, stated dislikes, and high-level cognitive style to recommend career directions. That can be useful for hypothesis generation, but it risks overstating interpretation as evidence. A career-fit claim becomes much stronger only when it is tied to validated vocational-interest measurement, job-analysis criteria, observed behavior, constraints, and outcome tracking.

## Evidence found

### Source 1 — O*NET Interest Profiler / U.S. Department of Labor

O*NET describes the Interest Profiler as a self-assessment career exploration tool that helps users identify work activities and occupations they would like or find exciting. It measures six occupational interest areas: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. O*NET also states that the tool has construct-validity and reliability evidence, and that results can be linked to more than 900 occupations.

Source: https://www.onetcenter.org/IP.html

Relevance: Strong evidence that career-interest matching should be treated as a structured measurement problem, not merely a freeform interpretation problem.

Boundary: O*NET supports vocational-interest exploration. It does not prove that Mirror Cartographer or AI opportunity analysis can infer the same constructs accurately from chat history without administering or validating an instrument.

### Source 2 — EEOC guidance on employment tests and selection procedures

The EEOC states that tests and selection procedures can help determine who is qualified for a job, but they can violate federal law if they discriminate or disproportionately exclude protected groups unless justified. For disparate-impact analysis, a selection procedure must be job-related and consistent with business necessity. The EEOC also notes that the challenged practice must evaluate an individual's skills as related to the particular job in question, rather than a general measurement detached from the job.

Source: https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures

Relevance: Strong evidence that any claim about suitability for a specific role needs job-related validation, not only a narrative explanation of personality, passion, or symbolic fit.

Boundary: This applies most directly to employer selection tools. The AI opportunity work is advisory, not an employer selection system, but the same validation logic is useful if MC claims predictive career suitability.

### Source 3 — NIST AI Risk Management Framework

NIST's AI RMF frames trustworthy AI around governance, mapping, measurement, and management of risk across the AI lifecycle. The relevant boundary is that AI system outputs should be assessed using explicit context, measurement, risk mapping, and monitoring rather than treated as trustworthy because they sound coherent.

Source: https://www.nist.gov/itl/ai-risk-management-framework

Relevance: Supports requiring explicit evaluation criteria, provenance, and risk tracking for AI-generated opportunity recommendations.

Boundary: NIST provides a risk-management framework; it does not validate any specific MC career recommendation method.

### Source 4 — Rhea et al. 2022, external stability audit of AI personality prediction in hiring

Rhea et al. distinguish reliability from validity and show that algorithmic personality-prediction systems used in hiring can be unstable. Reliability is necessary but not sufficient for validity.

Source: https://arxiv.org/abs/2201.09151

Relevance: Supports caution against inferring stable traits or career suitability from limited or unstable signals.

Boundary: The study audits specific personality-prediction systems, not MC. It is indirect but relevant to the failure mode of overclaiming psychological inference.

## Fact vs inference

### Supported facts

- Structured vocational-interest tools exist and can measure occupational interest domains with documented psychometric work.
- O*NET links interest profiles to occupation exploration, not guaranteed employment or life-fit outcomes.
- Job-specific suitability claims require job-related criteria and validation logic.
- Coherent AI explanations about personality or fit should not be treated as valid measurements without reliability, stability, and outcome testing.

### Reasonable but unproven inferences

- Chat history may contain useful signals about disliked work conditions, preferred cognitive tasks, motivation, and constraints.
- Symbolic-emotional patterns may help generate career hypotheses a user actually recognizes as meaningful.
- AI opportunity work may be useful as a navigation layer before formal testing, job sampling, or real-world validation.

### Unsupported / not allowed as current claims

- MC can identify the user's true passion from chat history.
- A career recommendation is validated because it feels resonant.
- Symbolic coherence equals occupational fit.
- AI-derived fit scoring predicts income, hiring success, job satisfaction, or long-term life trajectory without outcome data.

## Claim-status update

C-CHAT-DERIVED-CAREER-FIT-01R: Chat-derived career fit is supported only as hypothesis generation and preference extraction. It is unvalidated as a measurement of true passion, job suitability, income likelihood, hiring probability, or life trajectory fit.

## New evaluation criterion — Career Fit Evidence Ladder

Any MC or AI opportunity career recommendation must be labeled by evidence level:

### Level 0 — Aesthetic / symbolic resonance

The recommendation matches metaphors, identity language, or emotional tone. This is not evidence of job fit.

Required label: symbolic hypothesis only.

### Level 1 — Stated preference match

The recommendation matches explicit user statements about desired work, constraints, dislikes, or life goals.

Required evidence: direct quote or source note.

### Level 2 — Structured interest alignment

The recommendation maps to a structured vocational model such as RIASEC / O*NET interests.

Required evidence: completed interest profile or clearly documented proxy mapping.

### Level 3 — Job-analysis alignment

The recommendation maps to actual job tasks, work context, skills, abilities, and constraints.

Required evidence: O*NET occupation profile, job posting analysis, or role-specific task list.

### Level 4 — Behavioral evidence

The user has performed analogous tasks and shown competence, persistence, or satisfaction.

Required evidence: portfolio artifacts, work history, task samples, project logs, or third-party feedback.

### Level 5 — Outcome validation

The recommendation has produced real-world results.

Required evidence: applications submitted, interviews, offers, paid work, user-rated fit after trial, income, retention, or repeat demand.

## Falsification checklist

The claim that chat-derived career fit is useful should be weakened if:

- Recommendations feel resonant but do not lead to action.
- Recommendations repeatedly ignore concrete constraints such as remote work, low meetings, income needs, health limits, or location goals.
- Structured O*NET / RIASEC results contradict the chat-derived recommendations.
- The same chat evidence can justify many incompatible careers.
- Blind reviewers cannot distinguish high-fit from low-fit recommendations.
- Application outcomes show no improvement over baseline job search.
- User-rated fit declines after real task trials.

## Test plan — OPP-CHAT-FIT-CALIBRATION-PILOT-01

Purpose: Determine whether chat-derived career recommendations add value beyond structured interest and constraint matching.

Sample:

- 30 career recommendations generated from chat-derived evidence.
- 30 comparison recommendations generated from O*NET / structured preference data only.
- 10 deliberately plausible but weak-fit distractor recommendations.

Procedure:

1. For each recommendation, record the evidence level from the Career Fit Evidence Ladder.
2. Separate symbolic resonance, stated preference, skills evidence, constraints, and market evidence.
3. Blind-rank recommendations by predicted user actionability.
4. Have the user rate each recommendation for resonance, practicality, energy, fear/avoidance, and willingness to test.
5. Run a small real-world test for the top 5 recommendations: job search, portfolio sample, outreach, or paid micro-offer.
6. Track outcomes for 30 days.

Metrics:

- Action rate: percentage of recommendations that lead to concrete action.
- Constraint pass rate: percentage satisfying non-negotiable constraints.
- Resonance-practicality gap: high emotional resonance but low practical actionability.
- Evidence-level distribution.
- Outcome signal: interviews, applications, paid interest, portfolio completion, or user-rated sustained fit.

Retirement rule:

If Level 0-1 recommendations consistently feel meaningful but fail to produce action or outcomes, MC must stop presenting symbolic career fit as strong opportunity evidence and restrict it to reflection-only language.

## Implementation note

This update does not say chat history is useless. It says chat history is not enough by itself to validate career fit. The correct use is: generate hypotheses, extract constraints, identify testable work samples, and then validate against structured vocational measures plus real-world outcomes.

## Next proof needed

Run OPP-CHAT-FIT-CALIBRATION-PILOT-01 using the user's existing AI opportunity recommendations. Publish a ledger with each recommendation's evidence level, source basis, constraint pass/fail, user action taken, and 30-day outcome signal.