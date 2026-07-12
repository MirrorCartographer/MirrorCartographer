function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function estimateClockAlignment({ anchors, detectorResolutionMs = 0 } = {}) {
  if (!Array.isArray(anchors) || anchors.length < 2) {
    throw new RangeError("anchors must contain at least two synchronization observations");
  }
  assertFinite(detectorResolutionMs, "detectorResolutionMs");
  if (detectorResolutionMs < 0) throw new RangeError("detectorResolutionMs must be non-negative");

  const normalized = anchors.map((anchor, index) => {
    assertFinite(anchor.browserMs, `anchors[${index}].browserMs`);
    assertFinite(anchor.detectorMs, `anchors[${index}].detectorMs`);
    return { browserMs: anchor.browserMs, detectorMs: anchor.detectorMs };
  }).sort((a, b) => a.detectorMs - b.detectorMs);

  const slopes = [];
  for (let left = 0; left < normalized.length - 1; left += 1) {
    for (let right = left + 1; right < normalized.length; right += 1) {
      const detectorDelta = normalized[right].detectorMs - normalized[left].detectorMs;
      if (detectorDelta === 0) continue;
      slopes.push((normalized[right].browserMs - normalized[left].browserMs) / detectorDelta);
    }
  }
  if (!slopes.length) throw new RangeError("anchors must include at least two distinct detector times");

  const scale = median(slopes);
  if (!(scale > 0)) throw new RangeError("estimated clock scale must be positive");
  const offsetMs = median(normalized.map((anchor) => anchor.browserMs - scale * anchor.detectorMs));
  const residualsMs = normalized.map((anchor) => Math.abs(anchor.browserMs - (scale * anchor.detectorMs + offsetMs)));
  const maxResidualMs = Math.max(...residualsMs);
  const medianResidualMs = median(residualsMs);
  const uncertaintyMs = maxResidualMs + detectorResolutionMs / 2;

  return {
    schemaVersion: "1.0.0",
    method: "median-pairwise-affine",
    anchorCount: normalized.length,
    scale,
    offsetMs,
    maxResidualMs,
    medianResidualMs,
    detectorResolutionMs,
    uncertaintyMs,
    claimLimit: "This maps detector timestamps into the browser performance timeline; it does not prove acoustic emission or perception.",
  };
}

export function detectorToBrowserTime(detectorMs, alignment) {
  assertFinite(detectorMs, "detectorMs");
  if (!alignment || !Number.isFinite(alignment.scale) || !Number.isFinite(alignment.offsetMs)) {
    throw new TypeError("valid alignment is required");
  }
  return alignment.scale * detectorMs + alignment.offsetMs;
}

export function alignDetections({ detections, alignment } = {}) {
  if (!Array.isArray(detections)) throw new TypeError("detections must be an array");
  return detections.map((detection, index) => {
    assertFinite(detection.timeMs, `detections[${index}].timeMs`);
    return {
      ...detection,
      detectorTimeMs: detection.timeMs,
      timeMs: detectorToBrowserTime(detection.timeMs, alignment),
      alignmentUncertaintyMs: alignment.uncertaintyMs,
    };
  });
}

export function evaluateAlignmentQuality(alignment, {
  maximumResidualMs = 35,
  maximumScaleErrorPpm = 2500,
} = {}) {
  if (!alignment) throw new TypeError("alignment is required");
  assertFinite(maximumResidualMs, "maximumResidualMs");
  assertFinite(maximumScaleErrorPpm, "maximumScaleErrorPpm");
  const scaleErrorPpm = Math.abs(alignment.scale - 1) * 1_000_000;
  const accepted = alignment.maxResidualMs <= maximumResidualMs
    && scaleErrorPpm <= maximumScaleErrorPpm;
  return {
    accepted,
    scaleErrorPpm,
    maxResidualMs: alignment.maxResidualMs,
    uncertaintyMs: alignment.uncertaintyMs,
    claimState: accepted ? "clock-alignment-calibrated" : "clock-alignment-unproven",
    falsificationRoute: "Reject synchronized attribution when fresh anchors exceed residual or drift thresholds, then repeat with tighter detector resolution and anchors bracketing the challenge.",
  };
}
