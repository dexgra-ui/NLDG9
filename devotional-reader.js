(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const DEVOTIONALS=window.NLDG_DEVOTIONALS||[];
const nested=/\/devotionals\/[^/]+\.html$/i.test(location.pathname);
const pathId=nested?(location.pathname.split('/').pop()||'').replace(/\.html$/i,''):'';
const params=new URLSearchParams(location.search);
let index=DEVOTIONALS.findIndex(item=>item.id===(params.get('id')||pathId));
if(index<0)index=0;
const item=DEVOTIONALS[index];
const root=nested?'../':'';
if(!item)return;
const canonicalPath=`devotionals/${item.id}.html`;
const canonical=window.NLDG_SEO?.update({
 title:item.title,
 description:item.summary,
 url:canonicalPath,
 type:'article',
 schema:{
  '@context':'https://schema.org',
  '@type':'BlogPosting',
  headline:item.title,
  description:item.summary,
  mainEntityOfPage:`https://nolabelsdesignedbygod.org/${canonicalPath}`,
  image:['https://nolabelsdesignedbygod.org/no-labels-approved-logo.png'],
  author:{'@type':'Person',name:'Dexter Graham'},
  publisher:{'@type':'Organization',name:'No Labels, Designed by God',logo:{'@type':'ImageObject',url:'https://nolabelsdesignedbygod.org/no-labels-approved-logo.png'}},
  articleSection:item.theme,
  about:item.reference
 }
})||`https://nolabelsdesignedbygod.org/${canonicalPath}`;
const text=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
text('theme',item.theme);text('title',item.title);text('reference',item.reference);text('summary',item.summary);text('scriptureFocus',item.scriptureFocus);text('readPassage',`Read the full passage: ${item.reference}`);text('prayer',item.prayer);text('time',item.minutes);
const reflection=document.getElementById('reflection');if(reflection)reflection.innerHTML=item.reflection.map(value=>`<p>${escapeHtml(value)}</p>`).join('');
const questions=document.getElementById('questions');if(questions)questions.innerHTML=item.questions.map(value=>`<li>${escapeHtml(value)}</li>`).join('');
const action=document.getElementById('action');if(action)action.innerHTML=Array.isArray(item.action)?`<ul>${item.action.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ul>`:`<p>${escapeHtml(item.action)}</p>`;
const all=document.getElementById('allDevotionalsLink');if(all)all.href=`${root}devotionals.html`;
const setNav=(id,navIndex)=>{const target=DEVOTIONALS[(navIndex+DEVOTIONALS.length)%DEVOTIONALS.length],link=document.getElementById(id);if(!link)return;link.href=nested?`${target.id}.html`:`devotionals/${target.id}.html`;link.querySelector('strong').textContent=target.title};
setNav('previous',index-1);setNav('next',index+1);
document.getElementById('print')?.addEventListener('click',()=>window.print());
document.getElementById('copy')?.addEventListener('click',async event=>{const button=event.currentTarget;try{await navigator.clipboard.writeText(canonical);button.textContent='Link Copied';setTimeout(()=>button.textContent='Copy Link',1800)}catch{prompt('Copy this link:',canonical)}});
})();
