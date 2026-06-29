# Evidence Map: Opportunity Fit vs Applicant Evidence

Date: 2026-06-29

## Claim Tested

Mirror Cartographer / AI opportunity work assumes that identifying a strong conceptual role fit is enough to mark an opportunity as actionable.

## Claim Status Update

Status: **Partially supported as a direction, but not sufficient for actionability.**

The evidence supports a narrower claim: AI-related skills and demonstrable skills can improve labor-market signals, but a role should not be marked **Actionable** unless the GitHub mind can point to role-specific proof artifacts, evaluation criteria, and missing-evidence gaps.

## Why This Claim Needed Testing

Prior opportunity work has often moved from:

1. user strengths and MC artifacts,
2. to plausible job categories,
3. to claims that those roles are strategically viable.

That jump is weak. It can confuse:

- **Fit**: the role matches interests, cognition, and project direction.
- **Evidence**: the applicant can show proof recognized by the target role.
- **Actionability**: the application packet is credible enough to send now.

## Evidence Found

### Facts

1. Skill-based hiring appears especially relevant in AI roles. A large online-vacancy study found growth in AI-role demand and decreasing formal degree requirements in AI postings, with AI skills carrying a wage premium. This supports the idea that nontraditional candidates can compete when they can demonstrate relevant skills.

2. Experimental recruiter evidence from 2026 found that AI skills increased interview-invitation probabilities in hypothetical resume evaluations across several occupations. This supports AI skills as a positive hiring signal, but it does not prove MC artifacts specifically generate callbacks.

3. Model Cards for Model Reporting argue that a system should document intended uses, performance characteristics, limitations, and evaluated conditions. Although this is about ML models rather than job applications, the documentation logic applies by analogy: claims should be scoped to the context where evidence was actually tested.

4. Datasheets for Datasets similarly argue for structured documentation of motivation, composition, collection process, recommended uses, and limitations. This supports the broader principle that reusable artifacts need explicit provenance and intended-use boundaries.

### Inferences

1. MC opportunity work should treat job targeting as an evidence-mapping problem, not only a semantic-fit problem.

2. A role can be marked **Interesting** or **Strategic** before there is application-ready proof, but it should not be marked **Actionable** until the repo contains a role-specific proof packet.

3. MC artifacts should function like applicant evidence only when translated into employer-legible signals: portfolio artifact, evaluation result, writing sample, analysis memo, shipped product, issue/PR history, or validated workflow.

## Requirement Added

### R-OPPORTUNITY-EVIDENCE-02: Separate Fit From Applicant Evidence

Every opportunity recommendation must declare one of four statuses:

1. **Fit Hypothesis** — the role appears aligned with user strengths or MC direction, but no applicant evidence has been mapped.
2. **Evidence Candidate** — at least one artifact plausibly demonstrates relevant skill, but it has not been evaluated against a target role.
3. **Actionable Packet** — the opportunity has role-specific evidence, a tailored resume/summary, proof links, and a gap statement.
4. **Unsupported / Do Not Apply Yet** — the role requires credentials, experience, or proof not currently available.

A role cannot be labeled **Actionable Packet** based on interest, symbolic fit, or general AI enthusiasm alone.

## Evaluation Criterion Added

### OPPORTUNITY-EVIDENCE-02

Before an AI opportunity is marked actionable, an independent reviewer should be able to answer:

1. What exact role or role family is being targeted?
2. What job requirements are being claimed as satisfied?
3. Which artifact proves each requirement?
4. Is the artifact public, readable, and employer-legible?
5. Does the artifact show outcome quality, not merely process or intention?
6. What requirement remains unproven?
7. Would the packet still be credible if the MC framing were removed?

Success requires at least one proof artifact for each critical requirement, or a clearly stated gap.

## Test Plan

Create an `opportunity-proof-packet` for three role families:

1. AI evaluator / red-team analyst
2. Human-AI interaction research assistant
3. AI governance evidence analyst

For each role family, build a table with:

- role requirement,
- evidence artifact,
- proof strength,
- missing proof,
- next artifact to create,
- status.

Then score each packet using OPPORTUNITY-EVIDENCE-02.

## Falsification Checklist

Downgrade or reject an opportunity claim if any of the following are true:

- The role is recommended because it feels aligned, but no artifact proves the skill.
- The proof artifact only shows conversation, not execution.
- The artifact requires heavy explanation before its value is visible.
- The claimed skill is broader than the evidence supports.
- The application depends on MC being understood as novel before the applicant has shown conventional competence.
- The role requires credentials or domain authority the applicant does not have and cannot substitute with portfolio proof.

## Claim Relationship

Supports:

- R-OPPORTUNITY-PROOF-01: proof-of-skill before opportunity claim.
- R-EVIDENCE-02: evidence strength over evidence count.
- R-CONSTRUCT-01: evaluation must measure the intended construct.

Contradicts / weakens:

- Any opportunity artifact that upgrades role interest directly into application readiness.

Depends on:

- Existence of public or shareable portfolio artifacts.
- A maintained proof matrix linking artifacts to role requirements.

Confidence change: **decrease for broad opportunity claims; increase for role-specific proof-packet workflow.**

## Remaining Uncertainty

- The labor-market evidence supports AI skills and skill-based hiring generally, not MC-specific career conversion.
- Recruiter response to symbolic/cognitive architecture artifacts remains untested.
- Public artifact quality and discoverability may matter more than internal evidence quality.

## Next Proof Needed

Create `mind/opportunity-proof-packets/ai-governance-evidence-analyst.md` and map one target role family against actual MC artifacts.

The next proof should determine whether the current GitHub mind can produce a credible applicant packet **without relying on novelty language**. If the packet only makes sense after a long explanation of Mirror Cartographer, the opportunity is not yet actionable.

## Sources Consulted

- Bone, Ehlinger, Stephany. `Skills or Degree? The Rise of Skill-Based Hiring for AI and Green Jobs.` arXiv, 2023/2024 vacancy analysis.
- Stephany, Teutloff, Leone. `AI Skills Improve Job Prospects: Causal Evidence from a Hiring Experiment.` arXiv, 2026.
- Mitchell et al. `Model Cards for Model Reporting.` ACM FAccT / arXiv, 2018/2019.
- Gebru et al. `Datasheets for Datasets.` Communications of the ACM, 2021.
