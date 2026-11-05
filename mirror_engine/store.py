"""Local-first provenance store for Mirror Engine (stdlib SQLite).

This stores explicit project records only. It is not encrypted at rest and must
not be used for sensitive personal data until a reviewed encryption/access layer
is implemented.
"""
from __future__ import annotations
import sqlite3, json, uuid
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS records (
 id TEXT PRIMARY KEY, kind TEXT NOT NULL, title TEXT NOT NULL,
 content TEXT NOT NULL, source_uri TEXT, source_type TEXT,
 observed_at TEXT, recorded_at TEXT NOT NULL, author TEXT,
 status TEXT NOT NULL DEFAULT 'unreviewed', confidence REAL,
 evidence_quality TEXT, limitations TEXT, metadata_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS links (
 id TEXT PRIMARY KEY, from_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
 to_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
 relation TEXT NOT NULL, rationale TEXT, status TEXT NOT NULL DEFAULT 'proposed',
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS contradictions (
 id TEXT PRIMARY KEY, left_record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
 right_record_id TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
 description TEXT NOT NULL, resolution_status TEXT NOT NULL DEFAULT 'unresolved',
 resolution_note TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS model_outputs (
 id TEXT PRIMARY KEY, model_id TEXT NOT NULL, prompt_record_id TEXT REFERENCES records(id),
 output_text TEXT NOT NULL, cited_record_ids_json TEXT NOT NULL,
 generated_at TEXT NOT NULL, review_status TEXT NOT NULL DEFAULT 'unreviewed'
);
"""

class MirrorStore:
    def __init__(self, path: str | Path = "mirror-memory.sqlite3"):
        self.path = str(path)
        self.db = sqlite3.connect(self.path)
        self.db.row_factory = sqlite3.Row
        self.db.executescript(SCHEMA)
        self.db.commit()

    @staticmethod
    def now():
        return datetime.now(timezone.utc).isoformat()

    def add_record(self, kind: str, title: str, content: str, **fields) -> str:
        allowed = {"source_uri", "source_type", "observed_at", "author", "status",
                   "confidence", "evidence_quality", "limitations", "metadata"}
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError("Unknown fields: " + ", ".join(sorted(unknown)))
        rid = str(uuid.uuid4())
        values = {k: fields.get(k) for k in allowed}
        self.db.execute("""INSERT INTO records
          (id,kind,title,content,source_uri,source_type,observed_at,recorded_at,
           author,status,confidence,evidence_quality,limitations,metadata_json)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
          (rid, kind, title, content, values["source_uri"], values["source_type"],
           values["observed_at"], self.now(), values["author"],
           values["status"] or "unreviewed", values["confidence"],
           values["evidence_quality"], values["limitations"],
           json.dumps(values["metadata"] or {}, ensure_ascii=False)))
        self.db.commit()
        return rid

    def get_record(self, record_id: str):
        row = self.db.execute("SELECT * FROM records WHERE id=?", (record_id,)).fetchone()
        return dict(row) if row else None

    def add_link(self, from_id: str, to_id: str, relation: str, rationale: str = "") -> str:
        if relation not in {"supports", "challenges", "derived_from", "contradicts",
                            "co_occurs_with", "analogous_to", "influences",
                            "depends_on", "observed_through"}:
            raise ValueError("Relationship must use a controlled relation type")
        lid = str(uuid.uuid4())
        self.db.execute("INSERT INTO links VALUES (?,?,?,?,?,?,?)",
                        (lid, from_id, to_id, relation, rationale, "proposed", self.now()))
        self.db.commit()
        return lid

    def add_contradiction(self, left_id: str, right_id: str, description: str) -> str:
        if left_id == right_id:
            raise ValueError("A contradiction must link two distinct records")
        cid = str(uuid.uuid4())
        self.db.execute("INSERT INTO contradictions VALUES (?,?,?,?,?,?,?)",
                        (cid, left_id, right_id, description, "unresolved", None, self.now()))
        self.db.commit()
        return cid

    def list_contradictions(self, status: str | None = None):
        if status:
            rows = self.db.execute("SELECT * FROM contradictions WHERE resolution_status=? ORDER BY created_at", (status,))
        else:
            rows = self.db.execute("SELECT * FROM contradictions ORDER BY created_at")
        return [dict(r) for r in rows]

    def record_model_output(self, model_id: str, output_text: str,
                            cited_record_ids: list[str], prompt_record_id: str | None = None) -> str:
        # Every cited record must exist; model text cannot cite itself as a source.
        for rid in cited_record_ids:
            if not self.get_record(rid):
                raise ValueError(f"Unknown evidence record: {rid}")
        oid = str(uuid.uuid4())
        self.db.execute("INSERT INTO model_outputs VALUES (?,?,?,?,?,?,?)",
          (oid, model_id, prompt_record_id, output_text,
           json.dumps(cited_record_ids), self.now(), "unreviewed"))
        self.db.commit()
        return oid

    def delete_record(self, record_id: str) -> bool:
        cur = self.db.execute("DELETE FROM records WHERE id=?", (record_id,))
        self.db.commit()
        return cur.rowcount > 0

    def export_json(self) -> str:
        result = {}
        for table in ("records", "links", "contradictions", "model_outputs"):
            result[table] = [dict(r) for r in self.db.execute(f"SELECT * FROM {table}")]
        return json.dumps(result, indent=2, ensure_ascii=False)

    def close(self):
        self.db.close()
