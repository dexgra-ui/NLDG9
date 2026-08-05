(function(){
 const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
 const storageKey=()=>`nldg-scripture-study-${pageKey()}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return{}}};
 const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch{}};
 const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const unique=items=>[...new Set((items||[]).map(item=>String(item||'').trim()).filter(Boolean))];
 const normalize=value=>String(value||'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
 const scripturePattern=/\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s+(?:of|the|[A-Z][a-z]+))*\s+\d+(?::\d+(?:[-–]\d+)?)?/g;
 const extract=text=>unique(String(text||'').match(scripturePattern)||[]);
 const bookOf=ref=>normalize(ref).replace(/\s+\d.*$/,'');
 const dataMap=()=>{
  const passages=window.NLDG_SCRIPTURE_DATA?.passages||{};
  return Object.fromEntries(Object.entries(passages).map(([key,value])=>[normalize(key),value]));
 };
 const lessonData=()=>{
  const studyId=document.body.dataset.studyPage;
  const title=document.querySelector('h1')?.textContent?.trim()||'Bible Study';
  if(studyId){
   const study=(window.NLDG_STUDIES||[]).find(item=>item.id===studyId)||{};
   const guide=window.NLDG_LEADER_GUIDES?.[studyId]||{};
   const visible=[...document.querySelectorAll('[class*="scripture"],[class*="verse"],.devo-ref')].map(node=>node.textContent).join(' ');
   const refs=unique([...(study.scripture||[]),...extract(visible),...(guide.connections||[]).flatMap(extract)]).slice(0,12);
   return {title,refs,background:guide.background||'',theology:guide.theology||[],connections:guide.connections||[]};
  }
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week)||{};
  const guide=lesson.leaderGuide||{};
  return {title:lesson.title||title,refs:lesson.scripture||[],background:(guide.background||[]).map(item=>typeof item==='string'?item:`${item.heading}: ${item.content}`).join('\n\n'),theology:guide.theology||[],connections:(lesson.resourceConnections||[]).map(item=>`${item.title}: ${item.detail}`)};
 };
 const studyRecord=(state,ref)=>state.studies?.[normalize(ref)]||{};
 const summary=(lesson,ref,record,info)=>[
  `SCRIPTURE STUDY: ${ref}`,
  info?.setting?`CONTEXT\n${info.setting}`:lesson.background?`CONTEXT\n${lesson.background}`:'',
  info?.themes?.length?`KEY THEMES\n${info.themes.join(', ')}`:'',
  record.keywords?.trim()?`KEY WORDS AND REPEATED IDEAS\n${record.keywords.trim()}`:'',
  record.observation?.trim()?`OBSERVATION\n${record.observation.trim()}`:'',
  record.interpretation?.trim()?`INTERPRETATION\n${record.interpretation.trim()}`:'',
  record.application?.trim()?`APPLICATION\n${record.application.trim()}`:'',
  record.questions?.trim()?`QUESTIONS TO REVISIT\n${record.questions.trim()}`:''
 ].filter(Boolean).join('\n\n');
 const copyText=async text=>{
  try{await navigator.clipboard.writeText(text);return true}catch{
   const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return ok;
  }
 };
 let overlay,lastTrigger,currentRef,saveTimer;
 const close=()=>{
  if(!overlay)return;
  overlay.hidden=true;document.body.classList.remove('scripture-panel-open');lastTrigger?.focus?.();
 };
 const open=trigger=>{
  lastTrigger=trigger||document.activeElement;
  build();overlay.hidden=false;document.body.classList.add('scripture-panel-open');overlay.querySelector('[data-scripture-close]').focus();
 };
 const build=()=>{
  const lesson=lessonData();
  const refs=lesson.refs.length?lesson.refs:['Add the primary Scripture reference to this lesson'];
  const state=read();
  currentRef=refs.includes(state.selected)?state.selected:refs[0];
  if(overlay)overlay.remove();
  overlay=document.createElement('div');overlay.className='scripture-study-overlay';overlay.hidden=true;
  overlay.innerHTML=`<section class="scripture-study-panel" role="dialog" aria-modal="true" aria-labelledby="scripture-study-title"><header class="scripture-study-header"><div><p class="kicker">Phase 4.5</p><h2 id="scripture-study-title">Scripture Study Panel</h2><p>${escapeHtml(lesson.title)}</p></div><button type="button" data-scripture-close>Close</button></header><div class="scripture-reference-strip" role="list" aria-label="Lesson passages">${refs.map(ref=>`<button type="button" role="listitem" data-scripture-ref="${escapeHtml(ref)}">${escapeHtml(ref)}</button>`).join('')}</div><nav class="scripture-study-tabs" role="tablist" aria-label="Scripture study steps"><button type="button" role="tab" data-scripture-tab="passage">Passage</button><button type="button" role="tab" data-scripture-tab="context">Context</button><button type="button" role="tab" data-scripture-tab="observe">Observe</button><button type="button" role="tab" data-scripture-tab="interpret">Interpret</button><button type="button" role="tab" data-scripture-tab="apply">Apply</button></nav><div class="scripture-study-content"><section data-scripture-panel="passage"><div class="scripture-panel-heading"><div><p class="kicker">Primary passage</p><h3 data-selected-reference></h3></div><div><button type="button" data-copy-reference>Copy Reference</button><a data-read-passage target="_blank" rel="noopener">Read Passage</a></div></div><div class="scripture-passage-card"><p>Read the full passage slowly in your preferred Bible translation. Notice the paragraph before it, the paragraph after it, and the repeated words within it.</p><div class="scripture-reading-rhythm"><span><strong>First reading</strong>What does the text say?</span><span><strong>Second reading</strong>What stands out or repeats?</span><span><strong>Third reading</strong>What response does it call for?</span></div></div><div class="scripture-related-links"><a href="scripture-index.html">Browse related NLDG studies</a><a href="ministry-assistant.html">Open the Scripture Study assistant</a></div></section><section data-scripture-panel="context"><div class="scripture-panel-heading"><div><p class="kicker">Read in context</p><h3>Setting, movement, and biblical themes</h3></div></div><div data-context-content></div></section><section data-scripture-panel="observe"><div class="scripture-panel-heading"><div><p class="kicker">Observation</p><h3>What is actually in the text?</h3><p>Record before explaining. Look for people, actions, contrasts, commands, promises, repeated words, and movement.</p></div><span data-scripture-status aria-live="polite"></span></div><label class="scripture-note-field"><strong>Key words and repeated ideas</strong><input type="text" data-scripture-field="keywords" placeholder="Words, phrases, images, or contrasts"></label><label class="scripture-note-field"><strong>Observations</strong><textarea rows="10" data-scripture-field="observation" placeholder="What do you see in the passage itself?"></textarea></label></section><section data-scripture-panel="interpret"><div class="scripture-panel-heading"><div><p class="kicker">Interpretation</p><h3>What did the passage communicate?</h3><p>Consider the author, audience, literary setting, larger biblical story, and how the passage points toward faithful understanding.</p></div><span data-scripture-status aria-live="polite"></span></div><div class="scripture-prompt-grid"><span>What problem or question is being addressed?</span><span>What does this reveal about God?</span><span>What does this reveal about people?</span><span>How does the surrounding context shape the meaning?</span></div><label class="scripture-note-field"><strong>Interpretation notes</strong><textarea rows="10" data-scripture-field="interpretation" placeholder="Explain the meaning without jumping ahead to application."></textarea></label><label class="scripture-note-field"><strong>Questions to revisit</strong><textarea rows="5" data-scripture-field="questions" placeholder="What requires more study or should be discussed with the group?"></textarea></label></section><section data-scripture-panel="apply"><div class="scripture-panel-heading"><div><p class="kicker">Application</p><h3>How should truth become faithful action?</h3><p>Move from general agreement to a response that is specific, wise, and rooted in grace.</p></div><span data-scripture-status aria-live="polite"></span></div><div class="scripture-prompt-grid"><span>What should be believed or remembered?</span><span>What should be confessed or changed?</span><span>Who should be loved, served, protected, or encouraged?</span><span>What is one next faithful step?</span></div><label class="scripture-note-field"><strong>Application and prayer response</strong><textarea rows="9" data-scripture-field="application" placeholder="Write a concrete response for yourself and the group."></textarea></label><div class="scripture-notebook-actions"><button type="button" data-add-main>Add Study to Teaching Notebook</button><button type="button" data-add-discussion>Add Questions to Discussion Notes</button><button type="button" data-copy-study>Copy Scripture Study</button><span data-notebook-status aria-live="polite"></span></div></section></div></section>`;
  document.body.appendChild(overlay);
  const tabs=[...overlay.querySelectorAll('[data-scripture-tab]')],panels=[...overlay.querySelectorAll('[data-scripture-panel]')];
  const setTab=tab=>{tabs.forEach(button=>{const active=button.dataset.scriptureTab===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});panels.forEach(panel=>panel.hidden=panel.dataset.scripturePanel!==tab);write({...read(),tab})};
  tabs.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.scriptureTab)));
  setTab(tabs.some(button=>button.dataset.scriptureTab===state.tab)?state.tab:'passage');
  const save=()=>{
   const next=read(),studies={...(next.studies||{})},record={};
   overlay.querySelectorAll('[data-scripture-field]').forEach(field=>record[field.dataset.scriptureField]=field.value);
   studies[normalize(currentRef)]=record;write({...next,selected:currentRef,studies,updated:Date.now()});
   overlay.querySelectorAll('[data-scripture-status]').forEach(node=>node.textContent='Saved');
   setTimeout(()=>overlay?.querySelectorAll('[data-scripture-status]').forEach(node=>node.textContent=''),1200);
  };
  const loadRef=ref=>{
   currentRef=ref;const info=dataMap()[normalize(ref)];const record=studyRecord(read(),ref);
   overlay.querySelectorAll('[data-scripture-ref]').forEach(button=>button.setAttribute('aria-current',String(button.dataset.scriptureRef===ref)));
   overlay.querySelector('[data-selected-reference]').textContent=ref;
   overlay.querySelector('[data-read-passage]').href=`https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=NIV`;
   const context=overlay.querySelector('[data-context-content]');
   if(info){context.innerHTML=`<div class="scripture-context-grid"><article><span>Book and genre</span><strong>${escapeHtml(info.book||bookOf(ref))}</strong><p>${escapeHtml(info.genre||'')}</p></article><article><span>Historical period</span><strong>${escapeHtml(info.period||'Biblical setting')}</strong><p>${escapeHtml(info.timeline||'')}</p></article><article class="wide"><span>Immediate setting</span><p>${escapeHtml(info.setting||'')}</p></article><article><span>Passage movement</span><ol>${(info.movement||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></article><article><span>Key themes</span><div class="scripture-theme-list">${(info.themes||[]).map(item=>`<small>${escapeHtml(item)}</small>`).join('')}</div></article><article class="wide"><span>Cross-references</span><div class="scripture-cross-list">${(info.cross||[]).map(item=>`<button type="button" data-copy-cross="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div></article><article class="wide"><span>Study questions</span><ul>${(info.questions||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></article></div>`}else{context.innerHTML=`<div class="scripture-context-grid"><article class="wide"><span>Leader background</span><p>${escapeHtml(lesson.background||'Read the full chapter and identify the author, audience, setting, repeated ideas, and movement of the passage.')}</p></article><article><span>Theological themes</span><ul>${lesson.theology.length?lesson.theology.map(item=>`<li>${escapeHtml(item)}</li>`).join(''):'<li>What does this reveal about God?</li><li>What does this reveal about people?</li><li>How does grace lead to faithful response?</li>'}</ul></article><article><span>Scripture connections</span><ul>${lesson.connections.length?lesson.connections.map(item=>`<li>${escapeHtml(item)}</li>`).join(''):'<li>Read the surrounding chapter.</li><li>Trace the major theme across Scripture.</li><li>Connect the passage to the life and teaching of Jesus.</li>'}</ul></article></div>`}
   overlay.querySelectorAll('[data-copy-cross]').forEach(button=>button.addEventListener('click',async()=>{await copyText(button.dataset.copyCross);button.textContent='Copied';setTimeout(()=>button.textContent=button.dataset.copyCross,1000)}));
   overlay.querySelectorAll('[data-scripture-field]').forEach(field=>field.value=record[field.dataset.scriptureField]||'');
   write({...read(),selected:ref});
  };
  overlay.querySelectorAll('[data-scripture-ref]').forEach(button=>button.addEventListener('click',()=>{save();loadRef(button.dataset.scriptureRef)}));
  overlay.querySelectorAll('[data-scripture-field]').forEach(field=>field.addEventListener('input',()=>{overlay.querySelectorAll('[data-scripture-status]').forEach(node=>node.textContent='Saving…');clearTimeout(saveTimer);saveTimer=setTimeout(save,450)}));
  overlay.querySelector('[data-copy-reference]').addEventListener('click',async event=>{await copyText(currentRef);event.currentTarget.textContent='Copied';setTimeout(()=>event.currentTarget.textContent='Copy Reference',1000)});
  overlay.querySelector('[data-copy-study]').addEventListener('click',async()=>{save();const info=dataMap()[normalize(currentRef)],record=studyRecord(read(),currentRef);await copyText(summary(lesson,currentRef,record,info));const status=overlay.querySelector('[data-notebook-status]');status.textContent='Scripture study copied.';setTimeout(()=>status.textContent='',1400)});
  overlay.querySelector('[data-add-main]').addEventListener('click',()=>{save();const info=dataMap()[normalize(currentRef)],record=studyRecord(read(),currentRef);const ok=window.NLDGTeachingNotebook?.append?.('main-points',summary(lesson,currentRef,record,info));const status=overlay.querySelector('[data-notebook-status]');status.textContent=ok?'Added to Main Teaching Points.':'Teaching Notebook is not available.';setTimeout(()=>status.textContent='',1800)});
  overlay.querySelector('[data-add-discussion]').addEventListener('click',()=>{save();const record=studyRecord(read(),currentRef);const text=record.questions?.trim()||dataMap()[normalize(currentRef)]?.questions?.join('\n')||'';const ok=text&&window.NLDGTeachingNotebook?.append?.('discussion',`Scripture Study Questions: ${currentRef}\n${text}`);const status=overlay.querySelector('[data-notebook-status]');status.textContent=ok?'Added to Discussion Reminders.':'Add questions before sending them to the notebook.';setTimeout(()=>status.textContent='',1800)});
  overlay.querySelector('[data-scripture-close]').addEventListener('click',close);overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
  loadRef(currentRef);
 };
 document.addEventListener('keydown',event=>{
  if(!overlay||overlay.hidden)return;
  if(event.key==='Escape'){event.preventDefault();close();return}
  if(event.key!=='Tab')return;
  const focusable=[...overlay.querySelectorAll('button,a,input,textarea,[tabindex]:not([tabindex="-1"])')].filter(node=>!node.disabled&&!node.hidden&&node.offsetParent!==null);
  if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 const attach=panel=>{
  if(!panel||panel.dataset.scripturePanelReady==='true')return;panel.dataset.scripturePanelReady='true';
  const button=document.createElement('button');button.type='button';button.className='scripture-study-launch';button.innerHTML='<span>Scripture Study</span><small>Context, observation, meaning, and application</small>';button.addEventListener('click',()=>open(button));
  const heading=panel.querySelector('.leader-guide-heading,.v2-leader-intro')||panel;heading.appendChild(button);
 };
 const find=()=>document.querySelectorAll('.expanded-leader-guide,.teaching-view-panel,.v2-leader-guide,.v2-teaching-view').forEach(attach);
 find();new MutationObserver(find).observe(document.body,{childList:true,subtree:true});
 window.NLDGScriptureStudy={open:()=>open(document.activeElement),read:()=>read()};
})();