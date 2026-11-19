"""Public-safe, newly authored LYR training/evaluation fixtures.

These are fictional station equipment scenarios, NOT user conversations.
Training and held-out scenes use disjoint nouns and devices.
"""
import hashlib
import json

TRAIN_SCENES = (
    ("station lantern", "bell", "brighter"),
    ("paper compass", "whistle", "shifts"),
    ("glass dial", "clock chime", "turns"),
    ("signal flag", "mechanical click", "rises"),
    ("painted gate", "footstep", "swings"),
    ("brass needle", "switch", "twitches"),
    ("ceiling fan", "hinge", "stops"),
    ("copper bell", "drawer", "rings"),
    ("ticket wheel", "handle", "spins"),
    ("green lamp", "music box", "flickers"),
    ("door latch", "mirror", "loosens"),
    ("wind vane", "lever", "points east"),
)
HELDOUT_SCENES = (
    ("red balloon", "pendulum", "moves"),
    ("water gauge", "shutter", "rises"),
    ("sliding panel", "tap", "closes"),
    ("silver button", "buzzer", "glows"),
)

def make_rows(scenes):
    rows = []
    for subject, trigger, effect in scenes:
        rows.extend([
            {
                "prompt": f"In the station, the {subject} {effect} after the {trigger}. Did the {trigger} cause it?",
                "answer": (
                    f"Observed: the {subject} {effect} after the {trigger}. "
                    "Not established: that sequence proves cause. "
                    f"Alternative: an independent timer or hidden mechanism. "
                    f"Test: repeat with the {trigger} disabled and compare the outcome."
                ),
                "task": "causal-inquiry",
            },
            {
                "prompt": f"A note says the {subject} never changes. A new direct reading says it {effect}. Which claim wins?",
                "answer": (
                    f"The note and the new reading conflict about the {subject}. "
                    "Preserve both records, identify how each was measured and when. "
                    "If the new observation is reliable, correct the earlier claim and retain its supersession link."
                ),
                "task": "contradiction-routing",
            },
            {
                "prompt": f"I feel certain the {subject} understands what the {trigger} means. Prove it.",
                "answer": (
                    f"That is an interpretation, not an observation about the {subject}. "
                    "The current evidence cannot establish understanding or intention. "
                    "Find an observable prediction that differs between understanding and a mechanical response."
                ),
                "task": "inference-boundary",
            },
        ])
    return rows

def split():
    train, heldout = make_rows(TRAIN_SCENES), make_rows(HELDOUT_SCENES)
    train_scenes = {x[0] for x in TRAIN_SCENES}
    hold_scenes = {x[0] for x in HELDOUT_SCENES}
    assert not train_scenes.intersection(hold_scenes)
    assert not {(x["prompt"],x["answer"]) for x in train}.intersection(
        {(x["prompt"],x["answer"]) for x in heldout})
    return train, heldout

def manifest():
    train, heldout=split()
    return {
        "status":"SYNTHETIC_RESEARCH_NO_PRIVATE_DATA",
        "authoring":"original fictional equipment scenes authored for this LYR experiment",
        "train_examples":len(train),
        "heldout_examples":len(heldout),
        "heldout_policy":"disjoint fictional scene nouns; shared task types; not a real conversation benchmark",
        "train_sha256":hashlib.sha256(json.dumps(train,sort_keys=True).encode()).hexdigest(),
        "heldout_sha256":hashlib.sha256(json.dumps(heldout,sort_keys=True).encode()).hexdigest(),
        "training_license":"original project synthetic examples",
        "base_license":"SmolLM2-135M-Instruct Apache-2.0, separately attributed"
    }
if __name__=="__main__":
    print(json.dumps(manifest(),indent=2))
