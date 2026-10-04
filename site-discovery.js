(()=>{
if(window.NLDG_SITE_DISCOVERY_LOADED)return;
window.NLDG_SITE_DISCOVERY_LOADED=true;

const scriptUrl=new URL(document.currentScript?.src||location.href);
const siteRoot=new URL('./',scriptUrl);
const spanish=document.documentElement.lang==='es';
const today=()=>new Date().toISOString().slice(0,10);
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const publicItem=item=>Boolean(item&&item.status==='published'&&item.url&&(!item.publishedAt||String(item.publishedAt)<=today()));
const absolute=url=>new URL(String(url||''),siteRoot).href;
const relativeCurrent=()=>{
  const rootPath=siteRoot.pathname.endsWith('/')?siteRoot.pathname:`${siteRoot.pathname}/`;
  const pathname=location.pathname.startsWith(rootPath)?location.pathname.slice(rootPath.length):location.pathname.replace(/^\//,'');
  return `${pathname||'index.html'}${location.search}`;
};

const style=document.createElement('link');
style.rel='stylesheet';
style.href=new URL('site-discovery.css?v=1.0.0',siteRoot).href;
style.dataset.siteDiscoveryStyles='true';
if(!document.querySelector('link[data-site-discovery-styles]'))document.head.appendChild(style);

const patchLibrary=()=>{
  const library=window.NLDG_LIBRARY;
  if(!Array.isArray(library))return false;
  const published=()=>library.filter(publicItem);
  window.NLDG_CONTENT=published();
  window.NLDG_STUDIES=library.filter(item=>item.type==='Study'&&publicItem(item));
  window.NLDG_LIBRARY_API={
    ...(window.NLDG_LIBRARY_API||{}),
    all:()=>[...library],
    published,
    byType:type=>library.filter(item=>item.type===type&&publicItem(item)),
    byId:id=>library.find(item=>item.id===id),
    newest:(limit=6)=>published().sort((a,b)=>String(b.publishedAt||b.updatedAt||'').localeCompare(String(a.publishedAt||a.updatedAt||''))).slice(0,limit),
    related:(itemOrId,limit=3)=>{
      const item=typeof itemOrId==='string'?library.find(entry=>entry.id===itemOrId):itemOrId;
      if(!item)return[];
      const terms=new Set([item.type,item.category,item.series,item.book,...(item.topics||[]),...(item.audience||[])].filter(Boolean).map(value=>String(value).toLowerCase()));
      return library
        .filter(entry=>publicItem(entry)&&entry.id!==item.id&&entry.url!==item.url)
        .map(entry=>({entry,score:[entry.type,entry.category,entry.series,entry.book,...(entry.topics||[]),...(entry.audience||[])].filter(Boolean).reduce((sum,value)=>sum+(terms.has(String(value).toLowerCase())?1:0),0)}))
        .filter(result=>result.score>0)
        .sort((a,b)=>b.score-a.score||String(b.entry.publishedAt||b.entry.updatedAt||'').localeCompare(String(a.entry.publishedAt||a.entry.updatedAt||'')))
        .slice(0,limit)
        .map(result=>result.entry);
    }
  };
  return true;
};

const directLessonRoute=item=>{
  const route=String(item?.url||'');
  if(/[?&](?:lesson|week|step|book)=/i.test(route))return true;
  const file=route.split('?')[0].split('/').pop()||'';
  return /^(?:study-|lesson-|women-of-faith-|men-of-faith-)|(?:-study|sunday-school-lesson)\.html$/i.test(file);
};
const studyChildren=item=>(window.NLDG_STUDIES||[]).filter(candidate=>candidate.id!==item.id&&candidate.series&&candidate.series===item.series);
const isSeriesLanding=item=>{
  if(!item?.url||item.url.includes('?'))return false;
  const file=item.url.split('/').pop()||'';
  return !/^study-/i.test(file)&&studyChildren(item).length>=2;
};
const durationLabel=item=>{
  const children=isSeriesLanding(item)?studyChildren(item):[];
  const values=(children.length?children:[item]).map(entry=>Number(entry.duration)).filter(value=>Number.isFinite(value)&&value>0);
  if(!values.length)return spanish?'Duración: no especificada':'Length: not specified';
  const min=Math.min(...values),max=Math.max(...values);
  if(children.length)return spanish?(min===max?`Aprox. ${min} min/lección`:`Aprox. ${min}–${max} min/lección`):(min===max?`Est. ${min} min/lesson`:`Est. ${min}–${max} min/lesson`);
  return spanish?`Aprox. ${values[0]} min`:`Est. ${values[0]} min`;
};
const sessionLabel=item=>{
  const children=isSeriesLanding(item)?studyChildren(item):[];
  const count=children.length||1;
  return spanish?`${count} ${count===1?'sesión':'sesiones'}`:`${count} ${count===1?'session':'sessions'}`;
};
const materialsLabel=item=>{
  const candidates=isSeriesLanding(item)?studyChildren(item):[item];
  if(!candidates.some(directLessonRoute))return '';
  return spanish?'Materiales: participante + líder':'Materials: participant + leader';
};
const enhanceStudyCards=()=>{
  if(spanish)return;
  const studies=window.NLDG_STUDIES||[];
  document.querySelectorAll('.study-card[data-study-id]').forEach(card=>{
    const item=studies.find(entry=>entry.id===card.dataset.studyId);
    if(!item)return;
    const meta=card.querySelector('.study-meta');
    if(!meta)return;
    const scripture=(item.scripture||[]).join(', ');
    const audience=(item.audience||[]).join(' · ');
    const materials=materialsLabel(item);
    meta.classList.add('study-listing-details');
    meta.innerHTML=[
      scripture?`<span>📖 ${escapeHtml(scripture)}</span>`:'',
      audience?`<span><strong>Audience:</strong> ${escapeHtml(audience)}</span>`:'',
      `<span><strong>Sessions:</strong> ${escapeHtml(sessionLabel(item))}</span>`,
      `<span><strong>Length:</strong> ${escapeHtml(durationLabel(item).replace(/^Length:\s*/,''))}</span>`,
      materials?`<span><strong>${escapeHtml(materials.split(':')[0])}:</strong>${escapeHtml(materials.includes(':')?materials.slice(materials.indexOf(':')+1):materials)}</span>`:''
    ].filter(Boolean).join('');
  });
};

const enhanceCollectionCards=()=>{
  if(spanish)return;
  const library=(window.NLDG_LIBRARY||[]).filter(publicItem);
  document.querySelectorAll('.journey-collection-card').forEach(card=>{
    if(card.querySelector('.collection-discovery-meta'))return;
    const title=card.querySelector('h3')?.textContent?.trim();
    if(!title)return;
    const item=library.find(entry=>entry.title===title||entry.series===title);
    if(!item)return;
    const children=(window.NLDG_STUDIES||[]).filter(entry=>entry.series===item.series||entry.series===item.title);
    const audience=(item.audience||children[0]?.audience||[]).join(' · ');
    const durations=children.map(entry=>Number(entry.duration)).filter(value=>Number.isFinite(value)&&value>0);
    const min=durations.length?Math.min(...durations):null,max=durations.length?Math.max(...durations):null;
    const length=min?(min===max?`Est. ${min} min/lesson`:`Est. ${min}–${max} min/lesson`):'Lesson length not specified';
    const materials=children.some(directLessonRoute)?'Participant + leader print options':'';
    const details=document.createElement('p');
    details.className='collection-discovery-meta';
    details.textContent=[audience?`Audience: ${audience}`:'',length,materials].filter(Boolean).join(' · ');
    card.querySelector('.collection-description')?.insertAdjacentElement('afterend',details);
  });
};

const startHereGuide=()=>{
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(!['new-believers.html','empezar.html'].includes(page)||document.querySelector('.start-here-choice-guide'))return;
  const hero=document.querySelector('.path-hero');
  if(!hero)return;
  const section=document.createElement('section');
  section.className='section start-here-choice-guide';
  section.setAttribute('aria-labelledby','start-here-choice-title');
  const paths=spanish?[
    ['Devocionales','Necesito una palabra breve de ánimo y Escritura para esta semana.',new URL('es/devocionales.html',siteRoot).href,'Leer devocionales →'],
    ['Estudio bíblico personal','Quiero profundizar en la Biblia a mi propio ritmo.',new URL('es/estudios-biblicos.html',siteRoot).href,'Elegir un estudio →'],
    ['Recursos para grupos','Estoy preparando una clase, grupo pequeño o conversación de discipulado.',new URL('es/recursos.html',siteRoot).href,'Ver recursos →']
  ]:[
    ['Devotionals','I need a short word of Scripture-centered encouragement for this week.',new URL('devotionals.html',siteRoot).href,'Read devotionals →'],
    ['Personal Bible study','I want to go deeper in Scripture at my own pace.',new URL('studies.html',siteRoot).href,'Choose a study →'],
    ['Group resources','I am preparing a class, small group, or discipleship conversation.',new URL('resource-center.html',siteRoot).href,'Browse group resources →']
  ];
  section.innerHTML=`<div class="section-heading"><p class="kicker">${spanish?'¿No sabes por dónde comenzar?':'Not sure where to begin?'}</p><h2 id="start-here-choice-title">${spanish?'Elige lo que necesitas hoy.':'Choose what you need today.'}</h2><p>${spanish?'El camino para nuevos creyentes sigue aquí, pero también puedes comenzar con el tipo de recurso que mejor corresponde a tu próximo paso.':'The New Believers Path is still here, but you can also begin with the kind of resource that best fits your next step.'}</p></div><div class="start-here-choice-grid">${paths.map(([title,description,href,action])=>`<article><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><a href="${escapeHtml(href)}">${escapeHtml(action)}</a></article>`).join('')}</div><p class="start-here-new-believer-callout"><strong>${spanish?'¿Explorando la fe o comenzando a seguir a Jesús?':'Exploring faith or beginning to follow Jesus?'}</strong> <a href="#pathway">${spanish?'Continúa con el Camino para Nuevos Creyentes.':'Continue with the New Believers Path.'}</a></p>`;
  hero.insertAdjacentElement('afterend',section);
};

const safeOriginPage=raw=>{
  if(!raw)return'';
  try{
    const url=new URL(raw,location.origin);
    if(url.origin!==location.origin)return'';
    if(/\/(?:es\/)?contact(?:o)?\.html$/i.test(url.pathname))return'';
    return `${url.pathname}${url.search}${url.hash}`;
  }catch{return'';}
};
const addFeedbackLinks=()=>{
  const from=`${location.pathname}${location.search}`;
  const contactUrl=spanish?new URL('es/contacto.html',siteRoot):new URL('contact.html',siteRoot);
  contactUrl.searchParams.set('from',from);
  contactUrl.hash='website-feedback';
  document.querySelectorAll('.ministry-footer .footer-links').forEach(links=>{
    if(links.querySelector('[data-page-feedback]'))return;
    const link=document.createElement('a');
    link.href=contactUrl.href;
    link.dataset.pageFeedback='true';
    link.textContent=spanish?'Reportar un problema / sugerir un tema':'Report a problem / suggest a topic';
    const contact=links.querySelector('[data-contact-page],a[href*="contacto.html"],a[href$="contact.html"]');
    if(contact)contact.insertAdjacentElement('afterend',link);else links.appendChild(link);
  });
};
const enhanceContactPage=()=>{
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  if(!['contact.html','contacto.html'].includes(page))return;
  const cards=[...document.querySelectorAll('.contact-grid article')];
  const card=cards.find(node=>/Website Feedback|Comentarios sobre el sitio/i.test(node.querySelector('h3')?.textContent||''));
  if(!card)return;
  card.id='website-feedback';
  const from=safeOriginPage(new URLSearchParams(location.search).get('from'));
  const link=card.querySelector('a[href^="mailto:"]');
  if(!link)return;
  const subject=spanish?'Comentarios del sitio o sugerencia de tema':'Website feedback or topic suggestion';
  const pageUrl=from?new URL(from,location.origin).href:'';
  const body=spanish
    ?`Página o recurso: ${pageUrl}\n¿Qué pasó o qué tema te gustaría sugerir?: \nDispositivo (opcional): \n`
    :`Page or resource: ${pageUrl}\nWhat happened or what topic would you like to suggest?: \nDevice (optional): \n`;
  link.href=`mailto:team@nolabelsdesignedbygod.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if(from&&!card.querySelector('.feedback-origin')){
    const origin=document.createElement('p');origin.className='feedback-origin';origin.textContent=spanish?`Página incluida: ${pageUrl}`:`Page included: ${pageUrl}`;link.insertAdjacentElement('beforebegin',origin);
  }
};

const renderRelated=()=>{
  if(spanish||!patchLibrary())return;
  const library=window.NLDG_LIBRARY||[];
  const currentUrl=relativeCurrent();
  const current=library.find(item=>publicItem(item)&&(item.url===currentUrl||absolute(item.url)===location.href));
  if(!current)return;
  const related=window.NLDG_LIBRARY_API.related(current,3);
  const main=document.querySelector('main');
  if(!main)return;
  let section=document.querySelector('.related-content');
  if(!related.length){section?.remove();return;}
  if(!section){section=document.createElement('section');section.className='section related-content';main.appendChild(section);}
  section.innerHTML=`<div class="section-heading"><p class="kicker">Keep growing</p><h2>Related resources</h2></div><div class="unified-content-grid">${related.map(item=>`<article class="unified-content-card"><span class="content-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description||'')}</p>${item.scripture?.length?`<small>📖 ${escapeHtml(item.scripture.join(', '))}</small>`:''}<a href="${escapeHtml(absolute(item.url))}">Open resource →</a></article>`).join('')}</div>`;
};

const run=()=>{
  patchLibrary();
  startHereGuide();
  addFeedbackLinks();
  enhanceContactPage();
  enhanceStudyCards();
  enhanceCollectionCards();
  renderRelated();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('nldg-library-ready',run);
const studyGrid=document.getElementById('study-grid');
if(studyGrid)new MutationObserver(()=>enhanceStudyCards()).observe(studyGrid,{childList:true});
setTimeout(run,400);
})();
