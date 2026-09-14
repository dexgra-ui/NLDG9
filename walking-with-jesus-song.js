(()=>{
  const params=new URLSearchParams(location.search);
  const spanishRoute=/\/es\/caminando-con-jesus-estudio\.html$/i.test(decodeURI(location.pathname));
  const lang=spanishRoute||params.get('lang')==='es'?'es':'en';
  if(lang!=='en')return;
  const key=params.get('week')||'1';
  const api=window.NLDG_WALKING_WITH_JESUS_API;
  const lesson=/^\d+$/.test(key)?api?.byNumber(key):api?.bySlug(key);
  if(!lesson?.song)return;
  const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const section=document.createElement('section');
  section.className='wj-block wj-highlight wj-song';
  section.innerHTML=`<p class="kicker">Song for the Journey</p><h2>${esc(lesson.song.title)} — ${esc(lesson.song.artist)}</h2><p><strong>Why it fits:</strong> ${esc(lesson.song.why)}</p><p class="wj-song-note">Listen after reading the passage, then ask how the song helps you respond to Jesus without replacing the biblical text.</p>`;
  const content=document.querySelector('.wj-study-content');
  if(!content)return;
  const liveSection=[...content.querySelectorAll('section.wj-block')].find(node=>node.querySelector('h2')?.textContent.trim()==='Live it this week');
  if(liveSection)content.insertBefore(section,liveSection);
  else content.appendChild(section);
})();