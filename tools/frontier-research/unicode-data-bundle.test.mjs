import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  exactUnicodeUrl,
  verifyUnicodeDataBundle,
  fetchUnicodeDataBundle
} from './unicode-data-bundle.mjs';

const digest = (text) => createHash('sha256').update(text).digest('hex');
const version = '17.0.0';
const paths = {
  confusables: 'security/confusables.txt',
  identifierStatus: 'security/IdentifierStatus.txt',
  derivedCoreProperties: 'ucd/DerivedCoreProperties.txt'
};
const files = {
  confusables: '# confusables-17.0.0.txt\n0041 ; 0061 ; MA\n',
  identifierStatus: '# IdentifierStatus-17.0.0.txt\n0041 ; Allowed\n',
  derivedCoreProperties: '# DerivedCoreProperties-17.0.0.txt\n00AD ; Default_Ignorable_Code_Point\n'
};
const manifest = {
  version,
  files: Object.fromEntries(Object.entries(files).map(([name, text]) => [name, {
    url: exactUnicodeUrl(version, paths[name]),
    sha256: digest(text)
  }]))
};

test('accepts an exact-version digest-matched bundle', () => {
  assert.equal(verifyUnicodeDataBundle(manifest, files).authenticated, true);
});

test('rejects a mutable latest URL', () => {
  assert.throws(() => verifyUnicodeDataBundle({
    ...manifest,
    files: {
      ...manifest.files,
      confusables: {
        ...manifest.files.confusables,
        url: 'https://www.unicode.org/Public/security/latest/confusables.txt'
      }
    }
  }, files), /exact-version/);
});

test('rejects a digest mismatch', () => {
  assert.throws(() => verifyUnicodeDataBundle(manifest, {
    ...files,
    confusables: `${files.confusables}x`
  }), /digest mismatch/);
});

test('rejects cross-file Unicode version mismatch', () => {
  assert.throws(() => verifyUnicodeDataBundle(manifest, {
    ...files,
    identifierStatus: files.identifierStatus.replace('17.0.0', '16.0.0')
  }), /version mismatch/);
});

test('fetch path rejects response URL changes', async () => {
  const fakeFetch = async (url, options) => {
    assert.equal(options.redirect, 'error');
    return { ok: true, url: `${url}/moved`, text: async () => files.confusables };
  };
  await assert.rejects(
    () => fetchUnicodeDataBundle(manifest, { fetchImpl: fakeFetch }),
    /response URL changed/
  );
});
