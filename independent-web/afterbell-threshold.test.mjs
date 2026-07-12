import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('./index.html',import.meta.url),'utf8');

assert.match(html,/id="afterbell"[^>]+href="\.\/afterbell\.html"/,'primary chamber links to Afterbell');
assert.match(html,/memory\.count<3/,'threshold requires three written weather notes');
assert.match(html,/aria-hidden','threshold has an explicit accessibility state');
assert.match(html,/removeAttribute\('tabindex'\)/,'revealed threshold becomes keyboard reachable');
assert.match(html,/setAttribute\('tabindex','-1'\)/,'erasing the score closes keyboard access');
assert.match(html,/e\.key\.toLowerCase\(\)==='a'&&thresholdOpen/,'revealed chamber has a keyboard route');
assert.match(html,/prefers-reduced-motion/,'threshold motion respects reduced-motion preference');
assert.doesNotMatch(html,/payment|checkout|subscribe|diagnosis|treatment|Mirror Cartographer/i,'independent surface avoids product, medical, and project-explanation language');

console.log('Afterbell threshold contract passed');