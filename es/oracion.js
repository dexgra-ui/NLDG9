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

  const categoryLabels={
    'Family':'Familia','Health':'Salud','Grief':'Duelo','Faith':'Fe','Work & Finances':'Trabajo y finanzas',
    'Relationships':'Relaciones','Guidance':'Dirección','Praise / Answered Prayer':'Alabanza / Oración respondida','Other':'Otro'
  };
  const visibility=()=>form?.querySelector('input[name="visibility"]:checked')?.value||'Private';
  const identity=()=>form?.querySelector('input[name="identity"]:checked')?.value||'Anonymous';
  const escapeHtml=value=>String(value??'')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

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

  function updateCharacterCount(){if(count&&request)count.textContent=String(request.value.length);}

  form?.querySelectorAll('input[name="visibility"]').forEach(input=>input.addEventListener('change',updateVisibility));
  request?.addEventListener('input',updateCharacterCount);
  updateVisibility();
  updateCharacterCount();

  form?.addEventListener('submit',event=>{
    event.preventDefault();
    setMessage('');
    if(!form.checkValidity()){
      form.reportValidity();
      setMessage('Completa los campos obligatorios antes de continuar.',true);
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
      setMessage('Escribe el primer nombre que deseas usar o elige Anónimo.',true);
      return;
    }
    if(selectedVisibility==='Public'&&!publicConsent?.checked){
      publicConsent?.focus();
      setMessage('Las peticiones públicas requieren permiso explícito antes de ser consideradas para el Muro de oración.',true);
      return;
    }
    if(!ageConsent?.checked||!guidelineConsent?.checked){
      setMessage('Confirma la edad o tutor y los avisos de cuidado de oración.',true);
      return;
    }

    const displayName=selectedIdentity==='First name'?firstName:'Anónimo';
    const visibilityEs=selectedVisibility==='Public'?'Pública':'Privada';
    const sharingPermission=selectedVisibility==='Public'
      ?'SÍ — se permite compartir públicamente después de moderación y revisión de privacidad.'
      :'NO — mantener fuera del Muro de oración público.';

    const body=[
      'SOLICITUD DE ORACIÓN',
      '',
      `Visibilidad: ${visibilityEs}`,
      `Valor de moderación: ${selectedVisibility}`,
      `Permiso para compartir públicamente: ${sharingPermission}`,
      `Nombre público: ${displayName}`,
      `Categoría: ${categoryLabels[prayerCategory]||prayerCategory} (${prayerCategory})`,
      `Título: ${prayerTitle}`,
      '',
      'Petición de oración:',
      prayerText,
      '',
      'Confirmaciones de protección:',
      '- La persona confirmó que tiene al menos 13 años o que envía la petición con un padre, madre o tutor.',
      '- La persona reconoce que el ministerio no es un servicio de emergencia ni de atención profesional.',
      '- Las peticiones públicas, si se autorizan, pueden acortarse, redactarse, rechazarse o retirarse por privacidad y seguridad.',
      '',
      'No publicar la dirección de correo del remitente ni otra información de contacto.'
    ].join('\n');

    const subject=`Solicitud de oración — ${visibilityEs} — ${categoryLabels[prayerCategory]||prayerCategory}`;
    const mailto=`mailto:team@nolabelsdesignedbygod.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMessage('Abriendo tu aplicación de correo. Revisa el mensaje antes de enviarlo.');
    window.location.href=mailto;
  });

  const storageKey='nldg-prayed-public-requests-v1';
  const getPrayed=()=>{try{return new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'));}catch{return new Set();}};
  const savePrayed=set=>{try{localStorage.setItem(storageKey,JSON.stringify([...set]));}catch{}};
  const formatDate=value=>{
    if(!value)return '';
    const date=new Date(`${value}T12:00:00`);
    if(Number.isNaN(date.getTime()))return value;
    return new Intl.DateTimeFormat('es-US',{month:'short',day:'numeric',year:'numeric'}).format(date);
  };

  const publicItems=Array.isArray(window.NLDG_PRAYER_WALL)
    ?window.NLDG_PRAYER_WALL.filter(item=>item&&item.id&&item.title&&item.request&&item.category)
    :[];

  const localized=item=>({
    title:item.es?.title||item.title,
    displayName:item.es?.displayName||item.displayName||'Anónimo',
    category:item.es?.category||categoryLabels[item.category]||item.category,
    request:item.es?.request||item.request,
    answeredUpdate:item.es?.answeredUpdate||item.answeredUpdate||'',
    translated:Boolean(item.es?.title||item.es?.request)
  });

  function renderWall(){
    if(!wall||!wallEmpty)return;
    const selected=wallFilter?.value||'all';
    const prayed=getPrayed();
    const items=publicItems
      .filter(item=>selected==='all'||item.category===selected)
      .sort((a,b)=>String(b.publishedAt||'').localeCompare(String(a.publishedAt||'')));

    wall.innerHTML=items.map(item=>{
      const view=localized(item);
      const isAnswered=String(item.status||'').toLowerCase()==='answered'||Boolean(item.answeredUpdate);
      const didPray=prayed.has(item.id);
      const originalNote=!view.translated?'<p class="prayer-by">Texto original en inglés.</p>':'';
      return `<article class="prayer-card${isAnswered?' answered':''}">
        <div class="prayer-card-top">
          <span class="prayer-category">${escapeHtml(view.category)}</span>
          <span class="prayer-status">${escapeHtml(isAnswered?'Respondida':'Petición de oración')}</span>
        </div>
        <h3>${escapeHtml(view.title)}</h3>
        <p class="prayer-by">${escapeHtml(view.displayName)}${item.publishedAt?` • ${escapeHtml(formatDate(item.publishedAt))}`:''}</p>
        ${originalNote}
        <p class="prayer-request-text">${escapeHtml(view.request)}</p>
        ${view.answeredUpdate?`<div class="prayer-answer"><strong>Actualización:</strong> ${escapeHtml(view.answeredUpdate)}</div>`:''}
        <div class="prayer-card-actions">
          <button class="prayer-prayed-button" type="button" data-prayer-id="${escapeHtml(item.id)}"${didPray?' disabled':''}>${didPray?'Oré por esto en este dispositivo ✓':'Oré por esta petición'}</button>
          ${item.answeredAt?`<time datetime="${escapeHtml(item.answeredAt)}">Respondida ${escapeHtml(formatDate(item.answeredAt))}</time>`:''}
        </div>
      </article>`;
    }).join('');
    wallEmpty.hidden=items.length!==0;
  }

  if(wallFilter){
    const categories=[...new Set(publicItems.map(item=>item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    wallFilter.innerHTML='<option value="all">Todas las categorías</option>'+categories.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(categoryLabels[value]||value)}</option>`).join('');
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
    button.textContent='Oré por esto en este dispositivo ✓';
    button.disabled=true;
  });

  renderWall();
})();
