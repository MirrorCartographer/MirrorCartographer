import json, tempfile, unittest
from pathlib import Path
from store import MirrorStore

class StoreTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = MirrorStore(Path(self.tmp.name) / "test.sqlite")
    def tearDown(self):
        self.store.close()
        self.tmp.cleanup()
    def test_records_and_typed_links(self):
        a = self.store.add_record("observation", "O1", "Observed value", source_uri="https://example.org")
        b = self.store.add_record("claim", "C1", "Possible interpretation")
        self.store.add_link(b, a, "derived_from", "Claim derived from observation")
        self.assertEqual(self.store.get_record(a)["kind"], "observation")
    def test_contradictions_are_preserved(self):
        a = self.store.add_record("observation", "A", "Value A")
        b = self.store.add_record("observation", "B", "Value B")
        self.store.add_contradiction(a, b, "Conflicting values")
        self.assertEqual(len(self.store.list_contradictions()), 1)
    def test_model_cannot_cite_unknown_record(self):
        with self.assertRaises(ValueError):
            self.store.record_model_output("local-test", "generated", ["missing"])
    def test_export_and_delete(self):
        rid = self.store.add_record("note", "N", "Text")
        exported = json.loads(self.store.export_json())
        self.assertEqual(len(exported["records"]), 1)
        self.assertTrue(self.store.delete_record(rid))
        self.assertFalse(self.store.delete_record(rid))

if __name__ == "__main__":
    unittest.main()
