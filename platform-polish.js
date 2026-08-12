(function(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('header nav a').forEach(link=>{
    const href=(link.getAttribute('href')||'').split('?')[0].toLowerCase();
    link.classList.toggle('active',href===path||(path==='current-events-series.html'&&href==='studies.html'));
  });

  const main=document.querySelector('main');
  if(!main||document.querySelector('.platform-breadcrumbs'))return;
  const labels={
    'studies.html':'Bible Studies',
    'study-library.html':'My Library',
    'current-events-series.html':'Faith & Truth in Today’s World',
    'dashboard.html':'My Journey',
    'ministry-tools.html':'Ministry Tools'
  };
  if(!labels[path])return;
  if(['studies.html','study-library.html','dashboard.html','ministry-tools.html'].includes(path))return;
  const week=new URLSearchParams(location.search).get('week');
  if(path==='current-events-series.html'&&!week)return;
  const crumbs=[['index.html','Home']];
  if(path==='current-events-series.html')crumbs.push(['studies.html','Bible Studies']);
  crumbs.push([null,labels[path]]);
  if(path==='current-events-series.html'&&week){crumbs[crumbs.length-1]=['current-events-series.html',labels[path]];crumbs.push([null,`Week ${week}`]);}
  const nav=document.createElement('nav');
  nav.className='platform-breadcrumbs';
  nav.setAttribute('aria-label','Breadcrumb');
  nav.innerHTML=crumbs.map(([href,label],i)=>`${i?'<span aria-hidden="true">›</span>':''}${href?`<a href="${href}">${label}</a>`:`<strong aria-current="page">${label}</strong>`}`).join('');
  main.prepend(nav);
})();