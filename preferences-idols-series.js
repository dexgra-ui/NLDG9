(function(){
  const series=window.NLDG_PREFERENCES_IDOLS_SERIES;
  const hero=document.getElementById('preferences-hero');
  const view=document.getElementById('preferences-view');
  if(!series||!hero||!view)return;
  const storageKey='nldg-series-preferences-idols';
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const readState=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{"completed":[]}')}catch{return{completed:[]}}};
  const saveState=value=>{try{localStorage.setItem(storageKey,JSON.stringify(value))}catch{}}
  const params=new URLSearchParams(location.search);
  const lessonNumber=Number(params.get('lesson')||0);
  const lesson=series.lessons.find(item=>item.number===lessonNumber);
  const completed=new Set(readState().completed||[]);
  const href=number=>`preferences-idols-series.html?lesson=${number}`;
  const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;

  function renderLanding(){
    document.title=`${series.title} | No Labels, Designed by God`;
    hero.innerHTML=`<div class="preferences-hero-inner"><a class="series-back" href="studies.html">← Bible Studies</a><p class="kicker">Five-Lesson Christian Living Series</p><h1>${esc(series.title)}</h1><p class="preferences-lead">${esc(series.description)}</p><blockquote>${esc(series.theme)}</blockquote><div class="series-meta"><span>📖 Scripture-centered</span><span>◷ ${esc(series.duration)}</span><span>◎ ${esc(series.audience)}</span></div><div class="series-progress"><strong>${completed.size} of ${series.lessons.length} completed</strong><progress max="${series.lessons.length}" value="${completed.size}">${completed.size} of ${series.lessons.length}</progress></div></div>`;
    const next=series.lessons.find(item=>!completed.has(item.number))||series.lessons[0];
    view.innerHTML=`<section class="series-introduction"><div><p class="kicker">Series progression</p><h2>Identify. Examine. Evaluate. Protect. Surrender.</h2><p>Each lesson builds on the one before it. Begin by giving beliefs the right biblical weight, then examine what rules the heart, evaluate tradition, protect relationships, and practice Christlike surrender.</p></div><a class="button primary" href="${href(next.number)}">${completed.size?'Continue the Series':'Begin Lesson 1'} →</a></section><section class="preferences-grid">${series.lessons.map(item=>`<article class="preferences-card ${completed.has(item.number)?'is-complete':''}"><span>Lesson ${item.number}${completed.has(item.number)?' · Completed':''}</span><h2>${esc(item.title)}</h2><p>${esc(item.bigQuestion)}</p><small>📖 ${esc(item.scripture)}</small><a href="${href(item.number)}">Open Lesson →</a></article>`).join('')}</section>`;
  }

  function teachingSections(item){return item.teaching.map((section,index)=>`<section class="teaching-section"><div class="teaching-number">${index+1}</div><div><h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p>${section.points?list(section.points):''}</div></section>`).join('')}
  function optionalSections(item){
    let output='';
    if(item.cases)output+=`<section class="lesson-panel"><p class="kicker">Case studies</p><h2>Where might this appear?</h2>${list(item.cases)}</section>`;
    if(item.replacements)output+=`<section class="lesson-panel"><p class="kicker">Practical exercise</p><h2>Replace accusation with honest conversation</h2><div class="language-grid">${item.replacements.map(pair=>`<div><del>${esc(pair[0])}</del><p>${esc(pair[1])}</p></div>`).join('')}</div></section>`;
    if(item.test)output+=`<section class="lesson-panel preference-test"><p class="kicker">Final reflection</p><h2>The Preference Test</h2><ol>${item.test.map(question=>`<li>${esc(question)}</li>`).join('')}</ol></section>`;
    return output;
  }
  function renderLesson(item){
    document.body.dataset.studyPage=`preferences-idols-lesson-${item.number}`;
    document.body.dataset.studyTitle=item.title;
    document.title=`${item.title} | ${series.title}`;
    const index=series.lessons.indexOf(item),previous=series.lessons[index-1],next=series.lessons[index+1];
    hero.innerHTML=`<div class="preferences-hero-inner"><a class="series-back" href="preferences-idols-series.html">← Series Overview</a><p class="kicker">Lesson ${item.number} of ${series.lessons.length}</p><h1>${esc(item.title)}</h1><p class="preferences-lead">${esc(item.bigQuestion)}</p><div class="series-meta"><span>📖 ${esc(item.scripture)}</span><span>◷ 50–65 minutes</span></div></div>`;
    view.innerHTML=`<article class="preferences-lesson"><section class="truth-banner"><p class="kicker">Main truth</p><h2>${esc(item.truth)}</h2></section><section class="lesson-panel"><p class="kicker">Lesson goal</p><p>${esc(item.goal)}</p><h2>Opening Reflection</h2><p>${esc(item.opening)}</p></section><section class="lesson-panel scripture-panel"><p class="kicker">Read the Word</p><h2>${esc(item.scripture)}</h2><p>Supporting Scripture: ${item.supporting.map(esc).join(' · ')}</p><p>Read the main passage slowly. What does it reveal about God, the human heart, and how believers should treat one another?</p></section>${teachingSections(item)}${optionalSections(item)}<section class="lesson-panel exercise-panel"><p class="kicker">Personal exercise</p><h2>${esc(item.exercise.title)}</h2><p>${esc(item.exercise.instructions)}</p></section><section class="lesson-panel"><p class="kicker">Discuss</p><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${esc(question)}</li>`).join('')}</ol></section><section class="challenge-panel"><p class="kicker">Personal challenge</p><h2>Put truth into practice</h2><p>${esc(item.challenge)}</p></section><section class="prayer-panel"><p class="kicker">Closing prayer</p><p>${esc(item.prayer)}</p></section><div class="complete-panel"><div><strong>${completed.has(item.number)?'Lesson completed':'Finished this lesson?'}</strong><span>Your progress is saved on this device.</span></div><button id="toggle-complete" class="button primary">${completed.has(item.number)?'Mark Incomplete':'Mark Complete'}</button></div><nav class="lesson-navigation" aria-label="Series lessons">${previous?`<a href="${href(previous.number)}">← Lesson ${previous.number}<strong>${esc(previous.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.number)}">Lesson ${next.number} →<strong>${esc(next.title)}</strong></a>`:`<a href="preferences-idols-series.html">Series Complete →<strong>Return to Overview</strong></a>`}</nav></article>`;
    document.getElementById('toggle-complete').addEventListener('click',()=>{const state=readState(),set=new Set(state.completed||[]);set.has(item.number)?set.delete(item.number):set.add(item.number);state.completed=[...set].sort((a,b)=>a-b);saveState(state);location.reload()});
  }
  lesson?renderLesson(lesson):renderLanding();
})();
