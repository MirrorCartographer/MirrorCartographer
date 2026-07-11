#!/usr/bin/env python3
"""Durable peer-trigger queue utility for the five automation teams.

This tool cannot itself invoke ChatGPT automations. It creates auditable trigger
requests that scheduled teams must consume. Direct automation invocation remains
an external runtime capability.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

QUEUE_PATH = Path(__file__).with_name("TRIGGER_REQUESTS.json")
TEAMS = {
    "vercel_studio",
    "cloudflare_research",
    "independent_creative_web",
    "continuity_mining",
    "frontier_research",
}


def load_queue() -> dict[str, Any]:
    if not QUEUE_PATH.exists():
        return {"version": 1, "requests": []}
    return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))


def save_queue(queue: dict[str, Any]) -> None:
    QUEUE_PATH.write_text(json.dumps(queue, indent=2) + "\n", encoding="utf-8")


def enqueue(source: str, target: str, reason: str, dependency: str, evidence: str) -> dict[str, Any]:
    if source not in TEAMS or target not in TEAMS:
        raise ValueError(f"source and target must be one of: {', '.join(sorted(TEAMS))}")
    if source == target:
        raise ValueError("source and target must differ")

    queue = load_queue()
    request = {
        "id": f"trigger-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source_team": source,
        "target_team": target,
        "reason": reason,
        "dependency": dependency,
        "evidence": evidence,
        "status": "pending",
        "consumed_at": None,
        "consumer_note": None,
    }
    queue.setdefault("requests", []).append(request)
    save_queue(queue)
    return request


def consume(request_id: str, note: str) -> dict[str, Any]:
    queue = load_queue()
    for request in queue.get("requests", []):
        if request.get("id") == request_id:
            if request.get("status") != "pending":
                raise ValueError("request is not pending")
            request["status"] = "consumed"
            request["consumed_at"] = datetime.now(timezone.utc).isoformat()
            request["consumer_note"] = note
            save_queue(queue)
            return request
    raise ValueError("request not found")


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage durable automation trigger requests")
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("enqueue")
    add.add_argument("--source", required=True, choices=sorted(TEAMS))
    add.add_argument("--target", required=True, choices=sorted(TEAMS))
    add.add_argument("--reason", required=True)
    add.add_argument("--dependency", default="none")
    add.add_argument("--evidence", default="none")

    done = sub.add_parser("consume")
    done.add_argument("--id", required=True)
    done.add_argument("--note", required=True)

    args = parser.parse_args()
    if args.command == "enqueue":
        result = enqueue(args.source, args.target, args.reason, args.dependency, args.evidence)
    else:
        result = consume(args.id, args.note)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
