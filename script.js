const menu=document.querySelector('.menu');
if(menu)menu.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>document.body.classList.remove('nav-open')));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const signupForm=document.getElementById('signup-form');
const formMessage=document.getElementById('form-message');
if(signupForm){
  signupForm.addEventListener('submit',event=>{
    event.preventDefault();
    formMessage.textContent='Thank you. Email signup will be connected in the next phase.';
    signupForm.reset();
  });
}

const studySearch=document.getElementById('study-search');
const studyFilter=document.getElementById('study-filter');
const studyCards=[...document.querySelectorAll('.study-card')];
const studyEmpty=document.getElementById('study-empty');
function filterStudies(){
  if(!studyCards.length)return;
  const query=(studySearch?.value||'').trim().toLowerCase();
  const category=studyFilter?.value||'all';
  let visible=0;
  studyCards.forEach(card=>{
    const text=[card.dataset.title,card.dataset.tags,card.dataset.category,card.textContent].join(' ').toLowerCase();
    const show=(!query||text.includes(query))&&(category==='all'||card.dataset.category===category);
    card.hidden=!show;
    if(show)visible++;
  });
  if(studyEmpty)studyEmpty.hidden=visible!==0;
}
studySearch?.addEventListener('input',filterStudies);
studyFilter?.addEventListener('change',filterStudies);

const ministrySearchData=window.NLDG_CONTENT||[];
const siteSearch=document.getElementById('site-search');
const searchResults=document.getElementById('search-results');
const searchSummary=document.getElementById('search-summary');
const searchEmpty=document.getElementById('search-empty');
let activeSearchType='all';
function searchableText(item){
  return [
    item.title,
    item.description,
    item.type,
    item.category,
    item.series,
    item.book,
    ...(item.scripture||[]),
    ...(item.topics||[]),
    ...(item.audience||[])
  ].filter(Boolean).join(' ').toLowerCase();
}
function renderSiteSearch(){
  if(!searchResults)return;
  const query=(siteSearch?.value||'').trim().toLowerCase();
  const matches=ministrySearchData.filter(item=>{
    const typeMatches=activeSearchType==='all'||item.type===activeSearchType;
    return typeMatches&&(!query||searchableText(item).includes(query));
  });
  searchResults.innerHTML=matches.map(item=>{
    const details=item.type==='Study'
      ? `<div class="study-meta"><span>📖 ${(item.scripture||[]).join(', ')}</span><span>⏱ ${item.duration} minutes</span><span>${item.difficulty}</span></div>`
      : '';
    return `<article class="search-result-card"><span class="result-type">${item.type}</span><h3>${item.title}</h3><p>${item.description}</p>${details}<a href="${item.url}">Open ${item.type} →</a></article>`;
  }).join('');
  if(searchSummary)searchSummary.textContent=query?`${matches.length} result${matches.length===1?'':'s'} for “${siteSearch.value}”.`:`Showing ${matches.length} ministry resources.`;
  if(searchEmpty)searchEmpty.hidden=matches.length!==0;
}
siteSearch?.addEventListener('input',renderSiteSearch);
document.getElementById('clear-search')?.addEventListener('click',()=>{siteSearch.value='';siteSearch.focus();renderSiteSearch();});
document.querySelectorAll('[data-type]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-type]').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  activeSearchType=button.dataset.type;
  renderSiteSearch();
}));
renderSiteSearch();

const studyPageId=document.body.dataset.studyPage;
if(studyPageId){
  try{
    const study=(window.NLDG_STUDIES||[]).find(item=>item.id===studyPageId);
    localStorage.setItem('nldg-last-study',JSON.stringify({
      id:studyPageId,
      title:study?.title||document.body.dataset.studyTitle||document.title,
      url:location.pathname.split('/').pop()||location.href,
      updated:Date.now()
    }));
  }catch(error){console.warn('Study progress could not be saved.',error);}
}
document.querySelectorAll('.study-open').forEach(link=>link.addEventListener('click',()=>{
  try{
    const study=(window.NLDG_STUDIES||[]).find(item=>item.id===link.dataset.studyId);
    localStorage.setItem('nldg-last-study',JSON.stringify({
      id:link.dataset.studyId||'study',
      title:study?.title||link.closest('article')?.querySelector('h3')?.textContent||link.textContent,
      url:link.getAttribute('href'),
      updated:Date.now()
    }));
  }catch(error){}
}));
const continueSection=document.getElementById('continue-study');
const continueCard=document.getElementById('continue-study-card');
if(continueSection&&continueCard){
  try{
    const saved=JSON.parse(localStorage.getItem('nldg-last-study')||'null');
    if(saved?.url){
      continueSection.hidden=false;
      const progress=saved.progress?` You are ${saved.progress}% complete.`:'';
      continueCard.innerHTML=`<article class="continue-card"><span>Continue Study</span><h3>${saved.title}</h3><p>Your place is saved on this device.${progress}</p><a class="button primary" href="${saved.url}">Continue Reading</a></article>`;
    }
  }catch(error){}
}
document.querySelectorAll('[data-collection]').forEach(button=>button.addEventListener('click',()=>{
  const value=button.dataset.collection||'all';
  if(studyFilter){
    studyFilter.value=value;
    filterStudies();
    document.querySelector('.study-tools')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}));

const gameCards=[...document.querySelectorAll('[data-game-category]')];
const gameEmpty=document.getElementById('game-empty');
document.querySelectorAll('[data-game-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-game-filter]').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  const filter=button.dataset.gameFilter;
  let shown=0;
  gameCards.forEach(card=>{
    const show=filter==='all'||card.dataset.gameCategory===filter;
    card.hidden=!show;
    if(show)shown++;
  });
  if(gameEmpty)gameEmpty.hidden=shown!==0;
  document.getElementById('game-library')?.scrollIntoView({behavior:'smooth',block:'start'});
}));

document.querySelectorAll('[data-game-filter],[data-collection]').forEach(control=>{
  control.setAttribute('type','button');
  control.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      control.click();
    }
  });
});

if(studyPageId){
  const loadScript=src=>new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(script=>script.src.endsWith(src));
    if(existing){resolve();return;}
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=reject;
    document.body.appendChild(script);
  });
  if(!document.querySelector('link[href="study-experience.css"]')){
    const stylesheet=document.createElement('link');
    stylesheet.rel='stylesheet';
    stylesheet.href='study-experience.css';
    document.head.appendChild(stylesheet);
  }
  const ready=window.NLDG_STUDIES?Promise.resolve():loadScript('study-data.js');
  ready.then(()=>loadScript('study-experience.js')).catch(error=>console.warn('Interactive study tools could not load.',error));
}