(function(){
  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
  const publishedStudies=()=>Array.isArray(window.NLDG_STUDIES)?window.NLDG_STUDIES.filter(study=>study?.status==='published'):[];
  let selectedTopic='';
  let selectedBook='';

  const card=study=>{
    const category=study.category?`<span>${escapeHtml(study.category)}</span>`:'';
    const difficulty=study.difficulty?`<small>${escapeHtml(study.difficulty)}</small>`:'';
    const scripture=study.scripture?.length?`<span>📖 ${escapeHtml(study.scripture.join(', '))}</span>`:'';
    const duration=study.duration?`<span>⏱ ${escapeHtml(study.duration)} minutes</span>`:'';
    const topline=category||difficulty?`<div class="study-topline">${category}${difficulty}</div>`:'';
    const meta=scripture||duration?`<div class="study-meta">${scripture}${duration}</div>`:'';
    return `<article class="study-card">${topline}<h3>${escapeHtml(study.title)}</h3><p>${escapeHtml(study.description||'Open this study to continue exploring Scripture.')}</p>${meta}<a class="study-open" data-study-id="${escapeHtml(study.id)}" href="${escapeHtml(study.url)}">Open Study →</a></article>`;
  };

  function renderTopics(){
    const topicGrid=document.getElementById('topic-grid');
    const topicResults=document.getElementById('topic-results');
    const topicHeading=document.getElementById('topic-results-heading');
    if(!topicGrid||!topicResults)return;
    const topicMap=new Map();
    publishedStudies().forEach(study=>(study.topics||[])
      .filter(topic=>!study.bookStudy||topic!==study.title)
      .forEach(topic=>{
        const key=String(topic||'').trim();
        if(!key)return;
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
    if(selectedTopic)showTopic(selectedTopic,false);
    else topicResults.innerHTML='';
  }

  function renderScripture(){
    const bookGrid=document.getElementById('book-grid');
    const scriptureResults=document.getElementById('scripture-results');
    const scriptureHeading=document.getElementById('scripture-results-heading');
    if(!bookGrid||!scriptureResults)return;
    const bookMap=new Map();
    publishedStudies().forEach(study=>{
      const book=study.book||'Other';
      if(!bookMap.has(book))bookMap.set(book,[]);
      bookMap.get(book).push(study);
    });
    const books=[...bookMap.keys()].sort((a,b)=>a.localeCompare(b));
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
    if(selectedBook)showBook(selectedBook,false);
    else scriptureResults.innerHTML='';
  }

  const render=()=>{renderTopics();renderScripture();};
  render();
  window.addEventListener('nldg-book-library-ready',render);
})();
