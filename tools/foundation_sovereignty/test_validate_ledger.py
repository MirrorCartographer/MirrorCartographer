from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from validate_ledger import validate

ROOT = Path(__file__).resolve().parent
EXAMPLE = ROOT / "examples" / "0001-synthetic-platform-receipt.json"


class SovereigntyLedgerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.receipt = json.loads(EXAMPLE.read_text())

    def test_accepts_valid_receipt(self) -> None:
        self.assertEqual(validate(self.receipt), [])

    def test_rejects_false_physical_ownership(self) -> None:
        item = copy.deepcopy(self.receipt)
        item["ownership_boundary"]["not_claimed"] = []
        self.assertIn("physical-boundary", validate(item))

    def test_rejects_missing_exit_path(self) -> None:
        item = copy.deepcopy(self.receipt)
        item["exit_paths"] = []
        self.assertIn("exit-path", validate(item))

    def test_rejects_receipt_tampering(self) -> None:
        item = copy.deepcopy(self.receipt)
        item["remaining_risks"].append("new undeclared risk")
        self.assertIn("receipt-digest-mismatch", validate(item))

    def test_requires_exactly_two_public_views(self) -> None:
        item = copy.deepcopy(self.receipt)
        item["continuity"]["public_views_added"] = ["only one"]
        self.assertIn("exactly-two-public-views", validate(item))


if __name__ == "__main__":
    unittest.main()
