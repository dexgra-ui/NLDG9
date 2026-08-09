(function(){
  const series=window.NLDG_AFTER_BENEDICTION_SERIES;
  const hero=document.getElementById('benediction-hero');
  const view=document.getElementById('benediction-view');
  if(!series||!hero||!view)return;
  const storageKey='nldg-series-after-benediction';
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const readState=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{"completed":[]}')}catch{return{completed:[]}}};
  const saveState=value=>{try{localStorage.setItem(storageKey,JSON.stringify(value))}catch{}}
  const params=new URLSearchParams(location.search);
  const lessonNumber=Number(params.get('lesson')||0);
  const lesson=series.lessons.find(item=>item.number===lessonNumber);
  const completed=new Set(readState().completed||[]);
  const href=number=>`after-benediction-series.html?lesson=${number}`;
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;

  function renderLanding(){
    document.title=`${series.title} | No Labels, Designed by God`;
    hero.innerHTML=`<div class="benediction-hero-inner"><a class="series-back" href="studies.html">← Bible Studies</a><p class="kicker">Eight-Week Christian Living Series</p><h1>${esc(series.title)}</h1><p class="benediction-lead">${esc(series.description)}</p><blockquote>${esc(series.theme)}</blockquote><div class="series-meta"><span>📖 Scripture-centered</span><span>◷ ${esc(series.duration)}</span><span>◎ ${esc(series.audience)}</span></div><div class="series-progress"><strong>${completed.size} of ${series.lessons.length} completed</strong><progress max="${series.lessons.length}" value="${completed.size}">${completed.size} of ${series.lessons.length}</progress></div></div>`;
    const next=series.lessons.find(item=>!completed.has(item.number))||series.lessons[0];
    view.innerHTML=`<section class="series-introduction"><div><p class="kicker">The journey</p><h2>Beyond attendance. Into a life formed by Christ.</h2><p>The series moves from the church door into home, private life, conflict, work, and the digital world, then ends by examining the fruit Christ is producing.</p></div><a class="button primary" href="${href(next.number)}">${completed.size?'Continue the Series':'Begin Lesson 1'} →</a></section><section class="benediction-grid">${series.lessons.map(item=>`<article class="benediction-card ${completed.has(item.number)?'is-complete':''}"><span>Week ${item.number}${completed.has(item.number)?' · Completed':''}</span><h2>${esc(item.title)}</h2><p>${esc(item.question)}</p><small>📖 ${esc(item.scripture)}</small><a href="${href(item.number)}">Open Lesson →</a></article>`).join('')}</section>`;
  }

  function teachingSections(item){return item.teaching.map((section,index)=>`<section class="teaching-section"><div class="teaching-number">${index+1}</div><div><h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p>${section.points?list(section.points):''}</div></section>`).join('')}
  function renderLesson(item){
    document.body.dataset.studyPage=`after-benediction-week-${item.number}`;
    document.body.dataset.studyTitle=item.title;
    document.title=`${item.title} | ${series.title}`;
    const index=series.lessons.indexOf(item),previous=series.lessons[index-1],next=series.lessons[index+1];
    hero.innerHTML=`<div class="benediction-hero-inner"><a class="series-back" href="after-benediction-series.html">← Series Overview</a><p class="kicker">Week ${item.number} of ${series.lessons.length}</p><h1>${esc(item.title)}</h1><p class="benediction-lead">${esc(item.question)}</p><div class="series-meta"><span>📖 ${esc(item.scripture)}</span><span>◷ ${item.number===8?'60–70':'55–65'} minutes</span></div></div>`;
    view.innerHTML=`<article class="benediction-lesson"><section class="truth-banner"><p class="kicker">Key truth</p><h2>${esc(item.truth)}</h2></section><section class="facilitator-panel"><p class="kicker">Facilitator path</p><h2>A focused session with room to listen</h2><p>Use the core movements as the main teaching path. Select questions based on the group rather than rushing through every prompt.</p><div class="facilitator-timing"><div><strong>Open</strong><span>8 minutes</span></div><div><strong>Read</strong><span>12 minutes</span></div><div><strong>Teach</strong><span>${item.number===8?'28':'25'} minutes</span></div><div><strong>Respond</strong><span>${item.number===8?'20':'15'} minutes</span></div></div></section><section class="lesson-panel"><p class="kicker">Lesson goal</p><p>${esc(item.goal)}</p><h2>Opening Discussion</h2><p>${esc(item.opening)}</p></section><section class="lesson-panel scripture-panel"><p class="kicker">Read the Word</p><h2>${esc(item.scripture)}</h2><p>Supporting Scripture: ${item.supporting.map(esc).join(' · ')}</p><p>Read the main passage slowly. What does it reveal about God, the human heart, and a life formed by Christ?</p></section>${item.scope?`<aside class="scope-note"><strong>Series scope:</strong> ${esc(item.scope)}</aside>`:''}${teachingSections(item)}<section class="lesson-panel"><p class="kicker">Discuss</p><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${esc(question)}</li>`).join('')}</ol></section><section class="challenge-panel"><p class="kicker">Weekly practice</p><h2>Take the lesson beyond the room</h2><p>${esc(item.challenge)}</p></section><section class="prayer-panel"><p class="kicker">Closing prayer</p><p>${esc(item.prayer)}</p></section><div class="complete-panel"><div><strong>${completed.has(item.number)?'Lesson completed':'Finished this lesson?'}</strong><span>Your progress is saved on this device.</span></div><button id="toggle-complete" class="button primary">${completed.has(item.number)?'Mark Incomplete':'Mark Complete'}</button></div><nav class="lesson-navigation" aria-label="Series lessons">${previous?`<a href="${href(previous.number)}">← Week ${previous.number}<strong>${esc(previous.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.number)}">Week ${next.number} →<strong>${esc(next.title)}</strong></a>`:`<a href="after-benediction-series.html">Series Complete →<strong>Return to Overview</strong></a>`}</nav></article>`;
    document.getElementById('toggle-complete').addEventListener('click',()=>{const state=readState(),set=new Set(state.completed||[]);set.has(item.number)?set.delete(item.number):set.add(item.number);state.completed=[...set].sort((a,b)=>a-b);saveState(state);location.reload()});
  }
  lesson?renderLesson(lesson):renderLanding();
})();
