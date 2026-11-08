import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createCharacter, customizeCharacter, proposeCharacterEvolution, acceptCharacterEvolution
} from './character-engine.mjs';

const page = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('creates a character from a visitor-selected identity and symbol', () => {
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  assert.equal(profile.name, 'Moth');
  assert.deepEqual(profile.collectedSymbols, ['Lantern']);
  assert.equal(profile.controls.autoApplySuggestions, false);
  assert.equal(profile.controls.userOwnsAllAppearanceChoices, true);
});

test('palette, motif, texture, and visitor-authored traits are editable', () => {
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  const edited = customizeCharacter(profile, { palette:'tide', motif:'moon-window', texture:'ink-wash', traits:['curious','nocturnal'] });
  assert.equal(edited.appearance.palette, 'tide');
  assert.equal(edited.appearance.motif, 'moon-window');
  assert.equal(edited.appearance.texture, 'ink-wash');
  assert.deepEqual(edited.traits, ['curious','nocturnal']);
});

test('evolution is a proposal and cannot mutate the original profile', () => {
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  const before = structuredClone(profile);
  const proposal = proposeCharacterEvolution(profile, { symbol:'Rain', sourceRef:'visitor-selected', userChosenTrait:'patient' });
  assert.deepEqual(profile, before);
  assert.equal(proposal.requiresExplicitAcceptance, true);
  assert.equal(proposal.mutatesProfile, false);
});

test('accepted evolution changes the profile only after explicit acceptance', () => {
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  const proposal = proposeCharacterEvolution(profile, { symbol:'Rain', userChosenTrait:'patient' });
  const evolved = acceptCharacterEvolution(profile, proposal, { acceptedAt:'2026-11-07T12:00:00.000Z' });
  assert.ok(evolved.collectedSymbols.includes('Rain'));
  assert.ok(evolved.traits.includes('patient'));
  assert.equal(profile.collectedSymbols.includes('Rain'), false);
  assert.equal(evolved.evolution.length, 1);
});

test('visitor can disable evolution suggestions', () => {
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  const disabled = customizeCharacter(profile, { suggestionsEnabled:false });
  assert.equal(proposeCharacterEvolution(disabled, { symbol:'Rain' }), null);
});

test('invalid profiles and unaccepted suggestions are rejected', () => {
  assert.throws(() => createCharacter({ name:'Moth', seedSymbol:'Lantern' }), /required/);
  const profile = createCharacter({ id:'test-character', name:'Moth', seedSymbol:'Lantern' });
  assert.throws(() => acceptCharacterEvolution(profile, {}), /explicitly accepted/);
});

test('public room is accessible, local-first, and does not call a remote model', () => {
  for (const id of ['character-name','seed-symbol','palette','motif','texture','traits','suggestions-enabled','create','export','erase','propose','accept','reject']) {
    assert.match(page, new RegExp('id="' + id + '"'));
  }
  assert.match(page, /Your choices stay on this device/);
  assert.match(page, /does not upload character profiles or call an outside model/);
  assert.match(page, /import \{ createCharacter, customizeCharacter, proposeCharacterEvolution, acceptCharacterEvolution \}/);
  assert.doesNotMatch(page, /fetch\s*\(/);
});
