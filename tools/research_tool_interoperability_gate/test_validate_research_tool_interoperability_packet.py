#!/usr/bin/env python3
"""Regression tests for the Research Tool Interoperability Gate.

Run from repository root:
python tools/research_tool_interoperability_gate/test_validate_research_tool_interoperability_packet.py
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from typing import Any, Dict

TOOL_DIR = Path(__file__).resolve().parent
MODULE_PATH = TOOL_DIR / "validate_research_tool_interoperability_packet.py"
spec = importlib.util.spec_from_file_location("validate_research_tool_interoperability_packet", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def load_fixture(name: str) -> Dict[str, Any]:
    return json.loads((TOOL_DIR / "fixtures" / name).read_text(encoding="utf-8"))


def test_valid_packet_passes() -> None:
    result = module.validate_packet(load_fixture("valid_packet.json"))
    assert result["valid"] is True
    assert result["errors"] == []


def test_invalid_packet_fails() -> None:
    result = module.validate_packet(load_fixture("invalid_packet.json"))
    assert result["valid"] is False
    assert "privacy_status_blocks_promotion" in result["errors"]
    assert "missingness_must_be_explicit" in result["errors"]
    assert "toolchain_components_requires_at_least_two_tools" in result["errors"]
    assert "provenance_log_required" in result["errors"]
    assert "blocked_inferences_required" in result["errors"]
    assert "execution_environment_dependencies_must_be_list" in result["errors"]


def test_requires_two_toolchain_components() -> None:
    packet = load_fixture("valid_packet.json")
    packet["toolchain_components"] = packet["toolchain_components"][:1]
    result = module.validate_packet(packet)
    assert result["valid"] is False
    assert "toolchain_components_requires_at_least_two_tools" in result["errors"]


def test_blocks_unknown_privacy() -> None:
    packet = load_fixture("valid_packet.json")
    packet["privacy_status"] = "unknown"
    result = module.validate_packet(packet)
    assert result["valid"] is False
    assert "privacy_status_blocks_promotion" in result["errors"]


def test_requires_data_boundary_identifiability_enum() -> None:
    packet = load_fixture("valid_packet.json")
    packet["data_boundary"]["identifiability"] = "partially-known"
    result = module.validate_packet(packet)
    assert result["valid"] is False
    assert "data_boundary_identifiability_invalid" in result["errors"]


def run_all() -> None:
    test_valid_packet_passes()
    test_invalid_packet_fails()
    test_requires_two_toolchain_components()
    test_blocks_unknown_privacy()
    test_requires_data_boundary_identifiability_enum()


if __name__ == "__main__":
    run_all()
    print("research_tool_interoperability_gate tests passed")
