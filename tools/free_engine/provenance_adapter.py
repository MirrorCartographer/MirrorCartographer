"""Export FREE 2.0 audit JSON into Repository C's provenance-record profile.

This emits JSONL to stdout or an explicitly selected file. It does not write to
Repository C's private memory automatically. Review before importing.
"""
import argparse, json
from pathlib import Path
from datetime import datetime, timezone

SOURCE = ["architecture/FREE_2_SPEC.md", "tools/free_engine/free_engine.py"]
ALLOWED_TYPES = {"observation", "interpretation", "hypothesis", "decision", "verified_result", "contradiction"}

def export_records(audit: dict) -> list[dict]:
    p = audit["proposal"]
    now = datetime.now(timezone.utc).isoformat()
    records = []
    proposal_id = "free-proposal-" + p["id"]
    records.append({
        "id": proposal_id, "type": "hypothesis", "status": "hypothesis",
        "origin": "repository-record", "authorship": "unverified",
        "source": SOURCE, "created_at": p.get("created_at", now),
        "confidence": None,
        "uncertainty": "Proposal is a structured intervention hypothesis; its predicted effects are not established outcomes.",
        "text": p["title"] + ": " + p["intervention"],
        "supports": [], "contradicts": [], "supersedes": [], "derives_from": [],
        "tags": ["free-2.0", "proposal"], "related_artifacts": SOURCE
    })
    for c in p.get("consequences", []):
        records.append({
            "id": "free-consequence-" + c["id"], "type": "hypothesis",
            "status": "hypothesis", "origin": "repository-record",
            "authorship": "unverified", "source": SOURCE,
            "created_at": now, "confidence": None,
            "uncertainty": "Consequence record is open; its observed/predicted status and supporting evidence require human review.",
            "text": c["description"], "supports": [], "contradicts": [],
            "supersedes": [], "derives_from": [proposal_id],
            "tags": ["free-2.0", "consequence", c.get("status", "OPEN").lower()],
            "related_artifacts": SOURCE
        })
    for c in p.get("contradictions", []):
        records.append({
            "id": "free-contradiction-" + c["id"], "type": "contradiction",
            "status": "disputed", "origin": "repository-record",
            "authorship": "unverified", "source": SOURCE,
            "created_at": now, "confidence": None,
            "uncertainty": "Contradiction is preserved as unresolved unless a documented review changes its status.",
            "text": c["description"] + " [left=" + c["left_ref"] + "; right=" + c["right_ref"] + "]",
            "supports": [], "contradicts": [], "supersedes": [],
            "derives_from": [proposal_id], "tags": ["free-2.0", "contradiction"],
            "related_artifacts": SOURCE
        })
    for index, d in enumerate(p.get("decisions", []), start=1):
        records.append({
            "id": "free-decision-" + p["id"] + "-" + str(index),
            "type": "decision", "status": "implemented-unverified",
            "origin": "repository-record", "authorship": "unverified",
            "source": SOURCE, "created_at": d.get("timestamp", now),
            "confidence": None,
            "uncertainty": "This is a record that a reviewer made a decision, not proof that the decision was implemented or produced its intended outcome.",
            "text": d["decision"] + ": " + d.get("rationale", ""),
            "supports": [], "contradicts": [], "supersedes": [],
            "derives_from": [proposal_id], "tags": ["free-2.0", "human-decision"],
            "related_artifacts": SOURCE
        })
    for r in records:
        if r["type"] not in ALLOWED_TYPES:
            raise ValueError("Unsupported provenance type: " + r["type"])
    return records

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="FREE 2.0 audit JSON")
    ap.add_argument("--out", help="Optional output JSONL path; default stdout")
    args = ap.parse_args()
    audit = json.loads(Path(args.input).read_text(encoding="utf-8"))
    payload = "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in export_records(audit))
    if args.out:
        Path(args.out).write_text(payload, encoding="utf-8")
    else:
        print(payload, end="")

if __name__ == "__main__":
    main()
