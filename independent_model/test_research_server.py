"""End-to-end local endpoint tests with trained research tensors, no real network."""
import os
import tempfile
import unittest
from pathlib import Path
from fastapi.testclient import TestClient
from train_research_demo import train_demo
import serve_research

class LocalModelServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        train_demo(cls.tmp.name, steps=4)
        os.environ["LYR_MODEL_CHECKPOINT"] = str(Path(cls.tmp.name) / "lyr-demo.pt")
        os.environ["LYR_ACCESS_TOKEN"] = "test-local-only-token-123456789012345"
        os.environ["LYR_ENABLE_UNVALIDATED_RESEARCH"] = "1"
        cls.client = TestClient(serve_research.app)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()
        for key in ("LYR_MODEL_CHECKPOINT", "LYR_ACCESS_TOKEN", "LYR_ENABLE_UNVALIDATED_RESEARCH"):
            os.environ.pop(key, None)

    def test_health_discloses_failed_quality_gate(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "research-only")

    def test_unauthed_model_requests_are_rejected(self):
        response = self.client.post("/v1/chat/completions", json={
            "model":"lyr-research-demo","messages":[{"role":"user","content":"What is observed?"}]
        })
        self.assertEqual(response.status_code, 401)

    def test_authenticated_request_reaches_real_trained_weights(self):
        response = self.client.post("/v1/chat/completions",
            headers={"authorization":"Bearer test-local-only-token-123456789012345"},
            json={"model":"lyr-research-demo",
                  "messages":[{"role":"user","content":"What is observed?"}],
                  "max_tokens":12})
        self.assertEqual(response.status_code, 200)
        output = response.json()
        self.assertEqual(output["model"], "lyr-research-demo")
        self.assertTrue(output["research_only"])
        self.assertEqual(output["quality_gate"], "FAIL_GENERAL_DIALOGUE_NOT_EVALUATED")
        self.assertIsInstance(output["choices"][0]["message"]["content"], str)

if __name__=="__main__":
    unittest.main()
