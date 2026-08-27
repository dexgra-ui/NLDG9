(function(){
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
  if(!lesson?.leaderGuide||lesson.version!=='2.0.0')return;
  const article=document.querySelector('.series-lesson');
  const toolbar=document.querySelector('.series-lesson-toolbar');
  const sidebar=document.querySelector('.lesson-sidebar nav');
  if(!article||!toolbar)return;

  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const list=items=>`<ul>${(items||[]).map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  const storageKey=`nldg-v2-leader-week-${week}`;
  const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return{}}};
  const write=value=>{try{localStorage.setItem(storageKey,JSON.stringify(value))}catch{}};

  article.querySelector('.leader-mode-panel')?.remove();
  toolbar.querySelector('.leader-toggle')?.remove();
  article.querySelectorAll('.lesson-block,.discussion-block,.prayer-block,.lesson-resources').forEach(node=>node.remove());

  const tabs=document.createElement('div');
  tabs.className='v2-view-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','Curriculum views');
  tabs.innerHTML='<button type="button" role="tab" aria-selected="true" data-view="participant">Participant Guide</button><button type="button" role="tab" aria-selected="false" data-view="leader">Expanded Leader Guide</button><button type="button" id="v2-print">Print Both</button>';
  toolbar.appendChild(tabs);

  const participant=document.createElement('div');
  participant.className='v2-participant-guide';
  participant.innerHTML=`
    <div class="curriculum-v2-badge">Curriculum v${escapeHtml(lesson.version)} · ${escapeHtml(lesson.curriculumStatus||'Curriculum Lesson')}</div>
    <section class="v2-snapshot">
      <div class="v2-card"><p class="kicker">Lesson snapshot</p><h2>${escapeHtml(lesson.bigIdea)}</h2><p><strong>Opening question:</strong> ${escapeHtml(lesson.openingQuestion)}</p></div>
      <div class="v2-card"><ul class="v2-meta-list"><li><strong>Primary text</strong><span>${escapeHtml(lesson.scripture.join(' • '))}</span></li><li><strong>Memory verse</strong><span>${escapeHtml(lesson.memoryVerse)}</span></li><li><strong>Teaching time</strong><span>45, 60, or 90 minutes</span></li></ul></div>
    </section>
    <section class="v2-card"><p class="kicker">Learning objectives</p><h2>By the end of this lesson</h2><ol class="v2-objectives">${lesson.objectives.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></section>
    ${lesson.sections.map((section,index)=>`<section id="v2-section-${index+1}" class="v2-section" data-type="${escapeHtml(section.type)}"><span class="v2-section-label">${escapeHtml(section.type)}</span><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></section>`).join('')}
    <section id="v2-discussion" class="v2-section"><span class="v2-section-label">Discuss</span><h2>Discussion Questions</h2><ol>${lesson.questions.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ol></section>
    <section id="v2-prayer" class="v2-section" data-type="greatest"><span class="v2-section-label">Pray</span><h2>Closing Prayer</h2><p>${escapeHtml(lesson.prayer)}</p></section>
    <section class="v2-card"><p class="kicker">Continue growing</p><h2>Connected resources</h2><div class="v2-resources">${lesson.resourceConnections.map(item=>`<article class="v2-resource-card"><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></article>`).join('')}</div></section>`;

  const guide=lesson.leaderGuide;
  const leader=document.createElement('div');
  leader.className='v2-leader-guide';
  leader.hidden=true;
  leader.innerHTML=`
    <section class="v2-leader-intro"><div><div class="curriculum-v2-badge">Expanded Leader Guide</div><h2>Teach Week ${week} with confidence</h2><p>${escapeHtml(guide.purpose)}</p></div><button type="button" id="leader-print-v2">Print Guide</button></section>
    <div class="v2-leader-grid">
      <section class="v2-leader-card"><h3>Before You Teach</h3>${list(guide.preparation)}</section>
      <section class="v2-leader-card"><h3>Prayer Focus</h3><p>${escapeHtml(guide.prayerFocus)}</p><div class="v2-callout"><strong>Leader reminder</strong><p>${escapeHtml(guide.leaderReminder||'The goal is not to win an argument. The goal is to help people follow Jesus faithfully.')}</p></div></section>
      <section class="v2-leader-card wide"><h3>Biblical and Historical Background</h3>${guide.background.map(item=>`<div class="v2-question"><strong>${escapeHtml(item.heading)}</strong><p>${escapeHtml(item.content)}</p></div>`).join('')}</section>
      <section class="v2-leader-card"><h3>Theological Themes</h3>${list(guide.theology)}</section>
      <section class="v2-leader-card"><h3>Biblical Worldview</h3><p><strong>Foundation:</strong> ${escapeHtml(guide.worldview.foundation)}</p><p><strong>Affirm:</strong> ${escapeHtml(guide.worldview.affirm)}</p><p><strong>Caution:</strong> ${escapeHtml(guide.worldview.caution)}</p><p><strong>Faithful response:</strong> ${escapeHtml(guide.worldview.response)}</p></section>
      <section class="v2-leader-card wide"><h3>Choose a Teaching Timeline</h3><div class="v2-timeline-tabs">${Object.keys(guide.timelines).map((name,index)=>`<button type="button" class="${index===0?'active':''}" data-timeline="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join('')}</div>${Object.entries(guide.timelines).map(([name,items],index)=>`<div class="v2-timeline-panel" data-panel="${escapeHtml(name)}" ${index===0?'':'hidden'}>${list(items)}</div>`).join('')}</section>
      <section class="v2-leader-card wide"><h3>Ready-to-Teach Outline</h3>${guide.outline.map(item=>`<div class="v2-question"><strong>${escapeHtml(item.point)}</strong><p>${escapeHtml(item.notes)}</p></div>`).join('')}</section>
      <section class="v2-leader-card wide"><h3>Difficult Questions</h3>${guide.difficultQuestions.map(item=>`<details class="v2-question"><summary><strong>${escapeHtml(item.question)}</strong></summary><p>${escapeHtml(item.response)}</p></details>`).join('')}</section>
      <section class="v2-leader-card"><h3>Discussion Coaching</h3>${guide.coaching.map(item=>`<div class="v2-question"><strong>${escapeHtml(item.situation)}</strong><p>${escapeHtml(item.guidance)}</p></div>`).join('')}</section>
      <section class="v2-leader-card"><h3>Common Misunderstandings</h3>${list(guide.misunderstandings)}</section>
      <section class="v2-leader-card wide"><h3>Practical Ministry Application</h3><div class="v2-application-columns">${Object.entries(guide.ministryApplications).map(([area,items])=>`<div class="v2-case"><strong>${escapeHtml(area.charAt(0).toUpperCase()+area.slice(1))}</strong>${list(items)}</div>`).join('')}</div></section>
      <section class="v2-leader-card"><h3>Leader Reflection</h3>${list(guide.leaderReflection)}</section>
      <section class="v2-leader-card"><h3>Private Preparation Notes</h3><p>Saved only on this device.</p><textarea class="v2-leader-notes" id="v2-leader-notes" placeholder="Teaching emphasis, illustrations, prayer needs, or follow-up"></textarea><div class="v2-save-row"><button type="button" id="v2-save-notes">Save Notes</button><span class="v2-save-status" id="v2-save-status" aria-live="polite"></span></div></section>
    </div>`;

  const completePanel=article.querySelector('.lesson-complete-panel');
  article.insertBefore(participant,completePanel||null);
  article.insertBefore(leader,completePanel||null);

  if(sidebar){
    sidebar.innerHTML=lesson.sections.map((section,index)=>`<a href="#v2-section-${index+1}">${index+1}. ${escapeHtml(section.heading)}</a>`).join('')+'<a href="#v2-discussion">Discussion Questions</a><a href="#v2-prayer">Prayer</a>';
  }

  const setView=view=>{
    const isLeader=view==='leader';
    participant.hidden=isLeader;
    leader.hidden=!isLeader;
    tabs.querySelectorAll('[role="tab"]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.view===view)));
    if(sidebar)sidebar.closest('.lesson-sidebar').hidden=isLeader;
    (isLeader?leader:participant).scrollIntoView({behavior:'smooth',block:'start'});
  };
  tabs.querySelectorAll('[role="tab"]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
  tabs.querySelector('#v2-print').addEventListener('click',()=>window.print());
  leader.querySelector('#leader-print-v2').addEventListener('click',()=>window.print());

  leader.querySelectorAll('[data-timeline]').forEach(button=>button.addEventListener('click',()=>{
    leader.querySelectorAll('[data-timeline]').forEach(item=>item.classList.toggle('active',item===button));
    leader.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==button.dataset.timeline);
  }));

  const notes=leader.querySelector('#v2-leader-notes');
  const status=leader.querySelector('#v2-save-status');
  notes.value=read().notes||'';
  notes.addEventListener('input',()=>status.textContent='Unsaved changes');
  leader.querySelector('#v2-save-notes').addEventListener('click',()=>{write({...read(),notes:notes.value,updated:Date.now()});status.textContent='Notes saved.';setTimeout(()=>status.textContent='',1800)});
})();
