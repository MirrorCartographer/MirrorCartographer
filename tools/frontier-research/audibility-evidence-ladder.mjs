const LEVELS = Object.freeze({
  none: 0,
  state: 1,
  clock: 2,
  render: 3,
  destination: 4,
  device: 5,
  human: 6,
});

function bool(value) {
  return value === true;
}

export function classifyAudibilityEvidence(input = {}) {
  const observations = {
    contextRunning: bool(input.contextRunning),
    clockAdvanced: bool(input.clockAdvanced),
    renderAdvanced: bool(input.renderAdvanced),
    destinationConnected: bool(input.destinationConnected),
    deviceMeterDetected: bool(input.deviceMeterDetected),
    humanHeard: bool(input.humanHeard),
  };

  let strongest = "none";
  for (const [name, seen] of Object.entries({
    state: observations.contextRunning,
    clock: observations.clockAdvanced,
    render: observations.renderAdvanced,
    destination: observations.destinationConnected,
    device: observations.deviceMeterDetected,
    human: observations.humanHeard,
  })) {
    if (seen && LEVELS[name] > LEVELS[strongest]) strongest = name;
  }

  const contradictions = [];
  if (observations.renderAdvanced && !observations.contextRunning) {
    contradictions.push("render-without-running-state");
  }
  if (observations.deviceMeterDetected && !observations.destinationConnected) {
    contradictions.push("device-signal-without-declared-destination-route");
  }
  if (observations.humanHeard && !observations.renderAdvanced) {
    contradictions.push("human-report-without-browser-render-evidence");
  }

  const browserProcessed = observations.renderAdvanced;
  const physicalAudibility = observations.deviceMeterDetected || observations.humanHeard;
  const corroboratedAudibility = observations.renderAdvanced
    && observations.destinationConnected
    && physicalAudibility;

  return {
    schemaVersion: "1.0.0",
    observations,
    strongestEvidence: strongest,
    browserProcessed,
    physicalAudibility,
    corroboratedAudibility,
    claimState: contradictions.length
      ? "contested"
      : corroboratedAudibility
        ? "corroborated-audible"
        : browserProcessed
          ? "browser-rendered-audibility-unproven"
          : observations.contextRunning
            ? "running-audibility-unproven"
            : "insufficient-evidence",
    contradictions,
    limits: [
      "AudioContext state does not prove rendering.",
      "Render-position advance proves browser audio processing, not sound pressure at the listener.",
      "A human report or device meter can support audibility but does not by itself identify the browser graph as the source.",
    ],
    falsificationRoute: "Repeat the same direct gesture while recording render-position advance, destination routing, and an independent device meter or synchronized human report.",
  };
}
