# Action Authority Ladder

Status: experimental
Privacy: public-safe
Attractor: contradiction
Created: 2026-06-29

## One-line definition

The Action Authority Ladder records what a claim is allowed to do at each maturity level, so evidence does not silently turn into advice, decision, or intervention before authority is earned.

## Why this exists

The GitHub Mind now contains a chain of assurance objects:

- Transformation Record
- Transformation-Liability-Care Loop
- Evidence Chain
- Evidence Provenance Ladder
- Evidence Readiness Gate
- Operational Evidence Density
- Claim Custody Chain
- Fluent Ambiguity Scorecard
- Constraint Atlas

These objects preserve source, evidence, revision, and custody. The missing contradiction is this:

A claim can be well-tracked and still be used for the wrong kind of action.

The Action Authority Ladder separates claim maturity from action permission.

## Source labels

Source type: public research synthesis
Source freshness: 2026 sources reviewed during this pass
Source examples:

1. A Trace-Based Assurance Framework for Agentic AI Orchestration: Contracts, Testing, and Governance, arXiv, 2026-03-18.
   Main relevance: agentic systems require message-action traces, contracts, deterministic replay, governance mediation, and allow/rewrite/block controls at the language-to-action boundary.
   URL: https://arxiv.org/abs/2603.18096

2. Agentic AI Governance and Lifecycle Management in Healthcare, arXiv, 2026-01-22.
   Main relevance: healthcare AI agent fleets need identity/persona registries, PHI-bounded memory, runtime policy enforcement, kill-switch triggers, lifecycle management, credential revocation, and audit logging.
   URL: https://arxiv.org/abs/2601.15630

3. AI Trust OS: A Continuous Governance Framework for Autonomous AI Observability and Zero-Trust Compliance in Enterprise Environments, arXiv, 2026-04-06.
   Main relevance: enterprise AI governance is shifting toward telemetry evidence, continuous posture, autonomous observability, and architecture-backed proof over policy-document trust.
   URL: https://arxiv.org/abs/2604.04749

4. Doctors and NHS could be sued for mistakes made by AI tools, The Guardian, 2026-06-09.
   Main relevance: AI-influenced healthcare errors can create liability for clinicians and institutions, increasing the need for clear accountability and governance.
   URL: https://www.theguardian.com/society/2026/jun/09/doctors-nhs-could-be-sued-mistakes-ai-tools-medical-protection-society-report

5. Deloitte UK aims to move hundreds of juniors into AI audits, Financial News London, 2026-05.
   Main relevance: large professional-services firms are expanding AI assurance capacity, suggesting market demand for AI audit and assurance work.
   URL: https://www.fnlondon.com/articles/deloitte-uk-aims-to-move-hundreds-of-juniors-into-ai-audits-70eccfec

## Claim labels

Claim 1: Evidence maturity does not automatically grant action authority.
Confidence: high
Reason: governance sources repeatedly distinguish traces, controls, policy enforcement, human oversight, and accountability from raw information quality.
Missingness: needs formal comparison against legal, clinical, and enterprise risk frameworks.

Claim 2: Mirror Cartographer should label allowed action explicitly for every meaningful claim.
Confidence: medium-high
Reason: this fits the existing Source -> Claim -> Missingness -> Revision direction and reduces the risk that fluent summaries become consequence-bearing without review.
Missingness: requires usability testing; too many labels could make the system heavy.

Claim 3: The strongest near-term income path is not general reflection software but AI evidence review with allowed-use labeling.
Confidence: medium
Reason: AI assurance demand is visible in public reporting and enterprise governance research, but Mirror Cartographer has not yet validated a paid buyer.
Missingness: needs a public demo, offer page, sample report, and first pilot.

Claim 4: The safest medical/social-care lane is support for continuity, uncertainty, and review routing, not diagnosis or treatment decisions.
Confidence: high
Reason: healthcare governance sources emphasize lifecycle management, bounded context, audit logging, accountability, and human oversight.
Missingness: implementation must be reviewed for privacy, consent, and jurisdiction-specific compliance before real PHI use.

## Privacy labels

Public-safe: yes
Contains personal medical facts: no
Contains private user data: no
Contains clinical advice: no
Contains repository secrets: no
External publication risk: low

## Missingness labels

Unknowns:

- Whether this ladder should be implemented as markdown, JSON schema, form fields, or a dashboard control.
- Whether users understand the difference between evidence maturity and action authority without training.
- Whether buyers prefer an audit deliverable, a compliance checklist, or an embedded review workflow.
- Which first market has the shortest path to revenue: creators, consultants, small businesses, legal-adjacent teams, healthcare-adjacent documentation teams, or AI builders.

## Revision labels

Revision status: new genesis concept
Derived from: Claim Custody Chain, Evidence Readiness Gate, and Transformation-Liability-Care Loop
Next revision target: convert into a template/matrix usable inside audits
Retirement condition: merge into Evidence Readiness Gate if later testing shows the distinction is unnecessary
Museum status: not eligible

## Ladder

### Level 0: Park

Allowed use:

- Store as observation.
- Do not summarize as fact.
- Do not advise action.

Required labels:

- Source unknown or weak.
- Missingness high.
- Confidence low or unset.

Example language:

This is an observation or possibility, not a conclusion.

### Level 1: Explore

Allowed use:

- Ask better questions.
- Search for sources.
- Compare alternatives.
- Generate hypotheses.

Not allowed:

- External publication as settled claim.
- Medical, legal, financial, or safety recommendation.

Required labels:

- Source label.
- Alternative explanations.
- Missingness.

Example language:

This is plausible enough to investigate, not strong enough to rely on.

### Level 2: Draft

Allowed use:

- Internal draft.
- Concept note.
- Private planning.
- Non-consequence-bearing summary.

Not allowed:

- Decision, intervention, or public claim without review.

Required labels:

- At least one credible source or clearly marked inference.
- Confidence label.
- Revision path.

Example language:

This can shape a draft, but it still needs review before use.

### Level 3: Review Route

Allowed use:

- Send to the right human/professional reviewer.
- Prepare appointment notes, audit notes, or decision-support context.
- Identify what kind of expertise is needed.

Not allowed:

- Treat as expert conclusion.
- Skip the reviewer because the summary sounds organized.

Required labels:

- Reviewer type needed.
- Consequence level.
- Known missing evidence.
- Privacy exposure.

Example language:

This is ready to route for review, not ready to act on independently.

### Level 4: Controlled Use

Allowed use:

- Use in a bounded workflow with human oversight.
- Support decisions where risk is low or where accountable review exists.
- Publish with clear scope limits if sources and uncertainty are explicit.

Required labels:

- Evidence chain.
- Claim custody chain.
- Review status.
- Allowed scope.
- Expiration/revision trigger.

Example language:

This can be used inside the stated boundary and should be revised when new evidence appears.

### Level 5: Audit-Ready

Allowed use:

- External report.
- Governance artifact.
- Decision record.
- Public-safe reference with traceable evidence.

Required labels:

- Source provenance.
- Transformation history.
- Review checkpoint.
- Missingness explicitly preserved.
- Consequence label.
- Revision history.

Example language:

This is ready to be inspected, challenged, and reconstructed.

### Level 6: Museum Candidate

Allowed use:

- Stable reference object.
- Teaching artifact.
- Reusable system primitive.

Required labels:

- Repeated internal use.
- Independent source support.
- Survived contradiction or revision.
- Clear limits.
- No hidden privacy risk.

Example language:

This has survived enough use and review to become a durable part of the system, while still remaining revisable.

## Practical lane 1: income

Near-term package:

AI Allowed-Use Review

Deliverable:

- claim inventory
- evidence maturity label
- action authority label
- custody chain
- missingness map
- fluent ambiguity score
- review routing recommendation
- allowed-use statement

Likely buyers:

- consultants producing AI-assisted research
- founders preparing investor, grant, or compliance materials
- small teams publishing AI-assisted claims
- creators documenting idea provenance
- healthcare-adjacent documentation teams needing non-clinical continuity support

First validation step:

Create two fictional public demos:

1. A business memo that overstates market evidence.
2. A care-summary note that turns observation into implied recommendation.

For each demo, show how the Action Authority Ladder prevents overuse.

## Practical lane 2: medical and social-care support

The ladder is useful for care contexts because it can prevent a common failure:

Observation becomes summary.
Summary becomes certainty.
Certainty becomes action.
Action creates consequence.

Safe contribution:

- preserve observation without inflating it
- identify missing evidence
- route to the right reviewer
- keep uncertainty visible
- prevent AI summaries from masquerading as diagnosis or treatment advice

Not allowed:

- diagnose
- prescribe
- replace clinician judgment
- treat medical inference as confirmed fact

## Relationship to contradiction

Contradiction selected this pass because the system contains a tension:

Mirror Cartographer wants claims to evolve toward use, but public-safe care and governance require preventing premature use.

The Action Authority Ladder makes that contradiction productive.

It allows movement without collapse.

## Relationship to beauty

Beauty here means rightful proportion.

A claim becomes beautiful when its action matches its evidence, authority, and consequence level.

## Relationship to continuity

Continuity requires that claims keep their allowed-use label as they travel.

If a claim moves from private reflection into public report or care context, its authority must be checked again.
