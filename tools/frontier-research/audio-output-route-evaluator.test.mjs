import assert from 'node:assert/strict';
import { evaluateOutputRouteEvidence } from './audio-output-route-evaluator.mjs';

const base = {
  secureContext: true,
  speakerSelectionAllowed: true,
  transientActivation: true,
  capabilities: { selectAudioOutput: true, htmlMediaSetSinkId: true, audioContextSetSinkId: false },
  selection: { attempted: true, resolved: true, errorName: null },
  sinkApplication: { target: 'html_media_element', attempted: true, resolved: true, errorName: null },
  selectedDevicePresentAfterSelection: true
};

assert.equal(evaluateOutputRouteEvidence(base).classification, 'explicit_output_route_browser_confirmed');
assert.equal(evaluateOutputRouteEvidence(base).privacy_record.raw_device_id_retained, false);

assert.equal(evaluateOutputRouteEvidence({
  ...base,
  capabilities: { selectAudioOutput: false, htmlMediaSetSinkId: false, audioContextSetSinkId: false }
}).classification, 'explicit_output_routing_unsupported');

assert.equal(evaluateOutputRouteEvidence({
  ...base,
  transientActivation: false,
  selection: { attempted: true, resolved: false, errorName: 'InvalidStateError' },
  sinkApplication: { target: 'none', attempted: false, resolved: false, errorName: null }
}).classification, 'selection_missing_transient_activation');

assert.equal(evaluateOutputRouteEvidence({
  ...base,
  selectedDevicePresentAfterSelection: false
}).classification, 'selected_output_no_longer_enumerated');

assert.equal(evaluateOutputRouteEvidence({
  ...base,
  sinkApplication: { target: 'audio_context', attempted: true, resolved: false, errorName: 'NotAllowedError' }
}).classification, 'sink_application_failed_NotAllowedError');

assert.equal(evaluateOutputRouteEvidence({ ...base, secureContext: 'yes' }).accepted, false);

console.log('6 audio output route evaluator tests passed');
