(function(){
  const bibleStudies=(window.NLDG_STUDIES||[]).filter(study=>study.status==='published');
  const sundaySchool=(window.NLDG_SUNDAY_SCHOOL_LESSONS||[]).filter(lesson=>lesson.status==='published').map(lesson=>({
    ...lesson,
    category:'Sunday School',
    originalCategory:lesson.category,
    difficulty:'All Levels',
    topics:[lesson.category,...(lesson.audience||[])].filter(Boolean),
    book:(lesson.scripture||[])[0]||'',
    url:`sunday-school-lesson.html?id=${encodeURIComponent(lesson.id)}`
  }));
  const studies=[...bibleStudies,...sundaySchool];
  const grid=document.getElementById('study-grid');
  const empty=document.getElementById('study-empty');
  const search=document.getElementById('study-search');
  const filter=document.getElementById('study-filter');
  const collections=document.getElementById('collection-grid');
  const featured=document.getElementById('featured-study');
  const dashboard=document.getElementById('study-dashboard');
  const continueSection=document.getElementById('continue-study');
  const continueCard=document.getElementById('continue-study-card');
  const favoritesSection=document.getElementById('favorites-section');
  const favoritesGrid=document.getElementById('favorites-grid');
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const readState=()=>{try{return JSON.parse(localStorage.getItem('nldg-study-state')||'{}');}catch(error){return {};}};
  const writeState=state=>{try{localStorage.setItem('nldg-study-state',JSON.stringify(state));}catch(error){}};
  const categoryDetails={
    'Identity in Christ':{icon:'🪪',description:'Grace, worth, purpose, and belonging.'},
    'Christian Living':{icon:'🌱',description:'Living faithfully with grace and truth.'},
    'Faith & Today’s World':{icon:'🌍',description:'Biblical wisdom for life in today’s world.'},
    'Hope & Endurance':{icon:'⚓',description:'Trusting Christ through difficult seasons.'},
    'Brotherhood':{icon:'🛡️',description:'Freedom, spiritual growth, and faithful brotherhood.'},
    'Sunday School':{icon:'🏫',description:'Prepared lessons for classes, groups, and personal study.'}
  };
  const card=study=>{
    const state=readState()[study.id]||{};
    const scripture=(study.scripture||[]).join(', ');
    const tags=[...(study.topics||[]),study.series,study.book,study.originalCategory,...(study.audience||[])].filter(Boolean).join(' ');
    const progress=state.completed?100:Math.round(state.progress||0);
    return `<article class="study-card" data-study-id="${escapeHtml(study.id)}" data-category="${escapeHtml(study.category)}" data-search="${escapeHtml([study.title,study.description,scripture,tags].join(' ').toLowerCase())}"><div class="study-topline"><span>${escapeHtml(study.category)}</span><small>${escapeHtml(study.difficulty||'All Levels')}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description)}</p><div class="study-meta"><span>📖 ${escapeHtml(scripture||'Scripture study')}</span><span>⏱ ${escapeHtml(study.duration||45)} minutes</span></div>${progress?`<div class="study-card-progress"><span>${state.completed?'Completed':`${progress}% complete`}</span><progress max="100" value="${progress}">${progress}%</progress></div>`:''}<div class="study-experience-actions"><a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">${progress&&!state.completed?'Continue':'Open Lesson'} →</a><button class="favorite-study" type="button" data-favorite-id="${escapeHtml(study.id)}" aria-label="${state.favorite?'Remove from favorites':'Add to favorites'}" aria-pressed="${state.favorite?'true':'false'}">${state.favorite?'★':'☆'}</button></div></article>`;
  };
  const categories=[...new Set(studies.map(study=>study.category).filter(Boolean))].sort();
  if(filter)filter.innerHTML='<option value="all">All types</option>'+categories.map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
  if(collections)collections.innerHTML=categories.map(category=>{const count=studies.filter(study=>study.category===category).length;const detail=categoryDetails[category]||{icon:'📘',description:'Explore studies in this collection.'};return `<button type="button" data-collection="${escapeHtml(category)}"><span>${detail.icon}</span><h3>${escapeHtml(category)}</h3><p>${escapeHtml(detail.description)}</p><small>${count} ${count===1?'lesson':'lessons'}</small></button>`;}).join('')+`<button type="button" data-collection="all"><span>✨</span><h3>Complete Library</h3><p>Browse every published study and lesson.</p><small>${studies.length} lessons</small></button>`;
  const renderGrid=()=>{
    const term=(search?.value||'').trim().toLowerCase();
    const type=filter?.value||'all';
    const matches=studies.filter(study=>{
      const searchable=[study.title,study.description,(study.scripture||[]).join(' '),(study.topics||[]).join(' '),study.series,study.book,study.originalCategory,(study.audience||[]).join(' ')].filter(Boolean).join(' ').toLowerCase();
      return (type==='all'||study.category===type)&&(!term||searchable.includes(term));
    });
    if(grid)grid.innerHTML=matches.map(card).join('');
    if(empty)empty.hidden=matches.length!==0;
  };
  const renderDashboard=()=>{
    const state=readState();
    const completed=studies.filter(study=>state[study.id]?.completed).length;
    const inProgress=studies.filter(study=>!state[study.id]?.completed&&(state[study.id]?.progress||0)>0).length;
    const favorites=studies.filter(study=>state[study.id]?.favorite);
    if(dashboard)dashboard.innerHTML=`<div class="dashboard-stat"><strong>${completed}</strong><span>Completed</span></div><div class="dashboard-stat"><strong>${inProgress}</strong><span>In Progress</span></div><div class="dashboard-stat"><strong>${favorites.length}</strong><span>Favorites</span></div>`;
    if(favoritesSection&&favoritesGrid){favoritesSection.hidden=favorites.length===0;favoritesGrid.innerHTML=favorites.map(card).join('');}
    const recent=studies.map(study=>({study,state:state[study.id]||{}})).filter(item=>item.state.lastOpened||item.state.updated).sort((a,b)=>(b.state.lastOpened||b.state.updated||0)-(a.state.lastOpened||a.state.updated||0))[0];
    if(continueSection&&continueCard){continueSection.hidden=!recent;continueCard.innerHTML=recent?card(recent.study):'';}
  };
  renderGrid();
  renderDashboard();
  const featuredStudy=studies.find(study=>study.featured)||studies[0];
  if(featured&&featuredStudy)featured.innerHTML=`<div><span class="content-type">Featured Study</span><h2>${escapeHtml(featuredStudy.title)}</h2><p>${escapeHtml(featuredStudy.description)}</p><div class="study-meta"><span>📖 ${escapeHtml((featuredStudy.scripture||[]).join(', '))}</span><span>⏱ ${escapeHtml(featuredStudy.duration||45)} minutes</span><span>${escapeHtml(featuredStudy.difficulty||'All Levels')}</span></div><div class="actions"><a class="button primary study-open" data-study-id="${escapeHtml(featuredStudy.id)}" href="${escapeHtml(featuredStudy.url)}">Begin Study</a><a class="button secondary" href="#study-grid">Browse Library</a></div></div><div class="featured-study-symbol">📖</div>`;
  search?.addEventListener('input',renderGrid);
  filter?.addEventListener('change',renderGrid);
  document.addEventListener('click',event=>{
    const collection=event.target.closest('[data-collection]');
    if(collection&&filter){filter.value=collection.dataset.collection;renderGrid();document.getElementById('study-grid')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
    const openLink=event.target.closest('.study-open[data-study-id]');
    if(openLink){const state=readState();const id=openLink.dataset.studyId;state[id]={...(state[id]||{}),lastOpened:Date.now(),updated:Date.now()};writeState(state);return;}
    const button=event.target.closest('[data-favorite-id]');
    if(!button)return;
    const id=button.dataset.favoriteId;
    const state=readState();
    state[id]={...(state[id]||{}),favorite:!state[id]?.favorite,updated:Date.now()};
    writeState(state);
    renderGrid();
    renderDashboard();
  });
})();