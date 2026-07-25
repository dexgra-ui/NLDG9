(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const hero=document.getElementById('series-hero');
  const view=document.getElementById('series-view');
  if(!series||!hero||!view)return;

  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const storageKey=`nldg-series-${series.id}`;
  const readState=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{"completed":[]}');}catch(error){return{completed:[]};}};
  const writeState=state=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(error){}};
  const params=new URLSearchParams(location.search);
  const selectedWeek=Number(params.get('week')||0);
  const selectedLesson=series.lessons.find(item=>item.week===selectedWeek);
  const available=series.lessons.filter(item=>item.status==='complete');
  const developing=series.lessons.filter(item=>item.status!=='complete');
  const availableWeeks=new Set(available.map(item=>item.week));
  const state=readState();
  const completed=new Set((state.completed||[]).filter(week=>availableWeeks.has(week)));
  const nextLesson=available.find(item=>!completed.has(item.week))||available[available.length-1]||null;
  const lastLesson=series.lessons.find(item=>item.week===state.lastWeek)||null;
  const overallProgress=series.lessons.length?Math.round((completed.size/series.lessons.length)*100):0;
  const availableProgress=available.length?Math.round((completed.size/available.length)*100):0;
  const scripture=item=>(item.scripture||[]).join(' • ');
  const lessonHref=week=>`current-events-series.html?week=${week}`;
  const unitIcons=['📚','🤝','💻','⚖️','🌍','✨'];
  const units=[...new Set(series.lessons.map(item=>item.unit))].map((name,index)=>({
    name,
    icon:unitIcons[index]||'📖',
    lessons:series.lessons.filter(item=>item.unit===name)
  }));

  function lessonCard(item){
    const ready=item.status==='complete';
    const isDone=completed.has(item.week);
    return `<article class="journey-lesson-card ${ready?'is-available':'is-development'} ${isDone?'is-complete':''}">
      <div class="journey-week"><span>Week</span><strong>${item.week}</strong></div>
      <div class="journey-lesson-copy">
        <div class="lesson-card-heading"><h4>${escapeHtml(item.shortTitle||item.title)}</h4>${isDone?'<span class="completion-label">✓ Complete</span>':''}</div>
        <p>${escapeHtml(item.summary)}</p>
        <div class="journey-lesson-meta"><span>📖 ${escapeHtml(scripture(item))}</span><span>◷ 35–45 minutes</span></div>
      </div>
      ${ready?`<a href="${lessonHref(item.week)}">Open Lesson <span aria-hidden="true">→</span></a>`:'<span class="coming-soon">In Development</span>'}
    </article>`;
  }

  function renderLanding(){
    hero.className='page-hero studies-hero journey-series-hero';
    hero.innerHTML=`<div class="series-hero-inner">
      <a class="series-back-link" href="studies.html">← Choose Your Journey</a>
      <p class="kicker">42-Week Discipleship Journey</p>
      <h1>${escapeHtml(series.displayTitle)}</h1>
      <p class="lead">Helping Christians think biblically about today’s biggest issues without losing truth, grace, or hope.</p>
      <div class="hero-status-row">
        <div class="hero-progress-card">
          <div class="hero-progress-copy"><strong>${completed.size} of ${series.lessons.length} lessons completed</strong><span>${available.length} lessons currently available</span></div>
          <progress max="${series.lessons.length}" value="${completed.size}">${overallProgress}%</progress>
          <small>${overallProgress}% of the full journey complete</small>
        </div>
        ${nextLesson?`<a class="button primary hero-cta" href="${lessonHref(nextLesson.week)}">${completed.size?'Continue Journey':'Begin the Journey'} <span aria-hidden="true">→</span><small>Week ${nextLesson.week}: ${escapeHtml(nextLesson.shortTitle||nextLesson.title)}</small></a>`:''}
      </div>
    </div>`;

    const welcome=lastLesson&&nextLesson?`<section class="welcome-back">
      <div><p class="kicker">Welcome back</p><h2>Pick up where you left off.</h2><p>Your last opened lesson was <strong>Week ${lastLesson.week}: ${escapeHtml(lastLesson.shortTitle||lastLesson.title)}</strong>.</p></div>
      <div class="welcome-actions"><span>Next recommended</span><a href="${lessonHref(nextLesson.week)}">Week ${nextLesson.week}: ${escapeHtml(nextLesson.shortTitle||nextLesson.title)} →</a></div>
    </section>`:'';

    view.innerHTML=`${welcome}
      <section class="journey-overview">
        <div><p class="kicker">Journey overview</p><h2>Six units. One clear path.</h2><p>Move through the series in order or open any available lesson. Progress is saved automatically on this device.</p></div>
        <div class="journey-stats" aria-label="Series statistics">
          <span><strong>${completed.size}</strong><small>Completed</small></span>
          <span><strong>${available.length-completed.size}</strong><small>Ready now</small></span>
          <span><strong>${developing.length}</strong><small>In development</small></span>
        </div>
      </section>

      <section class="unit-map">
        <div class="section-heading-row"><div><p class="kicker">Journey map</p><h2>Explore the six units.</h2></div><p>${availableProgress}% of available lessons completed</p></div>
        <div class="unit-list">${units.map((unit,index)=>{
          const ready=unit.lessons.filter(item=>item.status==='complete');
          const done=ready.filter(item=>completed.has(item.week)).length;
          const progress=ready.length?Math.round((done/ready.length)*100):0;
          const containsNext=nextLesson&&unit.lessons.some(item=>item.week===nextLesson.week);
          const status=ready.length===unit.lessons.length?'Available':ready.length?'Partially Available':'In Development';
          return `<details class="unit-card" ${containsNext||(!lastLesson&&index===0)?'open':''}>
            <summary>
              <span class="unit-icon" aria-hidden="true">${unit.icon}</span>
              <span class="unit-title"><small>Weeks ${unit.lessons[0].week}–${unit.lessons[unit.lessons.length-1].week}</small><strong>${escapeHtml(unit.name)}</strong><em>${ready.length} of ${unit.lessons.length} lessons available</em></span>
              <span class="unit-progress"><b>${done}/${ready.length||unit.lessons.length}</b><progress max="100" value="${progress}">${progress}%</progress><small>${status}</small></span>
              <span class="unit-toggle" aria-hidden="true">⌄</span>
            </summary>
            <div class="unit-lessons">${unit.lessons.map(lessonCard).join('')}</div>
          </details>`;
        }).join('')}</div>
      </section>

      <section class="series-resources">
        <div><p class="kicker">Series resources</p><h2>Designed for personal study and group discipleship.</h2><p>These resource areas are prepared for future downloads as each guide is completed.</p></div>
        <div class="resource-grid">
          <button type="button" disabled><span>📘</span><strong>Leader Guide</strong><small>In development</small></button>
          <button type="button" disabled><span>📝</span><strong>Participant Guide</strong><small>In development</small></button>
          <button type="button" disabled><span>▤</span><strong>Printable Worksheet</strong><small>In development</small></button>
          <button type="button" disabled><span>▣</span><strong>Presentation Slides</strong><small>In development</small></button>
        </div>
      </section>`;
  }

  function renderLesson(item){
    const ready=item.status==='complete';
    const currentIndex=available.findIndex(entry=>entry.week===item.week);
    const previous=ready&&currentIndex>0?available[currentIndex-1]:null;
    const next=ready&&currentIndex>=0&&currentIndex<available.length-1?available[currentIndex+1]:null;
    hero.className='page-hero studies-hero lesson-page-hero';
    hero.innerHTML=`<div class="lesson-hero-inner"><a class="series-back-link" href="current-events-series.html">← Journey Overview</a><p class="kicker">${escapeHtml(item.unit||series.title)} • Week ${item.week}</p><h1>${escapeHtml(item.title)}</h1><p class="lead">${escapeHtml(item.summary)}</p>${scripture(item)?`<div class="lesson-verse">📖 ${escapeHtml(scripture(item))}</div>`:''}<div class="lesson-hero-meta"><span>◷ 35–45 minutes</span><span>${completed.has(item.week)?'✓ Completed':'Ready to study'}</span></div></div>`;

    if(!ready){
      view.innerHTML=`<article class="series-lesson development-preview"><div class="development-notice"><span>In Development</span><h2>This lesson is still being prepared.</h2><p>The topic, Scripture, and guiding question are established. The full study will open here when it is complete.</p><a class="button primary" href="current-events-series.html">Return to Journey Map</a></div></article>`;
      return;
    }

    const sectionLinks=item.sections.map((section,index)=>`<a href="#lesson-section-${index+1}">${index+1}. ${escapeHtml(section.heading)}</a>`).join('');
    view.innerHTML=`<div class="lesson-layout">
      <aside class="lesson-sidebar"><div><p class="kicker">This lesson</p><nav>${sectionLinks}<a href="#discussion">Discussion Questions</a><a href="#prayer">Prayer</a></nav></div><div class="sidebar-progress"><strong>${completed.size}/${available.length}</strong><span>Available lessons complete</span><progress max="${available.length}" value="${completed.size}">${availableProgress}%</progress></div></aside>
      <article class="series-lesson">
        <div class="series-lesson-toolbar"><a href="current-events-series.html">← Journey Overview</a><span class="status-badge status-available">Available</span></div>
        ${item.sections.map((section,index)=>`<section id="lesson-section-${index+1}" class="lesson-block"><span class="lesson-number">${index+1}</span><div><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.content)}</p></div></section>`).join('')}
        ${item.questions.length?`<section id="discussion" class="lesson-block discussion-block"><span class="lesson-number">?</span><div><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></div></section>`:''}
        ${item.prayer?`<section id="prayer" class="lesson-block prayer-block"><span class="lesson-number">🙏</span><div><h2>Prayer</h2><p>${escapeHtml(item.prayer)}</p></div></section>`:''}
        <section class="lesson-resources"><div><p class="kicker">Resources</p><h2>Lesson materials</h2></div><div class="lesson-resource-grid"><button disabled>Leader Notes<small>Coming soon</small></button><button disabled>Participant Worksheet<small>Coming soon</small></button><button disabled>Presentation Slides<small>Coming soon</small></button></div></section>
        <div class="lesson-complete-panel"><div><strong>${completed.has(item.week)?'Lesson completed':'Finished this lesson?'}</strong><span>${completed.has(item.week)?'You can mark it incomplete at any time.':'Mark it complete to update your journey progress.'}</span></div><button class="button primary" id="toggle-complete" type="button">${completed.has(item.week)?'Mark Incomplete':'Mark Complete'}</button></div>
        <nav class="series-lesson-nav">${previous?`<a href="${lessonHref(previous.week)}"><span>← Previous</span><strong>Week ${previous.week}: ${escapeHtml(previous.shortTitle)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="${lessonHref(next.week)}"><span>Next →</span><strong>Week ${next.week}: ${escapeHtml(next.shortTitle)}</strong></a>`:'<a class="next" href="current-events-series.html"><span>Finished</span><strong>Return to Journey Overview →</strong></a>'}</nav>
      </article>
    </div>`;

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

  selectedLesson?renderLesson(selectedLesson):renderLanding();
})();