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
for(const book of ['ruth','esther','genesis'])for(const lesson of [false,true]){
 const r=run(book,lesson,'#study-people');assert.equal(r.panel.tag,lesson?'details':'section');assert.equal(r.panel.focused,true);
 if(lesson)assert.equal(r.panel.open,true);
 const personRows=r.list.children.filter(row=>row.children[0]?.tag==='a');
 const links=personRows.map(row=>row.children[0]);assert.equal(links.length,book==='genesis'?11:book==='esther'?6:8);
 assert.equal(new Set(links.map(a=>new URL(a.href).searchParams.get('person'))).size,links.length);
 for(const link of links){const url=new URL(link.href);assert.equal(url.searchParams.get('return'),`/${book}-study.html${lesson?'?lesson=2':''}#study-people`);}
 r.input.value=book==='genesis'?'sarai':book==='esther'?'hadassah':'kilion';r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,1);
 if(book==='genesis')assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,1);
 r.input.value='no such person';r.input.events.input();assert.equal(r.list.children.filter(row=>!row.hidden).length,0);
 r.input.value='';r.input.events.input();assert.equal(personRows.filter(row=>!row.hidden).length,links.length);
 if(book==='genesis')assert.equal(r.list.children.filter(row=>row.className==='study-people-group'&&!row.hidden).length,3);
}
assert.ok(fs.readFileSync('book-study-series.js','utf8').includes("if(['/ruth-study.html','/esther-study.html','/genesis-study.html'].includes(location.pathname))"));
console.log('PASS: Ruth/Esther/Genesis overview and lesson lists, groups, aliases, empty/reset searches, unique profiles, exact returns, and reopening the lesson panel.');
