const m=document.querySelector('.menu');if(m)m.addEventListener('click',()=>document.body.classList.toggle('nav-open'));document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());const f=document.getElementById('signup-form'),msg=document.getElementById('form-message');if(f){f.addEventListener('submit',e=>{e.preventDefault();msg.textContent='Thank you. Email signup will be connected in the next phase.';f.reset()})}
const studySearch=document.getElementById('study-search');
const studyFilter=document.getElementById('study-filter');
const studyCards=[...document.querySelectorAll('.study-card')];
const studyEmpty=document.getElementById('study-empty');
function filterStudies(){
  if(!studyCards.length)return;
  const q=(studySearch?.value||'').trim().toLowerCase();
  const category=studyFilter?.value||'all';
  let visible=0;
  studyCards.forEach(card=>{
    const hay=[card.dataset.title,card.dataset.tags,card.dataset.category,card.textContent].join(' ').toLowerCase();
    const matchesText=!q||hay.includes(q);
    const matchesCategory=category==='all'||card.dataset.category===category;
    const show=matchesText&&matchesCategory;
    card.hidden=!show;
    if(show)visible++;
  });
  if(studyEmpty)studyEmpty.hidden=visible!==0;
}
studySearch?.addEventListener('input',filterStudies);
studyFilter?.addEventListener('change',filterStudies);


const ministrySearchData = [
  {type:'Study',title:'Learning to See Yourself Through God’s Eyes',description:'Identity, grace, purpose, and God’s workmanship in Ephesians 2.',url:'study-identity.html',keywords:'identity chosen loved purpose ephesians'},
  {type:'Study',title:'Free Indeed',description:'Freedom in Christ and what it means to live beyond spiritual bondage.',url:'study-free-indeed.html',keywords:'freedom john 8 discipleship'},
  {type:'Study',title:'Grace and Accountability',description:'How biblical grace, truth, dignity, and responsibility work together.',url:'study-grace-accountability.html',keywords:'grace accountability truth dignity'},
  {type:'Study',title:'Becoming Peacemakers',description:'Learning to pursue peace in a divided and reactive world.',url:'study-peacemakers.html',keywords:'peace peacemaker conflict reconciliation'},
  {type:'Study',title:'Peace in the Storm',description:'Trusting Jesus when the wind and waves are still present.',url:'study-storm.html',keywords:'storm faith fear peace jesus'},
  {type:'Study',title:'Escapism vs. Eternal Hope',description:'Setting the mind on Christ without avoiding present responsibilities.',url:'study-escapism.html',keywords:'hope escapism eternity colossians'},
  {type:'Devotional',title:'Daily Devotionals',description:'Short biblical encouragement for identity, faith, peace, and discipleship.',url:'devotionals.html',keywords:'daily devotional encouragement'},
  {type:'Article',title:'Articles on Faith and Culture',description:'Biblical reflection on identity, discipleship, culture, and everyday life.',url:'articles.html',keywords:'articles culture faith identity'},
  {type:'Resource',title:'Ministry Resources',description:'Practical tools for families, small groups, teachers, and church leaders.',url:'resources.html',keywords:'leader guide family small group church'},
  {type:'Game',title:'Scripture or Suspicion',description:'Identify the real Bible verse among convincing imitations.',url:'games.html?group=family&game=suspicion',keywords:'verse trivia scripture'},
  {type:'Game',title:'Who Am I?',description:'Identify Bible characters using clues from their lives.',url:'games.html?group=family&game=quiz',keywords:'bible characters quiz'},
  {type:'Game',title:'Finish the Verse',description:'Complete familiar passages and strengthen Scripture memory.',url:'games.html?group=family&game=finish',keywords:'memory verse'},
  {type:'Game',title:'Bible Jeopardy',description:'Team competition with categories and point values.',url:'games.html?group=family&game=jeopardy',keywords:'teams competition church'},
  {type:'Game',title:'Memory Match',description:'Match Bible people and themes in a visual memory game.',url:'games.html?group=family&game=memory',keywords:'memory kids family'},
  {type:'Game',title:'Lightning Round',description:'Fast Bible questions for energetic group review.',url:'games.html?group=family&game=lightning',keywords:'fast timer review'},
  {type:'Podcast',title:'The No Labels Podcast',description:'Future biblical conversations about identity, family, discipleship, culture, and following Jesus.',url:'podcast.html',keywords:'listen audio family identity conversation'},
  {type:'News',title:'Phase 3 Ministry Platform Update',description:'Podcast, universal search, ministry news, homepage pathways, and Game Center improvements.',url:'news.html',keywords:'update phase 3 ministry platform'}
];
const siteSearch=document.getElementById('site-search');
const searchResults=document.getElementById('search-results');
const searchSummary=document.getElementById('search-summary');
const searchEmpty=document.getElementById('search-empty');
let activeSearchType='all';
function renderSiteSearch(){
  if(!searchResults)return;
  const q=(siteSearch?.value||'').trim().toLowerCase();
  const matches=ministrySearchData.filter(item=>{
    const typeOk=activeSearchType==='all'||item.type===activeSearchType;
    const text=(item.title+' '+item.description+' '+item.keywords+' '+item.type).toLowerCase();
    return typeOk&&(!q||text.includes(q));
  });
  searchResults.innerHTML=matches.map(item=>`<article class="search-result-card"><span class="result-type">${item.type}</span><h3>${item.title}</h3><p>${item.description}</p><a href="${item.url}">Open ${item.type} →</a></article>`).join('');
  if(searchSummary)searchSummary.textContent=q?`${matches.length} result${matches.length===1?'':'s'} for “${siteSearch.value}”.`:`Showing ${matches.length} ministry resources.`;
  if(searchEmpty)searchEmpty.hidden=matches.length!==0;
}
siteSearch?.addEventListener('input',renderSiteSearch);
document.getElementById('clear-search')?.addEventListener('click',()=>{siteSearch.value='';siteSearch.focus();renderSiteSearch()});
document.querySelectorAll('[data-type]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-type]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeSearchType=btn.dataset.type;renderSiteSearch()}));
renderSiteSearch();

const gameCards=[...document.querySelectorAll('[data-game-category]')];


// Version 0.8: local study progress and collection browsing.
const studyPageId=document.body.dataset.studyPage;
if(studyPageId){
  try{
    localStorage.setItem('nldg-last-study',JSON.stringify({
      id:studyPageId,
      title:document.body.dataset.studyTitle||document.title,
      url:location.pathname.split('/').pop()||location.href,
      updated:Date.now()
    }));
  }catch(error){console.warn('Study progress could not be saved.',error)}
}
document.querySelectorAll('.study-open').forEach(link=>link.addEventListener('click',()=>{
  try{
    localStorage.setItem('nldg-last-study',JSON.stringify({
      id:link.dataset.studyId||'study',
      title:link.closest('article')?.querySelector('h3')?.textContent||link.textContent,
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
      continueCard.innerHTML=`<article class="continue-card"><span>Continue Study</span><h3>${saved.title}</h3><p>Your place is saved on this device.</p><a class="button primary" href="${saved.url}">Continue Reading</a></article>`;
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
const gameEmpty=document.getElementById('game-empty');
document.querySelectorAll('[data-game-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-game-filter]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filter=btn.dataset.gameFilter;
  let shown=0;
  gameCards.forEach(card=>{
    const show=filter==='all'||card.dataset.gameCategory===filter;
    card.hidden=!show;
    if(show)shown++;
  });
  if(gameEmpty)gameEmpty.hidden=shown!==0;
  document.getElementById('game-library')?.scrollIntoView({behavior:'smooth',block:'start'});
}));


// Version 0.8.1: reliable touch and keyboard activation.
document.querySelectorAll('[data-game-filter],[data-collection]').forEach(control=>{
  control.setAttribute('type','button');
  control.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      control.click();
    }
  });
});
