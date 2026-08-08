(function(){
  const card=window.NLDG_CONTENT_CARD||function(item){return `<article class="unified-content-card"><span class="content-type">${item.type}</span><h3>${item.title}</h3><p>${item.description||''}</p><a href="${item.url}">Open resource →</a></article>`;};
  const render=(id,items)=>{const target=document.getElementById(id);if(target)target.innerHTML=items.map(card).join('');};
  const library=window.NLDG_CONTENT||[];
  render('home-featured',library.filter(item=>item.featured).slice(0,3));
  render('home-latest',(window.NLDG_LIBRARY_API?.newest(3)||library.slice(0,3)));
})();
