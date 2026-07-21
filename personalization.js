(function(){
  const KEYS={profile:'nldg-profile-v1',favorites:'nldg-favorites-v1',history:'nldg-history-v1',collections:'nldg-collections-v1'};
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const library=()=>window.NLDG_CONTENT||[];
  const currentPage=()=>location.pathname.split('/').pop()||'index.html';
  const currentItem=()=>library().find(item=>item.url===currentPage()||item.id===document.body.dataset.studyPage);
  const profile=()=>read(KEYS.profile,{name:'',interests:[],createdAt:Date.now()});
  const favorites=()=>read(KEYS.favorites,[]);
  const history=()=>read(KEYS.history,[]);
  const collections=()=>read(KEYS.collections,[{id:'saved-for-later',name:'Saved for Later',items:[]}]);
  const saveProfile=value=>write(KEYS.profile,value);
  const isFavorite=id=>favorites().includes(id);
  function toggleFavorite(id){const list=favorites();const next=list.includes(id)?list.filter(item=>item!==id):[id,...list];write(KEYS.favorites,next);document.dispatchEvent(new CustomEvent('nldg:favorites-changed',{detail:next}));return next.includes(id);}
  function addHistory(item){if(!item)return;const entry={id:item.id,title:item.title,url:item.url,type:item.type,visitedAt:Date.now()};const next=[entry,...history().filter(existing=>existing.id!==item.id)].slice(0,40);write(KEYS.history,next);}
  function addToCollection(collectionId,itemId){const list=collections();const collection=list.find(item=>item.id===collectionId);if(!collection)return false;if(!collection.items.includes(itemId))collection.items.unshift(itemId);write(KEYS.collections,list);document.dispatchEvent(new CustomEvent('nldg:collections-changed'));return true;}
  function createCollection(name){const clean=String(name||'').trim();if(!clean)return null;const list=collections();const item={id:`collection-${Date.now()}`,name:clean,items:[]};list.push(item);write(KEYS.collections,list);return item;}
  function recommendations(limit=8){const p=profile();const favItems=favorites().map(id=>library().find(item=>item.id===id)).filter(Boolean);const signals=[...(p.interests||[]),...favItems.flatMap(item=>[...(item.topics||[]),...(item.audience||[]),item.type])].map(value=>String(value).toLowerCase());return library().map(item=>{const text=[item.type,item.category,item.series,...(item.topics||[]),...(item.audience||[])].filter(Boolean).map(value=>String(value).toLowerCase());return{item,score:text.filter(value=>signals.some(signal=>value.includes(signal)||signal.includes(value))).length};}).sort((a,b)=>b.score-a.score||String(b.item.publishedAt||'').localeCompare(String(a.item.publishedAt||''))).map(entry=>entry.item).slice(0,limit);}
  function decorateCards(){document.querySelectorAll('.unified-content-card').forEach(card=>{if(card.querySelector('.favorite-toggle'))return;const link=card.querySelector('a[href]');if(!link)return;const item=library().find(entry=>entry.url===link.getAttribute('href'));if(!item)return;card.dataset.contentId=item.id;const button=document.createElement('button');button.type='button';button.className='favorite-toggle';button.setAttribute('aria-label',`Save ${item.title}`);button.textContent=isFavorite(item.id)?'★ Saved':'☆ Save';button.addEventListener('click',()=>{const saved=toggleFavorite(item.id);button.textContent=saved?'★ Saved':'☆ Save';});card.appendChild(button);});}
  function addAccountLink(){const nav=document.querySelector('.site-header nav');if(nav&&!nav.querySelector('[href="dashboard.html"]')){const link=document.createElement('a');link.href='dashboard.html';link.textContent=profile().name?'My Dashboard':'My Space';nav.insertBefore(link,nav.querySelector('.play-link'));}}
  window.NLDG_PERSONAL={profile,saveProfile,favorites,history,collections,toggleFavorite,addToCollection,createCollection,recommendations,isFavorite};
  const item=currentItem();if(item)addHistory(item);
  addAccountLink();decorateCards();
  new MutationObserver(decorateCards).observe(document.body,{childList:true,subtree:true});
})();
