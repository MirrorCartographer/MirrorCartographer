# Evidence Map — Opportunity Proof Packet Validity

Date: 2026-06-30  
Run: Evidence Engine 06  
Claim ID: C-OPPORTUNITY-02  
Status: supported design requirement; hiring-outcome claim unvalidated

## Claim tested

Mirror Cartographer opportunity proof packets can support role-fit claims when they map concrete work artifacts to job-relevant requirements.

## Why this needed stronger evidence

The existing opportunity proof matrix risked converting symbolic project language into career confidence. That is a weak point because hiring evidence needs job relevance, observable skill, and evaluable work samples, not just conceptual resonance or novelty branding.

## Source set

1. NIST AI Risk Management Framework page, official NIST source. NIST states that AI RMF is intended to help incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. It also describes the framework as voluntary and developed through public/private collaboration.
   URL: https://www.nist.gov/itl/ai-risk-management-framework

2. FactSheets: Increasing Trust in AI Services through Supplier's Declarations of Conformity, Arnold et al., 2018. The paper argues for standardized AI service documentation including purpose, performance, safety, security, and provenance information.
   URL: https://arxiv.org/abs/1808.07261

3. Uniform Guidelines on Employee Selection Procedures, 1978, administered by U.S. equal-employment agencies. The Guidelines are a legal/professional baseline for selection procedures: selection methods should be job-related and validated when used for employment decisions.
   URL searched: https://www.eeoc.gov and 29 CFR Part 1607 references

4. Personnel-selection research summarized in Schmidt & Hunter 1998 and later I/O psychology literature: work samples, structured interviews, cognitive ability measures, and job-analysis-based procedures have stronger evidentiary standing than unstructured impressions. This source supports the direction of using structured work artifacts, but does not validate any specific MC packet.
   Reference: Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology.

## Fact / inference separation

### Facts from sources

- NIST AI RMF supports explicit attention to design, development, use, evaluation, and trustworthiness considerations in AI systems.
- AI documentation approaches such as FactSheets emphasize purpose, performance, safety, security, and provenance rather than vague trust claims.
- Employment-selection guidance and I/O psychology standards emphasize job-relatedness, validation, and structured assessment over unstructured judgment.
- Work samples and structured selection methods are treated in personnel-selection literature as stronger evidence than branding, self-description, or unstructured interviews.

### MC inferences

- An MC proof packet should be treated as a structured work sample, not as proof of general brilliance, uniqueness, or guaranteed hireability.
- Role-fit evidence should be judged at the requirement level: requirement -> artifact -> observable behavior -> reviewer score -> uncertainty.
- The strongest immediate use of MC opportunity packets is not “this gets the job,” but “this makes the skill claim inspectable.”
- Hiring readiness remains unproven until an external reviewer with role knowledge scores the packet against real job requirements.

## Claim-status update

Previous implicit claim:

- “MC artifacts can demonstrate opportunity fit.”

Updated claim:

- “MC artifacts may support opportunity fit only when converted into structured work samples mapped to explicit job requirements and scored by an external rubric.”

Current status:

- C-OPPORTUNITY-02: supported design requirement; implementation unvalidated.

Downgraded / prohibited wording:

- Do not say: “This proof packet proves hiring readiness.”
- Do not say: “MC makes the user uniquely qualified.”
- Do not say: “A role match is actionable without a scored packet.”

Allowed wording:

- “This packet presents job-relevant evidence for review.”
- “This artifact demonstrates a candidate skill if the role values evidence mapping, risk documentation, or AI-governance synthesis.”
- “Hiring readiness requires external scoring against the actual role.”

## Evaluation criterion: OPP-PACKET-GATE-01

A proof packet may support a role-fit claim only if it passes all required checks:

1. Role requirement named exactly.
2. Concrete artifact linked to that requirement.
3. Observable skill described without identity or novelty language.
4. Evidence type labeled: direct work sample, indirect signal, inference, or unsupported.
5. Reviewer can score artifact quality from 0-2.
6. Reviewer can state what remains unproven.
7. Packet includes at least one falsification condition.
8. Packet does not imply employment outcome, recruiter preference, or hiring-system behavior without evidence.

Scoring:

- 0 = fails; mostly branding or unsupported self-description.
- 1 = partial; artifact exists but job mapping or scoring is weak.
- 2 = passes; role requirement, artifact, skill, uncertainty, and falsification path are explicit.

Minimum standard:

- Average score >= 1.6 across three reviewers.
- No item may score 0 on checks 1, 2, 4, or 8.

## Falsification checklist

C-OPPORTUNITY-02 should be downgraded if:

- reviewers cannot identify the demonstrated skill;
- reviewers disagree about which role requirement the artifact supports;
- the packet depends on “Mirror Cartographer” branding to seem valuable;
- the artifact is impressive but not job-relevant;
- the packet raises confidence without improving evaluator clarity;
- a real job description cannot be mapped without forcing the fit.

## Next proof needed

Create one role-specific packet for “AI governance evidence analyst” using a real job description. Remove all MC novelty language. Ask three reviewers, or one qualified reviewer plus two structured proxy reviewers, to score it with OPP-PACKET-GATE-01.

Pass condition:

- reviewer average >= 1.6;
- reviewer can name the demonstrated skill;
- reviewer can name one unproven claim;
- no reviewer says the packet is mainly branding.

## Confidence

Moderate confidence that structured proof packets are a better opportunity artifact than identity claims or broad resumes. Low confidence that the current MC proof packet would improve real hiring outcomes. No causal employment claim is made.
