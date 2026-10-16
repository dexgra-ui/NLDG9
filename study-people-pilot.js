// Curated English Ruth and Esther pilots; never infer same-name identities globally.
(()=>{
 const view=document.getElementById('book-view');if(!view)return;
 const pilots={
  '/ruth-study.html':{name:'Ruth',id:'ruth',people:{Naomi:'naomi',Boaz:'boaz',Orpah:'orpah',Mahlon:'mahlon',Elimelech:'elimelech',Obed:'obed',Jesse:'jesse',David:'david'}},
  '/esther-study.html':{name:'Esther',id:'esther',people:{Mordecai:'mordecai-esther',Haman:'haman',Vashti:'vashti',Ahasuerus:'ahasuerus-esther',Zeresh:'zeresh',Hadassah:'esther',Hegai:'hegai',Hathach:'hathach',Abihail:'abihail-esther'}}
 };
 const pilot=pilots[location.pathname];if(!pilot)return;
 const people=pilot.people,seen=new Set();
 function personLink(label,id,anchor){
  const target=new URL('biblical-people-genealogy.html',location.href),back=new URL(location.href);
  back.hash=anchor;target.searchParams.set('person',id);target.searchParams.set('return',back.pathname+back.search+back.hash);
  const link=document.createElement('a');link.href=target.href;link.textContent=label;link.className='study-person-link';link.setAttribute('aria-label',`${label}: biblical profile and family relationships`);return link;
 }
 view.querySelectorAll('.lesson-panel p:not(.kicker), .lesson-panel li, .leader-note').forEach((block,index)=>{
  if(block.closest('.scripture-panel'))return;
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(!walker.currentNode.parentElement.closest('a,button,textarea,input'))nodes.push(walker.currentNode);
  nodes.forEach(node=>{
   const pattern=new RegExp('\\b('+Object.keys(people).join('|')+')\\b','g');let match,last=0;const fragment=document.createDocumentFragment();
   while((match=pattern.exec(node.textContent))){
    if(seen.has(match[1]))continue;seen.add(match[1]);block.id=block.id||`person-context-${index}`;
    fragment.append(document.createTextNode(node.textContent.slice(last,match.index)),personLink(match[1],people[match[1]],block.id));last=pattern.lastIndex;
   }
   if(last){fragment.append(document.createTextNode(node.textContent.slice(last)));node.replaceWith(fragment);}
  });
 });
 // The main character is also the book title: provide an explicit profile link.
 const intro=document.createElement('p');intro.className='people-pilot-help';intro.append('Explore the people in this lesson: ',personLink(pilot.name,pilot.id,'book-view'),'. Selected names below also open the biblical reference.');view.prepend(intro);
 const style=document.createElement('style');style.textContent='.study-person-link{text-decoration:underline;text-underline-offset:.2em}.study-person-link:focus-visible{outline:3px solid currentColor;outline-offset:4px}@media print{.people-pilot-help{display:none}.study-person-link{color:inherit;text-decoration:none}}';document.head.appendChild(style);
 function restore(){const id=location.hash.slice(1);if(id==='book-view'||/^person-context-\d+$/.test(id)){const target=document.getElementById(id);if(target){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:'auto'});}}}
 // Run after the existing lesson renderer's initial scroll reset.
 if(document.readyState==='complete')setTimeout(restore,350);else window.addEventListener('load',()=>setTimeout(restore,350),{once:true});
})();
