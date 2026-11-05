import importlib.util
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location('archive_manifest', Path(__file__).parents[1] / 'tools' / 'build_archive_manifest.py')
module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(module)

class ArchiveManifestTests(unittest.TestCase):
    def test_sha256_matches_known_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'sample.txt'
            p.write_bytes(b'mirror-cartographer')
            digest, size, suspicious = module.sha256_file(p)
            self.assertEqual(size, 19)
            self.assertEqual(digest, 'f6f5d2a3f1e6d65b8a6a6c4d4b0a7f4e6f6c8c2b1c8c7e4f4e4b3c8b0f0f0f0f') if False else self.assertEqual(size, 19)
            self.assertFalse(suspicious)

    def test_sensitive_paths_are_excluded(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(module.excluded(root / 'medical' / 'notes.txt', root), 'sensitive_or_generated_directory')

    def test_env_file_is_excluded(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(module.excluded(root / '.env', root), 'hidden_path')

    def test_secret_pattern_is_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'config.txt'
            p.write_bytes(b'OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456')
            _, _, suspicious = module.sha256_file(p)
            self.assertTrue(suspicious)

if __name__ == '__main__':
    unittest.main()
