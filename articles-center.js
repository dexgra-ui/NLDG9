(function(){
  const articles=window.NLDG_ARTICLES||[];
  const grid=document.getElementById('article-grid');
  const featured=document.getElementById('featured-article');
  const search=document.getElementById('article-search');
  const categoryRow=document.getElementById('article-categories');
  const count=document.getElementById('article-count');
  if(!grid||!featured)return;
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  let active='All';
  const href=item=>`article.html?slug=${encodeURIComponent(item.slug)}`;
  const scripture=item=>(item.scripture||[])[0]||'';
  const card=item=>`<article class="article-card"><span class="category">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3>${scripture(item)?`<span class="article-scripture">${escapeHtml(scripture(item))}</span>`:''}<p>${escapeHtml(item.excerpt)}</p><div class="article-meta"><span>${escapeHtml(item.author)}</span><span>${item.readingTime} min read</span></div><a href="${href(item)}">Read article →</a></article>`;
  const lead=articles.find(item=>item.featured)||articles[0];
  if(lead)featured.innerHTML=`<div class="featured-visual"><span aria-hidden="true">✍🏽</span></div><div class="featured-copy"><p class="article-eyebrow">Featured Writing</p><h2>${escapeHtml(lead.title)}</h2>${scripture(lead)?`<span class="article-scripture">${escapeHtml(scripture(lead))}</span>`:''}<p>${escapeHtml(lead.excerpt)}</p><div class="article-meta"><span>${escapeHtml(lead.category)}</span><span>${lead.readingTime} min read</span></div><a class="read-link" href="${href(lead)}">Read featured article →</a></div>`;
  const categories=['All',...[...new Set(articles.map(item=>item.category))]];
  if(categoryRow)categoryRow.innerHTML=categories.map(category=>`<button type="button" class="category-button ${category==='All'?'active':''}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  function render(){
    const term=(search?.value||'').trim().toLowerCase();
    const filtered=articles.filter(item=>(active==='All'||item.category===active)&&(!term||[item.title,item.excerpt,item.category,item.series,...(item.topics||[]),...(item.scripture||[])].join(' ').toLowerCase().includes(term)));
    grid.innerHTML=filtered.length?filtered.map(card).join(''):'<div class="empty-articles">No articles match that search yet.</div>';
    if(count)count.textContent=`${filtered.length} article${filtered.length===1?'':'s'}`;
  }
  categoryRow?.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;active=button.dataset.category;categoryRow.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));render();});
  search?.addEventListener('input',render);
  render();
})();