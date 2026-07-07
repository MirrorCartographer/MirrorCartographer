# Null Evidence Capture Gate

## Purpose

The Null Evidence Capture Gate prevents scientific, biomedical, veterinary, mechanistic-biology, longitudinal-health, or privacy-memory claims from being promoted into reusable discovery memory when the system only records positive evidence.

Frontier discovery systems can become biased if they retrieve, generate, and evaluate mostly successful or publishable results. This gate forces the artifact to preserve null results, failed reproduction attempts, insufficient-data findings, missing materials, and negative controls as first-class evidence.

## Frontier source map

| Source | Source status | Claim status | Design implication extracted |
| --- | --- | --- | --- |
| Chauhan, `Dead Science Walking: Publication Bias and the AI Scientist Pipeline`, arXiv 2026-06-02 | Preprint; not peer reviewed | AI-scientist pipelines may amplify publication bias and null-result gaps | Require explicit null/negative evidence inventory before hypothesis promotion. |
| Ho et al., `SoundnessBench`, arXiv 2026-05-28 | Preprint; benchmark proposal | Frontier LLMs show optimism bias when rating low-soundness research proposals | Add a pessimistic soundness/null-evidence check before treating a hypothesis as viable. |
| Wang et al., `BioDSA-1K`, arXiv 2025-05-22 | Preprint benchmark | Biomedical data-science agents need to handle non-verifiable hypotheses where data are insufficient | Record `insufficient_data` as an outcome, not as a failed answer. |
| Alizadeh et al., `SocSci-Repro-Bench`, arXiv 2026-06-09 | Preprint benchmark | Reproduction materials may be missing or non-reproducible; paper PDFs can bias agents toward impossible confirmation | Separate reproducible, non-reproducible, missing-material, and prompt-induced-confirmation outcomes. |
| Cornell CVM, `From Data to Animal Health`, 2026 | Primary research award/program page | Veterinary AI faces species diversity, varied modalities, and benchmark/data infrastructure gaps | Animal-health claims must preserve null and missing-data evidence by species/domain. |
| Wu et al., `Agent-Memory Protocol`, PMLR 2026 | Peer-reviewed workshop/proceedings paper | Agent memory systems can leak sensitive accumulated context | Null evidence records must use privacy-scoped summaries rather than retaining raw sensitive traces. |

## Actionable design implication

Mirror Cartographer needs a **Null Evidence Capture Gate** before discovery-memory promotion. A claim cannot be promoted unless it declares:

1. the positive claim being considered,
2. the null, negative, failed, non-verifiable, or missing-material evidence found,
3. whether the absence of evidence is a true null, a missingness artifact, a privacy redaction, or an untested gap,
4. the source and species/modality/data boundary,
5. whether prompt framing could have induced confirmation bias,
6. the blocked inference that must not be reused,
7. the falsification route,
8. the next executable action.

## Required labels

- `source_status`
- `claim_status`
- `privacy_status`
- `missingness`
- `revision_reason`
- `implementation_status`
- `evidence_strength`
- `falsification_route`
- `next_executable_action`

## Evidence strength

Moderate. The gate is supported by converging preprints and benchmark work on publication bias, optimism bias, non-verifiable biomedical hypotheses, reproducibility failures, veterinary benchmark gaps, and privacy-preserving memory. It is not yet validated inside Mirror Cartographer.

## Falsification route

Revise or reject this gate if independent reviewers using promoted MC discovery-memory packets do not improve at identifying:

- null evidence,
- missing-material limits,
- non-verifiable claims,
- privacy redactions,
- prompt-induced confirmation risk,
- blocked inferences.

## Privacy status

Public-safe synthetic implementation only. No personal medical records, no patient data, no animal-specific treatment advice, and no raw sensitive traces.

## Implementation status

Implemented as JSON schema, validation CLI, valid fixture, invalid fixture, and regression tests.

## Next executable action

Run:

`python tools/null_evidence_capture_gate/test_validate_null_evidence_capture_packet.py`
