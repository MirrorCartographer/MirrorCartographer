import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyScenarioSupport, runBrowserInteropScenario, runInteropMatrix, INTEROP_RUNNER_POLICY } from './indexeddb-playwright-runner.mjs';

function fakeBrowserType() {
  return {
    async launch() {
      return {
        version: () => 'test-1',
        async newContext() {
          return {
            async newPage() {
              return {
                async goto() {},
                async evaluate(fn) {
                  const text = String(fn);
                  if (text.includes('window.__heldDb')) return undefined;
                  if (text.includes('window.__versionchangeObserved')) return true;
                  if (text.includes('replayRejected')) return { replayRejected: true };
                  if (text.includes('transactionStarted')) return { events: [], transactionStarted: true, transactionCompleted: true };
                  return undefined;
                }
              };
            }
          };
        },
        async close() {}
      };
    }
  };
}

test('ordinary browser scenarios are directly automatable', () => {
  assert.deepEqual(classifyScenarioSupport({ scenario: 'two_tab_contention' }), { supported: true, mode: 'ordinary_browser_automation' });
  assert.deepEqual(classifyScenarioSupport({ scenario: 'versionchange_forced_close' }), { supported: true, mode: 'ordinary_browser_automation' });
});

test('abrupt termination is blocked instead of represented by graceful closure', async () => {
  const record = await runBrowserInteropScenario({
    browserName: 'chromium', browserType: fakeBrowserType(), origin: 'https://example.test', sourceCommit: 'a'.repeat(40), scenario: 'abrupt_termination_recovery'
  });
  assert.equal(record.outcome, 'blocked');
  assert.match(record.uncertainty, /abrupt_termination_injection_unavailable/);
  assert.match(INTEROP_RUNNER_POLICY.forbidden_substitution, /graceful/);
});

test('two-tab contention emits pass evidence only after replay observation', async () => {
  const record = await runBrowserInteropScenario({
    browserName: 'firefox', browserType: fakeBrowserType(), origin: 'https://example.test', sourceCommit: 'b'.repeat(40), scenario: 'two_tab_contention'
  });
  assert.equal(record.outcome, 'pass');
  assert.equal(record.transaction_evidence.completed, true);
  assert.equal(record.transaction_evidence.replay_rejected, true);
});

test('versionchange records holder observation separately', async () => {
  const record = await runBrowserInteropScenario({
    browserName: 'webkit', browserType: fakeBrowserType(), origin: 'https://example.test', sourceCommit: 'c'.repeat(40), scenario: 'versionchange_forced_close'
  });
  assert.equal(record.outcome, 'pass');
  assert.ok(record.event_timeline.includes('holder:versionchange-close-observed'));
});

test('default matrix covers three browsers but stays incomplete for gated scenarios', async () => {
  const playwright = { chromium: fakeBrowserType(), firefox: fakeBrowserType(), webkit: fakeBrowserType() };
  const result = await runInteropMatrix({ playwright, origin: 'https://example.test', sourceCommit: 'd'.repeat(40) });
  assert.equal(result.records.length, 6);
  assert.equal(result.summary.complete, false);
  assert.equal(result.summary.matrix.chromium.two_tab_contention, 'pass');
  assert.equal(result.summary.matrix.webkit.versionchange_forced_close, 'pass');
});
