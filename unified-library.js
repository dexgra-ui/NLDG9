(function(){
  const catalog=(window.NLDG_LIBRARY||[]).filter(item=>item.status==='published');
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const FAVORITES='nldg-unified-library-favorites-v1';
  const HISTORY='nldg-unified-library-history-v1';
  const SAVED='nldg-ministry-assistant-sessions-v7';
  const STUDY_STATE='nldg-study-state';
  const LEGACY_FAVORITES='nldg-study-library-favorites-v1';
  const SERIES_STATE=series?`nldg-series-${series.id}`:'';
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read=(key,fallback=[])=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
  const studyState=()=>read(STUDY_STATE,{});
  const favoriteSet=()=>new Set([...read(FAVORITES,[]),...read(LEGACY_FAVORITES,[]),...Object.entries(studyState()).filter(([,state])=>state?.favorite).map(([id])=>id)]);
  const seriesState=()=>SERIES_STATE?read(SERIES_STATE,{completed:[]}):{completed:[]};
  const savedStudies=()=>read(SAVED,[]).map(item=>({
    id:`saved-${item.id}`,
    sourceId:item.id,
    source:item,
    type:'Saved Study',
    title:item.title||item.study?.ref||'Saved Bible Study',
    description:(Object.values(item.notes||{}).find(Boolean)||item.request||'A study saved on this device.').replace(/<[^>]+>/g,'').slice(0,190),
    url:'ministry-assistant.html',
    scripture:[item.study?.ref].filter(Boolean),
    topics:[...(item.study?.themes||[]),...(item.tags||[])],
    updatedAt:item.updated||item.created,
    progress:item.progress||'started',
    local:true
  }));
  const lessonItems=()=>series?series.lessons.map(item=>({
    id:`faith-truth-week-${item.week}`,
    type:'Faith & Truth Lesson',
    title:`Week ${item.week}: ${item.shortTitle||item.title}`,
    description:item.summary,
    url:`current-events-series.html?week=${item.week}`,
    scripture:item.scripture||[],
    topics:[item.unit,'current events','discipleship'].filter(Boolean),
    series:series.displayTitle,
    week:item.week,
    status:item.status,
    duration:45
  })) : [];
  const allItems=()=>[...catalog,...lessonItems(),...savedStudies()];
  let query='';
  let filter='all';
  let visible=18;

  function category(item){
    if(item.local)return 'saved';
    if(item.type==='Faith & Truth Lesson'||item.type==='Study'||item.type==='Study Collection')return 'studies';
    if(/Sunday School|Lesson Library/i.test(item.type)||/Sunday School/i.test(item.title))return 'sunday';
    if(/Devotional|Family Devotion/i.test(item.type))return 'devotionals';
    if(item.type==='Article'||item.type==='Article Library'||item.type==='News'||item.type==='Podcast')return 'articles';
    if(item.type==='Game')return 'games';
    return 'resources';
  }
  function isComplete(item){
    if(item.week)return new Set(seriesState().completed||[]).has(item.week);
    if(item.local)return item.progress==='complete';
    return Boolean(studyState()[item.id]?.completed);
  }
  function searchable(item){return [item.title,item.description,item.type,item.category,item.series,item.book,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])].filter(Boolean).join(' ').toLowerCase();}
  function matches(item){
    const favs=favoriteSet();
    if(filter==='favorites'&&!favs.has(item.id)&&!(item.local&&favs.has(item.sourceId)))return false;
    if(filter==='completed'&&!isComplete(item))return false;
    if(!['all','favorites','completed'].includes(filter)&&category(item)!==filter)return false;
    return !query||searchable(item).includes(query);
  }
  function dateValue(item){return String(item.updatedAt||item.publishedAt||'');}
  function sortedItems(){return allItems().filter(matches).sort((a,b)=>{
    if(a.local!==b.local)return a.local?-1:1;
    if(Boolean(a.featured)!==Boolean(b.featured))return a.featured?-1:1;
    return dateValue(b).localeCompare(dateValue(a));
  });}
  function tags(item){return [...(item.scripture||[]).slice(0,1),...(item.topics||[]).slice(0,2)].filter(Boolean);}
  function icon(item){return ({studies:'📖',sunday:'🧑‍🏫',devotionals:'🌅',articles:'📝',games:'🎮',resources:'🧰',saved:'🔖'})[category(item)]||'📚';}
  function recordHistory(item){
    if(item.local&&item.source)write('nldg-study-library-open',item.source);
    const list=read(HISTORY,[]).filter(entry=>entry.id!==item.id);
    list.unshift({id:item.id,title:item.title,url:item.url,type:item.type,openedAt:Date.now()});
    write(HISTORY,list.slice(0,20));
  }
  function toggleFavorite(item){
    const favs=favoriteSet();
    const key=item.local?item.sourceId:item.id;
    const next=!favs.has(key);
    next?favs.add(key):favs.delete(key);
    write(FAVORITES,[...favs]);
    if(!item.local){const state=studyState();state[key]={...(state[key]||{}),favorite:next,url:item.url,title:item.title,updated:Date.now()};write(STUDY_STATE,state);}
    render();
  }
  function card(item){const favs=favoriteSet();const key=item.local?item.sourceId:item.id;const complete=isComplete(item);return `<article class="library-card ${complete?'is-complete':''}"><div class="library-card-top"><span class="library-type">${icon(item)} ${esc(item.type)}</span><button class="library-favorite" data-favorite="${esc(item.id)}" aria-label="${favs.has(key)?'Remove from favorites':'Add to favorites'}" aria-pressed="${favs.has(key)?'true':'false'}">${favs.has(key)?'★':'☆'}</button></div><h3>${esc(item.title)}</h3><p>${esc(item.description||'Open this resource to continue your discipleship journey.')}</p><div class="library-tags">${tags(item).map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><div class="library-card-meta">${item.series?`${esc(item.series)} · `:''}${item.duration?`${item.duration} min`:item.local?'Saved on this device':esc(item.audience?.[0]||'Ministry resource')}</div><div class="library-card-actions"><a href="${esc(item.url)}" data-open="${esc(item.id)}">${item.local?'Continue':'Open'}</a>${complete?'<span class="complete-label">✓ Complete</span>':''}</div></article>`;}
  function resolve(id){return allItems().find(item=>item.id===id);}
  function renderFeatured(){const state=seriesState();const completed=new Set(state.completed||[]);const available=lessonItems().filter(item=>item.status==='complete');const next=available.find(item=>!completed.has(item.week))||available[0];const recent=read(HISTORY,[])[0];const favorites=allItems().filter(item=>{const favs=favoriteSet();return favs.has(item.id)||(item.local&&favs.has(item.sourceId));})[0];const picks=[next&&{...next,label:completed.size?'Continue Journey':'Begin Journey'},recent&&{id:recent.id,title:recent.title,type:recent.type,url:recent.url,description:'Return to your most recently opened resource.',label:'Recently Viewed'},favorites&&{...favorites,label:'Favorite'}].filter(Boolean).slice(0,3);$('#featuredGrid').innerHTML=picks.length?picks.map(item=>`<article class="library-feature-card"><span class="library-type">${esc(item.label||item.type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description||'Pick up where you left off.')}</p><a href="${esc(item.url)}" data-open="${esc(item.id)}">Open →</a></article>`).join(''):'<article class="library-feature-card"><span class="library-type">Start here</span><h3>Faith & Truth in Today’s World</h3><p>Begin the 42-week discipleship journey.</p><a href="current-events-series.html">Start Journey →</a></article>';}
  function render(){
    const items=sortedItems();
    const shown=items.slice(0,visible);
    const total=allItems();
    const favs=favoriteSet();
    $('#totalCount').textContent=total.length;
    $('#studyCount').textContent=total.filter(item=>category(item)==='studies').length;
    $('#favoriteCount').textContent=total.filter(item=>favs.has(item.id)||(item.local&&favs.has(item.sourceId))).length;
    $('#completeCount').textContent=total.filter(isComplete).length;
    $('#resultCount').textContent=`${items.length} result${items.length===1?'':'s'}`;
    $('#libraryGrid').innerHTML=shown.map(card).join('');
    $('#emptyLibrary').classList.toggle('hidden',items.length>0);
    $('#loadMore').classList.toggle('hidden',shown.length>=items.length);
    document.querySelectorAll('[data-favorite]').forEach(button=>button.addEventListener('click',()=>{const item=resolve(button.dataset.favorite);if(item)toggleFavorite(item);}));
    document.querySelectorAll('[data-open]').forEach(link=>link.addEventListener('click',()=>{const item=resolve(link.dataset.open);if(item)recordHistory(item);}));
    renderFeatured();
  }
  $('#librarySearch').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();visible=18;render();});
  $('#heroSearchButton').addEventListener('click',()=>{$('#contentSection').scrollIntoView({behavior:'smooth'});$('#librarySearch').focus();});
  document.querySelectorAll('.library-filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.library-filter').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');filter=button.dataset.filter;visible=18;render();}));
  $('#loadMore').addEventListener('click',()=>{visible+=18;render();});
  window.addEventListener('storage',render);
  render();
})();
