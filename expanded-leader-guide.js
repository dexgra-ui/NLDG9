(function(){
 const studyId=document.body.dataset.studyPage;
 if(!studyId)return;
 const content=document.querySelector('.lesson-wrap,.study-content,.wof-study-content,.mof-study-content,.mf-study-content,article');
 if(!content)return;
 const guide=window.NLDG_LEADER_GUIDES?.[studyId];
 const existing=[...content.querySelectorAll('section')].find(section=>/leader|mentor notes/i.test(section.querySelector('h2')?.textContent||''));
 const central=[...content.querySelectorAll('section')].find(section=>/central biblical truth|big idea|main truth/i.test(section.querySelector('h2')?.textContent||''));
 const questionSection=[...content.querySelectorAll('section')].find(section=>/conversation|discussion questions/i.test(section.querySelector('h2')?.textContent||''));
 const practiceSection=[...content.querySelectorAll('section')].find(section=>/live it|application|weekly challenge/i.test(section.querySelector('h2')?.textContent||''));
 const pageTitle=document.querySelector('h1')?.textContent?.trim()||document.body.dataset.studyTitle||'Study';
 const text=value=>String(value||'').replace(/[<>]/g,char=>char==='<'?'&lt;':'&gt;');
 const list=items=>`<ul>${(items||[]).map(item=>`<li>${text(item)}</li>`).join('')}</ul>`;
 const fallback={
  bigIdea:central?.textContent.replace(central.querySelector('h2')?.textContent||'','').trim()||`Help the group understand and faithfully apply ${pageTitle}.`,
  objectives:['Understand the central biblical truth','Discuss the passage honestly and respectfully','Choose one faithful next step'],
  background:'Read the primary passage in its surrounding context. Note the speaker, audience, setting, repeated words, movement of the argument, and how the passage fits the larger story of Scripture.',
  theology:['What this passage reveals about God','What this passage reveals about people','How grace leads to faithful response'],
  connections:['Read the surrounding chapter','Trace one major theme elsewhere in Scripture','Connect the lesson to the life and teaching of Jesus'],
  outline:[...content.querySelectorAll('section>h2')].map(h=>h.textContent.trim()).filter(title=>!/notes|prayer|questions|consider/i.test(title)).slice(0,5),
  coaching:['Ask open questions before giving conclusions','Invite quieter participants without forcing disclosure','Return to Scripture when opinions begin to replace the text'],
  misunderstandings:['Application should flow from the passage rather than personal preference','Grace does not remove truth, responsibility, or wise boundaries','A leader may say, “I do not know; let us study that carefully.”'],
  application:[...practiceSection?.querySelectorAll('h3,p')||[]].map(node=>node.textContent.trim()).filter(Boolean).slice(0,3),
  prayer:'Pray that the group understands the passage, responds to the Holy Spirit, and practices one concrete act of obedience.'
 };
 const data={...fallback,...guide};
 const panel=document.createElement('section');
 panel.className='expanded-leader-guide';
 panel.id='expanded-leader-guide';
 panel.hidden=true;
 panel.innerHTML=`
 <div class="leader-guide-heading"><div><p class="kicker">Expanded Leader Guide</p><h2>${text(pageTitle)}</h2><p>Preparation, teaching depth, discussion coaching, and application for the facilitator.</p></div><span class="leader-only-badge">Leader view</span></div>
 <div class="leader-guide-grid">
  <section><h3>Leader snapshot</h3><p><strong>Big idea:</strong> ${text(data.bigIdea)}</p><h4>Learning objectives</h4>${list(data.objectives)}</section>
  <section><h3>Before you teach</h3><p>Read the main passage slowly more than once. Ask what God is correcting, strengthening, or inviting in you before you lead anyone else.</p><p><strong>Leader posture:</strong> Transformation matters more than finishing every question.</p></section>
  <section class="leader-guide-wide"><h3>Biblical and historical background</h3><p>${text(data.background)}</p></section>
  <section><h3>Theological themes</h3>${list(data.theology)}</section>
  <section><h3>Scripture connections</h3>${list(data.connections)}</section>
  <section class="leader-guide-wide"><h3>Ready-to-teach outline</h3><ol>${(data.outline||[]).map(item=>`<li>${text(item)}</li>`).join('')}</ol></section>
  <section><h3>Discussion coaching</h3>${list(data.coaching)}${questionSection?'<p class="leader-tip">Use the study’s existing questions in observation, interpretation, application, and mission order.</p>':''}</section>
  <section><h3>Common misunderstandings</h3>${list(data.misunderstandings)}</section>
  <section><h3>Application pathways</h3>${list(data.application?.length?data.application:['Choose one specific faithful action for this week.'])}</section>
  <section><h3>Prayer focus</h3><p>${text(data.prayer)}</p></section>
  <section class="leader-guide-wide leader-reflection"><h3>Leader reflection</h3><label>What challenged me before I teach?<textarea rows="3" data-leader-note="challenge"></textarea></label><label>Who may need special care during this discussion?<textarea rows="3" data-leader-note="care"></textarea></label><label>How will I help the group move from information to obedience?<textarea rows="3" data-leader-note="obedience"></textarea></label><button type="button" class="button secondary" id="save-leader-notes">Save Leader Notes</button><span id="leader-notes-status" aria-live="polite"></span></section>
  <section class="leader-guide-wide greatest-commandments"><h3>Living the Greatest Commandments</h3><p><strong>Love God:</strong> How should this passage deepen worship, trust, repentance, or obedience?</p><p><strong>Love your neighbor:</strong> How should this passage change the way we see, serve, protect, forgive, or tell the truth to others?</p></section>
 </div>`;
 const target=existing||questionSection||practiceSection||content.querySelector('.lesson-actions');
 if(target)target.insertAdjacentElement('beforebegin',panel);else content.appendChild(panel);
 if(existing)existing.classList.add('condensed-leader-notes');
 const controls=document.createElement('div');
 controls.className='study-view-controls';
 controls.setAttribute('aria-label','Study view');
 controls.innerHTML='<button type="button" class="active" data-study-view="participant" aria-pressed="true">Participant Guide</button><button type="button" data-study-view="leader" aria-pressed="false">Expanded Leader Guide</button>';
 const hero=document.querySelector('.study-experience-bar')||document.querySelector('.page-hero');
 hero?.insertAdjacentElement('afterend',controls);
 const participantSections=[...content.children].filter(node=>node!==panel&&node!==existing&&node.tagName!=='SCRIPT');
 const buttons=[...controls.querySelectorAll('button')];
 const setView=view=>{
  const leader=view==='leader';
  panel.hidden=!leader;
  participantSections.forEach(node=>node.hidden=leader);
  if(existing)existing.hidden=true;
  buttons.forEach(button=>{const active=button.dataset.studyView===view;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  localStorage.setItem('nldg-study-view',view);
  if(leader)panel.scrollIntoView({behavior:'smooth',block:'start'});
 };
 buttons.forEach(button=>button.addEventListener('click',()=>setView(button.dataset.studyView)));
 const saved=localStorage.getItem('nldg-study-view');
 if(saved==='leader')setView('leader');
 const noteKey=`nldg-leader-notes-${studyId}`;
 try{const notes=JSON.parse(localStorage.getItem(noteKey)||'{}');panel.querySelectorAll('[data-leader-note]').forEach(field=>field.value=notes[field.dataset.leaderNote]||'');}catch(error){}
 panel.querySelector('#save-leader-notes')?.addEventListener('click',()=>{const notes={};panel.querySelectorAll('[data-leader-note]').forEach(field=>notes[field.dataset.leaderNote]=field.value);localStorage.setItem(noteKey,JSON.stringify(notes));const status=panel.querySelector('#leader-notes-status');status.textContent='Leader notes saved on this device.';setTimeout(()=>status.textContent='',2000);});
})();