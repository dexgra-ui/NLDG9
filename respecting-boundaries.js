(function(){
  const study=window.NLDG_RESPECTING_BOUNDARIES;
  const hero=document.getElementById('boundaries-hero');
  const view=document.getElementById('boundaries-view');
  if(!study||!hero||!view)return;

  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const params=new URLSearchParams(location.search);
  const page=params.get('view')||'';
  const lessonById=id=>study.lessons.find(item=>item.id===id);
  const list=items=>items?.length?`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'';
  const paragraphs=items=>items?.length?items.map(item=>`<p>${esc(item)}</p>`).join(''):'';
  const cards=items=>items?.length?`<div class="boundary-card-grid">${items.map(([title,body])=>`<article><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div>`:'';
  const lines=items=>items?.length?`<div class="boundary-lines">${items.map(item=>`<p><strong>${esc(item)}:</strong> <span aria-hidden="true">________________________________________</span></p>`).join('')}</div>`:'';
  const scenarios=items=>items?.length?`<div class="scenario-grid">${items.map(item=>`<article class="scenario-card"><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p><p><strong>Teaching point:</strong> ${esc(item.point)}</p></article>`).join('')}</div>`:'';
  const section=section=>`<section class="boundary-panel"><h2>${esc(section.title)}</h2>${paragraphs(section.body)}${list(section.bullets)}${cards(section.cards)}${lines(section.lines)}${scenarios(section.scenarios)}</section>`;
  const printButton=()=>'<button class="button secondary print-button" type="button" onclick="window.print()">Print / Save as PDF</button>';

  function renderLanding(){
    document.title=`${study.title} | No Labels, Designed by God`;
    hero.innerHTML=`<div class="boundaries-hero-inner"><a class="series-back" href="studies.html">← Bible Studies</a><p class="kicker">Age-Based Bible Study & Safety Resource</p><h1>${esc(study.title)}</h1><p class="boundaries-subtitle">${esc(study.subtitle)}</p><p class="boundaries-lead">${esc(study.description)}</p><blockquote>${esc(study.theme)}</blockquote><div class="memory-line"><span>Core memory line</span><strong>${esc(study.memoryLine)}</strong></div></div>`;
    view.innerHTML=`<section class="why-panel"><p class="kicker">Why this matters</p><h2>Teach dignity and boundaries before a crisis.</h2><p>${esc(study.whyItMatters)}</p></section>
    <section class="boundary-choice-section"><div class="section-heading"><p class="kicker">Choose the right age level</p><h2>Do not teach all ages as one combined session.</h2><p>Each lesson uses the same biblical foundation with language and scenarios matched to the maturity of the group.</p></div><div class="boundary-choice-grid">${study.lessons.map(item=>`<article class="boundary-choice-card"><span>${esc(item.label)}</span><h3>${esc(item.subtitle)}</h3><p>${esc(item.bigQuestion)}</p><small>◷ ${esc(item.duration)}</small><div class="card-actions"><a href="respecting-boundaries.html?view=lesson-${esc(item.id)}">Open Lesson →</a><a href="respecting-boundaries.html?view=handout-${esc(item.id)}">Student Handout</a></div></article>`).join('')}</div></section>
    <section class="resource-grid"><article class="resource-card"><span>For families</span><h2>Parent & Caregiver Overview</h2><p>See what the lessons teach, how the age levels differ, and how to reinforce dignity and boundaries at home.</p><a href="respecting-boundaries.html?view=parent">Open Parent Overview →</a></article><article class="resource-card"><span>For ministry teams</span><h2>Leader & Safeguarding Guide</h2><p>Prepare leaders, establish group agreements, respond appropriately to disclosures, and verify reporting procedures before teaching.</p><a href="respecting-boundaries.html?view=leader">Open Leader Guide →</a></article></section>
    <aside class="safety-notice"><strong>Important:</strong> ${esc(study.safetyNotice)}</aside>`;
  }

  function renderLesson(item){
    document.body.dataset.studyPage=`respecting-boundaries-${item.id}`;
    document.body.dataset.studyTitle=`Respecting Boundaries — ${item.label}`;
    document.title=`${item.label} | ${study.title}`;
    hero.innerHTML=`<div class="boundaries-hero-inner"><a class="series-back" href="respecting-boundaries.html">← Respecting Boundaries</a><p class="kicker">${esc(item.label)} Lesson</p><h1>${esc(study.title)}</h1><p class="boundaries-subtitle">${esc(item.subtitle)}</p><div class="series-meta"><span>◷ ${esc(item.duration)}</span><span>◎ Two screened adults recommended</span></div></div>`;
    view.innerHTML=`<article class="boundary-lesson"><section class="truth-banner"><p class="kicker">Big question</p><h2>${esc(item.bigQuestion)}</h2><p><strong>Main truth:</strong> ${esc(item.truth)}</p></section><section class="boundary-panel scripture-panel"><p class="kicker">Scripture</p><h2>Read and discuss</h2>${list(item.scripture)}</section>${item.sections.map(section).join('')}${item.questions?.length?`<section class="boundary-panel"><p class="kicker">Discuss</p><h2>Discussion Questions</h2><ol>${item.questions.map(question=>`<li>${esc(question)}</li>`).join('')}</ol></section>`:''}${item.reflection?`<section class="boundary-panel reflection-panel"><p class="kicker">Personal reflection</p><p>${esc(item.reflection)}</p></section>`:''}${item.takeaway?`<section class="takeaway-panel"><p class="kicker">Closing takeaway</p><p>${esc(item.takeaway)}</p></section>`:''}<section class="prayer-panel"><p class="kicker">Closing prayer</p><p>${esc(item.prayer)}</p></section>${item.leaderFollowUp?`<aside class="leader-note"><strong>Leader follow-up:</strong> ${esc(item.leaderFollowUp)}</aside>`:''}<div class="lesson-actions">${printButton()}<a class="button secondary" href="respecting-boundaries.html?view=handout-${esc(item.id)}">Open Student Handout</a><a class="button secondary" href="respecting-boundaries.html?view=leader">Leader Guide</a></div><aside class="safety-notice"><strong>Important:</strong> ${esc(study.safetyNotice)}</aside></article>`;
  }

  function renderHandout(item){
    const handout=item.handout;
    document.body.classList.add('handout-page');
    document.title=`${handout.title} | ${study.title}`;
    hero.innerHTML=`<div class="boundaries-hero-inner handout-hero-inner"><a class="series-back" href="respecting-boundaries.html?view=lesson-${esc(item.id)}">← ${esc(item.label)} Lesson</a><p class="kicker">Printable Student Handout</p><h1>${esc(study.title)}</h1><p class="boundaries-subtitle">${esc(handout.title)}</p>${printButton()}</div>`;
    view.innerHTML=`<article class="student-handout"><section class="handout-intro"><h2>Main truth</h2><p>${esc(handout.intro)}</p><div class="memory-line"><span>Remember</span><strong>${esc(study.memoryLine)}</strong></div></section>${handout.sections.map(section).join('')}<section class="handout-final"><strong>${esc(study.memoryLine)}</strong></section></article>`;
  }

  function renderResource(resource,type){
    document.title=`${resource.title} | ${study.title}`;
    hero.innerHTML=`<div class="boundaries-hero-inner"><a class="series-back" href="respecting-boundaries.html">← Respecting Boundaries</a><p class="kicker">${type==='leader'?'Ministry Resource':'Family Resource'}</p><h1>${esc(resource.title)}</h1><p class="boundaries-subtitle">${esc(resource.subtitle)}</p><div class="hero-actions">${printButton()}</div></div>`;
    view.innerHTML=`<article class="boundary-resource">${resource.sections.map(section).join('')}<aside class="safety-notice"><strong>Important:</strong> ${esc(study.safetyNotice)}</aside></article>`;
  }

  if(page==='parent')renderResource(study.parent,'parent');
  else if(page==='leader')renderResource(study.leader,'leader');
  else if(page.startsWith('lesson-')){
    const item=lessonById(page.replace('lesson-',''));
    item?renderLesson(item):renderLanding();
  }else if(page.startsWith('handout-')){
    const item=lessonById(page.replace('handout-',''));
    item?renderHandout(item):renderLanding();
  }else renderLanding();
})();
