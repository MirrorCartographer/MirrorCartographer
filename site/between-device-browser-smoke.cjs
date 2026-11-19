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
  try {
    browser = await chromium.launch({headless:true,args:['--disable-gpu','--no-sandbox']});
    const page = await browser.newPage({viewport:{width:390,height:844}});
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
    if (outgoingPosts.length) throw new Error('Unapproved HTTP POST detected: '+outgoingPosts.join(', '));
    console.log('PASS: published browser scene, role switch, sky interaction and real on-device generated reply.');
    console.log('Model ready: '+ready);
    console.log('Completion: '+answered);
    console.log('Synthetic response excerpt: '+reply.slice(0,230));
    if (pageErrors.length) console.log('Nonfatal page errors: '+pageErrors.slice(0,3).join(' | '));
  } catch(error) {
    console.error('FAIL live Night Shift browser acceptance: '+String(error));
    throw error;
  } finally {
    await browser?.close();
  }
}
main().catch(()=>{process.exitCode=1});
