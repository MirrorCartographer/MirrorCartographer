"""Minimal project-owned decoder-only Transformer (PyTorch).

Research implementation only. It is not pretrained, benchmarked, or safe for
production. Training requires a lawful corpus and an explicit resource budget.
"""
from __future__ import annotations
from dataclasses import dataclass
import torch
from torch import nn
from torch.nn import functional as F

@dataclass
class ModelConfig:
    vocab_size: int = 260  # byte IDs 0..255 + BOS/EOS/PAD/UNK
    context_length: int = 512
    width: int = 256
    layers: int = 4
    heads: int = 4
    dropout: float = 0.1

class ByteTokenizer:
    BOS, EOS, PAD, UNK = 256, 257, 258, 259
    vocab_size = 260
    def encode(self, text: str, add_bos: bool = True, add_eos: bool = True):
        ids = list(text.encode("utf-8", errors="replace"))
        return ([self.BOS] if add_bos else []) + ids + ([self.EOS] if add_eos else [])
    def decode(self, ids):
        raw = bytes(i for i in ids if 0 <= i <= 255)
        return raw.decode("utf-8", errors="replace")

class CausalBlock(nn.Module):
    def __init__(self, cfg: ModelConfig):
        super().__init__()
        if cfg.width % cfg.heads:
            raise ValueError("width must be divisible by heads")
        self.norm1 = nn.LayerNorm(cfg.width)
        self.attn = nn.MultiheadAttention(cfg.width, cfg.heads,
                                          dropout=cfg.dropout, batch_first=True)
        self.norm2 = nn.LayerNorm(cfg.width)
        self.ff = nn.Sequential(nn.Linear(cfg.width, 4*cfg.width), nn.GELU(),
                                nn.Linear(4*cfg.width, cfg.width),
                                nn.Dropout(cfg.dropout))
    def forward(self, x):
        n = x.size(1)
        mask = torch.triu(torch.ones(n, n, device=x.device, dtype=torch.bool), diagonal=1)
        z = self.norm1(x)
        a, _ = self.attn(z, z, z, attn_mask=mask, need_weights=False)
        x = x + a
        return x + self.ff(self.norm2(x))

class LYRLanguageModel(nn.Module):
    def __init__(self, cfg: ModelConfig | None = None):
        super().__init__()
        self.cfg = cfg or ModelConfig()
        c = self.cfg
        self.token_embedding = nn.Embedding(c.vocab_size, c.width)
        self.position_embedding = nn.Embedding(c.context_length, c.width)
        self.blocks = nn.ModuleList([CausalBlock(c) for _ in range(c.layers)])
        self.norm = nn.LayerNorm(c.width)
        self.output = nn.Linear(c.width, c.vocab_size, bias=False)
        self.output.weight = self.token_embedding.weight
        self.dropout = nn.Dropout(c.dropout)
        self.apply(self._init)
    @staticmethod
    def _init(module):
        if isinstance(module, nn.Linear):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)
            if module.bias is not None: nn.init.zeros_(module.bias)
        elif isinstance(module, nn.Embedding):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)
    def forward(self, tokens, targets=None):
        b, n = tokens.shape
        if n > self.cfg.context_length:
            raise ValueError("sequence exceeds context_length")
        positions = torch.arange(n, device=tokens.device)
        x = self.dropout(self.token_embedding(tokens) + self.position_embedding(positions)[None,:,:])
        for block in self.blocks: x = block(x)
        logits = self.output(self.norm(x))
        loss = None
        if targets is not None:
            loss = F.cross_entropy(logits.reshape(-1, logits.size(-1)), targets.reshape(-1),
                                   ignore_index=ByteTokenizer.PAD)
        return logits, loss
    @torch.no_grad()
    def generate(self, tokens, max_new_tokens=100, temperature=1.0, top_k=40):
        self.eval()
        for _ in range(max_new_tokens):
            ctx = tokens[:, -self.cfg.context_length:]
            logits, _ = self(ctx)
            scores = logits[:, -1, :] / max(temperature, 1e-5)
            if top_k:
                values, _ = torch.topk(scores, min(top_k, scores.size(-1)))
                scores[scores < values[:, [-1]]] = -float("inf")
            probs = F.softmax(scores, dim=-1)
            nxt = torch.multinomial(probs, num_samples=1)
            tokens = torch.cat([tokens, nxt], dim=1)
        return tokens
