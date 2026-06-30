# Evidence Map — Discovery/Fossil Records as Learning-Loop Governance

Date: 2026-06-30  
Run: Evidence Engine 08  
Claim ID: C-LEARNING-LOOP-01  
Status before: Proposed / conceptually useful, insufficient external grounding  
Status after: Supported as a governance-design rationale; MC implementation unvalidated

## Claim tested

Mirror Cartographer should keep first-class Discovery Objects and Fossil Records because structured records of surprise, failure, and superseded assumptions can improve governance memory and reduce repeated overclaim.

## Why this claim was weak

The current GitHub mind had Discovery and Fossil records, but the justification was mostly internal: they felt useful as architecture memory. That is not enough. Without external grounding, they could become decorative archive writing, conceptual bloat, or a way to make weak claims feel meaningful without improving review, correction, or decision quality.

## Evidence found

### Source 1 — NIST AI Risk Management Framework

Type: primary governance framework  
Source: NIST AI Risk Management Framework page, 2023 framework with later updates.  
URL: https://www.nist.gov/itl/ai-risk-management-framework

Relevant fact:

NIST describes the AI RMF as a framework for managing risks to individuals, organizations, and society, intended to improve incorporation of trustworthiness considerations into AI design, development, use, and evaluation. NIST also frames AI risk management as an implementation ecosystem with playbooks, profiles, and lifecycle-oriented resources.

Supports:

- AI governance requires structured risk-management processes, not just isolated claims.
- MC artifacts should be tied to design, development, use, evaluation, and risk management.

Does not prove:

- Discovery Objects or Fossil Records are the right format.
- MC users will consult them.
- They improve judgment or safety.

### Source 2 — NASA Systems Engineering Handbook

Type: primary systems-engineering handbook / government technical source  
Source: NASA/SP-2016-6105 Rev 2, NASA Systems Engineering Handbook.  
URL: https://ntrs.nasa.gov/citations/20170001761

Relevant fact:

NASA describes its handbook as a top-level implementation approach for systems engineering. The NTRS summary says its update drew from NASA policies, practitioner guidance, best practices, center handbooks, and external systems engineering sources, combining top-down policy compatibility with bottom-up field guidance.

Supports:

- Complex systems benefit from preserving practitioner-derived lessons and best practices across lifecycle processes.
- A GitHub mind should not only store final doctrine; it should preserve how operating guidance changed from evidence, practice, and failure.

Does not prove:

- MC's specific Discovery/Fossil templates are sufficient.
- NASA-style lessons learned transfer directly to symbolic-cognitive AI systems.

### Source 3 — Sillito and Kutomi, “Failures and Fixes: A Study of Software System Incident Response”

Type: peer-reviewed / academic software-engineering study available via arXiv  
Source: Jonathan Sillito and Esdras Kutomi, 2020.  
URL: https://arxiv.org/abs/2008.11192

Relevant fact:

The study qualitatively analyzed 30 software incidents: 15 from interviews with engineers and 15 from public incident reports, often produced through postmortem reviews. It found that incidents can reveal hidden system behavior, including cascading failures and scaling limits not understood until exceeded.

Supports:

- Failure records can expose system properties that routine success documentation misses.
- Postmortem-style records can be useful inputs for improving system engineering and support.

Does not prove:

- A postmortem record automatically changes future behavior.
- A small MC fossil ledger will prevent repeated conceptual errors.

### Source 4 — Gary Klein, “Performing a Project Premortem”

Type: high-quality practitioner decision-making source, Harvard Business Review  
Source: Gary Klein, 2007.  
URL: https://hbr.org/2007/09/performing-a-project-premortem

Relevant fact:

The premortem method asks a team to imagine that a project has failed and identify what could have caused the failure before execution. The value claim is not that failure imagination proves the future, but that it can surface threats that ordinary planning may suppress.

Supports:

- Explicit failure imagination can be a useful counterweight to optimism, groupthink, and overconfidence.
- MC Fossil Records should not only describe past failure; they can be used as future falsification prompts.

Does not prove:

- Premortem benefits apply to a single-user symbolic AI archive.
- MC records will be used at the right moment unless turned into gates.

## Fact / inference separation

### Facts supported by sources

1. NIST treats AI risk management as a structured lifecycle problem involving design, development, use, evaluation, and risk management.
2. NASA systems-engineering guidance incorporates policy, practitioner experience, best practices, and lifecycle process structure.
3. Software incident studies show that postmortem-style incident records can reveal hidden system behavior, cascading failures, and unknown limits.
4. Premortem practice is designed to surface possible failure causes before a project proceeds.

### MC-specific inferences

1. Discovery Objects may help preserve architecture-changing surprises.
2. Fossil Records may help prevent retired claims from re-entering the system without new evidence.
3. A learning-loop archive may reduce repeated overclaim only if it is connected to active review gates.
4. Discovery/Fossil artifacts should be evaluated by whether they change future decisions, not by whether they sound meaningful.

## Claim-status update

C-LEARNING-LOOP-01 is upgraded only to:

Supported governance-design rationale; implementation unvalidated.

It is not validated as an MC effectiveness mechanism.

Reason:

External sources support structured learning from risk, practice, incident review, and imagined failure. They do not prove that the current MC Discovery/Fossil records improve review quality, decision quality, safety, or hiring usefulness.

## New evaluation criterion

### LEARN-GATE-01 — Decision-use test for Discovery/Fossil records

A Discovery Object or Fossil Record passes only if a later artifact can show at least one of the following:

1. It prevented a retired claim from being reused without new evidence.
2. It changed a claim status: proposed, experimental, active, superseded, archived, or retired.
3. It added a new falsification condition.
4. It changed an evaluation criterion.
5. It prevented a confidence upgrade.
6. It caused an artifact to be pruned, merged, or rewritten.

If no later artifact cites or uses the record, it remains archival, not operational.

## Falsification checklist

Discovery/Fossil records fail as MC governance artifacts if:

- Ten later MC artifacts are created and none cite a Discovery or Fossil record.
- A retired claim reappears without triggering a fossil check.
- Reviewers cannot state what changed because of the record.
- The records preserve drama but not decision constraints.
- The archive grows faster than tests, downgrades, or pruning actions.

## Next proof needed

Run `LEARN-GATE-01` on the first five Discovery Objects and first five Fossil Records.

Minimum test:

- Select 10 later GitHub artifacts.
- Check whether any Discovery/Fossil record changed a claim, gate, test, confidence level, or pruning decision.
- Require at least 3 concrete downstream uses before calling the learning loop operational.
- If fewer than 3 uses are found, keep Discovery/Fossil as archive-only and add an explicit review hook before future claim upgrades.

## Bottom line

The evidence supports the need for structured learning loops in complex AI-governance work. It does not yet support the stronger claim that MC's Discovery Objects and Fossil Records improve outcomes. The next step is not more archive writing; it is downstream-use testing.
