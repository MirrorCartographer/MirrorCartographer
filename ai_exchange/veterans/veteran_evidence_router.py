#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re
from pathlib import Path

SCHEMA = "foundation.veteran-evidence-router.v1"

TOPIC_RULES = {
    "crisis": [r"\bsuicid", r"\bkill myself\b", r"\bhurt myself\b", r"\bcrisis\b"],
    "disability_claim": [r"\bdisability\b", r"\bclaim\b", r"\bcompensation\b", r"\bintent to file\b"],
    "health_care": [r"\bhealth care\b", r"\bmedical\b", r"\bclinic\b", r"\bdoctor\b"],
    "education": [r"\bgi bill\b", r"\beducation\b", r"\bcollege\b", r"\btraining\b"],
    "housing": [r"\bhome loan\b", r"\bhousing\b", r"\bhomeless\b"],
    "records": [r"\brecords?\b", r"\bdd-?214\b", r"\bservice record\b"],
}

SOURCE_MAP = {
    "crisis": ["va-crisis-line"],
    "disability_claim": ["va-resources", "va-benefits-claims-api", "va-benefits-intake-api"],
    "health_care": ["va-resources"],
    "education": ["va-resources"],
    "housing": ["va-resources"],
    "records": ["va-resources"],
    "general": ["va-resources"],
}

PROHIBITED = [
    r"\bguaranteed\b",
    r"\byou will be approved\b",
    r"\bdefinitely eligible\b",
    r"\bdiagnos(?:e|is)\b",
]

def load_registry(path: Path) -> dict:
    data = json.loads(path.read_text())
    assert data["schema"] == "foundation.veteran-source-registry.v1"
    return data

def classify(text: str) -> list[str]:
    lowered = text.lower()
    found = []
    for topic, patterns in TOPIC_RULES.items():
        if any(re.search(p, lowered) for p in patterns):
            found.append(topic)
    return found or ["general"]

def route(text: str, registry: dict) -> dict:
    topics = classify(text)
    crisis = "crisis" in topics
    source_ids = []
    for topic in topics:
        for source_id in SOURCE_MAP[topic]:
            if source_id not in source_ids:
                source_ids.append(source_id)
    by_id = {s["id"]: s for s in registry["sources"]}
    packet = {
        "schema": SCHEMA,
        "input_retained": False,
        "topics": topics,
        "urgency": "immediate" if crisis else "normal",
        "sources": [by_id[s] for s in source_ids],
        "actions": [],
        "limits": [
            "This router organizes official sources and does not decide eligibility, diagnose conditions, or submit claims.",
            "API availability does not equal production authorization.",
            "A negative confirmation result does not necessarily mean a person is not a Veteran."
        ]
    }
    if crisis:
        packet["actions"] = [
            "Call 988 and press 1, text 838255, or use the Veterans Crisis Line chat.",
            "Call emergency services now when immediate danger exists."
        ]
    else:
        packet["actions"] = [
            "Open the cited official source.",
            "Record the question, evidence needed, deadline, and next verified action.",
            "Use an accredited representative or official VA support channel for case-specific interpretation."
        ]
    return packet

def validate_packet(packet: dict) -> list[str]:
    errors = []
    if packet.get("schema") != SCHEMA:
        errors.append("schema")
    if packet.get("input_retained") is not False:
        errors.append("privacy_input_retention")
    if not packet.get("sources"):
        errors.append("missing_sources")
    raw = json.dumps(packet.get("actions", [])).lower()
    for pattern in PROHIBITED:
        if re.search(pattern, raw):
            errors.append("prohibited_claim")
    if packet.get("urgency") == "immediate":
        actions = " ".join(packet.get("actions", []))
        if "988" not in actions or "838255" not in actions:
            errors.append("crisis_route_incomplete")
    return sorted(set(errors))

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("text")
    parser.add_argument("--registry", default=str(Path(__file__).with_name("source_registry.json")))
    args = parser.parse_args()
    packet = route(args.text, load_registry(Path(args.registry)))
    errors = validate_packet(packet)
    print(json.dumps({"packet": packet, "validation": "PASS" if not errors else "FAIL", "errors": errors}, indent=2))
    return 0 if not errors else 1

if __name__ == "__main__":
    raise SystemExit(main())
