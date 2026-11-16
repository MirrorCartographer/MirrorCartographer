import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve('site');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.isFile()&&e.name.endsWith('.html')?[join(dir,e.name)]:[])}
export function insertBridge(html,path,siteRoot=root){
 if(!/<\/body>/i.test(html)||/data-mc-maze-return/.test(html))return html;
 const file=resolve(siteRoot,path),index=resolve(siteRoot,'index.html');
 if(file===index||path.replaceAll('\\','/').startsWith('legacy-entrance/'))return html;
 const toRoot=relative(dirname(file),index).split(sep).join('/');
 const href=toRoot.startsWith('.')?toRoot:'./'+toRoot;
 const css='<style data-mc-maze-return>.mc-maze-return{position:fixed;z-index:2147483000;left:max(10px,env(safe-area-inset-left));bottom:max(10px,env(safe-area-inset-bottom));display:grid;place-items:center;width:43px;height:43px;color:#d3ee53!important;background:#18251feb!important;border:2px double #bdb58c!important;box-shadow:3px 4px #74263db8!important;transform:rotate(-9deg);font:30px Georgia,serif!important;text-decoration:none!important;opacity:.86;touch-action:manipulation}.mc-maze-return:hover,.mc-maze-return:focus-visible{opacity:1;transform:rotate(3deg) scale(1.13);outline:2px solid #effc97;outline-offset:3px}@media(prefers-reduced-motion:reduce){.mc-maze-return{transition:none!important}}</style>';
 const link=`<a data-mc-maze-return class="mc-maze-return" href="${href}" aria-label="Return to the living labyrinth" title="Return to the country">✳</a>`;
 const injected=/<\/head>/i.test(html)?html.replace(/<\/head>/i,css+'</head>'):css+html;
 return injected.replace(/<\/body>/i,link+'</body>');
}
export function run(rootDir=root){let total=0;for(const file of walk(rootDir)){const path=relative(rootDir,file).split(sep).join('/'),html=readFileSync(file,'utf8');if(!html.includes('</body>'))continue;const changed=insertBridge(html,path,rootDir);if(changed!==html){writeFileSync(file,changed);total++}}return total}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify({labyrinthReturnBridges:run()}));