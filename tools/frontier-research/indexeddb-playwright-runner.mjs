import { validateInteropEvidence, summarizeInteropMatrix } from './indexeddb-browser-interop-evidence.mjs';

const BROWSERS = ['chromium', 'firefox', 'webkit'];
const ORDINARY = ['two_tab_contention', 'versionchange_forced_close'];
const GATED = ['quota_pressure', 'abrupt_termination_recovery'];

export function classifyScenarioSupport({ scenario, capabilities = {} }) {
  if (ORDINARY.includes(scenario)) return { supported: true, mode: 'ordinary_browser_automation' };
  if (scenario === 'quota_pressure') return capabilities.quota_pressure === true
    ? { supported: true, mode: 'platform_capability' }
    : { supported: false, mode: 'capability_missing', reason: 'quota_pressure_injection_unavailable' };
  if (scenario === 'abrupt_termination_recovery') return capabilities.abrupt_termination === true
    ? { supported: true, mode: 'platform_capability' }
    : { supported: false, mode: 'capability_missing', reason: 'abrupt_termination_injection_unavailable' };
  return { supported: false, mode: 'unsupported', reason: 'scenario_not_implemented' };
}

function baseRecord({ browser, browserVersion, platform, scenario, sourceCommit }) {
  return {
    browser,
    browser_version: browserVersion,
    platform,
    scenario,
    outcome: 'not_run',
    capability_evidence: {
      indexeddb_available: false,
      transaction_options_supported: false,
      requested_durability: 'default',
      observed_durability: 'unknown'
    },
    transaction_evidence: { started: false, completed: false, replay_rejected: false },
    recovery_evidence: {
      persistence_claim: 'not_tested',
      interruption_injected: false,
      reopen_attempted: false,
      recovered_record: null
    },
    evidence_strength: 'browser_runtime_observation',
    uncertainty: 'Browser automation observes API-visible behavior but not storage-device durability.',
    falsification_route: 'Re-run the same source commit and scenario on the named browser/version and inspect the emitted event timeline.',
    source_commit: sourceCommit,
    event_timeline: []
  };
}

function blockedRecord(identity, reason) {
  const record = baseRecord(identity);
  record.outcome = 'blocked';
  record.evidence_strength = 'capability_declaration_only';
  record.uncertainty = reason;
  record.falsification_route = `Provide the missing platform capability and rerun ${identity.scenario} without replacing it with graceful context closure.`;
  validateInteropEvidence(record);
  return record;
}

async function twoTabContention(context, origin, databaseName) {
  const writer = await context.newPage();
  const contender = await context.newPage();
  await Promise.all([writer.goto(origin), contender.goto(origin)]);
  const first = await writer.evaluate(async ({ databaseName }) => {
    const open = indexedDB.open(databaseName, 1);
    open.onupgradeneeded = () => open.result.createObjectStore('records', { keyPath: 'id' });
    const db = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const tx = db.transaction('records', 'readwrite', { durability: 'strict' });
    tx.objectStore('records').put({ id: 'contention-key', writer: 'page-one' });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('transaction_aborted'));
    });
    db.close();
    return { transactionStarted: true, transactionCompleted: true };
  }, { databaseName });
  const replay = await contender.evaluate(async ({ databaseName }) => {
    const open = indexedDB.open(databaseName, 1);
    const db = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const tx = db.transaction('records', 'readonly');
    const get = tx.objectStore('records').get('contention-key');
    const existing = await new Promise((resolve, reject) => {
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject(get.error);
    });
    db.close();
    return { replayRejected: Boolean(existing) };
  }, { databaseName });
  return {
    indexeddbAvailable: true,
    transactionOptionsSupported: true,
    transactionStarted: first.transactionStarted,
    transactionCompleted: first.transactionCompleted,
    replayRejected: replay.replayRejected,
    eventTimeline: [replay.replayRejected ? 'replay:existing-record-observed' : 'replay:record-absent']
  };
}

async function versionchangeForcedClose(context, origin, databaseName) {
  const holder = await context.newPage();
  const upgrader = await context.newPage();
  await Promise.all([holder.goto(origin), upgrader.goto(origin)]);
  await holder.evaluate(async ({ databaseName }) => {
    const open = indexedDB.open(databaseName, 1);
    open.onupgradeneeded = () => open.result.createObjectStore('records', { keyPath: 'id' });
    const db = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    window.__versionchangeObserved = false;
    window.__heldDb = db;
    db.onversionchange = () => {
      window.__versionchangeObserved = true;
      db.close();
    };
  }, { databaseName });
  const upgrade = await upgrader.evaluate(async ({ databaseName }) => {
    const events = [];
    const open = indexedDB.open(databaseName, 2);
    open.onblocked = () => events.push('upgrade:blocked');
    open.onupgradeneeded = () => events.push('upgrade:versionchange');
    const db = await new Promise((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const tx = db.transaction('records', 'readwrite');
    tx.objectStore('records').put({ id: 'version-two', value: true });
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('transaction_aborted'));
    });
    db.close();
    return { events, transactionStarted: true, transactionCompleted: true };
  }, { databaseName });
  const observed = await holder.evaluate(() => window.__versionchangeObserved === true);
  return {
    indexeddbAvailable: true,
    transactionOptionsSupported: true,
    transactionStarted: upgrade.transactionStarted,
    transactionCompleted: upgrade.transactionCompleted,
    replayRejected: observed,
    eventTimeline: [...upgrade.events, observed ? 'holder:versionchange-close-observed' : 'holder:versionchange-not-observed']
  };
}

export async function runBrowserInteropScenario(options = {}) {
  const { browserName, browserType, origin, sourceCommit, scenario, platform = process.platform, capabilities = {}, databaseName = `mc-frontier-${scenario}` } = options;
  if (!BROWSERS.includes(browserName)) throw new Error('browser_invalid');
  if (typeof browserType?.launch !== 'function') throw new Error('browser_launch_missing');
  if (typeof origin !== 'string' || !origin) throw new Error('origin_missing');
  if (typeof sourceCommit !== 'string' || !sourceCommit) throw new Error('source_commit_missing');
  const support = classifyScenarioSupport({ scenario, capabilities });
  const identity = { browser: browserName, browserVersion: 'unresolved', platform, scenario, sourceCommit };
  if (!support.supported) return blockedRecord(identity, support.reason);
  if (GATED.includes(scenario) && typeof capabilities.runScenario !== 'function') return blockedRecord(identity, 'platform_runner_missing');

  let browser;
  try {
    browser = await browserType.launch({ headless: true });
    identity.browserVersion = typeof browser.version === 'function' ? browser.version() : 'unknown';
    const context = await browser.newContext();
    const observed = scenario === 'two_tab_contention'
      ? await twoTabContention(context, origin, databaseName)
      : scenario === 'versionchange_forced_close'
        ? await versionchangeForcedClose(context, origin, databaseName)
        : await capabilities.runScenario({ context, origin, databaseName, scenario });
    const record = baseRecord(identity);
    record.capability_evidence.indexeddb_available = observed.indexeddbAvailable === true;
    record.capability_evidence.transaction_options_supported = observed.transactionOptionsSupported === true;
    record.capability_evidence.requested_durability = observed.requestedDurability || 'strict';
    record.capability_evidence.observed_durability = observed.observedDurability || 'api_completion_only';
    record.transaction_evidence.started = observed.transactionStarted === true;
    record.transaction_evidence.completed = observed.transactionCompleted === true;
    record.transaction_evidence.replay_rejected = observed.replayRejected === true;
    record.recovery_evidence = observed.recoveryEvidence || record.recovery_evidence;
    record.event_timeline = Array.isArray(observed.eventTimeline) ? observed.eventTimeline : [];
    record.outcome = record.transaction_evidence.completed && (scenario !== 'two_tab_contention' || record.transaction_evidence.replay_rejected) ? 'pass' : 'fail';
    validateInteropEvidence(record);
    return record;
  } catch (error) {
    const record = baseRecord(identity);
    record.outcome = 'fail';
    record.uncertainty = error instanceof Error ? error.message : String(error);
    record.event_timeline.push(`runner:error:${record.uncertainty}`);
    validateInteropEvidence(record);
    return record;
  } finally {
    if (browser) await browser.close();
  }
}

export async function runInteropMatrix({ playwright, origin, sourceCommit, scenarios = ORDINARY, capabilitiesByBrowser = {} }) {
  if (!playwright || typeof playwright !== 'object') throw new Error('playwright_missing');
  const records = [];
  for (const browserName of BROWSERS) {
    for (const scenario of scenarios) {
      records.push(await runBrowserInteropScenario({ browserName, browserType: playwright[browserName], origin, sourceCommit, scenario, capabilities: capabilitiesByBrowser[browserName] || {} }));
    }
  }
  return { records, summary: summarizeInteropMatrix(records) };
}

export const INTEROP_RUNNER_POLICY = Object.freeze({
  required_browsers: BROWSERS,
  ordinary_automation: ORDINARY,
  capability_gated: GATED,
  forbidden_substitution: 'Do not represent graceful page or context closure as abrupt process termination.'
});
