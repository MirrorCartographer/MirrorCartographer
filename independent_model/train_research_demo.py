"""Train a small LYR research checkpoint with a genuine held-out split and honest quality report.

This pipeline demonstrates trainability, NOT a generally capable chatbot.
"""
import argparse
import copy
import hashlib
import json
import math
import random
from pathlib import Path

import torch
from model import ByteTokenizer, LYRLanguageModel, ModelConfig
from synthetic_demo import write_corpus

def evaluate(model, ids, context):
    losses = []
    model.eval()
    with torch.no_grad():
        for start in range(0, len(ids) - context - 1, 128):
            x = ids[start:start + context][None, :]
            y = ids[start + 1:start + context + 1][None, :]
            _, loss = model(x, y)
            losses.append(float(loss))
    return sum(losses) / len(losses)

def train_demo(out_dir, steps=500, seed=17):
    out = Path(out_dir)
    manifest = write_corpus(out)
    train_text = (out / "train.txt").read_text(encoding="utf-8")
    heldout_text = (out / "heldout.txt").read_text(encoding="utf-8")
    context, width, layers, heads, batch_size = 64, 96, 2, 4, 12
    torch.set_num_threads(min(3, torch.get_num_threads()))
    torch.manual_seed(seed)
    random.seed(seed)
    tokenizer = ByteTokenizer()
    train_ids = torch.tensor(tokenizer.encode(train_text), dtype=torch.long)
    valid_ids = torch.tensor(tokenizer.encode(heldout_text), dtype=torch.long)
    cfg = ModelConfig(context_length=context, width=width, layers=layers, heads=heads)
    model = LYRLanguageModel(cfg)
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.001)
    best_loss = float("inf")
    best_step = None
    best_weights = None
    worse = 0
    trace = []
    for step in range(1, steps + 1):
        model.train()
        start = torch.randint(0, len(train_ids)-context-1, (batch_size,))
        x = torch.stack([train_ids[i:i+context] for i in start])
        y = torch.stack([train_ids[i+1:i+context+1] for i in start])
        _, loss = model(x, y)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        if step == 1 or step % 25 == 0:
            validation = evaluate(model, valid_ids, context)
            trace.append({"step": step, "train_batch_loss": round(float(loss.detach()),4), "heldout_loss": round(validation,4)})
            if validation < best_loss - 0.002:
                best_loss, best_step, worse = validation, step, 0
                best_weights = copy.deepcopy(model.state_dict())
            else:
                worse += 1
            if worse >= 7:
                break
    model.load_state_dict(best_weights)
    checkpoint = out / "lyr-demo.pt"
    torch.save({
        "config": cfg.__dict__,
        "state_dict": model.state_dict(),
        "seed": seed,
        "steps": best_step,
        "train_text_sha256": manifest["splits"]["train"]["sha256"],
        "status": "RESEARCH_ONLY"
    }, checkpoint)
    report = {
        "status": "TRAINED_SMALL_RESEARCH_CHECKPOINT_NOT_PRODUCTION",
        "quality_gate": "FAIL_GENERAL_DIALOGUE_NOT_EVALUATED",
        "checkpoint_sha256": hashlib.sha256(checkpoint.read_bytes()).hexdigest(),
        "checkpoint_bytes": checkpoint.stat().st_size,
        "train_source": "original synthetic text; no private chats",
        "heldout_sha256": manifest["splits"]["heldout"]["sha256"],
        "parameter_count": sum(p.numel() for p in model.parameters()),
        "best_step": best_step,
        "heldout_loss": round(best_loss, 4),
        "heldout_perplexity": round(math.exp(best_loss), 2),
        "validation_trace": trace,
        "non_claims": [
            "No general conversational intelligence",
            "No clinical, legal, factual or safety benchmark passed",
            "Not approved for public resident dialogue"
        ]
    }
    (out / "evaluation.json").write_text(json.dumps(report, indent=2)+"\n", encoding="utf-8")
    return report

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--out-dir", required=True)
    p.add_argument("--steps", type=int, default=500)
    p.add_argument("--seed", type=int, default=17)
    args = p.parse_args()
    if args.steps < 1 or args.steps > 5000:
        p.error("Steps must be in 1..5000 for this bounded demonstration.")
    print(json.dumps(train_demo(args.out_dir, steps=args.steps, seed=args.seed), indent=2))
