(function(){
  const studies=(window.NLDG_STUDIES||[]).filter(study=>study.status==='published');
  const grid=document.getElementById('study-grid');
  const filter=document.getElementById('study-filter');
  const collections=document.getElementById('collection-grid');
  const featured=document.getElementById('featured-study');

  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const categoryDetails={
    'Identity in Christ':{icon:'🪪',description:'Grace, worth, purpose, and belonging.'},
    'Christian Living':{icon:'🌱',description:'Living faithfully with grace and truth.'},
    'Faith & Culture':{icon:'🌍',description:'Biblical wisdom for a divided world.'},
    'Hope & Endurance':{icon:'⚓',description:'Trusting Christ through difficult seasons.'},
    'Men’s Discipleship':{icon:'🛡️',description:'Freedom, spiritual growth, and faithful habits.'}
  };

  const categories=[...new Set(studies.map(study=>study.category).filter(Boolean))].sort();

  if(filter){
    filter.innerHTML='<option value="all">All categories</option>'+categories
      .map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join('');
  }

  if(collections){
    collections.innerHTML=categories.map(category=>{
      const count=studies.filter(study=>study.category===category).length;
      const detail=categoryDetails[category]||{icon:'📘',description:'Explore studies in this collection.'};
      return `<button data-collection="${escapeHtml(category)}"><span>${detail.icon}</span><h3>${escapeHtml(category)}</h3><p>${escapeHtml(detail.description)}</p><small>${count} ${count===1?'study':'studies'}</small></button>`;
    }).join('')+`<button data-collection="all"><span>✨</span><h3>View Everything</h3><p>Browse the complete study library.</p><small>${studies.length} studies</small></button>`;
  }

  if(grid){
    grid.innerHTML=studies.map(study=>{
      const scripture=(study.scripture||[]).join(', ');
      const tags=[...(study.topics||[]),study.series,study.book,...(study.audience||[])].filter(Boolean).join(' ');
      return `<article class="study-card" data-study-id="${escapeHtml(study.id)}" data-category="${escapeHtml(study.category)}" data-tags="${escapeHtml(tags.toLowerCase())}" data-title="${escapeHtml(study.title.toLowerCase())}"><div class="study-topline"><span>${escapeHtml(study.category)}</span><small>${escapeHtml(study.difficulty)}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description)}</p><div class="study-meta"><span>📖 ${escapeHtml(scripture)}</span><span>⏱ ${escapeHtml(study.duration)} minutes</span></div><a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">Open Study →</a></article>`;
    }).join('');
  }

  const featuredStudy=studies.find(study=>study.featured)||studies[0];
  if(featured&&featuredStudy){
    featured.innerHTML=`<div><span class="content-type">Featured Study</span><h2>${escapeHtml(featuredStudy.title)}</h2><p>${escapeHtml(featuredStudy.description)}</p><div class="study-meta"><span>📖 ${escapeHtml((featuredStudy.scripture||[]).join(', '))}</span><span>⏱ ${escapeHtml(featuredStudy.duration)} minutes</span><span>${escapeHtml(featuredStudy.difficulty)}</span></div><div class="actions"><a class="button primary study-open" data-study-id="${escapeHtml(featuredStudy.id)}" href="${escapeHtml(featuredStudy.url)}">Begin Study</a><a class="button secondary" href="scripture-index.html">Browse by Scripture</a></div></div><div class="featured-study-symbol">📖</div>`;
  }
})();
