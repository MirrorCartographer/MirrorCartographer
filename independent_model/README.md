# Independent LYR Model — Build Plan and Boundary
Version: 0.1.0
Status: training and authenticated local inference implemented; tiny synthetic checkpoint is a reproducible research artifact, not a validated conversational model.

## What "our own LLM" means
The project will own and version its tokenizer, model architecture implementation, training/evaluation pipeline, curated training corpus, checkpoints, inference runtime, adapters, and governance. It may use an existing open-weight model during development, but that is an optional adapter, not the definition of independence.

A model trained from random initialization on a project-controlled corpus is the strongest proof of independent model training. It will initially be a small research model, not a competitor to frontier foundation models. Scale and capability claims require measured benchmark results.

## Staged path
1. **Runtime independence:** provider-neutral inference interface and project-owned conversation/provenance/memory stores.
2. **Architecture ownership:** implement a decoder-only Transformer, tokenizer, training loop, checkpoint format, and deterministic inference tests.
3. **Corpus governance:** document data origin, license/permission, exclusions, deduplication, quality, language/domain coverage, and deletion/retention rules. Do not train on private user conversations by default.
4. **Small from-scratch model:** train a small randomly initialized model on a legally usable, documented corpus; record data manifest, code commit, configuration, seed, hardware, loss curves, and evaluation.
5. **Evaluation:** held-out perplexity, task-specific factuality, calibration, retrieval attribution, contradiction handling, memorization/privacy leakage, robustness, and human preference/agency studies.
6. **Scale decision:** expand only if measured utility justifies compute and data costs.

## Model vs system
- The LLM predicts tokens.
- FREE 2.0 governs the decision workflow.
- Mirror Memory stores explicit user/project records.
- Provenance records where claims and outputs came from.
- Contradiction handling keeps incompatible records visible.
- LYR defines an interaction identity/configuration.
These components must remain separable.

## Independence tests
- The application starts with the project model and no vendor API key.
- The same memory and evidence records survive switching model adapters.
- The model can be disabled while search, memory inspection, and audit export still work.
- All model-generated claims are labeled and cannot cite themselves as external evidence.
- Reproducible training can be rerun from the documented corpus manifest and configuration.

## Initial research model target
A small decoder-only Transformer (byte-level tokenizer initially; replace only with a versioned tokenizer after comparison), context window 512–2048, configurable layers/heads/embedding width, causal attention, cross-entropy objective, AdamW, gradient clipping, checkpointing, and held-out validation. Hardware and corpus size are selected after a feasibility benchmark; no compute budget is invented here.

## Non-claims
No consciousness claim. No claim of frontier-level reasoning. No claim that a model trained on a small corpus is safe or generally intelligent. No use of unlicensed scraped data. No claim of training completion until a reproducible checkpoint and evaluation report exist.

## Local training and inference
Install the declared dependency in a dedicated environment:

```sh
python -m pip install -r independent_model/requirements.txt
```

After creating and reviewing a rights-cleared corpus and completing `corpus-manifest.example.json` as a real manifest, train:

```sh
python independent_model/train.py --data path/to/approved-corpus.txt --steps 1000 --out independent_model/checkpoints/lyr.pt
```

Run the trained checkpoint without a network provider:

```sh
python independent_model/infer.py --checkpoint independent_model/checkpoints/lyr.pt --prompt "State what is known and unknown."
```

The repository does not include a training corpus or checkpoint. The commands define a reproducible path; they are not evidence that training has already occurred.


## Local provider bridge

The inference entry point accepts either `--prompt "…"` or `--prompt-stdin`. The stdin form exists for provider-neutral local clients such as the private Repository C CLI bridge; it avoids shell argument-length limits and does not require an HTTP server. The bridge still requires a real checkpoint and the declared PyTorch dependency. No checkpoint is included in this repository, so LYR remains an untrained research implementation until a rights-cleared corpus, training run, checkpoint, and evaluation report exist.


## Executed miniature training and local model transport (research only)

A separate, runnable training experiment now uses **newly authored synthetic text** with a disjoint held-out set. No private conversations or scraped source material are included. Unlike the general trainer, the demo is intentionally small and has a fixed resource budget.

```sh
python -m pip install -r independent_model/requirements-server.txt
python independent_model/test_research_training.py
python independent_model/train_research_demo.py --out-dir independent_model/checkpoints/demo --steps 500
```

The experiment outputs `lyr-demo.pt`, `evaluation.json`, and `corpus-manifest.json`. Its reported general-dialogue quality gate is **FAIL_GENERAL_DIALOGUE_NOT_EVALUATED**, even when the training loss decreases. The new GitHub Actions workflow `lyr-research-training.yml` reproduces training and preserves the checkpoint as a short-lived artifact, not as an unversioned file in the repository.

To prove real local inference, explicitly enable the **research-only** server:

```sh
export LYR_MODEL_CHECKPOINT=independent_model/checkpoints/demo/lyr-demo.pt
export LYR_ACCESS_TOKEN='replace-with-a-long-random-dev-token'
export LYR_ENABLE_UNVALIDATED_RESEARCH=1
python independent_model/serve_research.py
```

It listens on **127.0.0.1** by default and serves `POST /v1/chat/completions` using the trained checkpoint. Requests require a bearer token. The response includes `research_only: true` and a failed model-quality gate; a production UI should reject that result rather than display it as a capable character's intelligence.

The model connector in the private UI can call an OpenAI-compatible endpoint when opted in and server-configured. This research endpoint matches the transport format, but **not the public dialogue acceptance standard**. The actual deployed Network and host must be tested separately. See `independent_model/test_research_server.py` for an authenticated, local request against real trained tensors.
