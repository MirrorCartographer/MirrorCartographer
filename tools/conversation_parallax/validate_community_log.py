#!/usr/bin/env python3
"""Validate public-safe Conversation Parallax community receipts."""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

DIGEST = re.compile(r"^sha256:[0-9a-f]{64}$")
MODES = {"conversational", "semantic"}
CLASSIFICATIONS = {"public-safe-synthetic", "public-safe-abstracted", "private-only"}


def canonical_digest(value: object) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return "sha256:" + hashlib.sha256(encoded).hexdigest()


def require(condition: bool, message: str, failures: list[str]) -> None:
    if not condition:
        failures.append(message)


def validate(receipt: dict) -> list[str]:
    failures: list[str] = []

    require(receipt.get("schema") == "foundation.conversation-parallax-run.v1", "schema", failures)
    require(isinstance(receipt.get("run_generation"), int), "run_generation", failures)
    require(bool(receipt.get("run_id")), "run_id", failures)
    require(bool(DIGEST.match(receipt.get("corpus_digest", ""))), "corpus_digest", failures)

    parent = receipt.get("parent_community_digest")
    require(parent is None or bool(DIGEST.match(parent)), "parent_community_digest", failures)

    readers = receipt.get("readers", [])
    require(isinstance(readers, list) and len(readers) == 2, "exactly_two_readers", failures)
    if len(readers) == 2:
        modes = {reader.get("mode") for reader in readers}
        require(modes == MODES, "distinct_reader_modes", failures)
        require(readers[0].get("reader_id") != readers[1].get("reader_id"), "distinct_reader_ids", failures)
        require(readers[0].get("background") != readers[1].get("background"), "distinct_backgrounds", failures)
        for index, reader in enumerate(readers):
            require(bool(reader.get("thesis")), f"reader_{index}_thesis", failures)
            require(isinstance(reader.get("observations"), list), f"reader_{index}_observations", failures)
            require(isinstance(reader.get("uncertainties"), list), f"reader_{index}_uncertainties", failures)
            background = reader.get("background", {})
            for field in ("discipline", "experience", "attention_bias", "counter_bias"):
                require(bool(background.get(field)), f"reader_{index}_background_{field}", failures)

    dialogue = receipt.get("dialogue", {})
    for field in ("agreements", "disagreements", "omissions_detected", "revisions_after_discussion"):
        require(isinstance(dialogue.get(field), list), f"dialogue_{field}", failures)

    community = receipt.get("community_update", {})
    require(isinstance(community.get("prior_views_consulted"), int), "prior_views_consulted", failures)
    require(isinstance(community.get("notes_added"), list), "notes_added", failures)
    require(isinstance(community.get("notes_challenged"), list), "notes_challenged", failures)
    require(bool(DIGEST.match(community.get("community_digest", ""))), "community_digest", failures)

    privacy = receipt.get("privacy", {})
    require(privacy.get("raw_transcript_published") is False, "raw_transcript_published", failures)
    require(privacy.get("classification") in CLASSIFICATIONS, "privacy_classification", failures)
    require(bool(privacy.get("review")), "privacy_review", failures)

    supplied_receipt_digest = receipt.get("receipt_digest", "")
    require(bool(DIGEST.match(supplied_receipt_digest)), "receipt_digest_format", failures)
    without_digest = dict(receipt)
    without_digest.pop("receipt_digest", None)
    require(supplied_receipt_digest == canonical_digest(without_digest), "receipt_digest_mismatch", failures)

    return failures


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: validate_community_log.py RECEIPT.json", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    receipt = json.loads(path.read_text(encoding="utf-8"))
    failures = validate(receipt)
    if failures:
        print("REJECT")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("ACCEPT")
    print(f"run={receipt['run_id']}")
    print(f"generation={receipt['run_generation']}")
    print(f"community={receipt['community_update']['community_digest']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
