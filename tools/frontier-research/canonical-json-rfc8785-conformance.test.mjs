import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeJson } from './canonical-json-digest.mjs';

function doubleFromHex(hex) {
  const bytes = Buffer.from(hex, 'hex');
  assert.equal(bytes.length, 8);
  return bytes.readDoubleBE(0);
}

const numberVectors = [
  ['0000000000000000', '0'],
  ['8000000000000000', '0'],
  ['0000000000000001', '5e-324'],
  ['8000000000000001', '-5e-324'],
  ['7fefffffffffffff', '1.7976931348623157e+308'],
  ['ffefffffffffffff', '-1.7976931348623157e+308'],
  ['4340000000000000', '9007199254740992'],
  ['c340000000000000', '-9007199254740992'],
  ['4430000000000000', '295147905179352830000'],
  ['44b52d02c7e14af5', '9.999999999999997e+22'],
  ['44b52d02c7e14af6', '1e+23'],
  ['44b52d02c7e14af7', '1.0000000000000001e+23'],
  ['444b1ae4d6e2ef4e', '999999999999999700000'],
  ['444b1ae4d6e2ef4f', '999999999999999900000'],
  ['444b1ae4d6e2ef50', '1e+21'],
  ['3eb0c6f7a0b5ed8c', '9.999999999999997e-7'],
  ['3eb0c6f7a0b5ed8d', '0.000001'],
  ['41b3de4355555553', '333333333.3333332'],
  ['41b3de4355555554', '333333333.33333325'],
  ['41b3de4355555555', '333333333.3333333'],
  ['41b3de4355555556', '333333333.3333334'],
  ['41b3de4355555557', '333333333.33333343'],
  ['becbf647612f3696', '-0.0000033333333333333333'],
  ['43143ff3c1cb0959', '1424953923781206.2'],
];

test('matches every finite RFC 8785 Appendix B number vector', () => {
  for (const [hex, expected] of numberVectors) {
    assert.equal(canonicalizeJson(doubleFromHex(hex)), expected, hex);
  }
});

test('rejects RFC 8785 non-finite number vectors', () => {
  for (const hex of ['7fffffffffffffff', '7ff0000000000000']) {
    assert.throws(() => canonicalizeJson(doubleFromHex(hex)), /non-finite/, hex);
  }
});

test('matches RFC 8785 UTF-16 property ordering vector', () => {
  const input = {
    '€': 'Euro Sign',
    '\r': 'Carriage Return',
    'דּ': 'Hebrew Letter Dalet With Dagesh',
    '1': 'One',
    '😀': 'Emoji: Grinning Face',
    '': 'Control',
    'ö': 'Latin Small Letter O With Diaeresis',
  };

  assert.equal(
    canonicalizeJson(input),
    '{"\\r":"Carriage Return","1":"One","":"Control","ö":"Latin Small Letter O With Diaeresis","€":"Euro Sign","😀":"Emoji: Grinning Face","דּ":"Hebrew Letter Dalet With Dagesh"}',
  );
});
