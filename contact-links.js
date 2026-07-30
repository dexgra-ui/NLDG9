(()=>{
if(window.NLDG_CONTACT_LINKS_LOADED)return;
window.NLDG_CONTACT_LINKS_LOADED=true;
const nested=/\/(?:articles|devotionals)\//i.test(location.pathname);
const root=nested?'../':'';
const ensure=()=>{
 document.querySelectorAll('.ministry-footer').forEach(footer=>{
  let links=footer.querySelector('.footer-links');
  if(!links){links=document.createElement('div');links.className='footer-links';const small=footer.querySelector('small');footer.insertBefore(links,small||null)}
  if(!links.querySelector('a[data-contact-page]')){const contact=document.createElement('a');contact.href=`${root}contact.html`;contact.dataset.contactPage='true';contact.textContent='Contact & Feedback';links.appendChild(contact)}
  if(!links.querySelector('a[href="mailto:team@nolabelsdesignedbygod.org"]')){const email=document.createElement('a');email.href='mailto:team@nolabelsdesignedbygod.org';email.textContent='team@nolabelsdesignedbygod.org';email.setAttribute('aria-label','Email the No Labels, Designed by God team');links.appendChild(email)}
 });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
const observer=new MutationObserver(ensure);
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{ensure();setTimeout(()=>observer.disconnect(),5000)},{once:true});
setTimeout(ensure,500);
})();
