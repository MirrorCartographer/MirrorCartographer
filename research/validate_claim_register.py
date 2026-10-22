#!/usr/bin/env python3
"""Validate the public research register's internal references using only Python's standard library."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
register = json.loads((ROOT / "claim-register.json").read_text(encoding="utf-8"))
schema = json.loads((ROOT / "claim-record.schema.json").read_text(encoding="utf-8"))

assert register["schema_version"] == "1.0.0"
sources = register["source_records"]
claims = register["claims"]
source_ids = [item["id"] for item in sources]
claim_ids = [item["id"] for item in claims]
assert len(source_ids) == len(set(source_ids)), "duplicate source ID"
assert len(claim_ids) == len(set(claim_ids)), "duplicate claim ID"
known_sources = set(source_ids)
known_claims = set(claim_ids)
for source in sources:
    assert source["url"].startswith(("https://", "http://")), f"invalid URL: {source['id']}"
    assert source.get("title") and source.get("source_type") and source.get("limitations"), source["id"]
    for claim_id in source.get("supports", []):
        assert claim_id in known_claims, f"source {source['id']} points to missing claim {claim_id}"
for claim in claims:
    required = ("id", "proposition", "claim_type", "status", "source_ids", "confidence_rationale", "not_established", "next_test")
    for field in required:
        assert field in claim, f"{claim.get('id', 'unknown')} missing {field}"
    assert claim["id"].startswith("CL-")
    assert claim["status"] in register["status_vocabulary"], f"unknown status: {claim['id']}"
    assert all(source_id in known_sources for source_id in claim["source_ids"]), f"unknown source in {claim['id']}"
    assert claim["not_established"], f"no boundary statement: {claim['id']}"
    assert claim["next_test"], f"no next test: {claim['id']}"
print(f"PASS: {len(claims)} claims, {len(sources)} sources; all internal references resolve.")
print("LIMIT: URL reachability, source interpretation, and scientific validity require separate review.")
