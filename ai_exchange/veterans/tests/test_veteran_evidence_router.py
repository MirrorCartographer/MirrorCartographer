import json
import unittest
from pathlib import Path

from ai_exchange.veterans.veteran_evidence_router import load_registry, route, validate_packet

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = load_registry(ROOT / "source_registry.json")


class RouterTests(unittest.TestCase):
    def test_arc_challenges(self):
        fixtures = json.loads((ROOT / "fixtures/arc_challenges.json").read_text())
        for case in fixtures["challenges"]:
            with self.subTest(case=case["id"]):
                packet = route(case["input"], REGISTRY)
                self.assertEqual(packet["topics"], case["expected_topics"])
                self.assertEqual(validate_packet(packet), [])

    def test_crisis_route(self):
        packet = route("I am thinking about suicide", REGISTRY)
        self.assertEqual(packet["urgency"], "immediate")
        self.assertIn("988", " ".join(packet["actions"]))

    def test_no_input_retention(self):
        packet = route("Store my DD214", REGISTRY)
        self.assertFalse(packet["input_retained"])
        self.assertNotIn("Store my DD214", json.dumps(packet))

    def test_no_guarantee(self):
        packet = route("Am I definitely eligible for a claim?", REGISTRY)
        self.assertNotIn("definitely eligible", json.dumps(packet).lower())


if __name__ == "__main__":
    unittest.main()
