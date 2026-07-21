(function(){
  const studies=(window.NLDG_STUDIES||[]).filter(study=>study.status==='published');
  const grid=document.getElementById('study-grid');
  const filter=document.getElementById('study-filter');
  const collections=document.getElementById('collection-grid');
  const featured=document.getElementById('featured-study');
  const dashboard=document.getElementById('study-dashboard');
  const favoritesSection=document.getElementById('favorites-section');
  const favoritesGrid=document.getElementById('favorites-grid');

  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
  const readState=()=>{
    try{return JSON.parse(localStorage.getItem('nldg-study-state')||'{}');}
    catch(error){return {};}
  };
  const writeState=state=>{
    try{localStorage.setItem('nldg-study-state',JSON.stringify(state));}
    catch(error){}
  };
  const categoryDetails={
    'Identity in Christ':{icon:'🪪',description:'Grace, worth, purpose, and belonging.'},
    'Christian Living':{icon:'🌱',description:'Living faithfully with grace and truth.'},
    'Faith & Today’s World':{icon:'🌍',description:'Biblical wisdom for life in today’s world.'},
    'Hope & Endurance':{icon:'⚓',description:'Trusting Christ through difficult seasons.'},
    'Brotherhood':{icon:'🛡️',description:'Freedom, spiritual growth, and faithful brotherhood.'}
  };
  const card=study=>{
    const state=readState()[study.id]||{};
    const scripture=(study.scripture||[]).join(', ');
    const tags=[...(study.topics||[]),study.series,study.book,...(study.audience||[])].filter(Boolean).join(' ');
    const progress=state.completed?100:Math.round(state.progress||0);
    return `<article class="study-card" data-study-id="${escapeHtml(study.id)}" data-category="${escapeHtml(study.category)}" data-tags="${escapeHtml(tags.toLowerCase())}" data-title="${escapeHtml(study.title.toLowerCase())}"><div class="study-topline"><span>${escapeHtml(study.category)}</span><small>${escapeHtml(study.difficulty)}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description)}</p><div class="study-meta"><span>📖 ${escapeHtml(scripture)}</span><span>⏱ ${escapeHtml(study.duration)} minutes</span></div>${progress?`<div class="study-card-progress"><span>${state.completed?'Completed':`${progress}% complete`}</span><progress max="100" value="${progress}">${progress}%</progress></div>`:''}<div class="study-experience-actions"><a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">${progress&&!state.completed?'Continue Study':'Open Study'} →</a><button class="favorite-study" type="button" data-favorite-id="${escapeHtml(study.id)}" aria-pressed="${state.favorite?'true':'false'}">${state.favorite?'★':'☆'}</button></div></article>`;
  };

  const categories=[...new Set(studies.map(study=>study.category).filter(Boolean))].sort();
  if(filter)filter.innerHTML='<option value="all">All categories</option>'+categories.map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  if(collections){
    collections.innerHTML=categories.map(category=>{
      const count=studies.filter(study=>study.category===category).length;
      const detail=categoryDetails[category]||{icon:'📘',description:'Explore studies in this collection.'};
      return `<button data-collection="${escapeHtml(category)}"><span>${detail.icon}</span><h3>${escapeHtml(category)}</h3><p>${escapeHtml(detail.description)}</p><small>${count} ${count===1?'study':'studies'}</small></button>`;
    }).join('')+`<button data-collection="all"><span>✨</span><h3>Complete Library</h3><p>Browse every published Bible study.</p><small>${studies.length} studies</small></button>`;
  }

  const renderDashboard=()=>{
    const state=readState();
    const completed=studies.filter(study=>state[study.id]?.completed).length;
    const inProgress=studies.filter(study=>!state[study.id]?.completed&&(state[study.id]?.progress||0)>0).length;
    const favorites=studies.filter(study=>state[study.id]?.favorite);
    if(dashboard)dashboard.innerHTML=`<div class="dashboard-stat"><strong>${completed}</strong><span>Completed</span></div><div class="dashboard-stat"><strong>${inProgress}</strong><span>In Progress</span></div><div class="dashboard-stat"><strong>${favorites.length}</strong><span>Favorites</span></div>`;
    if(favoritesSection&&favoritesGrid){
      favoritesSection.hidden=favorites.length===0;
      favoritesGrid.innerHTML=favorites.map(card).join('');
    }
  };
  if(grid)grid.innerHTML=studies.map(card).join('');
  renderDashboard();

  const featuredStudy=studies.find(study=>study.featured)||studies[0];
  if(featured&&featuredStudy){
    featured.innerHTML=`<div><span class="content-type">Featured Study</span><h2>${escapeHtml(featuredStudy.title)}</h2><p>${escapeHtml(featuredStudy.description)}</p><div class="study-meta"><span>📖 ${escapeHtml((featuredStudy.scripture||[]).join(', '))}</span><span>⏱ ${escapeHtml(featuredStudy.duration)} minutes</span><span>${escapeHtml(featuredStudy.difficulty)}</span></div><div class="actions"><a class="button primary study-open" data-study-id="${escapeHtml(featuredStudy.id)}" href="${escapeHtml(featuredStudy.url)}">Begin Study</a><a class="button secondary" href="scripture-index.html">Browse by Scripture</a></div></div><div class="featured-study-symbol">📖</div>`;
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-favorite-id]');
    if(!button)return;
    const id=button.dataset.favoriteId;
    const state=readState();
    state[id]={...(state[id]||{}),favorite:!state[id]?.favorite,updated:Date.now()};
    writeState(state);
    document.querySelectorAll(`[data-favorite-id="${CSS.escape(id)}"]`).forEach(item=>{
      item.setAttribute('aria-pressed',String(state[id].favorite));
      item.textContent=state[id].favorite?'★':'☆';
    });
    renderDashboard();
  });
})();