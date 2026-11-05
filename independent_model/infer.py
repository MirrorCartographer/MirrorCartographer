"""Run a project-trained LYR research checkpoint locally.

Usage: python infer.py --checkpoint checkpoints/lyr.pt --prompt "..."
Requires PyTorch. No network or external provider is used.
"""
import argparse, torch
from model import LYRLanguageModel, ModelConfig, ByteTokenizer

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--prompt", required=True)
    p.add_argument("--max-new-tokens", type=int, default=160)
    p.add_argument("--temperature", type=float, default=0.8)
    p.add_argument("--top-k", type=int, default=40)
    p.add_argument("--device", default="cpu")
    a = p.parse_args()
    device = torch.device(a.device)
    state = torch.load(a.checkpoint, map_location=device, weights_only=False)
    cfg = ModelConfig(**state["config"])
    model = LYRLanguageModel(cfg).to(device)
    model.load_state_dict(state["state_dict"])
    model.eval()
    tokenizer = ByteTokenizer()
    prompt = torch.tensor([tokenizer.encode(a.prompt, add_eos=False)], dtype=torch.long, device=device)
    generated = model.generate(prompt, a.max_new_tokens, a.temperature, a.top_k)
    print(tokenizer.decode(generated[0].tolist()[prompt.size(1):]))

if __name__ == "__main__": main()
