"""No external model service, private data, or network required."""
import os
import tempfile
import unittest
from pathlib import Path
import torch
from synthetic_demo import write_corpus, TRAIN_SENTENCES, HELD_OUT_SENTENCES
from train_research_demo import train_demo
from model import ModelConfig, LYRLanguageModel, ByteTokenizer

class ResearchTrainingTests(unittest.TestCase):
    def test_no_sentence_overlap(self):
        self.assertFalse(set(TRAIN_SENTENCES) & set(HELD_OUT_SENTENCES))

    def test_manifest_uses_disjoint_original_text(self):
        with tempfile.TemporaryDirectory() as work:
            manifest = write_corpus(work)
            self.assertEqual(manifest["status"], "SYNTHETIC_DEMONSTRATION_ONLY")
            self.assertNotEqual(manifest["splits"]["train"]["sha256"], manifest["splits"]["heldout"]["sha256"])

    def test_checkpoint_reload_and_explicit_quality_failure(self):
        with tempfile.TemporaryDirectory() as work:
            report = train_demo(work, steps=4)
            self.assertEqual(report["quality_gate"], "FAIL_GENERAL_DIALOGUE_NOT_EVALUATED")
            state = torch.load(Path(work) / "lyr-demo.pt", map_location="cpu", weights_only=True)
            self.assertEqual(state["status"], "RESEARCH_ONLY")
            model = LYRLanguageModel(ModelConfig(**state["config"]))
            model.load_state_dict(state["state_dict"])
            x = torch.tensor([[ByteTokenizer.BOS, 65, 66, 67]])
            y,_ = model(x)
            self.assertEqual(y.shape[-1], ByteTokenizer.vocab_size)

if __name__ == "__main__":
    unittest.main()
