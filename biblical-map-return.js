(()=>{
  if(window.NLDG_BIBLICAL_MAP_RETURN_LOADED)return;
  window.NLDG_BIBLICAL_MAP_RETURN_LOADED=true;

  const MAP_PAGE=/^biblical-map-[^/]+\.html$/i;
  const FALLBACK_HREF='biblical-maps.html';
  const FALLBACK_LABEL='Biblical Maps & Geography';
  const RESTORE_PARAM='nldgMapReturnY';
  const params=new URLSearchParams(location.search);
  const page=location.pathname.split('/').pop()||'';

  if(!MAP_PAGE.test(page))return;

  const safeReturnUrl=raw=>{
    if(!raw)return null;
    try{
      const candidate=new URL(raw,location.href);
      if(candidate.origin!==location.origin)return null;
      if(!/^https?:$/.test(candidate.protocol))return null;
      if(candidate.username||candidate.password)return null;
      return candidate;
    }catch(error){
      return null;
    }
  };

  const safeLabel=raw=>{
    const label=String(raw||'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();
    return label&&label.length<=80?label:null;
  };

  const returnUrl=safeReturnUrl(params.get('return'));
  const returnY=Number(params.get('returnY'));
  const hasReturnY=Number.isFinite(returnY)&&returnY>=0&&returnY<=10000000;
  const label=safeLabel(params.get('returnLabel'));

  let href=FALLBACK_HREF;
  let text=`← Back to ${FALLBACK_LABEL}`;
  let aria='Back to Biblical Maps & Geography';

  if(returnUrl){
    returnUrl.searchParams.delete(RESTORE_PARAM);
    if(hasReturnY)returnUrl.searchParams.set(RESTORE_PARAM,String(Math.round(returnY)));
    href=`${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`;
    const destination=label||'Bible Study';
    text=`← Back to ${destination}`;
    aria=`Back to ${destination}`;
  }

  const style=document.createElement('style');
  style.dataset.biblicalMapReturn='true';
  style.textContent=`
    .map-return-nav{width:min(1180px,calc(100% - 2rem));margin:.9rem auto 1rem;display:flex;align-items:center}
    .map-return-nav--bottom{margin-top:1.4rem;margin-bottom:1.5rem}
    .map-return-link{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:.7rem 1rem;border:1px solid rgba(24,59,112,.22);border-radius:12px;background:#fff;color:#183b70!important;font-weight:800;text-decoration:none;box-sizing:border-box;box-shadow:0 4px 12px rgba(6,18,45,.07)}
    .map-return-link:hover{background:#f6f8fc;color:#112d46!important}
    .map-return-link:focus-visible{outline:3px solid #c79b45;outline-offset:3px}
    @media(max-width:640px){.map-return-nav{width:calc(100% - 1.5rem);margin:.75rem auto}.map-return-nav--bottom{margin-top:1.1rem;margin-bottom:1.25rem}.map-return-link{width:100%;min-height:48px;padding:.78rem 1rem}}
  `;
  document.head.appendChild(style);

  const buildNav=position=>{
    const nav=document.createElement('nav');
    nav.className=`map-return-nav map-return-nav--${position}`;
    nav.setAttribute('aria-label',returnUrl?'Return to originating Bible study':'Return to Biblical Maps & Geography');
    const link=document.createElement('a');
    link.className='map-return-link';
    link.href=href;
    link.textContent=text;
    link.setAttribute('aria-label',aria);
    nav.appendChild(link);
    return nav;
  };

  const install=()=>{
    const main=document.querySelector('main');
    if(!main||main.querySelector('.map-return-nav'))return;
    main.prepend(buildNav('top'));
    main.append(buildNav('bottom'));
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();