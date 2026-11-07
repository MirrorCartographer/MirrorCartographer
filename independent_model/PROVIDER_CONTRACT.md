# LYR local provider contract

Version: 1.0.0  
Status: implemented as a CLI transport contract; model readiness remains unverified.

## Purpose

Expose the project-owned LYR inference script to local provider-neutral clients without creating a public inference endpoint or coupling memory storage to a model.

## Invocation

```sh
python independent_model/infer.py \
  --checkpoint /absolute/path/to/lyr.pt \
  --prompt-stdin \
  --max-new-tokens 160 \
  --temperature 0.8 \
  --top-k 40
```

The prompt is UTF-8 text on stdin. The response is UTF-8 text on stdout. Diagnostics go to stderr. Non-zero exit means inference failed.

## Repository C adapter

Repository C's `tools/ask.mjs --provider lyr` invokes this script as a local subprocess. It requires:

- `LYR_REPO_PATH`: local checkout of this repository;
- `LYR_CHECKPOINT`: explicit checkpoint path, relative to `LYR_REPO_PATH` or absolute;
- `LYR_PYTHON`: optional Python executable override, default `python3`.

C supplies its own system contract and optional local memory retrieval. The LYR model does not own or mutate C's continuity ledger. Model switching must not change the underlying record store.

## Safety and readiness

- No network server is opened by this adapter.
- No credential is required for local LYR inference.
- No checkpoint is included or claimed to exist.
- Do not train on private conversations, medical/veterinary records, financial records, benefits records, credentials, or private messages by default.
- Do not treat generated text as evidence; model outputs require provenance and human review.
- Do not use the research model for high-impact decisions.
- Do not claim training completion, independent capability, or production readiness until a reproducible checkpoint and held-out evaluation report exist.
