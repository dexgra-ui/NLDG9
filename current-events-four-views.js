(function(){
 const week=Number(new URLSearchParams(location.search).get('week')||0);
 const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
 if(!lesson||lesson.version!=='2.0.0')return;
 const article=document.querySelector('.series-lesson');
 const tabs=document.querySelector('.v2-view-tabs');
 const participant=document.querySelector('.v2-participant-guide');
 const leader=document.querySelector('.v2-leader-guide');
 const sidebar=document.querySelector('.lesson-sidebar');
 const lessonLayout=document.querySelector('.lesson-layout');
 if(!article||!tabs||!participant||!leader)return;
 const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 tabs.querySelector('#v2-print')?.remove();
 const teachingButton=document.createElement('button');teachingButton.type='button';teachingButton.setAttribute('role','tab');teachingButton.setAttribute('aria-selected','false');teachingButton.dataset.view='teaching';teachingButton.textContent='Teaching';
 const printButton=document.createElement('button');printButton.type='button';printButton.setAttribute('role','tab');printButton.setAttribute('aria-selected','false');printButton.dataset.view='print';printButton.textContent='Print';
 tabs.append(teachingButton,printButton);
 const guide=lesson.leaderGuide;
 const teaching=document.createElement('div');teaching.className='v2-teaching-view';teaching.hidden=true;
 teaching.innerHTML=`<section class="v2-leader-intro"><div><div class="curriculum-v2-badge">Teaching View</div><h2>${escapeHtml(lesson.title)}</h2><p>A condensed guide for leading the lesson without carrying the full preparation material.</p></div></section><div class="v2-leader-grid"><section class="v2-leader-card"><h3>Big Idea</h3><p>${escapeHtml(lesson.bigIdea)}</p></section><section class="v2-leader-card"><h3>60-Minute Flow</h3><ol>${guide.timelines['60 minutes'].map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></section><section class="v2-leader-card wide"><h3>Main Teaching Points</h3>${guide.outline.map(item=>`<div class="v2-question"><strong>${escapeHtml(item.point)}</strong><p>${escapeHtml(item.notes)}</p></div>`).join('')}</section><section class="v2-leader-card"><h3>Discussion Questions</h3><ol>${lesson.questions.slice(0,6).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></section><section class="v2-leader-card"><h3>Prayer and Challenge</h3><p>${escapeHtml(guide.prayerFocus)}</p><p><strong>Weekly challenge:</strong> ${escapeHtml(lesson.sections.find(item=>item.type==='challenge')?.content||'Choose one faithful next step.')}</p></section><section class="v2-leader-card wide"><h3>Teaching Notes</h3><textarea class="v2-leader-notes" data-v2-teaching-notes placeholder="Transitions, illustrations, timing, names, and follow-up"></textarea><div class="v2-save-row"><button type="button" data-v2-save-teaching>Save Notes</button><span data-v2-teaching-status aria-live="polite"></span></div></section></div>`;
 const printPanel=document.createElement('div');printPanel.className='v2-print-view';printPanel.hidden=true;
 printPanel.innerHTML='<section class="v2-leader-intro"><div><div class="curriculum-v2-badge">Print View</div><h2>Choose what to print</h2><p>Select a focused guide or print the complete curriculum package.</p></div></section><div class="v2-print-grid"><button type="button" data-v2-print="participant"><strong>Participant Guide</strong><span>Lesson, questions, challenge, and prayer</span></button><button type="button" data-v2-print="leader"><strong>Leader Guide</strong><span>Background, theology, coaching, and preparation</span></button><button type="button" data-v2-print="teaching"><strong>Teaching View</strong><span>Condensed outline and personal notes</span></button><button type="button" data-v2-print="all"><strong>Complete Package</strong><span>All three views in one print job</span></button></div>';
 const complete=article.querySelector('.lesson-complete-panel');article.insertBefore(teaching,complete||null);article.insertBefore(printPanel,complete||null);
 const views={participant,leader,teaching,print:printPanel};
 const setView=(view,{scroll=true}={})=>{
  const isParticipant=view==='participant';
  Object.entries(views).forEach(([name,node])=>node.hidden=name!==view);
  tabs.querySelectorAll('[role="tab"]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.view===view)));
  if(sidebar)sidebar.hidden=!isParticipant;
  lessonLayout?.classList.toggle('v2-full-width-view',!isParticipant);
  document.body.dataset.v2View=view;
  localStorage.setItem(`nldg-v2-view-${week}`,view);
  if(scroll)views[view].scrollIntoView({behavior:'smooth',block:'start'});
 };
 tabs.querySelectorAll('[role="tab"]').forEach(button=>{const replacement=button.cloneNode(true);button.replaceWith(replacement);replacement.addEventListener('click',()=>setView(replacement.dataset.view));});
 const saved=localStorage.getItem(`nldg-v2-view-${week}`);if(views[saved])setView(saved,{scroll:false});else setView('participant',{scroll:false});
 const key=`nldg-v2-teaching-week-${week}`;const notes=teaching.querySelector('[data-v2-teaching-notes]');notes.value=localStorage.getItem(key)||'';teaching.querySelector('[data-v2-save-teaching]').addEventListener('click',()=>{localStorage.setItem(key,notes.value);const status=teaching.querySelector('[data-v2-teaching-status]');status.textContent='Teaching notes saved.';setTimeout(()=>status.textContent='',1800);});

 const printLabels={participant:'Participant Guide',leader:'Leader Guide',teaching:'Teaching View'};
 const ensurePrintSurface=()=>{let surface=document.getElementById('v2-print-surface');if(!surface){surface=document.createElement('section');surface.id='v2-print-surface';surface.setAttribute('aria-hidden','true');document.body.appendChild(surface)}return surface;};
 const copyFormValues=(source,clone)=>{
  const sourceTextareas=[...source.querySelectorAll('textarea')];
  [...clone.querySelectorAll('textarea')].forEach((field,index)=>{
   const replacement=document.createElement('div');replacement.className='v2-print-notes';replacement.textContent=sourceTextareas[index]?.value||'';field.replaceWith(replacement);
  });
 };
 const sanitizePrintClone=clone=>{
  [clone,...clone.querySelectorAll('*')].forEach(item=>{
   item.removeAttribute('hidden');
   item.removeAttribute('aria-hidden');
   item.removeAttribute('inert');
   item.removeAttribute('style');
   item.removeAttribute('tabindex');
  });
  clone.querySelectorAll('details').forEach(item=>item.open=true);
 };
 const makePrintPacket=(name,node)=>{
  const clone=node.cloneNode(true);
  sanitizePrintClone(clone);
  copyFormValues(node,clone);
  clone.querySelectorAll('button,.v2-save-row,[aria-live]').forEach(item=>item.remove());
  clone.querySelectorAll('[id]').forEach(item=>item.removeAttribute('id'));
  const packet=document.createElement('article');packet.className='v2-print-surface-packet';packet.dataset.v2Packet=name;
  packet.innerHTML=`<header class="v2-print-surface-header"><p>No Labels, Designed by God</p><strong>${escapeHtml(printLabels[name])}</strong><h1>${escapeHtml(lesson.title)}</h1><span>Faith &amp; Truth in Today’s World · Week ${week}</span></header>`;
  packet.appendChild(clone);
  return packet;
 };
 const surface=ensurePrintSurface();
 ['participant','leader','teaching'].forEach(name=>surface.appendChild(makePrintPacket(name,views[name])));
 const syncTeachingNotes=()=>{const printable=surface.querySelector('[data-v2-packet="teaching"] .v2-print-notes');if(printable)printable.textContent=notes.value||'';};
 const buildPrintSurface=mode=>{syncTeachingNotes();surface.dataset.v2SurfaceMode=mode;return surface;};
 const printMode=mode=>{document.body.dataset.v2Print=mode;surface.removeAttribute('aria-hidden');const prepared=buildPrintSurface(mode);prepared.getBoundingClientRect();window.print();};
 printPanel.querySelectorAll('[data-v2-print]').forEach(button=>button.addEventListener('click',()=>printMode(button.dataset.v2Print)));
 window.NLDGFaithTruthPrint={print:printMode,build:buildPrintSurface};
})();