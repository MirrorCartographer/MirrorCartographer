import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScriptData, parseScriptExtensions, parseScripts } from './unicode-script-data.mjs';

const scriptsText = `
# fixture in Scripts.txt format
0000..0040 ; Common
0041..005A ; Latin
0061..007A ; Latin
0640 ; Common
0641..064A ; Arabic
1F600 ; Common
`;

const extensionsText = `
0640 ; Adlm Arab Mand Mani Ougr Phlp Rohg Sogd Syrc
`;

test('parses ranges and ignores comments and blank lines', () => {
  assert.deepEqual(parseScripts(scriptsText)[1], { start: 0x41, end: 0x5A, script: 'Latin' });
  assert.deepEqual(parseScriptExtensions(extensionsText)[0].scripts, ['Adlm', 'Arab', 'Mand', 'Mani', 'Ougr', 'Phlp', 'Rohg', 'Sogd', 'Syrc']);
});

test('explicit Script_Extensions overrides Script fallback', () => {
  const data = buildScriptData({ scriptsText, scriptExtensionsText: extensionsText });
  assert.deepEqual(data.scriptSetForCodePoint(0x0640), ['Adlm', 'Arab', 'Mand', 'Mani', 'Ougr', 'Phlp', 'Rohg', 'Sogd', 'Syrc']);
  assert.deepEqual(data.scriptSetForCodePoint(0x0641), ['Arabic']);
});

test('unlisted scalar defaults to Unknown', () => {
  const data = buildScriptData({ scriptsText, scriptExtensionsText: extensionsText });
  assert.deepEqual(data.scriptSetForCodePoint(0x10FFFF), ['Unknown']);
});

test('identifier lookup returns one set per Unicode scalar, not UTF-16 code unit', () => {
  const data = buildScriptData({ scriptsText, scriptExtensionsText: extensionsText });
  assert.deepEqual(data.scriptSetsForIdentifier('A😀'), [['Latin'], ['Common']]);
});

test('rejects overlapping ranges', () => {
  assert.throws(() => parseScripts('0041..005A ; Latin\n005A..0060 ; Latin'), /overlapping/u);
});

test('rejects surrogate-containing ranges', () => {
  assert.throws(() => parseScripts('D7FF..E000 ; Unknown'), /Unicode scalar range/u);
});

test('rejects duplicate or malformed Script_Extensions values', () => {
  assert.throws(() => parseScriptExtensions('0640 ; Arab Arab'), /invalid ScriptExtensions/u);
  assert.throws(() => parseScriptExtensions('0640 ; Arabic'), /invalid ScriptExtensions/u);
});
