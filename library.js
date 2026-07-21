(function(){
  const library=window.NLDG_LIBRARY||[];
  const grid=document.getElementById('library-grid');
  if(!grid)return;
  const search=document.getElementById('library-search');
  const type=document.getElementById('library-type');
  const status=document.getElementById('library-status');
  const empty=document.getElementById('library-empty');
  const heading=document.getElementById('library-heading');
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const text=item=>[item.title,item.description,item.type,item.status,item.category,item.series,item.book,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])].filter(Boolean).join(' ').toLowerCase();
  const count=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  count('library-total',library.length);
  count('library-published',library.filter(item=>item.status==='published').length);
  count('library-studies',library.filter(item=>item.type==='Study').length);
  count('library-other',library.filter(item=>item.type!=='Study').length);
  function render(){
    const query=(search.value||'').trim().toLowerCase();
    const typeValue=type.value;
    const statusValue=status.value;
    const items=library.filter(item=>(typeValue==='all'||item.type===typeValue)&&(statusValue==='all'||item.status===statusValue)&&(!query||text(item).includes(query)));
    heading.textContent=typeValue==='all'?'All ministry content':`${typeValue} content`;
    grid.innerHTML=items.map(item=>`<article class="library-card"><div class="library-card-top"><span class="library-type">${escapeHtml(item.type)}</span><span class="library-status status-${escapeHtml(item.status||'draft')}">${escapeHtml(item.status||'draft')}</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description||'')}</p>${item.scripture?.length?`<p class="library-scripture">📖 ${escapeHtml(item.scripture.join(', '))}</p>`:''}<div class="library-tags">${(item.topics||[]).slice(0,5).map(topic=>`<span>${escapeHtml(topic)}</span>`).join('')}</div><a href="${escapeHtml(item.url||'#')}">Open content →</a></article>`).join('');
    empty.hidden=items.length!==0;
  }
  search.addEventListener('input',render);
  type.addEventListener('change',render);
  status.addEventListener('change',render);
  render();
})();