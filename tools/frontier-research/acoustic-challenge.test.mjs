import assert from "node:assert/strict";
import test from "node:test";
import { createAcousticChallenge, scoreAcousticChallenge } from "./acoustic-challenge.mjs";

const challenge = createAcousticChallenge({
  entropyBytes: [0, 1, 2, 3, 0, 1, 9, 8],
});

test("creates a deterministic non-repeating time-frequency challenge", () => {
  assert.equal(challenge.challengeId, "0001020300010908");
  assert.equal(challenge.pulses.length, 6);
  for (let index = 1; index < challenge.pulses.length; index += 1) {
    assert.notEqual(challenge.pulses[index].frequencyHz, challenge.pulses[index - 1].frequencyHz);
  }
  assert.deepEqual(challenge.pulses.map((pulse) => pulse.startMs), [80, 380, 680, 980, 1280, 1580]);
});

test("accepts a correlated meter sequence", () => {
  const detections = challenge.pulses.map((pulse) => ({
    timeMs: (pulse.startMs + pulse.endMs) / 2 + 12,
    frequencyHz: pulse.frequencyHz * 1.004,
    snrDb: 14,
  }));
  const result = scoreAcousticChallenge({ challenge, detections });
  assert.equal(result.accepted, true);
  assert.equal(result.claimState, "acoustic-sequence-correlated");
  assert.equal(result.matchRatio, 1);
});

test("rejects unrelated or weak device detections", () => {
  const detections = challenge.pulses.map((pulse) => ({
    timeMs: (pulse.startMs + pulse.endMs) / 2,
    frequencyHz: 440,
    snrDb: 3,
  }));
  const result = scoreAcousticChallenge({ challenge, detections });
  assert.equal(result.accepted, false);
  assert.equal(result.claimState, "attribution-unproven");
  assert.equal(result.matchedCount, 0);
});

test("requires a new challenge to preserve falsifiability", () => {
  const second = createAcousticChallenge({ entropyBytes: [3, 2, 1, 0, 3, 2] });
  assert.notEqual(second.challengeId, challenge.challengeId);
  assert.notDeepEqual(
    second.pulses.map((pulse) => pulse.frequencyHz),
    challenge.pulses.map((pulse) => pulse.frequencyHz),
  );
});
