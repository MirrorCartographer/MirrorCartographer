(() => {
  if (window.__MC_ROOMWAY_MOUNTED__) return;
  window.__MC_ROOMWAY_MOUNTED__ = true;
  const script = document.currentScript;
  if (!script?.src) return;
  const manifestUrl = new URL('roomway-manifest.json', script.src);
  const siteBase = new URL('../', manifestUrl);
  const hrefFor = item => new URL(String(item.href || '').replace(/^\.\//, ''), siteBase).href;
  const style = document.createElement('style');
  style.id = 'mc-roomway-style';
  style.textContent = `
    #mc-roomway-launch{position:fixed;right:20px;bottom:20px;z-index:2147483000;border:1px solid #c5a77b;background:rgba(18,20,18,.94);color:#f1e7d5;padding:12px 16px;border-radius:999px;font:600 10px/1.2 ui-monospace,monospace;letter-spacing:.12em;box-shadow:0 8px 34px #0009;backdrop-filter:blur(14px);cursor:pointer}
    #mc-roomway-launch:hover{background:#2b352b;border-color:#d8c397;transform:translateY(-2px)}
    #mc-roomway-dialog{position:fixed;inset:0;z-index:2147483001;display:none;background:rgba(7,9,9,.94);color:#eee6d8;backdrop-filter:blur(20px);overflow:auto;padding:clamp(16px,4vw,48px);font-family:ui-sans-serif,system-ui,sans-serif}
    #mc-roomway-dialog[open]{display:block}
    #mc-roomway-shell{max-width:1100px;margin:0 auto}
    .mc-roomway-head{display:flex;justify-content:space-between;align-items:start;gap:20px;border-bottom:1px solid #d0b27c55;padding-bottom:18px}
    .mc-roomway-kicker{font:10px ui-monospace,monospace;letter-spacing:.18em;color:#d4b77e}
    .mc-roomway-title{font:clamp(2.5rem,7vw,5rem)/.9 Georgia,serif;margin:12px 0}
    .mc-roomway-note{color:#bdb6a8;max-width:46rem;font-size:13px;line-height:1.6}
    #mc-roomway-close{border:1px solid #b89b72;background:#171b18;color:#eee6d8;border-radius:50%;width:42px;height:42px;font-size:23px;cursor:pointer;flex:none}
    .mc-roomway-controls{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}
    #mc-roomway-search{flex:1;min-width:220px;background:#141916;border:1px solid #6d745f;color:#f4ecdc;padding:12px 14px;border-radius:6px;font:13px ui-monospace,monospace}
    .mc-roomway-filter{background:#151a17;color:#cfc8b9;border:1px solid #535c4c;border-radius:999px;padding:9px 12px;font:10px ui-monospace,monospace;letter-spacing:.08em;cursor:pointer}
    .mc-roomway-filter[aria-pressed=true]{background:#d4b77e;color:#1a1a16;border-color:#d4b77e}
    #mc-roomway-count{color:#b6a98f;font:10px ui-monospace,monospace;letter-spacing:.12em;margin:8px 0 14px}
    #mc-roomway-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .mc-roomway-card{display:flex;flex-direction:column;gap:10px;min-height:155px;padding:17px;text-decoration:none;color:#eee6d8;border:1px solid #ffffff24;background:linear-gradient(145deg,#1a2420,#17131b);border-radius:8px;transition:transform .2s,border-color .2s}
    .mc-roomway-card:hover{transform:translateY(-3px);border-color:#d4b77e}
    .mc-roomway-card small{font:9px ui-monospace,monospace;letter-spacing:.12em;color:#d4b77e}
    .mc-roomway-card strong{font:21px/1.05 Georgia,serif;font-weight:400}
    .mc-roomway-card span{font-size:12px;line-height:1.45;color:#c1bbae}
    .mc-roomway-card b{margin-top:auto;font:9px ui-monospace,monospace;letter-spacing:.1em;color:#a8c2a2}
    .mc-roomway-footer{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0 12px;padding-top:18px;border-top:1px solid #ffffff25}
    .mc-roomway-footer a{color:#e2c28d;font:10px ui-monospace,monospace;letter-spacing:.1em;text-decoration:none;padding:10px 12px;border:1px solid #d4b77e55;border-radius:999px}
    @media(max-width:760px){#mc-roomway-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mc-roomway-head{align-items:center}}
    @media(max-width:480px){#mc-roomway-launch{right:12px;bottom:12px;padding:11px 13px}#mc-roomway-grid{grid-template-columns:1fr}.mc-roomway-card{min-height:125px}#mc-roomway-dialog{padding:14px}}
    @media(prefers-reduced-motion:reduce){.mc-roomway-card,#mc-roomway-launch{transition:none!important}}
  `;
  document.head.append(style);
  const launch = document.createElement('button');
  launch.id = 'mc-roomway-launch';
  launch.type = 'button';
  launch.textContent = '✳ ROOMWAY · 61 DOORS';
  launch.setAttribute('aria-haspopup','dialog');
  launch.setAttribute('aria-controls','mc-roomway-dialog');
  const dialog = document.createElement('section');
  dialog.id = 'mc-roomway-dialog';
  dialog.setAttribute('role','dialog');
  dialog.setAttribute('aria-modal','true');
  dialog.setAttribute('aria-labelledby','mc-roomway-title');
  dialog.innerHTML = `
    <div id="mc-roomway-shell">
      <header class="mc-roomway-head">
        <div><p class="mc-roomway-kicker">MIRROR CARTOGRAPHER / THE LIVING ATLAS</p><h1 class="mc-roomway-title" id="mc-roomway-title">Find a door.</h1><p class="mc-roomway-note">Forty named rooms and twenty-one side rooms and exhibits. Every published door stays directly reachable from here.</p></div>
        <button id="mc-roomway-close" type="button" aria-label="Close room directory">×</button>
      </header>
      <div class="mc-roomway-controls" id="mc-roomway-filters"><input id="mc-roomway-search" type="search" placeholder="Search rooms, tools, worlds…" aria-label="Search rooms"></div>
      <p id="mc-roomway-count" role="status">LOADING THE ATLAS…</p>
      <div id="mc-roomway-grid"></div>
      <footer class="mc-roomway-footer"><a id="mc-roomway-home" href="#">RETURN TO THE ATLAS</a><a id="mc-roomway-between" href="#">VISIT THE CHARACTER ATELIER</a><a id="mc-roomway-field" href="#">10 PROCEDURAL EXPERIMENTS</a></footer>
    </div>`;
  document.body.append(launch,dialog);
  const close = () => { dialog.removeAttribute('open'); dialog.style.display='none'; launch.focus(); };
  const open = () => { dialog.setAttribute('open',''); dialog.style.display='block'; document.getElementById('mc-roomway-search').focus(); };
  launch.addEventListener('click',open);
  dialog.querySelector('#mc-roomway-close').addEventListener('click',close);
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close();}
    if(event.key==='Tab'){
      const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')];
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  const baseLink=(suffix)=>new URL(suffix,siteBase).href;
  dialog.querySelector('#mc-roomway-home').href=baseLink('atlas/');
  dialog.querySelector('#mc-roomway-between').href=baseLink('atlas/rooms/character-atelier/');
  dialog.querySelector('#mc-roomway-field').href=baseLink('atlas/rooms/experiments/');
  fetch(manifestUrl,{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('Atlas manifest unavailable');return response.json();}).then(manifest=>{
    const entries=[
      ...(manifest.rooms||[]).map(item=>({...item,description:item.interaction||item.visual||'A distinct room in the Living Atlas.',group:'ROOM'})),
      ...(manifest.annexes||[]).map(item=>({...item,description:item.description||'A side room in the Living Atlas.',group:'ANNEX'}))
    ];
    const filters=[...new Set(entries.map(item=>item.kind).filter(Boolean))].sort();
    const filterHost=dialog.querySelector('#mc-roomway-filters');
    let active='all';
    for(const kind of ['all',...filters]){
      const button=document.createElement('button');button.type='button';button.className='mc-roomway-filter';button.textContent=kind==='all'?'ALL DOORS':kind.toUpperCase();button.setAttribute('aria-pressed',String(kind==='all'));
      button.addEventListener('click',()=>{active=kind;[...filterHost.querySelectorAll('button')].forEach(node=>node.setAttribute('aria-pressed',String(node===button)));render();});
      filterHost.append(button);
    }
    const search=dialog.querySelector('#mc-roomway-search');
    const grid=dialog.querySelector('#mc-roomway-grid');
    const count=dialog.querySelector('#mc-roomway-count');
    function render(){
      const q=search.value.trim().toLowerCase();
      const visible=entries.filter(item=>(active==='all'||item.kind===active)&&(!q||[item.name,item.kind,item.description,item.visual,item.interaction].join(' ').toLowerCase().includes(q)));
      count.textContent='SHOWING '+visible.length+' OF '+entries.length+' PUBLISHED DOORS';
      grid.replaceChildren();
      for(const item of visible){
        const link=document.createElement('a');link.className='mc-roomway-card';link.href=hrefFor(item);
        const small=document.createElement('small');small.textContent=(item.group||'ROOM')+' / '+String(item.id||'').toUpperCase()+' / '+String(item.kind||'').toUpperCase();
        const title=document.createElement('strong');title.textContent=item.name;
        const description=document.createElement('span');description.textContent=item.description;
        const status=document.createElement('b');status.textContent=item.implementation_status||item.status||'PUBLISHED DESTINATION';
        link.append(small,title,description,status);grid.append(link);
      }
      if(!visible.length){const empty=document.createElement('p');empty.textContent='No door matches that search. Clear the search or choose another wing.';grid.append(empty);}
    }
    search.addEventListener('input',render);
    render();
    launch.textContent='✳ ROOMWAY · '+entries.length+' DOORS';
  }).catch(error=>{
    dialog.querySelector('#mc-roomway-count').textContent='ROOM DIRECTORY UNAVAILABLE · OPEN THE ATLAS INDEX';
    const link=document.createElement('a');link.href=baseLink('atlas/rooms/');link.textContent='OPEN THE ROOM DIRECTORY';link.className='mc-roomway-card';dialog.querySelector('#mc-roomway-grid').append(link);
  });
})();