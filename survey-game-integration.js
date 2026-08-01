(()=>{
if(window.NLDG_SURVEY_GAME_INTEGRATION_LOADED)return;
window.NLDG_SURVEY_GAME_INTEGRATION_LOADED=true;
const item={id:'bible-survey-showdown',type:'Game',title:'Bible Survey Showdown',description:'A presentation-ready top-answer team game with Bible and faith questions, answer reveals, three strikes, steals, round multipliers, scoring, sound, and fullscreen host controls.',url:'bible-survey-game.html',category:'No Labels Games',series:'No Labels Games',scripture:[],book:'Various',topics:['Bible game','team game','church game','family game','youth game','top answers','survey showdown','presentation mode'],audience:['Preschool','Kids','Teens','Adults','Families','Churches','Small Groups'],difficulty:'All Levels',duration:30,featured:true,status:'published',publishedAt:'2026-08-01',updatedAt:'2026-08-01'};

function register(){
 if(!window.NLDG_LIBRARY)return false;
 if(!window.NLDG_LIBRARY.some(existing=>existing.id===item.id))window.NLDG_LIBRARY.push(item);
 window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(entry=>entry.type==='Study'&&entry.status==='published');
 window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(entry=>entry.status==='published');
 window.dispatchEvent(new Event('nldg-library-ready'));
 return true;
}

function gameHref(){
 const group=new URLSearchParams(location.search).get('group');
 return `bible-survey-game.html${['preschool','kids','teens','adults','family'].includes(group)?`?group=${encodeURIComponent(group)}`:''}`;
}

function installGameCard(){
 const library=document.querySelector('#game-library .portal-grid');
 if(!library||library.querySelector('[data-survey-showdown]'))return;
 const card=document.createElement('article');
 card.className='portal-card featured';
 card.dataset.gameCategory='teams';
 card.dataset.surveyShowdown='true';
 card.innerHTML=`<div class="game-badges"><span>New</span><span>2 Teams</span></div><span>🔔</span><h3>Bible Survey Showdown</h3><p>Reveal top Bible and faith answers, build the round bank, survive three strikes, and complete the steal.</p><small>All Ages • 20–40 min</small><a href="${gameHref()}">Play →</a>`;
 library.prepend(card);
 document.querySelectorAll('[data-game-filter]').forEach(button=>{
  button.addEventListener('click',()=>{
   const filter=button.dataset.gameFilter;
   card.hidden=filter!=='all'&&filter!=='teams';
  });
 });
}

function installQuickLaunch(){
 const strip=document.querySelector('.quick-launch-strip');
 if(!strip||strip.querySelector('[data-survey-showdown]'))return;
 const link=document.createElement('a');
 link.dataset.surveyShowdown='true';
 link.href=gameHref();
 link.textContent='🔔 Bible Survey Showdown';
 strip.appendChild(link);
}

function install(){
 installGameCard();
 installQuickLaunch();
 register();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
let attempts=0;
const timer=setInterval(()=>{install();attempts++;if(register()||attempts>40)clearInterval(timer)},125);
})();
