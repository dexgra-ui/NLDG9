(function(){
  const params=new URLSearchParams(location.search);
  const spanishRoute=/\/es\/preparando-para-caminar-con-jesus\.html$/.test(location.pathname);
  const querySpanish=!spanishRoute&&params.get('lang')==='es';
  const lang=(spanishRoute||querySpanish)?'es':'en';
  const series=lang==='es'?(window.NLDG_PREPARING_WALK_ES||window.NLDG_PREPARING_WALK):window.NLDG_PREPARING_WALK;
  const hero=document.getElementById('prep-hero'),view=document.getElementById('prep-view');
  if(!series||!hero||!view)return;
  document.documentElement.lang=lang;
  const T=lang==='es'?{
    title:'Preparándonos para Caminar con Jesús',backMain:'← Caminando con Jesús',foundation:'Fundamento de cuatro lecciones sobre los Evangelios',gospelFoundations:'📖 Fundamentos de los Evangelios',completeLessons:'4 lecciones completas',pace:'A tu propio ritmo',before:'Antes del recorrido',build:'Construye el fundamento antes de comenzar el estudio de 21 semanas.',buildBody:'Avanza desde comprender los cuatro testigos de los Evangelios, a la identidad de Jesús, al costo del discipulado y finalmente a una manera cuidadosa de leer que pone primero las Escrituras.',continueSeries:'Continuar la serie',begin1:'Comenzar la Lección 1',mainSeries:'Serie principal Caminando con Jesús',lesson:'Lección',completed:'Completada',open:'Abrir lección →',then:'Después continúa el recorrido',mainBody:'Continúa con el recorrido principal de 21 semanas, leyendo primero las Escrituras y usando escenas opcionales de The Chosen como ayudas para la conversación.',mainButton:'Comenzar la serie principal →',overview:'← Vista general',of:'de',focus:'Enfoque',opening:'Conversación inicial',read:'Lee la Palabra',discuss:'Conversemos',questions:'Preguntas para conversar',weekly:'Práctica semanal',live:'Vive lo que aprendiste',memory:'Versículo para memorizar',prayer:'Oración final',done:'Lección completada',finished:'¿Terminaste esta lección?',saved:'El progreso se guarda en este dispositivo.',markIncomplete:'Marcar como incompleta',markComplete:'Marcar como completa',continue:'Continuar →',beginMain:'Comenzar Caminando con Jesús',language:'English',home:'Inicio',bibleStudies:'Estudios Bíblicos',library:'Mi Biblioteca',journey:'Mi Recorrido',games:'Juegos',ministry:'Nuestro Ministerio',tagline:'Creado a Su imagen. Creciendo en Su verdad.',footer:'Conoce a Jesús con claridad. Sigue a Jesús con fidelidad.'
  }:{
    title:'Preparing to Walk with Jesus',backMain:'← Walking with Jesus',foundation:'Four-lesson Gospel foundation',gospelFoundations:'📖 Gospel foundations',completeLessons:'4 complete lessons',pace:'Use at your own pace',before:'Before the journey',build:'Build the foundation before beginning the 21-week Gospel study.',buildBody:'Move from understanding the four Gospel witnesses, to the identity of Jesus, to the cost of discipleship, and finally to a careful, Scripture-first way of reading.',continueSeries:'Continue the series',begin1:'Begin Lesson 1',mainSeries:'Main Walking with Jesus Series',lesson:'Lesson',completed:'Completed',open:'Open Lesson →',then:'Then continue the journey',mainBody:'Continue with the 21-week main journey, reading Scripture first and using optional scenes from The Chosen as discussion aids.',mainButton:'Begin the Main Series →',overview:'← Series Overview',of:'of',focus:'Focus',opening:'Opening discussion',read:'Read the Word',discuss:'Discuss',questions:'Discussion Questions',weekly:'Weekly practice',live:'Live what you learned',memory:'Memory verse',prayer:'Closing prayer',done:'Lesson completed',finished:'Finished this lesson?',saved:'Progress is saved on this device.',markIncomplete:'Mark Incomplete',markComplete:'Mark Complete',continue:'Continue →',beginMain:'Begin Walking with Jesus',language:'Español',home:'Home',bibleStudies:'Bible Studies',library:'My Library',journey:'My Journey',games:'Games',ministry:'Our Ministry',tagline:'Created in His image. Growing in His truth.',footer:'Know Jesus clearly. Follow Jesus faithfully.'
  };
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const number=Number(params.get('lesson')||0),lesson=series.lessons.find(item=>item.number===number);
  const pageName=spanishRoute?'preparando-para-caminar-con-jesus.html':'preparing-walk-with-jesus.html';
  const mainHref=spanishRoute?'caminando-con-jesus.html':querySpanish?'es/caminando-con-jesus.html':'walking-with-jesus.html';
  const mainStudyHref=spanishRoute?'caminando-con-jesus-estudio.html?week=1':querySpanish?'walking-with-jesus-study.html?week=1&lang=es':'walking-with-jesus-study.html?week=1';
  const langQuery=querySpanish?'&lang=es':'';
  const href=n=>`${pageName}?lesson=${n}${langQuery}`;
  const overviewHref=`${pageName}${querySpanish?'?lang=es':''}`;
  const switchHref=spanishRoute
    ?`../preparing-walk-with-jesus.html${lesson?`?lesson=${lesson.number}`:''}`
    :querySpanish
      ?`preparing-walk-with-jesus.html${lesson?`?lesson=${lesson.number}`:''}`
      :`es/preparando-para-caminar-con-jesus.html${lesson?`?lesson=${lesson.number}`:''}`;
  const progressKey=`nldg-preparing-walk-completed-${lang}`;
  const readProgress=()=>{try{return new Set(JSON.parse(localStorage.getItem(progressKey)||'[]'))}catch{return new Set()}};
  const saveProgress=set=>{try{localStorage.setItem(progressKey,JSON.stringify([...set].sort()))}catch{}};
  const completed=readProgress();
  function applyChrome(){
    if(spanishRoute)return;
    const brandSmall=document.querySelector('.brand small');if(brandSmall)brandSmall.textContent=T.tagline;
    const menu=document.querySelector('.menu');if(menu)menu.textContent=lang==='es'?'Menú':'Menu';
    const nav=document.querySelector('.site-header nav');if(nav)nav.innerHTML=`<a href="index.html">${T.home}</a><a class="active" href="studies.html">${T.bibleStudies}</a><a href="study-library.html">${T.library}</a><a href="dashboard.html">${T.journey}</a><a href="play.html">${T.games}</a>`;
    const footerText=document.querySelector('.footer-invitation p');if(footerText)footerText.textContent=T.footer;
    const footerLinks=document.querySelector('.footer-links');if(footerLinks)footerLinks.innerHTML=`<a href="studies.html">${T.bibleStudies}</a><a href="${mainHref}">${lang==='es'?'Caminando con Jesús':'Walking with Jesus'}</a><a href="study-library.html">${T.library}</a><a href="about.html">${T.ministry}</a>`;
  }
  const languageSwitch=()=>`<a class="language-switch" href="${switchHref}" hreflang="${lang==='es'?'en':'es'}">${T.language}</a>`;
  function landing(){
    document.title=`${T.title} | No Labels, Designed by God`;
    hero.innerHTML=`<div class="prep-hero-inner"><div class="prep-topline"><a class="series-back" href="${mainHref}">${T.backMain}</a>${languageSwitch()}</div><p class="kicker">${T.foundation}</p><h1>${esc(series.title)}</h1><p class="prep-lead">${esc(series.description)}</p><blockquote>${esc(series.theme)}</blockquote><div class="prep-meta"><span>${T.gospelFoundations}</span><span>${T.completeLessons}</span><span>${T.pace}</span></div></div>`;
    const next=series.lessons.find(item=>!completed.has(item.number))||series.lessons[0];
    view.innerHTML=`<section class="prep-intro"><p class="kicker">${T.before}</p><h2>${T.build}</h2><p>${T.buildBody}</p><div class="actions"><a class="button primary" href="${href(next.number)}">${completed.size?T.continueSeries:T.begin1} →</a><a class="button secondary" href="${mainHref}">${T.mainSeries}</a></div></section><section class="prep-grid">${series.lessons.map(item=>`<article class="prep-card ${completed.has(item.number)?'is-complete':''}"><span>${T.lesson} ${item.number}${completed.has(item.number)?` · ${T.completed}`:''}</span><h2>${esc(item.title)}</h2><p>${esc(item.question)}</p><small>📖 ${esc(item.scripture)}</small><a href="${href(item.number)}">${T.open}</a></article>`).join('')}</section><section class="prep-launch"><p class="kicker">${T.then}</p><h2>${lang==='es'?'Caminando con Jesús':'Walking with Jesus'}</h2><p>${T.mainBody}</p><a class="button primary" href="${mainStudyHref}">${T.mainButton}</a></section>`;
  }
  function render(item){
    const index=series.lessons.indexOf(item),previous=series.lessons[index-1],next=series.lessons[index+1];
    document.title=`${item.title} | ${T.title}`;
    document.body.dataset.studyPage=`preparing-walk-lesson-${item.number}-${lang}`;
    hero.innerHTML=`<div class="prep-hero-inner"><div class="prep-topline"><a class="series-back" href="${overviewHref}">${T.overview}</a>${languageSwitch()}</div><p class="kicker">${T.lesson} ${item.number} ${T.of} ${series.lessons.length}</p><h1>${esc(item.title)}</h1><p class="prep-lead">${esc(item.question)}</p><div class="prep-meta"><span>📖 ${esc(item.scripture)}</span><span>${T.pace}</span></div></div>`;
    view.innerHTML=`<article class="prep-lesson"><section class="truth-banner"><p class="kicker">${T.focus}</p><h2>${esc(item.focus)}</h2><p>${esc(item.truth)}</p></section><section class="lesson-panel"><p class="kicker">${T.opening}</p><p>${esc(item.opening)}</p></section><section class="lesson-panel scripture-panel"><p class="kicker">${T.read}</p><h2>${esc(item.scripture)}</h2>${item.intro.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</section>${item.movements.map((movement,i)=>`<section class="teaching-section"><div class="teaching-number">${i+1}</div><div><h2>${esc(movement.heading)}</h2>${movement.reference?`<p class="movement-reference">${esc(movement.reference)}</p>`:''}<p>${esc(movement.body)}</p></div></section>`).join('')}<section class="lesson-panel"><p class="kicker">${T.discuss}</p><h2>${T.questions}</h2><ol>${item.questions.map(question=>`<li>${esc(question)}</li>`).join('')}</ol></section><section class="challenge-panel"><p class="kicker">${T.weekly}</p><h2>${T.live}</h2><p>${esc(item.practice)}</p></section><section class="memory-panel"><p class="kicker">${T.memory}</p><h2>${esc(item.memory)}</h2></section><section class="prayer-panel"><p class="kicker">${T.prayer}</p><p>${esc(item.prayer)}</p></section><div class="complete-panel"><div><strong>${completed.has(item.number)?T.done:T.finished}</strong><span>${T.saved}</span></div><button id="prep-complete" class="button primary">${completed.has(item.number)?T.markIncomplete:T.markComplete}</button></div><nav class="lesson-navigation" aria-label="${lang==='es'?'Navegación de lecciones':'Lesson navigation'}">${previous?`<a href="${href(previous.number)}">← ${T.lesson} ${previous.number}<strong>${esc(previous.title)}</strong></a>`:`<a href="${overviewHref}">${T.overview}<strong>${esc(series.title)}</strong></a>`}${next?`<a href="${href(next.number)}">${T.lesson} ${next.number} →<strong>${esc(next.title)}</strong></a>`:`<a href="${mainStudyHref}">${T.continue}<strong>${T.beginMain}</strong></a>`}</nav></article>`;
    document.getElementById('prep-complete').onclick=()=>{completed.has(item.number)?completed.delete(item.number):completed.add(item.number);saveProgress(completed);location.reload()};
  }
  applyChrome();
  lesson?render(lesson):landing();
})();
