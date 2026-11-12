(()=>{
if(window.NLDG_CONTACT_LINKS_LOADED)return;
window.NLDG_CONTACT_LINKS_LOADED=true;
const nested=/\/(?:articles|devotionals|newsletter)\//i.test(location.pathname);
const isContact=/(^|\/)contact\.html$/i.test(location.pathname);
const root=nested?'../':'';
const shopUrl='https://no-labels-designed-by-god-shop.fourthwall.com/';
const socialProfiles=[
 {key:'bluesky',name:'Bluesky',owner:'Dexter A. Graham',url:'https://bsky.app/profile/mayhemreigns.bsky.social'},
 {key:'threads',name:'Threads',owner:'No Labels, Designed by God',url:'https://www.threads.com/@nolabelsdesignedbygod'}
];
const addSocialLink=(container,profile,before,follow=false)=>{
 const marker='data-'+profile.key+'-link';
 if(container.querySelector('a['+marker+']'))return;
 const link=document.createElement('a');
 link.href=profile.url;
 link.setAttribute(marker,'true');
 link.target='_blank';
 link.rel='noopener noreferrer';
 if(follow)link.className='button secondary';
 const label=(follow?'Follow on ':'')+profile.name+' ↗';
 link.textContent=label;
 link.setAttribute('aria-label',label+' · '+profile.owner+' (opens in a new tab)');
 container.insertBefore(link,before);
};
const i18nScript=document.createElement('script');
i18nScript.src=new URL('nldg-i18n.js?v=1.6.0',document.currentScript?.src||location.href).href;
i18nScript.async=false;
document.head.appendChild(i18nScript);
const discoveryScript=document.createElement('script');
discoveryScript.src=new URL('site-discovery.js?v=1.0.0',document.currentScript?.src||location.href).href;
discoveryScript.async=false;
document.head.appendChild(discoveryScript);
const surveyIntegration=document.createElement('script');
surveyIntegration.src=`${root}survey-game-integration.js?v=2.0.0`;
surveyIntegration.async=false;
document.head.appendChild(surveyIntegration);
const missionLibrary=document.createElement('script');
missionLibrary.src=`${root}mission-library.js?v=1.0.0`;
missionLibrary.async=false;
document.head.appendChild(missionLibrary);
const bookLibrary=document.createElement('script');
bookLibrary.src=`${root}book-by-book-library.js?v=1.0.0`;
bookLibrary.async=false;
document.head.appendChild(bookLibrary);
const leaderMode=document.createElement('script');
leaderMode.src=`${root}universal-leader-mode.js?v=1.0.0`;
leaderMode.async=false;
document.head.appendChild(leaderMode);
const ensure=()=>{
 const primaryNav=document.getElementById('primary-navigation');
 if(primaryNav&&!primaryNav.querySelector('a[data-shop-link]')){
  const shop=document.createElement('a');
  shop.href=shopUrl;
  shop.dataset.shopLink='true';
  shop.textContent='Shop';
  const games=primaryNav.querySelector('.play-link');
  primaryNav.insertBefore(shop,games||null);
 }
 document.querySelectorAll('.ministry-footer').forEach(footer=>{
  let links=footer.querySelector('.footer-links');
  if(!links){links=document.createElement('div');links.className='footer-links';const small=footer.querySelector('small');footer.insertBefore(links,small||null)}
  let contact=links.querySelector('a[data-contact-page]');
  if(!contact){contact=document.createElement('a');contact.href=`${root}contact.html`;contact.dataset.contactPage='true';contact.textContent='Contact & Feedback';links.appendChild(contact)}
  if(!links.querySelector('a[data-shop-link]')){
   const shop=document.createElement('a');
   shop.href=shopUrl;
   shop.dataset.shopLink='true';
   shop.textContent='Shop';
   links.insertBefore(shop,contact);
  }
  socialProfiles.forEach(profile=>addSocialLink(links,profile,contact));
  if(isContact)contact.setAttribute('aria-current','page');
  links.querySelectorAll('a[href="mailto:team@nolabelsdesignedbygod.org"]').forEach(link=>link.remove());
 });
 const homeConnect=document.querySelector('.connect .actions');
 if(homeConnect)socialProfiles.forEach(profile=>addSocialLink(homeConnect,profile,null,true));
 if(isContact){const nav=document.getElementById('primary-navigation');nav?.querySelectorAll('.active').forEach(link=>link.classList.remove('active'));nav?.querySelectorAll('[aria-current="page"]').forEach(link=>link.removeAttribute('aria-current'))}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
const observer=new MutationObserver(ensure);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{ensure();setTimeout(()=>observer.disconnect(),5000)},{once:true});
setTimeout(ensure,500);
})();
