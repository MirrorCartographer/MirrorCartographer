# Source Boundary Compiler

Date: 2026-07-01

## Boundary labels

Source status: derived from public repository README, public-safe File Library architecture snippets, and previously established MC research notes. Private-context material was used only to infer abstract architecture. No raw transcript, personal, household, health, animal-care, financial, location, relationship, credential, or identifying operational details are included.

Claim status: architectural hypothesis, product requirement draft, and evaluation proposal. Not empirical validation, clinical guidance, legal guidance, or proof of user benefit.

Privacy status: public-safe abstraction. Contains only method-level language, source-boundary rules, evaluation criteria, and implementation planning.

Missingness: needs repository-wide file inventory, implementation audit against the live demo, synthetic test cases, UI copy review, privacy review, and user comprehension testing.

Revision reason: previous notes defined boundary metadata, meaning integrity, proof transfer, provenance gates, and continuity containers. This note adds a compiler layer that converts mixed-source material into safe, typed, publishable outputs.

## Public-safe finding

Mirror Cartographer needs a **Source Boundary Compiler**: a transformation layer that takes mixed input material and emits only the safest allowed artifact type for that source and claim class.

The compiler should not ask only: "Is this true?"

It should ask:

1. What source class produced this material?
2. What claim class is being made?
3. What privacy class applies?
4. What output class is allowed?
5. What labels must survive into the published artifact?
6. What details must be abstracted, quarantined, cited publicly, or discarded?

## Why this is needed

MC has a recurring architectural tension: it learns from symbolic, emotional, conversational, product, and research material, but public artifacts must not expose private origin stories or let symbolic resonance impersonate proof.

A Source Boundary Compiler makes that tension operational.

It converts raw material into permitted public forms:

| Input source class | Allowed public output |
|---|---|
| Private conversation | Abstracted method, requirement, research question, safety rule, or evaluation criterion |
| Private file containing sensitive context | Privacy-safe index, boundary note, schema, or implementation plan |
| Public repository file | Source-bound summary, product requirement, issue, roadmap item, or evaluation check |
| Public research source | Cited claim, benchmark target, risk taxonomy, or design constraint |
| System-generated idea | Hypothesis, draft requirement, synthetic test, or open question |
| User-confirmed public language | Public copy, README language, application framing, or documentation |

## Compiler rule

**Private material may shape architecture. It must not become public evidence.**

If a finding depends on private material, the compiler must downgrade the public output to one of these forms:

- method
- design requirement
- research question
- evaluation criterion
- privacy-safe index
- synthetic example
- implementation plan
- boundary note

It must not emit:

- raw narrative
- identifying detail
- personal case evidence
- household detail
- health or animal-care detail
- financial detail
- credential detail
- location detail
- relationship detail
- transcript-derived quotation

## Minimum output labels

Every compiler output should include:

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `allowed_output_class`
- `forbidden_source_leakage`
- `evidence_upgrade_path`

## Evaluation criteria

A Source Boundary Compiler passes if an outside reviewer can inspect a public artifact and answer:

1. What source class informed this artifact?
2. What claim class is being made?
3. Was any private content exposed?
4. Did private context become public evidence? If yes, fail.
5. Is missingness visible?
6. Is there a clear revision reason?
7. Is the output usable without private source access?
8. Is there a path for stronger evidence that does not require exposing private material?

## Product requirement

MC should add a pre-publication step that classifies any outgoing artifact before export or commit:

1. Detect source class.
2. Detect claim class.
3. Detect privacy risk.
4. Choose permitted output class.
5. Attach required boundary labels.
6. Remove or abstract forbidden detail.
7. Add missingness and evidence-upgrade path.
8. Block publication if the output still depends on private facts.

## Implementation plan

Phase 1: Add compiler schema as Markdown and JSON examples.

Phase 2: Add synthetic examples showing transformations from private-derived insight to public-safe method.

Phase 3: Add a checklist to all `mind/research` notes.

Phase 4: Build a lightweight repository index of public-safe research notes by output class.

Phase 5: Add automated linting for missing boundary labels before public commits.

## Research questions

1. Can a source-boundary compiler reduce accidental privacy leakage in reflective AI systems?
2. Can users understand the difference between private-derived method and source-backed public evidence?
3. What output classes are safe enough for public repositories?
4. Which details are most likely to leak private context even after name removal?
5. Can synthetic examples preserve evaluation value without exposing lived-source material?

## Operating line

**MC can learn from the private room. It must publish only the architecture that can survive outside the room.**
