(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  if(page!=='current-events-series.html'||!week)return;

  const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
  if(!lesson||lesson.version!=='2.0.0')return;

  const lessonLayout=document.querySelector('.lesson-layout');
  const seriesView=document.getElementById('series-view');
  if(!lessonLayout||!seriesView)return;

  /* Keep exactly one four-view control, even if an older cached layer left another tab list in the page. */
  const groups=[...document.querySelectorAll('[role="tablist"]')].filter(group=>
    group.querySelector('[data-view="participant"]')&&
    group.querySelector('[data-view="leader"]')
  );
  const tabs=groups.find(group=>group.classList.contains('v2-view-tabs'))||groups[0];
  if(!tabs)return;
  groups.filter(group=>group!==tabs).forEach(group=>group.remove());

  const labels={
    participant:'Participant Guide',
    leader:'Expanded Leader Guide',
    teaching:'Teaching Guide',
    print:'Print'
  };
  tabs.querySelectorAll('[data-view]').forEach(button=>{
    const label=labels[button.dataset.view];
    if(label)button.textContent=label;
  });

  let shell=document.querySelector('.v2-view-switcher-shell');
  if(!shell){
    shell=document.createElement('nav');
    shell.className='v2-view-switcher-shell';
    shell.setAttribute('aria-label','Lesson guide views');
    seriesView.insertBefore(shell,lessonLayout);
  }
  shell.replaceChildren(tabs);

  const toolbar=document.querySelector('.series-lesson-toolbar');
  const backLink=toolbar?.querySelector('a[href="current-events-series.html"]');
  if(backLink)backLink.textContent='← Back to Journey';

  document.querySelectorAll('.curriculum-v2-badge').forEach(badge=>{
    if(/^curriculum\s+v/i.test(badge.textContent.trim())){
      badge.dataset.curriculumVersion=lesson.version;
      badge.textContent='Updated Curriculum · 2026 Edition';
    }
  });
})();
