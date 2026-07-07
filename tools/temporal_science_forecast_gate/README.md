# Temporal Science Forecast Gate

## Purpose

This gate blocks discovery-memory promotion when a claim cannot be evaluated prospectively. A packet must declare a fixed evidence cutoff, a forecast horizon, prior-work dependencies, collaborator or dataset targets, expected contribution shape, evaluation signal, missingness, and falsification route.

## Frontier scan

| Source | Status | Useful signal |
|---|---|---|
| PreScience: A Benchmark for Forecasting Scientific Contributions, arXiv, 2026-02-24 | preprint / benchmark | Decomposes scientific forecasting into collaborator prediction, prior-work selection, contribution generation, and impact prediction over temporally aligned scholarly metadata. |
| FrontierScience, arXiv, 2026-01-29 | preprint / benchmark | Evaluates open-ended expert scientific subtasks with granular rubrics rather than only final answers. |
| SciResearcher, arXiv, 2026-05-02 | preprint / reproducible-method direction | Emphasizes tool-integrated information acquisition and long-horizon scientific reasoning grounded in heterogeneous academic evidence. |
| MIMIC-Multimodal benchmark, arXiv/GitHub, 2025 | dataset / open-source benchmark | Provides a reproducible multimodal public EHR processing pipeline and evaluation frame for trustworthy clinical AI. |

## Actionable design implication

MC should not store a discovery claim as reusable memory unless the packet answers:

1. What evidence was available at the cutoff date?
2. What contribution, method, dataset dependency, collaborator target, or benchmark movement should become observable later?
3. How will the packet be judged after the horizon?
4. What missing evidence or failed prediction would force revision?

## Labels

- Source status: public frontier scan; mixed source map.
- Claim status: discovery-infrastructure evaluation criterion.
- Privacy status: public-safe synthetic implementation only.
- Missingness: no production corpus, curator labels, or bibliometric backtest yet.
- Revision reason: prior gates validated evidence structure but did not force prospective time-bounded evaluation.
- Implementation status: schema, fixtures, validator, and regression tests committed.
- Evidence strength: moderate.
- Falsification route: revise if fixed-cutoff forecast packets do not improve reviewer agreement or reduce vague unsupported discovery-memory promotion.
- Next executable action: run `python tools/temporal_science_forecast_gate/test_validate_temporal_science_forecast_packet.py`.

## Files

- `schema.json`
- `fixtures/valid_temporal_science_forecast_packet.json`
- `fixtures/invalid_temporal_science_forecast_packet.json`
- `validate_temporal_science_forecast_packet.py`
- `test_validate_temporal_science_forecast_packet.py`
