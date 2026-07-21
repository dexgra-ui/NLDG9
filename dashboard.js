(function(){
  const api=window.NLDG_PERSONAL;if(!api)return;
  const library=window.NLDG_CONTENT||[];
  const card=window.NLDG_CONTENT_CARD||((item)=>`<article class="unified-content-card"><span class="content-type">${item.type}</span><h3>${item.title}</h3><p>${item.description||''}</p><a href="${item.url}">Open resource →</a></article>`);
  const byId=id=>library.find(item=>item.id===id);
  const empty=message=>`<article class="dashboard-empty"><p>${message}</p><a href="search.html">Explore the Content Library →</a></article>`;
  function render(){
    const profile=api.profile(),favorites=api.favorites(),history=api.history(),collections=api.collections();
    document.getElementById('profile-name').value=profile.name||'';
    document.getElementById('profile-interests').value=(profile.interests||[]).join(', ');
    document.getElementById('dashboard-greeting').textContent=profile.name?`Welcome back, ${profile.name}.`:'Your ministry space.';
    document.getElementById('stat-favorites').textContent=favorites.length;
    document.getElementById('stat-history').textContent=history.length;
    document.getElementById('stat-collections').textContent=collections.length;
    let progress=0;try{const last=JSON.parse(localStorage.getItem('nldg-last-study')||'null');progress=Number(last?.progress)||0;}catch{}
    document.getElementById('stat-progress').textContent=`${progress}%`;
    const recentItems=history.slice(0,4).map(entry=>byId(entry.id)).filter(Boolean);
    document.getElementById('continue-grid').innerHTML=recentItems.length?recentItems.map(card).join(''):empty('Your recently opened studies and resources will appear here.');
    const saved=favorites.map(byId).filter(Boolean);
    document.getElementById('favorites-grid').innerHTML=saved.length?saved.map(card).join(''):empty('Use the Save button on any content card to build your favorites.');
    document.getElementById('recommendations-grid').innerHTML=api.recommendations(6).map(card).join('');
    document.getElementById('collections-grid').innerHTML=collections.map(collection=>`<article class="collection-card"><div><span>${collection.items.length} item${collection.items.length===1?'':'s'}</span><h3>${collection.name}</h3></div><div>${collection.items.map(byId).filter(Boolean).slice(0,3).map(item=>`<a href="${item.url}">${item.title}</a>`).join('')||'<p>Add saved resources to this collection from a content card.</p>'}</div></article>`).join('');
    document.getElementById('history-list').innerHTML=history.length?history.slice(0,12).map(entry=>`<a href="${entry.url}"><span>${entry.type}</span><strong>${entry.title}</strong><small>${new Date(entry.visitedAt).toLocaleString()}</small></a>`).join(''):empty('Your viewing history will appear here.');
  }
  document.getElementById('profile-form').addEventListener('submit',event=>{event.preventDefault();const name=document.getElementById('profile-name').value.trim();const interests=document.getElementById('profile-interests').value.split(',').map(item=>item.trim()).filter(Boolean);api.saveProfile({name,interests,updatedAt:Date.now()});document.getElementById('profile-status').textContent='Profile saved on this device.';render();});
  document.getElementById('collection-form').addEventListener('submit',event=>{event.preventDefault();const input=document.getElementById('collection-name');if(api.createCollection(input.value)){input.value='';render();}});
  document.addEventListener('nldg:favorites-changed',render);
  document.addEventListener('nldg:collections-changed',render);
  render();
})();
