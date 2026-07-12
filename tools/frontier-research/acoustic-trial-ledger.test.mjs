import test from 'node:test';
import assert from 'node:assert/strict';
import { appendTrial, createTrialProtocol, verifyTrialLedger } from './acoustic-trial-ledger.mjs';

const protocol = createTrialProtocol({ protocolId:'audio-2026-0001', createdAt:'2026-07-12T16:39:00Z', maximumTrials:3, minimumTrials:3, alpha:0.01, nullSuccessProbability:0.125, challengeSpaceSize:8 });
const trial = (n, accepted=false) => ({ trialId:`trial-000${n}`, challengeId:`challenge-000${n}`, observedAt:`2026-07-12T16:4${n}:00Z`, acceptedAsCodewordResponse:accepted, classification:accepted?'accepted':'rejected' });

test('binds complete append-only ledger to frozen protocol', () => {
  let ledger=[]; for (let n=1;n<=3;n++) ledger=appendTrial({ledger,protocol,trial:trial(n,n<3)});
  const result=verifyTrialLedger({protocol,ledger});
  assert.equal(result.valid,true); assert.equal(result.complete,true); assert.equal(result.evaluationAllowed,true);
});

test('blocks early evaluation under fixed stopping rule', () => {
  const ledger=appendTrial({ledger:[],protocol,trial:trial(1,true)});
  const result=verifyTrialLedger({protocol,ledger});
  assert.equal(result.valid,true); assert.equal(result.complete,false); assert.equal(result.evaluationAllowed,false);
});

test('detects mutation of a prior outcome', () => {
  let ledger=appendTrial({ledger:[],protocol,trial:trial(1,true)});
  ledger=[{...ledger[0],acceptedAsCodewordResponse:false}];
  assert.match(verifyTrialLedger({protocol,ledger}).errors.join(','),/entry_digest_mismatch/);
});

test('rejects replayed challenge identifiers', () => {
  const first=appendTrial({ledger:[],protocol,trial:trial(1,true)});
  assert.throws(()=>appendTrial({ledger:first,protocol,trial:{...trial(2),challengeId:'challenge-0001'}}),/replayed_challenge_id/);
});

test('detects deleted or reordered records', () => {
  let ledger=[]; for (let n=1;n<=3;n++) ledger=appendTrial({ledger,protocol,trial:trial(n)});
  const result=verifyTrialLedger({protocol,ledger:[ledger[1],ledger[0],ledger[2]]});
  assert.equal(result.valid,false); assert.match(result.errors.join(','),/sequence_mismatch|chain_link_mismatch/);
});

test('rejects protocol mutation after registration', () => {
  const mutated={...protocol,alpha:0.05};
  assert.throws(()=>appendTrial({ledger:[],protocol:mutated,trial:trial(1)}),/protocol_digest_mismatch/);
});
