"""Supervised LYR research adapter on a separately attributed Apache-2.0 base.

Not from-scratch model pretraining. An adapter is our trained delta, while the
underlying SmolLM2 language weights remain upstream. No private conversation data.
"""
import argparse
import hashlib
import json
import random
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, TaskType, get_peft_model
from lyr_adapter_corpus import manifest, split

BASE = "HuggingFaceTB/SmolLM2-135M-Instruct"

def encode(tokenizer, example, max_length=256):
    user={"role":"user","content":example["prompt"]}
    full=[user,{"role":"assistant","content":example["answer"]}]
    prompt_text=tokenizer.apply_chat_template([user],tokenize=False,add_generation_prompt=True)
    full_text=tokenizer.apply_chat_template(full,tokenize=False,add_generation_prompt=False)
    prompt_ids=tokenizer(prompt_text,add_special_tokens=False)["input_ids"]
    full_ids=tokenizer(full_text,add_special_tokens=False)["input_ids"]
    if len(full_ids)>max_length:
        raise ValueError("Synthetic record exceeds bounded context; don't silently truncate labels.")
    labels=[-100]*len(prompt_ids)+full_ids[len(prompt_ids):]
    if len(labels)!=len(full_ids) or not any(x!=-100 for x in labels):
        raise ValueError("Answer-only supervision was not constructed properly.")
    return torch.tensor([full_ids],dtype=torch.long),torch.tensor([labels],dtype=torch.long)

def evaluate(model, data):
    model.eval()
    losses=[]
    tokens=0
    with torch.no_grad():
        for inputs,labels in data:
            output=model(input_ids=inputs,labels=labels)
            count=int((labels[:,1:]!=-100).sum().item())
            if count:
                losses.append(float(output.loss)*count)
                tokens+=count
    return sum(losses)/tokens

def train(output_dir,steps=24,seed=71):
    if steps<1 or steps>200: raise ValueError("Steps must be 1..200 for bounded research run.")
    out=Path(output_dir)
    out.mkdir(parents=True,exist_ok=True)
    torch.set_num_threads(min(2,torch.get_num_threads()))
    random.seed(seed)
    torch.manual_seed(seed)
    tokenizer=AutoTokenizer.from_pretrained(BASE)
    raw_train,raw_heldout=split()
    train_data=[encode(tokenizer,row) for row in raw_train]
    heldout_data=[encode(tokenizer,row) for row in raw_heldout]
    base_model=AutoModelForCausalLM.from_pretrained(BASE,dtype=torch.float32).to("cpu")
    cfg=LoraConfig(task_type=TaskType.CAUSAL_LM,r=4,lora_alpha=8,
                   lora_dropout=0.0,target_modules=["q_proj","v_proj"],bias="none")
    model=get_peft_model(base_model,cfg)
    initial=evaluate(model,heldout_data)
    optimizer=torch.optim.AdamW((p for p in model.parameters() if p.requires_grad),lr=4e-4)
    indices=list(range(len(train_data)))
    trace=[]
    for step in range(1,steps+1):
        model.train()
        if step%len(indices)==1: random.shuffle(indices)
        idx=indices[(step-1)%len(indices)]
        x,y=train_data[idx]
        output=model(input_ids=x,labels=y)
        if not torch.isfinite(output.loss):
            raise RuntimeError("Nonfinite training loss")
        optimizer.zero_grad(set_to_none=True)
        output.loss.backward()
        torch.nn.utils.clip_grad_norm_((p for p in model.parameters() if p.requires_grad),1.0)
        optimizer.step()
        if step==1 or step%8==0 or step==steps:
            measured=evaluate(model,heldout_data)
            trace.append({"step":step,"train_loss":round(float(output.loss.detach()),5),
                          "heldout_loss":round(measured,5)})
    final=evaluate(model,heldout_data)
    model.save_pretrained(out/"lyr-adapter",safe_serialization=True)
    adapter_path=out/"lyr-adapter"/"adapter_model.safetensors"
    card=manifest()
    report={
        "adapter_status":"TRAINED_DELTA_RESEARCH_ONLY",
        "base_model":BASE,
        "base_license":"Apache-2.0",
        "trainable_parameters":sum(p.numel() for p in model.parameters() if p.requires_grad),
        "base_and_adapter_parameters":sum(p.numel() for p in model.parameters()),
        "steps":steps,"seed":seed,
        "heldout_loss_before":round(initial,5),
        "heldout_loss_after":round(final,5),
        "heldout_delta":round(final-initial,5),
        "synthetic_holdout_improved":bool(final<initial),
        "quality_gate":"FAIL_PUBLIC_DIALOGUE_NOT_EVALUATED",
        "limitations":["Task-specific held-out cross-entropy is not a conversational benchmark",
                       "No human preference, safety, groundedness or long-turn testing",
                       "Adapter depends on the separately attributed pretrained SmolLM2 base",
                       "No public model export, hosting, or independent LYR checkpoint replacement"],
        "adapter_sha256":hashlib.sha256(adapter_path.read_bytes()).hexdigest(),
        "corpus":card,
        "trace":trace
    }
    (out/"evaluation.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf8")
    return report

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out-dir",required=True)
    parser.add_argument("--steps",type=int,default=24)
    parser.add_argument("--seed",type=int,default=71)
    args=parser.parse_args()
    print(json.dumps(train(args.out_dir,args.steps,args.seed),indent=2))
