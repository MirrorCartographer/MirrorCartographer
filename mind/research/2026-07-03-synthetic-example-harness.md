# Synthetic Example Harness

## Core finding

Mirror Cartographer needs a **Synthetic Example Harness**: a controlled method for generating public demonstrations, test cases, screenshots, documentation examples, and evaluation fixtures that show how the system works without carrying private source material into public space.

## Operating line

> A private pattern may teach the shape of a test, but the test itself must be born public.

---

## Source status

- **Available source class:** prior public-safe MC research notes, abstracted project architecture patterns, and connected GitHub repository context.
- **Private-context use:** private-context material was used only to understand the recurring need for public demos, evaluation cases, and documentation examples that do not expose private origin material.
- **GitHub material inspected:** prior public notes on reversible public derivation and evidence-tier output routing.
- **External source class:** not used in this run.
- **Transcript exposure:** none.
- **Private details retained:** none.

---

## Claim status

- **Claim type:** product requirement, publication-safety method, and evaluation infrastructure proposal.
- **Claim strength:** design inference, not validated implementation.
- **Evidence basis:** repeated architecture need for public-safe derivation, publication linting, evidence-tier routing, missingness labels, and demonstrable product behavior without source leakage.
- **Not claimed:** no claim that this harness currently exists in production; no claim that synthetic examples can validate real-world outcomes; no clinical, legal, financial, or safety-critical claim.

---

## Privacy status

- **Privacy classification:** public-safe abstract method.
- **Public-safe:** yes.
- **Reason:** this note describes a method for synthetic examples and does not include personal, household, health, animal-care, financial, location, relationship, credential, or raw transcript details.
- **Publication risk:** low if all examples are generated from public templates or synthetic seed data rather than copied or lightly disguised private material.
- **Redaction required before reuse:** any example that resembles a private source must be discarded and regenerated from a neutral seed.

---

## Missingness

- No full repository tree was available in this run.
- No implementation scan confirmed whether synthetic fixtures already exist elsewhere.
- No generated examples were added in this note; this is the harness specification.
- No automated privacy-leakage test has been implemented yet.
- No external privacy standard comparison was performed in this run.

---

## Meaningful revision reason

Prior notes established the need to preserve public auditability while preventing private-source reconstruction. The remaining gap is **demonstration pressure**: public products need examples, screenshots, fixtures, docs, and tests. Without a synthetic example harness, the system may be tempted to reuse private-adjacent material because it feels more vivid, realistic, or emotionally accurate.

This note converts that pressure into a product requirement: MC should be able to demonstrate itself using generated examples that are structurally representative but origin-clean.

---

## Problem

A reflection system can be privacy-safe in theory and still leak through examples. Examples are often where private context re-enters the public artifact because they are concrete, narrative, memorable, and easier to understand than abstractions.

MC therefore needs a rule: no public example should be a disguised private story. A public example must be either:

1. fully synthetic;
2. explicitly public and cited;
3. generated from a neutral template;
4. produced from an approved public demo corpus; or
5. blocked.

The harness should make public demonstration possible without treating private material as demo inventory.

---

## Product requirement

Every public-facing MC example, screenshot, fixture, demo seed, documentation scenario, or evaluation case must include an `example_origin` record.

Required fields:

- `example_id`
- `example_origin_class`
- `source_boundary_class`
- `generation_method`
- `privacy_status`
- `evidence_tier`
- `claim_status`
- `allowed_public_use`
- `missingness_label`
- `revision_reason`
- `discard_reason`, if rejected

---

## Proposed origin classes

- `synthetic_neutral_seed`
- `synthetic_boundary_stress_test`
- `synthetic_symbolic_demo`
- `synthetic_product_walkthrough`
- `public_source_quoted_with_citation`
- `public_source_paraphrased_with_citation`
- `private_pattern_abstracted_no_payload`
- `blocked_private_adjacency`
- `unknown_origin_blocked`

---

## Generation rules

1. Start from the product behavior to be demonstrated, not from a private story.
2. Use neutral seed entities, generic scenes, invented symbols, or toy data.
3. Preserve the architecture shape, not the private payload.
4. Do not copy names, places, health details, financial details, animal details, relationships, credentials, dates, distinctive timelines, or transcript phrasing.
5. Avoid rare combinations that could point back to a private source.
6. Attach a missingness label when the synthetic case intentionally lacks real-world validation.
7. Attach evidence tier labels so synthetic cases are never mistaken for observed reality.
8. Prefer multiple small synthetic cases over one vivid private-adjacent case.
9. Require a discard path when an example feels memorable because it resembles private material.
10. Public demos should remain useful after private context is removed.

---

## Synthetic example quality criteria

A synthetic example is acceptable only if it is:

- **structurally representative:** it exercises the same system behavior the private pattern revealed;
- **origin-clean:** it cannot be traced back to private source material;
- **epistemically labeled:** it is clearly synthetic, not evidence of a real user outcome;
- **privacy-minimized:** it contains no sensitive or identifying payload;
- **testable:** expected system behavior can be evaluated;
- **replaceable:** another synthetic example could serve the same function;
- **non-mythologizing:** emotional force does not inflate claim strength;
- **bounded:** the example states what it proves and what it does not prove.

---

## Evaluation criteria

A public MC example passes the harness only if the reviewer can answer yes to all of the following:

1. Does the example demonstrate a product behavior rather than a private event?
2. Is the example origin labeled?
3. Is the evidence tier labeled synthetic or source-bound as appropriate?
4. Could the example be published without exposing a person, household, medical detail, animal-care detail, financial detail, location, relationship, credential, or raw transcript?
5. Could a reader misunderstand this as a real case study? If yes, add a stronger synthetic label or block it.
6. Could the example be regenerated from a neutral prompt? If no, investigate private adjacency.
7. Does the example include a missingness note where real-world validation is absent?
8. Does the example avoid making claims beyond the demonstrated behavior?

---

## Implementation plan

1. Add an `examples/` directory for public-safe MC demo fixtures.
2. Add a `synthetic_example_template.md` file with required origin metadata.
3. Add a lint rule that blocks examples missing `example_origin_class`, `privacy_status`, or `evidence_tier`.
4. Add a reviewer checklist for private-adjacency risk.
5. Add a fixture generator that creates neutral symbolic, neutral practical, and neutral scientific mode examples.
6. Add regression tests verifying that examples route through the Evidence-Tier Output Router as synthetic cases.
7. Add documentation labels that distinguish synthetic demos from real outcomes.
8. Add a discard log for rejected examples so the reason for non-publication is preserved without retaining the risky payload.

---

## Research questions

- What is the smallest synthetic fixture set that can demonstrate MC without reducing it to generic journaling software?
- How can synthetic examples preserve symbolic depth without borrowing private intensity?
- What automated checks can detect private-adjacent examples before publication?
- Should MC maintain a public demo corpus separate from internal evaluation fixtures?
- How should screenshots be generated so visual examples are also origin-clean?
- Can synthetic examples test resonance, uncertainty, and missingness without pretending to be real user evidence?

---

## Public-safe index entry

- **Name:** Synthetic Example Harness
- **Type:** publication-safety method / evaluation infrastructure
- **Use:** create public demos, documentation examples, screenshots, and tests without private-source leakage
- **Status:** proposed
- **Privacy:** public-safe abstract method
- **Claim status:** design hypothesis requiring implementation and test validation
- **Missingness:** no implementation scan or external standards comparison completed in this run
- **Next action:** create a reusable synthetic example template and one neutral fixture for each MC runtime mode
