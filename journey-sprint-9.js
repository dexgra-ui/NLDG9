(function(){
  const MEMORY_KEY='nldg-journey-memory-v1';
  const PRAYER_KEY='nldg-prayers-v1';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const mount=document.getElementById('sprint9-dashboard');
  if(!mount||!series)return;

  const SERIES_KEY=`nldg-series-${series.id}`;
  const LEGACY_SERIES_KEYS=['nldg-series-current-events'].filter(key=>key!==SERIES_KEY);

  function seriesState(){
    const states=[read(SERIES_KEY,{completed:[]}),...LEGACY_SERIES_KEYS.map(key=>read(key,{completed:[]}))];
    const completed=[...new Set(states.flatMap(state=>Array.isArray(state.completed)?state.completed:[]).map(Number).filter(Number.isFinite))].sort((a,b)=>a-b);
    const latest=states.slice().sort((a,b)=>Number(b.updated||0)-Number(a.updated||0))[0]||{};
    const merged={...latest,completed};
    write(SERIES_KEY,merged);
    return merged;
  }

  function render(){
    const state=seriesState();
    const available=series.lessons.filter(x=>x.status==='complete');
    const complete=new Set((state.completed||[]).map(Number).filter(w=>available.some(x=>x.week===w)));
    const next=available.find(x=>!complete.has(x.week))||available[available.length-1];
    const last=available.find(x=>x.week===Number(state.lastWeek));
    const progress=series.lessons.length?Math.round((complete.size/series.lessons.length)*100):0;
    const memory=read(MEMORY_KEY,[]);
    const prayers=read(PRAYER_KEY,[]);
    const activePrayers=prayers.filter(x=>!x.answered);

    const achievements=[
      {title:'First Lesson',earned:complete.size>=1,detail:'Complete your first lesson'},
      {title:'First Unit',earned:complete.size>=6,detail:'Complete six lessons'},
      {title:'10 Lessons',earned:complete.size>=10,detail:'Reach ten completed lessons'},
      {title:'Technology & AI',earned:[15,16,17,18,19,20,21].every(w=>complete.has(w)),detail:'Complete Weeks 15–21'},
      {title:'42-Week Journey',earned:complete.size===42,detail:'Complete the full journey'}
    ];

    const recommended=available.filter(x=>!complete.has(x.week)).slice(0,3);
    mount.innerHTML=`
      <section class="s9-welcome">
        <div><p class="kicker">My Journey</p><h2>${last?'Welcome back.':'Begin your journey.'}</h2><p>${last?`Last opened: Week ${last.week}, ${esc(last.shortTitle||last.title)}.`:'Your progress, prayer, Scripture memory, and next steps come together here.'}</p></div>
        <div class="s9-progress"><strong>${complete.size} of 42</strong><span>lessons completed</span><progress max="100" value="${progress}">${progress}%</progress></div>
      </section>
      <section class="s9-primary-grid">
        <article class="s9-feature"><p class="eyebrow">Continue Your Journey</p><h2>${next?esc(next.title):'Journey complete'}</h2><p>${next?`Week ${next.week} · ${esc((next.scripture||[]).join(' • '))}`:'You have completed every available lesson.'}</p>${next?`<a class="button primary" href="current-events-series.html?week=${next.week}">${complete.size?'Continue Journey':'Start Journey'} →</a>`:'<a class="button primary" href="current-events-series.html">Review Journey →</a>'}</article>
        <article class="s9-side-card"><span>Prayer Journal</span><strong>${activePrayers.length}</strong><p>active prayer request${activePrayers.length===1?'':'s'}</p><a href="#prayer-form">Open Journal</a></article>
        <article class="s9-side-card"><span>Scripture Memory</span><strong>${memory.length}</strong><p>verse${memory.length===1?'':'s'} saved</p><a href="#memory-form">Review Verses</a></article>
      </section>
      <section class="s9-section"><div class="section-heading"><p class="kicker">Recommended Next</p><h2>Keep moving forward</h2></div><div class="s9-recommend-grid">${recommended.map(x=>`<a href="current-events-series.html?week=${x.week}"><small>Week ${x.week}</small><strong>${esc(x.shortTitle||x.title)}</strong><span>${esc((x.scripture||[]).join(' • '))}</span></a>`).join('')||'<p>All available lessons are complete.</p>'}</div></section>
      <section class="s9-section"><div class="section-heading"><p class="kicker">Achievements</p><h2>Faithful steps worth remembering</h2></div><div class="s9-achievements">${achievements.map(x=>`<article class="${x.earned?'earned':''}"><span>${x.earned?'✓':'○'}</span><div><strong>${x.title}</strong><small>${x.earned?'Earned':x.detail}</small></div></article>`).join('')}</div></section>`;
  }

  window.addEventListener('pageshow',render);
  window.addEventListener('focus',render);
  window.addEventListener('storage',event=>{
    if(event.key===SERIES_KEY||LEGACY_SERIES_KEYS.includes(event.key)||event.key===MEMORY_KEY||event.key===PRAYER_KEY)render();
  });
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  render();
})();