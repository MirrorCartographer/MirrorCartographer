"""Run a project-trained LYR research checkpoint locally.

Usage: python infer.py --checkpoint checkpoints/lyr.pt --prompt "..."
Requires PyTorch. No network or external provider is used.
"""
import argparse, sys, torch
from model import LYRLanguageModel, ModelConfig, ByteTokenizer

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--prompt")
    p.add_argument("--prompt-stdin", action="store_true", help="Read the prompt from stdin to avoid command-line length limits.")
    p.add_argument("--max-new-tokens", type=int, default=160)
    p.add_argument("--temperature", type=float, default=0.8)
    p.add_argument("--top-k", type=int, default=40)
    p.add_argument("--device", default="cpu")
    a = p.parse_args()
    if a.prompt_stdin and a.prompt is not None:
        p.error("Use either --prompt or --prompt-stdin, not both.")
    prompt_text = sys.stdin.read() if a.prompt_stdin else a.prompt
    if not isinstance(prompt_text, str) or not prompt_text.strip():
        p.error("A non-empty --prompt or stdin prompt is required.")
    device = torch.device(a.device)
    state = torch.load(a.checkpoint, map_location=device, weights_only=False)
    cfg = ModelConfig(**state["config"])
    model = LYRLanguageModel(cfg).to(device)
    model.load_state_dict(state["state_dict"])
    model.eval()
    tokenizer = ByteTokenizer()
    prompt = torch.tensor([tokenizer.encode(prompt_text, add_eos=False)], dtype=torch.long, device=device)
    generated = model.generate(prompt, a.max_new_tokens, a.temperature, a.top_k)
    print(tokenizer.decode(generated[0].tolist()[prompt.size(1):]))

if __name__ == "__main__": main()
