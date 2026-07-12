import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAudioClaimPacket } from './continuity-audio-claim-vocabulary.mjs';

const base = {
  summary:'Browser audio evidence packet',
  claims:[{
    layer:'render_advancing',
    claim_state:'observed',
    statement:'Render time advanced.',
    source:{type:'runtime_probe', locator:'window.__MC_AUDIO_EVIDENCE__'},
    observed_at:'2026-07-12T14:44:00Z',
    environment:{browser:'Safari'},
    falsification_route:'Repeat retained samples and reject if time does not advance.'
  }]
};

test('accepts a layer-qualified packet',()=>assert.equal(validateAudioClaimPacket(base).valid,true));
test('rejects collapsed success wording',()=>assert.equal(validateAudioClaimPacket({...base,summary:'Audio works'}).valid,false));
test('rejects unknown layers',()=>assert.equal(validateAudioClaimPacket({...base,claims:[{...base.claims[0],layer:'audible'}]}).valid,false));
test('rejects missing falsification route',()=>{const c={...base.claims[0]}; delete c.falsification_route; assert.equal(validateAudioClaimPacket({...base,claims:[c]}).valid,false)});
test('normalizes claims into ladder order',()=>{const second={...base.claims[0],layer:'activation_observed'}; const out=validateAudioClaimPacket({...base,claims:[base.claims[0],second]}); assert.equal(out.normalized.claims[0].layer,'activation_observed')});
