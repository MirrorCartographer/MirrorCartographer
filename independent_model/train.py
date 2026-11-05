"""Train LYRLanguageModel from random initialization on a UTF-8 text corpus.

Usage: python train.py --data corpus.txt --steps 1000 --out checkpoints/lyr.pt
The corpus must be legally usable and described in a separate data manifest.
"""
import argparse, json, random
from pathlib import Path
import torch
from model import LYRLanguageModel, ModelConfig, ByteTokenizer

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--data", required=True)
    p.add_argument("--steps", type=int, default=1000)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--context", type=int, default=256)
    p.add_argument("--lr", type=float, default=3e-4)
    p.add_argument("--seed", type=int, default=17)
    p.add_argument("--out", default="checkpoints/lyr.pt")
    a = p.parse_args()
    random.seed(a.seed); torch.manual_seed(a.seed)
    raw = Path(a.data).read_text(encoding="utf-8")
    tok = ByteTokenizer()
    ids = torch.tensor(tok.encode(raw), dtype=torch.long)
    if len(ids) < a.context + 2: raise SystemExit("Corpus too small for context window")
    split = int(len(ids) * .95)
    train, valid = ids[:split], ids[split:]
    if len(valid) < a.context + 2: raise SystemExit("Held-out validation split too small")
    cfg = ModelConfig(context_length=a.context)
    model = LYRLanguageModel(cfg)
    opt = torch.optim.AdamW(model.parameters(), lr=a.lr)
    def batch(source):
        starts = torch.randint(0, len(source)-a.context-1, (a.batch_size,))
        x = torch.stack([source[i:i+a.context] for i in starts])
        y = torch.stack([source[i+1:i+a.context+1] for i in starts])
        return x, y
    for step in range(1, a.steps+1):
        model.train(); x,y = batch(train); _,loss = model(x,y)
        opt.zero_grad(set_to_none=True); loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step()
        if step % 100 == 0 or step == 1:
            model.eval()
            with torch.no_grad():
                vx,vy = batch(valid); _,vloss = model(vx,vy)
            print(json.dumps({"step":step,"train_loss":float(loss),"valid_loss":float(vloss)}))
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    torch.save({"config":cfg.__dict__,"state_dict":model.state_dict(),
                "seed":a.seed,"steps":a.steps,"corpus_bytes":len(raw.encode("utf-8"))}, out)
    print(f"Saved research checkpoint: {out}")

if __name__ == "__main__": main()
