const FORBIDDEN_KEYS = new Set([
  "raw_chat", "raw_text", "transcript", "transcript_text", "message_body",
  "conversation_text", "private_url", "account_id", "email", "phone",
  "excerpt", "verbatim", "attachment_content"
]);
const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^sha256:[a-f0-9]{64}$/;
const ID = /^MC-TRACE-[A-Z0-9-]{6,64}$/;
const SOURCE = /^privsrc_[A-Za-z0-9_-]{12,96}$/;\nconst ALLOWED_KEYS = new Set([\n  "schema_version","trace_id","repository","artifact_path","commit_sha","parent_sha",\n  "line_ranges","source_ref","source_digest","source_kind","relationship",\n  "transformation","claim_refs","decision_refs","privacy_scope",\n  "raw_content_included","completeness","review_status","notes_code"\n]);

function validateGitHubSourceTrace(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return { valid: false, errors: ["record must be an object"] };
  }
  function scan(value, path = "$") {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) errors.push(`${path}.${key}: forbidden private-content field`);
      scan(child, `${path}.${key}`);
    }
  }
  scan(record);
  const required = ["schema_version","trace_id","repository","artifact_path","commit_sha","line_ranges","source_ref","source_digest","source_kind","relationship","transformation","claim_refs","decision_refs","privacy_scope","raw_content_included","completeness"];
  for (const key of required) if (!(key in record)) errors.push(`missing required field: ${key}`);
  if (record.schema_version !== "1.0.0") errors.push("schema_version must be 1.0.0");
  if (typeof record.trace_id !== "string" || !ID.test(record.trace_id)) errors.push("trace_id is invalid");
  if (typeof record.repository !== "string" || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(record.repository)) errors.push("repository must be owner/name");
  if (typeof record.artifact_path !== "string" || !record.artifact_path || record.artifact_path.startsWith("/") || record.artifact_path.split("/").includes("..")) errors.push("artifact_path must be a safe repository-relative path");
  if (typeof record.commit_sha !== "string" || !SHA.test(record.commit_sha)) errors.push("commit_sha must be a full 40-character SHA");
  if (record.parent_sha != null && (typeof record.parent_sha !== "string" || !SHA.test(record.parent_sha))) errors.push("parent_sha must be null or a full SHA");
  if (!Array.isArray(record.line_ranges)) errors.push("line_ranges must be an array");
  else record.line_ranges.forEach((r,i) => {
    if (!r || !Number.isInteger(r.start) || !Number.isInteger(r.end) || r.start < 1 || r.end < r.start) errors.push(`line_ranges[${i}] is invalid`);
  });
  if (typeof record.source_ref !== "string" || !SOURCE.test(record.source_ref)) errors.push("source_ref must be an opaque private reference");
  if (typeof record.source_digest !== "string" || !DIGEST.test(record.source_digest)) errors.push("source_digest must be a SHA-256 digest");
  if (!["conversation_message","conversation_span","user_instruction","file","observation","external_source"].includes(record.source_kind)) errors.push("source_kind is invalid");
  if (!["direct","derived","contextual"].includes(record.relationship)) errors.push("relationship is invalid");
  if (typeof record.transformation !== "string" || !record.transformation.trim() || record.transformation.length > 240) errors.push("transformation must be a concise non-empty description");
  for (const key of ["claim_refs","decision_refs"]) {
    if (!Array.isArray(record[key]) || record[key].some(x => typeof x !== "string")) errors.push(`${key} must be an array of identifiers`);
  }
  if (record.privacy_scope !== "private_source_public_metadata_only") errors.push("privacy_scope must keep source private");
  if (record.raw_content_included !== false) errors.push("raw_content_included must be false");
  if (!["linked","artifact_linked","partial","unavailable","redacted","disputed"].includes(record.completeness)) errors.push("completeness is invalid");
  if (record.review_status != null && !["unreviewed","source_verified","implementation_verified","independently_reviewed"].includes(record.review_status)) errors.push("review_status is invalid");
  return { valid: errors.length === 0, errors };
}

export { validateGitHubSourceTrace };
