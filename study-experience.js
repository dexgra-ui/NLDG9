(function(){
  const studyId=document.body.dataset.studyPage;
  if(!studyId)return;
  const studies=(window.NLDG_STUDIES||[]).filter(study=>study.status==='published');
  const study=studies.find(item=>item.id===studyId);
  if(!study)return;

  const STORAGE_KEY='nldg-study-state';
  const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch(error){return {};}};
  const writeState=state=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(error){console.warn('Study state could not be saved.',error);}};
  const updateStudy=updates=>{const state=readState();state[studyId]={...(state[studyId]||{}),...updates,updated:Date.now()};writeState(state);return state[studyId];};
  const current=readState()[studyId]||{};
  const main=document.querySelector('main');
  const hero=main?.querySelector('.page-hero');
  if(!main||!hero)return;

  const experience=document.createElement('section');
  experience.className='study-experience-bar';
  experience.setAttribute('aria-label','Study progress and controls');
  experience.innerHTML=`<div class="study-experience-top"><div><strong>Your Study Progress</strong><div id="study-progress-label">${current.completed?'Completed':`${Math.round(current.progress||0)}% complete`}</div></div><div class="study-experience-actions"><button id="favorite-study" type="button" aria-pressed="${current.favorite?'true':'false'}">${current.favorite?'★ Favorited':'☆ Favorite'}</button><button id="complete-study" type="button">${current.completed?'Mark Incomplete':'Mark Complete'}</button></div></div><div class="study-progress-track" aria-hidden="true"><div id="study-progress-fill" class="study-progress-fill"></div></div>`;
  hero.insertAdjacentElement('afterend',experience);

  const progressFill=document.getElementById('study-progress-fill');
  const progressLabel=document.getElementById('study-progress-label');
  const favoriteButton=document.getElementById('favorite-study');
  const completeButton=document.getElementById('complete-study');
  const setProgress=value=>{const state=readState()[studyId]||{};const progress=state.completed?100:Math.max(0,Math.min(99,Math.round(value)));progressFill.style.width=`${progress}%`;progressLabel.textContent=state.completed?'Completed':`${progress}% complete`;};
  setProgress(current.progress||0);
  let scrollTimer;
  const trackProgress=()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{const doc=document.documentElement;const available=Math.max(1,doc.scrollHeight-window.innerHeight);const previousState=readState()[studyId]||{};const previous=previousState.progress||0;const measured=Math.max(previous,(window.scrollY/available)*100);const progress=previousState.completed?100:Math.min(99,measured);const saved=updateStudy({progress,url:study.url,title:study.title});setProgress(saved.progress);localStorage.setItem('nldg-last-study',JSON.stringify({id:study.id,title:study.title,url:study.url,progress:Math.round(saved.progress||0),updated:Date.now()}));},150);};
  window.addEventListener('scroll',trackProgress,{passive:true});
  favoriteButton.addEventListener('click',()=>{const next=!(readState()[studyId]?.favorite);updateStudy({favorite:next,url:study.url,title:study.title});favoriteButton.setAttribute('aria-pressed',String(next));favoriteButton.textContent=next?'★ Favorited':'☆ Favorite';});
  completeButton.addEventListener('click',()=>{const next=!(readState()[studyId]?.completed);updateStudy({completed:next,progress:next?100:Math.min(99,readState()[studyId]?.progress||0),url:study.url,title:study.title});completeButton.textContent=next?'Mark Incomplete':'Mark Complete';setProgress(next?100:readState()[studyId]?.progress||0);});

  const content=document.querySelector('.lesson-wrap,.study-content,.wof-study-content,.mof-study-content,.mf-study-content,article');
  if(content){
    const notes=document.createElement('section');notes.className='study-notes';notes.innerHTML=`<p class="kicker">Personal Notes</p><h2>What is God showing you?</h2><p>Your notes stay on this device.</p><label for="study-notes-input" class="sr-only">Personal study notes</label><textarea id="study-notes-input" placeholder="Write your reflections, questions, prayers, or next steps here."></textarea><div class="study-experience-actions"><button id="save-study-notes" type="button">Save Notes</button><span id="notes-status" class="notes-status" aria-live="polite"></span></div>`;
    const actions=content.querySelector('.lesson-actions');if(actions)actions.insertAdjacentElement('beforebegin',notes);else content.appendChild(notes);
    const textarea=document.getElementById('study-notes-input');const status=document.getElementById('notes-status');textarea.value=current.notes||'';
    const saveNotes=()=>{updateStudy({notes:textarea.value,url:study.url,title:study.title});status.textContent='Notes saved.';setTimeout(()=>status.textContent='',1800);};
    document.getElementById('save-study-notes').addEventListener('click',saveNotes);textarea.addEventListener('input',()=>{status.textContent='Unsaved changes';});
  }

  const seriesStudies=studies.filter(item=>item.series===study.series);
  const hasCustomNavigation=Boolean(content?.querySelector('.lesson-actions,.series-navigation,[data-series-navigation="custom"]'));
  if(seriesStudies.length>1&&content&&!hasCustomNavigation){const index=seriesStudies.findIndex(item=>item.id===study.id);const previous=seriesStudies[index-1];const next=seriesStudies[index+1];const nav=document.createElement('nav');nav.className='series-navigation';nav.setAttribute('aria-label',`${study.series} series navigation`);nav.innerHTML=`${previous?`<a class="button secondary" href="${previous.url}">← ${previous.title}</a>`:'<span></span>'}<div class="series-current"><small>${study.series}</small><strong>${index+1} of ${seriesStudies.length}</strong></div>${next?`<a class="button secondary" href="${next.url}">${next.title} →</a>`:'<span></span>'}`;content.appendChild(nav);}

  const addStylesheet=href=>{if([...document.styleSheets].some(sheet=>sheet.href?.includes(href.split('?')[0])))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);};
  const loadScript=src=>new Promise((resolve,reject)=>{const existing=[...document.scripts].find(script=>script.src.includes(src.split('?')[0]));if(existing){resolve();return;}const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);});
  addStylesheet('expanded-leader-guide.css?v=1.1.0');
  addStylesheet('teaching-dashboard.css?v=1.0.0');
  addStylesheet('teaching-notebook.css?v=1.0.0');
  addStylesheet('leader-resource-drawer.css?v=1.0.0');
  addStylesheet('scripture-study-panel.css?v=1.0.0');
  addStylesheet('discussion-manager.css?v=1.0.0');
  addStylesheet('print-center.css?v=1.0.0');
  addStylesheet('teaching-analytics.css?v=1.0.0');
  loadScript('leader-guide-data.js?v=1.1.1').then(()=>loadScript('expanded-leader-guide.js?v=1.1.0')).then(()=>loadScript('teaching-analytics.js?v=1.0.0')).then(()=>loadScript('teaching-dashboard.js?v=1.1.0')).then(()=>loadScript('teaching-notebook.js?v=1.1.0')).then(()=>loadScript('scripture-study-data.js?v=7.2.0')).then(()=>loadScript('scripture-study-panel.js?v=1.0.0')).then(()=>loadScript('discussion-manager.js?v=1.0.0')).then(()=>loadScript('leader-resource-drawer.js?v=1.0.0')).then(()=>loadScript('print-center.js?v=1.0.0')).then(()=>loadScript('presentation-mode.js?v=1.1.0')).catch(error=>console.warn('Study teaching tools could not load.',error));
})();