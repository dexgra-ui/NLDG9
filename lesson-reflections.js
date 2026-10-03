(function(){
  if(window.NLDG_LESSON_REFLECTIONS_LOADED)return;
  window.NLDG_LESSON_REFLECTIONS_LOADED=true;

  const STORAGE_KEY='nldg-lesson-reflections-v1';
  const VERSION=1;
  const isSpanish=document.documentElement.lang==='es';
  const labels=isSpanish?{
    kicker:'Lleva esto a tu semana',
    title:'Reflexiona antes de seguir',
    intro:'Usa el material de reflexión y aplicación de esta lección como contexto. Estas respuestas son tuyas y no reemplazan el contenido de la lección.',
    prompts:['¿Qué me llamó la atención?','¿Qué pregunta todavía tengo?','¿Qué pondré en práctica?','¿Por qué estoy orando?'],
    storage:'Privacidad: tus respuestas se guardan solamente en este navegador y en este dispositivo. No se sincronizan entre dispositivos ni tienen copia de seguridad en la nube.',
    saved:'Guardado en este dispositivo.',
    saving:'Guardando…',
    unsaved:'Escribe para comenzar. Se guarda automáticamente.',
    print:'Imprimir reflexiones',
    export:'Exportar reflexiones',
    include:'Incluir mis reflexiones cuando imprima las guías de esta lección',
    context:'Contexto de la lección',
    scripture:'Escrituras',
    reflection:'Reflexión personal',
    empty:'Todavía no has escrito una respuesta.'
  }:{
    kicker:'Carry this into your week',
    title:'Reflect before you move on',
    intro:'Use this lesson’s existing reflection and application material as context. These responses are yours and do not replace the lesson content.',
    prompts:['What stood out to me?','What question do I still have?','What will I put into practice?','What am I praying about?'],
    storage:'Privacy: your responses are stored only in this browser on this device. They do not sync across devices and are not backed up to the cloud.',
    saved:'Saved on this device.',
    saving:'Saving…',
    unsaved:'Start writing. Your responses autosave.',
    print:'Print reflections',
    export:'Export reflections',
    include:'Include my reflections when I print this lesson’s handouts',
    context:'Lesson context',
    scripture:'Scripture',
    reflection:'Personal reflection',
    empty:'You have not written a response yet.'
  };

  const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
  const slug=value=>clean(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'study';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const readAll=()=>{try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return{}}};
  const writeAll=value=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return true}catch{return false}};
  const relativeUrl=()=>`${location.pathname.replace(/^\//,'')||'index.html'}${location.search}`;
  const normalizeScripture=value=>Array.isArray(value)?value.map(clean).filter(Boolean).join(' · '):clean(value);
  const contextHeadings=()=>[...document.querySelectorAll('h2,h3,.kicker,.gwj-eyebrow,.fyj-eyebrow')]
    .map(node=>clean(node.textContent))
    .filter((value,index,list)=>value&&/reflect|reflection|application|apply|practice|challenge|examination|response|reflex|aplic|práctica|practica|desafío|desafio|examen|respuesta/i.test(value)&&list.indexOf(value)===index)
    .slice(0,3);

  function detectContext(){
    const params=new URLSearchParams(location.search);
    const locale=isSpanish?'es':'en';
    const book=window.NLDG_BOOK_STUDY;
    const bookLesson=Number(params.get('lesson')||0);
    if(book?.slug&&bookLesson){
      const lesson=book.lessons?.find(item=>Number(item.number)===bookLesson);
      if(lesson)return{
        locale,studyId:`book:${book.slug}`,lessonId:`lesson:${bookLesson}`,studyTitle:clean(book.title)||clean(book.book)||'Book-by-Book Bible Study',
        lessonTitle:clean(lesson.title)||`${isSpanish?'Lección':'Lesson'} ${bookLesson}`,scripture:normalizeScripture([lesson.scripture,...(lesson.supporting||[])]),url:relativeUrl(),
        contextLabels:contextHeadings()
      };
    }

    const series=window.NLDG_CURRENT_EVENTS_SERIES;
    const week=Number(params.get('week')||0);
    if(series?.lessons?.length&&week){
      const lesson=series.lessons.find(item=>Number(item.week)===week);
      if(lesson)return{
        locale,studyId:`series:${slug(series.id||series.title||'faith-truth')}`,lessonId:`week:${week}`,studyTitle:clean(series.displayTitle)||clean(series.title)||"Faith & Truth in Today's World",
        lessonTitle:clean(lesson.title)||`${isSpanish?'Semana':'Week'} ${week}`,scripture:normalizeScripture(lesson.scripture||lesson.primaryScripture||lesson.reference),url:relativeUrl(),
        contextLabels:contextHeadings()
      };
    }

    const pageId=clean(document.body.dataset.studyPage);
    if(pageId){
      const study=(window.NLDG_STUDIES||[]).find(item=>item.id===pageId)||{};
      const lessonTitle=clean(study.title)||clean(document.querySelector('h1')?.textContent)||clean(document.body.dataset.studyTitle)||pageId;
      const studyTitle=clean(study.series)||clean(document.body.dataset.studySeries)||clean(document.querySelector('.series-title')?.textContent)||clean(document.querySelector('.kicker')?.textContent)||lessonTitle;
      const parameter=params.get('lesson')||params.get('week')||params.get('day')||'';
      const lessonId=study.id?`study:${study.id}`:`page:${pageId}${parameter?`:${parameter}`:''}`;
      const visibleScripture=clean(document.querySelector('[class*="scripture"],.wj-meta,.gwj-study-meta,.fyj-study-meta,.prep-meta')?.textContent);
      return{
        locale,studyId:`study-series:${slug(study.series||pageId)}`,lessonId,studyTitle,lessonTitle,
        scripture:normalizeScripture(study.scripture)||visibleScripture,url:relativeUrl(),contextLabels:contextHeadings()
      };
    }
    return null;
  }

  const entryKey=context=>`${context.locale}|${context.studyId}|${context.lessonId}`;
  const emptyAnswers=()=>({stoodOut:'',question:'',practice:'',prayer:''});
  const normalizeEntry=(entry,key='')=>({
    version:VERSION,key,locale:entry?.locale||'en',studyId:entry?.studyId||'',lessonId:entry?.lessonId||'',studyTitle:entry?.studyTitle||'',lessonTitle:entry?.lessonTitle||'',scripture:entry?.scripture||'',url:entry?.url||'',
    contextLabels:Array.isArray(entry?.contextLabels)?entry.contextLabels:[],answers:{...emptyAnswers(),...(entry?.answers||{})},includeInHandouts:Boolean(entry?.includeInHandouts),createdAt:entry?.createdAt||null,updatedAt:entry?.updatedAt||null
  });
  const getEntry=key=>normalizeEntry(readAll()[key]||{},key);
  const listEntries=()=>Object.entries(readAll()).map(([key,value])=>normalizeEntry(value,key)).filter(entry=>entry.studyId&&entry.lessonId).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  const hasAnswers=entry=>Object.values(entry.answers||{}).some(value=>clean(value));

  function saveEntry(context,answers,includeInHandouts=false){
    const key=entryKey(context);const all=readAll();const previous=normalizeEntry(all[key]||{},key);const now=Date.now();
    all[key]={...previous,...context,version:VERSION,key,answers:{...emptyAnswers(),...answers},includeInHandouts:Boolean(includeInHandouts),createdAt:previous.createdAt||now,updatedAt:now};
    const saved=writeAll(all);if(saved)document.dispatchEvent(new CustomEvent('nldg:lesson-reflections-changed',{detail:{key}}));return saved?normalizeEntry(all[key],key):null;
  }
  function removeEntry(key){const all=readAll();delete all[key];writeAll(all);document.dispatchEvent(new CustomEvent('nldg:lesson-reflections-changed',{detail:{key}}));}

  function formatExport(entry){
    const e=normalizeEntry(entry,entry?.key||'');const promptLabels=e.locale==='es'?['¿Qué me llamó la atención?','¿Qué pregunta todavía tengo?','¿Qué pondré en práctica?','¿Por qué estoy orando?']:['What stood out to me?','What question do I still have?','What will I put into practice?','What am I praying about?'];
    const values=[e.answers.stoodOut,e.answers.question,e.answers.practice,e.answers.prayer];const blank=e.locale==='es'?'(en blanco)':'(blank)';
    return[
      'No Labels, Designed by God',
      e.studyTitle,e.lessonTitle,e.scripture?`${e.locale==='es'?'Escrituras':'Scripture'}: ${e.scripture}`:'',
      '',...promptLabels.flatMap((prompt,index)=>[prompt,values[index]||blank,'']),
      e.locale==='es'?'Guardado localmente en este dispositivo. No se sincroniza con otros dispositivos.':'Stored locally on this device. Does not sync across devices.'
    ].filter((line,index,array)=>line!==''||array[index-1]!=='' ).join('\n');
  }
  function exportEntry(entry){
    const text=formatExport(entry);const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${slug(entry.studyTitle)}-${slug(entry.lessonTitle)}-reflections.txt`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return text;
  }
  function printMarkup(entry,{handout=false}={}){
    const e=normalizeEntry(entry,entry?.key||'');const prompts=e.locale==='es'?['¿Qué me llamó la atención?','¿Qué pregunta todavía tengo?','¿Qué pondré en práctica?','¿Por qué estoy orando?']:['What stood out to me?','What question do I still have?','What will I put into practice?','What am I praying about?'];
    const values=[e.answers.stoodOut,e.answers.question,e.answers.practice,e.answers.prayer];const empty=e.locale==='es'?'Todavía no has escrito una respuesta.':'You have not written a response yet.';
    return `<section class="lesson-reflection-print-section${handout?' is-handout':''}" data-lesson-reflection-print><header><p>No Labels, Designed by God</p><span>${esc(e.locale==='es'?'Lleva esto a tu semana':'Carry this into your week')}</span><h2>${esc(e.studyTitle)}</h2><h3>${esc(e.lessonTitle)}</h3>${e.scripture?`<strong>${esc(e.scripture)}</strong>`:''}</header><div class="lesson-reflection-print-grid">${prompts.map((prompt,index)=>`<section><h4>${esc(prompt)}</h4><p>${esc(values[index]||empty).replaceAll('\n','<br>')}</p></section>`).join('')}</div></section>`;
  }
  function ensureReflectionPrintSurface(){let surface=document.getElementById('lesson-reflection-print-surface');if(!surface){surface=document.createElement('section');surface.id='lesson-reflection-print-surface';surface.setAttribute('aria-hidden','true');document.body.appendChild(surface)}return surface;}
  function printEntry(entry){const surface=ensureReflectionPrintSurface();surface.innerHTML=printMarkup(entry);document.body.dataset.reflectionPrint='true';surface.getBoundingClientRect();window.print();return surface;}
  function clearReflectionPrintMode(){delete document.body.dataset.reflectionPrint;}
  document.addEventListener('click',event=>{if(event.target.closest('[data-print-mode],[data-v2-print],[data-coverage-print],[data-print-now],.print-center-launch'))clearReflectionPrintMode();},{capture:true});

  function appendToPrint(container,entryOverride=null){
    if(!container)return false;
    container.querySelectorAll('[data-lesson-reflection-print]').forEach(node=>node.remove());
    const context=detectContext();const entry=entryOverride|| (context?getEntry(entryKey(context)):null);
    if(!entry?.includeInHandouts||!hasAnswers(entry))return false;
    const targets=[...container.querySelectorAll('.print-packet,.coverage-print-packet,.v2-print-surface-packet,.nldg-print-packet')];
    const html=printMarkup(entry,{handout:true});
    if(targets.length)targets.forEach(target=>target.insertAdjacentHTML('beforeend',html));else container.insertAdjacentHTML('beforeend',html);
    return true;
  }

  window.NLDGLessonReflections={STORAGE_KEY,readAll,listEntries,getEntry,saveEntry,removeEntry,entryKey,detectContext,formatExport,exportEntry,printEntry,printMarkup,appendToPrint,hasAnswers};

  function findMount(){
    const complete=document.querySelector('.book-lesson .complete-panel,.series-lesson .lesson-complete-panel,.lesson-complete-panel,.complete-panel');
    if(complete)return{parent:complete.parentElement,before:complete};
    const nav=document.querySelector('.book-lesson .lesson-navigation,.series-lesson .series-lesson-nav,.lesson-navigation,.series-navigation');
    if(nav)return{parent:nav.parentElement,before:nav};
    const actions=document.querySelector('.lesson-actions,.wj-actions,.gwj-actions,.fyj-actions');
    if(actions)return{parent:actions.parentElement,before:actions};
    const content=document.querySelector('.book-lesson,.series-lesson,.lesson-wrap,.wj-study-content,.gwj-study-content,.fyj-study-content,.prep-lesson,.study-content,.wof-study-content,.mof-study-content,.mf-study-content,main article');
    return content?{parent:content,before:null}:null;
  }

  function mount(){
    if(document.querySelector('[data-lesson-reflections-panel]'))return true;
    const context=detectContext();const point=findMount();if(!context||!point)return false;
    const key=entryKey(context);const saved=getEntry(key);const panel=document.createElement('section');panel.className='lesson-reflections-panel';panel.dataset.lessonReflectionsPanel=key;
    const contextText=context.contextLabels.length?`${labels.context}: ${context.contextLabels.join(' · ')}`:'';
    panel.innerHTML=`<div class="lesson-reflections-heading"><div><p class="kicker">${esc(labels.kicker)}</p><h2>${esc(labels.title)}</h2><p>${esc(labels.intro)}</p>${contextText?`<small class="lesson-reflections-context">${esc(contextText)}</small>`:''}</div><a href="${isSpanish?'../dashboard.html':'dashboard.html'}#lesson-reflections">${isSpanish?'Ver en My Journey':'View in My Journey'} →</a></div><div class="lesson-reflections-grid">${labels.prompts.map((prompt,index)=>{const names=['stoodOut','question','practice','prayer'];return `<label><span>${esc(prompt)}</span><textarea data-reflection-field="${names[index]}" rows="4"></textarea></label>`}).join('')}</div><div class="lesson-reflections-footer"><div><p class="lesson-reflections-storage">${esc(labels.storage)}</p><span class="lesson-reflections-status" role="status" aria-live="polite">${hasAnswers(saved)?esc(labels.saved):esc(labels.unsaved)}</span></div><div class="lesson-reflections-actions"><label class="lesson-reflections-include"><input type="checkbox" data-reflection-include ${saved.includeInHandouts?'checked':''}><span>${esc(labels.include)}</span></label><div><button type="button" data-reflection-print>${esc(labels.print)}</button><button type="button" data-reflection-export>${esc(labels.export)}</button></div></div></div>`;
    point.parent.insertBefore(panel,point.before);
    const fields={};panel.querySelectorAll('[data-reflection-field]').forEach(field=>{fields[field.dataset.reflectionField]=field;field.value=saved.answers[field.dataset.reflectionField]||'';});
    const include=panel.querySelector('[data-reflection-include]');const status=panel.querySelector('.lesson-reflections-status');let timer;
    const answers=()=>Object.fromEntries(Object.entries(fields).map(([name,field])=>[name,field.value]));
    const persist=()=>{clearTimeout(timer);status.textContent=labels.saving;timer=setTimeout(()=>{const entry=saveEntry(context,answers(),include.checked);status.textContent=entry?labels.saved:(isSpanish?'No se pudo guardar.':'Could not save.');},350)};
    Object.values(fields).forEach(field=>field.addEventListener('input',persist));include.addEventListener('change',()=>{const entry=saveEntry(context,answers(),include.checked);status.textContent=entry?labels.saved:(isSpanish?'No se pudo guardar.':'Could not save.');});
    panel.querySelector('[data-reflection-export]').addEventListener('click',()=>{const entry=saveEntry(context,answers(),include.checked)||getEntry(key);exportEntry(entry);status.textContent=labels.saved;});
    panel.querySelector('[data-reflection-print]').addEventListener('click',()=>{const entry=saveEntry(context,answers(),include.checked)||getEntry(key);printEntry(entry);status.textContent=labels.saved;});
    return true;
  }

  if(!mount()){
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-study-page']});setTimeout(()=>observer.disconnect(),12000);
  }
})();