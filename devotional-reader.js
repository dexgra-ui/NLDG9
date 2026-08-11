(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const DEVOTIONALS=window.NLDG_DEVOTIONALS||[];
const nested=/\/devotionals\/[^/]+\.html$/i.test(location.pathname);
const pathId=nested?(location.pathname.split('/').pop()||'').replace(/\.html$/i,''):'';
const params=new URLSearchParams(location.search);
let index=DEVOTIONALS.findIndex(item=>item.id===(params.get('id')||pathId));
if(index<0)index=0;
const item=DEVOTIONALS[index];
const root=nested?'../':'';
if(!item)return;
const shell=document.querySelector('.reader-shell');
const header=document.querySelector('.site-header');
const menu=header?.querySelector('.menu');
const primaryNav=header?.querySelector('nav');
if(shell&&!shell.id)shell.id='main-content';
if(!document.querySelector('.skip-link')&&shell){const skip=document.createElement('a');skip.className='skip-link';skip.href='#main-content';skip.textContent='Skip to main content';document.body.insertBefore(skip,document.body.firstChild)}
if(primaryNav){primaryNav.id=primaryNav.id||'primary-navigation';primaryNav.querySelector('a.active')?.setAttribute('aria-current','page')}
if(menu&&primaryNav){
 menu.setAttribute('aria-controls',primaryNav.id);
 const closeMenu=(returnFocus=false)=>{document.body.classList.remove('nav-open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';if(returnFocus)menu.focus()};
 menu.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();const open=!document.body.classList.contains('nav-open');if(!open){closeMenu();return}document.body.classList.add('nav-open');menu.setAttribute('aria-expanded','true');menu.textContent='Close';primaryNav.querySelector('a')?.focus()},{capture:true});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('nav-open')){event.preventDefault();closeMenu(true)}});
}
if(shell&&!document.getElementById('title'))shell.innerHTML=`<article><header class="reader-hero"><p class="devo-theme" id="theme"></p><h1 id="title">Devotional</h1><span class="reader-reference" id="reference"></span><p class="reader-summary" id="summary"></p><div class="reader-actions"><button class="button primary" id="print" type="button">Print Devotional</button><button class="button secondary" id="copy" type="button">Copy Link</button><a class="button secondary" id="allDevotionalsLink" href="${root}devotionals.html">All Devotionals</a></div></header><div class="reader-content"><div class="reader-main"><section class="reader-block"><h2>Scripture Focus</h2><p id="scriptureFocus"></p><p><strong id="readPassage"></strong></p></section><section class="reader-block"><h2>Reflection</h2><div id="reflection"></div></section><section class="reader-block"><h2>Pause and Consider</h2><ul id="questions"></ul></section><section class="reader-block"><h2>Live It Today</h2><div id="action"></div></section><section class="reader-block prayer"><h2>Prayer</h2><p id="prayer"></p></section></div><aside class="reader-side"><div class="reader-side-card"><strong>Devotional rhythm</strong><p>Read slowly. Reflect honestly. Respond faithfully. Pray simply.</p></div><div class="reader-side-card"><strong id="time"></strong><p>Designed for a quiet moment, family discussion, or small-group opening.</p></div><div class="reader-side-card"><strong>Remember</strong><p>God’s character remains trustworthy even when your feelings and circumstances are changing.</p></div></aside></div><nav class="reader-nav content-sequence" aria-label="Previous and next devotionals"><a id="previous" href="#"><span>Previous devotional</span><strong></strong></a><a id="next" href="#"><span>Next devotional</span><strong></strong></a></nav></article>`;
const canonicalPath=`devotionals/${item.id}.html`;
const canonical=window.NLDG_SEO?.update({title:item.title,description:item.summary,url:canonicalPath,type:'article',schema:{'@context':'https://schema.org','@type':'BlogPosting',headline:item.title,description:item.summary,mainEntityOfPage:`https://nolabelsdesignedbygod.org/${canonicalPath}`,image:['https://nolabelsdesignedbygod.org/no-labels-approved-logo.png'],author:{'@type':'Person',name:'Dexter Graham'},publisher:{'@type':'Organization',name:'No Labels, Designed by God',logo:{'@type':'ImageObject',url:'https://nolabelsdesignedbygod.org/no-labels-approved-logo.png'}},articleSection:item.theme,about:item.reference}})||`https://nolabelsdesignedbygod.org/${canonicalPath}`;
const text=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
text('theme',item.theme);text('title',item.title);text('reference',item.reference);text('summary',item.summary);text('scriptureFocus',item.scriptureFocus);text('readPassage',`Read the full passage: ${item.reference}`);text('prayer',item.prayer);text('time',item.minutes);
const reflection=document.getElementById('reflection');if(reflection)reflection.innerHTML=item.reflection.map(value=>`<p>${escapeHtml(value)}</p>`).join('');
const questions=document.getElementById('questions');if(questions)questions.innerHTML=item.questions.map(value=>`<li>${escapeHtml(value)}</li>`).join('');
const action=document.getElementById('action');if(action)action.innerHTML=Array.isArray(item.action)?`<ul>${item.action.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ul>`:`<p>${escapeHtml(item.action)}</p>`;
const all=document.getElementById('allDevotionalsLink');if(all)all.href=`${root}devotionals.html`;
const setNav=(id,navIndex)=>{const target=DEVOTIONALS[(navIndex+DEVOTIONALS.length)%DEVOTIONALS.length],link=document.getElementById(id);if(!link)return;link.href=nested?`${target.id}.html`:`devotionals/${target.id}.html`;link.querySelector('strong').textContent=target.title};
setNav('previous',index-1);setNav('next',index+1);
document.getElementById('print')?.addEventListener('click',()=>window.print());
document.getElementById('copy')?.addEventListener('click',async event=>{const button=event.currentTarget;try{await navigator.clipboard.writeText(canonical);button.textContent='Link Copied';setTimeout(()=>button.textContent='Copy Link',1800)}catch{prompt('Copy this link:',canonical)}});
})();
