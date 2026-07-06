"""
Object storage connector contract.

Use this for large assets:
- mp4
- wav
- png sequences
- PDFs
- rendered frames
- datasets

Provider targets:
- Google Drive
- Dropbox
- S3-compatible bucket
- GitHub Releases
"""

class ObjectStorageConnector:
    def upload_file(self, local_path: str, remote_name: str) -> str:
        raise NotImplementedError("Upload and return stable external URI.")

    def verify_file(self, external_uri: str) -> bool:
        raise NotImplementedError("Return True if asset exists.")
