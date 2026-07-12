import { createHash } from 'node:crypto';

const STATE_VERSION = 'frontier.witness-monotonic-state.v1';
const PACKET_VERSION = 'frontier.witness-recovery-packet.v1';

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash('sha256').update(typeof value === 'string' ? value : canonical(value)).digest('hex');
}

function assertDigest(value, name) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) throw new TypeError(`invalid ${name}`);
}

export function createMonotonicState({ policy_sequence, policy_sha256, accepted_at, previous_state_sha256 = null }) {
  if (!Number.isInteger(policy_sequence) || policy_sequence < 1) throw new TypeError('invalid policy_sequence');
  assertDigest(policy_sha256, 'policy_sha256');
  const accepted = Date.parse(accepted_at);
  if (!Number.isFinite(accepted)) throw new TypeError('invalid accepted_at');
  if (previous_state_sha256 !== null) assertDigest(previous_state_sha256, 'previous_state_sha256');
  const state = {
    version: STATE_VERSION,
    policy_sequence,
    policy_sha256,
    accepted_at: new Date(accepted).toISOString(),
    previous_state_sha256
  };
  return { ...state, state_sha256: sha256(state) };
}

export function verifyStateTransition({ current_state = null, candidate }) {
  const errors = [];
  try {
    if (!candidate || candidate.version !== STATE_VERSION) throw new TypeError('unsupported state version');
    const rebuilt = createMonotonicState(candidate);
    if (rebuilt.state_sha256 !== candidate.state_sha256) throw new TypeError('candidate state digest mismatch');
    if (current_state) {
      const current = createMonotonicState(current_state);
      if (current.state_sha256 !== current_state.state_sha256) throw new TypeError('current state digest mismatch');
      if (candidate.policy_sequence <= current_state.policy_sequence) throw new TypeError('policy sequence must increase monotonically');
      if (candidate.policy_sequence !== current_state.policy_sequence + 1) throw new TypeError('policy sequence must increase by exactly one');
      if (candidate.previous_state_sha256 !== current_state.state_sha256) throw new TypeError('previous state digest mismatch');
      if (Date.parse(candidate.accepted_at) < Date.parse(current_state.accepted_at)) throw new TypeError('accepted_at regresses');
    } else if (candidate.previous_state_sha256 !== null) {
      throw new TypeError('genesis state cannot reference a previous state');
    }
  } catch (error) { errors.push(error.message); }
  return {
    ok: errors.length === 0,
    classification: errors.length ? 'rejected' : 'accepted',
    errors,
    accepted_sequence: errors.length ? null : candidate.policy_sequence,
    accepted_state_sha256: errors.length ? null : candidate.state_sha256,
    trust_limit: 'Acceptance proves only local monotonic continuity for retained state bytes; it does not prove witness honesty, durable storage, clock correctness, or policy truth.'
  };
}

export function createRecoveryPacket({ state, policy, created_at }) {
  if (!state || state.version !== STATE_VERSION) throw new TypeError('invalid state');
  if (!policy || typeof policy !== 'object') throw new TypeError('policy is required');
  const rebuilt = createMonotonicState(state);
  if (rebuilt.state_sha256 !== state.state_sha256) throw new TypeError('state digest mismatch');
  if (sha256(policy) !== state.policy_sha256) throw new TypeError('policy digest does not match state');
  const created = Date.parse(created_at);
  if (!Number.isFinite(created)) throw new TypeError('invalid created_at');
  const body = {
    version: PACKET_VERSION,
    created_at: new Date(created).toISOString(),
    state,
    policy
  };
  return { ...body, packet_sha256: sha256(body) };
}

export function verifyRecoveryPacket({ packet, minimum_sequence = 1, expected_state_sha256 = null }) {
  const errors = [];
  try {
    if (!packet || packet.version !== PACKET_VERSION) throw new TypeError('unsupported recovery packet version');
    if (!Number.isInteger(minimum_sequence) || minimum_sequence < 1) throw new TypeError('invalid minimum_sequence');
    const { packet_sha256, ...body } = packet;
    assertDigest(packet_sha256, 'packet_sha256');
    if (sha256(body) !== packet_sha256) throw new TypeError('recovery packet digest mismatch');
    const rebuilt = createMonotonicState(packet.state);
    if (rebuilt.state_sha256 !== packet.state.state_sha256) throw new TypeError('state digest mismatch');
    if (packet.state.policy_sequence < minimum_sequence) throw new TypeError('recovery packet is stale');
    if (sha256(packet.policy) !== packet.state.policy_sha256) throw new TypeError('policy digest mismatch');
    if (expected_state_sha256 !== null) {
      assertDigest(expected_state_sha256, 'expected_state_sha256');
      if (packet.state.state_sha256 !== expected_state_sha256) throw new TypeError('unexpected recovery state');
    }
  } catch (error) { errors.push(error.message); }
  return {
    ok: errors.length === 0,
    classification: errors.length ? 'rejected' : 'accepted_recovery',
    errors,
    recovered_sequence: errors.length ? null : packet.state.policy_sequence,
    recovered_state_sha256: errors.length ? null : packet.state.state_sha256,
    trust_limit: 'A valid recovery packet prevents stale-state acceptance only relative to a retained minimum sequence or expected digest; deleting or corrupting that external anchor reopens rollback risk.'
  };
}

export const versions = { STATE_VERSION, PACKET_VERSION };
