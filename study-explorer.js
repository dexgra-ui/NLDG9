(function(){
  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
  const published=()=>[...(window.NLDG_STUDIES||[])].filter(study=>study?.status==='published');
  const topicGrid=document.getElementById('topic-grid');
  const topicResults=document.getElementById('topic-results');
  const topicHeading=document.getElementById('topic-results-heading');
  const bookGrid=document.getElementById('book-grid');
  const scriptureResults=document.getElementById('scripture-results');
  const scriptureHeading=document.getElementById('scripture-results-heading');
  let selectedTopic='';
  let selectedBook='';

  const card=study=>{
    const scripture=(study.scripture||[]).filter(Boolean).join(', ');
    const detail=study.bookStudy&&study.lessons?`${study.lessons} lessons`:study.difficulty||study.series||'Bible Study';
    const meta=[scripture&&`📖 ${escapeHtml(scripture)}`,study.bookStudy&&study.lessons?`▤ ${study.lessons} complete lessons`:study.duration?`⏱ ${escapeHtml(study.duration)} minutes`:null].filter(Boolean);
    return `<article class="study-card"><div class="study-topline"><span>${escapeHtml(study.category||'Bible Studies')}</span><small>${escapeHtml(detail)}</small></div><h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description||'Open this study to explore Scripture in context.')}</p>${meta.length?`<div class="study-meta">${meta.map(item=>`<span>${item}</span>`).join('')}</div>`:''}<a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">Open Study →</a></article>`;
  };

  function renderTopics(){
    if(!topicGrid||!topicResults)return;
    const topicMap=new Map();
    published().forEach(study=>(study.topics||[]).forEach(topic=>{
      const key=String(topic||'').trim();
      if(!key)return;
      if(study.bookStudy&&key.toLowerCase()===String(study.book||study.title||'').trim().toLowerCase())return;
      if(!topicMap.has(key))topicMap.set(key,[]);
      topicMap.get(key).push(study);
    }));
    const topics=[...topicMap.keys()].sort((a,b)=>a.localeCompare(b));
    if(!topicMap.has(selectedTopic))selectedTopic=topics[0]||'';
    topicGrid.innerHTML=topics.map(topic=>`<button type="button" data-topic="${escapeHtml(topic)}" aria-pressed="${topic===selectedTopic?'true':'false'}"><span>📘</span><h3>${escapeHtml(topic.replace(/\b\w/g,letter=>letter.toUpperCase()))}</h3><small>${topicMap.get(topic).length} ${topicMap.get(topic).length===1?'study':'studies'}</small></button>`).join('');
    const showTopic=(topic,shouldScroll=true)=>{
      selectedTopic=topic;
      const matches=topicMap.get(topic)||[];
      topicGrid.querySelectorAll('[data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.topic===topic)));
      if(topicHeading)topicHeading.textContent=`${topic.replace(/\b\w/g,letter=>letter.toUpperCase())} Studies`;
      topicResults.innerHTML=matches.map(card).join('');
      if(shouldScroll)topicResults.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    topicGrid.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>showTopic(button.dataset.topic)));
    if(selectedTopic)showTopic(selectedTopic,false);else topicResults.innerHTML='';
  }

  function renderScripture(){
    if(!bookGrid||!scriptureResults)return;
    const studies=published();
    const bookMap=new Map();
    studies.forEach(study=>{
      const book=String(study.book||'Other').trim()||'Other';
      if(!bookMap.has(book))bookMap.set(book,[]);
      bookMap.get(book).push(study);
    });
    const canonicalOrder=studies.filter(study=>study.bookStudy&&study.book).map(study=>study.book);
    const order=new Map(canonicalOrder.map((book,index)=>[book,index]));
    const books=[...bookMap.keys()].sort((a,b)=>{
      const ai=order.has(a)?order.get(a):Number.MAX_SAFE_INTEGER;
      const bi=order.has(b)?order.get(b):Number.MAX_SAFE_INTEGER;
      return ai===bi?a.localeCompare(b):ai-bi;
    });
    if(!bookMap.has(selectedBook))selectedBook=books[0]||'';
    bookGrid.innerHTML=books.map(book=>`<button type="button" data-book="${escapeHtml(book)}" aria-pressed="${book===selectedBook?'true':'false'}"><span>📖</span><h3>${escapeHtml(book)}</h3><small>${bookMap.get(book).length} ${bookMap.get(book).length===1?'study':'studies'}</small></button>`).join('');
    const showBook=(book,shouldScroll=true)=>{
      selectedBook=book;
      const matches=bookMap.get(book)||[];
      bookGrid.querySelectorAll('[data-book]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.book===book)));
      if(scriptureHeading)scriptureHeading.textContent=`Studies in ${book}`;
      scriptureResults.innerHTML=matches.map(card).join('');
      if(shouldScroll)scriptureResults.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    bookGrid.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>showBook(button.dataset.book)));
    if(selectedBook)showBook(selectedBook,false);else scriptureResults.innerHTML='';
  }

  function render(){renderTopics();renderScripture();}
  render();
  window.addEventListener('nldg-library-ready',render);
})();