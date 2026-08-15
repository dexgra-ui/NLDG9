(function(){
 const s=window.NLDG_BOOK_STUDY,hero=document.getElementById('book-hero'),view=document.getElementById('book-view');if(!s||!hero||!view)return;
 const key=`nldg-book-${s.slug}`,esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{"completed":[]}')}catch{return{completed:[]}}},save=v=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{}};
 const done=new Set(read().completed||[]),n=Number(new URLSearchParams(location.search).get('lesson')||0),lesson=s.lessons.find(x=>x.number===n),href=x=>`${s.slug}.html?lesson=${x}`;
 function landing(){
  document.title=`${s.title} | No Labels, Designed by God`;
  const themeLabel=s.themeLabel?`<p class="kicker series-theme-label">${esc(s.themeLabel)}</p>`:'';
  const theme=s.theme?`${themeLabel}<blockquote>${esc(s.theme)}</blockquote>`:'';
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="studies.html">← Bible Studies</a><p class="kicker">Book-by-Book Bible Study</p><h1>${esc(s.title)}</h1><p class="book-lead">${esc(s.description)}</p>${theme}<div class="series-meta"><span>📖 ${esc(s.book)}</span><span>◷ ${s.lessons.length} lessons · 60–75 minutes</span><span>◎ ${esc(s.audience)}</span></div><div class="series-progress"><strong>${done.size} of ${s.lessons.length} completed</strong><progress max="${s.lessons.length}" value="${done.size}"></progress></div></div>`;
  const next=s.lessons.find(x=>!done.has(x.number))||s.lessons[0];
  const sourceGuideParts=[];
  if(s.seriesQuestion)sourceGuideParts.push(`<section class="truth-banner"><p class="kicker">Central question</p><h2>${esc(s.seriesQuestion)}</h2></section>`);
  if(s.seriesOpening)sourceGuideParts.push(`<section class="lesson-panel"><p class="kicker">Series guide</p><h2>Opening</h2><p>${esc(s.seriesOpening)}</p></section>`);
  if(s.seriesMainScripture||s.seriesContext)sourceGuideParts.push(`<section class="lesson-panel scripture-panel"><p class="kicker">Read the Word</p>${s.seriesMainScripture?`<h2>${esc(s.seriesMainScripture)}</h2>`:''}${s.seriesContext?`<p>${esc(s.seriesContext)}</p>`:''}</section>`);
  if(s.seriesTeaching?.length)sourceGuideParts.push(s.seriesTeaching.map((t,j)=>`<section class="teaching-section"><div class="teaching-number">${j+1}</div><div><h2>${esc(t.heading)}</h2><p>${esc(t.body)}</p></div></section>`).join(''));
  if(s.seriesQuestions?.length)sourceGuideParts.push(`<section class="lesson-panel"><p class="kicker">Discuss</p><h2>Discussion Questions</h2><ol>${s.seriesQuestions.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></section>`);
  if(s.seriesExamination)sourceGuideParts.push(`<section class="lesson-panel"><p class="kicker">Personal examination</p><h2>Bring the series home</h2><p>${esc(s.seriesExamination)}</p></section>`);
  if(s.seriesPractice)sourceGuideParts.push(`<section class="challenge-panel"><p class="kicker">Weekly practice</p><h2>Live the Word</h2><p>${esc(s.seriesPractice)}</p></section>`);
  if(s.seriesLeaderGuidance)sourceGuideParts.push(`<aside class="leader-note"><strong>Leader guidance:</strong> ${esc(s.seriesLeaderGuidance)}</aside>`);
  const sourceGuide=sourceGuideParts.length?`<section class="book-lesson series-source-guide" aria-label="Full series guide">${sourceGuideParts.join('')}</section>`:'';
  const customGuideBlocks=(s.seriesGuideBlocks||[]).map(block=>{
   const paragraphs=(block.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('');
   const text=block.text?`<p>${esc(block.text)}</p>`:'';
   const items=(block.items||[]).length?`<ul>${block.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'';
   return `<article class="lesson-panel"><p class="kicker">Series guide</p><h2>${esc(block.title)}</h2>${paragraphs}${text}${items}</article>`;
  }).join('');
  const customGuide=customGuideBlocks?`<section class="series-guide source-fidelity-guide" aria-label="Source series guide">${customGuideBlocks}</section>`:'';
  const guideSections=[
   {title:'Recommended Rhythm',text:s.recommendedRhythm},
   {title:'Facilitator Safeguards',text:s.facilitatorSafeguards},
   {title:'How to Read Together',text:s.howToReadTogether}
  ].filter(item=>item.text);
  const guide=guideSections.length?`<section class="series-guide" aria-label="Series guide">${guideSections.map(item=>`<article class="lesson-panel"><p class="kicker">Series guide</p><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p></article>`).join('')}</section>`:'';
  const seriesPrayer=s.seriesPrayer?`<section class="prayer-panel series-prayer"><p class="kicker">Series closing prayer</p><p>${esc(s.seriesPrayer)}</p></section>`:'';
  const backgroundBlock=s.background?`<p class="kicker">Study foundation</p><p>${esc(s.background)}</p>`:'';
  view.innerHTML=`<section class="book-overview"><p class="kicker">Series purpose</p><h2>${esc(s.purpose)}</h2>${backgroundBlock}<a class="button primary" href="${href(next.number)}">${done.size?'Continue':'Begin Lesson 1'} →</a></section>${sourceGuide}${customGuide}<div class="section-heading series-lesson-map"><p class="kicker">Lesson map</p><h2>Choose a lesson</h2></div><section class="book-grid">${s.lessons.map(x=>`<article class="book-card ${done.has(x.number)?'is-complete':''}"><span>Lesson ${x.number}${done.has(x.number)?' · Completed':''}</span><h2>${esc(x.title)}</h2><p>${esc(x.question)}</p><small>📖 ${esc(x.scripture)}</small><a href="${href(x.number)}">Open Lesson →</a></article>`).join('')}</section>${guide}${seriesPrayer}`;
 }
 function render(x){
  document.title=`${x.title} | ${s.title}`;
  const i=s.lessons.indexOf(x),prev=s.lessons[i-1],next=s.lessons[i+1],supporting=x.supporting?.length?`<p>Supporting Scripture: ${x.supporting.map(esc).join(' · ')}</p>`:'';
  const sourceSubtitle=s.lessonSubtitleMode&&x.subtitle?`<p class="book-lead">${esc(x.subtitle)}</p>`:'';
  const purposeLabel=esc(s.lessonPurposeLabel||'Lesson purpose');
  const openingPanel=s.lessonSubtitleMode?`<section class="lesson-panel"><h2>Opening</h2><p>${esc(x.opening)}</p></section>`:`<section class="lesson-panel"><p class="kicker">${purposeLabel}</p><p>${esc(x.goal)}</p><h2>Opening</h2><p>${esc(x.opening)}</p></section>`;
  hero.innerHTML=`<div class="book-hero-inner"><a class="series-back" href="${s.slug}.html">← Series Overview</a><p class="kicker">Lesson ${x.number} of ${s.lessons.length}</p><h1>${esc(x.title)}</h1>${sourceSubtitle}<p class="book-lead">${esc(x.question)}</p><div class="series-meta"><span>📖 ${esc(x.scripture)}</span><span>◷ 60–75 minutes</span></div></div>`;
  view.innerHTML=`<article class="book-lesson"><section class="truth-banner"><p class="kicker">Key truth</p><h2>${esc(x.truth)}</h2></section>${openingPanel}<section class="lesson-panel scripture-panel"><p class="kicker">Read the Word</p><h2>${esc(x.scripture)}</h2>${supporting}<p>${esc(x.context)}</p></section>${x.teaching.map((t,j)=>`<section class="teaching-section"><div class="teaching-number">${j+1}</div><div><h2>${esc(t.heading)}</h2><p>${esc(t.body)}</p></div></section>`).join('')}<section class="lesson-panel"><p class="kicker">Discuss</p><h2>Discussion Questions</h2><ol>${x.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></section><section class="lesson-panel"><p class="kicker">Personal examination</p><h2>Bring the lesson home</h2><p>${esc(x.examination)}</p></section><section class="challenge-panel"><p class="kicker">Weekly practice</p><h2>Live the Word</h2><p>${esc(x.challenge)}</p></section><aside class="leader-note"><strong>Leader guidance:</strong> ${esc(x.caution)}</aside><section class="prayer-panel"><p class="kicker">Closing prayer</p><p>${esc(x.prayer)}</p></section><div class="complete-panel"><div><strong>${done.has(x.number)?'Lesson completed':'Finished this lesson?'}</strong><span>Progress is saved on this device.</span></div><button id="toggle-complete" class="button primary">${done.has(x.number)?'Mark Incomplete':'Mark Complete'}</button></div><nav class="lesson-navigation">${prev?`<a href="${href(prev.number)}">← Lesson ${prev.number}<strong>${esc(prev.title)}</strong></a>`:'<span></span>'}${next?`<a href="${href(next.number)}">Lesson ${next.number} →<strong>${esc(next.title)}</strong></a>`:`<a href="${s.slug}.html">Series Complete →<strong>Return to Overview</strong></a>`}</nav></article>`;
  document.getElementById('toggle-complete').onclick=()=>{const st=read(),set=new Set(st.completed||[]);set.has(x.number)?set.delete(x.number):set.add(x.number);st.completed=[...set].sort((a,b)=>a-b);save(st);location.reload()}
 }
 lesson?render(lesson):landing();
})();
