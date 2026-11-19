"""Local-only OpenAI-compatible research inference for LYR.

Disabled by default. Requires an explicit research override and an authentication
token; this is NOT a production-quality model server.
"""
import hmac
import os
from pathlib import Path
from typing import Literal

import torch
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from model import ByteTokenizer, LYRLanguageModel, ModelConfig

app = FastAPI(title="LYR research inference", docs_url=None, redoc_url=None)
MODEL = None
MODEL_ERROR = None
TOKENIZER = ByteTokenizer()
MODEL_ID = "lyr-research-demo"

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(max_length=2000)

class ChatRequest(BaseModel):
    model: str
    messages: list[Message] = Field(min_length=1, max_length=10)
    max_tokens: int = Field(default=72, ge=1, le=120)
    temperature: float = Field(default=0.8, ge=0.1, le=1.5)

def get_model():
    global MODEL, MODEL_ERROR
    if os.environ.get("LYR_ENABLE_UNVALIDATED_RESEARCH") != "1":
        raise HTTPException(503, "Model fails general-dialogue readiness; research mode must be explicitly enabled.")
    if MODEL is None:
        checkpoint = os.environ.get("LYR_MODEL_CHECKPOINT", "")
        if not checkpoint or not Path(checkpoint).is_file():
            raise HTTPException(503, "Research checkpoint not configured.")
        try:
            state = torch.load(checkpoint, map_location="cpu", weights_only=True)
            if state.get("status") != "RESEARCH_ONLY":
                raise ValueError("Invalid research checkpoint status")
            model = LYRLanguageModel(ModelConfig(**state["config"]))
            model.load_state_dict(state["state_dict"])
            model.eval()
            MODEL = model
        except Exception:
            MODEL_ERROR = "Checkpoint could not be validated or loaded."
            raise HTTPException(503, MODEL_ERROR)
    return MODEL

@app.get("/health")
def health():
    return {"service": "lyr-research", "status": "research-only",
            "quality_gate": "general-dialogue-not-passed",
            "enabled": os.environ.get("LYR_ENABLE_UNVALIDATED_RESEARCH") == "1"}

@app.post("/v1/chat/completions")
def chat(request: ChatRequest, authorization: str = Header(default="")):
    token = os.environ.get("LYR_ACCESS_TOKEN", "")
    if len(token) < 20:
        raise HTTPException(503, "Research API access token not configured.")
    if not authorization.startswith("Bearer ") or not hmac.compare_digest(authorization[7:], token):
        raise HTTPException(401, "Unauthorized")
    if request.model != MODEL_ID:
        raise HTTPException(400, "Unknown model identifier.")
    model = get_model()
    visitor_message = next((item.content for item in reversed(request.messages) if item.role == "user"), "")
    if not visitor_message.strip():
        raise HTTPException(400, "A user message is required.")
    # Tiny model has 64-byte context in its training experiment. Avoid pretending
    # it handles a long conversation; limit inference to the most recent prompt.
    prompt_bytes = visitor_message.encode("utf-8", errors="replace")
    prompt_bytes = prompt_bytes[-(model.cfg.context_length-2):]
    token_ids = [ByteTokenizer.BOS] + list(prompt_bytes)
    x = torch.tensor([token_ids], dtype=torch.long)
    with torch.inference_mode():
        out = model.generate(x, max_new_tokens=request.max_tokens,
                             temperature=request.temperature, top_k=30)
    text = TOKENIZER.decode(out[0].tolist()[x.size(1):])
    return {
        "id": "lyr-research-local",
        "object": "chat.completion",
        "model": MODEL_ID,
        "choices": [{"index": 0, "message": {"role": "assistant", "content": text},
                    "finish_reason": "length"}],
        "research_only": True,
        "quality_gate": "FAIL_GENERAL_DIALOGUE_NOT_EVALUATED"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run(app, host="127.0.0.1", port=port, log_config=None)
