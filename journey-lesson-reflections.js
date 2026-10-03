(function(){
  const api=window.NLDGLessonReflections;
  if(!api)return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const prompts=locale=>locale==='es'?['¿Qué me llamó la atención?','¿Qué pregunta todavía tengo?','¿Qué pondré en práctica?','¿Por qué estoy orando?']:['What stood out to me?','What question do I still have?','What will I put into practice?','What am I praying about?'];
  const answerValues=entry=>[entry.answers?.stoodOut,entry.answers?.question,entry.answers?.practice,entry.answers?.prayer];

  const reference=document.querySelector('#reflection-form')?.closest('.journey-grid')||document.querySelector('.journey-overview');
  if(!reference)return;
  const section=document.createElement('section');
  section.id='lesson-reflections';
  section.className='journey-panel journey-lesson-reflections';
  section.innerHTML='<div class="section-heading"><p class="kicker">Carry this into your week</p><h2>Lesson reflections</h2><p>These are the four guided reflections you saved while studying. Each one links back to the exact lesson where you wrote it.</p><p class="journey-helper"><strong>Privacy:</strong> These reflections are stored only in this browser on this device. They do not sync across devices and are not backed up to the cloud.</p></div><div id="journey-lesson-reflections-list" class="journey-list"></div>';
  reference.insertAdjacentElement('beforebegin',section);
  const list=section.querySelector('#journey-lesson-reflections-list');

  function render(){
    const entries=api.listEntries().filter(api.hasAnswers);
    if(!entries.length){
      list.innerHTML='<p class="journey-empty">Your lesson reflections will appear here after you answer a “Carry this into your week” prompt in a Bible study.</p>';
      return;
    }
    list.innerHTML=entries.map(entry=>{
      const labels=prompts(entry.locale),values=answerValues(entry);
      return `<article class="journey-lesson-reflection-card" data-reflection-key="${esc(entry.key)}"><div class="journey-reflection-meta"><span>${esc(entry.locale==='es'?'Reflexión de lección':'Lesson reflection')}</span><span>${new Date(entry.updatedAt||entry.createdAt||Date.now()).toLocaleDateString()}</span>${entry.scripture?`<span>📖 ${esc(entry.scripture)}</span>`:''}</div><h3>${esc(entry.lessonTitle)}</h3><p><strong>${esc(entry.studyTitle)}</strong></p><dl>${labels.map((label,index)=>values[index]?`<div><dt>${esc(label)}</dt><dd>${esc(values[index])}</dd></div>`:'').join('')}</dl><div class="journey-lesson-reflection-actions"><a href="${esc(entry.url)}">Return to lesson →</a><button type="button" data-journey-reflection-print="${esc(entry.key)}">Print</button><button type="button" data-journey-reflection-export="${esc(entry.key)}">Export</button><button type="button" data-journey-reflection-delete="${esc(entry.key)}">Delete</button></div></article>`;
    }).join('');
  }

  document.addEventListener('click',event=>{
    const print=event.target.closest('[data-journey-reflection-print]');
    if(print){api.printEntry(api.getEntry(print.dataset.journeyReflectionPrint));return;}
    const exportButton=event.target.closest('[data-journey-reflection-export]');
    if(exportButton){api.exportEntry(api.getEntry(exportButton.dataset.journeyReflectionExport));return;}
    const remove=event.target.closest('[data-journey-reflection-delete]');
    if(remove&&confirm('Delete this saved lesson reflection from this device?')){api.removeEntry(remove.dataset.journeyReflectionDelete);render();}
  });
  document.addEventListener('nldg:lesson-reflections-changed',render);
  window.addEventListener('storage',event=>{if(event.key===api.STORAGE_KEY)render();});
  render();
})();