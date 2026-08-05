(function(){
 const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
 const storageKey=()=>`nldg-presentation-${pageKey()}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return{}}};
 const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch{}};
 const makeSlides=panel=>{
  const title=document.querySelector('h1')?.textContent?.trim()||panel.querySelector('h2')?.textContent?.trim()||'Teaching Session';
  const slides=[{kicker:'Teaching Session',title,body:'Use the arrow keys or spacebar to move through the lesson.'}];
  const candidates=[...panel.querySelectorAll('section')].filter(section=>!section.classList.contains('teaching-dashboard')&&!section.classList.contains('presentation-launch')&&!section.classList.contains('teaching-notebook'));
  candidates.forEach(section=>{
   const heading=section.querySelector('h2,h3')?.textContent?.trim();
   if(!heading)return;
   const items=[...section.querySelectorAll(':scope > p,:scope > ol > li,:scope > ul > li,:scope > div > p,:scope > div > strong')].map(node=>node.textContent.trim()).filter(Boolean).slice(0,8);
   slides.push({kicker:'Teaching View',title:heading,body:items.length?items.join('\n'):section.textContent.replace(heading,'').trim().slice(0,700)});
  });
  return slides;
 };
 const attach=panel=>{
  if(!panel||panel.dataset.presentationReady==='true')return;
  panel.dataset.presentationReady='true';
  const launch=document.createElement('section');
  launch.className='presentation-launch';
  launch.innerHTML='<div><p class="kicker">Presentation Mode</p><h3>Teach on a TV or projector</h3><p>Open a distraction-free, large-text presentation with keyboard controls and private speaker notes.</p></div><button type="button" data-open-presentation>Start Presentation</button>';
  const dashboard=panel.querySelector('.teaching-dashboard');
  dashboard?.insertAdjacentElement('afterend',launch);
  if(!dashboard)panel.prepend(launch);
  launch.querySelector('[data-open-presentation]').addEventListener('click',()=>openPresentation(panel));
 };
 const openPresentation=panel=>{
  const slides=makeSlides(panel);
  let index=Math.min(read().index||0,slides.length-1);
  const overlay=document.createElement('div');
  overlay.className='presentation-mode';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Teaching presentation');
  overlay.innerHTML=`<div class="presentation-topbar"><div><strong data-presentation-title></strong><span data-presentation-count></span></div><div class="presentation-actions"><button type="button" data-toggle-notes aria-pressed="false">Speaker Notes</button><button type="button" data-fullscreen>Fullscreen</button><button type="button" data-close-presentation>Exit</button></div></div><main class="presentation-stage" tabindex="-1"><p class="presentation-kicker" data-slide-kicker></p><h1 data-slide-title></h1><div class="presentation-body" data-slide-body></div></main><aside class="presentation-notes" hidden><label>Private speaker notes<textarea rows="7" data-speaker-notes placeholder="Transitions, reminders, names, or timing notes"></textarea></label><div class="presentation-note-actions"><button type="button" data-import-notebook>Refresh from Teaching Notebook</button><span data-note-status aria-live="polite"></span></div></aside><div class="presentation-controls"><button type="button" data-prev-slide>← Previous</button><span>← → or Spacebar</span><button type="button" data-next-slide>Next →</button></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('presentation-open');
  const notes=overlay.querySelector('[data-speaker-notes]');
  const state=read();
  const notebookNotes=window.NLDGTeachingNotebook?.speakerNotes?.()||'';
  notes.value=state.notes||notebookNotes;
  let saveTimer;
  const saveNotes=()=>{write({...read(),notes:notes.value,index});overlay.querySelector('[data-note-status]').textContent='Notes saved.';};
  notes.addEventListener('input',()=>{clearTimeout(saveTimer);overlay.querySelector('[data-note-status]').textContent='Saving…';saveTimer=setTimeout(saveNotes,400)});
  overlay.querySelector('[data-import-notebook]').addEventListener('click',()=>{const latest=window.NLDGTeachingNotebook?.speakerNotes?.()||'';if(latest){notes.value=latest;saveNotes();overlay.querySelector('[data-note-status]').textContent='Notebook notes refreshed.';}else overlay.querySelector('[data-note-status]').textContent='No notebook notes yet.';});
  const render=()=>{
   const slide=slides[index];
   overlay.querySelector('[data-presentation-title]').textContent=slides[0].title;
   overlay.querySelector('[data-presentation-count]').textContent=`Slide ${index+1} of ${slides.length}`;
   overlay.querySelector('[data-slide-kicker]').textContent=slide.kicker;
   overlay.querySelector('[data-slide-title]').textContent=slide.title;
   const body=overlay.querySelector('[data-slide-body]');
   body.innerHTML=escapeHtml(slide.body).split('\n').filter(Boolean).map(line=>`<p>${line}</p>`).join('');
   overlay.querySelector('[data-prev-slide]').disabled=index===0;
   overlay.querySelector('[data-next-slide]').disabled=index===slides.length-1;
   write({...read(),index,notes:notes.value});
  };
  const move=delta=>{index=Math.max(0,Math.min(slides.length-1,index+delta));render();};
  const close=()=>{document.removeEventListener('keydown',onKey);document.body.classList.remove('presentation-open');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});overlay.remove();};
  const onKey=event=>{
   if(event.target===notes)return;
   if(['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();move(1)}
   if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();move(-1)}
   if(event.key==='Escape')close();
  };
  overlay.querySelector('[data-prev-slide]').addEventListener('click',()=>move(-1));
  overlay.querySelector('[data-next-slide]').addEventListener('click',()=>move(1));
  overlay.querySelector('[data-close-presentation]').addEventListener('click',close);
  overlay.querySelector('[data-toggle-notes]').addEventListener('click',event=>{const aside=overlay.querySelector('.presentation-notes');aside.hidden=!aside.hidden;event.currentTarget.setAttribute('aria-pressed',String(!aside.hidden));if(!aside.hidden)notes.focus();});
  overlay.querySelector('[data-fullscreen]').addEventListener('click',()=>{if(!document.fullscreenElement)overlay.requestFullscreen?.();else document.exitFullscreen?.();});
  document.addEventListener('keydown',onKey);
  render();
  overlay.querySelector('.presentation-stage').focus();
 };
 const find=()=>document.querySelectorAll('.teaching-view-panel,.v2-teaching-view').forEach(attach);
 find();
 new MutationObserver(find).observe(document.body,{childList:true,subtree:true});
})();