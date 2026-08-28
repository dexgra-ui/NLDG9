(()=>{
  const e=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const list=items=>`<ul>${(items||[]).map(x=>`<li>${e(x)}</li>`).join('')}</ul>`;
  const p=new URLSearchParams(location.search);
  const lang=p.get('lang')==='es'?'es':'en';
  const key=p.get('week')||'1';
  const englishApi=window.NLDG_WALKING_WITH_JESUS_API;
  const spanishApi=window.NLDG_WALKING_WITH_JESUS_ES_API;
  const requestedEnglish=/^\d+$/.test(key)?englishApi?.byNumber(key):englishApi?.bySlug(key);
  const requestedSpanish=/^\d+$/.test(key)?spanishApi?.byNumber(key):spanishApi?.bySlug(key);
  const lesson=lang==='es'?requestedSpanish:requestedEnglish;
  const root=document.getElementById('walking-with-jesus-root');
  const ui=lang==='es'?{
    series:'Caminando con Jesús',week:'Semana',of:'de',pace:'Estudia a tu propio ritmo',begin:'Comienza con las Escrituras',beginText:'antes de ver cualquier escena. Pregunta: ¿Qué revela este texto acerca de Jesús?',supporting:'Escrituras de apoyo',context:'Contexto en lenguaje sencillo',contextTitle:'Mira el pasaje dentro de su historia más amplia',flow:'Flujo sugerido de la lección',flowItems:['Bienvenida y conexión','Leer y observar las Escrituras','Explorar la enseñanza bíblica','Presentar, mirar y evaluar el recurso visual','Conversar y aplicar','Reflexionar, orar y elegir un próximo paso'],flowNote:'Usa todo el flujo o selecciona las secciones que mejor sirvan a tu contexto. Las personas y los grupos pueden avanzar a su propio ritmo.',truths:'Verdades centrales',jesus:'Conexión con Jesús',jesusTitle:'Mantén claro el centro de la lección',distinctions:'No confundas estas cosas',distinctionsTitle:'Distinciones útiles',visual:'Recurso visual opcional para conversar',start:'Punto de inicio',stop:'Punto de cierre',clip:'Duración estimada',biblical:'Conexión bíblica',creative:'Elementos creativos',check:'Verificación con las Escrituras',leader:'Nota de profundidad para líderes',discuss:'Conversemos',live:'Vívelo esta semana',memory:'Versículo para memorizar',prayer:'Oración',rights:'The Chosen es un recurso opcional para conversar, no un reemplazo de las Escrituras. No alojamos videos aquí. Todos los derechos del programa pertenecen a sus respectivos propietarios; este estudio no está afiliado ni respaldado por la producción.',collection:'Colección',print:'Imprimir lección',home:'Inicio de la colección',big:'Gran pregunta',order:'Orden importante',orderItems:['Lee la Biblia.','Mira la escena seleccionada.','Compara la escena con el texto.'],english:'English',spanish:'Español',pending:'Traducción en progreso',pendingText:'Esta semana todavía no está disponible en español. Las Semanas 1–4 ya están traducidas y estamos avanzando por bloques para preservar el contexto, la claridad y el enfoque en Jesús.',backTranslated:'Volver a la Semana 4 en español',openEnglish:'Abrir esta semana en inglés'
  }:{
    series:'Walking with Jesus',week:'Week',of:'of',pace:'Study at your own pace',begin:'Begin with Scripture',beginText:'before watching any scene. Ask: What does this text reveal about Jesus?',supporting:'Supporting Scripture',context:'Context in plain English',contextTitle:'See the passage in its larger story',flow:'Suggested lesson flow',flowItems:['Welcome and connect','Read and observe Scripture','Explore the biblical teaching','Introduce, watch, and check the visual','Discuss and apply','Reflect, pray, and choose a next step'],flowNote:'Use the entire flow or select the sections that serve your setting. Individuals and groups may move at their own pace.',truths:'Core truths',jesus:'Jesus connection',jesusTitle:'Keep the center of the lesson clear',distinctions:'Don’t confuse these',distinctionsTitle:'Helpful distinctions',visual:'Optional visual discussion aid',start:'Start cue',stop:'Stop cue',clip:'Estimated clip',biblical:'Biblical connection',creative:'Creative elements',check:'Scripture check',leader:'Leader depth note',discuss:'Discuss',live:'Live it this week',memory:'Memory verse',prayer:'Prayer',rights:'The Chosen is an optional discussion aid, not a replacement for Scripture. No video is hosted here. All program rights belong to their respective owners; this study is not affiliated with or endorsed by the production.',collection:'Collection',print:'Print Lesson',home:'Collection Home',big:'Big question',order:'Important order',orderItems:['Read the Bible.','Watch the selected scene.','Compare the scene with the text.'],english:'English',spanish:'Español'
  };
  document.documentElement.lang=lang;
  const languageSwitch=number=>`<div class="wj-language-switch" aria-label="Language / Idioma"><a class="${lang==='en'?'is-active':''}" href="walking-with-jesus-study.html?week=${number}">English</a><a class="${lang==='es'?'is-active':''}" href="walking-with-jesus-study.html?week=${number}&lang=es">Español</a></div>`;
  if(lang==='es'&&!lesson&&requestedEnglish){
    const number=requestedEnglish.number;
    document.title=`${ui.pending} | ${ui.series}`;
    root.innerHTML=`<section class="wj-hero"><p class="kicker">${e(ui.series)}</p><h1>${e(ui.pending)}</h1><p class="lead">${e(ui.pendingText)}</p>${languageSwitch(number)}<div class="actions"><a class="button secondary" href="walking-with-jesus-study.html?week=4&lang=es">← ${e(ui.backTranslated)}</a><a class="button primary" href="walking-with-jesus-study.html?week=${number}">${e(ui.openEnglish)} →</a></div></section>`;
    return;
  }
  if(!lesson){root.innerHTML=`<section class="wj-hero"><h1>${lang==='es'?'Lección no encontrada':'Lesson not found'}</h1><a class="button primary" href="walking-with-jesus.html">${lang==='es'?'Volver a la colección':'Return to the collection'}</a></section>`;return;}
  document.body.dataset.studyPage=`walking-with-jesus-week-${lesson.number}`;
  document.body.dataset.studyTitle=lesson.title;
  document.title=`${lesson.title} | ${ui.series}`;
  const api=lang==='es'?spanishApi:englishApi;
  const previous=api?.byNumber(lesson.number-1),next=api?.byNumber(lesson.number+1);
  const href=n=>`walking-with-jesus-study.html?week=${n}${lang==='es'?'&lang=es':''}`;
  const supporting=lesson.supporting?.length?`<p><strong>${e(ui.supporting)}:</strong> ${lesson.supporting.map(e).join(' · ')}</p>`:'';
  const context=lesson.context?.length?`<section class="wj-block"><p class="kicker">${e(ui.context)}</p><h2>${e(ui.contextTitle)}</h2>${lesson.context.map(x=>`<p>${e(x)}</p>`).join('')}</section>`:'';
  const jesus=lesson.jesusConnection?`<section class="wj-block wj-highlight"><p class="kicker">${e(ui.jesus)}</p><h2>${e(ui.jesusTitle)}</h2><p>${e(lesson.jesusConnection)}</p></section>`:'';
  const distinctions=lesson.distinctions?.length?`<section class="wj-block"><p class="kicker">${e(ui.distinctions)}</p><h2>${e(ui.distinctionsTitle)}</h2>${list(lesson.distinctions)}</section>`:'';
  const leader=lesson.leaderNote?`<details class="wj-block"><summary><strong>${e(ui.leader)}</strong></summary><p>${e(lesson.leaderNote)}</p></details>`:'';
  root.innerHTML=`
<section class="wj-hero"><p class="kicker">${e(ui.series)} • ${e(ui.week)} ${lesson.number} ${e(ui.of)} 21</p><h1>${e(lesson.title)}</h1><p class="lead">${e(lesson.bigQuestion)}</p><div class="wj-meta"><span>📖 ${e(lesson.scripture)}</span><span>${e(ui.pace)}</span></div>${languageSwitch(lesson.number)}</section>
<div class="wj-layout"><article class="wj-study-content">
<section class="wj-block wj-highlight"><h2>${e(ui.begin)}</h2><p>${lang==='es'?'Lee':'Read'} <strong>${e(lesson.scripture)}</strong> ${e(ui.beginText)}</p>${supporting}<p>${e(lesson.focus)}</p></section>
${context}
<section class="wj-block"><h2>${e(ui.flow)}</h2><ol class="wj-timeline">${ui.flowItems.map(x=>`<li><strong>${e(x)}</strong></li>`).join('')}</ol><p>${e(ui.flowNote)}</p></section>
<section class="wj-block"><h2>${e(ui.truths)}</h2>${list(lesson.truths)}</section>
${jesus}${distinctions}
<section class="wj-block wj-scene"><p class="kicker">${e(ui.visual)}</p><h2>${e(lesson.episode)}</h2><p>${e(lesson.scene.summary)}</p><dl><dt>${e(ui.start)}</dt><dd>${e(lesson.scene.start)}</dd><dt>${e(ui.stop)}</dt><dd>${e(lesson.scene.stop)}</dd><dt>${e(ui.clip)}</dt><dd>${e(lesson.scene.length)}</dd><dt>${e(ui.biblical)}</dt><dd>${e(lesson.scene.biblical)}</dd><dt>${e(ui.creative)}</dt><dd>${e(lesson.scene.creative)}</dd><dt>${e(ui.check)}</dt><dd>${e(lesson.scene.check)}</dd></dl></section>
${leader}
<section class="wj-block"><h2>${e(ui.discuss)}</h2><ol>${lesson.questions.map(x=>`<li>${e(x)}</li>`).join('')}</ol></section>
<section class="wj-block wj-highlight"><h2>${e(ui.live)}</h2><p><strong>${e(lesson.application)}</strong></p><p>${e(ui.memory)}: <strong>${e(lesson.memory)}</strong></p></section>
<section class="wj-block wj-prayer"><h2>${e(ui.prayer)}</h2><p>${e(lesson.prayer)}</p></section>
<p class="wj-rights"><em>The Chosen</em> ${e(ui.rights.replace(/^The Chosen\s*/,'').trim())}</p><div class="wj-actions">${previous?`<a class="button secondary" href="${href(previous.number)}">← ${e(ui.week)} ${previous.number}</a>`:`<a class="button secondary" href="walking-with-jesus.html">← ${e(ui.collection)}</a>`}<button class="button secondary" onclick="print()">${e(ui.print)}</button>${next?`<a class="button primary" href="${href(next.number)}">${e(ui.week)} ${next.number} →</a>`:lang==='es'?`<span class="wj-translation-note">Semanas 5–21: traducción en progreso</span>`:`<a class="button primary" href="walking-with-jesus.html">${e(ui.home)}</a>`}</div></article>
<aside class="wj-side"><div><strong>${e(ui.big)}</strong><p>${e(lesson.bigQuestion)}</p></div><div><strong>${e(ui.order)}</strong><ol>${ui.orderItems.map(x=>`<li>${e(x)}</li>`).join('')}</ol></div><div><strong>${e(ui.memory)}</strong><p>${e(lesson.memory)}</p></div></aside></div>`;
})();
