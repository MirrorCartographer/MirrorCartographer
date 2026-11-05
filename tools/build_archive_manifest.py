#!/usr/bin/env python3
"""Build a privacy-conscious SHA-256 inventory for a staged historical archive.

Usage:
  python tools/build_archive_manifest.py /path/to/staged_archive --out evidence/archive_manifest.json

Default-deny policy: hidden files, credentials, personal/medical/veterinary material,
raw conversation exports, browser profiles, and common secret files are excluded.
Review the generated manifest before publishing it. This tool hashes files; it does
not certify their origin, creation date, authorship, or completeness.
"""
from __future__ import annotations
import argparse, hashlib, json, os, re
from datetime import datetime, timezone
from pathlib import Path

DENY_NAMES = {'.env', '.env.local', '.env.production', 'credentials.json',
              'secrets.json', 'token.json', 'id_rsa', 'id_ed25519',
              'cookies.txt', 'login data', 'web data', 'chatgpt log.rtf',
              'conversations.json', 'messages.json', 'account.json'}
DENY_PARTS = {'.git', 'node_modules', '.venv', '__pycache__',
              'medical', 'health', 'veterinary', 'vet_records',
              'personal', 'private', 'raw_conversations',
              'conversation_exports', 'browser_profiles'}
DENY_EXT = {'.pem', '.key', '.p12', '.pfx', '.sqlite', '.db',
            '.heic', '.dcm', '.dicom', '.rtf', '.jsonl'}
SECRET_PATTERNS = [
    re.compile(rb'(?i)sk-[A-Za-z0-9_-]{20,}'),
    re.compile(rb'(?i)gh[pousr]_[A-Za-z0-9]{20,}'),
    re.compile(rb'(?i)-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'),
]

def excluded(path: Path, root: Path) -> str | None:
    rel = path.relative_to(root)
    parts = {p.lower() for p in rel.parts}
    if any(p.startswith('.') for p in rel.parts): return 'hidden_path'
    if parts & DENY_PARTS: return 'sensitive_or_generated_directory'
    if path.name.lower() in DENY_NAMES: return 'secret_filename'
    if any(token in path.name.lower() for token in ('conversation', 'chatgpt log', 'pasted text', 'health log')):
        return 'raw_or_personal_archive_name'
    if path.suffix.lower() in DENY_EXT: return 'sensitive_file_type'
    if any(token in path.name.lower() for token in
           ('medical', 'health', 'symptom', 'veterinary', 'vet_record', 'lab_result', 'patient',
            'bugsy', 'omalley', 'financial', 'bank_statement', 'tax_record', 'disability')):
        return 'sensitive_filename'
    return None

def sha256_file(path: Path) -> tuple[str, int, bool]:
    h = hashlib.sha256(); size = 0; suspicious = False
    with path.open('rb') as f:
        while True:
            block = f.read(1024 * 1024)
            if not block: break
            size += len(block); h.update(block)
            if not suspicious and any(p.search(block) for p in SECRET_PATTERNS): suspicious = True
    return h.hexdigest(), size, suspicious

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('root', type=Path)
    ap.add_argument('--out', type=Path, default=Path('archive_manifest.json'))
    ap.add_argument('--include-suspicious', action='store_true',
                    help='include files matching secret patterns (not recommended)')
    args = ap.parse_args()
    root = args.root.resolve()
    if not root.is_dir(): ap.error('root must be a directory')
    entries=[]; excluded_counts={}; suspicious_count=0
    for base, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if not d.startswith('.') and d.lower() not in DENY_PARTS)
        for name in sorted(files):
            p=Path(base)/name; reason=excluded(p, root)
            if reason:
                excluded_counts[reason]=excluded_counts.get(reason,0)+1; continue
            digest,size,suspicious=sha256_file(p)
            if suspicious and not args.include_suspicious:
                suspicious_count += 1; excluded_counts['secret_pattern_match']=excluded_counts.get('secret_pattern_match',0)+1; continue
            stat=p.stat()
            entries.append({'path':p.relative_to(root).as_posix(), 'size_bytes':size,
                            'sha256':digest, 'mtime_utc':datetime.fromtimestamp(stat.st_mtime,timezone.utc).isoformat(),
                            'mtime_is_filesystem_metadata_not_authorship_proof':True})
    result={'schema_version':'1.0','generated_utc':datetime.now(timezone.utc).isoformat(),
            'root_label':root.name,'file_count':len(entries),
            'excluded_counts':excluded_counts,'entries':entries,
            'limitations':['Filesystem modification times can be copied or altered.',
                           'A hash proves byte identity only, not origin, authorship, or creation time.',
                           'Review every candidate file for privacy before publishing this manifest.']}
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({'manifest':str(args.out),'included':len(entries),
                      'excluded':excluded_counts,'suspicious_files_skipped':suspicious_count},indent=2))
    return 0
if __name__ == '__main__': raise SystemExit(main())
