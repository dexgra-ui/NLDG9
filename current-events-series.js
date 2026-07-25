(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const hero=document.getElementById('series-hero');
  const view=document.getElementById('series-view');
  if(!series||!hero||!view)return;

  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const key=`nldg-series-${series.id}`;
  const readState=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}');}catch(error){return{completed:[]};}};
  const writeState=state=>{try{localStorage.setItem(key,JSON.stringify(state));}catch(error){}};
  const params=new URLSearchParams(location.search);
  const selectedWeek=Number(params.get('week')||0);
  const lesson=series.lessons.find(item=>item.week===selectedWeek);
  const availableLessons=series.lessons.filter(item=>item.status==='complete');
  const developmentLessons=series.lessons.filter(item=>item.status!=='complete');
  const availableWeeks=new Set(availableLessons.map(item=>item.week));
  const state=readState();
  const completed=new Set((state.completed||[]).filter(week=>availableWeeks.has(week)));
  const progress=availableLessons.length?Math.round((completed.size/availableLessons.length)*100):0;
  const scripture=item=>(item.scripture||[]).join(' • ');
  const href=week=>`current-events-series.html?week=${week}`;
  const statusLabel=item=>item.status==='complete'?'Available':'In Development';
  const unitIcons=['📚','🤝','💻','⚖️','🌍','✨'];
  const units=[...new Set(series.lessons.map(item=>item.unit))].map((name,index)=>({name,icon:unitIcons[index]||'📖',lessons:series.lessons.filter(item=>item.unit===name)}));

  function lessonCard(item){
    const ready=item.status==='complete';
    return `<article class="journey-lesson-card ${completed.has(item.week)?'is-complete':''} ${ready?'is-available':'is-development'}">
      <div class="journey-week">Week ${item.week}</div>
      <div class="journey-lesson-copy"><h4>${escapeHtml(item.shortTitle||item.title)}</h4><p>${escapeHtml(item.summary)}</p><div class="journey-lesson-meta"><span>${escapeHtml(scripture(item))}</span>${completed.has(item.week)?'<span class="completion-label">✓ Complete</span>':''}</div></div>
      ${ready?`<a href="${href(item.week)}" aria-label="Open Week ${item.week}">Open Lesson <span aria-hidden="true">→</span></a>`:'<span class="coming-soon">Coming Soon</span>'}
    </article>`;
  }

  function renderLanding(){
    const nextLesson=availableLessons.find(item=>!completed.has(item.week))||availableLessons[0];
    const lastLesson=availableLessons.find(item=>item.week===state.lastWeek);
    hero.classList.add('journey-series-hero');
    hero.innerHTML=`<div class="series-hero-inner"><p class="kicker">42-Week Discipleship Journey</p><h1>${escapeHtml(series.displayTitle)}</h1><p class="lead">Helping Christians think biblically about today’s biggest issues.</p><div class="hero-progress"><div><strong>${availableLessons.length} of ${series.lessons.length} lessons available</strong><span>${progress}% of available lessons complete</span></div><progress max="100" value="${progress}">${progress}%</progress></div>${nextLesson?`<a class="button primary" href="${href(nextLesson.week)}">${completed.size?'Continue Journey':'Begin the Journey'} <span aria-hidden="true">→</span></a>`:''}</div>`;

    const welcome=lastLesson?`<section class="welcome-back"><div><p class="kicker">Welcome back</p><h2>Continue where you left off.</h2><p>Last opened: Week ${lastLesson.week}, ${escapeHtml(lastLesson.shortTitle||lastLesson.title)}.</p></div><a class="button primary" href="${href(nextLesson.week)}">Continue with Week ${nextLesson.week}</a></section>`:'';

    view.innerHTML=`${welcome}<section class="journey-summary"><div><p class="kicker">Your journey</p><h2>Six units. One biblical path through today’s world.</h2><p>Move through the series one unit at a time. Your completed lessons are saved on this device.</p></div><div class="journey-stats"><span><strong>${completed.size}</strong> Completed</span><span><strong>${availableLessons.length-completed.size}</strong> Ready</span><span><strong>${developmentLessons.length}</strong> Coming</span></div></section>
    <section class="unit-map"><div class="unit-map-heading"><div><p class="kicker">Journey map</p><h2>Choose a unit.</h2></div><p>Open any unit to view its lessons and progress.</p></div>
    <div class="unit-list">${units.map((unit,index)=>{
      const ready=unit.lessons.filter(item=>item.status==='complete');
      const done=ready.filter(item=>completed.has(item.week)).length;
      const unitProgress=ready.length?Math.round((done/ready.length)*100):0;
      const allReady=ready.length===unit.lessons.length;
      const open=index===0||unit.lessons.some(item=>item.week===nextLesson?.week);
      return `<details class="unit-card" ${open?'open':''}><summary><span class="unit-icon">${unit.icon}</span><span class="unit-title"><small>Weeks ${unit.lessons[0].week}–${unit.lessons[unit.lessons.length-1].week}</small><strong>${escapeHtml(unit.name)}</strong><em>${ready.length} of ${unit.lessons.length} lessons available</em></span><span class="unit-progress"><b>${done}/${ready.length}</b><progress max="100" value="${unitProgress}">${unitProgress}%</progress><span>${allReady?'Available':'In Development'}</span></span><span class="unit-toggle" aria-hidden="true">⌄</span></summary><div class="unit-lessons">${unit.lessons.map(lessonCard).join('')}</div></details>`;
    }).join('')}</div></section>
    <section class="series-resources"><div><p class="kicker">Study resources</p><h2>Built for personal study and group discipleship.</h2><p>Leader guides, participant worksheets, presentation slides, and printable resources will be added as the series continues to grow.</p></div><div class="resource-grid"><span>Leader Guide<small>In development</small></span><span>Participant Guide<small>In development</small></span><span>Printable Worksheet<small>In development</small></span><span>Presentation Slides<small>In development</small></span></div></section>`;
  }

  function renderLesson(item){
    const ready=item.status==='complete';
    const currentIndex=availableLessons.findIndex(entry=>entry.week===item.week);
    const previous=ready&&currentIndex>0?availableLessons[currentIndex-1]:null;
    const next=ready&&currentIndex>=0&&currentIndex<availableLessons.length-1?availableLessons[currentIndex+1]:null;
    hero.classList.remove('journey-series-hero');
    hero.innerHTML=`<p class="kicker">${escapeHtml(item.unit||series.title)} • Week ${item.week}</p><h1>${escapeHtml(item.title)}</h1><p class="lead">${escapeHtml(item.summary)}</p>${scripture(item)?`<div class="lesson-verse">📖 ${escapeHtml(scripture(item))}</div>`:''}`;
    if(!ready){
      view.innerHTML=`<article class="series-lesson development-preview"><div class="series-lesson-toolbar"><a href="current-events-series.html">← Journey Overview</a><span class="status-badge status-development">In Development</span></div><div class="development-notice"><span>Under Construction</span><h2>This lesson is still being prepared.</h2><p>The topic, Scripture, and guiding question are established, but the complete teaching content is not published yet.</p><a class="button primary" href="current-events-series.html">Return to Available Lessons</a></div></article>`;
      return;
    }
    view.innerHTML=`<article class="series-lesson"><div class="series-lesson-toolbar"><a href="current-events-series.html">← Journey Overview</a><span class="status-badge status-available">Available</span><span>${completed.has(item.week)?'✓ Completed':'Not completed'}</span></div>${item.sections.map((section,index)=>`<section class="lesson-block"><span class="lesson-number">${index+1}</span><div><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></div></section>`).join('')}${item.questions.length?`<section class="lesson-block"><span class="lesson-number">?</span><div><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></div></section>`:''}${item.prayer?`<section class="lesson-block prayer-block"><span class="lesson-number">🙏</span><div><h2>Prayer</h2><p>${escapeHtml(item.prayer)}</p></div></section>`:''}<section class="lesson-resources"><h2>Lesson Resources</h2><div><span>Leader Notes<small>Coming soon</small></span><span>Participant Worksheet<small>Coming soon</small></span><span>Presentation Slides<small>Coming soon</small></span></div></section><div class="lesson-complete-panel"><button class="button primary" id="toggle-complete" type="button">${completed.has(item.week)?'Mark Incomplete':'Mark Complete'}</button><span>${completed.size} of ${availableLessons.length} available lessons complete</span></div><nav class="series-lesson-nav">${previous?`<a href="${href(previous.week)}">← Week ${previous.week}<strong>${escapeHtml(previous.shortTitle)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="${href(next.week)}">Week ${next.week} →<strong>${escapeHtml(next.shortTitle)}</strong></a>`:'<a class="next" href="current-events-series.html">Journey Overview →</a>'}</nav></article>`;
    document.getElementById('toggle-complete')?.addEventListener('click',()=>{
      const current=readState();
      const set=new Set((current.completed||[]).filter(week=>availableWeeks.has(week)));
      set.has(item.week)?set.delete(item.week):set.add(item.week);
      current.completed=[...set].sort((a,b)=>a-b);
      current.lastWeek=item.week;
      current.updated=Date.now();
      writeState(current);
      location.reload();
    });
    const current=readState();
    current.lastWeek=item.week;
    current.updated=Date.now();
    writeState(current);
  }

  lesson?renderLesson(lesson):renderLanding();
})();