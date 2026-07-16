import { verifyGitHubOidcJwt } from './github-oidc-jwt-verifier.mjs';
import { evaluateGitHubOidcRunBinding } from './github-oidc-run-binding.mjs';

export function verifyAndAuthorizeGitHubOidcRun({ token, discovery, jwks, policy, nowSeconds }) {
  const signature = verifyGitHubOidcJwt({ token, discovery, jwks });
  if (!signature.accepted) {
    return Object.freeze({
      accepted: false,
      stage: 'signature',
      reasons: Object.freeze([signature.reason]),
      signature,
      authorization: null,
      claims: null
    });
  }

  const authorization = evaluateGitHubOidcRunBinding(signature.claims, policy, nowSeconds);
  if (!authorization.accepted) {
    return Object.freeze({
      accepted: false,
      stage: 'authorization',
      reasons: authorization.reasons,
      signature,
      authorization,
      claims: null
    });
  }

  return Object.freeze({
    accepted: true,
    stage: 'accepted',
    reasons: Object.freeze([]),
    signature,
    authorization,
    claims: signature.claims
  });
}
