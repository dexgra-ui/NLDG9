(function(){
  const target=document.getElementById('site-map-content-index');
  if(!target)return;

  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const groupFor=item=>{
    const type=String(item.type||'Resource').toLowerCase();
    if(type.includes('study')||type.includes('lesson'))return 'Studies and Lessons';
    if(type.includes('devotional')||type.includes('devotion'))return 'Devotionals';
    if(type.includes('article')||type.includes('reflection'))return 'Articles and Reflections';
    if(type.includes('podcast'))return 'Podcast';
    if(type.includes('game'))return 'Games';
    return 'Guides, Tools, and Resources';
  };

  function render(){
    const items=(window.NLDG_CONTENT||[])
      .filter(item=>item&&item.status!=='draft'&&item.url&&!/^https?:/i.test(item.url))
      .filter((item,index,array)=>array.findIndex(candidate=>candidate.url===item.url&&candidate.title===item.title)===index);

    if(!items.length){
      target.innerHTML='<p>Content index is loading.</p>';
      return;
    }

    const groups=new Map();
    items.forEach(item=>{
      const group=groupFor(item);
      if(!groups.has(group))groups.set(group,[]);
      groups.get(group).push(item);
    });

    const order=['Studies and Lessons','Devotionals','Articles and Reflections','Guides, Tools, and Resources','Podcast','Games'];
    target.innerHTML=order
      .filter(group=>groups.has(group))
      .map(group=>{
        const links=groups.get(group)
          .sort((a,b)=>String(a.title).localeCompare(String(b.title)))
          .map(item=>`<a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>`)
          .join('');
        return `<article><span aria-hidden="true">${group==='Studies and Lessons'?'📚':group==='Devotionals'?'🙏🏾':group==='Articles and Reflections'?'✍🏾':group==='Podcast'?'🎙️':group==='Games'?'🎮':'🧰'}</span><h2>${escapeHtml(group)}</h2>${links}</article>`;
      })
      .join('');
  }

  window.addEventListener('nldg-library-ready',render);
  render();
})();
