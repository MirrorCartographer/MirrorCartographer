/* Public browser acceptance, not source-only verification.
 * Runs only on a successfully published atlas via GitHub Actions.
 * This is intentionally a synthetic, nonprivate prompt.
 */
const { chromium } = require('playwright');

const URL = 'https://mirrorcartographer.github.io/MirrorCartographer/expeditions/between-device.html';
const deadlineMs = 240000;
async function waitForStatus(page, expected, timeoutMs) {
  const started = Date.now();
  let seen = '';
  while (Date.now() - started < timeoutMs) {
    seen = await page.locator('#status').innerText();
    if (expected.test(seen)) return seen;
    if (/could not initialize|blocked the local model|no fabricated reply|local model failed|error loading|failed to fetch/i.test(seen)) {
      throw new Error('Browser explicitly reported failure: ' + seen);
    }
    await page.waitForTimeout(1700);
  }
  throw new Error('Timed out waiting for '+expected+'; last status: '+seen);
}
async function main() {
  let browser;
  let page;
  try {
    browser = await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--no-sandbox']});
    page = await browser.newPage({viewport:{width:390,height:844}});
    const outgoingPosts = [];
    const pageErrors = [];
    page.on('request', request=>{
      if (request.method()==='POST') outgoingPosts.push(request.url());
    });
    page.on('pageerror', error=>pageErrors.push(String(error)));
    const response = await page.goto(URL,{waitUntil:'domcontentloaded',timeout:50000});
    if (!response?.ok()) throw new Error('Published page is not accessible: '+response?.status());
    await page.locator('#choose-vesper').click();
    if (await page.locator('#choose-vesper').getAttribute('aria-pressed') !== 'true') {
      throw new Error('Vesper selection did not work');
    }
    await page.locator('#choose-morrow').click();
    await page.locator('#sky').click({position:{x:150,y:110}});
    const weather = await page.locator('#station').getAttribute('data-weather');
    if (weather !== 'wind') throw new Error('Sky control did not change observed scene');
    await page.locator('#load-model').click();
    const ready = await waitForStatus(page,/LOCAL MODEL READY/,deadlineMs);
    const prompt='In one sentence, what distinguishes an observation from an interpretation?';
    await page.locator('#message').fill(prompt);
    await page.locator('#send').click();
    const answered = await waitForStatus(page,/Generated on this device using/,deadlineMs);
    const reply = await page.locator('.utterance.resident').last().innerText();
    if (!reply || reply.length < 16 || reply.includes('WRITTEN GREETING')) {
      throw new Error('No usable generated text was displayed');
    }
    if (/your responses so far|your assignments|as you said earlier|your previous work/i.test(reply)) {
      throw new Error('Model invented visitor history not present in the ephemeral conversation: '+reply.slice(0,180));
    }
    // Exercise the first-party LYR investigation procedure through the same real model.
    await page.locator('#lyr-evidence summary').click();
    const witness = await page.locator('#lyr-observed').innerText();
    if (!/current station weather is wind/.test(witness)) throw new Error('Evidence provenance did not track the rendered weather state: '+witness);
    await page.locator('#message').fill('What would distinguish two possible explanations for the clock stopping?');
    await page.locator('#investigate').click();
    await waitForStatus(page,/Generated on this device using/,deadlineMs);
    const investigation = await page.locator('.utterance.resident').last().innerText();
    if (investigation.length < 16 || investigation.includes('WRITTEN GREETING')) {
      throw new Error('The LYR investigation button did not return generated text');
    }
    if (!/\b(clock|winding|pendulum|mechanism|battery|chime|motor|test|observe|measurement)\b/i.test(investigation)) {
      throw new Error('Model drifted away from the asked clock investigation: '+investigation.slice(0,210));
    }
    if (outgoingPosts.length) throw new Error('Unapproved HTTP POST detected: '+outgoingPosts.join(', '));
    console.log('PASS: published browser scene, role switch, sky interaction and real on-device generated reply.');
    console.log('Model ready: '+ready);
    console.log('Completion: '+answered);
    console.log('Synthetic response excerpt: '+reply.slice(0,230));
    console.log('LYR investigation generated excerpt: '+investigation.slice(0,230));
    if (pageErrors.length) console.log('Nonfatal page errors: '+pageErrors.slice(0,3).join(' | '));
  } catch(error) {
    if (page) {
      try { await page.screenshot({path:'night-shift-browser-failure.png',fullPage:true}); } catch {}
    }
    console.error('FAIL live Night Shift browser acceptance: '+String(error));
    throw error;
  } finally {
    await browser?.close();
  }
}
main().catch(()=>{process.exitCode=1});
