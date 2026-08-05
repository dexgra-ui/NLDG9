(function(){
  const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
  const storageKey=()=>`nldg-leader-resources-${pageKey()}`;
  const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}');}catch{return {};}};
  const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value));}catch{}};
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const unique=items=>[...new Set((items||[]).map(item=>String(item||'').trim()).filter(Boolean))];
  const scripturePattern=/\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+\d+(?::\d+(?:[-–]\d+)?)?/g;
  const extractReferences=text=>unique(String(text||'').match(scripturePattern)||[]);
  const flattenApplications=value=>{
    if(Array.isArray(value))return value;
    if(!value||typeof value!=='object')return [];
    return Object.entries(value).flatMap(([group,items])=>(items||[]).map(item=>`${group.charAt(0).toUpperCase()+group.slice(1)}: ${item}`));
  };
  const getPageData=()=>{
    const studyId=document.body.dataset.studyPage;
    const title=document.querySelector('h1')?.textContent?.trim()||'Bible Study';
    if(studyId){
      const guide=window.NLDG_LEADER_GUIDES?.[studyId]||{};
      const visibleScripture=[...document.querySelectorAll('[class*="scripture"],[class*="verse"],.devo-ref')].map(node=>node.textContent).join(' ');
      const connectionRefs=(guide.connections||[]).flatMap(extractReferences);
      const primary=unique([...extractReferences(visibleScripture),...connectionRefs]).slice(0,10);
      return {
        title,
        primary,
        connections:guide.connections||[],
        background:guide.background?[{heading:'Biblical and historical background',content:guide.background}]:[],
        theology:guide.theology||[],
        preparation:['Read the main passage in context.','Review the lesson Big Idea and application.','Pray for the people who will participate.'],
        resourceConnections:[],
        applications:guide.application||[]
      };
    }
    const week=Number(new URLSearchParams(location.search).get('week')||0);
    const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
    const guide=lesson?.leaderGuide||{};
    return {
      title:lesson?.title||title,
      primary:lesson?.scripture||[],
      connections:(lesson?.resourceConnections||[]).map(item=>`${item.title}: ${item.detail}`),
      background:(guide.background||[]).map(item=>typeof item==='string'?{heading:'Background',content:item}:item),
      theology:guide.theology||[],
      preparation:guide.preparation||[],
      resourceConnections:lesson?.resourceConnections||[],
      applications:flattenApplications(guide.ministryApplications)
    };
  };
  const libraryLinks=[
    {href:'scripture-index.html',label:'Browse by Scripture',detail:'Find studies connected to a Bible passage.'},
    {href:'articles.html',label:'Articles and Reflections',detail:'Add theological and practical reading to preparation.'},
    {href:'devotionals.html',label:'Devotional Center',detail:'Choose a short reflection for opening or follow-up.'},
    {href:'studies.html',label:'Bible Study Library',detail:'Connect this lesson with another curriculum.'},
    {href:'ministry-tools.html',label:'Ministry Tools',detail:'Open leader, mentoring, and group resources.'},
    {href:'play.html',label:'Bible Games',detail:'Add a review activity or group icebreaker.'}
  ];
  const copyText=async text=>{
    try{await navigator.clipboard.writeText(text);return true;}
    catch{
      const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return ok;
    }
  };
  const buildSummary=(data,state)=>{
    const notes=state.notes||{};
    const blocks=[
      `LEADER RESOURCE SUMMARY\n${data.title}`,
      data.primary.length?`PRIMARY SCRIPTURE\n${data.primary.join('\n')}`:'',
      data.connections.length?`SCRIPTURE AND LESSON CONNECTIONS\n${data.connections.join('\n')}`:'',
      data.background.length?`BIBLICAL AND HISTORICAL CONTEXT\n${data.background.map(item=>`${item.heading||'Background'}\n${item.content||''}`).join('\n\n')}`:'',
      data.theology.length?`THEOLOGICAL THEMES\n${data.theology.join('\n')}`:'',
      data.preparation.length?`LEADER PREPARATION\n${data.preparation.join('\n')}`:'',
      data.applications.length?`APPLICATION IDEAS\n${data.applications.join('\n')}`:'',
      notes.chosen?`THE CHOSEN OR VISUAL MEDIA CONNECTION\n${notes.chosen}`:'',
      notes.context?`MAP AND TIMELINE NOTES\n${notes.context}`:'',
      notes.extra?`ADDITIONAL RESOURCE IDEAS\n${notes.extra}`:''
    ];
    return blocks.filter(Boolean).join('\n\n');
  };
  let overlay,lastTrigger;
  const renderDrawer=()=>{
    const data=getPageData();
    const state=read();
    const selected=state.tab||'scripture';
    const count=data.primary.length+data.connections.length+data.background.length+data.theology.length+data.preparation.length+libraryLinks.length;
    if(overlay)overlay.remove();
    overlay=document.createElement('div');
    overlay.className='leader-resource-overlay';
    overlay.hidden=true;
    overlay.innerHTML=`<section class="leader-resource-drawer" role="dialog" aria-modal="true" aria-labelledby="leader-resource-title"><header class="leader-resource-header"><div><p class="kicker">Phase 4.4</p><h2 id="leader-resource-title">Leader Resources</h2><p>${escapeHtml(data.title)}</p></div><button type="button" class="leader-resource-close" data-resource-close aria-label="Close leader resources">Close</button></header><div class="leader-resource-count"><strong>${count}</strong><span>resources and preparation prompts gathered for this lesson</span></div><nav class="leader-resource-tabs" role="tablist" aria-label="Leader resource categories"><button type="button" role="tab" data-resource-tab="scripture">Scripture</button><button type="button" role="tab" data-resource-tab="context">Context</button><button type="button" role="tab" data-resource-tab="connections">Connections</button><button type="button" role="tab" data-resource-tab="extras">Teaching Extras</button><button type="button" role="tab" data-resource-tab="export">Export</button></nav><div class="leader-resource-content"><section data-resource-panel="scripture"><div class="resource-section-heading"><div><p class="kicker">Primary passages</p><h3>Keep the Bible in front of the lesson.</h3></div><button type="button" data-copy-scripture>Copy References</button></div><div class="resource-reference-grid">${data.primary.length?data.primary.map(ref=>`<button type="button" data-copy-reference="${escapeHtml(ref)}"><strong>${escapeHtml(ref)}</strong><span>Copy reference</span></button>`).join(''):'<p class="resource-empty">No primary references were detected on this page.</p>'}</div><div class="resource-card"><h4>Scripture connections</h4>${data.connections.length?`<ul>${data.connections.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:'<p>No additional Scripture connections are listed yet.</p>'}<a href="scripture-index.html">Browse the Scripture library</a></div></section><section data-resource-panel="context"><div class="resource-section-heading"><div><p class="kicker">Biblical context</p><h3>Background, theology, and preparation.</h3></div></div><div class="resource-card-grid">${data.background.length?data.background.map(item=>`<article class="resource-card"><h4>${escapeHtml(item.heading||'Background')}</h4><p>${escapeHtml(item.content||'')}</p></article>`).join(''):'<article class="resource-card"><h4>Context prompt</h4><p>Identify the speaker, audience, setting, repeated words, and movement of the passage.</p></article>'}<article class="resource-card"><h4>Theological themes</h4>${data.theology.length?`<ul>${data.theology.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:'<p>Ask what this passage reveals about God, people, grace, and faithful response.</p>'}</article><article class="resource-card"><h4>Before you teach</h4><ol>${data.preparation.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></article></div></section><section data-resource-panel="connections"><div class="resource-section-heading"><div><p class="kicker">NLDG connections</p><h3>Continue preparation without losing your place.</h3></div></div>${data.resourceConnections.length?`<div class="resource-connection-list">${data.resourceConnections.map(item=>`<article class="resource-card"><span>${escapeHtml(item.label||'Related resource')}</span><h4>${escapeHtml(item.title||'Connection')}</h4><p>${escapeHtml(item.detail||'')}</p></article>`).join('')}</div>`:''}<div class="resource-library-grid">${libraryLinks.map(item=>`<a href="${item.href}"><strong>${item.label}</strong><span>${item.detail}</span></a>`).join('')}</div>${data.applications.length?`<div class="resource-card"><h4>Application pathways</h4><ul>${data.applications.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`:''}</section><section data-resource-panel="extras"><div class="resource-section-heading"><div><p class="kicker">Private preparation notes</p><h3>Add resources unique to your group.</h3><p>These notes stay on this device and never appear in Participant View.</p></div><span data-extra-status aria-live="polite"></span></div><div class="resource-extra-grid"><label><strong>The Chosen or visual-media connection</strong><span>Episode, scene, quotation, or discussion connection</span><textarea rows="6" data-resource-note="chosen" placeholder="Describe how the scene supports the biblical lesson without replacing Scripture.">${escapeHtml(state.notes?.chosen||'')}</textarea></label><label><strong>Map and timeline notes</strong><span>Locations, travel, rulers, dates, or sequence of events</span><textarea rows="6" data-resource-note="context" placeholder="Record geography or timeline details to explain while teaching.">${escapeHtml(state.notes?.context||'')}</textarea></label><label><strong>Additional resource ideas</strong><span>Illustrations, articles, handouts, videos, or activities</span><textarea rows="6" data-resource-note="extra" placeholder="Add anything you want available during preparation.">${escapeHtml(state.notes?.extra||'')}</textarea></label></div></section><section data-resource-panel="export"><div class="resource-section-heading"><div><p class="kicker">Take it with you</p><h3>Copy or download the resource summary.</h3></div></div><div class="resource-export-actions"><button type="button" data-copy-summary>Copy Summary</button><button type="button" data-download-summary>Download Text File</button><span data-export-status aria-live="polite"></span></div><pre class="resource-summary-preview" data-summary-preview>${escapeHtml(buildSummary(data,state))}</pre></section></div></section>`;
    document.body.appendChild(overlay);
    const tabs=[...overlay.querySelectorAll('[data-resource-tab]')];
    const panels=[...overlay.querySelectorAll('[data-resource-panel]')];
    const setTab=tab=>{
      tabs.forEach(button=>{const active=button.dataset.resourceTab===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
      panels.forEach(panel=>panel.hidden=panel.dataset.resourcePanel!==tab);
      write({...read(),tab});
    };
    tabs.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.resourceTab)));
    setTab(tabs.some(button=>button.dataset.resourceTab===selected)?selected:'scripture');
    overlay.querySelector('[data-resource-close]').addEventListener('click',closeDrawer);
    overlay.addEventListener('click',event=>{if(event.target===overlay)closeDrawer();});
    overlay.querySelectorAll('[data-copy-reference]').forEach(button=>button.addEventListener('click',async()=>{await copyText(button.dataset.copyReference);button.querySelector('span').textContent='Copied';setTimeout(()=>button.querySelector('span').textContent='Copy reference',1200);}));
    overlay.querySelector('[data-copy-scripture]').addEventListener('click',async event=>{await copyText(data.primary.join('\n'));event.currentTarget.textContent='References Copied';setTimeout(()=>event.currentTarget.textContent='Copy References',1200);});
    let noteTimer;
    overlay.querySelectorAll('[data-resource-note]').forEach(field=>field.addEventListener('input',()=>{clearTimeout(noteTimer);const status=overlay.querySelector('[data-extra-status]');status.textContent='Saving...';noteTimer=setTimeout(()=>{const notes={...(read().notes||{})};overlay.querySelectorAll('[data-resource-note]').forEach(input=>notes[input.dataset.resourceNote]=input.value);write({...read(),notes,updated:Date.now()});status.textContent='Notes saved.';overlay.querySelector('[data-summary-preview]').textContent=buildSummary(data,read());setTimeout(()=>status.textContent='',1400);},400);}));
    overlay.querySelector('[data-copy-summary]').addEventListener('click',async()=>{await copyText(buildSummary(data,read()));const status=overlay.querySelector('[data-export-status]');status.textContent='Summary copied.';setTimeout(()=>status.textContent='',1400);});
    overlay.querySelector('[data-download-summary]').addEventListener('click',()=>{const blob=new Blob([buildSummary(data,read())],{type:'text/plain;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`${pageKey()}-leader-resources.txt`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),0);const status=overlay.querySelector('[data-export-status]');status.textContent='Text file created.';setTimeout(()=>status.textContent='',1400);});
  };
  const openDrawer=trigger=>{
    lastTrigger=trigger||document.activeElement;
    renderDrawer();
    overlay.hidden=false;
    document.body.classList.add('leader-resources-open');
    overlay.querySelector('[data-resource-close]').focus();
  };
  const closeDrawer=()=>{
    if(!overlay)return;
    overlay.hidden=true;
    document.body.classList.remove('leader-resources-open');
    lastTrigger?.focus?.();
  };
  const onKey=event=>{
    if(!overlay||overlay.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeDrawer();return;}
    if(event.key!=='Tab')return;
    const focusable=[...overlay.querySelectorAll('button,a,textarea,[tabindex]:not([tabindex="-1"])')].filter(node=>!node.disabled&&!node.hidden&&node.offsetParent!==null);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',onKey);
  const attach=panel=>{
    if(!panel||panel.dataset.resourceDrawerReady==='true')return;
    panel.dataset.resourceDrawerReady='true';
    const button=document.createElement('button');
    button.type='button';
    button.className='leader-resource-launch';
    button.innerHTML='<span>Leader Resources</span><small>Scripture, context, links, and extras</small>';
    button.addEventListener('click',()=>openDrawer(button));
    const heading=panel.querySelector('.leader-guide-heading,.v2-leader-intro')||panel;
    heading.appendChild(button);
  };
  const find=()=>document.querySelectorAll('.expanded-leader-guide,.teaching-view-panel,.v2-leader-guide,.v2-teaching-view').forEach(attach);
  find();
  new MutationObserver(find).observe(document.body,{childList:true,subtree:true});
  window.NLDGLeaderResources={open:()=>openDrawer(document.activeElement)};
})();
