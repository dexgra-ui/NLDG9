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
  const completed=new Set((readState().completed||[]).filter(week=>availableWeeks.has(week)));
  const progress=availableLessons.length?Math.round((completed.size/availableLessons.length)*100):0;
  const scripture=item=>(item.scripture||[]).join(' • ');
  const href=week=>`current-events-series.html?week=${week}`;
  const statusLabel=item=>item.status==='complete'?'Available':'In Development';

  function renderLanding(){
    hero.innerHTML=`<p class="kicker">Bible Study Series</p><h1>${escapeHtml(series.displayTitle)}</h1><p class="lead">${escapeHtml(series.description)}</p>`;
    const nextLesson=availableLessons.find(item=>!completed.has(item.week))||availableLessons[0];
    view.innerHTML=`<div class="series-overview"><div><p class="kicker">About this series</p><h2>See today’s world through the truth of Scripture.</h2><p>This series is designed for small groups, Sunday school, and personal reflection. Each lesson connects a contemporary issue with Scripture, discernment, discussion, prayer, and application.</p>${nextLesson?`<a class="button primary" href="${href(nextLesson.week)}">${completed.size?'Continue the Series':'Begin Week 1'}</a>`:''}</div><div class="series-progress"><strong>${completed.size} of ${availableLessons.length}</strong><span>Available lessons completed</span><progress max="100" value="${progress}">${progress}%</progress><small>${progress}% complete</small><div class="series-availability"><span><b>${availableLessons.length}</b> Available</span><span><b>${developmentLessons.length}</b> In development</span></div></div></div><div class="series-heading"><div><p class="kicker">Lessons</p><h2>${availableLessons.length} lessons ready to study.</h2><p>Weeks ${availableLessons.length+1}–${series.lessons.length} will open as their full lessons are completed.</p></div><div class="status-legend" aria-label="Lesson status"><span class="status-badge status-available">Available</span><span class="status-badge status-development">In Development</span></div></div><div class="series-lesson-grid">${series.lessons.map(item=>{const ready=item.status==='complete';return `<article class="series-lesson-card ${completed.has(item.week)?'is-complete':''} ${ready?'is-available':'is-development'}"><div class="week-badge" data-week="${item.week}">${item.week}</div><div class="card-title-row"><h3>Week ${item.week} – ${escapeHtml(item.shortTitle||item.title)}</h3><span class="status-badge ${ready?'status-available':'status-development'}">${statusLabel(item)}</span></div><p>${escapeHtml(item.summary)}</p><div class="series-card-meta">${item.unit?`<span>${escapeHtml(item.unit)}</span>`:''}${scripture(item)?`<span>${escapeHtml(scripture(item))}</span>`:''}${completed.has(item.week)?'<span class="completion-label">✓ Complete</span>':''}</div>${ready?`<a href="${href(item.week)}" aria-label="Open Week ${item.week}">Open Lesson</a>`:'<span class="coming-soon" aria-label="Lesson in development">Soon</span>'}</article>`;}).join('')}</div>`;
  }

  function renderLesson(item){
    const ready=item.status==='complete';
    const currentIndex=availableLessons.findIndex(entry=>entry.week===item.week);
    const previous=ready&&currentIndex>0?availableLessons[currentIndex-1]:null;
    const next=ready&&currentIndex>=0&&currentIndex<availableLessons.length-1?availableLessons[currentIndex+1]:null;
    hero.innerHTML=`<p class="kicker">${escapeHtml(item.unit||series.title)} • Week ${item.week}</p><h1>${escapeHtml(item.title)}</h1><p class="lead">${escapeHtml(item.summary)}</p>${scripture(item)?`<div class="lesson-verse">📖 ${escapeHtml(scripture(item))}</div>`:''}`;
    if(!ready){
      view.innerHTML=`<article class="series-lesson development-preview"><div class="series-lesson-toolbar"><a href="current-events-series.html">← Series Overview</a><span class="status-badge status-development">In Development</span></div><div class="development-notice"><span>Under Construction</span><h2>This lesson is still being prepared.</h2><p>The topic, Scripture, and guiding question are established, but the complete teaching content is not published yet.</p><a class="button primary" href="current-events-series.html">Return to Available Lessons</a></div></article>`;
      return;
    }
    view.innerHTML=`<article class="series-lesson"><div class="series-lesson-toolbar"><a href="current-events-series.html">← Series Overview</a><span class="status-badge status-available">Available</span><span>${completed.has(item.week)?'✓ Completed':'Not completed'}</span></div>${item.sections.map((section,index)=>`<section class="lesson-block"><span class="lesson-number">${index+1}</span><div><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></div></section>`).join('')}${item.questions.length?`<section class="lesson-block"><span class="lesson-number">?</span><div><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></div></section>`:''}${item.prayer?`<section class="lesson-block prayer-block"><span class="lesson-number">🙏</span><div><h2>Prayer</h2><p>${escapeHtml(item.prayer)}</p></div></section>`:''}<div class="lesson-complete-panel"><button class="button primary" id="toggle-complete" type="button">${completed.has(item.week)?'Mark Incomplete':'Mark Complete'}</button><span>${completed.size} of ${availableLessons.length} available lessons complete</span></div><nav class="series-lesson-nav">${previous?`<a href="${href(previous.week)}">← Week ${previous.week}<strong>${escapeHtml(previous.shortTitle)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="${href(next.week)}">Week ${next.week} →<strong>${escapeHtml(next.shortTitle)}</strong></a>`:'<a class="next" href="current-events-series.html">Series Overview →</a>'}</nav></article>`;
    document.getElementById('toggle-complete')?.addEventListener('click',()=>{
      const state=readState();
      const set=new Set((state.completed||[]).filter(week=>availableWeeks.has(week)));
      set.has(item.week)?set.delete(item.week):set.add(item.week);
      state.completed=[...set].sort((a,b)=>a-b);
      state.lastWeek=item.week;
      state.updated=Date.now();
      writeState(state);
      location.reload();
    });
  }
  lesson?renderLesson(lesson):renderLanding();
})();