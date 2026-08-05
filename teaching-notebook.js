(function(){
 const sections=[
  ['objective','Lesson Objective','What should participants understand or do by the end?'],
  ['big-idea','Big Idea','State the one truth you do not want the group to miss.'],
  ['opening','Opening and Illustration','Add your introduction, story, object lesson, or current example.'],
  ['testimony','Personal Story or Testimony','Record personal experiences that serve the passage without becoming the focus.'],
  ['main-points','Main Teaching Points','Add emphasis, transitions, explanations, and Scripture reminders.'],
  ['discussion','Discussion Reminders','Questions to emphasize, skip, revisit, or ask as follow-up.'],
  ['prayer','Prayer Requests and Closing Prayer','Capture requests and closing prayer direction.'],
  ['follow-up','Follow-Up Actions','People to contact, resources to send, or issues needing pastoral care.'],
  ['next-week','Next Lesson Preparation','Record homework, supplies, handoffs, and next-week reminders.']
 ];
 const mounted=new Map();
 const pageKey=()=>document.body.dataset.studyPage||`faith-truth-week-${new URLSearchParams(location.search).get('week')||'unknown'}`;
 const storageKey=()=>`nldg-teaching-notebook-${pageKey()}`;
 const read=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}')}catch{return{}}};
 const write=value=>{try{localStorage.setItem(storageKey(),JSON.stringify(value))}catch{}};
 const countWords=value=>(String(value||'').trim().match(/\S+/g)||[]).length;
 const formatTime=value=>value?new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(value):'Not edited yet';
 const speakerSummary=data=>['opening','testimony','main-points','discussion'].map(id=>data.notes?.[id]?.trim()).filter(Boolean).join('\n\n');
 const notify=()=>window.dispatchEvent(new CustomEvent('nldg:notebook-updated',{detail:{pageKey:pageKey(),speakerNotes:speakerSummary(read())}}));
 const append=(sectionId,text)=>{
  const allowed=sections.some(([id])=>id===sectionId);const value=String(text||'').trim();
  if(!allowed||!value)return false;
  const state=read(),notes={...(state.notes||{})},existing=String(notes[sectionId]||'').trim();
  notes[sectionId]=existing?`${existing}\n\n${value}`:value;
  const updated=Date.now();write({...state,notes,updated,cycleStarted:state.cycleStarted||updated});
  const instance=mounted.get(pageKey());
  if(instance){const field=instance.fields.find(item=>item.dataset.notebookField===sectionId);if(field)field.value=notes[sectionId];instance.paint();instance.notebook.querySelector('[data-notebook-updated]').textContent=formatTime(updated);instance.notebook.querySelector('[data-notebook-status]').textContent='Added from Scripture Study';setTimeout(()=>{if(instance.notebook.isConnected)instance.notebook.querySelector('[data-notebook-status]').textContent=''},1500)}
  notify();return true;
 };
 const attach=panel=>{
  if(!panel||panel.dataset.notebookReady==='true')return;
  panel.dataset.notebookReady='true';
  panel.querySelector('.teaching-notes,.v2-leader-card.wide:has([data-v2-teaching-notes])')?.setAttribute('hidden','');
  const notebook=document.createElement('section');
  notebook.className='teaching-notebook';
  notebook.setAttribute('aria-label','Structured teaching notebook');
  notebook.innerHTML=`<div class="teaching-notebook-head"><div><p class="kicker">Teaching Notebook</p><h3>Prepare, teach, and follow up in one place</h3><p>Everything autosaves privately on this device.</p></div><div class="teaching-notebook-meta"><strong data-notebook-words>0 words</strong><span>Last edited: <time data-notebook-updated>Not edited yet</time></span></div></div><div class="teaching-notebook-toolbar"><label><input type="checkbox" data-notebook-print> Include notebook in Teaching print</label><button type="button" data-notebook-expand>Expand All</button><button type="button" data-notebook-reset>New Teaching Cycle</button><span data-notebook-status aria-live="polite"></span></div><div class="teaching-notebook-sections">${sections.map(([id,title,prompt],index)=>`<details class="notebook-section" ${index<3?'open':''}><summary><span><small>${String(index+1).padStart(2,'0')}</small><strong>${title}</strong></span><span data-section-count="${id}">0 words</span></summary><label><span class="sr-only">${title}</span><textarea rows="5" data-notebook-field="${id}" placeholder="${prompt}"></textarea></label></details>`).join('')}</div>`;
  const launch=panel.querySelector('.presentation-launch');
  if(launch)launch.insertAdjacentElement('afterend',notebook);else panel.appendChild(notebook);
  const state=read();
  const fields=[...notebook.querySelectorAll('[data-notebook-field]')];
  fields.forEach(field=>field.value=state.notes?.[field.dataset.notebookField]||'');
  notebook.querySelector('[data-notebook-print]').checked=Boolean(state.includeInPrint);
  let saveTimer;
  const paint=()=>{
   const notes={};let total=0;
   fields.forEach(field=>{notes[field.dataset.notebookField]=field.value;const words=countWords(field.value);total+=words;notebook.querySelector(`[data-section-count="${field.dataset.notebookField}"]`).textContent=`${words} word${words===1?'':'s'}`;});
   notebook.querySelector('[data-notebook-words]').textContent=`${total} word${total===1?'':'s'}`;
   notebook.querySelector('[data-notebook-updated]').textContent=formatTime(read().updated);
   return notes;
  };
  const save=()=>{
   const notes=paint();const updated=Date.now();
   write({...read(),notes,includeInPrint:notebook.querySelector('[data-notebook-print]').checked,updated,cycleStarted:read().cycleStarted||updated});
   notebook.querySelector('[data-notebook-updated]').textContent=formatTime(updated);
   notebook.querySelector('[data-notebook-status]').textContent='Saved';
   notify();setTimeout(()=>notebook.querySelector('[data-notebook-status]').textContent='',1200);
  };
  fields.forEach(field=>field.addEventListener('input',()=>{notebook.querySelector('[data-notebook-status]').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(save,450)}));
  notebook.querySelector('[data-notebook-print]').addEventListener('change',save);
  notebook.querySelector('[data-notebook-expand]').addEventListener('click',event=>{const details=[...notebook.querySelectorAll('details')];const shouldOpen=details.some(item=>!item.open);details.forEach(item=>item.open=shouldOpen);event.currentTarget.textContent=shouldOpen?'Collapse All':'Expand All'});
  notebook.querySelector('[data-notebook-reset]').addEventListener('click',()=>{if(!confirm('Start a new teaching cycle and clear this lesson notebook?'))return;fields.forEach(field=>field.value='');write({notes:{},includeInPrint:false,updated:Date.now(),cycleStarted:Date.now()});notebook.querySelector('[data-notebook-print]').checked=false;paint();notebook.querySelector('[data-notebook-status]').textContent='New cycle started.';notify()});
  mounted.set(pageKey(),{notebook,fields,paint});paint();
 };
 window.NLDGTeachingNotebook={read:()=>read(),speakerNotes:()=>speakerSummary(read()),append};
 const find=()=>document.querySelectorAll('.teaching-view-panel,.v2-teaching-view').forEach(attach);
 find();new MutationObserver(find).observe(document.body,{childList:true,subtree:true});
})();