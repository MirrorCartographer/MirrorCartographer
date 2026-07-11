const DEFAULT_MIN_ADVANCE_SECONDS = 0.001;

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function readAudioSnapshot(context, options = {}) {
  if (!context || typeof context !== "object") {
    throw new TypeError("An AudioContext-like object is required");
  }

  const now = finiteNumber(options.performanceNow)
    ? options.performanceNow
    : typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();

  let outputTimestamp = null;
  if (typeof context.getOutputTimestamp === "function") {
    try {
      const value = context.getOutputTimestamp();
      if (value && finiteNumber(value.contextTime) && finiteNumber(value.performanceTime)) {
        outputTimestamp = {
          contextTime: value.contextTime,
          performanceTime: value.performanceTime,
        };
      }
    } catch {
      outputTimestamp = null;
    }
  }

  return {
    observedAtPerformanceMs: now,
    state: typeof context.state === "string" ? context.state : "unknown",
    currentTime: finiteNumber(context.currentTime) ? context.currentTime : null,
    sampleRate: finiteNumber(context.sampleRate) ? context.sampleRate : null,
    baseLatency: finiteNumber(context.baseLatency) ? context.baseLatency : null,
    outputLatency: finiteNumber(context.outputLatency) ? context.outputLatency : null,
    outputTimestamp,
    capabilities: {
      getOutputTimestamp: typeof context.getOutputTimestamp === "function",
      outputLatency: "outputLatency" in context,
      renderCapacity: Boolean(context.renderCapacity),
      sinkId: "sinkId" in context,
      contextErrorEvent: "onerror" in context,
    },
  };
}

export function classifyAudioProgress(before, after, options = {}) {
  if (!before || !after) {
    throw new TypeError("Before and after snapshots are required");
  }

  const minimumAdvance = finiteNumber(options.minimumAdvanceSeconds)
    ? Math.max(0, options.minimumAdvanceSeconds)
    : DEFAULT_MIN_ADVANCE_SECONDS;

  const contextAdvance = finiteNumber(before.currentTime) && finiteNumber(after.currentTime)
    ? after.currentTime - before.currentTime
    : null;

  const outputBefore = before.outputTimestamp?.contextTime;
  const outputAfter = after.outputTimestamp?.contextTime;
  const outputAdvance = finiteNumber(outputBefore) && finiteNumber(outputAfter)
    ? outputAfter - outputBefore
    : null;

  const rendered = (outputAdvance !== null && outputAdvance >= minimumAdvance)
    || (outputAdvance === null && contextAdvance !== null && contextAdvance >= minimumAdvance);

  let status;
  if (after.state === "closed") {
    status = "closed";
  } else if (after.state !== "running") {
    status = "activation-blocked-or-suspended";
  } else if (rendered) {
    status = outputAdvance !== null ? "render-confirmed" : "clock-progress-only";
  } else {
    status = "running-without-observed-progress";
  }

  return {
    status,
    rendered,
    contextAdvanceSeconds: contextAdvance,
    outputAdvanceSeconds: outputAdvance,
    evidenceStrength: outputAdvance !== null
      ? "render-position"
      : contextAdvance !== null
        ? "control-clock"
        : "state-only",
    latency: {
      baseSeconds: after.baseLatency,
      outputSeconds: after.outputLatency,
      known: finiteNumber(after.baseLatency) || finiteNumber(after.outputLatency),
    },
    capabilities: after.capabilities,
  };
}

export async function observeAudioStart(context, options = {}) {
  const delayMs = finiteNumber(options.delayMs) ? Math.max(0, options.delayMs) : 120;
  const sleep = typeof options.sleep === "function"
    ? options.sleep
    : (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const before = readAudioSnapshot(context, options);
  let resumeError = null;

  if (context.state !== "running" && typeof context.resume === "function") {
    try {
      await context.resume();
    } catch (error) {
      resumeError = error instanceof Error ? error.message : String(error);
    }
  }

  await sleep(delayMs);
  const after = readAudioSnapshot(context, options);
  const progress = classifyAudioProgress(before, after, options);

  return {
    ...progress,
    resumeError,
    before,
    after,
    interpretation: interpretObservation(progress, resumeError),
  };
}

export function interpretObservation(progress, resumeError = null) {
  if (resumeError) {
    return "AudioContext.resume() failed; preserve the error and retry only inside a direct user activation.";
  }

  switch (progress.status) {
    case "activation-blocked-or-suspended":
      return "The context is not running. Start or resume it synchronously from the user's pointer or touch gesture.";
    case "running-without-observed-progress":
      return "The control state says running, but no rendering advance was observed. Inspect graph connection, gain, destination routing, and device interruption.";
    case "clock-progress-only":
      return "The context clock advanced, but this browser does not expose render-position evidence. Treat audibility as unproven until a device-level meter or user report confirms it.";
    case "render-confirmed":
      return "The output render position advanced. The browser processed audio blocks; physical audibility still depends on gain, routing, device volume, and output hardware.";
    case "closed":
      return "The context is closed and cannot resume; construct a new context inside a direct user activation.";
    default:
      return "Audio state is indeterminate.";
  }
}
