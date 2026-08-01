(()=>{
if(window.NLDG_SURVEY_GAME_INTEGRATION_LOADED)return;
window.NLDG_SURVEY_GAME_INTEGRATION_LOADED=true;
const item={id:'bible-survey-showdown',type:'Game',title:'Bible Survey Showdown',description:'A laptop-hosted two-screen church game. Keep the private answer key and controls on the laptop while the audience board appears on a connected TV or projector.',url:'bible-survey-host.html',category:'No Labels Games',series:'No Labels Games',scripture:[],book:'Various',topics:['Bible game','team game','church game','family game','youth game','top answers','survey showdown','laptop game','projector game','two-screen game'],audience:['Preschool','Kids','Teens','Adults','Families','Churches','Small Groups'],difficulty:'All Levels',duration:30,featured:true,status:'published',publishedAt:'2026-08-01',updatedAt:'2026-08-01'};

function register(){
 if(!window.NLDG_LIBRARY)return false;
 const existing=window.NLDG_LIBRARY.find(entry=>entry.id===item.id);
 if(existing)Object.assign(existing,item);else window.NLDG_LIBRARY.push(item);
 window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(entry=>entry.type==='Study'&&entry.status==='published');
 window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(entry=>entry.status==='published');
 window.dispatchEvent(new Event('nldg-library-ready'));
 return true;
}

function gameHref(){
 const group=new URLSearchParams(location.search).get('group');
 return `bible-survey-host.html${['preschool','kids','teens','adults','family'].includes(group)?`?group=${encodeURIComponent(group)}`:''}`;
}

function installGameCard(){
 const library=document.querySelector('#game-library .portal-grid');
 if(!library)return;
 let card=library.querySelector('[data-survey-showdown]');
 if(!card){card=document.createElement('article');card.className='portal-card featured';card.dataset.gameCategory='teams';card.dataset.surveyShowdown='true';library.prepend(card)}
 card.innerHTML=`<div class="game-badges"><span>Laptop Required</span><span>TV / Projector</span></div><span>💻</span><h3>Bible Survey Showdown</h3><p>Use private host controls and the full answer key on a laptop while teams see only the audience board on a second display.</p><small>2 Teams • Laptop + second display • 20–40 min</small><a href="${gameHref()}">Open Laptop Host →</a>`;
 document.querySelectorAll('[data-game-filter]').forEach(button=>{
  button.addEventListener('click',()=>{
   const filter=button.dataset.gameFilter;
   card.hidden=filter!=='all'&&filter!=='teams';
  });
 });
}

function installQuickLaunch(){
 const strip=document.querySelector('.quick-launch-strip');
 if(!strip)return;
 let link=strip.querySelector('[data-survey-showdown]');
 if(!link){link=document.createElement('a');link.dataset.surveyShowdown='true';strip.appendChild(link)}
 link.href=gameHref();
 link.textContent='💻 Bible Survey Showdown • Laptop';
 link.setAttribute('aria-label','Open Bible Survey Showdown laptop host. Laptop and second display required.');
}

function installRequirementNote(){
 const library=document.getElementById('game-library');
 const card=document.querySelector('[data-survey-showdown]');
 if(!library||!card||document.querySelector('[data-survey-laptop-note]'))return;
 const note=document.createElement('p');
 note.dataset.surveyLaptopNote='true';
 note.className='stability-note';
 note.innerHTML='<strong>Bible Survey Showdown device requirement</strong><span>This game requires a laptop or desktop connected to a TV or projector in extended-display mode. Phones and tablets are not supported as the host device.</span>';
 library.insertBefore(note,library.querySelector('.section-heading'));
}

function install(){installGameCard();installQuickLaunch();installRequirementNote();register()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
let attempts=0;
const timer=setInterval(()=>{install();attempts++;if(register()||attempts>40)clearInterval(timer)},125);
})();
