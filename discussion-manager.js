(function(){
 const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
 const storageKey=()=>`nldg-discussion-manager-${pageKey()}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return{}}};
 const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch{}};
 const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const clean=value=>String(value||'').replace(/\s+/g,' ').trim();
 const unique=items=>[...new Set(items.map(clean).filter(item=>item&&item.length>8))];
 const hash=text=>{let value=2166136261;for(const char of text){value^=char.charCodeAt(0);value=Math.imul(value,16777619)}return `q-${(value>>>0).toString(36)}`};
 const lessonData=()=>{
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
  if(lesson?.questions?.length)return {title:lesson.title||document.querySelector('h1')?.textContent||'Lesson',questions:unique(lesson.questions)};
  const ignored='.expanded-leader-guide,.teaching-view-panel,.print-view-panel,.v2-leader-guide,.v2-teaching-view,.v2-print-view,.teaching-notebook,.leader-resource-overlay,.scripture-study-overlay,.discussion-manager-overlay';
  const questions=[];
  document.querySelectorAll('section,article').forEach(section=>{
   if(section.closest(ignored))return;
   const heading=section.querySelector(':scope > h2,:scope > h3,:scope > h4');
   if(!heading||!/discussion|conversation|questions|talk about|consider|reflect/i.test(heading.textContent))return;
   section.querySelectorAll('li').forEach(item=>questions.push(item.textContent));
   if(!section.querySelector('li'))section.querySelectorAll('p').forEach(item=>{if(clean(item.textContent).endsWith('?'))questions.push(item.textContent)});
  });
  if(!questions.length)document.querySelectorAll('.teaching-view-panel section,.v2-teaching-view section').forEach(section=>{
   const heading=section.querySelector('h3,h4');if(!heading||!/questions/i.test(heading.textContent))return;
   section.querySelectorAll('li').forEach(item=>questions.push(item.textContent));
  });
  return {title:clean(document.querySelector('h1')?.textContent)||'Bible Study',questions:unique(questions)};
 };
 const allQuestions=(lesson,state)=>[
  ...lesson.questions.map((text,index)=>({id:hash(text),text,custom:false,order:index})),
  ...(state.custom||[]).map((item,index)=>({...item,custom:true,order:lesson.questions.length+index}))
 ];
 const itemState=(state,id)=>state.items?.[id]||{status:'open',note:''};
 const statusLabel={open:'Open',covered:'Covered','follow-up':'Follow-Up',skipped:'Skipped'};
 const summary=(lesson,state)=>{
  const groups={covered:[], 'follow-up':[], skipped:[], open:[]};
  allQuestions(lesson,state).forEach(question=>{const item=itemState(state,question.id);groups[item.status||'open'].push(`${question.text}${item.note?.trim()?`\nLeader note: ${item.note.trim()}`:''}`)});
  return [`DISCUSSION SESSION\n${lesson.title}`,...Object.entries(groups).map(([status,items])=>items.length?`${statusLabel[status].toUpperCase()}\n${items.map((item,index)=>`${index+1}. ${item}`).join('\n\n')}`:'').filter(Boolean)].join('\n\n');
 };
 const copyText=async text=>{try{await navigator.clipboard.writeText(text);return true}catch{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return ok}};
 let overlay,lastTrigger,saveTimer;
 const close=()=>{if(!overlay)return;overlay.hidden=true;document.body.classList.remove('discussion-manager-open');lastTrigger?.focus?.()};
 const open=trigger=>{lastTrigger=trigger||document.activeElement;build();overlay.hidden=false;document.body.classList.add('discussion-manager-open');overlay.querySelector('[data-discussion-close]').focus()};
 const build=()=>{
  const lesson=lessonData();
  if(overlay)overlay.remove();
  overlay=document.createElement('div');overlay.className='discussion-manager-overlay';overlay.hidden=true;
  overlay.innerHTML=`<section class="discussion-manager" role="dialog" aria-modal="true" aria-labelledby="discussion-manager-title"><header class="discussion-manager-header"><div><p class="kicker">Phase 4.6</p><h2 id="discussion-manager-title">Discussion Manager</h2><p>${escapeHtml(lesson.title)}</p></div><button type="button" data-discussion-close>Close</button></header><section class="discussion-summary"><div><strong data-discussion-addressed>0</strong><span>addressed</span></div><div><strong data-discussion-followups>0</strong><span>follow-ups</span></div><div><strong data-discussion-open>0</strong><span>still open</span></div><div class="discussion-progress"><span><i data-discussion-progress></i></span><small data-discussion-progress-label></small></div></section><nav class="discussion-filters" aria-label="Filter discussion questions"><button type="button" data-discussion-filter="all">All</button><button type="button" data-discussion-filter="open">Open</button><button type="button" data-discussion-filter="covered">Covered</button><button type="button" data-discussion-filter="follow-up">Follow-Up</button><button type="button" data-discussion-filter="skipped">Skipped</button></nav><main class="discussion-content"><section class="discussion-add"><label for="discussion-custom-question"><strong>Add a question for this group</strong><span>Custom questions remain private on this device.</span></label><div><input id="discussion-custom-question" type="text" placeholder="Type a question or issue to discuss"><button type="button" data-add-question>Add Question</button></div><span data-add-status aria-live="polite"></span></section><div class="discussion-question-list" data-question-list></div></main><footer class="discussion-manager-footer"><button type="button" data-send-followups>Send Follow-Ups to Notebook</button><button type="button" data-copy-discussion>Copy Session Summary</button><button type="button" data-reset-discussion>Start New Session</button><span data-discussion-status aria-live="polite"></span></footer></section>`;
  document.body.appendChild(overlay);
  const render=()=>{
   const state=read();const filter=state.filter||'all';const questions=allQuestions(lesson,state);const counts={open:0,covered:0,'follow-up':0,skipped:0};
   questions.forEach(question=>counts[itemState(state,question.id).status||'open']++);
   const addressed=questions.length-counts.open;const percent=questions.length?Math.round(addressed/questions.length*100):0;
   overlay.querySelector('[data-discussion-addressed]').textContent=addressed;
   overlay.querySelector('[data-discussion-followups]').textContent=counts['follow-up'];
   overlay.querySelector('[data-discussion-open]').textContent=counts.open;
   overlay.querySelector('[data-discussion-progress]').style.width=`${percent}%`;
   overlay.querySelector('[data-discussion-progress-label]').textContent=`${percent}% of questions addressed`;
   overlay.querySelectorAll('[data-discussion-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.discussionFilter===filter)));
   const visible=questions.filter(question=>filter==='all'||itemState(state,question.id).status===filter);
   const list=overlay.querySelector('[data-question-list]');
   list.innerHTML=visible.length?visible.map((question,index)=>{const item=itemState(state,question.id);return `<article class="discussion-question is-${item.status}" data-question-id="${question.id}"><header><span>${String(question.order+1).padStart(2,'0')}</span><div><h3>${escapeHtml(question.text)}</h3>${question.custom?'<small>Custom question</small>':''}</div>${question.custom?'<button type="button" data-delete-question aria-label="Delete custom question">Delete</button>':''}</header><div class="discussion-status-group" role="group" aria-label="Question status">${Object.entries(statusLabel).map(([status,label])=>`<button type="button" data-set-status="${status}" aria-pressed="${item.status===status}">${label}</button>`).join('')}</div><label><span>Private leader note</span><textarea rows="3" data-question-note placeholder="Capture a response, name, concern, insight, or next step.">${escapeHtml(item.note||'')}</textarea></label></article>`}).join(''):'<div class="discussion-empty"><strong>No questions in this view.</strong><p>Choose another filter or add a custom question.</p></div>';
   list.querySelectorAll('[data-set-status]').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('[data-question-id]');const latest=read(),items={...(latest.items||{})},current=items[card.dataset.questionId]||{note:''};items[card.dataset.questionId]={...current,status:button.dataset.setStatus};write({...latest,items,updated:Date.now()});render()}));
   list.querySelectorAll('[data-question-note]').forEach(field=>field.addEventListener('input',()=>{clearTimeout(saveTimer);const card=field.closest('[data-question-id]');const status=overlay.querySelector('[data-discussion-status]');status.textContent='Saving…';saveTimer=setTimeout(()=>{const latest=read(),items={...(latest.items||{})},current=items[card.dataset.questionId]||{status:'open'};items[card.dataset.questionId]={...current,note:field.value};write({...latest,items,updated:Date.now()});status.textContent='Notes saved.';setTimeout(()=>status.textContent='',1200)},400)}));
   list.querySelectorAll('[data-delete-question]').forEach(button=>button.addEventListener('click',()=>{const id=button.closest('[data-question-id]').dataset.questionId;if(!confirm('Delete this custom discussion question?'))return;const latest=read(),items={...(latest.items||{})};delete items[id];write({...latest,items,custom:(latest.custom||[]).filter(item=>item.id!==id),updated:Date.now()});render()}));
  };
  overlay.querySelectorAll('[data-discussion-filter]').forEach(button=>button.addEventListener('click',()=>{write({...read(),filter:button.dataset.discussionFilter});render()}));
  overlay.querySelector('[data-add-question]').addEventListener('click',()=>{const input=overlay.querySelector('#discussion-custom-question'),text=clean(input.value),status=overlay.querySelector('[data-add-status]');if(text.length<8){status.textContent='Enter a complete question.';return}const state=read(),custom=[...(state.custom||[])],id=`custom-${Date.now().toString(36)}`;custom.push({id,text});write({...state,custom,updated:Date.now()});input.value='';status.textContent='Question added.';setTimeout(()=>status.textContent='',1200);render()});
  overlay.querySelector('#discussion-custom-question').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();overlay.querySelector('[data-add-question]').click()}});
  overlay.querySelector('[data-send-followups]').addEventListener('click',()=>{const state=read();const followups=allQuestions(lesson,state).filter(question=>itemState(state,question.id).status==='follow-up');const text=followups.map((question,index)=>`${index+1}. ${question.text}${itemState(state,question.id).note?.trim()?`\n   Note: ${itemState(state,question.id).note.trim()}`:''}`).join('\n');const ok=text&&window.NLDGTeachingNotebook?.append?.('discussion',`Discussion Follow-Ups\n${text}`);const status=overlay.querySelector('[data-discussion-status]');status.textContent=ok?'Follow-ups added to Discussion Reminders.':'No follow-up questions are marked yet.';setTimeout(()=>status.textContent='',1800)});
  overlay.querySelector('[data-copy-discussion]').addEventListener('click',async()=>{await copyText(summary(lesson,read()));const status=overlay.querySelector('[data-discussion-status]');status.textContent='Session summary copied.';setTimeout(()=>status.textContent='',1400)});
  overlay.querySelector('[data-reset-discussion]').addEventListener('click',()=>{if(!confirm('Start a new discussion session? Statuses and leader notes will be cleared. Custom questions will remain.'))return;const state=read();write({...state,items:{},filter:'all',sessionStarted:Date.now(),updated:Date.now()});render();const status=overlay.querySelector('[data-discussion-status]');status.textContent='New session started.';setTimeout(()=>status.textContent='',1400)});
  overlay.querySelector('[data-discussion-close]').addEventListener('click',close);overlay.addEventListener('click',event=>{if(event.target===overlay)close()});render();
 };
 document.addEventListener('keydown',event=>{if(!overlay||overlay.hidden)return;if(event.key==='Escape'){event.preventDefault();close();return}if(event.key!=='Tab')return;const focusable=[...overlay.querySelectorAll('button,a,input,textarea,[tabindex]:not([tabindex="-1"])')].filter(node=>!node.disabled&&!node.hidden&&node.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
 const attach=panel=>{if(!panel||panel.dataset.discussionManagerReady==='true')return;panel.dataset.discussionManagerReady='true';const button=document.createElement('button');button.type='button';button.className='discussion-manager-launch';button.innerHTML='<span>Discussion Manager</span><small>Track questions, responses, and follow-up</small>';button.addEventListener('click',()=>open(button));const heading=panel.querySelector('.leader-guide-heading,.v2-leader-intro')||panel;heading.appendChild(button)};
 const find=()=>document.querySelectorAll('.expanded-leader-guide,.teaching-view-panel,.v2-leader-guide,.v2-teaching-view').forEach(attach);
 find();new MutationObserver(find).observe(document.body,{childList:true,subtree:true});
 window.NLDGDiscussionManager={open:()=>open(document.activeElement),read:()=>read(),summary:()=>summary(lessonData(),read())};
})();