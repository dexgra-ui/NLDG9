(function(){
  const api=window.NLDG_PERSONAL;
  if(!api)return;
  const library=()=>window.NLDG_CONTENT||[];
  const byId=id=>library().find(item=>item.id===id);
  const defaultCard=item=>`<article class="unified-content-card"><span class="content-type">${item.type}</span><h3>${item.title}</h3><p>${item.description||''}</p><a href="${item.url}">Open resource →</a></article>`;
  const card=item=>(window.NLDG_CONTENT_CARD||defaultCard)(item);
  const empty=message=>`<article class="dashboard-empty"><p>${message}</p></article>`;
  const badges=['First Study Completed','Seven-Day Reading Streak','Scripture Explorer','Prayer Warrior','Faithful Learner','Family Leader'];
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  let bookLibraryPromise=null;

  function profilePhoto(profile){
    const image=document.getElementById('profile-photo-preview');
    const placeholder=document.getElementById('profile-photo-placeholder');
    if(profile.photo){image.src=profile.photo;image.hidden=false;placeholder.hidden=true;}
    else{image.hidden=true;placeholder.hidden=false;}
  }

  function ensureBookProgressSection(){
    const current=document.getElementById('book-progress-grid');
    if(current)return current.closest('section');
    const growth=document.getElementById('growth-tracker')?.closest('section');
    if(!growth)return null;
    const section=document.createElement('section');
    section.className='book-progress-section';
    section.innerHTML='<div class="section-heading"><p class="kicker">Book-by-Book Progress</p><h2>Your journey through all 66 books</h2><p>Completion from each Book-by-Book study stays on this device and now appears here in one place.</p></div><div id="book-progress-summary" class="dashboard-stats" aria-label="Book-by-Book Bible study progress"></div><div id="book-progress-grid" class="unified-content-grid"></div>';
    growth.insertAdjacentElement('afterend',section);
    return section;
  }

  function loadBookLibrary(){
    if(bookLibraryPromise)return bookLibraryPromise;
    bookLibraryPromise=fetch('book-by-book.html')
      .then(response=>{
        if(!response.ok)throw new Error(`Book library request failed with ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,'text/html');
        const books=[...doc.querySelectorAll('.book-card')].map(card=>{
          const title=card.querySelector('h2')?.textContent?.trim()||'';
          const label=card.querySelector('span')?.textContent||'';
          const lessons=Number(label.match(/·\s*(\d+)\s+lessons?/i)?.[1]||0);
          const url=card.querySelector('a[href]')?.getAttribute('href')?.trim()||'';
          if(!title||!lessons||!/^[a-z0-9-]+\.html$/i.test(url))return null;
          const slug=url.replace(/\.html$/i,'');
          return {title,lessons,url,key:url==='james-series.html'?'nldg-series-james':`nldg-book-${slug}`};
        }).filter(Boolean);
        if(!books.length)throw new Error('Book library contained no study cards.');
        return books;
      })
      .catch(error=>{bookLibraryPromise=null;throw error;});
    return bookLibraryPromise;
  }

  function bookProgress(book){
    let completed=[];
    try{
      const saved=JSON.parse(localStorage.getItem(book.key)||'{"completed":[]}');
      completed=Array.isArray(saved.completed)?saved.completed:[];
    }catch(e){completed=[];}
    const valid=new Set(completed.map(Number).filter(value=>Number.isInteger(value)&&value>=1&&value<=book.lessons));
    let next=1;
    while(next<=book.lessons&&valid.has(next))next+=1;
    const count=valid.size;
    const complete=count>=book.lessons;
    const parameter=book.url==='james-series.html'?'week':'lesson';
    return {...book,completed:count,complete,nextUrl:complete?book.url:`${book.url}?${parameter}=${Math.min(next,book.lessons)}`};
  }

  async function renderBookProgress(){
    const section=ensureBookProgressSection();
    if(!section)return;
    const summary=section.querySelector('#book-progress-summary');
    const grid=section.querySelector('#book-progress-grid');
    if(!summary||!grid)return;
    if(!summary.childElementCount)summary.innerHTML='<article><span>Book Library</span><strong>Loading…</strong></article>';
    if(!grid.childElementCount)grid.innerHTML=empty('Loading your Book-by-Book progress…');
    try{
      const books=await loadBookLibrary();
      const progress=books.map(bookProgress);
      const started=progress.filter(item=>item.completed>0);
      const finished=progress.filter(item=>item.complete);
      const totalLessons=progress.reduce((sum,item)=>sum+item.lessons,0);
      const completedLessons=progress.reduce((sum,item)=>sum+item.completed,0);
      const percent=totalLessons?Math.round((completedLessons/totalLessons)*100):0;
      summary.innerHTML=`<article><span>Books Started</span><strong>${started.length} of ${books.length}</strong></article><article><span>Books Completed</span><strong>${finished.length}</strong></article><article><span>Lessons Completed</span><strong>${completedLessons} of ${totalLessons}</strong></article><article><span>Overall Progress</span><strong>${percent}%</strong></article>`;
      if(!started.length){
        grid.innerHTML=empty('Your Book-by-Book progress will appear here after you complete a lesson. <a href="book-by-book.html">Choose a book to begin →</a>');
        return;
      }
      grid.innerHTML=started.map(item=>{
        const itemPercent=Math.round((item.completed/item.lessons)*100);
        return `<article class="unified-content-card active-plan-card"><span class="content-type">${item.complete?'Completed':'In progress'}</span><h3>${escapeHtml(item.title)}</h3><p>${item.completed} of ${item.lessons} lessons completed</p><progress max="${item.lessons}" value="${item.completed}" aria-label="${escapeHtml(item.title)} progress"></progress><small>${itemPercent}% complete</small><a href="${escapeHtml(item.nextUrl)}">${item.complete?'Review book':'Continue study'} →</a></article>`;
      }).join('');
    }catch(error){
      summary.innerHTML='<article><span>Book Library</span><strong>Unavailable</strong></article>';
      grid.innerHTML=empty('Book-by-Book progress could not be loaded right now. <a href="book-by-book.html">Open the Book-by-Book library →</a>');
    }
  }

  function render(){
    const profile=api.profile();
    const favorites=api.favorites();
    const history=api.history();
    const completed=api.completed();
    const notes=api.notes();
    const prayers=api.prayers();
    const planState=api.planState();
    document.getElementById('profile-name').value=profile.name||'';
    document.getElementById('profile-interests').value=(profile.interests||[]).join(', ');
    document.getElementById('profile-translation').value=profile.translation||'NIV';
    document.getElementById('profile-theme').value=profile.theme||'system';
    document.getElementById('profile-goal').value=profile.readingGoal||3;
    profilePhoto(profile);
    document.getElementById('dashboard-greeting').textContent=profile.name?`Welcome back, ${profile.name}.`:'Your journey with God.';
    document.getElementById('stat-streak').textContent=`${api.streak()} day${api.streak()===1?'':'s'}`;
    document.getElementById('stat-completed').textContent=completed.length;
    document.getElementById('stat-notes').textContent=notes.length;
    document.getElementById('stat-prayers').textContent=prayers.filter(item=>!item.answered).length;
    renderGrowth();
    renderBookProgress();
    const recent=history.slice(0,4).map(item=>byId(item.id)).filter(Boolean);
    document.getElementById('continue-grid').innerHTML=recent.length?recent.map(card).join(''):empty('Open a study or resource and it will appear here.');
    document.getElementById('favorites-grid').innerHTML=favorites.map(byId).filter(Boolean).map(card).join('')||empty('Save studies, articles, devotionals, podcasts, games, and resources.');
    document.getElementById('completed-grid').innerHTML=completed.map(byId).filter(Boolean).map(card).join('')||empty('Completed studies will appear here.');
    document.getElementById('recommendations-grid').innerHTML=api.recommendations(4).map(card).join('');
    renderPlans(planState);
    renderNotes(notes);
    renderPrayers(prayers);
    renderAchievements();
    document.getElementById('history-list').innerHTML=history.length?history.slice(0,12).map(entry=>`<a href="${entry.url}"><span>${entry.type}</span><strong>${entry.title}</strong><small>${new Date(entry.visitedAt).toLocaleString()}</small></a>`).join(''):empty('Recently viewed content will appear here.');
    document.getElementById('prayer-study').innerHTML='<option value="">Link to a study (optional)</option>'+library().filter(item=>item.type==='Study').map(item=>`<option value="${item.id}">${item.title}</option>`).join('');
  }
  function renderGrowth(){
    const tracker=document.getElementById('growth-tracker');
    if(!tracker||!api.growth)return;
    tracker.innerHTML=api.growth().map(area=>`<article><div><strong>${area.name}</strong><span>${area.value}% engaged</span></div><div class="growth-track" role="progressbar" aria-label="${area.name} engagement" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${area.value}"><span style="width:${area.value}%"></span></div></article>`).join('');
  }
  function renderPlans(state){
    const active=document.getElementById('active-plan');
    const plans=document.getElementById('reading-plans');
    if(state.active){
      const plan=api.plans().find(item=>item.id===state.active.id);
      const percent=Math.round((state.active.completedDays.length/plan.days)*100);
      active.innerHTML=`<article class="active-plan-card"><span>${percent}% complete</span><h3>${plan.title}</h3><p>Day ${Math.min(state.active.day,plan.days)} of ${plan.days}. ${plan.description}</p><progress max="${plan.days}" value="${state.active.completedDays.length}"></progress><button class="button primary" data-plan-day="${state.active.day}">Complete Today’s Reading</button></article>`;
    }else active.innerHTML=empty('Choose a reading plan below to begin.');
    plans.innerHTML=api.plans().map(plan=>`<article class="plan-card"><span>${plan.days} days</span><h3>${plan.title}</h3><p>${plan.description}</p><button class="button secondary" data-start-plan="${plan.id}">Start Plan</button></article>`).join('');
  }
  function renderNotes(list){
    document.getElementById('notes-list').innerHTML=list.length?list.map(note=>`<article><span>${new Date(note.updatedAt).toLocaleDateString()}</span><h3>${note.title}</h3>${note.journal?`<p>${note.journal}</p>`:''}${note.prayer?`<p><strong>Prayer:</strong> ${note.prayer}</p>`:''}${note.questions?`<p><strong>Questions:</strong> ${note.questions}</p>`:''}${note.scriptures?`<p><strong>Scriptures:</strong> ${note.scriptures}</p>`:''}<button data-delete-note="${note.id}">Delete</button></article>`).join(''):empty('Your personal journal entries will appear here.');
  }
  function renderPrayers(list){
    document.getElementById('prayer-list').innerHTML=list.length?list.map(prayer=>`<article class="${prayer.answered?'answered':''}"><span>${prayer.category}${prayer.answered?' • Answered':''}</span><h3>${prayer.title}</h3>${prayer.details?`<p>${prayer.details}</p>`:''}${prayer.scripture?`<p><strong>Scripture:</strong> ${prayer.scripture}</p>`:''}${prayer.studyId&&byId(prayer.studyId)?`<a href="${byId(prayer.studyId).url}">Linked study: ${byId(prayer.studyId).title}</a>`:''}<div><button data-answer-prayer="${prayer.id}">${prayer.answered?'Mark Active':'Mark Answered'}</button><button data-delete-prayer="${prayer.id}">Delete</button></div></article>`).join(''):empty('Add prayer requests and mark them answered as God works.');
  }
  function renderAchievements(){
    const earned=new Set(api.achievements());
    document.getElementById('achievement-grid').innerHTML=badges.map(badge=>`<article class="${earned.has(badge)?'earned':''}"><span>${earned.has(badge)?'🏅':'🔒'}</span><h3>${badge}</h3><p>${earned.has(badge)?'Achievement earned.':'Keep growing to unlock this badge.'}</p></article>`).join('');
  }

  document.getElementById('profile-form').addEventListener('submit',event=>{
    event.preventDefault();
    const save=photo=>{api.saveProfile({name:document.getElementById('profile-name').value.trim(),photo:photo??api.profile().photo,interests:document.getElementById('profile-interests').value.split(',').map(value=>value.trim()).filter(Boolean),translation:document.getElementById('profile-translation').value,theme:document.getElementById('profile-theme').value,readingGoal:Number(document.getElementById('profile-goal').value)||3});document.getElementById('profile-status').textContent='Profile saved on this device.';render();};
    const file=document.getElementById('profile-photo').files[0];
    if(file){const reader=new FileReader();reader.onload=()=>save(reader.result);reader.readAsDataURL(file);}else save();
  });
  document.getElementById('quick-note-form').addEventListener('submit',event=>{event.preventDefault();api.saveNote({title:document.getElementById('note-title').value,journal:document.getElementById('note-journal').value,prayer:document.getElementById('note-prayer').value,questions:document.getElementById('note-questions').value,scriptures:document.getElementById('note-scriptures').value});event.target.reset();render();});
  document.getElementById('prayer-form').addEventListener('submit',event=>{event.preventDefault();api.addPrayer({title:document.getElementById('prayer-title').value,category:document.getElementById('prayer-category').value,scripture:document.getElementById('prayer-scripture').value,studyId:document.getElementById('prayer-study').value,details:document.getElementById('prayer-details').value});event.target.reset();render();});
  document.getElementById('export-notes').addEventListener('click',api.exportNotes);
  document.addEventListener('click',event=>{
    const target=event.target;
    if(target.matches('[data-start-plan]')){api.startPlan(target.dataset.startPlan);render();}
    if(target.matches('[data-plan-day]')){api.markPlanDay(target.dataset.planDay);render();}
    if(target.matches('[data-delete-note]')){api.removeNote(target.dataset.deleteNote);render();}
    if(target.matches('[data-answer-prayer]')){api.togglePrayer(target.dataset.answerPrayer);render();}
    if(target.matches('[data-delete-prayer]')){api.removePrayer(target.dataset.deletePrayer);render();}
  });
  ['favorites','completed','notes','prayers','plans','profile'].forEach(name=>document.addEventListener(`nldg:${name}-changed`,render));
  window.addEventListener('nldg-library-ready',render);
  window.addEventListener('storage',render);
  render();
})();