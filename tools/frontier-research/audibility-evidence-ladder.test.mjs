import assert from "node:assert/strict";
import { classifyAudibilityEvidence } from "./audibility-evidence-ladder.mjs";

const stateOnly = classifyAudibilityEvidence({ contextRunning: true });
assert.equal(stateOnly.claimState, "running-audibility-unproven");
assert.equal(stateOnly.physicalAudibility, false);

const renderOnly = classifyAudibilityEvidence({
  contextRunning: true,
  clockAdvanced: true,
  renderAdvanced: true,
  destinationConnected: true,
});
assert.equal(renderOnly.claimState, "browser-rendered-audibility-unproven");
assert.equal(renderOnly.browserProcessed, true);
assert.equal(renderOnly.physicalAudibility, false);

const corroborated = classifyAudibilityEvidence({
  contextRunning: true,
  clockAdvanced: true,
  renderAdvanced: true,
  destinationConnected: true,
  deviceMeterDetected: true,
});
assert.equal(corroborated.claimState, "corroborated-audible");
assert.equal(corroborated.corroboratedAudibility, true);

const contradictory = classifyAudibilityEvidence({
  contextRunning: false,
  renderAdvanced: true,
  destinationConnected: true,
});
assert.equal(contradictory.claimState, "contested");
assert.deepEqual(contradictory.contradictions, ["render-without-running-state"]);

console.log("audibility evidence ladder: 4 tests passed");
