(function(){
  const card=window.NLDG_CONTENT_CARD||function(item){return `<article class="unified-content-card"><span class="content-type">${item.type}</span><h3>${item.title}</h3><p>${item.description||''}</p><a href="${item.url}">Open resource →</a></article>`;};
  const render=(id,items)=>{const target=document.getElementById(id);if(target)target.innerHTML=items.map(card).join('');};
  const library=window.NLDG_CONTENT||[];
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
})();
