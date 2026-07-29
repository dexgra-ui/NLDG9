(function(){
  const K={
    profile:'nldg-profile-v2',
    favorites:'nldg-favorites-v1',
    history:'nldg-history-v1',
    collections:'nldg-collections-v1',
    completed:'nldg-completed-v1',
    notes:'nldg-notes-v1',
    prayers:'nldg-prayers-v1',
    plans:'nldg-plans-v1',
    streak:'nldg-streak-v1',
    studyState:'nldg-study-state'
  };
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const emit=name=>document.dispatchEvent(new CustomEvent(`nldg:${name}-changed`));
  const lib=()=>window.NLDG_CONTENT||[];
  const page=()=>location.pathname.split('/').pop()||'index.html';
  const pageWithQuery=()=>page()+location.search;
  const current=()=>lib().find(item=>item.url===page()||item.url===pageWithQuery()||item.id===document.body.dataset.studyPage);
  const unique=list=>[...new Set(list.filter(Boolean))];
  const studyState=()=>read(K.studyState,{});
  const flaggedStudies=flag=>Object.entries(studyState()).filter(([,state])=>Boolean(state?.[flag])).map(([id])=>id);

  const PLANS=[
    {id:'jesus-30',title:'30 Days with Jesus',days:30,topics:['Jesus','discipleship'],description:'Walk through the life, teaching, compassion, cross, and resurrection of Jesus.'},
    {id:'growing-faith',title:'Growing in Faith',days:21,topics:['faith','spiritual growth'],description:'Build daily habits of Scripture, prayer, trust, and obedience.'},
    {id:'new-believer',title:'New Believer Journey',days:14,topics:['new believers','foundations'],description:'A clear introduction to grace, identity, prayer, Scripture, and Christian community.'},
    {id:'identity-christ',title:'Identity in Christ',days:14,topics:['identity','grace'],description:'Replace the labels of the world with the truth of who God says you are.'},
    {id:'men-bible',title:'Men of the Bible',days:21,topics:['men','leadership'],description:'Learn from the faith, failures, courage, and growth of biblical men.'},
    {id:'women-faith',title:'Women of Faith',days:21,topics:['women','faith'],description:'Explore women whose courage and faith shaped God’s story.'},
    {id:'family-devotions',title:'Family Devotions',days:30,topics:['family','devotional'],description:'Simple daily Scripture conversations for the whole family.'}
  ];

  const profile=()=>read(K.profile,{name:'',photo:'',interests:[],translation:'NIV',theme:'system',readingGoal:3,createdAt:Date.now()});
  const saveProfile=value=>{const next={...profile(),...value,updatedAt:Date.now()};write(K.profile,next);document.documentElement.dataset.theme=next.theme||'system';emit('profile');return next;};
  const favorites=()=>unique([...read(K.favorites,[]),...flaggedStudies('favorite')]);
  const history=()=>read(K.history,[]);
  const collections=()=>read(K.collections,[{id:'saved-for-later',name:'Saved for Later',items:[]}]);
  const completed=()=>unique([...read(K.completed,[]),...flaggedStudies('completed')]);
  const notes=()=>read(K.notes,[]);
  const prayers=()=>read(K.prayers,[]);
  const planState=()=>read(K.plans,{active:null,completed:[]});

  function updateStudyState(id,updates){
    const state=studyState();
    const item=lib().find(entry=>entry.id===id);
    state[id]={...(state[id]||{}),...updates,url:item?.url||state[id]?.url,title:item?.title||state[id]?.title,updated:Date.now()};
    write(K.studyState,state);
  }
  function toggleFavorite(id){
    const next=!favorites().includes(id);
    const legacy=read(K.favorites,[]).filter(value=>value!==id);
    if(next)legacy.unshift(id);
    write(K.favorites,legacy);
    const item=lib().find(entry=>entry.id===id);
    if(item?.type==='Study'||studyState()[id])updateStudyState(id,{favorite:next});
    emit('favorites');
    return next;
  }
  function addHistory(item){
    if(!item)return;
    const entry={id:item.id,title:item.title,url:item.url,type:item.type,visitedAt:Date.now()};
    write(K.history,[entry,...history().filter(value=>value.id!==item.id)].slice(0,60));
    updateStreak();
  }
  function toggleCompleted(id){
    const next=!completed().includes(id);
    const legacy=read(K.completed,[]).filter(value=>value!==id);
    if(next)legacy.unshift(id);
    write(K.completed,legacy);
    const item=lib().find(entry=>entry.id===id);
    if(item?.type==='Study'||studyState()[id])updateStudyState(id,{completed:next,progress:next?100:Math.min(99,studyState()[id]?.progress||0)});
    emit('completed');
    return next;
  }
  function saveNote(note){
    const list=notes();
    const item={id:note.id||`note-${Date.now()}`,contentId:note.contentId||current()?.id||'',title:note.title||current()?.title||'Personal Note',journal:note.journal||'',prayer:note.prayer||'',questions:note.questions||'',scriptures:note.scriptures||'',updatedAt:Date.now()};
    const next=[item,...list.filter(value=>value.id!==item.id)];
    write(K.notes,next);emit('notes');return item;
  }
  function removeNote(id){write(K.notes,notes().filter(value=>value.id!==id));emit('notes');}
  function addPrayer(value){const item={id:`prayer-${Date.now()}`,title:value.title||'Prayer Request',category:value.category||'Personal',scripture:value.scripture||'',studyId:value.studyId||'',details:value.details||'',answered:false,createdAt:Date.now()};write(K.prayers,[item,...prayers()]);emit('prayers');return item;}
  function togglePrayer(id){const list=prayers();const prayer=list.find(value=>value.id===id);if(prayer){prayer.answered=!prayer.answered;prayer.answeredAt=prayer.answered?Date.now():null;write(K.prayers,list);emit('prayers');}return prayer;}
  function removePrayer(id){write(K.prayers,prayers().filter(value=>value.id!==id));emit('prayers');}
  function startPlan(id){const plan=PLANS.find(value=>value.id===id);if(!plan)return null;const state=planState();state.active={id,day:1,completedDays:[],startedAt:Date.now(),updatedAt:Date.now()};write(K.plans,state);emit('plans');return state.active;}
  function markPlanDay(day){const state=planState();if(!state.active)return;const number=Number(day);if(!state.active.completedDays.includes(number))state.active.completedDays.push(number);state.active.day=Math.min((PLANS.find(value=>value.id===state.active.id)?.days||number),number+1);state.active.updatedAt=Date.now();const plan=PLANS.find(value=>value.id===state.active.id);if(plan&&state.active.completedDays.length>=plan.days){state.completed=[...(state.completed||[]),{...state.active,completedAt:Date.now()}];state.active=null;}write(K.plans,state);updateStreak();emit('plans');}
  function addToCollection(collectionId,itemId){const list=collections(),collection=list.find(value=>value.id===collectionId);if(!collection)return false;if(!collection.items.includes(itemId))collection.items.unshift(itemId);write(K.collections,list);emit('collections');return true;}
  function createCollection(name){const clean=String(name||'').trim();if(!clean)return null;const list=collections(),item={id:`collection-${Date.now()}`,name:clean,items:[]};list.push(item);write(K.collections,list);emit('collections');return item;}
  function updateStreak(){const today=new Date().toISOString().slice(0,10),state=read(K.streak,{dates:[]});if(!state.dates.includes(today))state.dates.push(today);state.dates=state.dates.slice(-60);write(K.streak,state);}
  function streak(){const dates=new Set(read(K.streak,{dates:[]}).dates),date=new Date();let count=0;for(;;){const key=date.toISOString().slice(0,10);if(!dates.has(key))break;count++;date.setDate(date.getDate()-1);}return count;}
  function achievements(){const output=[];if(completed().length)output.push('First Study Completed');if(streak()>=7)output.push('Seven-Day Reading Streak');if(history().length>=10)output.push('Scripture Explorer');if(prayers().length>=5)output.push('Prayer Warrior');if(completed().length>=5)output.push('Faithful Learner');if(favorites().map(id=>lib().find(item=>item.id===id)).filter(item=>item?.audience?.some(value=>String(value).toLowerCase().includes('family'))).length>=3)output.push('Family Leader');return output;}
  function growth(){const items=history().map(value=>lib().find(item=>item.id===value.id)).filter(Boolean),allText=items.map(item=>[item.title,item.description,item.category,item.series,...(item.topics||[]),...(item.audience||[])].join(' ').toLowerCase());const count=words=>allText.filter(text=>words.some(word=>text.includes(word))).length;const cap=number=>Math.min(100,Math.round(number));const state=planState();const planDays=(state.active?.completedDays?.length||0)+(state.completed||[]).reduce((sum,plan)=>sum+(plan.completedDays?.length||0),0);return[{name:'Scripture',value:cap(history().length*8+completed().length*12+planDays*2)},{name:'Prayer',value:cap(prayers().length*12+prayers().filter(prayer=>prayer.answered).length*8+notes().filter(note=>note.prayer).length*6)},{name:'Discipleship',value:cap(completed().length*18+planDays*3+streak()*4)},{name:'Service',value:cap(count(['service','serve','leadership','ministry','mission'])*15+favorites().length*2)},{name:'Community',value:cap(count(['family','community','church','group','fellowship'])*15+collections().length*8)}];}
  function recommendations(limit=8){const person=profile(),done=new Set(completed()),favoriteItems=favorites().map(id=>lib().find(item=>item.id===id)).filter(Boolean),historyItems=history().map(value=>lib().find(item=>item.id===value.id)).filter(Boolean);const signals=[...(person.interests||[]),...favoriteItems.flatMap(item=>[...(item.topics||[]),...(item.audience||[]),item.type]),...historyItems.flatMap(item=>[...(item.topics||[]),item.book,...(item.scripture||[])])].map(value=>String(value).toLowerCase());return lib().map(item=>{const text=[item.type,item.category,item.series,item.book,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])].filter(Boolean).map(value=>String(value).toLowerCase());let score=text.filter(value=>signals.some(signal=>value.includes(signal)||signal.includes(value))).length;if(done.has(item.id))score-=5;return{item,score};}).sort((a,b)=>b.score-a.score||String(b.item.publishedAt||'').localeCompare(String(a.item.publishedAt||''))).map(value=>value.item).slice(0,limit);}
  function exportNotes(){const text=notes().map(note=>`${note.title}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}\nJournal: ${note.journal}\nPrayer: ${note.prayer}\nQuestions: ${note.questions}\nScriptures: ${note.scriptures}\n`).join('\n---\n');const blob=new Blob([text||'No saved notes.'],{type:'text/plain'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='no-labels-personal-notes.txt';link.click();URL.revokeObjectURL(link.href);}
  function decorate(){document.querySelectorAll('.unified-content-card').forEach(card=>{const link=card.querySelector('a[href]');if(!link)return;const item=lib().find(value=>value.url===link.getAttribute('href'));if(!item)return;card.dataset.contentId=item.id;if(!card.querySelector('.favorite-toggle')){const button=document.createElement('button');button.type='button';button.className='favorite-toggle';button.textContent=favorites().includes(item.id)?'★ Saved':'☆ Save';button.addEventListener('click',()=>button.textContent=toggleFavorite(item.id)?'★ Saved':'☆ Save');card.appendChild(button);}if(item.type==='Study'&&!card.querySelector('.complete-toggle')){const button=document.createElement('button');button.type='button';button.className='favorite-toggle complete-toggle';button.textContent=completed().includes(item.id)?'✓ Completed':'Mark Complete';button.addEventListener('click',()=>button.textContent=toggleCompleted(item.id)?'✓ Completed':'Mark Complete');card.appendChild(button);}});}
  function addNav(){const nav=document.querySelector('.site-header nav');if(nav&&!nav.querySelector('[href="dashboard.html"]')){const link=document.createElement('a');link.href='dashboard.html';link.textContent='My Journey';nav.insertBefore(link,nav.querySelector('.play-link'));}}

  window.NLDG_PERSONAL={profile,saveProfile,favorites,history,collections,completed,notes,prayers,plans:()=>PLANS,planState,toggleFavorite,toggleCompleted,saveNote,removeNote,addPrayer,togglePrayer,removePrayer,startPlan,markPlanDay,addToCollection,createCollection,recommendations,achievements,growth,streak,exportNotes,isFavorite:id=>favorites().includes(id)};
  const item=current();if(item)addHistory(item);saveProfile({});addNav();decorate();new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});
})();
