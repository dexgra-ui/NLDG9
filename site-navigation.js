(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
function initializeNavigation(){
  const header=document.querySelector('.site-header');
  const nav=header?.querySelector('nav');
  const main=document.querySelector('main');
  if(!header||!nav)return;

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const links=[
    ['Home','index.html','home'],
    ['Start Here','new-believers.html','start'],
    ['Bible Studies','studies.html','studies'],
    ['Devotionals','devotionals.html','devotionals'],
    ['Articles','articles.html','articles'],
    ['Resource Center','resource-center.html','resources'],
    ['Podcast','podcast.html','podcast'],
    ['News','news.html','news'],
    ['Search','search.html','search'],
    ['Our Ministry','about.html','about'],
    ['🎮 Games','play.html','games','play-link']
  ];

  const startPages=new Set(['new-believers.html','new-believer-step.html','new-believer-complete.html','new-believer-mentor.html','new-believer-mentor-session.html','new-believer-toolkit.html','new-believer-toolkit-packet.html']);
  const resourcePages=new Set(['resource-center.html','resources.html','teaching-library.html']);
  const studyPages=new Set(['studies.html','study-library.html','dashboard.html','community.html','ministry-tools.html','ministry-assistant.html','topics.html','scripture-index.html','current-events-series.html','james-series.html','technology-ai.html','sunday-school.html','sunday-school-lesson.html','women-of-faith.html','men-of-faith.html','marriage-family.html','marriage-family-study.html','difficult-questions.html','difficult-questions-study.html','leadership.html','leadership-study.html']);
  const gamePages=new Set(['play.html','games.html','host-test-checklist.html','multi-team-game-v095.html','scripture-or-suspicion.html','who-am-i.html','finish-the-verse.html','bible-jeopardy.html','memory-match.html','lightning-round.html']);

  let section='home';
  if(startPages.has(page))section='start';
  else if(resourcePages.has(page))section='resources';
  else if(studyPages.has(page)||page.startsWith('study-')||page.startsWith('lesson-')||page.startsWith('women-of-faith-')||page.startsWith('men-of-faith-')||page.startsWith('marriage-family-')||page.startsWith('difficult-questions-')||page.startsWith('leadership-'))section='studies';
  else if(gamePages.has(page)||page.includes('game'))section='games';
  else if(page.startsWith('devotional'))section='devotionals';
  else if(page.startsWith('article'))section='articles';
  else if(page.startsWith('podcast'))section='podcast';
  else if(page.startsWith('news'))section='news';
  else if(page.startsWith('search')||page==='site-map.html')section='search';
  else if(page.startsWith('about')||page.startsWith('mission')||page.startsWith('contact'))section='about';

  nav.id='primary-navigation';
  nav.setAttribute('aria-label','Primary navigation');
  nav.innerHTML=links.map(([label,href,linkSection,className])=>{
    const active=section===linkSection;
    const classes=[className,active?'active':''].filter(Boolean).join(' ');
    return `<a href="${href}"${classes?` class="${classes}"`:''}${active?' aria-current="page"':''}>${label}</a>`;
  }).join('');

  if(main){
    main.id=main.id||'main-content';
    if(!document.querySelector('.skip-link')){
      const skip=document.createElement('a');
      skip.className='skip-link';
      skip.href=`#${main.id}`;
      skip.textContent='Skip to main content';
      document.body.insertBefore(skip,document.body.firstChild);
    }
  }

  const menu=header.querySelector('.menu');
  const setOpen=(open,returnFocus=false)=>{
    document.body.classList.toggle('nav-open',open);
    if(menu){
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close site menu':'Open site menu');
      menu.textContent=open?'Close':'Menu';
      if(returnFocus)menu.focus();
    }
    if(open)setTimeout(()=>nav.querySelector('a')?.focus(),0);
  };
  if(menu){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open site menu');
    menu.addEventListener('click',()=>setOpen(!document.body.classList.contains('nav-open')));
  }
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('nav-open'))setOpen(false,true)});
  document.addEventListener('click',event=>{if(document.body.classList.contains('nav-open')&&!header.contains(event.target))setOpen(false)});
  window.addEventListener('resize',()=>{if(innerWidth>1600&&document.body.classList.contains('nav-open'))setOpen(false)});

  const isWomenOfFaithPage=page==='women-of-faith.html'||page.startsWith('women-of-faith-');
  const isMenOfFaithPage=page==='men-of-faith.html'||page.startsWith('men-of-faith-');
  const isMarriageFamilyPage=page==='marriage-family.html'||page.startsWith('marriage-family-');
  const isDifficultQuestionsPage=page==='difficult-questions.html'||page.startsWith('difficult-questions-');
  const isLeadershipPage=page==='leadership.html'||page.startsWith('leadership-');
  let context;
  if(section==='start')context={label:'New Believers navigation',links:[
    ['Learner Path','new-believers.html',['new-believers.html','new-believer-step.html','new-believer-complete.html'].includes(page)],
    ['Mentor Guide','new-believer-mentor.html',['new-believer-mentor.html','new-believer-mentor-session.html'].includes(page)],
    ['Discipleship Toolkit','new-believer-toolkit.html',['new-believer-toolkit.html','new-believer-toolkit-packet.html'].includes(page)]
  ]};
  if(section==='studies')context={label:'Bible Studies navigation',links:[
    ['Study Home','studies.html',['studies.html','current-events-series.html','james-series.html','technology-ai.html','sunday-school.html','sunday-school-lesson.html'].includes(page)||page.startsWith('study-')||page.startsWith('lesson-')],
    ['Men of Faith','men-of-faith.html',isMenOfFaithPage],
    ['Women of Faith','women-of-faith.html',isWomenOfFaithPage],
    ['Marriage & Family','marriage-family.html',isMarriageFamilyPage],
    ['Difficult Questions','difficult-questions.html',isDifficultQuestionsPage],
    ['Leadership','leadership.html',isLeadershipPage],
    ['Leadership Toolkit','leadership-toolkit.html',['leadership-toolkit.html','leadership-toolkit-packet.html'].includes(page)],
    ['My Library','study-library.html',['study-library.html','topics.html','scripture-index.html'].includes(page)],
    ['My Journey','dashboard.html',['dashboard.html','community.html'].includes(page)],
    ['Ministry Tools','ministry-tools.html',['ministry-tools.html','ministry-assistant.html'].includes(page)]
  ]};
  if(section==='resources')context={label:'Resource Center navigation',links:[
    ['Resource Center','resource-center.html',['resource-center.html','resources.html'].includes(page)],
    ['Teaching Library','teaching-library.html',page==='teaching-library.html'],
    ['Mentor Guide','new-believer-mentor.html',false],
    ['Discipleship Toolkit','new-believer-toolkit.html',false]
  ]};
  if(section==='games')context={label:'Game Center navigation',links:[
    ['Game Center','play.html',page==='play.html'||page==='multi-team-game-v095.html'||['scripture-or-suspicion.html','who-am-i.html','finish-the-verse.html','bible-jeopardy.html','memory-match.html','lightning-round.html'].includes(page)],
    ['Church Presentation','games.html?presentation=1',page==='games.html'],
    ['Host Checklist','host-test-checklist.html',page==='host-test-checklist.html']
  ]};
  if(section==='about')context={label:'Ministry information navigation',links:[
    ['Our Ministry','about.html',page==='about.html'],
    ['Our Mission','mission.html',page==='mission.html'],
    ['Contact & Feedback','contact.html',page==='contact.html']
  ]};

  if(context&&!document.querySelector('.section-navigation')){
    const sectionNav=document.createElement('nav');
    sectionNav.className='section-navigation';
    sectionNav.setAttribute('aria-label',context.label);
    sectionNav.innerHTML=`<div class="section-navigation-inner">${context.links.map(([label,href,active])=>`<a href="${href}"${active?' class="active" aria-current="page"':''}>${label}</a>`).join('')}</div>`;
    header.insertAdjacentElement('afterend',sectionNav);
  }

  const sectionRoots={
    start:['Start Here','new-believers.html'],studies:['Bible Studies','studies.html'],devotionals:['Devotionals','devotionals.html'],articles:['Articles','articles.html'],resources:['Resource Center','resource-center.html'],podcast:['Podcast','podcast.html'],news:['News','news.html'],search:['Search','search.html'],about:['Our Ministry','about.html'],games:['Games','play.html']
  };
  if(main&&page!=='index.html'){
    main.querySelector('.breadcrumbs')?.remove();
    const current=(document.querySelector('h1')?.textContent||document.title.split('|')[0]||'Current page').trim();
    const trail=[['Home','index.html']];
    const root=sectionRoots[section];
    if(root&&page!==root[1])trail.push(root);
    if(page==='new-believer-mentor-session.html')trail.push(['Mentor Guide','new-believer-mentor.html']);
    if(page==='new-believer-toolkit-packet.html')trail.push(['Discipleship Toolkit','new-believer-toolkit.html']);
    if(page==='sunday-school-lesson.html')trail.push(['Sunday School','sunday-school.html']);
    if(page!=='women-of-faith.html'&&page.startsWith('women-of-faith-'))trail.push(['Women of Faith','women-of-faith.html']);
    if(page!=='men-of-faith.html'&&page.startsWith('men-of-faith-'))trail.push(['Men of Faith','men-of-faith.html']);
    if(page==='marriage-family-study.html')trail.push(['Marriage & Family','marriage-family.html']);
    if(page==='difficult-questions-study.html')trail.push(['Difficult Questions','difficult-questions.html']);
    if(page==='leadership-study.html'||page==='leadership-toolkit.html'||page==='leadership-toolkit-packet.html')trail.push(['Leadership','leadership.html']);
    if(page==='leadership-toolkit-packet.html')trail.push(['Leadership Toolkit','leadership-toolkit.html']);
    const crumbs=document.createElement('nav');
    crumbs.className='breadcrumbs';
    crumbs.setAttribute('aria-label','Breadcrumb');
    crumbs.innerHTML=`${trail.map(([label,href])=>`<a href="${href}">${escapeHtml(label)}</a><span aria-hidden="true">›</span>`).join('')}<span aria-current="page">${escapeHtml(current)}</span>`;
    main.prepend(crumbs);
  }

  document.querySelectorAll('a[href="resources.html"],a[href="./resources.html"]').forEach(link=>link.href='resource-center.html');

  const footerLinks=document.querySelector('.footer-links');
  if(footerLinks){
    footerLinks.setAttribute('aria-label','Footer navigation');
    footerLinks.innerHTML=`
      <a href="new-believers.html">Start Here</a>
      <a href="studies.html">Bible Studies</a>
      <a href="men-of-faith.html">Men of Faith</a>
      <a href="women-of-faith.html">Women of Faith</a>
      <a href="marriage-family.html">Marriage & Family</a>
      <a href="difficult-questions.html">Difficult Questions</a>
      <a href="leadership.html">Leadership</a>
      <a href="leadership-toolkit.html">Leadership Toolkit</a>
      <a href="devotionals.html">Devotionals</a>
      <a href="articles.html">Articles</a>
      <a href="resource-center.html">Resources</a>
      <a href="podcast.html">Podcast</a>
      <a href="play.html">Games</a>
      <a href="about.html">Our Ministry</a>
      <a href="mission.html">Our Mission</a>
      <a href="site-map.html">Site Map</a>
      <a href="https://www.facebook.com/NoLabelsDesignedbyGod" target="_blank" rel="noopener noreferrer" aria-label="Follow No Labels, Designed by God on Facebook">Facebook ↗</a>
      <a href="https://substack.com/@nolabelsdesignedbygod" target="_blank" rel="noopener noreferrer" aria-label="Read No Labels, Designed by God on Substack">Substack ↗</a>`;
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeNavigation,{once:true});else initializeNavigation();
})();
