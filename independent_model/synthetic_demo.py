"""Newly authored, non-private synthetic research corpus.

This corpus is for proving the training pipeline only. It is intentionally too
small and repetitive to create a generally useful conversational language model.
Never mix private conversations, medical records, or scraped texts into it.
"""
import hashlib
import json
from pathlib import Path

TRAIN_SENTENCES = [
    "Observation records what happened. An explanation proposes why. A test distinguishes the two.",
    "Morrow is the moth-like station keeper; Vesper is the station cat. A name is not a trained model.",
    "The station light flickered after a visitor touched the door. Sequence alone does not prove cause.",
    "A source describes where a claim came from. Confidence should increase only when independent evidence supports it.",
    "A person may change an interpretation without erasing the original observation.",
    "If the Lantern Hall is empty, report the measured emptiness, not a secret invisible crowd.",
    "The weather instrument reads pressure and motion. It cannot read thoughts, diagnosis, or destiny.",
    "An unfamiliar question can remain unanswered. The system may ask what evidence would resolve it.",
    "Visitors can choose to share a signal, but the default state is private.",
    "A failed button is a software defect. The test should report failure rather than invent success.",
    "The lantern changed color when the visitor selected a palette. That observation can be reproduced.",
    "The research room keeps a claim, a counterclaim, a source, and a decision as different records.",
    "Someone asked why thunder followed their arrival. The answer was uncertain because no causal test existed.",
    "The station keeper can describe an observed cue but must not claim to know the visitor's emotion.",
    "A memory entry needs consent, an owner, a source, and a way to correct or erase it.",
    "Creative characters can be strange and funny while their software remains honest about its capabilities.",
    "The doorway opened after a click. The observation says nothing about why the visitor clicked.",
    "A research checkpoint is not a conversational product until evaluation supports its use."
]
HELD_OUT_SENTENCES = [
    "The observatory measured rainfall but did not measure intention. A forecast is not a judgment.",
    "A second explanation can fit the same evidence. Record both and design a discriminating test.",
    "When a visitor leaves a signal, the system should show whether it reached another visitor.",
    "A model may generate words without knowing their source. The provenance layer must check the claim.",
    "A remembered choice can be revised when the owner changes their mind.",
    "An empty server response must not be labeled an intelligent conversation."
]

def build_corpus():
    train = "".join("STATION RECORD %02d\n%s\n" % (i % 97, TRAIN_SENTENCES[(i * 7 + i // 18) % len(TRAIN_SENTENCES)]) for i in range(950))
    held_out = "".join("HELD OUT %03d\n%s\n" % (i, HELD_OUT_SENTENCES[i % len(HELD_OUT_SENTENCES)]) for i in range(150))
    assert not set(TRAIN_SENTENCES).intersection(HELD_OUT_SENTENCES)
    return train, held_out

def write_corpus(output_dir):
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    train, held_out = build_corpus()
    (out / "train.txt").write_text(train, encoding="utf-8")
    (out / "heldout.txt").write_text(held_out, encoding="utf-8")
    manifest = {
        "schema_version": "1.0",
        "status": "SYNTHETIC_DEMONSTRATION_ONLY",
        "data_origin": "new original text authored for this research example; not extracted from user conversations or external sources",
        "restriction": "Not approved as a production training corpus or evidence of conversation quality.",
        "splits": {
            "train": {"sha256": hashlib.sha256(train.encode()).hexdigest(), "bytes": len(train.encode())},
            "heldout": {"sha256": hashlib.sha256(held_out.encode()).hexdigest(), "bytes": len(held_out.encode())}
        }
    }
    (out / "corpus-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--out-dir", required=True)
    args = p.parse_args()
    print(json.dumps(write_corpus(args.out_dir), indent=2))
