(function(){
  const intro=document.getElementById('site-intro');
  if(!intro||!document.documentElement.classList.contains('show-site-intro'))return;
  const skip=document.getElementById('site-intro-skip');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  const close=()=>{
    clearTimeout(timer);
    try{sessionStorage.setItem('nldg-intro-seen','true')}catch{}
    document.documentElement.classList.remove('show-site-intro');
    intro.classList.add('is-leaving');
    const finish=()=>{
      intro.hidden=true;
      intro.classList.remove('is-leaving');
      document.body.style.overflow='';
      if(document.activeElement===skip)document.querySelector('.brand')?.focus({preventScroll:true});
    };
    reduceMotion?finish():setTimeout(finish,450);
  };
  intro.hidden=false;
  document.body.style.overflow='hidden';
  skip?.focus({preventScroll:true});
  skip?.addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!intro.hidden)close()});
  timer=setTimeout(close,reduceMotion?700:2400);
})();
