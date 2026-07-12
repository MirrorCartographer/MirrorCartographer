function canonicalHttpUrl(value) {
  if (typeof value !== 'string' || value.length === 0) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    url.hash = '';
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) url.port = '';
    if (url.pathname === '/') url.pathname = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function validateVerifierProofBinding(proof) {
  const deploymentUrl = canonicalHttpUrl(proof?.deployment_url);
  const rows = Array.isArray(proof?.verifier_output) ? proof.verifier_output : [];
  const successfulRows = rows.filter((row) => row?.ok === true);
  const boundRows = successfulRows.filter((row) => {
    const verifiedUrl = canonicalHttpUrl(row?.resolvedUrl ?? row?.candidate);
    return deploymentUrl !== null && verifiedUrl === deploymentUrl;
  });
  const errors = [];
  if (deploymentUrl === null) errors.push('deployment-url-invalid');
  if (successfulRows.length === 0) errors.push('successful-verifier-row-required');
  if (successfulRows.length > 0 && boundRows.length === 0) errors.push('successful-verifier-row-not-bound-to-deployment-url');
  return {
    valid: errors.length === 0,
    deployment_url: deploymentUrl,
    successful_rows: successfulRows.length,
    bound_rows: boundRows.length,
    verified_urls: boundRows.map((row) => canonicalHttpUrl(row?.resolvedUrl ?? row?.candidate)),
    errors
  };
}
