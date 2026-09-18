(()=>{
 const s=window.NLDG_BOOK_STUDY,hero=document.getElementById('book-hero');
 if(!s||!hero||document.querySelector('.book-geography-resource'))return;
 const RESTORE_PARAM='nldgMapReturnY';
 const cleanReturnPath=()=>{const current=new URL(location.href);current.searchParams.delete(RESTORE_PARAM);return `${current.pathname}${current.search}${current.hash}`;};
 const restoreMapPosition=()=>{
  const current=new URL(location.href),raw=current.searchParams.get(RESTORE_PARAM);
  if(raw===null)return;
  current.searchParams.delete(RESTORE_PARAM);
  history.replaceState(history.state,'',`${current.pathname}${current.search}${current.hash}`);
  const y=Number(raw);if(!Number.isFinite(y)||y<0||y>10000000)return;
  const anchorId=location.hash?decodeURIComponent(location.hash.slice(1)):'';
  let cancelled=false;const cancel=()=>{cancelled=true};
  ['wheel','touchmove','pointerdown','keydown'].forEach(type=>window.addEventListener(type,cancel,{once:true,passive:true}));
  const restore=()=>{if(cancelled)return;const anchor=anchorId?document.getElementById(anchorId):null;if(anchor)anchor.scrollIntoView({block:'start'});else window.scrollTo({top:y,left:0,behavior:'auto'})};
  requestAnimationFrame(()=>requestAnimationFrame(restore));
  [350,800,1300].forEach(delay=>setTimeout(restore,delay));
  window.addEventListener('load',restore,{once:true});
 };
 const mapHref=(href,label)=>{
  const target=new URL(href,location.href);
  if(target.origin!==location.origin)return href;
  target.searchParams.set('return',cleanReturnPath());
  target.searchParams.set('returnLabel',label);
  target.searchParams.set('returnY',String(Math.max(0,Math.round(window.scrollY))));
  return `${target.pathname}${target.search}${target.hash}`;
 };
 const wireMapLink=(link,label)=>{
  const base=link.dataset.mapReturnBase||link.getAttribute('href');
  if(!base||!/biblical-map-[^/]+\.html/i.test(new URL(base,location.href).pathname))return;
  link.dataset.mapReturnBase=base;
  const update=()=>link.setAttribute('href',mapHref(base,label));
  update();
  ['pointerdown','contextmenu','auxclick','click'].forEach(type=>link.addEventListener(type,update));
  link.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')update()});
 };
 restoreMapPosition();
 const book=String(s.book||'').trim().toLocaleLowerCase('es');
 const configs={
  rut:{
   title:'Ubica Rut en el mundo bíblico.',
   note:'Consulta las asignaciones tribales aproximadas y lugares clave sin tratar las fronteras antiguas como límites modernos exactos. El recurso cartográfico enlazado todavía está disponible solamente en inglés.',
   links:[['../biblical-map-tribes.html','🗺️ Conquista y las doce tribus · inglés'],['../biblical-maps.html','Ver todos los mapas · inglés']]
  },
  filipenses:{
   title:'Ubica Filipenses en el mundo misionero de Pablo.',
   note:'Sitúa Filipos como colonia romana en Macedonia y observa su relación con el mundo misionero de Pablo. El mapa sirve para orientación geográfica y no pretende reconstruir con exactitud cada trayecto antiguo. El recurso cartográfico enlazado todavía está disponible solamente en inglés.',
   links:[['../biblical-map-paul.html','🗺️ El mundo misionero de Pablo · inglés'],['../biblical-maps.html','Ver todos los mapas · inglés']]
  }
 };
 const config=configs[book];if(!config)return;
 const style=document.createElement('style');
 style.textContent='.book-geography-resource{margin:1rem auto 1.5rem;max-width:1180px;padding:1.05rem 1.15rem;border:1px solid rgba(24,59,112,.16);border-left:5px solid #c79b45;border-radius:16px;background:linear-gradient(135deg,#fffaf0,#f6f8fc);box-shadow:0 8px 22px rgba(6,18,45,.05)}.book-geography-resource .kicker{margin:0 0 .2rem}.book-geography-resource h2{margin:.1rem 0 .45rem;font-size:clamp(1.2rem,2vw,1.55rem)}.book-geography-resource p{margin:.25rem 0 .8rem}.book-geography-links{display:flex;gap:.6rem;flex-wrap:wrap}.book-geography-links a{display:inline-flex;align-items:center;padding:.58rem .82rem;border-radius:999px;background:#06122d;color:#fff;text-decoration:none;font-weight:800;font-size:.9rem}@media(max-width:640px){.book-geography-resource{margin:0 .85rem 1.2rem}.book-geography-links{display:grid}.book-geography-links a{justify-content:center;width:100%;box-sizing:border-box}}';
 document.head.appendChild(style);
 const section=document.createElement('section');
 section.className='book-geography-resource';section.setAttribute('aria-label','Recursos de geografía bíblica');
 section.innerHTML=`<p class="kicker">Explora la geografía</p><h2>${config.title}</h2><p>${config.note}</p><div class="book-geography-links">${config.links.map(([href,label])=>`<a href="${href}" lang="en">${label}</a>`).join('')}</div>`;
 hero.insertAdjacentElement('afterend',section);
 const studyLabel=`Estudio de ${String(s.book||'la Biblia').trim()}`;
 section.querySelectorAll('.book-geography-links a').forEach(link=>wireMapLink(link,studyLabel));
})();
