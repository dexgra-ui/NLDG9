(()=>{
  const esc=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const grid=document.querySelector('[data-caminando-semanas]');
  const count=document.querySelector('[data-caminando-count]');
  const progress=document.querySelector('[data-caminando-progress]');
  if(!grid)return;

  const api=window.NLDG_WALKING_WITH_JESUS_ES_API;
  const lessons=api?.all?.().slice().sort((a,b)=>Number(a.number)-Number(b.number))||[];

  if(count)count.textContent=String(lessons.length);
  if(progress){progress.max=21;progress.value=Math.min(lessons.length,21);progress.textContent=`${lessons.length} de 21`;}

  if(!lessons.length){
    grid.innerHTML='<div class="wj-note"><strong>No se pudieron cargar las lecciones.</strong> Inténtalo de nuevo o vuelve a la página de estudios bíblicos.</div>';
    return;
  }

  grid.innerHTML=lessons.map(lesson=>`
    <article class="wj-card">
      <small>Semana ${esc(lesson.number)} • ${esc(lesson.scripture)}</small>
      <h3>${esc(lesson.title)}</h3>
      <p>${esc(lesson.bigQuestion)}</p>
      <a href="caminando-con-jesus-estudio.html?week=${encodeURIComponent(lesson.number)}">Abrir Semana ${esc(lesson.number)} →</a>
    </article>`).join('');
})();
