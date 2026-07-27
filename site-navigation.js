(()=>{
function initializeNavigation(){
  const header=document.querySelector('.site-header');
  const nav=header?.querySelector('nav');
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
  const studyPages=new Set(['studies.html','study-library.html','dashboard.html','community.html','ministry-tools.html','ministry-assistant.html','topics.html','scripture-index.html','current-events-series.html','james-series.html','technology-ai.html','sunday-school.html']);
  const gamePages=new Set(['play.html','games.html','host-test-checklist.html','multi-team-game-v095.html','scripture-or-suspicion.html','who-am-i.html','finish-the-verse.html','bible-jeopardy.html','memory-match.html','lightning-round.html']);

  let section='home';
  if(startPages.has(page))section='start';
  else if(resourcePages.has(page))section='resources';
  else if(studyPages.has(page)||page.startsWith('study-')||page.startsWith('lesson-'))section='studies';
  else if(gamePages.has(page)||page.includes('game'))section='games';
  else if(page.startsWith('devotional'))section='devotionals';
  else if(page.startsWith('article'))section='articles';
  else if(page.startsWith('podcast'))section='podcast';
  else if(page.startsWith('news'))section='news';
  else if(page.startsWith('search'))section='search';
  else if(page.startsWith('about'))section='about';

  nav.id='primary-navigation';
  nav.setAttribute('aria-label','Primary navigation');
  nav.innerHTML=links.map(([label,href,linkSection,className])=>{
    const active=section===linkSection;
    const classes=[className,active?'active':''].filter(Boolean).join(' ');
    return `<a href="${href}"${classes?` class="${classes}"`:''}${active?' aria-current="page"':''}>${label}</a>`;
  }).join('');

  const menu=header.querySelector('.menu');
  const setOpen=open=>{
    document.body.classList.toggle('nav-open',open);
    if(menu){
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close site menu':'Open site menu');
      menu.textContent=open?'Close':'Menu';
    }
  };
  if(menu){
    menu.setAttribute('aria-controls',nav.id);
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open site menu');
    menu.addEventListener('click',()=>setOpen(!document.body.classList.contains('nav-open')));
  }
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
  document.addEventListener('click',event=>{if(document.body.classList.contains('nav-open')&&!header.contains(event.target))setOpen(false)});

  let context;
  if(section==='start')context={label:'New Believers navigation',links:[
    ['Learner Path','new-believers.html',['new-believers.html','new-believer-step.html','new-believer-complete.html'].includes(page)],
    ['Mentor Guide','new-believer-mentor.html',['new-believer-mentor.html','new-believer-mentor-session.html'].includes(page)],
    ['Discipleship Toolkit','new-believer-toolkit.html',['new-believer-toolkit.html','new-believer-toolkit-packet.html'].includes(page)]
  ]};
  if(section==='studies')context={label:'Bible Studies navigation',links:[
    ['Study Home','studies.html',['studies.html','current-events-series.html','james-series.html','technology-ai.html','sunday-school.html'].includes(page)||page.startsWith('study-')||page.startsWith('lesson-')],
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

  if(context&&!document.querySelector('.section-navigation')){
    const sectionNav=document.createElement('nav');
    sectionNav.className='section-navigation';
    sectionNav.setAttribute('aria-label',context.label);
    sectionNav.innerHTML=`<div class="section-navigation-inner">${context.links.map(([label,href,active])=>`<a href="${href}"${active?' class="active" aria-current="page"':''}>${label}</a>`).join('')}</div>`;
    header.insertAdjacentElement('afterend',sectionNav);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeNavigation,{once:true});else initializeNavigation();
})();
