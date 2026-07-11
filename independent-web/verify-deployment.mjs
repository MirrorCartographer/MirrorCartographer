import assert from 'node:assert/strict';

const [baseUrl, expectedSha] = process.argv.slice(2);
if (!baseUrl || !expectedSha) {
  console.error('usage: node verify-deployment.mjs <page-url> <expected-sha>');
  process.exit(2);
}

const root = new URL(baseUrl);
const proofUrl = new URL('deployment.json', root);
const indexUrl = new URL('index.html', root);

const [proofResponse, indexResponse] = await Promise.all([
  fetch(proofUrl, { redirect: 'follow', cache: 'no-store' }),
  fetch(indexUrl, { redirect: 'follow', cache: 'no-store' })
]);

assert.equal(proofResponse.ok, true, `deployment proof unavailable: ${proofResponse.status}`);
assert.equal(indexResponse.ok, true, `artwork unavailable: ${indexResponse.status}`);

const proof = await proofResponse.json();
const html = await indexResponse.text();

assert.equal(proof.commit, expectedSha, 'served commit does not match workflow commit');
assert.equal(proof.artifact, 'the-weather-inside-a-bell', 'unexpected artifact identity');
assert.match(html, /<title>The Weather Inside a Bell<\/title>/, 'served page is not the independent artwork');
assert.doesNotMatch(html, /Mirror Cartographer|payment|checkout|dashboard/i, 'served page crossed the independence boundary');

console.log(JSON.stringify({
  verified: true,
  page_url: root.href,
  proof_url: proofUrl.href,
  commit: proof.commit,
  artifact: proof.artifact
}, null, 2));
