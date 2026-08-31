(()=>{
if(window.NLDG_I18N_LOADED)return;window.NLDG_I18N_LOADED=true;
const script=document.currentScript;const root=new URL('./',script?.src||location.href);
const pairs={
'index.html':'es/index.html','about.html':'es/acerca-de.html','studies.html':'es/estudios-biblicos.html','devotionals.html':'es/devocionales.html','articles.html':'es/articulos.html','resource-center.html':'es/recursos.html','newsletter.html':'es/boletin.html','walking-with-jesus.html':'es/caminando-con-jesus.html','walking-with-jesus-study.html':'es/caminando-con-jesus-estudio.html','contact.html':'es/contacto.html','privacy.html':'es/privacidad.html','terms.html':'es/terminos.html','disclaimer.html':'es/aviso.html','copyright.html':'es/copyright-y-marca.html','new-believers.html':'es/empezar.html','new-believer-step.html':'es/paso-nuevo-creyente.html','new-believer-complete.html':'es/proximos-pasos.html','study-scripture-context.html':'es/como-estudiar-la-biblia.html','devotionals/grace-for-this-season.html':'es/gracia-para-esta-etapa.html','devotionals/you-are-known.html':'es/dios-te-conoce.html','devotionals/not-your-past.html':'es/tu-pasado-no-te-define.html','devotionals/more-than-a-label.html':'es/mas-que-una-etiqueta.html','devotionals/peace-is-a-practice.html':'es/la-paz-se-practica.html','study-storm.html':'es/fe-en-la-tormenta.html','study-grace-accountability.html':'es/gracia-y-responsabilidad.html','study-peacemakers.html':'es/pacificadores-en-un-mundo-dividido.html'
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
if(!document.querySelector('link[data-nldg-i18n-styles]')){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('nldg-i18n.css?v=1.1.0',root).href;link.dataset.nldgI18nStyles='true';document.head.appendChild(link)}
const setAlternate=(lang,href)=>{let link=document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=lang;document.head.appendChild(link)}link.href=href};
if((!isSpanish&&pairs[normalized])||(isSpanish&&reverse[normalized])){setAlternate('en',englishHref);setAlternate('es',spanishHref);setAlternate('x-default',englishHref)}
const makeSwitcher=()=>{const switcher=document.createElement('div');switcher.className='nldg-language-switcher';switcher.setAttribute('aria-label',isSpanish?'Selector de idioma':'Language selector');switcher.innerHTML=`<a href="${englishHref}" lang="en"${!isSpanish?' aria-current="true"':''}>English</a><span class="separator" aria-hidden="true">|</span><a href="${spanishHref}" lang="es"${isSpanish?' aria-current="true"':''}>Español</a>`;return switcher};
const mount=()=>{if(document.querySelector('.nldg-language-switcher'))return;const header=document.querySelector('.site-header,.spanish-header,header.top');const switcher=makeSwitcher();if(header){if(header.matches('header.top'))switcher.classList.add('nldg-language-switcher-game');const menu=header.querySelector('.menu');const nav=header.querySelector('nav');const controls=header.querySelector('.controls');header.insertBefore(switcher,menu||nav||controls||null);return}if(!document.body)return;switcher.classList.add('nldg-language-switcher-floating');document.body.appendChild(switcher)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('nldg-navigation-ready',mount);setTimeout(mount,250);
window.NLDG_I18N={locale:isSpanish?'es':'en',pairs,englishHref,spanishHref,root:root.href};
})();
