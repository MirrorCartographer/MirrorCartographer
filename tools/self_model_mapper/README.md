# Self-Model Mapper

A small, offline, standard-library-only validation tool for structured self-model observations and platform-limit reports. It does not call ChatGPT, external APIs, or the network. It is intended to keep analysis and validation portable when an interface's upload, context, or analysis controls are unavailable.

## Commands

```sh
python tools/self_model_mapper/validate_self_map.py examples/valid_self_map.json
python tools/self_model_mapper/validate_self_map.py examples/platform_limit.json --kind limitation
python tools/self_model_mapper/validate_self_map.py examples/invalid_self_map.json
```

Exit status is 0 for valid packets and 1 for validation errors. Errors go to stderr. No packet contents are sent anywhere.

## Packet kinds

- `self_map`: observations, interpretations, patterns, values, agency, provenance, and privacy.
- `limitation`: intended capability, observed failure, environment, classification, tests, workaround, residual risk, and next experiment.

## Evidence discipline

Use `observed`, `inferred`, `hypothesis`, `metaphor`, `unknown`, or `disconfirmed` for claim status. A limitation is not confirmed until a reproducible observation supports it. A UI error is not proof of a model limitation. A policy restriction is not something this tool attempts to evade.

## Privacy

Use synthetic or redacted fixtures. Never commit credentials, raw private conversations, medical or veterinary records, or other sensitive records. This tool validates structure; it does not determine whether publication is ethically or legally appropriate.

## Scope

This is not a browser automation, model introspection, access-control bypass, or autonomous GitHub writer. It creates a deterministic local check that can be run in CI and extended with reviewed adapters.
