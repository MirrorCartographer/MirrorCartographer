import { normalizeBidiServerFrames } from './bidi-wire-transcript.mjs';
import { validateVerificationTranscript } from './browser-verification-transcript.mjs';

export function verifyBidiEvidenceFrames(frames, expectations) {
  const wire = normalizeBidiServerFrames(frames);
  if (!wire.accepted) {
    return {
      accepted: false,
      schema: 'mc.webdriver-bidi-evidence-pipeline.v1',
      stage: 'wire',
      reason: wire.reason,
      protocolError: wire.protocolError ?? null,
      claim: 'browser-evidence-rejected-before-semantic-validation',
      limits: ['rejection-does-not-identify-browser-root-cause']
    };
  }

  const semantic = validateVerificationTranscript(wire.transcript, expectations);
  if (!semantic.accepted) {
    return {
      accepted: false,
      schema: 'mc.webdriver-bidi-evidence-pipeline.v1',
      stage: 'semantic',
      reason: semantic.reason,
      wireFrameCount: wire.frameCount,
      claim: 'normalized-browser-evidence-failed-verification-contract',
      limits: [...wire.limits, 'semantic-rejection-does-not-prove-deployment-failure']
    };
  }

  return {
    accepted: true,
    schema: 'mc.webdriver-bidi-evidence-pipeline.v1',
    wireSchema: wire.schema,
    semanticSchema: 'mc.webdriver-bidi-verification.v2',
    wireFrameCount: wire.frameCount,
    verification: semantic,
    claim: 'raw-server-frames-normalized-and-semantic-browser-verification-accepted',
    limits: [...new Set([...wire.limits, ...semantic.limits])]
  };
}
