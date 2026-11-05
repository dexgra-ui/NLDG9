import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('study-people-pilot.js','utf8');
function run(book,lesson=false,hash=''){
 const elements=[];
 const make=tag=>{const el={tag,children:[],value:'',hidden:false,events:{},append(...children){this.children.push(...children);},prepend(child){this.children.unshift(child);},setAttribute(name,value){this[name]=value;},addEventListener(name,fn){this.events[name]=fn;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},querySelectorAll(){return [];},querySelector(){return lesson?{}:null;}};elements.push(el);return el;};
 const view=make('div');view.id='book-view';
 const document={readyState:'complete',head:make('head'),getElementById:id=>elements.find(el=>el.id===id),createElement:make};
 document.head.appendChild=child=>document.head.append(child);
 const location=new URL(`https://nolabelsdesignedbygod.org/${book}-study.html${lesson?'?lesson=2':''}${hash}`);
 vm.runInNewContext(source,{document,location,URL,Set,RegExp,setTimeout:fn=>fn()});
 return {elements,panel:elements.find(el=>el.id==='study-people'),input:elements.find(el=>el.id==='study-people-search'),list:elements.find(el=>el.id==='study-people-list')};
}
for(const book of ['ruth','esther','genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"])for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);
 if(lesson)assert.equal(r.panel.open,true);
 const personRows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 const links=personRows.map(row=>row.children[0]);assert.equal(links.length,{"first-chronicles":12,"second-chronicles":12,"ezra":11,"nehemiah":10}[book]??(book==='second-kings'?18:['judges','first-samuel','second-samuel','first-kings'].includes(book)?14:book==='joshua'?10:book==='deuteronomy'?13:book==='numbers'?14:book==='exodus'?10:book==='genesis'?11:book==='esther'?6:8));
 assert.equal(new Set(links.map(a=>new URL(a.href).searchParams.get('person'))).size,links.length);
 for(const link of links){const url=new URL(link.href);assert.equal(url.searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);}
 r.input.value={"first-chronicles":"jeduthun","second-chronicles":"huldah","ezra":"sheshbazzar","nehemiah":"gashmu"}[book]??(book==='second-kings'?'jehoshabeath':book==='first-kings'?'administrator':book==='second-samuel'?'jedidiah':book==='first-samuel'?'carmel':book==='judges'?'jerubbaal':book==='joshua'?'aksah':book==='deuteronomy'?'abram':book==='numbers'?'noah':book==='leviticus'?'shelomith':book==='exodus'?'puah':book==='genesis'?'sarai':book==='esther'?'hadassah':'kilion');r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,1);
 if(book==='second-kings')assert.equal(new URL(personRows.find(row=>!row.hidden).children[0].href).searchParams.get('person'),'jehosheba');
 if(book==='numbers')assert.equal(new URL(personRows.find(row=>!row.hidden).children[0].href).searchParams.get('person'),'noah-zelophehad');
 if(['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"].includes(book))assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,1);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,links.length);
 if(['genesis','exodus','leviticus','numbers','deuteronomy','joshua','judges','first-samuel','second-samuel','first-kings','second-kings',"first-chronicles","second-chronicles","ezra","nehemiah"].includes(book))assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,3);
 if(book==='exodus'){assert.ok(r.elements.some(el=>el.textContent?.includes('not named in the Exodus narrative')));assert.ok(links.every(link=>!new URL(link.href).searchParams.get('person').includes('pharaoh')));}
}
assert.ok(fs.readFileSync('book-study-series.js','utf8').includes("if(['/ruth-study.html','/esther-study.html','/genesis-study.html','/exodus-study.html','/leviticus-study.html','/numbers-study.html','/deuteronomy-study.html','/joshua-study.html','/judges-study.html','/first-samuel-study.html','/second-samuel-study.html','/first-kings-study.html','/second-kings-study.html','/first-chronicles-study.html','/second-chronicles-study.html','/ezra-study.html','/nehemiah-study.html','/job-study.html','/psalms-study.html','/proverbs-study.html','/ecclesiastes-study.html','/song-of-songs-study.html'].includes(location.pathname))"));
console.log('PASS: All enabled study overview and lesson lists, groups, aliases, empty/reset searches, unique profiles, exact returns, and reopening the lesson panel.');

const wisdomLists={"job":{"count":8,"groups":3,"search":"jemima","id":"jemimah","note":"Job’s wife and his initial children are not named. Eliphaz the Temanite is not identified here with Eliphaz son of Esau."},"psalms":{"count":9,"groups":3,"search":"ethan","id":"ethan-ezrahite","note":"Psalm headings preserve associations with named people; these labels do not settle every authorship question. Heman and Ethan the Ezrahites retain the identity cautions in their profiles. The sons of Korah are a collective group, not one named individual."},"proverbs":{"count":5,"groups":2,"search":"jakeh","id":"agur","note":"Woman Wisdom and Woman Folly are poetic personifications. Lemuel’s mother and the woman of Proverbs 31 are unnamed; Agur and Lemuel are not identified with Solomon."},"ecclesiastes":{"count":1,"groups":0,"search":"david","id":"david","note":"Ecclesiastes calls the Teacher / Preacher / Qoheleth a son of David but does not give the speaker a personal name. Solomon is a traditional identification, not an explicitly named speaker in this book. David is listed as a named reference, not as its speaker."},"song-of-songs":{"count":1,"groups":0,"search":"solomon","id":"solomon","note":"Solomon is named in the title and poem. His relationship to the lovers is debated. The Shulamite is a designation, not a supplied personal name, and the lovers are not assigned invented identities here."}};
for(const [book,c] of Object.entries(wisdomLists))for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');
 assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);if(lesson)assert.equal(r.panel.open,true);
 const rows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 assert.equal(rows.length,c.count);assert.equal(new Set(rows.map(row=>new URL(row.children[0].href).searchParams.get('person'))).size,c.count);
 for(const row of rows)assert.equal(new URL(row.children[0].href).searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);
 assert.ok(r.elements.some(el=>el.textContent===c.note));
 assert.equal(r.list.children.filter(row=>row.className==='study-people-group').length,c.groups);
 r.input.value=c.search;r.input.events.input();const visible=rows.filter(row=>!row.hidden);assert.equal(visible.length,1);assert.equal(new URL(visible[0].children[0].href).searchParams.get('person'),c.id);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(rows.filter(row=>!row.hidden).length,c.count);
}
console.log('PASS: wisdom-book lists, small lists, identity notes, aliases, groups, empty/reset searches and exact returns.');
