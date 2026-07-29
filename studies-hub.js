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

  const journeyCollections=[
    {id:'current-events',icon:'🌎',title:'Faith & Truth in Today’s World',eyebrow:'Featured collection',description:'A 42-week study connecting Scripture with culture, technology, justice, mental health, and Christian hope.',meta:'42 of 42 lessons available',status:'available',href:'current-events-series.html',action:'Open Complete Series',featured:true},
    {id:'new-believer',icon:'🌱',title:'New Believer Path',eyebrow:'Foundations',description:'Learn the basics of following Jesus, trusting Scripture, prayer, identity, and life in the church.',meta:'10 guided steps available',status:'available',href:'new-believers.html',action:'Begin the Path'},
    {id:'men-of-faith',icon:'🛡️',title:'Men of Faith',eyebrow:'Men’s discipleship',description:'Known by God. Formed by Christ. Walking as brothers through identity, freedom, integrity, honest strength, leadership, relationships, accountability, stewardship, and mentoring.',meta:'10 of 10 studies available',status:'available',href:'men-of-faith.html',action:'Open Complete Journey'},
    {id:'women-of-faith',icon:'🌸',title:'Women of Faith',eyebrow:'Women’s discipleship',description:'Known by God. Growing in grace. Walking together through identity, dignity, hard seasons, healing, community, calling, discernment, mentoring, and service.',meta:'10 of 10 studies available',status:'available',href:'women-of-faith.html',action:'Open Complete Journey'},
    {id:'marriage-family',icon:'💍',title:'Marriage & Family',eyebrow:'Christ-centered homes',description:'Rooted in Christ. Growing in love. Blessing others through marriage, communication, parenting, family discipleship, belonging, boundaries, stewardship, and service.',meta:'10 of 10 studies available',status:'available',href:'marriage-family.html',action:'Open Complete Journey'},
    {id:'difficult-questions',icon:'❓',title:'Difficult Questions',eyebrow:'Faith under examination',description:'Honest questions. Faithful Scripture. Hope in Christ through suffering, Scripture, science, denominations, salvation, silence, judgment, other religions, doubt, and discipleship.',meta:'10 of 10 studies available',status:'available',href:'difficult-questions.html',action:'Open Complete Journey'},
    {id:'leadership',icon:'🧭',title:'Leadership',eyebrow:'Serve and equip',description:'Called by God. Formed in character. Leading through service, wisdom, healthy teams, accountability, endurance, and multiplication.',meta:'10 of 10 studies available',status:'available',href:'leadership.html',action:'Open Complete Journey'},
    {id:'sunday-school',icon:'📖',title:'Sunday School',eyebrow:'Classes & small groups',description:'Prepared Bible lessons for teaching, group discussion, personal study, and weekly discipleship.',meta:`${sundaySchool.length} published ${sundaySchool.length===1?'lesson':'lessons'}`,status:sundaySchool.length?'available':'planned',filter:'Sunday School',action:sundaySchool.length?'Browse Lessons':'Coming Soon'},
    {id:'christian-living',icon:'❤️',title:'Christian Living',eyebrow:'Everyday discipleship',description:'Practical studies about prayer, forgiveness, rest, stewardship, serving, endurance, and living faithfully.',meta:'Published studies available',status:'available',filter:'Christian Living',action:'Browse the Collection'},
    {id:'technology-ai',icon:'💻',title:'Technology & AI',eyebrow:'Digital discipleship',description:'Follow Christ wisely through artificial intelligence, social media, online identity, misinformation, privacy, and digital habits.',meta:'7 lessons available in Current Events',status:'available',href:'current-events-series.html?week=15',action:'Start the Collection'}
  ];

  const card=study=>{
    const state=readState()[study.id]||{};
    const scripture=(study.scripture||[]).join(', ');
    const tags=[...(study.topics||[]),study.series,study.book,study.originalCategory,...(study.audience||[])].filter(Boolean).join(' ');
    const progress=state.completed?100:Math.round(state.progress||0);
    return `<article class="study-card" data-study-id="${escapeHtml(study.id)}" data-category="${escapeHtml(study.category)}" data-search="${escapeHtml([study.title,study.description,scripture,tags].join(' ').toLowerCase())}"><div class="study-topline"><span>${escapeHtml(study.category)}</span><small>${escapeHtml(study.difficulty||'All Levels')}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description)}</p><div class="study-meta"><span>📖 ${escapeHtml(scripture||'Scripture study')}</span><span>⏱ ${escapeHtml(study.duration||45)} minutes</span></div>${progress?`<div class="study-card-progress"><span>${state.completed?'Completed':`${progress}% complete`}</span><progress max="100" value="${progress}">${progress}%</progress></div>`:''}<div class="study-experience-actions"><a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">${progress&&!state.completed?'Continue':'Open Lesson'} →</a><button class="favorite-study" type="button" data-favorite-id="${escapeHtml(study.id)}" aria-label="${state.favorite?'Remove from favorites':'Add to favorites'}" aria-pressed="${state.favorite?'true':'false'}">${state.favorite?'★':'☆'}</button></div></article>`;
  };

  const categories=[...new Set(studies.map(study=>study.category).filter(Boolean))].sort();
  if(filter)filter.innerHTML='<option value="all">All types</option>'+categories.map(category=>`<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');

  if(collections&&!collections.dataset.static){
    collections.innerHTML=journeyCollections.map(item=>{
      const classes=['journey-collection-card',item.featured?'is-featured':'',item.status==='planned'?'is-planned':''].filter(Boolean).join(' ');
      const action=item.status==='planned'
        ?`<span class="collection-action is-disabled" aria-disabled="true">${escapeHtml(item.action)}</span>`
        :item.href
          ?`<a class="collection-action" href="${escapeHtml(item.href)}">${escapeHtml(item.action)} <span aria-hidden="true">→</span></a>`
          :`<button class="collection-action" type="button" data-journey-filter="${escapeHtml(item.filter||'all')}">${escapeHtml(item.action)} <span aria-hidden="true">→</span></button>`;
      return `<article class="${classes}"><div class="collection-card-top"><span class="collection-icon" aria-hidden="true">${item.icon}</span><span class="collection-status ${item.status==='planned'?'planned':'ready'}">${item.status==='planned'?'In Development':'Available'}</span></div><p class="collection-eyebrow">${escapeHtml(item.eyebrow)}</p><h3>${escapeHtml(item.title)}</h3><p class="collection-description">${escapeHtml(item.description)}</p><div class="collection-card-footer"><small>${escapeHtml(item.meta)}</small>${action}</div></article>`;
    }).join('');
  }

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
    const journeyFilter=event.target.closest('[data-journey-filter]');
    if(journeyFilter&&filter){
      filter.value=journeyFilter.dataset.journeyFilter;
      renderGrid();
      document.getElementById('library-tools')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
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
