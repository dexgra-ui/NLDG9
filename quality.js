(function qualityLayer(){
  const body=document.body;
  const main=document.querySelector('main');
  if(main&&!main.id)main.id='main-content';
  if(main&&!document.querySelector('.skip-link')){const skip=document.createElement('a');skip.className='skip-link';skip.href='#main-content';skip.textContent='Skip to main content';body.prepend(skip);}
  const menu=document.querySelector('.menu');
  if(menu){menu.setAttribute('aria-controls','site-navigation');menu.setAttribute('aria-expanded',body.classList.contains('nav-open')?'true':'false');const nav=document.querySelector('.site-header nav');if(nav&&!nav.id)nav.id='site-navigation';menu.addEventListener('click',()=>menu.setAttribute('aria-expanded',body.classList.contains('nav-open')?'true':'false'));}
  document.addEventListener('keydown',event=>{body.classList.add('keyboard-user');if(event.key==='Escape'){body.classList.remove('nav-open');menu?.setAttribute('aria-expanded','false');document.querySelector('.global-search-results')?.setAttribute('hidden','');menu?.focus();}});
  document.addEventListener('pointerdown',()=>body.classList.remove('keyboard-user'));
  document.querySelectorAll('img:not([alt])').forEach(img=>img.alt='');
  document.querySelectorAll('a[target="_blank"]').forEach(link=>{link.rel='noopener noreferrer';if(!link.getAttribute('aria-label'))link.setAttribute('aria-label',`${link.textContent.trim()} (opens in a new tab)`);});
  const status=document.createElement('div');status.className='site-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.hidden=true;body.appendChild(status);
  let timer;const announce=message=>{clearTimeout(timer);status.textContent=message;status.hidden=false;timer=setTimeout(()=>status.hidden=true,4000);};window.NLDG_ANNOUNCE=announce;
  const updateNetwork=()=>{document.querySelector('.offline-indicator')?.remove();if(!navigator.onLine){const badge=document.createElement('span');badge.className='offline-indicator';badge.textContent='Offline mode';document.querySelector('.site-header')?.appendChild(badge);announce('You are offline. Previously saved ministry content remains available.');}else announce('You are back online.');};
  window.addEventListener('offline',updateNetwork);window.addEventListener('online',updateNetwork);if(!navigator.onLine)updateNetwork();
  window.addEventListener('pageshow',event=>{if(event.persisted)document.body.classList.remove('nav-open');});
})();