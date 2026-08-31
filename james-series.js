(function(){
 const s=window.NLDG_JAMES_SERIES,hero=document.getElementById('james-hero'),view=document.getElementById('james-view');
 if(!s||!hero||!view)return;
 const key='nldg-series-james';
 const state=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}')}catch(e){return{completed:[]}}};
 const save=x=>{try{localStorage.setItem(key,JSON.stringify(x))}catch(e){}};
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const list=items=>`<ul>${(items||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`;
 const labels={
  bibleStudies:'Bible Studies',seriesPurpose:'Series Purpose',recommendedSessionLength:'Recommended Session Length',
  suggestedFlow:'Suggested Flow Each Week',leaderChecklist:'Leader Preparation Checklist (Weekly)',continueStudy:'Continue Study',
  beginWeek:'Begin Week 1',week:'Week',completed:'Completed',goal:'Goal',text:'Text',openLesson:'Open Lesson',
  seriesOverview:'Series Overview',teachingNotes:'Teaching Notes',discussion:'Discussion',leaderTips:'Leader Tips',
  prayerFocus:'Prayer Focus',lessonCompleted:'Lesson completed',finishedLesson:'Finished this lesson?',
  progressSaved:'Progress is saved on this device.',markIncomplete:'Mark Incomplete',markComplete:'Mark Complete',
  seriesComplete:'Series Complete',returnOverview:'Return to Overview',progressTemplate:'{done} of {total} completed',
  ntvBadge:''
 };
 Object.assign(labels,s.labels||{});
 const route=s.route||'james-series.html',libraryHref=s.libraryHref||'studies.html';
 const q=new URLSearchParams(location.search),week=Number(q.get('week')||0),lesson=s.lessons.find(x=>x.week===week),done=new Set(state().completed||[]);
 const href=n=>`${route}?week=${n}`;
 const progressText=()=>labels.progressTemplate.replace('{done}',done.size).replace('{total}',s.lessons.length);
 const ntvBadge=s.scriptureStandard&&labels.ntvBadge?`<span>${esc(labels.ntvBadge)}</span>`:'';
 function landing(){
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="${esc(libraryHref)}">← ${esc(labels.bibleStudies)}</a><p class="kicker">${esc(s.subtitle)}</p><h1>${esc(s.title)}</h1><p class="book-lead">${esc(s.purpose)}</p>${ntvBadge?`<div class="series-meta">${ntvBadge}</div>`:''}<div class="series-progress james-progress"><strong>${esc(progressText())}</strong><progress max="${s.lessons.length}" value="${done.size}"></progress></div></div>`;
  view.innerHTML=`<section class="book-overview james-intro"><p class="kicker">${esc(labels.seriesPurpose)}</p><p>${esc(s.purpose)}</p><h2>${esc(labels.recommendedSessionLength)}: ${esc(s.recommendedSessionLength)}</h2><h3>${esc(labels.suggestedFlow)}</h3>${list(s.suggestedFlow)}<h3>${esc(labels.leaderChecklist)}</h3>${list(s.leaderChecklist)}<a class="button primary" href="${href(s.lessons.find(x=>!done.has(x.week))?.week||1)}">${esc(done.size?labels.continueStudy:labels.beginWeek)} →</a></section><section class="book-grid james-grid">${s.lessons.map(x=>`<article class="book-card james-card ${done.has(x.week)?'is-complete':''}"><span>${esc(labels.week)} ${x.week}${done.has(x.week)?` · ${esc(labels.completed)}`:''}</span><h2>${esc(x.title)}</h2><p>${esc(labels.goal)}: ${esc(x.goal)}</p><small>${esc(labels.text)}: ${esc(x.scripture)} · ${esc(s.recommendedSessionLength)}</small><a href="${href(x.week)}">${esc(labels.openLesson)} →</a></article>`).join('')}</section>`;
 }
 function detail(x){
  const i=s.lessons.indexOf(x),prev=s.lessons[i-1],next=s.lessons[i+1];
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="${esc(route)}">← ${esc(labels.seriesOverview)}</a><p class="kicker">${esc(labels.week)} ${x.week}</p><h1>${esc(x.title)}</h1><p class="book-lead">${esc(labels.text)}: ${esc(x.scripture)}</p><p class="book-lead">${esc(labels.goal)}: ${esc(x.goal)}</p>${ntvBadge?`<div class="series-meta">${ntvBadge}</div>`:''}</div>`;
  view.innerHTML=`<article class="book-lesson james-lesson"><section class="lesson-panel"><h2>${esc(labels.teachingNotes)}</h2>${list(x.teachingNotes)}</section><section class="lesson-panel"><h2>${esc(x.discussionLabel||labels.discussion)}</h2><ol>${(x.discussion||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ol></section><section class="lesson-panel"><h2>${esc(labels.leaderTips)}</h2>${list(x.leaderTips)}</section><section class="prayer-panel prayer"><h2>${esc(labels.prayerFocus)}</h2><p>${esc(x.prayerFocus)}</p></section><div class="complete-panel"><div><strong>${esc(done.has(x.week)?labels.lessonCompleted:labels.finishedLesson)}</strong><span>${esc(labels.progressSaved)}</span></div><button id="toggle" class="button primary">${esc(done.has(x.week)?labels.markIncomplete:labels.markComplete)}</button></div><nav class="lesson-navigation lesson-nav">${prev?`<a href="${href(prev.week)}">← ${esc(labels.week)} ${prev.week}<strong>${esc(prev.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.week)}">${esc(labels.week)} ${next.week} →<strong>${esc(next.title)}</strong></a>`:`<a href="${esc(route)}">${esc(labels.seriesComplete)} →<strong>${esc(labels.returnOverview)}</strong></a>`}</nav></article>`;
  document.getElementById('toggle').onclick=()=>{const st=state(),set=new Set(st.completed||[]);set.has(x.week)?set.delete(x.week):set.add(x.week);st.completed=[...set].sort((a,b)=>a-b);save(st);location.reload()};
 }
 lesson?detail(lesson):landing();
})();