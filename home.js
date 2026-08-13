(function(){
  const card=window.NLDG_CONTENT_CARD||function(item){return `<article class="unified-content-card"><span class="content-type">${item.type}</span><h3>${item.title}</h3><p>${item.description||''}</p><a href="${item.url}">Open resource →</a></article>`;};
  const render=(id,items)=>{const target=document.getElementById(id);if(target)target.innerHTML=items.map(card).join('');};
  const library=window.NLDG_CONTENT||[];
  const continueJourney=()=>{
    let state={};
    try{state=JSON.parse(localStorage.getItem('nldg-study-state')||'{}');}catch(error){return;}
    const recent=Object.entries(state)
      .map(([id,value])=>({id,...value}))
      .filter(item=>item.lastOpened||item.updated)
      .sort((a,b)=>(b.lastOpened||b.updated||0)-(a.lastOpened||a.updated||0))[0];
    if(!recent)return;
    const study=library.find(item=>item.id===recent.id&&item.status==='published');
    if(!study)return;
    const section=document.getElementById('home-continue-journey');
    if(!section)return;
    document.getElementById('home-continue-title').textContent=study.title;
    document.getElementById('home-continue-description').textContent=study.description||'Pick up where you left off.';
    const progress=recent.completed?'Completed':recent.progress?`${Math.round(recent.progress)}% complete`:'Ready to continue';
    document.getElementById('home-continue-meta').textContent=[study.series,progress].filter(Boolean).join(' • ');
    const link=document.getElementById('home-continue-link');
    link.href=study.url;
    link.textContent=recent.completed?'Review Study →':'Continue Study →';
    section.hidden=false;
  };
  const featured=[];
  const featuredSeries=new Set();
  for(const item of library.filter(item=>item.featured)){
    if(item.series&&featuredSeries.has(item.series))continue;
    featured.push(item);
    if(item.series)featuredSeries.add(item.series);
    if(featured.length===3)break;
  }
  const featuredKeys=new Set(featured.map(item=>item.id||item.url));
  const latestSource=window.NLDG_LIBRARY_API?.newest(library.length)||library;
  const latest=[];
  const usedSeries=new Set(featuredSeries);
  for(const item of latestSource){
    if(featuredKeys.has(item.id||item.url)||(item.series&&usedSeries.has(item.series)))continue;
    latest.push(item);
    if(item.series)usedSeries.add(item.series);
    if(latest.length===3)break;
  }
  render('home-featured',featured);
  render('home-latest',latest);
  continueJourney();
})();
