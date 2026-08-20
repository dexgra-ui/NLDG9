(()=>{
  const currentCta=document.getElementById('devoCurrentCta');
  const currentTitle=document.getElementById('devoCurrentTitleLink');
  const currentScripture=document.getElementById('devoCurrentScripture');
  const currentDescription=document.getElementById('devoCurrentDescription');
  const currentTheme=document.getElementById('devoCurrentTheme');
  const currentDuration=document.getElementById('devoCurrentDuration');
  const currentDate=document.getElementById('devoCurrentDate');
  const currentRead=document.getElementById('devoCurrentRead');
  const recentGrid=document.getElementById('devoRecentGrid');
  const archiveGrid=document.getElementById('devoArchiveGrid');
  const archiveSummary=document.getElementById('devoArchiveSummary');
  const empty=document.getElementById('devoEmpty');
  const search=document.getElementById('devoSearch');
  const theme=document.getElementById('devoTheme');
  const series=document.getElementById('devoSeries');
  const year=document.getElementById('devoYear');
  const clear=document.getElementById('devoClearFilters');

  if(!recentGrid||!archiveGrid)return;

  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const normalizeScripture=value=>String(value||'').replace(/(\d+):(\d+)-(\d+)/,'$1:$2–$3');
  const formatDate=value=>{
    if(!value)return '';
    const date=new Date(`${value}T12:00:00`);
    if(Number.isNaN(date.getTime()))return value;
    return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(date);
  };

  const searchableText=item=>[
    item.title,item.description,item.category,item.series,item.book,item.publishedAt,
    ...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])
  ].filter(Boolean).join(' ').toLowerCase();

  const card=item=>{
    const scripture=normalizeScripture(item.scripture?.[0]||'Scripture reflection');
    const date=formatDate(item.publishedAt);
    const meta=[item.category,item.duration?`${item.duration} minutes`:null,date].filter(Boolean);
    return `<article class="devo-card">
      <span class="devo-ref">${escapeHtml(scripture)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description||'')}</p>
      <div class="devo-meta">${meta.map(value=>`<span>${escapeHtml(value)}</span>`).join('')}</div>
      <a href="${escapeHtml(item.url)}">Read devotional →</a>
    </article>`;
  };

  const fillSelect=(select,values,label)=>{
    if(!select)return;
    const selected=select.value;
    select.innerHTML=`<option value="all">All ${escapeHtml(label)}</option>`+values.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
    if([...select.options].some(option=>option.value===selected))select.value=selected;
  };

  let archiveItems=[];

  function renderArchive(){
    const query=(search?.value||'').trim().toLowerCase();
    const selectedTheme=theme?.value||'all';
    const selectedSeries=series?.value||'all';
    const selectedYear=year?.value||'all';
    const matches=archiveItems.filter(item=>{
      const matchesText=!query||searchableText(item).includes(query);
      const matchesTheme=selectedTheme==='all'||item.category===selectedTheme;
      const matchesSeries=selectedSeries==='all'||item.series===selectedSeries;
      const itemYear=item.publishedAt?.slice(0,4)||'';
      const matchesYear=selectedYear==='all'||itemYear===selectedYear;
      return matchesText&&matchesTheme&&matchesSeries&&matchesYear;
    });

    archiveGrid.innerHTML=matches.map(card).join('');
    if(empty)empty.hidden=matches.length!==0;
    if(archiveSummary){
      const total=archiveItems.length;
      archiveSummary.textContent=matches.length===total
        ?`${total} archived devotional${total===1?'':'s'}`
        :`${matches.length} of ${total} archived devotionals`;
    }
  }

  function render(){
    const devotionals=(window.NLDG_LIBRARY||[])
      .filter(item=>item.type==='Devotional'&&item.status==='published'&&item.url)
      .sort((a,b)=>{
        const dateOrder=String(b.publishedAt||'').localeCompare(String(a.publishedAt||''));
        return dateOrder||String(a.title||'').localeCompare(String(b.title||''));
      });

    if(!devotionals.length){
      recentGrid.innerHTML='<p class="devo-status">No published devotionals are available yet.</p>';
      archiveGrid.innerHTML='';
      if(archiveSummary)archiveSummary.textContent='No archived devotionals yet.';
      return;
    }

    const current=devotionals[0];
    const recent=devotionals.slice(1,4);
    archiveItems=devotionals.slice(4);

    if(currentCta)currentCta.href=current.url;
    if(currentTitle){currentTitle.href=current.url;currentTitle.textContent=current.title;}
    if(currentScripture)currentScripture.textContent=normalizeScripture(current.scripture?.[0]||'Scripture reflection');
    if(currentDescription)currentDescription.textContent=current.description||'';
    if(currentTheme)currentTheme.textContent=current.category||'Devotional';
    if(currentDuration)currentDuration.textContent=current.duration?`${current.duration} minutes`:'Read at your own pace';
    if(currentDate)currentDate.textContent=formatDate(current.publishedAt);
    if(currentRead)currentRead.href=current.url;

    recentGrid.innerHTML=recent.length
      ?recent.map(card).join('')
      :'<p class="devo-status">More devotionals will appear here as they are published.</p>';

    const themes=[...new Set(archiveItems.map(item=>item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const seriesValues=[...new Set(archiveItems.map(item=>item.series).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const years=[...new Set(archiveItems.map(item=>item.publishedAt?.slice(0,4)).filter(Boolean))].sort((a,b)=>b.localeCompare(a));
    fillSelect(theme,themes,'themes');
    fillSelect(series,seriesValues,'series');
    fillSelect(year,years,'years');
    renderArchive();
  }

  search?.addEventListener('input',renderArchive);
  theme?.addEventListener('change',renderArchive);
  series?.addEventListener('change',renderArchive);
  year?.addEventListener('change',renderArchive);
  clear?.addEventListener('click',()=>{
    if(search)search.value='';
    if(theme)theme.value='all';
    if(series)series.value='all';
    if(year)year.value='all';
    renderArchive();
    search?.focus();
  });

  window.addEventListener('nldg-library-ready',render);
  if(window.NLDG_DEVOTIONAL_LIBRARY_LOADED)render();
})();
