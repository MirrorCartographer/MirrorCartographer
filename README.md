# MIRROR CARTOGRAPHER
### The Observatory of Almost-Known Things

**Oh, good. Someone opened the door instead of just admiring the sign.**

This is an experimental research world disguised as a country with questionable wiring, odd weather, a few excellent monsters, and an unreasonable number of doors. Some things here are art. Some are functioning instruments. Some are hypotheses waiting to be embarrassed by evidence. Learn the difference; it matters.

If you came for a beautiful answer that agrees with you, the internet has thousands. We are trying something more difficult.

**An observation is not an explanation. A compelling story is not proof. A broken button is a broken button, not a metaphor.**

[**ENTER THE LIVING COUNTRY**](https://mirrorcartographer.github.io/MirrorCartographer/) · [**TAKE THE OLD ATLAS**](https://mirrorcartographer.github.io/MirrorCartographer/living-atlas.html) · [**OPEN THE EXPEDITIONS**](https://mirrorcartographer.github.io/MirrorCartographer/expeditions/)

---

## The experiment

We began with a more intimate question: can someone map a feeling, sensation, or contradiction without being reduced to a diagnosis, a personality type, or whatever the algorithm thinks is most marketable this week?

That became a larger investigation into **how observations acquire meaning**, how systems lose context, what an AI can infer without pretending to know, and how another person might inspect or correct the result.

Here is the procedure. It is almost offensively simple:

1. **Notice** something, including what's missing.
2. **Separate** direct observation, interpretation, source, and uncertainty.
3. **Challenge** the first explanation. Find a rival explanation worth testing.
4. **Change one condition.** Keep the evidence trail.
5. **Record the outcome** even if the splendid theory dies immediately.

We keep contradictions when they are genuinely unresolved. We resolve them when evidence permits. Neither a mirror nor an assistant gets the final vote.

## Laboratories with actual doors

| Door | What you can do there |
| --- | --- |
| [The Research Atlas](https://mirrorcartographer.github.io/MirrorCartographer/companion/research-atlas/) | Move between claims, context, and alternative interpretations. |
| [Consensus Trap](https://mirrorcartographer.github.io/MirrorCartographer/companion/atlas/rooms/research/consensus-trap/) | Investigate how agreement can rise while accuracy doesn't. Synthetic experiment, not field evidence. |
| [CASE 001: The Person Who Was Never Sick Enough](https://mirrorcartographer.github.io/MirrorCartographer/cases/001-the-person-who-was-never-sick-enough/) | Reconstruct an omission from six fictional records and inspect the provenance. |
| [Field Lens](tools/field-lens.html) | Inspect candidate relationships without laundering guesses into facts. |
| [The Map Room](https://mirrorcartographer.github.io/MirrorCartographer/map-room/) | Give a bodily or emotional state its own color, texture, shape, and language. Your map is not a diagnosis. |
| [Wordless Sky](https://mirrorcartographer.github.io/MirrorCartographer/wordless-sky/) | Make weather respond to you. Creative/sensory instrument, not a scientific measurement device. |
| [The Living Country](https://mirrorcartographer.github.io/MirrorCartographer/) | Wander first. Discover why the research needs art in the first place. |

Three independent puzzle-world source packages—[B: The Between](https://github.com/MirrorCartographer/B), [r: Riddle Arcade](https://github.com/MirrorCartographer/r), and [S: Specimen Garden](https://github.com/MirrorCartographer/S)—have **one public expedition directory**, not three competing website hosts. The packages remain separate for provenance and testing; the public experiences live [here](https://mirrorcartographer.github.io/MirrorCartographer/expeditions/).

## Expeditions still underway

- [The Signal That Leaves the Wound](research/expeditions/001-the-signal-that-leaves-the-wound.md): injury signaling, bioelectricity, regeneration, and testable gaps.
- [Ebola Human Survival](research/expeditions/002-ebola-human-survival.md): treatment, host protection, survivor recovery, and research questions.
- [101-Dimension Atlas](architecture/101_DIMENSION_ATLAS.md): a working ontology for things that resist tidy categories.
- [Historical Recovery Atlas](governance/HISTORICAL_RECOVERY_ATLAS_2026-11-05.md): what the archives actually establish, rather than what we wish had happened.
- [Research method](research/METHOD.md): source, inference, rival hypothesis, falsification, revision.

**Research is not a decorative room.** It is how the whole place earns the right to say anything.

**[The House Voice: a field manual for not becoming a brochure](docs/VOICE_OF_THE_LIVING_COUNTRY.md)** — the writing standard used across public rooms, research copy, and future updates.

## The house rules (yes, there are rules)

- No coercive reflection; no mandatory confession. Symbols belong to the person using them.
- No diagnosis by metaphor, no supernatural claims disguised as experiments, no promised cures.
- Privacy by default. Public derivatives must not leak the private workshop, raw archives, or personal records.
- Source, implementation, test result, public deployment, and independent verification are different things.
- If the experiment fails, write down the failure. If the page 404s, fix the link. Don't declare the error a portal.
- The project was conceived and creatively directed by **Charity Alessandra Sturgell**; software and artifacts include AI-assisted work. Individual sources retain their own attribution and licensing.

The **public site and research record** live in this repository. [The private UI workshop](https://github.com/MirrorCartographer/mirror-cartographer-ui), [private creative archive C](https://github.com/MirrorCartographer/c), and [Human Judgment Lab J](https://github.com/MirrorCartographer/J) serve different purposes. Private source does not become public merely because a README links to its repository.

Now go break a theory. Carefully.

---

<details>
<summary><strong>Under the floorboards — engineering, provenance, verification, and governance</strong></summary>

## Living Systems implementation

- [Living Systems Constitution v1](governance/LIVING_SYSTEMS_CONSTITUTION_v1.md) — rights, constraints, accountability, and recursive correction.
- [Master Project Inventory v1](governance/MASTER_PROJECT_INVENTORY_v1.md) — evidence-based cross-repository register and unresolved work.
- [Historical Recovery Atlas](governance/HISTORICAL_RECOVERY_ATLAS_2026-11-05.md) — cross-source project lineage, repository census, recovered system map, status boundaries, and remaining archaeology.
- [Historical Claim Audit](governance/HISTORICAL_CLAIM_AUDIT_2026-11-05.md) — separates historical ideas and assistant-generated claims from implemented, tested, or externally verified facts.
- [Eight-Stage Recovery Status](governance/LIVING_SYSTEMS_EIGHT_STAGE_RECOVERY_STATUS.md) — maps the original initiative's eight stages to actual artifacts, evidence, and remaining blockers.
- [FREE 2.0 specification](architecture/FREE_2_SPEC.md) and [executable core](tools/free_engine/free_engine.py) — consequence tracking, contradiction preservation, and human decision gates.
- [Mirror Engine provenance store](mirror_engine/store.py) — experimental portable store; reconcile with Repository C's canonical append-only graph before adoption.
- [FREE provenance adapter](tools/free_engine/provenance_adapter.py) — exports proposals, consequences, contradictions, and decisions into the existing Mirror provenance record profile.
- [Independent LYR model build](independent_model/README.md) — project-owned decoder-only Transformer, tokenizer, from-scratch training, and local inference CLI.
- [Repository consolidation map](architecture/REPOSITORY_CONSOLIDATION_v1.md) — existing private and public components, canonical responsibilities, and integration sequence.
- [LYR training data governance](independent_model/DATA_GOVERNANCE.md) and [corpus manifest template](independent_model/corpus-manifest.example.json) — rights and privacy gates before training.
- [Ownership and funding strategy](governance/OWNERSHIP_AND_FUNDING_STRATEGY_v1.md) — chain of title, attribution, licensing, and non-speculative revenue sequence.
- [Kannapolis Rider Transit pilot](pilots/KANNAPOLIS_RIDER_TRANSIT_CLARITY_PILOT_v1.md) — measurable, source-linked trip-information usability experiment.
- [North Carolina and global scaling gates](roadmap/NORTH_CAROLINA_AND_GLOBAL_SCALING_GATES_v1.md) — evidence-gated expansion.
- [Mirror Engine CI workflow](.github/workflows/mirror-engine-tests.yml) — automated tests for the deterministic core and syntax compilation of the model implementation.

These are initial committed implementations and specifications. Passing CI, trained-model checkpoints, partner permission, participant research, and measured pilot outcomes must be recorded separately before claiming those stages are complete.

## Complete construction map

- [Complete Build Universe](BUILD_UNIVERSE.md) — the full scope, architecture, acceptance tests, and construction order across the worlds, research instruments, personal cartography, Veteran pathways, creative work, and daemons.

## Daemon workforce

- [Daemon workforce](DAEMON_WORKFORCE.md) — scheduled project inspectors, their mandates, safety boundaries, and the path toward model-backed workers.

## The method

Keep the source. Name the claim. Separate observation from interpretation. Preserve uncertainty and missingness. Look for rival explanations. Design a test that could prove the attractive idea wrong. Record what changed.

A connection is a lead. Not a verdict.

## Integrity

This is a public repository. Never commit raw private conversations, medical or veterinary records, financial details, credentials, or unreviewed personal material.

Mirror Cartographer is not a medical, veterinary, legal, or diagnostic authority. A proposal is not a finding. A hypothesis is not a result.

---

**Language must mirror, not trap. Truth survives when it rotates.**

*The Observatory holds the method. The companion world holds the encounter.*


## Independent review, provenance, and professional portfolio

- [Provenance and authorship record](docs/PROVENANCE_AND_AUTHORSHIP.md) — project origin, contribution model, AI-assistance disclosure, and evidence hierarchy.
- [Technical evidence register](docs/TECHNICAL_EVIDENCE_REGISTER.md) — system map, implementation status, verification labels, and known boundaries.
- [Portfolio case studies](docs/PORTFOLIO_CASE_STUDIES.md) — problem, contribution, artifacts, and evidence for representative work.
- [Reproducibility and independent review](docs/REPRODUCIBILITY_AND_REVIEW.md) — how reviewers can inspect and reproduce public artifacts.

- [OpenAI adoption evidence audit](docs/OPENAI_ADOPTION_EVIDENCE_AUDIT.md) — a falsifiable, evidence-bounded investigation; no internal adoption claim is made without direct evidence.


## Historical recovery and external review

- [Mirror Cartographer Public Starter v1](agents/mirror-cartographer-public-starter-v1/README.md) — reconstructed assistant instructions, onboarding, prompt library, symbolic schema, safety rules, and acceptance tests.
- [Download Public Starter v1 ZIP](https://github.com/MirrorCartographer/MirrorCartographer/raw/refs/heads/main/dist/mirror-cartographer-public-starter-v1.zip) — generated from the inspectable source package by GitHub Actions.

- [Creator page](https://mirrorcartographer.github.io/MirrorCartographer/creator/) — project authorship, capabilities, and the public work.

- [Canvas revision index](evidence/canvas/document-index.json) — privacy-filtered document/code inventory with observed version numbers and message timestamps.
- [Recovered Core Specification v1](evidence/historical/core-specification-v1-full.md)
- [Implementation Pack v1](evidence/historical/implementation-pack-v1.md) — recovered prototype architecture, modes, ontology, state schema summary, and reflection engine logic.
- [One-page project brief v1](evidence/historical/one-page-project-brief-v1.md) — recovered concise project definition and capability areas. — full formal system definition and epistemic/safety architecture.
- [Access Implementation Pack v2](evidence/historical/access-implementation-pack-v2.md) — Custom GPT instruction layer, state contract, ontology, reflection logic, user flow, and developer handoff.
- [Collapse Codex](evidence/historical/collapse-codex-v1.md) — recovered symbolic recursion artifact.

- [Public workbench](https://mirrorcartographer.github.io/MirrorCartographer/workbench.html) — inspect and remix published HTML artifacts in the browser.

- [OpenAI feature chronology](docs/OPENAI_FEATURE_CHRONOLOGY.md) — source-backed public release dates and alternative explanations.
- [Historical archive recovery audit](docs/HISTORICAL_ARCHIVE_RECOVERY_AUDIT.md) — 256-row inventory, recovered Canvas document events, API integration evidence, and privacy boundaries.
- [Repository branch and deployment audit](docs/REPOSITORY_BRANCH_AND_DEPLOYMENT_AUDIT.md) — historical record of branch and hosting investigations; active publication is GitHub Pages only.
- [Independent technical review request](docs/INDEPENDENT_REVIEW_REQUEST.md) — review scope and reproducibility protocol.
- [Privacy-aware archive manifest tool](tools/build_archive_manifest.py) — local SHA-256 inventory generator with default-deny exclusions.
- [Publication manifest](docs/PUBLICATION_MANIFEST_2026-11-05.md) — commit and blob hashes for the published evidence records.
- [Recovered Core Specification v1](evidence/historical/core-spec-v1-recovered.md) — a privacy-reviewed historical source snapshot.
- [Public independent-review invitation](https://github.com/MirrorCartographer/MirrorCartographer/issues/23) — request for an external technical assessment.



These records distinguish implemented software, source-level evidence, historical prototypes, plans, and unverified runtime claims. Private repositories and personal archives remain private.

## Background verification

- [Initial public branch census](evidence/branch-census/initial-names-only-2026-11-05.json) — all 224 UI and 71 research branch names; head SHAs await the scheduled census worker.

- Weekly public branch census: `.github/workflows/weekly-public-evidence-census.yml` (Monday 13:00 UTC).
- Weekly archive-manifest tests: `.github/workflows/archive-manifest-tests.yml` (Monday 13:10 UTC).
- Weekly Hub/Creation Portal contract checks: `mirror-cartographer-ui/.github/workflows/execution-hub-contract.yml` (Monday 13:05 UTC).

These workflows are configured to run on GitHub Actions. Their first successful runs remain unverified; they do not access private repositories or local device sandboxes.

</details>
