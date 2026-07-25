(function(){
 const items=window.NLDG_TEACHING_RESOURCES||[];
 const grid=document.getElementById('teaching-grid');
 const search=document.getElementById('teaching-search');
 const type=document.getElementById('teaching-type');
 const count=document.getElementById('teaching-count');
 const featured=document.getElementById('teaching-featured');
 if(!grid)return;
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const card=item=>`<article class="teaching-card"><div class="teaching-card-top"><span>${esc(item.type)}</span><span>${esc(item.format?.[0]||'Resource')}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="teaching-tags">${[...(item.scripture||[]).slice(0,1),...(item.topics||[]).slice(0,2)].map(tag=>`<span>${esc(tag)}</span>`).join('')}</div><div class="teaching-card-bottom"><small>${esc(item.audience?.join(' · ')||'Ministry resource')}</small><a href="${esc(item.url)}">Open resource →</a></div></article>`;
 if(featured){const picks=items.filter(item=>item.featured).slice(0,3);featured.innerHTML=picks.map(item=>`<article><p class="teaching-kicker">Featured ${esc(item.type)}</p><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><a href="${esc(item.url)}">Open →</a></article>`).join('');}
 const types=['All',...[...new Set(items.map(item=>item.type))]];
 if(type)type.innerHTML=types.map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('');
 function render(){const term=(search?.value||'').trim().toLowerCase();const selected=type?.value||'All';const filtered=items.filter(item=>(selected==='All'||item.type===selected)&&(!term||[item.title,item.description,item.type,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[]),...(item.format||[])].join(' ').toLowerCase().includes(term)));grid.innerHTML=filtered.length?filtered.map(card).join(''):'<div class="teaching-empty">No teaching resources match that search yet.</div>';if(count)count.textContent=`${filtered.length} resource${filtered.length===1?'':'s'}`;}
 search?.addEventListener('input',render);type?.addEventListener('change',render);render();
})();