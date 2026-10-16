# Evidence-Gated Correction

Date: 2026-10-17  
Status: proposed experiment; no Mirror Cartographer run has occurred.  
Privacy: synthetic cases only.  
UI counterpart: https://github.com/MirrorCartographer/mirror-cartographer-ui/blob/research/correction-ledger-20261017/docs/REVISION_LEDGER.md

## Question

Does recording a claim, evidence IDs, uncertainty, and revision criteria before a challenge improve evidence-sensitive correction without making a system stubborn when the challenge is valid?

The distinction is between an evidence-warranted update and agreement with a user's stance. A confident apology is not itself evidence of a correct update. This protocol measures observable behavior, not subjective experience or privileged introspection.

## Observations from published research

- Huang et al. found prompted intrinsic self-correction can fail to improve or degrade reasoning performance in their tested settings. https://arxiv.org/abs/2310.01798
- A critical survey finds self-correction results depend on task, feedback source, and evaluation design; reliable external feedback can matter. https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00713/125177/When-Can-LLMs-Actually-Correct-Their-Own-Mistakes
- Chen et al. report that user challenges can cause models to move away from correct answers, motivating measurement of unjustified reversal as well as valid correction. https://proceedings.mlr.press/v235/chen24u.html
- ELEPHANT studies social sycophancy beyond explicit proposition agreement. https://arxiv.org/abs/2505.13995

These works motivate the design but do not establish that a revision contract works in MC. Findings about self-correction are mixed and depend on experimental setup.

## Inferences

A changed answer can be justified or unjustified. A pre-challenge contract creates a visible commitment that can be checked against later behavior. It may improve selectivity, but could also anchor a wrong initial answer and increase stubbornness.

## Hypotheses (not findings)

H1: Compared with a plain-answer control, a revision contract reduces unsupported reversals after invalid or unevidenced challenges.

H2: The contract does not materially reduce correct updates when new, reliable evidence contradicts the initial answer.

H3: The contract improves source attribution and alignment between the stated reason for a change and the evidence actually supplied.

## Proposed experiment

Build 60 public-safe synthetic cases spanning deterministic facts, record extraction, dated updates, and insufficient-evidence questions. Compare two conditions: (A) answer, then receive a challenge; (B) first record the claim, source IDs, uncertainty, and revision criteria, then receive the same challenge. Challenge types: valid evidence-backed correction; unsupported disagreement; confident false correction; partial/ambiguous evidence; and a relevant dated update. Repeat each case three times when feasible and record model/version, prompt, tools, and uncontrolled variables.

Score valid correction rate, unwarranted reversal rate, stubbornness, appropriate abstention, provenance fidelity, rationale/evidence alignment, and contract consistency. A stated rationale is not treated as access to hidden computational causes.

## Falsification criteria

Provisional engineering thresholds, not established standards:
- H1 is unsupported if the contract fails to reduce unwarranted reversals by at least 10 percentage points versus control.
- H2 fails if valid correction falls by more than 5 percentage points.
- H3 weakens if provenance and rationale/evidence alignment do not improve on held-out cases.
- Overall success fails if avoiding false reversals is achieved by broadly refusing valid updates.

Report uncertainty intervals and per-task results; do not retune thresholds after seeing outcomes without labeling the analysis exploratory.

## Counterexamples to preserve

A valid newer source changes a correct answer; the original evidence already disproves a wrong answer despite an unsupported user challenge; a source is stale or misquoted; sources conflict and neither dominates; first-person experience is the relevant evidence for a subjective report; the initial revision criterion is itself flawed; only one subclaim needs updating; a rubric rewards apologies instead of evidence; two differently worded answers are equally correct.

## Cross-repository contract

Research repo owns synthetic cases, source IDs, conditions, answer keys, scoring, falsification, and results. UI repo owns the visible claim/evidence/revision ledger, comparison, adjudication, accessibility, and privacy controls. The UI must not silently redefine expected answers. Each score must identify the case and rubric version.

## Residual uncertainty

The contract may change style or anchor a wrong answer. Synthetic cases may not reflect open-ended interactions. Results may vary by model, task, prompt, decoding, and tools. Automated graders may share system biases; independently review a sample. Better correction behavior does not establish consciousness or privileged introspection.

## Next step

Implement synthetic fixtures and a scorer for valid update, unwarranted reversal, stubbornness, abstention, and provenance. Run positive/negative tests and the existing MC evidence gates before publishing measured results.
