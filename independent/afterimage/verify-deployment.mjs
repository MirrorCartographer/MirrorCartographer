import { createHash } from 'node:crypto';

const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function fail(reason) {
  return { ok: false, reason };
}

export function verifyAfterimageDeployment({ manifestText, entrypointText, receipt, servedHtml }) {
  let manifest;
  try { manifest = JSON.parse(manifestText); } catch { return fail('manifest_invalid_json'); }
  if (manifest?.site_id !== 'afterimage' || manifest?.root !== 'independent/afterimage') return fail('manifest_identity_mismatch');
  if (manifest?.verification?.receipt_schema !== 'afterimage-deployment-receipt/1') return fail('receipt_schema_not_declared');
  if (!receipt || receipt.schema !== manifest.verification.receipt_schema) return fail('receipt_schema_mismatch');
  if (!COMMIT.test(receipt.source_commit ?? '')) return fail('source_commit_invalid');
  let url;
  try { url = new URL(receipt.deployment_url); } catch { return fail('deployment_url_invalid'); }
  if (url.protocol !== 'https:') return fail('deployment_url_not_https');
  if (!Number.isFinite(Date.parse(receipt.deployed_at))) return fail('deployed_at_invalid');
  if (!SHA256.test(receipt.entrypoint_sha256 ?? '') || receipt.entrypoint_sha256 !== sha256(entrypointText)) return fail('entrypoint_digest_mismatch');
  if (!SHA256.test(receipt.manifest_sha256 ?? '') || receipt.manifest_sha256 !== sha256(manifestText)) return fail('manifest_digest_mismatch');
  if (typeof servedHtml !== 'string' || servedHtml.length === 0) return fail('served_html_missing');
  for (const marker of manifest.verification.required_markers ?? []) {
    if (!servedHtml.includes(marker)) return fail(`served_marker_missing:${marker}`);
  }
  if (sha256(servedHtml) !== receipt.entrypoint_sha256) return fail('served_bytes_do_not_match_entrypoint');
  return {
    ok: true,
    site_id: manifest.site_id,
    source_commit: receipt.source_commit,
    deployment_url: url.href,
    entrypoint_sha256: receipt.entrypoint_sha256,
    manifest_sha256: receipt.manifest_sha256
  };
}
