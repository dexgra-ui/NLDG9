(()=>{
if(window.NLDG_I18N_LOADED)return;window.NLDG_I18N_LOADED=true;
const script=document.currentScript;const root=new URL('./',script?.src||location.href);
const pairs={
'index.html':'es/index.html','about.html':'es/acerca-de.html','studies.html':'es/estudios-biblicos.html','devotionals.html':'es/devocionales.html','articles.html':'es/articulos.html','resource-center.html':'es/recursos.html','newsletter.html':'es/boletin.html','walking-with-jesus.html':'es/caminando-con-jesus.html','contact.html':'es/contacto.html','privacy.html':'es/privacidad.html','terms.html':'es/terminos.html'
};
const reverse=Object.fromEntries(Object.entries(pairs).map(([en,es])=>[es,en]));
const basePath=root.pathname.endsWith('/')?root.pathname:`${root.pathname}/`;
const relativePath=decodeURI(location.pathname).startsWith(basePath)?decodeURI(location.pathname).slice(basePath.length):decodeURI(location.pathname).replace(/^\//,'');
const normalized=relativePath===''?'index.html':relativePath;
const isSpanish=normalized==='es'||normalized.startsWith('es/');
const withState=url=>{const next=new URL(url,root);next.search=location.search;next.hash=location.hash;return next.href};
const fallbackSpanish=()=>{const url=new URL('es/proximamente.html',root);url.searchParams.set('from',normalized+location.search+location.hash);return url.href};
const englishFromFallback=()=>{const from=new URLSearchParams(location.search).get('from');if(!from)return new URL('index.html',root).href;const safe=from.replace(/^\/+/, '');if(safe.startsWith('es/')||safe.includes('://'))return new URL('index.html',root).href;return new URL(safe,root).href};
const englishPath=isSpanish?(reverse[normalized]||null):normalized;
const spanishPath=!isSpanish?(pairs[normalized]||null):normalized;
const englishHref=isSpanish?(normalized==='es/proximamente.html'?englishFromFallback():englishPath?withState(englishPath):new URL('index.html',root).href):withState(normalized);
const spanishHref=!isSpanish?(spanishPath?withState(spanishPath):fallbackSpanish()):withState(normalized);
if(!document.querySelector('link[data-nldg-i18n-styles]')){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('nldg-i18n.css?v=1.0.0',root).href;link.dataset.nldgI18nStyles='true';document.head.appendChild(link)}
const setAlternate=(lang,href)=>{let link=document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=lang;document.head.appendChild(link)}link.href=href};
if((!isSpanish&&pairs[normalized])||(isSpanish&&reverse[normalized])){setAlternate('en',englishHref);setAlternate('es',spanishHref);setAlternate('x-default',englishHref)}
const mount=()=>{const header=document.querySelector('.site-header');if(!header||header.querySelector('.nldg-language-switcher'))return;const switcher=document.createElement('div');switcher.className='nldg-language-switcher';switcher.setAttribute('aria-label',isSpanish?'Selector de idioma':'Language selector');switcher.innerHTML=`<a href="${englishHref}" lang="en"${!isSpanish?' aria-current="true"':''}>English</a><span class="separator" aria-hidden="true">|</span><a href="${spanishHref}" lang="es"${isSpanish?' aria-current="true"':''}>Español</a>`;const menu=header.querySelector('.menu');header.insertBefore(switcher,menu||header.querySelector('nav')||null)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('nldg-navigation-ready',mount);
setTimeout(mount,250);
window.NLDG_I18N={locale:isSpanish?'es':'en',pairs,englishHref,spanishHref,root:root.href};
})();