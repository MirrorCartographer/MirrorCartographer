# Evidence Map — AI Opportunity Proof Packets as Selection Evidence

Date: 2026-06-30
Run: Evidence Engine run 18
Claim ID: C-OPP-SELECTION-VALIDITY-01
Status: supported selection-design constraint; implementation unvalidated

## Claim tested

AI opportunity proof packets, resumes, and role-fit artifacts can function as credible employment-selection evidence without formal job-related validation.

## Why this was a weak point

The AI opportunity work has repeatedly treated proof packets as stronger than ordinary resumes because they are concrete, source-backed, and artifact-based. That is plausible, but it can overreach. In employment-selection contexts, an artifact is not automatically valid because it is impressive, original, or well cited. It must be tied to the target job, scored by explicit criteria, and shown to support a defensible inference about future job performance.

## Evidence found

### Primary / high-quality sources

1. EEOC — Employment Tests and Selection Procedures, 2007
   - Source: https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures
   - Key facts:
     - Employers use many selection procedures, including cognitive tests, personality tests, work samples, simulations, background checks, performance appraisals, and other screening tools.
     - Selection procedures can be effective, but can violate federal anti-discrimination law if used intentionally to discriminate or if they disproportionately exclude protected groups unless justified under the law.
     - Under Title VII disparate-impact analysis, a selection procedure that disproportionately excludes a protected group must be job-related and consistent with business necessity.
     - The challenged practice should evaluate skills related to the particular job, not just general ability.
     - UGESP recognizes test validation methods for showing job-relatedness.

2. NIST AI RMF — Generative AI Profile, NIST AI 600-1, 2024
   - Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
   - Key facts:
     - GAI systems can generate confident false content, described by NIST as confabulation.
     - NIST recommends evaluating claims of model capabilities using empirically validated methods.
     - NIST recommends avoiding extrapolation from narrow, non-systematic, anecdotal assessments.
     - NIST recommends documenting human-AI configurations, oversight, citation/source verification, provenance, and limitations.

3. SIOP Principles for the Validation and Use of Personnel Selection Procedures, 2018
   - Source: https://www.siop.org/Research-Publications/Professional-Practice/Principles-for-the-Validation-and-Use-of-Personnel-Selection-Procedures
   - Key facts:
     - Personnel-selection procedures require evidence supporting the interpretation and use of scores.
     - Validation is not a property of the test alone; it concerns the inference made from assessment evidence for a specific use.
     - Job analysis, scoring structure, reliability, criterion relevance, construct definition, and fairness concerns are central to selection validity.

4. Uniform Guidelines on Employee Selection Procedures, 1978 / 29 CFR Part 1607
   - Source: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1607
   - Key facts:
     - Selection procedures with adverse impact require validation evidence or other lawful justification.
     - Content, criterion-related, and construct validation strategies are recognized.
     - Documentation matters: users of selection procedures are expected to maintain evidence of validity and adverse-impact analysis where applicable.

## Fact / inference separation

### Facts supported by sources

- Employment-selection tools and procedures can include work samples, simulations, tests, interviews, and other screening practices.
- Selection procedures need job-relatedness and business-necessity support when they create disparate impact.
- A selection artifact should measure skills related to the particular job, not merely general impressiveness.
- Generative AI outputs can contain confident falsehoods, so AI-produced career artifacts need source verification and empirical validation before being treated as reliable proof.
- Capability claims should not be upgraded from anecdotal or narrow examples alone.

### Inferences applied to Mirror Cartographer / AI opportunity work

- MC proof packets should be treated as candidate-evidence artifacts, not employment-selection instruments, until validated against specific roles.
- A proof packet can support a role-fit hypothesis only when the packet identifies the target role, required task domain, scored work sample, scoring rubric, reviewer protocol, source provenance, and limits of inference.
- A packet that is persuasive, poetic, or technically elaborate may still fail as selection evidence if it cannot be tied to job-critical tasks.
- If AI opportunity work claims that a packet should make a hiring system or recruiter recognize role fit, that claim requires empirical testing against actual job descriptions, reviewers, and selection criteria.

## Claim-status update

Previous implied status:
- Proof packets are strong evidence of role fit when they are detailed, sourced, and role-specific.

Updated status:
- C-OPP-SELECTION-VALIDITY-01: supported selection-design constraint; implementation unvalidated.

Allowed claim:
- Role-specific proof packets are a plausible way to organize candidate evidence when they are tied to job tasks, scored with explicit criteria, and bounded as hypothesis-supporting artifacts.

Disallowed claim:
- Proof packets prove employability, hiring priority, or job performance without role-specific validation, reviewer testing, adverse-impact awareness, and outcome evidence.

## New evaluation criterion

### OPP-SELECTION-VALIDITY-GATE-01

A proof packet may be labeled `selection-relevant` only if it passes all required checks:

1. Target role defined
   - The packet names one specific role or role family.
   - The role source is dated and cited.

2. Job-task mapping present
   - Each major claim maps to a real task, responsibility, competency, or work sample from the role.
   - General personality or intelligence claims are not accepted unless tied to job behavior.

3. Artifact-to-task link present
   - Each artifact shows observable work relevant to the target task.
   - Symbolic or narrative material must be translated into observable performance evidence.

4. Scoring rubric present
   - Criteria are explicit before scoring.
   - Passing thresholds are defined before review.
   - Failure conditions are included.

5. Reviewer protocol present
   - At least two reviewers can independently score the packet.
   - Reviewer instructions separate artifact quality from candidate liking, novelty, or aesthetic appeal.

6. Source/provenance present
   - AI-generated, human-authored, and co-created portions are disclosed.
   - External claims are cited.
   - Unsupported claims are marked as inference.

7. Validation boundary present
   - The packet states what it can and cannot prove.
   - It does not claim to predict job performance unless criterion evidence exists.

8. Fairness / adverse-impact note present
   - The packet identifies whether scoring could penalize nonstandard language, disability-related communication differences, educational background, veteran background, or unconventional work history.
   - Any such risk is logged as a review concern, not ignored.

## Falsification checklist

The claim that proof packets are strong opportunity evidence should be downgraded if any of the following occur:

- Three reviewers cannot agree on what job-relevant skill the packet demonstrates.
- Reviewers rate the packet highly for creativity but cannot identify role-critical evidence.
- A recruiter or domain reviewer says the packet is interesting but not useful for selection decisions.
- The packet depends on unverifiable AI-generated claims.
- The packet cannot be scored without knowing the candidate personally.
- The same packet is reused across unrelated roles without changing the task mapping.
- The packet causes unsupported confidence compared with a plain work sample.

## Test plan

### OPP-SELECTION-RUN-01

Sample:
- 5 existing AI opportunity proof packets.
- 5 target roles with dated job descriptions.
- 3 reviewers: one domain reviewer, one general hiring reviewer, one skeptical reviewer.

Procedure:
1. Freeze packets before review.
2. Freeze rubrics before review.
3. Ask reviewers to score each packet against target role tasks.
4. Record agreement on:
   - role relevance,
   - observable skill evidence,
   - source/provenance adequacy,
   - confidence boundary,
   - decision usefulness.
5. Compare packet review to a plain resume/work-sample summary.

Pass threshold:
- At least 80% reviewer agreement on the skill demonstrated.
- At least 70% of mapped claims judged role-relevant.
- No critical provenance failures.
- No packet may receive a confidence upgrade unless reviewers can cite the exact artifact evidence supporting it.

Downgrade rule:
- If fewer than 3 of 5 packets pass, downgrade the broader AI opportunity claim from `plausible` to `hypothesis only`.

## Bottom line

The evidence supports proof packets as a structured way to organize role-relevant evidence. It does not support treating them as validated proof of job performance, hiring priority, or employability. The next value step is not a more persuasive packet; it is reviewer-scored, role-specific validation.
