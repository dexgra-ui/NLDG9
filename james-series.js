(function(){
 const s=window.NLDG_JAMES_SERIES,hero=document.getElementById('james-hero'),view=document.getElementById('james-view');
 if(!s||!hero||!view)return;
 const key='nldg-series-james';
 const state=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}')}catch(e){return{completed:[]}}};
 const save=x=>{try{localStorage.setItem(key,JSON.stringify(x))}catch(e){}};
 const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const list=items=>`<ul>${(items||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`;
 const q=new URLSearchParams(location.search),week=Number(q.get('week')||0),lesson=s.lessons.find(x=>x.week===week),done=new Set(state().completed||[]);
 const href=n=>`james-series.html?week=${n}`;
 function landing(){
  hero.innerHTML=`<div><a class="series-back" href="studies.html">← Bible Studies</a><p class="kicker">${esc(s.subtitle)}</p><h1>${esc(s.title)}</h1><p>${esc(s.purpose)}</p><div class="james-progress"><strong>${done.size} of ${s.lessons.length} completed</strong><progress max="${s.lessons.length}" value="${done.size}"></progress></div></div>`;
  view.innerHTML=`<section class="james-intro"><div><p class="kicker">Series Purpose</p><p>${esc(s.purpose)}</p><h2>Recommended Session Length: ${esc(s.recommendedSessionLength)}</h2><h3>Suggested Flow Each Week</h3>${list(s.suggestedFlow)}<h3>Leader Preparation Checklist (Weekly)</h3>${list(s.leaderChecklist)}</div><a class="button primary" href="${href(s.lessons.find(x=>!done.has(x.week))?.week||1)}">${done.size?'Continue Study':'Begin Week 1'} →</a></section><section class="james-grid">${s.lessons.map(x=>`<article class="james-card ${done.has(x.week)?'is-complete':''}"><span>Week ${x.week}</span><h3>${esc(x.title)}</h3><p>Goal: ${esc(x.goal)}</p><small>Text: ${esc(x.scripture)} · ${esc(s.recommendedSessionLength)}</small><a href="${href(x.week)}">Open Lesson →</a></article>`).join('')}</section>`;
 }
 function detail(x){
  const i=s.lessons.indexOf(x),prev=s.lessons[i-1],next=s.lessons[i+1];
  hero.innerHTML=`<div><a class="series-back" href="james-series.html">← Series Overview</a><p class="kicker">Week ${x.week}</p><h1>${esc(x.title)}</h1><p>Text: ${esc(x.scripture)}</p><p>Goal: ${esc(x.goal)}</p></div>`;
  view.innerHTML=`<article class="james-lesson"><section><h2>Teaching Notes</h2>${list(x.teachingNotes)}</section><section><h2>${esc(x.discussionLabel||'Discussion')}</h2><ol>${(x.discussion||[]).map(v=>`<li>${esc(v)}</li>`).join('')}</ol></section><section><h2>Leader Tips</h2>${list(x.leaderTips)}</section><section class="prayer"><h2>Prayer Focus</h2><p>${esc(x.prayerFocus)}</p></section><div class="complete-panel"><div><strong>${done.has(x.week)?'Lesson completed':'Finished this lesson?'}</strong><span>Progress is saved on this device.</span></div><button id="toggle" class="button primary">${done.has(x.week)?'Mark Incomplete':'Mark Complete'}</button></div><nav class="lesson-nav">${prev?`<a href="${href(prev.week)}">← Week ${prev.week}<strong>${esc(prev.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.week)}">Week ${next.week} →<strong>${esc(next.title)}</strong></a>`:`<a href="james-series.html">Series Complete →<strong>Return to Overview</strong></a>`}</nav></article>`;
  document.getElementById('toggle').onclick=()=>{const st=state(),set=new Set(st.completed||[]);set.has(x.week)?set.delete(x.week):set.add(x.week);st.completed=[...set].sort((a,b)=>a-b);save(st);location.reload()};
 }
 lesson?detail(lesson):landing();
})();