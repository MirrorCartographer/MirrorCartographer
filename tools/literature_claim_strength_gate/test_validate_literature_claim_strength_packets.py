#!/usr/bin/env python3
from pathlib import Path
import importlib.util

MODULE_PATH = Path(__file__).with_name("validate_literature_claim_strength_packets.py")
spec = importlib.util.spec_from_file_location("validator", MODULE_PATH)
validator = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(validator)


def test_fixture_expectations():
    fixtures = validator.load_json(Path(__file__).with_name("fixtures.synthetic.json"))
    for fixture in fixtures:
        ok, errors = validator.validate_packet(fixture["packet"])
        assert ok is fixture["should_pass"], f"{fixture['name']} errors={errors}"


def test_single_source_is_rejected():
    packet = validator.load_json(Path(__file__).with_name("fixtures.synthetic.json"))[0]["packet"]
    packet = dict(packet)
    packet["evidence_items"] = packet["evidence_items"][:1]
    ok, errors = validator.validate_packet(packet)
    assert not ok
    assert any("two evidence" in error for error in errors)


def test_private_packets_cannot_promote():
    packet = validator.load_json(Path(__file__).with_name("fixtures.synthetic.json"))[0]["packet"]
    packet = dict(packet)
    packet["privacy_status"] = "private_rejected"
    ok, errors = validator.validate_packet(packet)
    assert not ok
    assert any("private_rejected" in error for error in errors)


if __name__ == "__main__":
    test_fixture_expectations()
    test_single_source_is_rejected()
    test_private_packets_cannot_promote()
    print("all literature claim strength gate tests passed")
