(()=>{
const SITE='https://nolabelsdesignedbygod.org';
const DEFAULT_IMAGE=`${SITE}/no-labels-approved-logo.png`;
const DEFAULT_IMAGE_ALT='No Labels, Designed by God ministry logo';
const absolute=value=>{const text=String(value||'').trim();if(!text)return SITE+'/';if(/^https?:\/\//i.test(text))return text;return SITE+(text.startsWith('/')?'':'/')+text};
const ensureMeta=(attribute,key)=>{let element=document.head.querySelector(`meta[${attribute}="${key}"]`);if(!element){element=document.createElement('meta');element.setAttribute(attribute,key);document.head.appendChild(element)}return element};
const setMeta=(attribute,key,value)=>{if(value===undefined||value===null||value==='')return;ensureMeta(attribute,key).setAttribute('content',String(value))};
const ensureCanonical=()=>{let link=document.head.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}return link};
function update({title,description,url,type='website',image=DEFAULT_IMAGE,imageAlt=DEFAULT_IMAGE_ALT,schema}={}){
 const pageTitle=String(title||'No Labels, Designed by God');
 const fullTitle=pageTitle.includes('No Labels, Designed by God')?pageTitle:`${pageTitle} | No Labels, Designed by God`;
 const canonical=absolute(url||location.pathname+location.search);
 const socialImage=absolute(image||DEFAULT_IMAGE);
 document.title=fullTitle;
 setMeta('name','description',description);
 ensureCanonical().href=canonical;
 setMeta('property','og:type',type);
 setMeta('property','og:site_name','No Labels, Designed by God');
 setMeta('property','og:title',pageTitle);
 setMeta('property','og:description',description);
 setMeta('property','og:url',canonical);
 setMeta('property','og:image',socialImage);
 setMeta('property','og:image:alt',imageAlt||DEFAULT_IMAGE_ALT);
 setMeta('property','og:image:width','534');
 setMeta('property','og:image:height','457');
 setMeta('name','twitter:card','summary_large_image');
 setMeta('name','twitter:title',pageTitle);
 setMeta('name','twitter:description',description);
 setMeta('name','twitter:image',socialImage);
 setMeta('name','twitter:image:alt',imageAlt||DEFAULT_IMAGE_ALT);
 if(schema){document.getElementById('nldg-structured-data')?.remove();const script=document.createElement('script');script.id='nldg-structured-data';script.type='application/ld+json';script.textContent=JSON.stringify(schema);document.head.appendChild(script)}
 return canonical;
}
window.NLDG_SEO={siteUrl:SITE,defaultImage:DEFAULT_IMAGE,absolute,update};
if(!window.NLDG_CONTACT_LINKS_LOADED&&!document.querySelector('script[data-contact-links]')){const script=document.createElement('script');script.src=`${/\/(?:articles|devotionals)\//i.test(location.pathname)?'../':''}contact-links.js?v=1.0.0`;script.dataset.contactLinks='true';document.head.appendChild(script)}
})();
