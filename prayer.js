(()=>{
  const form=document.getElementById('prayerRequestForm');
  const message=document.getElementById('prayerFormMessage');
  const request=document.getElementById('prayerRequest');
  const count=document.getElementById('prayerCount');
  const name=document.getElementById('prayerName');
  const category=document.getElementById('prayerCategory');
  const title=document.getElementById('prayerTitle');
  const publicConsentWrap=document.getElementById('publicConsentWrap');
  const publicConsent=document.getElementById('publicConsent');
  const ageConsent=document.getElementById('ageConsent');
  const guidelineConsent=document.getElementById('guidelineConsent');
  const wall=document.getElementById('prayerWallGrid');
  const wallEmpty=document.getElementById('prayerWallEmpty');
  const wallFilter=document.getElementById('prayerWallFilter');

  const visibility=()=>form?.querySelector('input[name="visibility"]:checked')?.value||'Private';
  const identity=()=>form?.querySelector('input[name="identity"]:checked')?.value||'Anonymous';
  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  function setMessage(text,isError=false){
    if(!message)return;
    message.textContent=text;
    message.classList.toggle('error',isError);
  }

  function updateVisibility(){
    const isPublic=visibility()==='Public';
    if(publicConsentWrap)publicConsentWrap.hidden=!isPublic;
    if(publicConsent&&!isPublic)publicConsent.checked=false;
  }

  function updateCharacterCount(){
    if(count&&request)count.textContent=String(request.value.length);
  }

  form?.querySelectorAll('input[name="visibility"]').forEach(input=>input.addEventListener('change',updateVisibility));
  request?.addEventListener('input',updateCharacterCount);
  updateVisibility();
  updateCharacterCount();

  form?.addEventListener('submit',event=>{
    event.preventDefault();
    setMessage('');

    if(!form.checkValidity()){
      form.reportValidity();
      setMessage('Please complete the required fields before continuing.',true);
      return;
    }

    const selectedIdentity=identity();
    const selectedVisibility=visibility();
    const firstName=(name?.value||'').trim();
    const prayerText=(request?.value||'').trim();
    const prayerTitle=(title?.value||'').trim();
    const prayerCategory=category?.value||'';

    if(selectedIdentity==='First name'&&!firstName){
      name?.focus();
      setMessage('Please enter the first name you want used, or choose Anonymous.',true);
      return;
    }
    if(selectedVisibility==='Public'&&!publicConsent?.checked){
      publicConsent?.focus();
      setMessage('Public requests require explicit permission before they can be reviewed for the Prayer Wall.',true);
      return;
    }
    if(!ageConsent?.checked||!guidelineConsent?.checked){
      setMessage('Please confirm the age/guardian and prayer-care acknowledgements.',true);
      return;
    }

    const displayName=selectedIdentity==='First name'?firstName:'Anonymous';
    const sharingPermission=selectedVisibility==='Public'
      ?'YES — public sharing permitted after moderation and privacy review.'
      :'NO — keep private from the public Prayer Wall.';

    const body=[
      'PRAYER REQUEST',
      '',
      `Visibility: ${selectedVisibility}`,
      `Public sharing permission: ${sharingPermission}`,
      `Public display name: ${displayName}`,
      `Category: ${prayerCategory}`,
      `Request title: ${prayerTitle}`,
      '',
      'Prayer request:',
      prayerText,
      '',
      'Safeguard acknowledgements:',
      '- Submitter confirmed they are at least 13 or are submitting with a parent/guardian.',
      '- Submitter acknowledged the ministry is not an emergency or professional-care service.',
      '- Public requests, if permitted, may be shortened, redacted, declined, or removed for privacy and safety.',
      '',
      'Please do not publish the sender email address or other contact information.'
    ].join('\n');

    const subject=`Prayer Request — ${selectedVisibility} — ${prayerCategory}`;
    const mailto=`mailto:team@nolabelsdesignedbygod.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessage('Opening your email app. Please review the message before sending.');
    window.location.href=mailto;
  });

  const storageKey='nldg-prayed-public-requests-v1';
  const getPrayed=()=>{
    try{return new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'));}
    catch(error){return new Set();}
  };
  const savePrayed=set=>{
    try{localStorage.setItem(storageKey,JSON.stringify([...set]));}catch(error){}
  };
  const formatDate=value=>{
    if(!value)return '';
    const date=new Date(`${value}T12:00:00`);
    if(Number.isNaN(date.getTime()))return value;
    return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(date);
  };

  const publicItems=Array.isArray(window.NLDG_PRAYER_WALL)
    ?window.NLDG_PRAYER_WALL.filter(item=>item&&item.id&&item.title&&item.request&&item.category)
    :[];

  function renderWall(){
    if(!wall||!wallEmpty)return;
    const selected=wallFilter?.value||'all';
    const prayed=getPrayed();
    const items=publicItems
      .filter(item=>selected==='all'||item.category===selected)
      .sort((a,b)=>String(b.publishedAt||'').localeCompare(String(a.publishedAt||'')));

    wall.innerHTML=items.map(item=>{
      const isAnswered=String(item.status||'').toLowerCase()==='answered'||Boolean(item.answeredUpdate);
      const didPray=prayed.has(item.id);
      return `<article class="prayer-card${isAnswered?' answered':''}">
        <div class="prayer-card-top">
          <span class="prayer-category">${escapeHtml(item.category)}</span>
          <span class="prayer-status">${escapeHtml(isAnswered?'Answered':'Prayer requested')}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="prayer-by">${escapeHtml(item.displayName||'Anonymous')}${item.publishedAt?` • ${escapeHtml(formatDate(item.publishedAt))}`:''}</p>
        <p class="prayer-request-text">${escapeHtml(item.request)}</p>
        ${item.answeredUpdate?`<div class="prayer-answer"><strong>Update:</strong> ${escapeHtml(item.answeredUpdate)}</div>`:''}
        <div class="prayer-card-actions">
          <button class="prayer-prayed-button" type="button" data-prayer-id="${escapeHtml(item.id)}"${didPray?' disabled':''}>${didPray?'Prayed on this device ✓':'I prayed for this'}</button>
          ${item.answeredAt?`<time datetime="${escapeHtml(item.answeredAt)}">Answered ${escapeHtml(formatDate(item.answeredAt))}</time>`:''}
        </div>
      </article>`;
    }).join('');

    wallEmpty.hidden=items.length!==0;
  }

  if(wallFilter){
    const categories=[...new Set(publicItems.map(item=>item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    wallFilter.innerHTML='<option value="all">All categories</option>'+categories.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
    wallFilter.addEventListener('change',renderWall);
  }

  wall?.addEventListener('click',event=>{
    const button=event.target.closest('[data-prayer-id]');
    if(!button)return;
    const id=button.dataset.prayerId;
    if(!id)return;
    const prayed=getPrayed();
    prayed.add(id);
    savePrayed(prayed);
    button.textContent='Prayed on this device ✓';
    button.disabled=true;
  });

  renderWall();
})();
