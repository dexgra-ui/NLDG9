(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  const lesson=series?.lessons?.find(item=>item.week===week);
  if(!lesson||lesson.status!=='complete')return;
  const article=document.querySelector('.series-lesson');
  const toolbar=document.querySelector('.series-lesson-toolbar');
  if(!article||!toolbar)return;
  const key=`nldg-leader-week-${week}`;
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}};
  const write=value=>localStorage.setItem(key,JSON.stringify(value));
  const state=read();
  const button=document.createElement('button');
  button.className='leader-toggle';button.type='button';button.textContent='Leader Mode';button.setAttribute('aria-expanded','false');toolbar.append(button);
  const panel=document.createElement('section');
  panel.className='leader-mode-panel';panel.hidden=true;
  const questions=(lesson.questions||[]).map((q,i)=>`<li><strong>${i+1}.</strong> ${q}</li>`).join('');
  panel.innerHTML=`<div class="leader-heading"><div><p class="kicker">Leader Mode</p><h2>Teach Week ${week} with confidence</h2><p>Preparation, pacing, notes, attendance, and follow-up stay on this device.</p></div><button id="leader-print" type="button">Print Guide</button></div>
  <div class="leader-grid">
    <article><h3>Preparation Checklist</h3><label><input type="checkbox" data-check="pray"> Pray over the lesson</label><label><input type="checkbox" data-check="read"> Read the Scripture</label><label><input type="checkbox" data-check="review"> Review discussion questions</label><label><input type="checkbox" data-check="materials"> Prepare materials</label></article>
    <article><h3>Suggested Timeline</h3><ol><li>Welcome and opening prayer · 5 min</li><li>Scripture and introduction · 10 min</li><li>Teaching sections · 20 min</li><li>Discussion · 10 min</li><li>Application and prayer · 5 min</li></ol><div class="leader-timer"><strong id="leader-clock">50:00</strong><button id="timer-start" type="button">Start</button><button id="timer-reset" type="button">Reset</button></div></article>
    <article><h3>Key Takeaways</h3><ul>${(lesson.sections||[]).slice(0,4).map(s=>`<li>${s.heading}</li>`).join('')}</ul></article>
    <article><h3>Discussion Guide</h3><ol>${questions}</ol></article>
  </div>
  <div class="leader-notes-grid"><label>Teaching notes<textarea id="leader-notes" placeholder="Illustrations, emphasis, or reminders"></textarea></label><label>Attendance and follow-up<textarea id="leader-attendance" placeholder="Names, prayer needs, and follow-up"></textarea></label></div>`;
  const resources=article.querySelector('.lesson-resources');
  article.insertBefore(panel,resources||article.firstChild);
  panel.querySelectorAll('[data-check]').forEach(input=>{input.checked=Boolean(state.checks?.[input.dataset.check]);input.addEventListener('change',()=>{const next=read();next.checks={...(next.checks||{}),[input.dataset.check]:input.checked};write(next);});});
  const notes=panel.querySelector('#leader-notes'),attendance=panel.querySelector('#leader-attendance');notes.value=state.notes||'';attendance.value=state.attendance||'';
  [notes,attendance].forEach(field=>field.addEventListener('input',()=>{const next=read();next[field===notes?'notes':'attendance']=field.value;write(next);}));
  button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));button.textContent=panel.hidden?'Leader Mode':'Close Leader Mode';if(!panel.hidden)panel.scrollIntoView({behavior:'smooth',block:'start'});});
  panel.querySelector('#leader-print').addEventListener('click',()=>window.print());
  let seconds=3000,timer=null;const clock=panel.querySelector('#leader-clock');const paint=()=>clock.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  panel.querySelector('#timer-start').addEventListener('click',e=>{if(timer){clearInterval(timer);timer=null;e.target.textContent='Start';return;}e.target.textContent='Pause';timer=setInterval(()=>{if(seconds<=0){clearInterval(timer);timer=null;e.target.textContent='Start';return;}seconds--;paint();},1000);});
  panel.querySelector('#timer-reset').addEventListener('click',()=>{if(timer)clearInterval(timer);timer=null;seconds=3000;paint();panel.querySelector('#timer-start').textContent='Start';});paint();
})();