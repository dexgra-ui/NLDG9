(()=>{
 if(document.documentElement.lang!=='es')return;
 const s=window.NLDG_BOOK_STUDY,hero=document.getElementById('book-hero'),view=document.getElementById('book-view');
 if(!s||!hero||!view)return;
 const replaceExact=(root,map)=>{
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{const raw=node.nodeValue,trim=raw.trim();if(!trim||!(trim in map))return;node.nodeValue=raw.replace(trim,map[trim]);});
 };
 const fixed={
  'Book-by-Book Bible Study':'Estudio bíblico libro por libro',
  'Series guide':'Guía de la serie',
  'Study foundation':'Fundamento del estudio',
  'Lesson map':'Mapa de lecciones',
  'Choose a lesson':'Elige una lección',
  'Recommended Rhythm':'Ritmo recomendado',
  'Facilitator Safeguards':'Salvaguardas para facilitadores',
  'How to Read Together':'Cómo leer juntos',
  'Discuss':'Conversar'
 };
 replaceExact(document.body,fixed);
 const back=hero.querySelector('.series-back');
 const lessonNumber=Number(new URLSearchParams(location.search).get('lesson')||0);
 const html='ht'+'ml';
 if(back){back.href=lessonNumber?`rut-estudio.${html}`:`estudios-biblicos.${html}`;back.textContent=lessonNumber?'← Panorama de la serie':'← Estudios bíblicos';}
 const meta=hero.querySelectorAll('.series-meta span');
 meta.forEach(span=>{span.textContent=span.textContent.replace(/\blessons\b/g,'lecciones');});
 if(hero.querySelector('.series-meta')&&!hero.querySelector('[data-ntv-standard]')){
  const badge=document.createElement('span');badge.dataset.ntvStandard='true';badge.textContent='📚 Referencia bíblica: NTV';hero.querySelector('.series-meta').appendChild(badge);
 }
 const progress=hero.querySelector('.series-progress strong');
 if(progress)progress.textContent=progress.textContent.replace(/(\d+) of (\d+) completed/,(_,a,b)=>`${a} de ${b} completadas`);
 const start=view.querySelector('.book-overview .button.primary');
 if(start)start.textContent=start.textContent.includes('Continue')?'Continuar →':'Comenzar la lección 1 →';
 view.querySelectorAll('.book-card').forEach(card=>{
  const status=card.querySelector(':scope > span');
  if(status)status.textContent=status.textContent.replace(/^Lesson (\d+)/,'Lección $1').replace(' · Completed',' · Completada');
  const link=card.querySelector('a');if(link)link.textContent='Abrir lección →';
 });
 const lessonKicker=hero.querySelector('.book-hero-inner > .kicker');
 if(lessonKicker&&/^Lesson \d+ of \d+$/.test(lessonKicker.textContent.trim()))lessonKicker.textContent=lessonKicker.textContent.trim().replace(/Lesson (\d+) of (\d+)/,'Lección $1 de $2');
 const complete=view.querySelector('.complete-panel');
 if(complete){
  const strong=complete.querySelector('strong');
  const span=complete.querySelector('span');
  const button=complete.querySelector('button');
  const completed=strong?.textContent.trim()==='Lesson completed';
  if(strong)strong.textContent=completed?'Lección completada':'¿Terminaste esta lección?';
  if(span)span.textContent='El progreso se guarda en este dispositivo.';
  if(button)button.textContent=completed?'Marcar como incompleta':'Marcar como completa';
 }
 const nav=view.querySelector('.lesson-navigation');
 if(nav){
  nav.querySelectorAll('a').forEach(link=>{
   [...link.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).forEach(node=>{
    node.nodeValue=node.nodeValue.replace(/Lesson (\d+)/g,'Lección $1').replace('Series Complete →','Serie completada →');
   });
   const strong=link.querySelector('strong');if(strong?.textContent.trim()==='Return to Overview')strong.textContent='Volver al panorama';
  });
 }
})();
