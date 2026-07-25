(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const grid=document.getElementById('tech-lesson-grid');
  const progressPanel=document.getElementById('tech-progress');
  if(!series||!grid||!progressPanel)return;
  const lessons=series.lessons.filter(item=>item.week>=15&&item.week<=21&&item.status==='complete');
  const key=`nldg-series-${series.id}`;
  const readState=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}');}catch(error){return{completed:[]};}};
  const state=readState();
  const completed=new Set(state.completed||[]);
  const finished=lessons.filter(item=>completed.has(item.week)).length;
  const percent=lessons.length?Math.round((finished/lessons.length)*100):0;
  const nextLesson=lessons.find(item=>!completed.has(item.week))||lessons[0];
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const icons={15:'💬',16:'📱',17:'👤',18:'🔎',19:'🤖',20:'🔐',21:'🌅'};
  const labels={15:'Online Speech',16:'Digital Habits',17:'Online Identity',18:'Discernment',19:'Artificial Intelligence',20:'Privacy',21:'Hope & Perspective'};
  progressPanel.innerHTML=`<div><p class="tech-kicker">Your progress</p><h2>${finished?`${finished} of ${lessons.length} lessons complete`:'Begin the collection'}</h2><p>${finished===lessons.length?'You completed every lesson in this collection.':finished?'Keep going. Your next lesson is ready.':'Seven studies designed to help you use technology with wisdom, truth, and self-control.'}</p></div><div class="tech-progress-action"><strong>${percent}%</strong><progress max="100" value="${percent}">${percent}%</progress><a class="button primary" href="current-events-series.html?week=${nextLesson.week}">${finished?'Continue Collection':'Start Lesson 1'}</a></div>`;
  grid.innerHTML=lessons.map((item,index)=>{
    const done=completed.has(item.week);
    const scripture=(item.scripture||[]).join(' • ');
    return `<article class="tech-lesson-card ${done?'is-complete':''}"><div class="tech-card-top"><span class="tech-lesson-icon" aria-hidden="true">${icons[item.week]||'💻'}</span><span class="tech-lesson-number">Lesson ${index+1}</span></div><p class="tech-topic">${escapeHtml(labels[item.week]||item.unit)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><div class="tech-card-meta"><span>📖 ${escapeHtml(scripture)}</span>${done?'<span class="tech-complete">✓ Complete</span>':'<span>Available</span>'}</div><a href="current-events-series.html?week=${item.week}">${done?'Review Lesson':'Open Lesson'} <span aria-hidden="true">→</span></a></article>`;
  }).join('');
})();