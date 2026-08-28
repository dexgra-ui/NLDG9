(()=>{
if(window.NLDG_SCRIPTURE_LINKS_LOADED)return;
window.NLDG_SCRIPTURE_LINKS_LOADED=true;
const ENGLISH_BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation';
const SPANISH_BOOKS='Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|1 Samuel|2 Samuel|1 Reyes|2 Reyes|1 Crónicas|2 Crónicas|Esdras|Nehemías|Ester|Job|Salmos?|Proverbios|Eclesiastés|Cantar de los Cantares|Isaías|Jeremías|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Hageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|1 Corintios|2 Corintios|Gálatas|Efesios|Filipenses|Colosenses|1 Tesalonicenses|2 Tesalonicenses|1 Timoteo|2 Timoteo|Tito|Filemón|Hebreos|Santiago|1 Pedro|2 Pedro|1 Juan|2 Juan|3 Juan|Judas|Apocalipsis';
const BOOKS=`${ENGLISH_BOOKS}|${SPANISH_BOOKS}`;
const NUMBERED_BOOK_NAMES='Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John|Reyes|Crónicas|Corintios|Tesalonicenses|Timoteo|Pedro|Juan';
const RANGE_TAIL='(?:(?::\\d{1,3}(?:[-–—](?:\\d{1,3}(?::\\d{1,3})?))?)|(?:[-–—]\\d{1,3}(?::\\d{1,3})?))?';
const CORE=`\\d{1,3}${RANGE_TAIL}`;
const CONTINUATION=`\\d{1,3}(?!\\s+(?:${NUMBERED_BOOK_NAMES})\\b)${RANGE_TAIL}`;
const REFERENCE=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${BOOKS})\\s+${CORE}(?:\\s*,\\s*${CONTINUATION})*(?:\\s*;\\s*${CONTINUATION}(?:\\s*,\\s*${CONTINUATION})*)*`,'giu');
const SKIP='a,script,style,textarea,input,select,option,button,code,pre,[contenteditable="true"],.no-scripture-links';
const SPANISH_TO_ENGLISH={
 'Génesis':'Genesis','Éxodo':'Exodus','Levítico':'Leviticus','Números':'Numbers','Deuteronomio':'Deuteronomy','Josué':'Joshua','Jueces':'Judges','Rut':'Ruth','1 Reyes':'1 Kings','2 Reyes':'2 Kings','1 Crónicas':'1 Chronicles','2 Crónicas':'2 Chronicles','Esdras':'Ezra','Nehemías':'Nehemiah','Ester':'Esther','Salmo':'Psalm','Salmos':'Psalms','Proverbios':'Proverbs','Eclesiastés':'Ecclesiastes','Cantar de los Cantares':'Song of Songs','Isaías':'Isaiah','Jeremías':'Jeremiah','Lamentaciones':'Lamentations','Ezequiel':'Ezekiel','Oseas':'Hosea','Amós':'Amos','Abdías':'Obadiah','Jonás':'Jonah','Miqueas':'Micah','Nahúm':'Nahum','Habacuc':'Habakkuk','Sofonías':'Zephaniah','Hageo':'Haggai','Zacarías':'Zechariah','Malaquías':'Malachi','Mateo':'Matthew','Marcos':'Mark','Lucas':'Luke','Juan':'John','Hechos':'Acts','Romanos':'Romans','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians','Gálatas':'Galatians','Efesios':'Ephesians','Filipenses':'Philippians','Colosenses':'Colossians','1 Tesalonicenses':'1 Thessalonians','2 Tesalonicenses':'2 Thessalonians','1 Timoteo':'1 Timothy','2 Timoteo':'2 Timothy','Tito':'Titus','Filemón':'Philemon','Hebreos':'Hebrews','Santiago':'James','1 Pedro':'1 Peter','2 Pedro':'2 Peter','1 Juan':'1 John','2 Juan':'2 John','3 Juan':'3 John','Judas':'Jude','Apocalipsis':'Revelation'
};
const aliasEntries=Object.entries(SPANISH_TO_ENGLISH).sort((a,b)=>b[0].length-a[0].length);
const normalizeReference=reference=>{
 let normalized=String(reference||'').replace(/[–—]/g,'-');
 for(const [spanish,english] of aliasEntries){
  if(normalized.toLocaleLowerCase('es').startsWith(spanish.toLocaleLowerCase('es')+' ')){
   normalized=english+normalized.slice(spanish.length);
   break;
  }
 }
 return normalized;
};
const passageUrl=reference=>`https://www.biblegateway.com/passage/?search=${encodeURIComponent(normalizeReference(reference))}`;
const findReferences=text=>[...String(text||'').matchAll(REFERENCE)].map(match=>match[0]);
function linkTextNode(node){
 const text=node.nodeValue;
 REFERENCE.lastIndex=0;
 if(!text||!REFERENCE.test(text))return;
 REFERENCE.lastIndex=0;
 const fragment=document.createDocumentFragment();
 let last=0;
 for(const match of text.matchAll(REFERENCE)){
  if(match.index>last)fragment.append(text.slice(last,match.index));
  const reference=match[0];
  const link=document.createElement('a');
  link.className='scripture-reference-link';
  link.href=passageUrl(reference);
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.textContent=reference;
  const spanish=document.documentElement.lang==='es';
  link.setAttribute('aria-label',spanish?`Leer ${reference} en Bible Gateway (abre en una pestaña nueva)`:`Read ${reference} on Bible Gateway (opens in a new tab)`);
  fragment.append(link);
  last=match.index+reference.length;
 }
 if(last<text.length)fragment.append(text.slice(last));
 node.replaceWith(fragment);
}
function linkReferences(root=document.body){
 if(!root||root.nodeType===Node.ELEMENT_NODE&&(root.matches(SKIP)||root.closest(SKIP)))return;
 if(root.nodeType===Node.TEXT_NODE){linkTextNode(root);return;}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement?.closest(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(linkTextNode);
}
const style=document.createElement('style');
style.textContent='.scripture-reference-link{color:#8fe9b6;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;font-weight:750}.scripture-reference-link:hover,.scripture-reference-link:focus-visible{color:#ffd55f}.scripture-reference-link:focus-visible{outline:3px solid #ffd55f;outline-offset:3px;border-radius:3px}.wof-language-switch,.mof-language-switch{display:flex;gap:.6rem;flex-wrap:wrap;margin:.8rem 0 1rem}';
document.head.appendChild(style);
const WOMEN_STUDY_ES={
 'women-known-by-god':1,
 'women-jesus-saw':2,
 'women-identity-beyond-roles':3,
 'women-faith-hard-seasons':4,
 'women-strength-surrender':5,
 'women-healing-hurt-rejection':6,
 'women-healthy-community':7,
 'women-calling-gifts':8,
 'women-prayer-discernment':9,
 'women-helping-another-grow':10
};
const MEN_STUDY_ES={
 'men-identity-before-performance':1,
 'men-free-indeed':2,
 'men-integrity':3,
 'men-honest-strength':4,
 'men-servant-leadership':5,
 'men-relationships':6,
 'men-brotherhood':7,
 'men-temptation-integrity':8,
 'men-stewardship':9,
 'men-help-another-grow':10
};
function addWomenSpanishLink(){
 if(document.documentElement.lang==='es')return;
 const id=String(document.body?.dataset.studyPage||'');
 const number=WOMEN_STUDY_ES[id];
 if(number){
  const hero=document.querySelector('.wof-study-hero');
  if(!hero||hero.querySelector('[data-wof-spanish-link]'))return;
  const switcher=document.createElement('div');
  switcher.className='wof-language-switch';
  switcher.dataset.wofSpanishLink='true';
  switcher.innerHTML=`<a class="button primary" href="${location.pathname.split('/').pop()}" aria-current="page">English</a><a class="button secondary" href="mujeres-de-fe.html?study=${number}">Español</a>`;
  const meta=hero.querySelector('.wof-study-meta');
  (meta||hero.lastElementChild)?.insertAdjacentElement('afterend',switcher);
  return;
 }
 const page=location.pathname.split('/').pop()||'';
 if(page==='women-of-faith.html'){
  const hero=document.querySelector('.wof-hero>div:first-child');
  if(!hero||hero.querySelector('[data-wof-spanish-link]'))return;
  const switcher=document.createElement('div');
  switcher.className='wof-language-switch';
  switcher.dataset.wofSpanishLink='true';
  switcher.innerHTML='<a class="button primary" href="women-of-faith.html" aria-current="page">English</a><a class="button secondary" href="mujeres-de-fe.html">Español</a>';
  const lead=hero.querySelector('.lead');
  lead?.insertAdjacentElement('afterend',switcher);
 }
}
function addMenSpanishLink(){
 if(document.documentElement.lang==='es')return;
 const id=String(document.body?.dataset.studyPage||'');
 const number=MEN_STUDY_ES[id];
 if(number){
  const hero=document.querySelector('.mof-study-hero');
  if(!hero||hero.querySelector('[data-mof-spanish-link]'))return;
  const switcher=document.createElement('div');
  switcher.className='mof-language-switch';
  switcher.dataset.mofSpanishLink='true';
  switcher.innerHTML=`<a class="button primary" href="${location.pathname.split('/').pop()}" aria-current="page">English</a><a class="button secondary" href="hombres-de-fe.html?study=${number}">Español</a>`;
  const meta=hero.querySelector('.mof-study-meta');
  (meta||hero.lastElementChild)?.insertAdjacentElement('afterend',switcher);
  return;
 }
 const page=location.pathname.split('/').pop()||'';
 if(page==='men-of-faith.html'){
  const hero=document.querySelector('.mof-hero>div:first-child');
  if(!hero||hero.querySelector('[data-mof-spanish-link]'))return;
  const switcher=document.createElement('div');
  switcher.className='mof-language-switch';
  switcher.dataset.mofSpanishLink='true';
  switcher.innerHTML='<a class="button primary" href="men-of-faith.html" aria-current="page">English</a><a class="button secondary" href="hombres-de-fe.html">Español</a>';
  const lead=hero.querySelector('.lead');
  lead?.insertAdjacentElement('afterend',switcher);
 }
}
const loadDepthEnhancement=()=>{
 let src='';
 const studyId=String(document.body?.dataset.studyPage||'');
 if(document.body?.classList.contains('fyj-study-page'))src='following-jesus-depth.js?v=1.0.0';
 else if(studyId.startsWith('men-'))src='men-of-faith-depth.js?v=1.0.0';
 else if(studyId.startsWith('women-'))src='women-of-faith-depth.js?v=1.0.0';
 if(!src||[...document.scripts].some(script=>script.src.includes(src.split('?')[0])))return;
 const script=document.createElement('script');
 script.src=new URL(src,document.currentScript?.src||location.href).href;
 script.async=false;
 document.head.appendChild(script);
};
const start=()=>{
 linkReferences(document.body);
 loadDepthEnhancement();
 addWomenSpanishLink();
 addMenSpanishLink();
 let queued=false;
 const pending=new Set();
 const observer=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>pending.add(node)));
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;const nodes=[...pending];pending.clear();nodes.forEach(linkReferences);});
 });
 observer.observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.NLDG_SCRIPTURE_LINKS={linkReferences,passageUrl,findReferences,normalizeReference};
})();