const navigationScript=document.createElement('script');
navigationScript.src='site-navigation.js?v=1.9.1';
navigationScript.async=false;
document.head.appendChild(navigationScript);
const contactLinksScript=document.createElement('script');
contactLinksScript.src='contact-links.js?v=1.0.0';
contactLinksScript.async=false;
document.head.appendChild(contactLinksScript);
const navigationScopeFix=document.createElement('style');
navigationScopeFix.textContent='@media(max-width:850px){.breadcrumbs,.content-sequence{position:static;top:auto;left:auto;right:auto;padding:0;background:transparent;border:0;border-radius:0}.breadcrumbs{display:flex}.content-sequence{display:grid}.nav-open .breadcrumbs{display:flex}.nav-open .content-sequence{display:grid}}';
document.head.appendChild(navigationScopeFix);
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
(function ensureSocialLinks(){
  document.querySelectorAll('.footer-links').forEach(footerLinks=>{
    const links=[
      {label:'Facebook ↗',href:'https://www.facebook.com/NoLabelsDesignedbyGod',aria:'Follow No Labels, Designed by God on Facebook'},
      {label:'Substack ↗',href:'https://substack.com/@nolabelsdesignedbygod',aria:'Read No Labels, Designed by God on Substack'}
    ];
    links.forEach(item=>{
      if(footerLinks.querySelector(`a[href="${item.href}"]`))return;
      const link=document.createElement('a');
      link.href=item.href;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('aria-label',item.aria);
      link.textContent=item.label;
      footerLinks.appendChild(link);
    });
  });
})();

(function platformIntegration(){
  if(!document.querySelector('link[data-platform-styles]')){const link=document.createElement('link');link.rel='stylesheet';link.href='platform.css?v=5.3.0';link.dataset.platformStyles='true';document.head.appendChild(link);}
  const replaceBranding=root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement?.closest('script,style'))continue;node.nodeValue=node.nodeValue.replaceAll('Brotherhood Bible Games','No Labels Games');}};
  replaceBranding(document.body);
  const loadScript=(src,test)=>new Promise((resolve,reject)=>{if(test()){resolve();return;}const existing=[...document.scripts].find(script=>script.src.includes(src.split('?')[0]));if(existing){if(test()){resolve();return;}existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.appendChild(script);});
  const ensureLibrary=()=>loadScript('content-library.js?v=20260729-5',()=>Boolean(window.NLDG_LIBRARY)).then(()=>loadScript('marriage-family-library.js?v=1.0.0',()=>Boolean(window.NLDG_MARRIAGE_FAMILY_LIBRARY_LOADED))).then(()=>loadScript('difficult-questions-library.js?v=1.0.0',()=>Boolean(window.NLDG_DIFFICULT_QUESTIONS_LIBRARY_LOADED))).then(()=>loadScript('leadership-library.js?v=1.0.0',()=>Boolean(window.NLDG_LEADERSHIP_LIBRARY_LOADED))).then(()=>loadScript('devotional-library.js?v=1.2.0',()=>Boolean(window.NLDG_DEVOTIONAL_LIBRARY_LOADED))).then(()=>loadScript('article-library.js?v=1.0.0',()=>Boolean(window.NLDG_ARTICLE_LIBRARY_LOADED))).then(()=>loadScript('contact-library.js?v=1.0.0',()=>Boolean(window.NLDG_CONTACT_LIBRARY_LOADED)));
  const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const card=item=>`<article class="unified-content-card"><span class="content-type">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description||'')}</p>${item.scripture?.length?`<small>📖 ${escapeHtml(item.scripture.join(', '))}</small>`:''}<a href="${escapeHtml(item.url||'#')}">Open resource →</a></article>`;
  window.NLDG_CONTENT_CARD=card;
  ensureLibrary().then(()=>{
    const header=document.querySelector('.site-header');
    if(header&&!document.querySelector('.global-search-shell')){
      const shell=document.createElement('div');shell.className='global-search-shell';shell.innerHTML='<label class="sr-only" for="global-site-search">Search all ministry content</label><input id="global-site-search" type="search" placeholder="Search studies, games, guides, prayer resources..."><div id="global-search-results" class="global-search-results" hidden></div>';
      header.insertBefore(shell,header.querySelector('.menu,nav'));
      const input=shell.querySelector('input'),results=shell.querySelector('#global-search-results');
      const searchable=item=>[item.title,item.description,item.type,item.category,item.series,item.book,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])].filter(Boolean).join(' ').toLowerCase();
      input.addEventListener('input',()=>{const query=input.value.trim().toLowerCase();if(!query){results.hidden=true;results.innerHTML='';return;}const matches=window.NLDG_CONTENT.filter(item=>searchable(item).includes(query)).slice(0,8);results.innerHTML=matches.length?matches.map(item=>`<a href="${escapeHtml(item.url)}"><span>${escapeHtml(item.type)}</span><strong>${escapeHtml(item.title)}</strong></a>`).join(''):'<p>No matching ministry content.</p>';results.hidden=false;});
      document.addEventListener('click',event=>{if(!shell.contains(event.target))results.hidden=true;});
    }
    const page=location.pathname.split('/').pop()||'index.html';
    const pageWithQuery=page+location.search;
    if(page!=='index.html'&&!document.querySelector('.breadcrumbs')){const main=document.querySelector('main');if(main){const current=(document.querySelector('h1')?.textContent||document.title.split('|')[0]).trim();const crumbs=document.createElement('nav');crumbs.className='breadcrumbs';crumbs.setAttribute('aria-label','Breadcrumb');crumbs.innerHTML=`<a href="index.html">Home</a><span>›</span><span aria-current="page">${escapeHtml(current)}</span>`;main.prepend(crumbs);}}
    const current=window.NLDG_CONTENT.find(item=>item.url===page||item.url===pageWithQuery||item.id===document.body.dataset.studyPage);
    if(current){const ordered=window.NLDG_CONTENT,position=ordered.findIndex(item=>item.id===current.id),prev=position>0?ordered[position-1]:null,next=position<ordered.length-1?ordered[position+1]:null;const main=document.querySelector('main');if(main&&!document.querySelector('.content-sequence')){const nav=document.createElement('nav');nav.className='content-sequence';nav.setAttribute('aria-label','Previous and next content');nav.innerHTML=`${prev?`<a href="${escapeHtml(prev.url)}">← ${escapeHtml(prev.title)}</a>`:'<span></span>'}${next?`<a href="${escapeHtml(next.url)}">${escapeHtml(next.title)} →</a>`:'<span></span>'}`;main.appendChild(nav);}const related=window.NLDG_LIBRARY_API.related(current,3);if(related.length&&main&&!document.querySelector('.related-content')){const section=document.createElement('section');section.className='section related-content';section.innerHTML=`<div class="section-heading"><p class="kicker">Keep growing</p><h2>Related content</h2></div><div class="unified-content-grid">${related.map(card).join('')}</div>`;main.appendChild(section);}}
    window.dispatchEvent(new Event('nldg-library-ready'));
  }).catch(()=>{});
})();

const signupForm=document.getElementById('signup-form');
const formMessage=document.getElementById('form-message');
if(signupForm){signupForm.addEventListener('submit',event=>{event.preventDefault();formMessage.textContent='Thank you. Email signup will be connected in the next phase.';signupForm.reset();});}
const studySearch=document.getElementById('study-search');const studyFilter=document.getElementById('study-filter');const studyCards=[...document.querySelectorAll('.study-card')];const studyEmpty=document.getElementById('study-empty');function filterStudies(){if(!studyCards.length)return;const query=(studySearch?.value||'').trim().toLowerCase();const category=studyFilter?.value||'all';let visible=0;studyCards.forEach(card=>{const text=[card.dataset.title,card.dataset.tags,card.dataset.category,card.textContent].join(' ').toLowerCase();const show=(!query||text.includes(query))&&(category==='all'||card.dataset.category===category);card.hidden=!show;if(show)visible++;});if(studyEmpty)studyEmpty.hidden=visible!==0;}studySearch?.addEventListener('input',filterStudies);studyFilter?.addEventListener('change',filterStudies);
const ministrySearchData=window.NLDG_CONTENT||[];const siteSearch=document.getElementById('site-search');const searchResults=document.getElementById('search-results');const searchSummary=document.getElementById('search-summary');const searchEmpty=document.getElementById('search-empty');let activeSearchType='all';function searchableText(item){return[item.title,item.description,item.type,item.category,item.series,item.book,...(item.scripture||[]),...(item.topics||[]),...(item.audience||[])].filter(Boolean).join(' ').toLowerCase();}function searchTypeMatches(item,group){if(group==='all')return true;const type=String(item.type||'').toLowerCase();if(group==='studies')return /study|lesson library|faith & truth lesson|printable study/.test(type);if(group==='devotionals')return /devotional|family devotion/.test(type);if(group==='articles')return /article/.test(type);if(group==='resources')return /guide|resource|teaching|slides|printable/.test(type)&&!/study/.test(type);if(group==='podcast')return type==='podcast';if(group==='news')return type==='news';return type===group.toLowerCase();}function renderSiteSearch(){if(!searchResults)return;const query=(siteSearch?.value||'').trim().toLowerCase();const data=window.NLDG_CONTENT||ministrySearchData;const matches=data.filter(item=>searchTypeMatches(item,activeSearchType)&&(!query||searchableText(item).includes(query)));searchResults.innerHTML=matches.map(item=>(window.NLDG_CONTENT_CARD?window.NLDG_CONTENT_CARD(item):`<article class="search-result-card"><span class="result-type">${item.type}</span><h3>${item.title}</h3><p>${item.description}</p><a href="${item.url}">Open ${item.type} →</a></article>`)).join('');if(searchSummary)searchSummary.textContent=query?`${matches.length} result${matches.length===1?'':'s'} for “${siteSearch.value}”.`:`Showing ${matches.length} ministry resources.`;if(searchEmpty)searchEmpty.hidden=matches.length!==0;}siteSearch?.addEventListener('input',renderSiteSearch);document.getElementById('clear-search')?.addEventListener('click',()=>{siteSearch.value='';siteSearch.focus();renderSiteSearch();});document.querySelectorAll('[data-type]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-type]').forEach(item=>item.classList.remove('active'));button.classList.add('active');activeSearchType=button.dataset.type;renderSiteSearch();}));window.addEventListener('nldg-library-ready',renderSiteSearch);renderSiteSearch();
const studyPageId=document.body.dataset.studyPage;if(studyPageId){try{const study=(window.NLDG_STUDIES||[]).find(item=>item.id===studyPageId);localStorage.setItem('nldg-last-study',JSON.stringify({id:studyPageId,title:study?.title||document.body.dataset.studyTitle||document.title,url:location.pathname.split('/').pop()+location.search,updated:Date.now()}));}catch(error){}}
document.querySelectorAll('.study-open').forEach(link=>link.addEventListener('click',()=>{try{const study=(window.NLDG_STUDIES||[]).find(item=>item.id===link.dataset.studyId);localStorage.setItem('nldg-last-study',JSON.stringify({id:link.dataset.studyId||'study',title:study?.title||link.closest('article')?.querySelector('h3')?.textContent||link.textContent,url:link.getAttribute('href'),updated:Date.now()}));}catch(error){}}));
const continueSection=document.getElementById('continue-study');const continueCard=document.getElementById('continue-study-card');if(continueSection&&continueCard){try{const saved=JSON.parse(localStorage.getItem('nldg-last-study')||'null');if(saved?.url){continueSection.hidden=false;continueCard.innerHTML=`<article class="continue-card"><span>Continue Study</span><h3>${saved.title}</h3><p>Your place is saved on this device.</p><a class="button primary" href="${saved.url}">Continue Reading</a></article>`;}}catch(error){}}
document.querySelectorAll('[data-collection]').forEach(button=>button.addEventListener('click',()=>{if(studyFilter){studyFilter.value=button.dataset.collection||'all';filterStudies();document.querySelector('.study-tools')?.scrollIntoView({behavior:'smooth',block:'start'});}}));
const gameCards=[...document.querySelectorAll('[data-game-category]')];const gameEmpty=document.getElementById('game-empty');document.querySelectorAll('[data-game-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-game-filter]').forEach(item=>item.classList.remove('active'));button.classList.add('active');let shown=0;gameCards.forEach(card=>{const show=button.dataset.gameFilter==='all'||card.dataset.gameCategory===button.dataset.gameFilter;card.hidden=!show;if(show)shown++;});if(gameEmpty)gameEmpty.hidden=shown!==0;document.getElementById('game-library')?.scrollIntoView({behavior:'smooth',block:'start'});}));
document.querySelectorAll('[data-game-filter],[data-collection]').forEach(control=>{control.setAttribute('type','button');control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();control.click();}});});
if(studyPageId){const loadScript=src=>new Promise((resolve,reject)=>{const existing=[...document.scripts].find(script=>script.src.endsWith(src));if(existing){resolve();return;}const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);});if(!document.querySelector('link[href="study-experience.css"]')){const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href='study-experience.css';document.head.appendChild(stylesheet);}const ready=window.NLDG_STUDIES?Promise.resolve():loadScript('study-data.js?v=20260729-2');ready.then(()=>loadScript('study-experience.js')).then(()=>loadScript('discipleship-study.js?v=5.1.0')).catch(()=>{});}

(function sprintFiveBootstrap(){
  if(!document.querySelector('link[rel="manifest"]')){const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest';document.head.appendChild(manifest);}
  const loadPersonalization=()=>{if(window.NLDG_PERSONAL)return;const existing=document.querySelector('script[data-personalization]');if(existing)return;const script=document.createElement('script');script.src='personalization.js?v=5.1.0';script.dataset.personalization='true';document.body.appendChild(script);};
  if(window.NLDG_DEVOTIONAL_LIBRARY_LOADED)loadPersonalization();else window.addEventListener('nldg-library-ready',loadPersonalization,{once:true});
  if(!document.querySelector('link[href^="dashboard.css"]')){const style=document.createElement('link');style.rel='stylesheet';style.href='dashboard.css?v=5.1.0';document.head.appendChild(style);}
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v=6.5.0').catch(()=>{}));
  let installPrompt;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;const header=document.querySelector('.site-header');if(!header||document.querySelector('.install-app-button'))return;const button=document.createElement('button');button.type='button';button.className='install-app-button';button.textContent='Install App';button.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;button.remove();});header.appendChild(button);});
})();
