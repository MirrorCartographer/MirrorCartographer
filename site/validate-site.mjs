import{readFileSync}from'node:fs';import{Script}from'node:vm';
const html=readFileSync('site/index.html','utf8');
const required=['<title>Mirror Cartographer — The Living Atlas</title>','id="atlas"','id="worlds"','id="research"','id="library"','id="repositories"','id="search"','id="category"','id="results"','https://chatgpt.com/','mirror-cartographer-ui'];
const missing=required.filter(x=>!html.includes(x));if(missing.length)throw Error('Missing interface requirements: '+missing.join(', '));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);if(duplicates.length)throw Error('Duplicate HTML IDs: '+[...new Set(duplicates)].join(', '));
const known=new Set(ids);const broken=[...html.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]).filter(x=>x&&!known.has(x));if(broken.length)throw Error('Broken in-page links: '+[...new Set(broken)].join(', '));
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);if(scripts.length!==1)throw Error('Expected one inline application script; found '+scripts.length);new Script(scripts[0],{filename:'site-inline-app.js'});
console.log(JSON.stringify({result:'PASS',requiredChecks:required.length,uniqueIds:ids.length,internalLinks:'PASS',inlineScriptSyntax:'PASS'},null,2));