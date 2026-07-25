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
  const completed=new Set(readState().completed||[]);
  const progress=Math.round((completed.size/series.lessons.length)*100);
  const scripture=item=>(item.scripture||[]).join(' • ');
  const href=week=>`current-events-series.html?week=${week}`;

  function renderLanding(){
    hero.innerHTML=`<p class="kicker">Bible Study Series</p><h1>${escapeHtml(series.displayTitle)}</h1><p class="lead">${escapeHtml(series.description)}</p>`;
    view.innerHTML=`<div class="series-overview"><div><p class="kicker">About this series</p><h2>See today’s world through the truth of Scripture.</h2><p>This series is designed for small groups, Sunday school, and personal reflection. Each independent lesson connects a contemporary issue with Scripture, discernment, discussion, prayer, and application.</p><a class="button primary" href="${href(1)}">${completed.size?'Continue the Series':'Begin Week 1'}</a></div><div class="series-progress"><strong>${completed.size} of ${series.lessons.length}</strong><span>Lessons completed</span><progress max="100" value="${progress}">${progress}%</progress><small>${progress}% complete</small></div></div><div class="series-heading"><div><p class="kicker">Lessons</p><h2>Six lessons are ready now.</h2></div></div><div class="series-lesson-grid">${series.lessons.map(item=>`<article class="series-lesson-card ${completed.has(item.week)?'is-complete':''}"><div class="week-badge" data-week="${item.week}">Week ${item.week}</div><h3>Week ${item.week} – ${escapeHtml(item.shortTitle||item.title)}</h3><p>${escapeHtml(item.summary)}</p><div class="series-card-meta">${scripture(item)?`<span>${escapeHtml(scripture(item))}</span>`:''}${completed.has(item.week)?'<span>✓ Complete</span>':''}</div><a href="${href(item.week)}" aria-label="Open Week ${item.week}">Open Lesson</a></article>`).join('')}</div>`;
  }

  function renderLesson(item){
    const previous=series.lessons.find(entry=>entry.week===item.week-1);
    const next=series.lessons.find(entry=>entry.week===item.week+1);
    hero.innerHTML=`<p class="kicker">${escapeHtml(series.title)} • Week ${item.week}</p><h1>${escapeHtml(item.title)}</h1><p class="lead">${escapeHtml(item.summary)}</p>${scripture(item)?`<div class="lesson-verse">📖 ${escapeHtml(scripture(item))}</div>`:''}`;
    view.innerHTML=`<article class="series-lesson"><div class="series-lesson-toolbar"><a href="current-events-series.html">← Series Overview</a><span>${completed.has(item.week)?'✓ Completed':'Not completed'}</span></div>${item.sections.map((section,index)=>`<section class="lesson-block"><span class="lesson-number">${index+1}</span><div><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></div></section>`).join('')}${item.questions.length?`<section class="lesson-block"><span class="lesson-number">?</span><div><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></div></section>`:''}${item.prayer?`<section class="lesson-block prayer-block"><span class="lesson-number">🙏</span><div><h2>Prayer</h2><p>${escapeHtml(item.prayer)}</p></div></section>`:''}<div class="lesson-complete-panel"><button class="button primary" id="toggle-complete" type="button">${completed.has(item.week)?'Mark Incomplete':'Mark Complete'}</button><span>${completed.size} of ${series.lessons.length} lessons complete</span></div><nav class="series-lesson-nav">${previous?`<a href="${href(previous.week)}">← Week ${previous.week}<strong>${escapeHtml(previous.shortTitle)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="${href(next.week)}">Week ${next.week} →<strong>${escapeHtml(next.shortTitle)}</strong></a>`:'<a class="next" href="current-events-series.html">Series Overview →</a>'}</nav></article>`;
    document.getElementById('toggle-complete')?.addEventListener('click',()=>{
      const state=readState();
      const set=new Set(state.completed||[]);
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