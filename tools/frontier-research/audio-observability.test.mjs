import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyAudioProgress,
  interpretObservation,
  observeAudioStart,
  readAudioSnapshot,
} from "./audio-observability.mjs";

function snapshot(overrides = {}) {
  return {
    observedAtPerformanceMs: 0,
    state: "running",
    currentTime: 1,
    sampleRate: 48000,
    baseLatency: 0.01,
    outputLatency: null,
    outputTimestamp: null,
    capabilities: {
      getOutputTimestamp: false,
      outputLatency: true,
      renderCapacity: false,
      sinkId: false,
      contextErrorEvent: false,
    },
    ...overrides,
  };
}

test("render-position advance is the strongest browser-visible evidence", () => {
  const before = snapshot({
    currentTime: 10,
    outputTimestamp: { contextTime: 9.8, performanceTime: 1000 },
  });
  const after = snapshot({
    currentTime: 10.2,
    outputTimestamp: { contextTime: 10.0, performanceTime: 1200 },
  });

  const result = classifyAudioProgress(before, after);
  assert.equal(result.status, "render-confirmed");
  assert.equal(result.rendered, true);
  assert.equal(result.evidenceStrength, "render-position");
  assert.ok(result.outputAdvanceSeconds >= 0.19);
});

test("running state without clock progress is not treated as proof", () => {
  const result = classifyAudioProgress(
    snapshot({ currentTime: 4 }),
    snapshot({ currentTime: 4 }),
  );

  assert.equal(result.status, "running-without-observed-progress");
  assert.equal(result.rendered, false);
  assert.match(interpretObservation(result), /no rendering advance/i);
});

test("currentTime fallback is explicitly weaker than render position", () => {
  const result = classifyAudioProgress(
    snapshot({ currentTime: 2 }),
    snapshot({ currentTime: 2.2 }),
  );

  assert.equal(result.status, "clock-progress-only");
  assert.equal(result.evidenceStrength, "control-clock");
});

test("suspended contexts are classified as activation blocked or suspended", () => {
  const result = classifyAudioProgress(
    snapshot({ state: "suspended", currentTime: 0 }),
    snapshot({ state: "suspended", currentTime: 0 }),
  );

  assert.equal(result.status, "activation-blocked-or-suspended");
  assert.equal(result.rendered, false);
});

test("snapshot feature-detects draft and cross-browser diagnostics", () => {
  const context = {
    state: "running",
    currentTime: 1,
    sampleRate: 44100,
    baseLatency: 0.02,
    outputLatency: 0.04,
    sinkId: "",
    onerror: null,
    renderCapacity: {},
    getOutputTimestamp() {
      return { contextTime: 0.9, performanceTime: 1234 };
    },
  };

  const result = readAudioSnapshot(context, { performanceNow: 1300 });
  assert.deepEqual(result.capabilities, {
    getOutputTimestamp: true,
    outputLatency: true,
    renderCapacity: true,
    sinkId: true,
    contextErrorEvent: true,
  });
  assert.equal(result.outputTimestamp.contextTime, 0.9);
});

test("observeAudioStart preserves resume failures as evidence", async () => {
  const context = {
    state: "suspended",
    currentTime: 0,
    sampleRate: 48000,
    async resume() {
      throw new Error("NotAllowedError");
    },
  };

  const result = await observeAudioStart(context, {
    delayMs: 0,
    sleep: async () => {},
    performanceNow: 1,
  });

  assert.equal(result.resumeError, "NotAllowedError");
  assert.equal(result.status, "activation-blocked-or-suspended");
  assert.match(result.interpretation, /direct user activation/i);
});
