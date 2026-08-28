(()=>{
if(window.NLDG_CONTACT_LINKS_LOADED)return;
window.NLDG_CONTACT_LINKS_LOADED=true;
const nested=/\/(?:articles|devotionals|newsletter)\//i.test(location.pathname);
const pageName=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const isContact=pageName==='contact.html';
const isLegalPage=['terms.html','privacy.html','disclaimer.html','copyright.html'].includes(pageName);
const root=nested?'../':'';
const shopUrl='https://no-labels-designed-by-god-shop.fourthwall.com/';
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
if(!document.querySelector('style[data-legal-footer-styles]')){
 const style=document.createElement('style');
 style.dataset.legalFooterStyles='true';
 style.textContent='.footer-legal-links{display:flex;gap:16px;flex-wrap:wrap;grid-column:1/-1;font-size:.88rem}.footer-legal-links a{text-decoration:none}.footer-legal-links a:hover,.footer-legal-links a:focus-visible{text-decoration:underline}';
 document.head.appendChild(style);
}
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
  if(isContact)contact.setAttribute('aria-current','page');
  links.querySelectorAll('a[href$="privacy.html"],a[href$="terms.html"],a[href$="disclaimer.html"],a[href$="copyright.html"]').forEach(link=>link.remove());
  links.querySelectorAll('a[href="mailto:team@nolabelsdesignedbygod.org"]').forEach(link=>link.remove());

  let legal=footer.querySelector('.footer-legal-links');
  const small=footer.querySelector('small');
  if(!legal){
   legal=document.createElement('nav');
   legal.className='footer-legal-links';
   legal.setAttribute('aria-label','Legal');
   footer.insertBefore(legal,small||null);
  }
  const legalHtml=[
   ['Terms of Use','terms.html'],
   ['Privacy','privacy.html'],
   ['Disclaimer','disclaimer.html'],
   ['Copyright &amp; Trademark','copyright.html']
  ].map(([label,href])=>`<a href="${root}${href}"${pageName===href?' aria-current="page"':''}>${label}</a>`).join('');
  if(legal.innerHTML!==legalHtml)legal.innerHTML=legalHtml;
 });
 if(isContact||isLegalPage){
  const nav=document.getElementById('primary-navigation');
  nav?.querySelectorAll('.active').forEach(link=>link.classList.remove('active'));
  nav?.querySelectorAll('[aria-current="page"]').forEach(link=>link.removeAttribute('aria-current'));
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
const observer=new MutationObserver(ensure);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{ensure();setTimeout(()=>observer.disconnect(),5000)},{once:true});
setTimeout(ensure,500);
})();