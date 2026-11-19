/* Real public-browser test with WebKit and an iPhone-like touch profile.
 * Browser engine emulation is NOT a physical iPhone Safari acceptance.
 */
const { webkit, devices } = require('playwright');
const URL = 'https://mirrorcartographer.github.io/MirrorCartographer/expeditions/between-device.html';

async function awaitStatus(page, pattern, timeout=180000) {
  const started=Date.now();
  let last='';
  while (Date.now()-started < timeout) {
    last = await page.locator('#status').innerText();
    if (pattern.test(last)) return last;
    if (/could not initialize|no available backend|blocked the local model|no fabricated reply/i.test(last)) {
      throw new Error('The mobile WebKit model path failed: '+last);
    }
    await page.waitForTimeout(1500);
  }
  throw new Error('Mobile WebKit timeout: expected '+pattern+'; last status '+last);
}
(async()=>{
  let browser, page;
  try {
    browser=await webkit.launch({headless:true});
    page=await browser.newPage({...devices['iPhone 13']});
    const failures=[];
    const postRequests=[];
    page.on('pageerror',e=>failures.push(String(e)));
    page.on('request',req=>{if(req.method()==='POST')postRequests.push(req.url())});
    const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:50000});
    if(!response?.ok())throw new Error('Cannot load public Night Shift: '+response?.status());
    await page.locator('#choose-vesper').tap();
    if(await page.locator('#choose-vesper').getAttribute('aria-pressed')!=='true')throw new Error('Vesper touch selection failed');
    await page.locator('#choose-morrow').tap();
    const x=await page.locator('#sky').boundingBox();
    if(!x)throw new Error('Sky control absent on mobile viewport');
    await page.locator('#sky').tap({position:{x:Math.min(28,x.width/3),y:Math.min(35,x.height/3)}});
    if(await page.locator('#station').getAttribute('data-weather')!=='wind')throw new Error('Weather did not respond to mobile touch');
    await page.locator('#load-model').tap();
    const ready=await awaitStatus(page,/LOCAL MODEL READY/);
    await page.locator('#message').fill('Which is measured here, and which is only an interpretation?');
    await page.locator('#investigate').tap();
    const complete=await awaitStatus(page,/Generated on this device using/);
    const reply=await page.locator('.utterance.resident').last().innerText();
    if(reply.length < 20 || reply.includes('WRITTEN GREETING'))throw new Error('No generated mobile WebKit answer');
    if(postRequests.length)throw new Error('Unexpected network POST to '+postRequests.join(', '));
    console.log('PASS WebKit iPhone-style emulation: touch controls, model ready, investigation generated text.');
    console.log(ready);
    console.log(complete);
    console.log('Generated text excerpt: '+reply.slice(0,170));
    if(failures.length)console.log('Additional JS errors: '+failures.slice(0,3).join(' | '));
  } catch(e) {
    if(page)try{await page.screenshot({path:'night-shift-webkit-failure.png',fullPage:true})}catch{}
    console.error('FAIL WebKit mobile acceptance: '+String(e));
    process.exitCode=1;
  } finally {await browser?.close()}
})();
