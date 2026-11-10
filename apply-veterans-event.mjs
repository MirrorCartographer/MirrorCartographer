import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const site = new URL('./', import.meta.url).pathname;
const css = '<link rel="stylesheet" href="/MirrorCartographer/mc-veterans-event.css">';
const js = '<script src="/MirrorCartographer/mc-veterans-event.js" defer></script>';
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}
let changed = 0;
for (const file of await walk(site)) {
  let html = await readFile(file, 'utf8');
  if (!html.includes('</head>') || html.includes('mc-veterans-event.js')) continue;
  html = html.replace('</head>', css + '\\n' + js + '\\n</head>');
  await writeFile(file, html);
  changed++;
}
console.log('Veterans Day event integrated into ' + changed + ' HTML pages.');
