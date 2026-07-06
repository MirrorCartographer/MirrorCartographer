# Frontier Scout: Missingness Clock Longitudinal Gate

Date: 2026-07-06

## One-line implementation

Add a **Missingness Clock Longitudinal Gate** before MC promotes medical, veterinary, mechanistic-biology, or longitudinal-health observations into discovery memory.

The gate treats missingness, sampling cadence, modality drift, and privacy boundary as first-class evidence fields rather than metadata afterthoughts.

## Why this matters now

Current frontier work in medical AI and scientific AI is converging on a practical problem: many apparent discoveries are artifacts of irregular time, sparse documentation, site heterogeneity, privacy constraints, or proxy endpoints. Longitudinal EHR + wearable models, medical time-series foundation models, multimodal public EHR benchmarks, and privacy-aware federated benchmarks all point toward the same design implication: a research memory system should not accept a health trajectory claim unless it can say **what was measured, what was not measured, when it was measured, how missingness was handled, what privacy boundary applies, and what would falsify the inferred trajectory**.

This artifact is research organization only. It is not medical or veterinary advice.

## Actionable design implication

MC discovery packets should fail admission when they claim durable improvement, decline, cure progress, mechanism, animal-health trajectory, or longitudinal pattern without all of the following:

1. **Observation clock** — timestamps or time windows for each observation.
2. **Measurement cadence** — expected vs actual sampling frequency.
3. **Missingness map** — explicitly states absent, unknown, unmeasured, censored, skipped, subjective-only, or device-failed fields.
4. **Modality boundary** — separates EHR/clinical notes, labs, imaging, wearable/device signals, self-report, caretaker report, and animal observations.
5. **Proxy vs endpoint separation** — identifies short-window signals separately from durable target outcomes.
6. **Privacy boundary** — states whether data is public, synthetic, de-identified, local-private, clinical-regulated, veterinary-client-private, or unknown.
7. **Falsification route** — names the specific future measurement pattern that would reject or revise the trajectory claim.
8. **Revision reason** — records why the packet changed since the prior memory state.

## Prototype requirement

Create a validator at:

`tools/missingness_clock_longitudinal_gate/validate_missingness_clock_packet.py`

The validator should reject packets when:

- `time_axis.observation_windows` is empty.
- `time_axis.expected_cadence` is missing while the packet makes a trajectory claim.
- any modality has `missingness_status = unknown` without a reason.
- proxy signals are promoted as endpoint evidence.
- privacy status is omitted or set to `unknown` for non-public health data.
- falsification route lacks a measurable future observation.
- veterinary packets omit species and observer role.

## Minimal packet schema

```json
{
  "packet_id": "string",
  "domain": "human_health | animal_health | mechanistic_biology | scientific_ai | neuroscience | hci",
  "claim_text": "string",
  "claim_status": "hypothesis | trajectory_claim | mechanism_claim | rejected | needs_more_data",
  "source_status": "primary | institution | preprint | benchmark | dataset | open_source | synthetic | assistant_generated",
  "privacy_status": "public | synthetic | de_identified | local_private | regulated_clinical | veterinary_client_private | unknown",
  "time_axis": {
    "observation_windows": ["ISO-8601 interval or plain-language bounded window"],
    "expected_cadence": "string",
    "actual_cadence": "string",
    "irregularity_reason": "string"
  },
  "modalities": [
    {
      "name": "labs | imaging | EHR_note | wearable | self_report | caretaker_report | veterinary_exam | omics | behavior_video | other",
      "measurement_unit": "string or null",
      "missingness_status": "observed | absent | unmeasured | censored | skipped | device_failed | subjective_only | unknown",
      "missingness_reason": "string"
    }
  ],
  "proxy_signals": ["string"],
  "target_endpoints": ["string"],
  "revision_reason": "string",
  "evidence_strength": "weak | moderate | strong",
  "falsification_route": "string with measurable future observation",
  "implementation_status": "source_map | schema | prototype_requirement | test_required | implemented",
  "next_executable_action": "string"
}
```

## Synthetic positive fixture

```json
{
  "packet_id": "mc-longitudinal-demo-001",
  "domain": "animal_health",
  "claim_text": "Caretaker-observed night eye-pressure behavior may vary by travel context, but no diagnosis or treatment inference is admitted.",
  "claim_status": "hypothesis",
  "source_status": "synthetic",
  "privacy_status": "synthetic",
  "time_axis": {
    "observation_windows": ["travel week", "post-travel week"],
    "expected_cadence": "daily caretaker observation plus clinician measurements when available",
    "actual_cadence": "irregular caretaker observations; no continuous tonometry",
    "irregularity_reason": "real-world animal observation is sparse and context-dependent"
  },
  "modalities": [
    {
      "name": "caretaker_report",
      "measurement_unit": null,
      "missingness_status": "subjective_only",
      "missingness_reason": "no instrument reading attached"
    },
    {
      "name": "veterinary_exam",
      "measurement_unit": "IOP mmHg when available",
      "missingness_status": "unmeasured",
      "missingness_reason": "synthetic fixture contains no clinical measurement"
    }
  ],
  "proxy_signals": ["visible swelling", "restlessness"],
  "target_endpoints": ["clinician-measured intraocular pressure trend", "documented comfort/function over bounded follow-up"],
  "revision_reason": "adds missingness and proxy/endpoint separation before memory admission",
  "evidence_strength": "weak",
  "falsification_route": "Reject trajectory claim if repeated clinician measurements do not vary with the hypothesized context or if proxy signs fail to correlate with measured endpoint changes.",
  "implementation_status": "prototype_requirement",
  "next_executable_action": "Implement validator and regression fixtures under tools/missingness_clock_longitudinal_gate/."
}
```

## Synthetic negative fixture

```json
{
  "packet_id": "mc-longitudinal-demo-002",
  "domain": "human_health",
  "claim_text": "Symptoms improved, so durable recovery is likely.",
  "claim_status": "trajectory_claim",
  "source_status": "assistant_generated",
  "privacy_status": "unknown",
  "time_axis": {
    "observation_windows": [],
    "expected_cadence": "",
    "actual_cadence": "one note",
    "irregularity_reason": ""
  },
  "modalities": [
    {
      "name": "self_report",
      "measurement_unit": null,
      "missingness_status": "unknown",
      "missingness_reason": ""
    }
  ],
  "proxy_signals": ["felt better once"],
  "target_endpoints": [],
  "revision_reason": "",
  "evidence_strength": "weak",
  "falsification_route": "",
  "implementation_status": "test_required",
  "next_executable_action": "Reject packet."
}
```

## Source map

| Source | Status | What it contributes | Caveat |
|---|---:|---|---|
| Zhang et al., 2026, `Learning Longitudinal Health Representations from EHR and Wearable Data`, arXiv:2601.12227 | preprint | Joint EHR + wearable modeling as continuous-time latent process; missing-data and long-horizon framing | Preprint; claims require independent replication and deployment validation |
| Li et al., 2025, `MIRA: Medical Time Series Foundation Model for Real-World Health Data`, arXiv:2506.07584 | preprint | Irregular intervals, heterogeneous sampling rates, missing values, continuous-time forecasting | Preprint; benchmark design may not cover all real-world clinical workflows |
| Yu et al., 2025, `Benchmarking Foundation Models with Multimodal Public Electronic Health Records`, arXiv:2507.14824 | preprint + open-source benchmark | Standardized public MIMIC-IV multimodal processing and evaluation across performance, fairness, interpretability | Public ICU data is not representative of every population or setting |
| Marella et al., 2025, `FedOnco-Bench`, arXiv:2511.00795 | preprint + reproducible benchmark | Privacy-utility tradeoff, synthetic CT data, FL heterogeneity, membership-inference evaluation | Synthetic data and segmentation tasks do not cover all longitudinal clinical claims |
| Portal of Medical Data Models / SPHN-style semantic interoperability infrastructure | institution / infrastructure pattern | Need for reusable, semantically explicit data models in health research | Infrastructure transfer to MC requires local schema design, not direct clinical reuse |

## Labels

- **Source status:** public frontier scan; preprints and infrastructure sources; assistant-generated schema/prototype artifact.
- **Claim status:** discovery-infrastructure hypothesis, not medical or veterinary advice.
- **Privacy status:** public-safe; no private health data used; synthetic fixtures only.
- **Missingness:** no production corpus, no clinician/veterinary reviewer labels, no CI wiring, no executable validator yet.
- **Revision reason:** prior gates handled provenance, counterfactuals, proxy/endpoint separation, and animal-health evidence; this revision adds time-clock and missingness as mandatory longitudinal admission fields.
- **Implementation status:** GitHub source map + schema + prototype requirement committed.
- **Evidence strength:** moderate for infrastructure direction; weak for any domain-specific health inference.
- **Falsification route:** revise or drop the gate if curator-labeled testing shows missingness-clock requirements do not reduce unsupported longitudinal memory promotion, or if they block useful research packets without improving reviewer agreement.
- **Next executable action:** build `tools/missingness_clock_longitudinal_gate/` with validator, schema file, positive/negative fixtures, and regression tests.
