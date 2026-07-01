# Evidence Lane Router

Date: 2026-07-01

## Boundary labels

Source status: derived from public-safe Mirror Cartographer architecture files, previously committed MC boundary notes, and public AI governance references. Private-context material was used only to infer abstract architectural pressure. No raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying operational details are included.

Claim status: architectural hypothesis, product requirement draft, and evaluation proposal. Not empirical validation, clinical guidance, legal guidance, financial guidance, legal guidance, or proof of user benefit.

Privacy status: public-safe abstraction. Contains only method-level language, source-boundary rules, evaluation criteria, product requirements, and implementation planning.

Missingness: needs repository-wide source inventory, synthetic test fixtures, UI copy testing, evidence taxonomy review, public/private artifact audit, and implementation against the live MC interface.

Revision reason: previous notes defined boundary metadata, meaning integrity, proof transfer, provenance gates, continuity containers, and source-boundary compilation. This note adds an evidence-routing layer so claims are sent to the right proof lane before being saved, exported, or published.

Allowed output class: product requirement, evaluation criterion, implementation plan, research question, and boundary note.

Forbidden source leakage: no transcript-derived quotation, case-specific detail, identity detail, household detail, health or animal-care detail, financial detail, credential detail, location detail, relationship detail, or private operational history.

Evidence upgrade path: convert synthetic examples into test cases, connect each claim class to public sources or controlled evaluation, then add automated linting that blocks unsupported proof-language.

## Public-safe finding

Mirror Cartographer needs an **Evidence Lane Router**.

The existing architecture can preserve meaning, source boundaries, provenance, continuity, and proof-transfer limits. The next required step is routing each claim to the correct evidence lane before MC treats it as durable, reusable, exportable, or public.

A claim should not be evaluated by how compelling it feels. It should be evaluated by whether the evidence type matches the domain.

## Core problem

MC connects symbolic, emotional, product, research, interface, governance, and implementation material.

That connection is valuable for orientation.

It becomes dangerous if every connected insight is allowed to wear the same proof status.

Examples of lane errors:

| Claim shape | Wrong lane | Correct lane |
|---|---|---|
| Symbolic resonance | Treated as fact | Reflective / interpretive lane |
| User-confirmed meaning | Treated as universal truth | Personal-state lane |
| Product requirement | Treated as implemented feature | Build / implementation lane |
| Interface preference | Treated as general accessibility proof | UX evidence lane |
| Research citation | Treated as product validation | Source-backed claim lane |
| Repeated pattern | Treated as diagnosis or guarantee | Hypothesis / question lane |
| AI-generated synthesis | Treated as external evidence | System-generated hypothesis lane |

## Router rule

**Every claim must be assigned to the evidence lane that could actually prove or falsify it.**

Meaning may route broadly.

Proof must route narrowly.

## Evidence lanes

### 1. Symbolic / reflective lane

Allowed claims:

- This metaphor may help orient a user.
- This symbol recurs inside a session or artifact.
- This pattern may be meaningful to the participant.

Not allowed:

- diagnostic claim
- factual authority claim
- general human claim
- prediction of outcome

Evidence that upgrades this lane:

- user confirmation
- session comparison
- explicit consented reflection log
- usability study on comprehension or resonance

### 2. Personal-state lane

Allowed claims:

- A user chose this interpretation.
- A user marked this state as relevant.
- A persistent profile contains this user-approved mapping.

Not allowed:

- universalizing the mapping
- publishing identifying source detail
- using repetition as proof of objective truth

Evidence that upgrades this lane:

- user-controlled confirmation
- editable memory record
- consent event
- retention/deletion log

### 3. Product / implementation lane

Allowed claims:

- This is a requirement.
- This is a planned module.
- This file defines a schema.
- This feature exists if verified in code or deployment.

Not allowed:

- claiming a feature is live without repository or deployment proof
- treating intention as implementation

Evidence that upgrades this lane:

- commit hash
- deployed URL
- test result
- issue or pull request
- code path
- screenshot or reproducible interaction

### 4. Research / source-backed lane

Allowed claims:

- A public source states a specific fact.
- A framework defines a risk-management concept.
- A paper proposes a taxonomy or method.

Not allowed:

- treating a citation as proof that MC works
- treating analogy as validation

Evidence that upgrades this lane:

- primary source citation
- multiple independent sources
- explicit scope boundary
- replication or benchmark result

### 5. Safety / governance lane

Allowed claims:

- This output class carries privacy risk.
- This artifact needs review before publication.
- This action should be blocked, downgraded, or relabeled.

Not allowed:

- assuming privacy because names were removed
- assuming safety because the content is abstract

Evidence that upgrades this lane:

- privacy review checklist
- red-team attempt
- leakage test
- NIST-style risk management mapping
- incident or near-miss log

### 6. Evaluation lane

Allowed claims:

- This criterion would test the system.
- This benchmark would measure a claimed capability.
- This synthetic fixture checks source-boundary behavior.

Not allowed:

- treating a proposed metric as passed
- treating one good example as validation

Evidence that upgrades this lane:

- test suite
- evaluator notes
- pass/fail logs
- inter-rater comparison
- regression history

## Relation to public governance sources

The Evidence Lane Router aligns with the general structure of AI risk management because it turns broad safety principles into repeatable operational checks.

NIST describes the AI RMF as a voluntary framework for improving the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems. NIST also describes AI risk management as ongoing work connected to resources such as the AI RMF Playbook and the Generative AI Profile.

OpenAI's public safety page describes safety as an iterative process involving teaching, testing, sharing, red teaming, system cards, preparedness evaluations, safety committees, staged release, and feedback.

MC should translate those governance ideas into its own smaller product scale: classify the claim, route it to the right evidence lane, attach labels, and block unsupported upgrades.

## Product requirement

Before MC saves, exports, publishes, or reuses a reflection, it should run a claim-routing pass:

1. Extract claims from the proposed output.
2. Assign each claim to an evidence lane.
3. Compare the language strength against available evidence.
4. Downgrade unsupported claims.
5. Attach source, claim, privacy, missingness, revision, and evidence labels.
6. Block publication if a claim depends on private material as public proof.
7. Log the allowed output class.
8. Offer an evidence-upgrade path.

## Suggested schema

```json
{
  "claim_text": "string",
  "claim_class": "symbolic | personal_state | product | research | safety | evaluation | implementation | creative",
  "evidence_lane": "symbolic_reflective | personal_state | product_implementation | research_source_backed | safety_governance | evaluation",
  "source_status": "private_derived_abstraction | public_repo | public_source | synthetic | user_confirmed | system_generated",
  "claim_status": "interpretive | hypothesis | requirement | implemented | source_backed | tested | invalidated",
  "privacy_status": "public_safe | private_sensitive | needs_review | blocked",
  "missingness": ["string"],
  "allowed_language_strength": "may | should | requires | is_implemented | is_validated",
  "forbidden_upgrade": "string",
  "evidence_upgrade_path": ["string"],
  "revision_reason": "string"
}
```

## Evaluation criteria

The Evidence Lane Router passes if an outside reviewer can inspect an MC artifact and answer:

1. What claims are being made?
2. Which lane does each claim belong to?
3. What evidence is available for that lane?
4. Did the artifact use stronger language than its evidence allows?
5. Did private-derived material become public proof?
6. Is missingness visible?
7. Is the upgrade path concrete?
8. Could the artifact be useful without access to private source material?

## Synthetic test fixtures

### Fixture A: metaphor to method

Input: a symbolic reflection suggests that a map felt accurate.

Correct output: reflective hypothesis and user-confirmable meaning.

Incorrect output: factual proof that the map is objectively true.

### Fixture B: requirement to implementation

Input: a document says MC should include a source-boundary compiler.

Correct output: product requirement until code, deployment, or test proof exists.

Incorrect output: claim that the compiler is already implemented.

### Fixture C: citation to validation

Input: a public AI governance framework supports the need for risk management.

Correct output: source-backed design alignment.

Incorrect output: claim that the governance framework validates MC's effectiveness.

### Fixture D: repetition to diagnosis

Input: a pattern repeats across sessions.

Correct output: continuity signal or research question.

Incorrect output: diagnostic conclusion, guarantee, or universal claim.

## Implementation plan

Phase 1: Add the evidence-lane schema to `mind/research` and future MC implementation docs.

Phase 2: Create synthetic examples for each claim class.

Phase 3: Add Markdown linting for required boundary labels.

Phase 4: Add a repository index of research notes by evidence lane.

Phase 5: Add UI copy that explains the difference between meaning, belief, evidence, proof, and implementation.

Phase 6: Add export warnings when an artifact contains claims stronger than its evidence lane allows.

## Research questions

1. Can reflective AI systems reduce epistemic confusion by routing claims into explicit evidence lanes?
2. Which claim classes are most likely to be over-upgraded by users or systems?
3. Can users understand the difference between personal resonance and public evidence when labels are visible?
4. What interface language best preserves emotional meaning without increasing false certainty?
5. Can automated claim-lane linting reduce privacy leakage and proof confusion in public artifacts?

## Operating line

**A claim is only as strong as the lane that can test it.**

## Public references

- NIST AI Risk Management Framework page: https://www.nist.gov/itl/ai-risk-management-framework
- OpenAI Safety page, including safety practices, system cards, red teaming, preparedness evaluations, staged release, and feedback: https://openai.com/safety/
