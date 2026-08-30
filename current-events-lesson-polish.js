(function(){
  const page=(location.pathname.split('/').pop()||'').toLowerCase();
  const week=Number(new URLSearchParams(location.search).get('week')||0);
  if(page!=='current-events-series.html'||!week)return;

  const lesson=window.NLDG_CURRENT_EVENTS_SERIES?.lessons?.find(item=>item.week===week);
  if(!lesson||lesson.version!=='2.0.0')return;

  const lessonLayout=document.querySelector('.lesson-layout');
  const seriesView=document.getElementById('series-view');
  if(!lessonLayout||!seriesView)return;

  const labels={participant:'Participant Guide',leader:'Expanded Leader Guide',teaching:'Teaching Guide',print:'Print'};
  const groups=[...document.querySelectorAll('[role="tablist"]')].filter(group=>
    group.querySelector('[data-view="participant"]')&&group.querySelector('[data-view="leader"]')
  );
  const tabs=groups.find(group=>group.classList.contains('v2-view-tabs'))||groups[0];
  if(!tabs)return;

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

  const normalize=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
  const isFourViewGroup=group=>{
    if(!group||group===tabs||shell.contains(group))return false;
    const controls=[...group.children].filter(child=>child.matches('button,[role="tab"]'));
    if(controls.length!==4)return false;
    const text=controls.map(control=>normalize(control.textContent));
    return text[0].startsWith('participant')&&text[1].includes('leader')&&text[2].startsWith('teaching')&&text[3].startsWith('print');
  };

  const removeDuplicateViewGroups=()=>{
    document.querySelectorAll('div,nav,section').forEach(group=>{
      if(!isFourViewGroup(group))return;
      const parent=group.parentElement;
      group.remove();
      if(parent&&parent!==seriesView&&parent!==lessonLayout&&parent!==shell&&parent.children.length===0&&!parent.textContent.trim())parent.remove();
    });
  };

  const polishAdvancedPrint=()=>{
    const entry=document.querySelector('.v2-print-view .print-center-entry');
    if(!entry||entry.dataset.v2PrintPolished==='true')return;
    entry.dataset.v2PrintPolished='true';
    const kicker=entry.querySelector('.kicker');
    const heading=entry.querySelector('h2,h3');
    const copy=entry.querySelector('p:not(.kicker)');
    const launch=entry.querySelector('.print-center-launch');
    if(kicker)kicker.textContent='Custom Packet Builder';
    if(heading)heading.textContent='Need more control?';
    if(copy)copy.textContent='Combine participant, leader, teaching, Scripture, resource, and follow-up sections into one custom packet.';
    if(launch){
      const main=launch.querySelector('span,strong');
      const small=launch.querySelector('small');
      if(main)main.textContent='Build Custom Packet';
      if(small)small.textContent='Advanced print options';
      launch.setAttribute('aria-label','Open advanced custom packet builder');
    }
  };

  groups.filter(group=>group!==tabs).forEach(group=>{
    const parent=group.parentElement;
    group.remove();
    if(parent&&parent!==seriesView&&parent!==lessonLayout&&parent.children.length===0&&!parent.textContent.trim())parent.remove();
  });
  removeDuplicateViewGroups();
  polishAdvancedPrint();

  let cleanupQueued=false;
  const cleanup=()=>{
    if(cleanupQueued)return;
    cleanupQueued=true;
    requestAnimationFrame(()=>{
      cleanupQueued=false;
      removeDuplicateViewGroups();
      polishAdvancedPrint();
    });
  };
  new MutationObserver(cleanup).observe(seriesView,{childList:true,subtree:true});
  window.addEventListener('load',cleanup,{once:true});
  setTimeout(cleanup,500);
  setTimeout(cleanup,1500);

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
