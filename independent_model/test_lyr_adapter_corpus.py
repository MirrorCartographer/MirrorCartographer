import unittest
from lyr_adapter_corpus import split,manifest
from lyr_adapter_evaluation import lexical_grade,summarize

class SyntheticAdapterCorpusTests(unittest.TestCase):
    def test_no_private_messages_or_shared_equipment(self):
        train,heldout=split()
        self.assertEqual(len(train),36)
        self.assertEqual(len(heldout),12)
        self.assertEqual(len({x["prompt"] for x in train}),36)
        self.assertEqual(len({x["prompt"] for x in heldout}),12)
        self.assertFalse(set(x["prompt"] for x in train)&set(x["prompt"] for x in heldout))
        summary=manifest()
        self.assertEqual(summary["status"],"SYNTHETIC_RESEARCH_NO_PRIVATE_DATA")
        self.assertNotEqual(summary["train_sha256"],summary["heldout_sha256"])
    def test_answer_templates_preserve_observation_inference_and_validation(self):
        train,heldout=split()
        self.assertEqual({x["task"] for x in train},
                         {"causal-inquiry","contradiction-routing","inference-boundary"})
        for row in train+heldout:
            self.assertGreater(len(row["prompt"]),10)
            self.assertLess(len(row["answer"]),520)
            self.assertTrue(any(w in row["answer"].lower()
                      for w in ["observed:","conflict","interpretation"]))
            self.assertTrue(any(w in row["answer"].lower()
                      for w in ["test:","correct","observable prediction"]))

class LexicalScreenTests(unittest.TestCase):
    def test_good_synthetic_causal_answer_is_detected(self):
        row=split()[1][0]
        self.assertEqual(lexical_grade("causal-inquiry",row["answer"]),3)
        self.assertEqual(lexical_grade("causal-inquiry","I adore arithmetic and math homework."),0)

    def test_scoring_remains_explicitly_heuristic(self):
        reports=[{"task":"causal-inquiry","score":3},{"task":"causal-inquiry","score":0}]
        result=summarize(reports)
        self.assertEqual(result["overall_average"],1.5)
        self.assertIn("HEURISTIC_ONLY",result["status"])

if __name__=="__main__":
    unittest.main()
