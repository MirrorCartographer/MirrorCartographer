# Evidence Map: Proof-of-Skill Before High-Paying AI Opportunity Claims

Date: 2026-06-29
Status: New evidence map
Claim family: AI opportunity work / GitHub mind evidence engine

## Claim Tested

AI opportunity work should not treat high-paying AI roles as reachable by narrative positioning alone. It should require a visible proof-of-skill artifact before upgrading an opportunity claim from `possible` to `actionable`.

## Why This Claim Was Chosen

Prior opportunity work has often focused on finding high-paying AI roles, OpenAI-adjacent opportunities, resume positioning, symbolic value, and public artifacts. The weak point is evidentiary: the strategy can overstate opportunity if it does not bind the claim to demonstrable skills, shipped artifacts, or work samples that a hiring system, recruiter, or technical reviewer can inspect.

This matters because AI labor-market demand is real, but demand does not automatically convert into access. The bridge is usually credible evidence of skill-market fit.

## Current Claim Status

Updated from: implicit assumption / motivational strategy

Updated to: supported as a labor-market design principle, but unvalidated for Mirror Cartographer or the user's specific opportunity path.

Confidence: moderate for the general principle; low-to-moderate for the specific MC opportunity implementation until tested against actual job descriptions and reviewer behavior.

## Evidence Found

### Source 1: World Economic Forum, Future of Jobs Report 2025

Relevant finding: the report identifies broadening digital access, AI and information processing, and automation as major labor-market forces through 2030. It reports strong growth in technology-facing skills such as AI and big data, networks/cybersecurity, and technological literacy, while also emphasizing analytical thinking, resilience, creativity, leadership, and other human-centered capabilities.

Use for this claim: supports the idea that AI opportunity work should map both technical and complementary human skills rather than relying only on identity, story, or symbolic originality.

Source: World Economic Forum, The Future of Jobs Report 2025, https://www.weforum.org/publications/the-future-of-jobs-report-2025/

### Source 2: Bone, Ehlinger, and Stephany, Skills or Degree? The Rise of Skill-Based Hiring for AI and Green Jobs

Relevant finding: analysis of approximately eleven million UK online job vacancies found evidence of skill-based hiring in AI roles, including declining university-degree mentions and a substantial wage premium for AI skills.

Use for this claim: supports the need for explicit skill evidence. It does not prove that portfolios beat resumes in every context, but it does support treating skills as a stronger unit of opportunity evidence than broad credentials alone.

Source: https://arxiv.org/abs/2312.11942

### Source 3: Mäkelä and Stephany, Complement or substitute? How AI increases the demand for human skills

Relevant finding: analysis of twelve million U.S. job vacancies found increased demand and wage premiums for AI-complementary skills such as digital literacy, teamwork, resilience, ethics, and related capabilities. The authors found AI's complementary effect larger than its substitution effect in their dataset and replicated results for the UK and Australia.

Use for this claim: supports the requirement that MC opportunity artifacts demonstrate hybrid capability: AI use plus judgment, ethics, communication, and domain sense.

Source: https://arxiv.org/abs/2412.19754

### Source 4: Popa, Oprea, and Bara, Generative-AI and the transformation of workforce

Relevant finding: a 2026 job-postings analysis of more than 150,000 English-language postings found strong post-2021 growth in AI-related skill mentions, including prompt engineering, fine-tuning, and model validation, plus continued demand for soft/meta skills.

Use for this claim: supports building an opportunity map around concrete skill clusters instead of role-title excitement alone.

Source: https://arxiv.org/abs/2605.00843

### Source 5: Jadhav and Danve, The AI Skills Shift

Relevant finding: a 2026 skill benchmark across O*NET skill categories found that some highly demanded AI-exposed skills are not the same as skills LLMs perform best at. The authors describe a capability-demand inversion and report observed AI interactions as mostly augmentation rather than automation. They also caution that the benchmark measures text-based representations of skills, not full occupational execution.

Use for this claim: supports not assuming that AI tool access equals job readiness. The proof artifact must show full-task execution, not only text generation.

Source: https://arxiv.org/abs/2604.06906

## Fact / Inference Separation

### Facts

1. AI-related skill demand in job postings has grown substantially in recent datasets.
2. Multiple labor-market analyses distinguish technical AI skills from complementary human skills.
3. Some research finds employers are placing increasing weight on skills rather than formal degree requirements in AI roles.
4. AI capability on text tasks does not equal full occupational execution.

### Inferences

1. MC opportunity work should require a proof-of-skill artifact before calling a role or path `actionable`.
2. A public evidence map, audit artifact, working demo, or evaluated repository may be a better opportunity signal than a narrative resume alone.
3. MC's strongest near-term opportunity strategy may be `evidence of unusual human-AI evaluation ability`, not generic AI enthusiasm.
4. A role should not be prioritized merely because it is high-paying; it should be prioritized when the user's evidence artifacts plausibly match the role's required skill signals.

## Requirement Added

### R-OPPORTUNITY-PROOF-01

No AI opportunity claim may be marked `actionable` unless it has at least one concrete proof artifact matched to the opportunity's required skill signals.

A proof artifact may be:

- a shipped demo,
- a GitHub repository with clear commits and evaluation notes,
- an audit report,
- a public evidence map,
- a falsification/test plan,
- a case study showing before/after decision improvement,
- or a small benchmark showing repeatable skill.

## Evaluation Criterion Added

### OPPORTUNITY-PROOF-01

For each proposed AI opportunity, score:

1. Role claim: What role, contract, buyer, or opportunity is being pursued?
2. Skill signals: What technical, analytical, communication, domain, or safety skills does it require?
3. Existing proof: What artifact proves those skills now?
4. Evidence gap: What missing artifact would make the claim stronger?
5. Reviewer test: Could a skeptical reviewer understand the proof in less than 10 minutes?
6. Market match: Does the artifact map to actual job-posting language or buyer needs?
7. Overstatement risk: Does the claim depend on implied potential rather than demonstrated execution?

Status levels:

- `not-actionable`: no artifact exists.
- `weak-signal`: artifact exists but does not map clearly to market skill signals.
- `actionable-experimental`: artifact maps to some role signals but has not been tested with reviewers.
- `actionable-supported`: artifact maps to role signals and has passed at least one reviewer, recruiter, buyer, or domain-expert test.

## Test Plan

1. Select five high-paying or high-leverage AI opportunities.
2. Extract required skills from current job descriptions or buyer descriptions.
3. Map each skill to existing MC/GitHub artifacts.
4. Mark every unsupported skill as an evidence gap.
5. Build one missing proof artifact for the strongest opportunity.
6. Send or show the artifact to at least one qualified reviewer.
7. Update opportunity status based on observed response, not internal confidence.

## Falsification Checklist

Reject or revise this claim if:

- recruiters or buyers respond better to narrative positioning than proof artifacts in tested cases;
- proof artifacts take too long to interpret and reduce opportunity conversion;
- the artifacts demonstrate skill but do not map to real market language;
- the strategy produces documentation without applications, interviews, buyers, or paid work;
- the system keeps labeling opportunities `actionable` without external feedback.

## Claim-Status Update

The opportunity engine should downgrade unsupported career/opportunity claims from `actionable` to `possible` until a matching proof artifact exists.

Recommended new statuses:

- `possible`: the market exists, but no proof match yet.
- `plausible`: some skill/artifact overlap exists.
- `actionable-experimental`: a matched artifact exists and can be submitted.
- `actionable-supported`: external review supports the match.
- `refuted-for-now`: evidence suggests the path is a poor fit or not worth current effort.

## Next Proof Needed

Create a one-page `Opportunity Proof Matrix` for three targets:

1. AI evaluator / model behavior analyst.
2. Human-AI interaction researcher or research assistant.
3. AI safety / governance evidence analyst.

For each target, map required skills to existing artifacts in the GitHub mind and identify the single missing artifact that would most improve credibility.

The next artifact should not be another resume. It should be a reviewer-readable proof file: `mind/opportunity-proof-matrix.md`.
