import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTemporalCalibration } from './oidc-temporal-calibration.mjs';

const obs = (lifetime, issued, nbf = null) => ({
  lifetime_seconds: lifetime,
  issued_skew_seconds: issued,
  not_before_skew_seconds: nbf,
  has_exp: true,
  has_iat: true,
  has_nbf: nbf !== null
});

test('refuses policy inference below minimum cohort', () => {
  const out = buildTemporalCalibration([obs(300,1),obs(300,2),obs(300,3)]);
  assert.equal(out.status, 'insufficient_cohort');
  assert.equal(out.policy_change_permitted, false);
});

test('produces aggregate-only statistics for sufficient cohort', () => {
  const out = buildTemporalCalibration([obs(300,-2),obs(305,1),obs(295,0),obs(300,3),obs(310,-1)]);
  assert.equal(out.status, 'calibrated_observation_summary');
  assert.equal(out.cohort_size, 5);
  assert.equal(out.statistics.lifetime_seconds.median, 300);
  assert.equal(out.privacy.raw_observations_retained, false);
  assert.equal(JSON.stringify(out).includes('repository'), true);
  assert.equal(out.policy_change_permitted, false);
});

test('rejects identity-bearing or raw-token fields', () => {
  assert.throws(() => buildTemporalCalibration([
    {...obs(300,0), repository:'owner/repo'},obs(300,0),obs(300,0),obs(300,0),obs(300,0)
  ]), /privacy boundary violation/);
  assert.throws(() => buildTemporalCalibration([
    {...obs(300,0), jwt:'secret'},obs(300,0),obs(300,0),obs(300,0),obs(300,0)
  ]), /privacy boundary violation/);
});

test('rejects impossible or unsafe temporal values', () => {
  assert.throws(() => buildTemporalCalibration([obs(0,0),obs(300,0),obs(300,0),obs(300,0),obs(300,0)]), /out of bounds/);
  assert.throws(() => buildTemporalCalibration([obs(300,601),obs(300,0),obs(300,0),obs(300,0),obs(300,0)]), /out of bounds/);
});

test('enforces consistency between nbf presence and value', () => {
  const bad = {...obs(300,0,null), has_nbf:true};
  assert.throws(() => buildTemporalCalibration([bad,obs(300,0),obs(300,0),obs(300,0),obs(300,0)]), /presence mismatch/);
});
