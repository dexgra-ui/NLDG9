// Curated English study people; never infer same-name identities globally.
(()=>{
 const view=document.getElementById('book-view');if(!view)return;
 const pilots={
  '/numbers-study.html':{name:'Numbers',id:'numbers',people:{Moses:'moses',Aaron:'aaron',Miriam:'miriam',Joshua:'joshua',Caleb:'caleb-jephunneh',Korah:'korah-izhar',Balak:'balak',Balaam:'balaam',Zelophehad:'zelophehad',Mahlah:'mahlah-zelophehad',Hoglah:'hoglah',Tirzah:'tirzah-zelophehad'}},
  '/leviticus-study.html':{name:'Leviticus',id:'leviticus',people:{Moses:'moses',Aaron:'aaron',Nadab:'nadab-aaron',Abihu:'abihu',Eleazar:'eleazar-aaron',Ithamar:'ithamar',Shelomith:'shelomith-dibri',Dibri:'dibri'}},
  '/exodus-study.html':{name:'Exodus',id:'exodus',people:{Moses:'moses',Aaron:'aaron',Miriam:'miriam',Jochebed:'jochebed',Amram:'amram',Shiphrah:'shiphrah',Puah:'puah-midwife',Zipporah:'zipporah',Jethro:'jethro',Joshua:'joshua'}},
  '/genesis-study.html':{name:'Genesis',id:'genesis',people:{Adam:'adam',Eve:'eve',Noah:'noah',Abraham:'abram',Abram:'abram',Sarah:'sarai',Sarai:'sarai',Isaac:'isaac',Rebekah:'rebekah',Jacob:'jacob',Leah:'leah',Rachel:'rachel',Joseph:'joseph'}},
  '/ruth-study.html':{name:'Ruth',id:'ruth',people:{Naomi:'naomi',Boaz:'boaz',Orpah:'orpah',Mahlon:'mahlon',Elimelech:'elimelech',Obed:'obed',Jesse:'jesse',David:'david'}},
  '/esther-study.html':{name:'Esther',id:'esther',people:{Mordecai:'mordecai-esther',Haman:'haman',Vashti:'vashti',Ahasuerus:'ahasuerus-esther',Zeresh:'zeresh',Hadassah:'esther',Hegai:'hegai',Hathach:'hathach',Abihail:'abihail-esther'}}
 };
 const pilot=pilots[location.pathname];if(!pilot)return;
 const people=pilot.people,seen=new Set();
 const isLesson=!!view.querySelector('.book-lesson');
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
    if(seen.has(people[match[1]]))continue;seen.add(people[match[1]]);block.id=block.id||`person-context-${index}`;
    fragment.append(document.createTextNode(node.textContent.slice(last,match.index)),personLink(match[1],people[match[1]],block.id));last=pattern.lastIndex;
   }
   if(last){fragment.append(document.createTextNode(node.textContent.slice(last)));node.replaceWith(fragment);}
  });
 });
 // Study-wide curated list, not a claim that every person appears in each lesson.
 const panel=document.createElement(isLesson?'details':'section');panel.id='study-people';panel.className='study-people lesson-panel';
 const heading=document.createElement(isLesson?'summary':'h2');heading.textContent='People in This Study';panel.append(heading);
 const help=document.createElement('p');help.textContent='Explore the main people across this study. Search by name or open a profile for Scripture references and recorded family relationships.';panel.append(help);
 if(pilot.id==='exodus'){const note=document.createElement('p');note.textContent='The pharaohs in Exodus and the daughter of Pharaoh who rescues Moses are not named in the Exodus narrative. No disputed historical identity is assigned here. Jethro and Reuel remain distinct records with the identification question explained in their profiles.';panel.append(note);}
 const label=document.createElement('label');label.htmlFor='study-people-search';label.textContent='Search people in this study';
 const input=document.createElement('input');input.type='search';input.id='study-people-search';input.placeholder='Type a name';
 const list=document.createElement('ul');list.id='study-people-list';input.setAttribute('aria-controls',list.id);
 const entries=pilot.id==='numbers'?
  [['Moses','moses','Wilderness Leadership'],['Aaron','aaron','Wilderness Leadership'],['Miriam','miriam','Wilderness Leadership'],['Joshua (son of Nun)','joshua','Wilderness Leadership'],['Caleb (son of Jephunneh)','caleb-jephunneh','Wilderness Leadership'],['Korah (son of Izhar)','korah-izhar','Conflict and Opposition'],['Balak','balak','Conflict and Opposition'],['Balaam','balaam','Conflict and Opposition'],['Zelophehad','zelophehad','Zelophehad’s Family'],['Mahlah','mahlah-zelophehad','Zelophehad’s Family'],['Noah (daughter of Zelophehad)','noah-zelophehad','Zelophehad’s Family'],['Hoglah','hoglah','Zelophehad’s Family'],['Milcah (daughter of Zelophehad)','milcah-zelophehad','Zelophehad’s Family'],['Tirzah','tirzah-zelophehad','Zelophehad’s Family']]:pilot.id==='leviticus'?
  [['Moses','moses','Leadership and Priesthood'],['Aaron','aaron','Leadership and Priesthood'],['Nadab (son of Aaron)','nadab-aaron','Aaron’s Sons'],['Abihu','abihu','Aaron’s Sons'],['Eleazar (son of Aaron)','eleazar-aaron','Aaron’s Sons'],['Ithamar','ithamar','Aaron’s Sons'],['Shelomith (daughter of Dibri)','shelomith-dibri','Leviticus 24'],['Dibri','dibri','Leviticus 24']]:pilot.id==='exodus'?
  [['Shiphrah','shiphrah','Courage and Deliverance'],['Puah (midwife)','puah-midwife','Courage and Deliverance'],['Moses','moses','Moses’ Family'],['Aaron','aaron','Moses’ Family'],['Miriam','miriam','Moses’ Family'],['Jochebed','jochebed','Moses’ Family'],['Amram','amram','Moses’ Family'],['Zipporah','zipporah','Moses’ Family'],['Jethro','jethro','Counsel and Leadership'],['Joshua (son of Nun)','joshua','Counsel and Leadership']]:pilot.id==='genesis'?
  [['Adam','adam','Early Generations'],['Eve','eve','Early Generations'],['Noah','noah','Early Generations'],['Abraham / Abram','abram','Abraham’s Family'],['Sarah / Sarai','sarai','Abraham’s Family'],['Isaac','isaac','Abraham’s Family'],['Rebekah','rebekah','Abraham’s Family'],['Jacob','jacob','Jacob’s Family'],['Leah','leah','Jacob’s Family'],['Rachel','rachel','Jacob’s Family'],['Joseph (son of Jacob)','joseph','Jacob’s Family']]:pilot.id==='esther'?
  [['Esther / Hadassah','esther'],['Mordecai','mordecai-esther'],['King Ahasuerus','ahasuerus-esther'],['Vashti','vashti'],['Haman','haman'],['Zeresh','zeresh']]:
  [['Ruth','ruth'],['Naomi','naomi'],['Boaz','boaz'],['Orpah','orpah'],['Elimelech','elimelech'],['Mahlon','mahlon'],['Chilion / Kilion','chilion'],['Obed','obed']];
 const groups=new Map();
 const rows=entries.map(([name,id,group])=>{
  if(group&&!groups.has(group)){const row=document.createElement('li'),heading=document.createElement('h3');row.className='study-people-group';heading.textContent=group;row.append(heading);list.append(row);groups.set(group,{heading:row,rows:[]});}
  const row=document.createElement('li');row.append(personLink(name,id,'study-people'));list.append(row);if(group)groups.get(group).rows.push(row);return {name,row};
 });
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const filter=()=>{const query=input.value.trim().toLowerCase();let count=0;rows.forEach(({name,row})=>{row.hidden=!name.toLowerCase().includes(query);if(!row.hidden)count++;});groups.forEach(group=>{group.heading.hidden=group.rows.every(row=>row.hidden);});status.textContent=count?`${count} of ${rows.length} people shown.`:'No matching people in this study. Try another name or explore all biblical people below.';};
 input.addEventListener('input',filter);filter();
 const all=document.createElement('a');all.href='biblical-people-genealogy.html';all.textContent='Explore all biblical people';
 panel.append(label,input,list,status,all);view.prepend(panel);
 const style=document.createElement('style');style.textContent='.study-person-link{text-decoration:underline;text-underline-offset:.2em}.study-person-link:focus-visible,.study-people summary:focus-visible,.study-people input:focus-visible{outline:3px solid currentColor;outline-offset:4px}.study-people summary{cursor:pointer;padding:.75rem 0;font-weight:700}.study-people input{display:block;width:100%;max-width:28rem;min-height:44px;margin:.5rem 0}.study-people li a{display:inline-block;padding:.5rem 0}.study-people [hidden]{display:none!important}.study-people{scroll-margin-top:7rem}@media print{.study-people{display:none}.study-person-link{color:inherit;text-decoration:none}}';document.head.appendChild(style);
 function restore(){const id=location.hash.slice(1);if(id==='study-people'&&isLesson)panel.open=true;if(id==='study-people'||id==='book-view'||/^person-context-\d+$/.test(id)){const target=document.getElementById(id);if(target){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:'auto'});}}}
 // Run after the existing lesson renderer's initial scroll reset.
 if(document.readyState==='complete')setTimeout(restore,350);else window.addEventListener('load',()=>setTimeout(restore,350),{once:true});
})();
