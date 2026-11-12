#!/usr/bin/env python3
"""Validate the Mirror Cartographer engine registry without external dependencies."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "architecture" / "engine-registry.v1.json"
ALLOWED_STATUS = {
    "source_and_release_evidence",
    "implemented_deployment_unverified",
    "implemented_unverified",
    "implemented_local",
    "implemented_local_prototype",
    "implemented_tested_narrow_scope",
    "implemented_synthetic_only",
    "code_only_integration_incomplete",
    "implemented_local_research_prototype",
    "planned_not_implemented",
}
ALLOWED_ADAPTER_STATES = {
    "implemented", "client_and_server_source", "implemented_no_service_adapter",
    "implemented_no_network_service", "implemented_preview_first_handoff",
    "partial", "local_tests_documented", "not_implemented"
}

def main() -> int:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    assert data.get("schema") == "mc.engine-registry.v1", "wrong registry schema"
    assert data.get("version"), "missing registry version"
    engines = data.get("engines")
    assert isinstance(engines, list) and engines, "engines must be a non-empty list"
    ids = [item.get("id") for item in engines]
    assert all(isinstance(item, str) and item for item in ids), "every engine needs an id"
    assert len(ids) == len(set(ids)), "engine ids must be unique"
    known = set(ids)
    for engine in engines:
        for key in ("name", "repository", "role", "capabilities", "status", "adapter", "dependencies", "evidence", "limits"):
            assert key in engine, f"{engine['id']}: missing {key}"
        assert engine["status"] in ALLOWED_STATUS, f"{engine['id']}: unknown status"
        assert engine["adapter"].get("state") in ALLOWED_ADAPTER_STATES, f"{engine['id']}: unknown adapter state"
        assert isinstance(engine["capabilities"], list) and engine["capabilities"], f"{engine['id']}: no capabilities"
        assert isinstance(engine["limits"], list), f"{engine['id']}: limits must be explicit"
        missing = set(engine["dependencies"]) - known
        assert not missing, f"{engine['id']}: unknown dependencies {sorted(missing)}"
    contract = data.get("contract", {})
    assert contract.get("request_schema") == "mc.engine-request.v1"
    assert contract.get("result_schema") == "mc.engine-result.v1"
    print(f"VALID: {len(engines)} engines, {len(ids)} unique IDs, all dependencies resolve.")
    print("NOTE: registry validity does not prove runtime connectivity or deployment health.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
