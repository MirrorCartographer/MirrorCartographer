"""Regression tests for malformed self-map and limitation packets.

All values are synthetic. Run with:
    python -m unittest discover -s tools/self_model_mapper/tests -v
"""
import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import validate_self_map as validator  # noqa: E402


def load_fixture(name):
    return json.loads((ROOT / "examples" / name).read_text(encoding="utf-8"))


class ValidateSelfMapTests(unittest.TestCase):
    def setUp(self):
        self.packet = load_fixture("valid_self_map.json")

    def test_valid_self_map_fixture(self):
        self.assertEqual(validator.validate(self.packet, "self_map"), [])

    def test_valid_limitation_fixture(self):
        self.assertEqual(validator.validate(load_fixture("platform_limit.json"), "limitation"), [])

    def test_non_object_top_level_is_rejected(self):
        self.assertTrue(validator.validate([], "self_map"))

    def test_unknown_kind_is_rejected(self):
        self.assertIn("kind must be 'self_map' or 'limitation'", validator.validate({}, "other")[0])

    def test_privacy_list_returns_error_not_exception(self):
        packet = copy.deepcopy(self.packet)
        packet["privacy"] = []
        self.assertTrue(validator.validate(packet, "self_map"))

    def test_status_list_returns_error_not_exception(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["status"] = []
        self.assertTrue(validator.validate(packet, "self_map"))

    def test_nested_domain_list_returns_error_not_exception(self):
        packet = copy.deepcopy(self.packet)
        packet["domains"] = [["state"]]
        self.assertTrue(validator.validate(packet, "self_map"))

    def test_category_list_returns_error_not_exception(self):
        packet = load_fixture("platform_limit.json")
        packet["category"] = []
        self.assertTrue(validator.validate(packet, "limitation"))

    def test_boolean_confidence_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = True
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_oversized_integer_confidence_is_rejected_without_crash(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = 10 ** 10000
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_nan_confidence_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = float("nan")
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_infinite_confidence_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = float("inf")
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_string_confidence_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = "0.5"
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_confidence_above_one_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["confidence"] = 1.01
        self.assertTrue(any("confidence" in e for e in validator.validate(packet, "self_map")))

    def test_missing_provenance_is_rejected(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["source"] = ""
        self.assertTrue(any("provenance" in e for e in validator.validate(packet, "self_map")))

    def test_credential_marker_is_flagged(self):
        packet = copy.deepcopy(self.packet)
        packet["claims"][0]["text"] = "Synthetic example includes an api_key marker"
        self.assertTrue(any("credential" in e for e in validator.validate(packet, "self_map")))


if __name__ == "__main__":
    unittest.main()
