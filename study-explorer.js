(function(){
  const studies=(window.NLDG_STUDIES||[]).filter(study=>study.status==='published');
  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const card=study=>`<article class="study-card"><div class="study-topline"><span>${escapeHtml(study.category)}</span><small>${escapeHtml(study.difficulty)}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description)}</p><div class="study-meta"><span>📖 ${escapeHtml((study.scripture||[]).join(', '))}</span><span>⏱ ${escapeHtml(study.duration)} minutes</span></div><a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">Open Study →</a></article>`;

  const topicGrid=document.getElementById('topic-grid');
  const topicResults=document.getElementById('topic-results');
  const topicHeading=document.getElementById('topic-results-heading');
  if(topicGrid&&topicResults){
    const topicMap=new Map();
    studies.forEach(study=>(study.topics||[]).forEach(topic=>{
      const key=topic.trim();
      if(!topicMap.has(key))topicMap.set(key,[]);
      topicMap.get(key).push(study);
    }));
    const topics=[...topicMap.keys()].sort((a,b)=>a.localeCompare(b));
    topicGrid.innerHTML=topics.map(topic=>`<button type="button" data-topic="${escapeHtml(topic)}"><span>📘</span><h3>${escapeHtml(topic.replace(/\b\w/g,letter=>letter.toUpperCase()))}</h3><small>${topicMap.get(topic).length} ${topicMap.get(topic).length===1?'study':'studies'}</small></button>`).join('');
    const showTopic=topic=>{
      const matches=topicMap.get(topic)||[];
      if(topicHeading)topicHeading.textContent=`${topic.replace(/\b\w/g,letter=>letter.toUpperCase())} Studies`;
      topicResults.innerHTML=matches.map(card).join('');
      topicResults.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    topicGrid.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>showTopic(button.dataset.topic)));
    if(topics[0])showTopic(topics[0]);
  }

  const bookGrid=document.getElementById('book-grid');
  const scriptureResults=document.getElementById('scripture-results');
  const scriptureHeading=document.getElementById('scripture-results-heading');
  if(bookGrid&&scriptureResults){
    const bookMap=new Map();
    studies.forEach(study=>{
      const book=study.book||'Other';
      if(!bookMap.has(book))bookMap.set(book,[]);
      bookMap.get(book).push(study);
    });
    const books=[...bookMap.keys()].sort((a,b)=>a.localeCompare(b));
    bookGrid.innerHTML=books.map(book=>`<button type="button" data-book="${escapeHtml(book)}"><span>📖</span><h3>${escapeHtml(book)}</h3><small>${bookMap.get(book).length} ${bookMap.get(book).length===1?'study':'studies'}</small></button>`).join('');
    const showBook=book=>{
      const matches=bookMap.get(book)||[];
      if(scriptureHeading)scriptureHeading.textContent=`Studies in ${book}`;
      scriptureResults.innerHTML=matches.map(card).join('');
      scriptureResults.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    bookGrid.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>showBook(button.dataset.book)));
    if(books[0])showBook(books[0]);
  }
})();