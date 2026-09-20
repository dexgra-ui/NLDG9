(function(){
 const s=window.NLDG_JAMES_SERIES,hero=document.getElementById('james-hero'),view=document.getElementById('james-view');
 if(!s||!hero||!view)return;
 const key='nldg-series-james';
 const state=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}')}catch(e){return{completed:[]}}};
 const save=x=>{try{localStorage.setItem(key,JSON.stringify(x))}catch(e){}};
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const list=(items,ordered=false)=>`<${ordered?'ol':'ul'}>${(items||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</${ordered?'ol':'ul'}>`;
 const paras=items=>(items||[]).map(v=>`<p>${esc(v)}</p>`).join('');
 const teaching=items=>(items||[]).map(x=>`<div class="teaching-movement"><h3>${esc(x.heading)}</h3><p>${esc(x.body)}</p></div>`).join('');
 const panel=(title,body,cls='lesson-panel')=>body?`<section class="${cls}"><h2>${esc(title)}</h2>${body}</section>`:'';
 const labels={
  bibleStudies:'Bible Studies',seriesPurpose:'Series Purpose',recommendedSessionLength:'Recommended Session Length',
  suggestedFlow:'Suggested Flow Each Week',leaderChecklist:'Leader Preparation Checklist (Weekly)',continueStudy:'Continue Study',
  beginWeek:'Begin Week 1',week:'Week',completed:'Completed',goal:'Purpose',text:'Main Scripture',openLesson:'Open Lesson',
  seriesOverview:'Series Overview',seriesMainScripture:'Series Main Scripture',centralQuestion:'Central Question',
  scriptureContext:'Scripture Context',teachingMovements:'Teaching Movements',jesusConnection:'Jesus Connection',
  doNotMiss:'Do Not Miss This',discussion:'Discussion Questions',personalExamination:'Personal Examination',
  weeklyPractice:'Weekly Practice',leaderGuidance:'Leader Guidance',closingTakeaway:'Closing Takeaway',closingPrayer:'Closing Prayer',
  supportingScriptures:'Supporting Scriptures',keyTruth:'Key Truth',opening:'Opening',
  lessonCompleted:'Lesson completed',finishedLesson:'Finished this lesson?',progressSaved:'Progress is saved on this device.',
  markIncomplete:'Mark Incomplete',markComplete:'Mark Complete',seriesComplete:'Series Complete',returnOverview:'Return to Overview',
  progressTemplate:'{done} of {total} completed',ntvBadge:''
 };
 Object.assign(labels,s.labels||{});
 const route=s.route||'james-series.html',libraryHref=s.libraryHref||'studies.html';
 const q=new URLSearchParams(location.search),week=Number(q.get('week')||0),lesson=s.lessons.find(x=>x.week===week),done=new Set(state().completed||[]);
 const href=n=>`${route}?week=${n}`;
 const progressText=()=>labels.progressTemplate.replace('{done}',done.size).replace('{total}',s.lessons.length);
 const ntvBadge=s.scriptureStandard&&labels.ntvBadge?`<span>${esc(labels.ntvBadge)}</span>`:'';
 function landing(){
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="${esc(libraryHref)}">← ${esc(labels.bibleStudies)}</a><p class="kicker">${esc(s.subtitle)}</p><h1>${esc(s.title)}</h1><p class="book-lead">${esc(s.purpose)}</p>${ntvBadge?`<div class="series-meta">${ntvBadge}</div>`:''}<div class="series-progress james-progress"><strong>${esc(progressText())}</strong><progress max="${s.lessons.length}" value="${done.size}"></progress></div></div>`;
  const guide=[
   panel(labels.seriesMainScripture,`<p>${esc(s.seriesMainScripture)}</p>`),
   panel(labels.centralQuestion,`<p>${esc(s.seriesQuestion)}</p>`),
   panel(labels.opening,`<p>${esc(s.seriesOpening)}</p>`),
   panel(labels.scriptureContext,paras(s.seriesContextParagraphs)),
   panel(labels.teachingMovements,teaching(s.seriesTeaching)),
   panel(labels.jesusConnection,`<p>${esc(s.seriesJesusConnection)}</p>`),
   panel(labels.doNotMiss,`<p>${esc(s.seriesGuardrail)}</p>`),
   panel(labels.discussion,list(s.seriesQuestions,true)),
   panel(labels.personalExamination,`<p>${esc(s.seriesExamination)}</p>`),
   panel(labels.weeklyPractice,`<p>${esc(s.seriesPractice)}</p>`),
   panel(labels.leaderGuidance,`<p>${esc(s.seriesLeaderGuidance)}</p>`),
   panel(labels.closingTakeaway,`<p>${esc(s.seriesClosingTakeaway)}</p>`),
   panel(labels.closingPrayer,`<p>${esc(s.seriesPrayer)}</p>`,'prayer-panel prayer')
  ].join('');
  view.innerHTML=`<section class="book-overview james-intro"><p class="kicker">${esc(labels.seriesPurpose)}</p><p>${esc(s.purpose)}</p><h2>${esc(labels.recommendedSessionLength)}: ${esc(s.recommendedSessionLength)}</h2><h3>${esc(labels.suggestedFlow)}</h3>${list(s.suggestedFlow)}<h3>${esc(labels.leaderChecklist)}</h3>${list(s.leaderChecklist)}<a class="button primary" href="${href(s.lessons.find(x=>!done.has(x.week))?.week||1)}">${esc(done.size?labels.continueStudy:labels.beginWeek)} →</a></section><article class="book-lesson james-series-guide">${guide}</article><section class="book-grid james-grid">${s.lessons.map(x=>`<article class="book-card james-card ${done.has(x.week)?'is-complete':''}"><span>${esc(labels.week)} ${x.week}${done.has(x.week)?` · ${esc(labels.completed)}`:''}</span><h2>${esc(x.title)}</h2><p>${esc(labels.goal)}: ${esc(x.goal)}</p><small>${esc(labels.text)}: ${esc(x.scripture)} · ${esc(s.recommendedSessionLength)}</small><a href="${href(x.week)}">${esc(labels.openLesson)} →</a></article>`).join('')}</section>`;
 }
 function detail(x){
  const i=s.lessons.indexOf(x),prev=s.lessons[i-1],next=s.lessons[i+1];
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="${esc(route)}">← ${esc(labels.seriesOverview)}</a><p class="kicker">${esc(labels.week)} ${x.week}</p><h1>${esc(x.title)}</h1><p class="book-lead">${esc(labels.text)}: ${esc(x.scripture)}</p><p class="book-lead">${esc(labels.goal)}: ${esc(x.goal)}</p>${ntvBadge?`<div class="series-meta">${ntvBadge}</div>`:''}</div>`;
  view.innerHTML=`<article class="book-lesson james-lesson">
   ${panel(labels.supportingScriptures,list(x.supporting))}
   ${panel(labels.centralQuestion,`<p>${esc(x.question)}</p>`)}
   ${panel(labels.keyTruth,`<p>${esc(x.truth)}</p>`)}
   ${panel(labels.opening,`<p>${esc(x.opening)}</p>`)}
   ${panel(labels.scriptureContext,paras(x.contextParagraphs))}
   ${panel(labels.teachingMovements,teaching(x.teaching))}
   ${panel(labels.jesusConnection,`<p>${esc(x.jesusConnection)}</p>`)}
   ${panel(labels.doNotMiss,`<p>${esc(x.guardrail)}</p>`)}
   ${panel(labels.discussion,list(x.discussion,true))}
   ${panel(labels.personalExamination,`<p>${esc(x.examination)}</p>`)}
   ${panel(labels.weeklyPractice,`<p>${esc(x.practice)}</p>`)}
   ${panel(labels.leaderGuidance,`<p>${esc(x.leaderGuidance)}</p>`)}
   ${panel(labels.closingTakeaway,`<p>${esc(x.closingTakeaway)}</p>`)}
   ${panel(labels.closingPrayer,`<p>${esc(x.prayer)}</p>`,'prayer-panel prayer')}
   <div class="complete-panel"><div><strong>${esc(done.has(x.week)?labels.lessonCompleted:labels.finishedLesson)}</strong><span>${esc(labels.progressSaved)}</span></div><button id="toggle" class="button primary">${esc(done.has(x.week)?labels.markIncomplete:labels.markComplete)}</button></div>
   <nav class="lesson-navigation lesson-nav">${prev?`<a href="${href(prev.week)}">← ${esc(labels.week)} ${prev.week}<strong>${esc(prev.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.week)}">${esc(labels.week)} ${next.week} →<strong>${esc(next.title)}</strong></a>`:`<a href="${esc(route)}">${esc(labels.seriesComplete)} →<strong>${esc(labels.returnOverview)}</strong></a>`}</nav>
  </article>`;
  document.getElementById('toggle').onclick=()=>{const st=state(),set=new Set(st.completed||[]);set.has(x.week)?set.delete(x.week):set.add(x.week);st.completed=[...set].sort((a,b)=>a-b);save(st);location.reload()};
 }
 lesson?detail(lesson):landing();
})();
