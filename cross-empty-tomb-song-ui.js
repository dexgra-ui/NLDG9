(()=>{
  const params=new URLSearchParams(location.search);
  const spanishRoute=/\/es\/la-cruz-y-la-tumba-vacia\.html$/i.test(location.pathname);
  const lang=(spanishRoute||params.get('lang')==='es')?'es':'en';
  if(lang!=='en')return;
  const number=Number(params.get('lesson')||0);
  if(!number)return;
  const lesson=window.NLDG_CROSS_EMPTY_TOMB?.lessons?.find(item=>item.number===number);
  if(!lesson?.song)return;
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const mount=()=>{
    if(document.querySelector('.finale-song-panel'))return true;
    const practice=document.querySelector('.challenge-panel');
    if(!practice)return false;
    const section=document.createElement('section');
    section.className='lesson-panel finale-song-panel';
    section.innerHTML=`<p class="kicker">Song for the Journey</p><h2>${esc(lesson.song.title)} — ${esc(lesson.song.artist)}</h2><p><strong>Why it fits:</strong> ${esc(lesson.song.why)}</p>`;
    practice.parentNode.insertBefore(section,practice);
    return true;
  };
  if(!mount()){
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
    observer.observe(document.getElementById('prep-view')||document.body,{childList:true,subtree:true});
  }
})();
