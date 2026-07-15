import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeScriptSets, parseScriptAliases } from './unicode-script-aliases.mjs';

const aliasesText = `
# PropertyValueAliases fixture
blk ; Basic_Latin ; Basic_Latin
sc ; Arab ; Arabic
sc ; Latn ; Latin
sc ; Zyyy ; Common
sc ; Zzzz ; Unknown
`;

test('parses only Script property aliases and maps both directions', () => {
  const aliases = parseScriptAliases(aliasesText);
  assert.equal(aliases.size, 4);
  assert.equal(aliases.toShort('Latin'), 'Latn');
  assert.equal(aliases.toShort('Latn'), 'Latn');
  assert.equal(aliases.toLong('Zyyy'), 'Common');
});

test('normalizes mixed long and short script sets deterministically', () => {
  const aliases = parseScriptAliases(aliasesText);
  assert.deepEqual(normalizeScriptSets([['Latin'], ['Arab', 'Common'], ['Unknown', 'Zzzz']], aliases), [
    ['Latn'],
    ['Arab', 'Zyyy'],
    ['Zzzz'],
  ]);
});

test('rejects duplicate aliases', () => {
  assert.throws(() => parseScriptAliases('sc ; Latn ; Latin\nsc ; Latn ; Latin_Alt'), /duplicate/u);
  assert.throws(() => parseScriptAliases('sc ; Latn ; Latin\nsc ; Ltnx ; Latin'), /duplicate/u);
});

test('rejects malformed or absent Script alias data', () => {
  assert.throws(() => parseScriptAliases('sc ; Latin ; Latn'), /invalid/u);
  assert.throws(() => parseScriptAliases('gc ; Lu ; Uppercase_Letter'), /no Script aliases/u);
});

test('rejects unknown aliases during normalization', () => {
  const aliases = parseScriptAliases(aliasesText);
  assert.throws(() => normalizeScriptSets([['Cyrillic']], aliases), /unknown Script value/u);
});
