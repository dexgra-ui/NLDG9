(function(){
  const form=document.getElementById('study-builder-form');
  if(!form)return;
  const STORAGE_KEY='nldg-builder-drafts-v1';
  const fields=['title','study-id','series','category','book','scripture','audience','topics','difficulty','duration','status','description','theme','big-idea','background','soap-scripture','observation','application','prayer','reflection','discussion','challenge'];
  const $=id=>document.getElementById(id);
  const split=value=>String(value||'').split(',').map(item=>item.trim()).filter(Boolean);
  const lines=value=>String(value||'').split('\n').map(item=>item.trim()).filter(Boolean);
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const readDrafts=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch(error){return [];}};
  const writeDrafts=drafts=>localStorage.setItem(STORAGE_KEY,JSON.stringify(drafts));
  const uid=()=>`draft-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const slug=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');

  const collect=()=>{
    const data={draftId:$('draft-id').value||uid(),featured:$('featured').checked};
    fields.forEach(id=>data[id]=$(id).value.trim());
    data.duration=Number(data.duration)||45;
    data.updated=Date.now();
    return data;
  };

  const populate=data=>{
    $('draft-id').value=data?.draftId||uid();
    fields.forEach(id=>{$(id).value=data?.[id]??(id==='duration'?45:'');});
    $('category').value=data?.category||'Identity in Christ';
    $('difficulty').value=data?.difficulty||'Beginner';
    $('status').value=data?.status||'draft';
    $('featured').checked=Boolean(data?.featured);
    $('editor-title').textContent=data?.title||'New Bible Study';
    renderPreview();
    renderDraftList();
  };

  const save=(statusMessage='Draft saved.')=>{
    const data=collect();
    if(!data.title){$('save-status').textContent='Add a title before saving.';return null;}
    if(!data['study-id'])data['study-id']=slug(data.title);
    $('study-id').value=data['study-id'];
    const drafts=readDrafts();
    const index=drafts.findIndex(item=>item.draftId===data.draftId);
    if(index>=0)drafts[index]=data;else drafts.unshift(data);
    writeDrafts(drafts);
    $('draft-id').value=data.draftId;
    $('save-status').textContent=statusMessage;
    setTimeout(()=>$('save-status').textContent='',1800);
    renderDraftList();
    return data;
  };

  const renderDraftList=()=>{
    const drafts=readDrafts().sort((a,b)=>b.updated-a.updated);
    const active=$('draft-id').value;
    $('draft-list').innerHTML=drafts.length?drafts.map(item=>`<button type="button" class="draft-item ${item.draftId===active?'active':''}" data-draft-id="${escapeHtml(item.draftId)}"><strong>${escapeHtml(item.title||'Untitled Study')}</strong><small>${escapeHtml(item.status||'draft')} • ${new Date(item.updated).toLocaleDateString()}</small></button>`).join(''):'<p class="preview-empty">No drafts yet. Start your first study.</p>';
  };

  const renderPreview=()=>{
    const data=collect();
    const questions=lines(data.reflection);
    const discussion=lines(data.discussion);
    $('editor-title').textContent=data.title||'New Bible Study';
    $('study-preview').innerHTML=`<p class="kicker">${escapeHtml(data.series||'Bible Study')} • ${escapeHtml(data.category||'Category')}</p><h1>${escapeHtml(data.title||'Your study title')}</h1><p>${escapeHtml(data.description||'Your study description will appear here.')}</p><div class="preview-meta"><span>📖 ${escapeHtml(data.scripture||'Key Scripture')}</span><span>⏱ ${data.duration||45} minutes</span><span>${escapeHtml(data.difficulty||'Beginner')}</span></div>${data.theme?`<h2>Theme</h2><p>${escapeHtml(data.theme)}</p>`:''}${data['big-idea']?`<h2>Big Idea</h2><blockquote>${escapeHtml(data['big-idea'])}</blockquote>`:''}${data.background?`<h2>Background</h2><p>${escapeHtml(data.background).replaceAll('\n','<br>')}</p>`:''}<h2>SOAP Study</h2>${data['soap-scripture']?`<h3>Scripture</h3><p>${escapeHtml(data['soap-scripture']).replaceAll('\n','<br>')}</p>`:''}${data.observation?`<h3>Observation</h3><p>${escapeHtml(data.observation).replaceAll('\n','<br>')}</p>`:''}${data.application?`<h3>Application</h3><p>${escapeHtml(data.application).replaceAll('\n','<br>')}</p>`:''}${data.prayer?`<h3>Prayer</h3><p>${escapeHtml(data.prayer).replaceAll('\n','<br>')}</p>`:''}${questions.length?`<h2>Reflection</h2><ol>${questions.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ol>`:''}${discussion.length?`<h2>Group Discussion</h2><ol>${discussion.map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ol>`:''}${data.challenge?`<h2>Weekly Challenge</h2><p>${escapeHtml(data.challenge)}</p>`:''}<p class="export-note">Preview updates as you type. Drafts remain on this device until exported.</p>`;
  };

  const studyObject=data=>({
    id:data['study-id'],type:'Study',title:data.title,description:data.description,url:`study-${data['study-id']}.html`,category:data.category,series:data.series,scripture:split(data.scripture),book:data.book,topics:split(data.topics),audience:split(data.audience),difficulty:data.difficulty,duration:Number(data.duration)||45,featured:Boolean(data.featured),status:data.status
  });

  const studyHtml=data=>`<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#06122d"><meta name="description" content="${escapeHtml(data.description)}"><title>${escapeHtml(data.title)} | No Labels, Designed by God</title><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="study-experience.css"></head>\n<body data-study-page="${escapeHtml(data['study-id'])}" data-study-title="${escapeHtml(data.title)}">\n<header class="site-header"><a class="brand" href="index.html"><span class="brand-icon brand-logo"><img src="no-labels-approved-logo.png" alt=""></span><span><strong>No Labels, Designed by God</strong><small>A family ministry built to last.</small></span></a><a class="button secondary" href="studies.html">Bible Studies</a></header>\n<main><section class="page-hero study-detail-hero"><p class="kicker">${escapeHtml(data.series)} • ${escapeHtml(data.category)}</p><h1>${escapeHtml(data.title)}</h1><p class="lead">${escapeHtml(data.description)}</p><div class="study-meta"><span>📖 ${escapeHtml(data.scripture)}</span><span>⏱ ${data.duration} minutes</span><span>${escapeHtml(data.difficulty)}</span></div></section><article class="section study-content"><section><p class="kicker">Theme</p><h2>${escapeHtml(data.theme)}</h2></section><section><p class="kicker">Big Idea</p><blockquote>${escapeHtml(data['big-idea'])}</blockquote></section><section><p class="kicker">Background</p><h2>Understanding the passage</h2><p>${escapeHtml(data.background).replaceAll('\n','<br>')}</p></section><section><p class="kicker">SOAP Study</p><h2>Scripture</h2><p>${escapeHtml(data['soap-scripture']).replaceAll('\n','<br>')}</p><h2>Observation</h2><p>${escapeHtml(data.observation).replaceAll('\n','<br>')}</p><h2>Application</h2><p>${escapeHtml(data.application).replaceAll('\n','<br>')}</p><h2>Prayer</h2><p>${escapeHtml(data.prayer).replaceAll('\n','<br>')}</p></section><section><p class="kicker">Reflection</p><h2>Personal questions</h2><ol>${lines(data.reflection).map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ol></section><section><p class="kicker">Group Discussion</p><h2>Talk it through</h2><ol>${lines(data.discussion).map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ol></section><section><p class="kicker">Weekly Challenge</p><h2>Put the Word into practice</h2><p>${escapeHtml(data.challenge)}</p></section><p><a class="button secondary" href="studies.html">Return to Bible Study Hub</a></p></article></main><script src="study-data.js"></script><script src="study-experience.js"></script><script src="script.js"></script></body></html>`;

  const download=(filename,content,type='text/plain')=>{
    const blob=new Blob([content],{type});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  $('new-study').addEventListener('click',()=>populate(null));
  $('save-draft').addEventListener('click',()=>save());
  $('duplicate-draft').addEventListener('click',()=>{
    const data=collect();
    data.draftId=uid();
    data.title=data.title?`${data.title} Copy`:'Untitled Study Copy';
    data['study-id']=data['study-id']?`${data['study-id']}-copy`:'';
    populate(data);
    save('Duplicate created.');
  });
  $('delete-draft').addEventListener('click',()=>{
    const id=$('draft-id').value;
    if(!id)return;
    writeDrafts(readDrafts().filter(item=>item.draftId!==id));
    populate(null);
    $('save-status').textContent='Draft deleted.';
  });
  $('export-study').addEventListener('click',()=>{
    const data=save('Study ready for export.');
    if(!data)return;
    download(`study-${data['study-id']}.html`,studyHtml(data),'text/html');
    download(`${data['study-id']}-metadata.json`,JSON.stringify(studyObject(data),null,2),'application/json');
  });
  $('draft-list').addEventListener('click',event=>{
    const button=event.target.closest('[data-draft-id]');
    if(!button)return;
    populate(readDrafts().find(item=>item.draftId===button.dataset.draftId));
  });
  form.addEventListener('input',event=>{
    if(event.target.id==='title'&&!$('study-id').value)$('study-id').value=slug(event.target.value);
    renderPreview();
  });
  form.addEventListener('change',renderPreview);

  const drafts=readDrafts();
  populate(drafts[0]||null);
})();