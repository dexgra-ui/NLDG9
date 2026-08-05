(function(){
 const steps=[['opening-prayer','Opening Prayer'],['icebreaker','Icebreaker'],['scripture','Scripture Reading'],['teaching','Teaching'],['discussion','Discussion'],['challenge','Weekly Challenge'],['closing-prayer','Closing Prayer']];
 const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
 const storageKey=()=>`nldg-teaching-dashboard-${pageKey()}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return{}}};
 const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch{}};
 const attach=panel=>{
  if(!panel||panel.dataset.dashboardReady==='true')return;
  panel.dataset.dashboardReady='true';
  const state=read();
  let cycleId=state.cycleId||Date.now();
  let sessionStartedAt=state.sessionStartedAt||null;
  let completionRecorded=Boolean(state.completionRecorded||state.completedAt);
  const dashboard=document.createElement('section');
  dashboard.className='teaching-dashboard';
  dashboard.setAttribute('aria-label','Teaching session dashboard');
  dashboard.innerHTML=`<div class="teaching-dashboard-head"><div><p class="kicker">Teaching Dashboard</p><h3>Lead this session step by step</h3><p>Your checklist and session progress stay on this device.</p></div><div class="teaching-dashboard-progress"><strong data-dashboard-percent>0%</strong><span data-dashboard-count>0 of ${steps.length} complete</span></div></div><div class="teaching-dashboard-track" aria-hidden="true"><span data-dashboard-fill></span></div><div class="teaching-dashboard-grid">${steps.map(([id,label],index)=>`<label class="teaching-step"><input type="checkbox" data-dashboard-step="${id}"><span><small>Step ${index+1}</small><strong>${label}</strong></span></label>`).join('')}</div><div class="teaching-dashboard-footer"><div><strong data-dashboard-resume>Begin with Opening Prayer</strong><span data-dashboard-status aria-live="polite"></span></div><button type="button" data-dashboard-reset>Reset Session</button></div>`;
  panel.prepend(dashboard);
  const inputs=[...dashboard.querySelectorAll('[data-dashboard-step]')];
  inputs.forEach(input=>input.checked=Boolean(state.completed?.includes(input.dataset.dashboardStep)));
  const paint=(recordActivity=false)=>{
   const previous=read();
   const completed=inputs.filter(input=>input.checked).map(input=>input.dataset.dashboardStep);
   const count=completed.length;
   const percent=Math.round((count/steps.length)*100);
   const complete=count===steps.length;
   if(recordActivity&&count>0&&!sessionStartedAt){sessionStartedAt=Date.now();window.NLDGTeachingAnalytics?.track?.('session-started',{cycleId})}
   let completedAt=previous.completedAt||null;
   if(complete&&!completionRecorded){completionRecorded=true;completedAt=Date.now();if(recordActivity)window.NLDGTeachingAnalytics?.track?.('session-completed',{cycleId,progress:100})}
   dashboard.querySelector('[data-dashboard-percent]').textContent=`${percent}%`;
   dashboard.querySelector('[data-dashboard-count]').textContent=`${count} of ${steps.length} complete`;
   dashboard.querySelector('[data-dashboard-fill]').style.width=`${percent}%`;
   const next=steps.find(([id])=>!completed.includes(id));
   dashboard.querySelector('[data-dashboard-resume]').textContent=next?`Resume with ${next[1]}`:'Session checklist complete';
   dashboard.classList.toggle('is-complete',complete);
   write({...previous,completed,progress:percent,updated:Date.now(),completedAt,completionRecorded,sessionStartedAt,cycleId});
  };
  inputs.forEach(input=>input.addEventListener('change',()=>{paint(true);const status=dashboard.querySelector('[data-dashboard-status]');status.textContent='Progress saved.';setTimeout(()=>status.textContent='',1200)}));
  dashboard.querySelector('[data-dashboard-reset]').addEventListener('click',()=>{const previous=read();if(previous.progress||previous.sessionStartedAt||previous.completedAt)window.NLDGTeachingAnalytics?.track?.('session-reset',{cycleId});inputs.forEach(input=>input.checked=false);cycleId=Date.now();sessionStartedAt=null;completionRecorded=false;write({completed:[],progress:0,updated:Date.now(),completedAt:null,completionRecorded:false,sessionStartedAt:null,cycleId});paint(false);const status=dashboard.querySelector('[data-dashboard-status]');status.textContent='New teaching session ready.';setTimeout(()=>status.textContent='',1500)});
  paint(false);
 };
 const findPanels=()=>document.querySelectorAll('.teaching-view-panel,.v2-teaching-view').forEach(attach);
 findPanels();
 new MutationObserver(findPanels).observe(document.body,{childList:true,subtree:true});
 const addStylesheet=href=>{if([...document.styleSheets].some(sheet=>sheet.href?.includes(href.split('?')[0])))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);};
 const loadScript=src=>{if([...document.scripts].some(script=>script.src.includes(src.split('?')[0])))return;const script=document.createElement('script');script.src=src;document.body.appendChild(script);};
 addStylesheet('presentation-mode.css?v=1.0.0');
 loadScript('presentation-mode.js?v=1.0.0');
})();