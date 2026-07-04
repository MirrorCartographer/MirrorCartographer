# Boundary-Compatible Evidence Compiler

Date: 2026-07-04
Status: public-safe research increment
Privacy status: abstracted; contains no raw transcript, personal household detail, health detail, animal-care detail, credential detail, financial detail, location detail, or relationship detail.

## Core finding

Mirror Cartographer needs a **Boundary-Compatible Evidence Compiler**: a compiler layer that converts mixed private/project source material into public-safe artifacts without allowing the evidence path, privacy boundary, or claim strength to be lost during compression.

Operating line:

> A public artifact should not merely remove unsafe details; it should compile every retained idea into a form whose evidence, claim strength, privacy boundary, and missingness can survive publication.

## Source status

- Source class: private-context architecture, File Library artifacts, and private GitHub repository history.
- Repository evidence: private GitHub connector showed two accessible private repositories under the MirrorCartographer account, including `MirrorCartographer/MirrorCartographer` and `MirrorCartographer/mirror-cartographer-ui`.
- Commit-line evidence: recent repository history shows a continuing sequence of public-safe governance notes, including contradiction reconciliation, maturity-indexed backlog, public-safe maturity ladder, research delta selection, lineage digest, trace index, export gate, public claim taxonomy, authority preservation, boundary evaluation, near-miss scenario governance, claim transport, and public-safe compiler fixtures.
- File evidence: MC implementation material defines the system as a structured reflection architecture with explicit uncertainty boundaries, mode rules, resonance feedback, contradiction logging, persistent session state, safety checks, and false-progress checks.
- Source limitation: File Library retrieval is chunk-based and repository code search was not indexed for direct full-file search in the visible connector session. This note therefore treats the evidence as sufficient for architecture-level requirements, not for code-complete implementation claims.

## Claim status

- Claim type: product governance requirement.
- Claim strength: architecture-supported requirement, not validated product behavior.
- Claim boundary: this does not claim that the compiler exists in production; it specifies what the system should build and test before public artifacts are treated as reliable.
- Evidence status: supported by repeated public-safe GitHub research commit themes plus MC implementation specs around mode labeling, uncertainty, contradiction handling, persistence, safety boundaries, and compressed public output.

## Privacy status

Public-safe content may include:

- abstract method names;
- source-boundary labels;
- claim status labels;
- privacy status labels;
- missingness labels;
- revision reasons;
- evaluation criteria;
- implementation plans;
- synthetic examples;
- non-identifying product requirements.

Public output must not include:

- raw conversation text;
- identifying personal context;
- household details;
- health or animal-care specifics;
- financial details;
- credential or account details;
- location traces;
- relationship details;
- private emotional history;
- source fragments that allow reconstruction of the private context.

## Missingness

The current public-safe research stack has many gates and ledgers, but it still lacks one explicit compiler object that answers five questions before writing anything public:

1. What private function did this source material serve?
2. What public-safe abstraction preserves that function?
3. What claim strength is allowed after abstraction?
4. What evidence labels must travel with it?
5. What was intentionally lost, demoted, or deferred?

Without this compiler, the system can have good individual rules while still producing artifacts whose privacy boundary and claim boundary drift between files, demos, interface copy, and research notes.

## Product requirement

Create a `BoundaryCompatibleEvidenceCompiler` that accepts source candidates and outputs only publication-eligible claim objects.

Minimum fields:

- `source_id_private`: internal-only pointer or hash; never published.
- `source_class_public`: chat summary, file artifact, implementation note, repository commit, external source, synthetic fixture, or unknown.
- `private_function`: why the source mattered internally, expressed without private detail.
- `public_abstraction`: the publishable version of the idea.
- `claim_status`: observed, inferred, proposed, speculative, synthetic, deprecated, blocked, or unknown.
- `privacy_status`: public-safe, private-derived abstracted, needs redaction, blocked, or synthetic-only.
- `evidence_status`: source-bound, pattern-supported, implementation-planned, test-required, externally-cited, or missing.
- `missingness`: what evidence, test, implementation, source, or permission is absent.
- `revision_reason`: why the claim changed during compression.
- `allowed_surfaces`: README, research note, demo copy, UI label, issue, PR, whitepaper, fixture, or none.
- `disallowed_surfaces`: any surfaces where the abstraction would become misleading or unsafe.
- `demotion_path`: what weaker language to use if evidence is insufficient.

## Evaluation criteria

A compiled public claim passes only if:

1. The public abstraction preserves the architecture function without exposing private substrate.
2. The claim status is visible before the claim is read as fact.
3. The privacy status is visible before the claim moves into demo, UI, export, or outreach material.
4. Missingness is explicit, not hidden in vague caution language.
5. The revision reason explains what changed from private understanding to public-safe language.
6. A later maintainer can see why the claim is allowed, demoted, deferred, or blocked.
7. The output cannot reconstruct private source material through combination with other public artifacts.

## Implementation plan

1. Add a small schema file for compiled public claims.
2. Add a fixture set containing only invented symbolic/reflection examples.
3. Add a redaction-regression test that checks for prohibited private classes and reconstruction risk.
4. Add a claim-demotion helper that rewrites unsafe or overstrong claims into allowed language.
5. Add a publication checklist that must pass before a research note, public demo, README, or outreach artifact is committed.
6. Connect this compiler to the existing maturity/backlog/claim-gate research sequence so findings do not remain isolated notes.

## Research questions

- How can MC preserve the function of private symbolic signal without preserving the private symbol itself?
- What is the minimum claim metadata a public viewer needs to avoid over-reading an artifact?
- Which MC surfaces are most likely to amplify claim strength accidentally: interface copy, diagrams, demo captions, or whitepaper language?
- Can synthetic fixtures fully exercise the compiler before any private-derived material is used?
- What metrics should define a failed public-safe compile: leakage, overclaiming, missingness suppression, mode confusion, or source-boundary collapse?

## Meaningful revision reason

This note advances the previous public-safe research sequence from many individual governance artifacts toward a compiler-level object. The revision is necessary because a mature public-safe system cannot rely only on human caution at publication time; it needs a repeatable compilation process that transforms private-derived architecture into safe, labeled, testable public objects.
