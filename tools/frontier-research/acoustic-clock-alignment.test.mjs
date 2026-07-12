import test from "node:test";
import assert from "node:assert/strict";
import {
  alignDetections,
  detectorToBrowserTime,
  estimateClockAlignment,
  evaluateAlignmentQuality,
} from "./acoustic-clock-alignment.mjs";

test("recovers offset and small detector drift from bracketing anchors", () => {
  const alignment = estimateClockAlignment({
    anchors: [
      { detectorMs: 1000, browserMs: 1102 },
      { detectorMs: 3000, browserMs: 3104 },
      { detectorMs: 5000, browserMs: 5106 },
    ],
    detectorResolutionMs: 10,
  });
  assert.equal(alignment.scale, 1.001);
  assert.ok(Math.abs(alignment.offsetMs - 101) < 1e-9);
  assert.ok(alignment.maxResidualMs < 1e-9);
  assert.ok(Math.abs(alignment.uncertaintyMs - 5) < 1e-9);
  assert.equal(detectorToBrowserTime(4000, alignment), 4105);
});

test("robust median estimator limits one noisy anchor", () => {
  const alignment = estimateClockAlignment({
    anchors: [
      { detectorMs: 0, browserMs: 50 },
      { detectorMs: 1000, browserMs: 1050 },
      { detectorMs: 2000, browserMs: 2050 },
      { detectorMs: 3000, browserMs: 3080 },
    ],
  });
  assert.ok(Math.abs(alignment.scale - 1.005) < 1e-9);
  assert.ok(alignment.maxResidualMs >= 15);
});

test("aligns detector observations while retaining original timestamps and uncertainty", () => {
  const alignment = estimateClockAlignment({
    anchors: [
      { detectorMs: 0, browserMs: 100 },
      { detectorMs: 1000, browserMs: 1100 },
    ],
    detectorResolutionMs: 20,
  });
  const [aligned] = alignDetections({
    detections: [{ timeMs: 250, frequencyHz: 659.25, snrDb: 9 }],
    alignment,
  });
  assert.equal(aligned.detectorTimeMs, 250);
  assert.equal(aligned.timeMs, 350);
  assert.equal(aligned.alignmentUncertaintyMs, 10);
});

test("quality gate rejects implausible drift or excessive residual", () => {
  const good = evaluateAlignmentQuality({ scale: 1.001, maxResidualMs: 8, uncertaintyMs: 13 });
  const drifted = evaluateAlignmentQuality({ scale: 1.01, maxResidualMs: 8, uncertaintyMs: 13 });
  const noisy = evaluateAlignmentQuality({ scale: 1, maxResidualMs: 50, uncertaintyMs: 55 });
  assert.equal(good.accepted, true);
  assert.equal(good.claimState, "clock-alignment-calibrated");
  assert.equal(drifted.accepted, false);
  assert.equal(noisy.accepted, false);
});
