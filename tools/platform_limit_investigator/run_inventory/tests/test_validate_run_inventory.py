from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from validate_run_inventory import compare_inventory


class RunInventoryTests(unittest.TestCase):
    def test_detects_run_omitted_by_connector_inventory(self):
        payload = {
            "full_api_runs": [{"id": 101}, {"id": 102}, {"id": 103}],
            "connector_runs": [{"id": 101}, {"id": 102}],
        }
        missing, all_ids = compare_inventory(payload)
        self.assertEqual(missing, ["103"])
        self.assertEqual(all_ids, ["101", "102", "103"])

    def test_complete_inventory_has_no_missing_ids(self):
        payload = {"full_api_runs": [{"id": 101}, {"id": 102}], "connector_runs": [{"id": 102}, {"id": 101}]}
        missing, _ = compare_inventory(payload)
        self.assertEqual(missing, [])

    def test_rejects_connector_id_absent_from_full_inventory(self):
        payload = {"full_api_runs": [{"id": 101}], "connector_runs": [{"id": 999}]}
        with self.assertRaisesRegex(ValueError, "absent from full API"):
            compare_inventory(payload)

    def test_rejects_duplicate_full_api_ids(self):
        payload = {"full_api_runs": [{"id": 101}, {"id": 101}], "connector_runs": [{"id": 101}]}
        with self.assertRaisesRegex(ValueError, "duplicate run id"):
            compare_inventory(payload)

    def test_rejects_duplicate_connector_ids(self):
        payload = {"full_api_runs": [{"id": 101}], "connector_runs": [{"id": 101}, {"id": 101}]}
        with self.assertRaisesRegex(ValueError, "duplicate run id"):
            compare_inventory(payload)

    def test_rejects_boolean_run_id(self):
        payload = {"full_api_runs": [{"id": True}], "connector_runs": []}
        with self.assertRaisesRegex(ValueError, "not Boolean"):
            compare_inventory(payload)

    def test_rejects_missing_inventory_field(self):
        with self.assertRaisesRegex(ValueError, "must contain"):
            compare_inventory({"full_api_runs": []})

    def test_rejects_non_object_record(self):
        payload = {"full_api_runs": [101], "connector_runs": []}
        with self.assertRaisesRegex(ValueError, "must be an object"):
            compare_inventory(payload)


if __name__ == "__main__":
    unittest.main()
