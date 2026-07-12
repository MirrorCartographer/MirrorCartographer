import assert from 'node:assert/strict';
import { generateKeyPairSync, sign } from 'node:crypto';
import { dssePAE, verifyDsseEnvelope } from './dsse-signature-verifier.mjs';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const { publicKey: otherPublicKey, privateKey: otherPrivateKey } = generateKeyPairSync('ed25519');
const payloadType = 'application/vnd.in-toto+json';
const payload = Buffer.from(JSON.stringify({ _type: 'https://in-toto.io/Statement/v1', subject: [] }), 'utf8');
const signature = sign(null, dssePAE(payloadType, payload), privateKey).toString('base64');
const envelope = { payloadType, payload: payload.toString('base64'), signatures: [{ keyid: 'trusted', sig: signature }] };
const trustedKeys = { trusted: publicKey.export({ type: 'spki', format: 'pem' }) };

const accepted = verifyDsseEnvelope({ envelope, trustedKeys });
assert.equal(accepted.verified, true);
assert.deepEqual(accepted.acceptedKeyIds, ['trusted']);
assert.equal(accepted.payloadText, payload.toString('utf8'));

const tampered = { ...envelope, payload: Buffer.from(`${payload.toString('utf8')} `).toString('base64') };
assert.equal(verifyDsseEnvelope({ envelope: tampered, trustedKeys }).verified, false);

const wrongSigner = { ...envelope, signatures: [{ keyid: 'trusted', sig: sign(null, dssePAE(payloadType, payload), otherPrivateKey).toString('base64') }] };
assert.equal(verifyDsseEnvelope({ envelope: wrongSigner, trustedKeys }).verified, false);

const keyidLookalike = { ...envelope, signatures: [{ keyid: 'trusted-lookalike', sig: signature }] };
assert.equal(verifyDsseEnvelope({ envelope: keyidLookalike, trustedKeys: { 'trusted-lookalike': otherPublicKey.export({ type: 'spki', format: 'pem' }) } }).verified, false);

const multiSignature = { ...envelope, signatures: [envelope.signatures[0], { keyid: 'other', sig: sign(null, dssePAE(payloadType, payload), otherPrivateKey).toString('base64') }] };
const thresholdResult = verifyDsseEnvelope({ envelope: multiSignature, trustedKeys: { ...trustedKeys, other: otherPublicKey.export({ type: 'spki', format: 'pem' }) }, threshold: 2 });
assert.equal(thresholdResult.verified, true);
assert.deepEqual(thresholdResult.acceptedKeyIds, ['other', 'trusted']);

assert.equal(verifyDsseEnvelope({ envelope: { ...envelope, payloadType: 'application/json' }, trustedKeys }).verified, false);
console.log('6 passed');
