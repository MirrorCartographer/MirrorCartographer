import json, unittest
from provenance_adapter import export_records

class AdapterTests(unittest.TestCase):
    def test_export_uses_existing_record_profile_and_keeps_uncertainty(self):
        audit = {"proposal": {
            "id":"p1","title":"Pilot","intervention":"Test an information aid",
            "created_at":"2026-11-04T00:00:00Z",
            "consequences":[{"id":"c1","description":"Potential downstream effect","status":"OPEN"}],
            "contradictions":[{"id":"x1","left_ref":"a","right_ref":"b","description":"Conflicting sources"}],
            "decisions":[{"decision":"MODIFY","rationale":"Need more baseline","timestamp":"2026-11-04T01:00:00Z"}]
        }}
        records = export_records(audit)
        self.assertEqual([r["type"] for r in records], ["hypothesis","hypothesis","contradiction","decision"])
        self.assertTrue(all(r["source"] and r["authorship"] == "unverified" for r in records))
        self.assertIn("not established", records[0]["uncertainty"])
        self.assertEqual(records[2]["status"], "disputed")

if __name__ == "__main__":
    unittest.main()
