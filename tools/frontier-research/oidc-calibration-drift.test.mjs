import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTemporalCalibrationDrift } from './oidc-calibration-drift.mjs';

function summary({cohort=8,lifetime=300,issued=4,nbfCount=0,nbf=0,policy=false}={}) {
  return {
    status:'calibrated_observation_summary', cohort_size:cohort, policy_change_permitted:policy,
    statistics:{
      lifetime_seconds:{min:lifetime,median:lifetime,p95:lifetime,max:lifetime},
      absolute_issued_skew_seconds:{median:issued,p95:issued,max:issued},
      absolute_not_before_skew_seconds:nbfCount?{count:nbfCount,median:nbf,p95:nbf,max:nbf}:{count:0}
    }
  };
}

test('accepts bounded aggregate drift for review without permitting policy change',()=>{
  const out=evaluateTemporalCalibrationDrift(summary(),summary({issued:20,lifetime:285}));
  assert.equal(out.status,'no_material_drift_observed');
  assert.equal(out.reusable_for_review,true);
  assert.equal(out.policy_change_permitted,false);
});

test('flags issued-skew drift',()=>{
  const out=evaluateTemporalCalibrationDrift(summary(),summary({issued:40}));
  assert.deepEqual(out.reasons,['issued_skew_drift']);
});

test('flags lifetime contraction',()=>{
  const out=evaluateTemporalCalibrationDrift(summary(),summary({lifetime:260}));
  assert.ok(out.reasons.includes('lifetime_contraction'));
});

test('flags not-before claim emergence and later skew drift',()=>{
  const emerged=evaluateTemporalCalibrationDrift(summary(),summary({nbfCount:8,nbf:3}));
  assert.ok(emerged.reasons.includes('not_before_claim_emerged'));
  const drift=evaluateTemporalCalibrationDrift(summary({nbfCount:8,nbf:3}),summary({nbfCount:8,nbf:40}));
  assert.ok(drift.reasons.includes('not_before_skew_drift'));
});

test('fails closed on insufficient cohorts or auto-policy-enabled summaries',()=>{
  assert.ok(evaluateTemporalCalibrationDrift(summary({cohort:4}),summary()).reasons.includes('insufficient_cohort'));
  assert.throws(()=>evaluateTemporalCalibrationDrift(summary({policy:true}),summary()),/no-auto-policy-change/);
});
