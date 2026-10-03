(function(){
  const studyId=document.body.dataset.studyPage;
  if(!studyId||document.body.classList.contains('book-study-page')||document.querySelector('.lesson-print-tools'))return;

  const studies=(window.NLDG_STUDIES||[]).filter(item=>item.status==='published');
  const existingStudy=studies.find(item=>item.id===studyId);
  const usesFullStudyExperience=Boolean(existingStudy&&document.querySelector('main .page-hero'));
  if(usesFullStudyExperience)return;

  const source=document.querySelector('.wj-study-content,.gwj-study-content,.fyj-study-content,.prep-lesson,.lesson-wrap,.study-content,.wof-study-content,.mof-study-content,.mf-study-content,article');
  if(!source)return;

  const assetBase=new URL('.',document.currentScript?.src||location.href);
  if(!document.querySelector('link[data-lesson-reflections]')){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('lesson-reflections.css?v=1.0.0',assetBase).href;link.dataset.lessonReflections='true';document.head.appendChild(link)}
  if(!window.NLDG_LESSON_REFLECTIONS_LOADED&&!document.querySelector('script[data-lesson-reflections]')){const script=document.createElement('script');script.src=new URL('lesson-reflections.js?v=1.0.0',assetBase).href;script.dataset.lessonReflections='true';document.body.appendChild(script)}

  const spanish=document.documentElement.lang==='es';
  const labels=spanish?{
    print:'Imprimir',participant:'Guía del participante',leader:'Guía para líderes',both:'Imprimir ambos',lesson:'Lección',notes:'Notas'
  }:{
    print:'Print',participant:'Participant Handout',leader:'Leader Guide',both:'Print Both',lesson:'Lesson',notes:'Notes'
  };
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const title=clean(document.querySelector('h1')?.textContent)||document.body.dataset.studyTitle||'Bible Study';
  const study=existingStudy||studies.find(item=>item.url===(location.pathname.split('/').pop()+location.search));
  const series=study?.series||clean(document.querySelector('.kicker')?.textContent)||'No Labels, Designed by God';
  const scripture=study?.scripture?.join(' · ')||clean(document.querySelector('[class*="scripture"],.wj-meta,.gwj-study-meta,.fyj-study-meta,.prep-meta')?.textContent)||'';

  const leaderTextPattern=/\b(leader|facilitator|mentor|parent\s*\/\s*teacher|parent or teacher|adult note|nota(?:\s+de\s+profundidad)?\s+para\s+líderes|guía para líderes|maestro|mentor)\b/i;
  const removeChrome=root=>{
    root.querySelectorAll('.lesson-actions,.wj-actions,.gwj-actions,.fyj-actions,.lesson-navigation,.complete-panel,.lesson-complete-panel,.series-navigation,.study-experience-bar,.study-view-controls,.study-notes,.lesson-reflections-panel,.discipleship-tools,.section-navigation,.breadcrumbs,.content-sequence,.coverage-print-entry,.ministry-footer,script,style').forEach(node=>node.remove());
    root.querySelectorAll('button,input,select,textarea').forEach(node=>node.remove());
    root.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
    return root;
  };
  const removeLeaderOnly=root=>{
    root.querySelectorAll('.leader-note,.gwj-adult-note,.fyj-adult-note,.adult-note,.parent-teacher-note,[data-leader-only],[class*="leader-note"],[class*="adult-note"]').forEach(node=>node.remove());
    root.querySelectorAll('details').forEach(node=>{if(leaderTextPattern.test(clean(node.querySelector('summary')?.textContent)))node.remove();});
    root.querySelectorAll('section,aside').forEach(node=>{
      const heading=clean(node.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > .gwj-eyebrow,:scope > .fyj-eyebrow,:scope > .kicker')?.textContent);
      if(leaderTextPattern.test(heading))node.remove();
    });
  };
  const reduceTeaching=root=>{
    root.querySelectorAll('.teaching-section').forEach(node=>node.remove());
    root.querySelectorAll('.gwj-block,.fyj-block').forEach(node=>{if(node.querySelector('.gwj-step,.fyj-step'))node.remove();});
    root.querySelectorAll('section').forEach(node=>{
      const heading=clean(node.querySelector(':scope > h2,:scope > h3')?.textContent);
      if(/context in plain|suggested lesson flow|helpful distinctions|optional visual discussion aid|contexto en lenguaje|flujo sugerido|distinciones útiles|recurso visual opcional/i.test(heading))node.remove();
    });
    root.querySelectorAll('.gwj-question-cards small,.fyj-question-cards small,[data-answer-key],.answer-key').forEach(node=>node.remove());
  };
  const addWritingLines=root=>{
    root.querySelectorAll('section').forEach(section=>{
      const heading=clean(section.querySelector(':scope > h2,:scope > h3,:scope > .gwj-eyebrow,:scope > .fyj-eyebrow,:scope > .kicker')?.textContent);
      if(!/discuss|discussion|questions|talk about|conversemos|preguntas|reflect|reflex/i.test(heading))return;
      section.querySelectorAll('ol > li,ul > li').forEach(item=>{
        if(item.querySelector('.coverage-answer-lines'))return;
        const lines=document.createElement('span');lines.className='coverage-answer-lines';lines.innerHTML='<span></span><span></span>';item.appendChild(lines);
      });
    });
  };
  const packetHeader=kind=>`<header class="coverage-print-header"><p>No Labels, Designed by God</p><span>${esc(kind)}</span><h1>${esc(title)}</h1><small>${esc(series)}</small>${scripture?`<strong>${esc(scripture)}</strong>`:''}</header>`;
  const participantPacket=()=>{
    const clone=source.cloneNode(true);
    removeChrome(clone);removeLeaderOnly(clone);reduceTeaching(clone);addWritingLines(clone);
    const packet=document.createElement('article');packet.className='coverage-print-packet coverage-participant';packet.innerHTML=packetHeader(labels.participant)+`<div class="coverage-name-date"><span>${spanish?'Nombre':'Name'}: __________________________</span><span>${spanish?'Fecha':'Date'}: ______________</span></div>`;packet.appendChild(clone);
    const notes=document.createElement('section');notes.className='coverage-notes';notes.innerHTML=`<h2>${esc(labels.notes)}</h2><span></span><span></span><span></span><span></span>`;packet.appendChild(notes);return packet;
  };
  const leaderPacket=()=>{
    const clone=source.cloneNode(true);removeChrome(clone);clone.querySelectorAll('details').forEach(node=>node.open=true);
    const packet=document.createElement('article');packet.className='coverage-print-packet coverage-leader';packet.innerHTML=packetHeader(labels.leader);packet.appendChild(clone);return packet;
  };
  const ensureSurface=()=>{let surface=document.getElementById('study-print-coverage-surface');if(!surface){surface=document.createElement('section');surface.id='study-print-coverage-surface';surface.setAttribute('aria-hidden','true');document.body.appendChild(surface)}return surface;};
  const printMode=mode=>{
    const surface=ensureSurface();surface.innerHTML='';
    if(mode==='participant'||mode==='both')surface.appendChild(participantPacket());
    if(mode==='leader'||mode==='both')surface.appendChild(leaderPacket());
    window.NLDGLessonReflections?.appendToPrint?.(surface);
    document.body.dataset.studyPrintCoverage=mode;
    document.querySelector('.coverage-print-tools')?.removeAttribute('open');
    surface.getBoundingClientRect();
    window.print();
  };
  const tools=document.createElement('details');
  tools.className='coverage-print-tools';
  tools.innerHTML=`<summary class="button secondary">${esc(labels.print)}</summary><div class="coverage-print-menu" role="group" aria-label="${esc(labels.print)}"><button type="button" data-coverage-print="participant">${esc(labels.participant)}</button><button type="button" data-coverage-print="leader">${esc(labels.leader)}</button><button type="button" data-coverage-print="both">${esc(labels.both)}</button></div>`;
  tools.querySelectorAll('[data-coverage-print]').forEach(button=>button.addEventListener('click',()=>printMode(button.dataset.coveragePrint)));

  const nativePrint=[...document.querySelectorAll('button')].find(button=>{
    if(button.closest('.coverage-print-tools,.print-center,.lesson-print-tools'))return false;
    return /^(print|print lesson|print study|imprimir|imprimir lección|imprimir estudio)$/i.test(clean(button.textContent));
  });
  if(nativePrint){nativePrint.insertAdjacentElement('beforebegin',tools);nativePrint.remove();}
  else{
    const entry=document.createElement('div');entry.className='coverage-print-entry';entry.appendChild(tools);
    const actions=source.querySelector('.lesson-actions,.wj-actions,.gwj-actions,.fyj-actions');
    const nav=source.querySelector('.lesson-navigation');
    if(actions)actions.appendChild(entry);else if(nav)nav.insertAdjacentElement('beforebegin',entry);else source.appendChild(entry);
  }

  window.NLDGStudyPrintCoverage={print:printMode,participant:participantPacket,leader:leaderPacket};
})();