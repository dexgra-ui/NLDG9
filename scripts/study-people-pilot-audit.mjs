import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Exercise the actual database and selected-person rendering without a browser.
const html=fs.readFileSync('biblical-people-genealogy.html','utf8');
const scripts=[...html.matchAll(/<script src="(biblical-people-genealogy[^"?]*\.js)/g)].map(m=>m[1]);
function run(query){
 const made=[];
 const element=()=>({children:[],style:{},value:'',firstElementChild:{},append(...items){this.children.push(...items);},before(item){made.push(item);},setAttribute(){},insertAdjacentHTML(){},addEventListener(){},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}});
 const controls=new Map(['biblical-people-grid','biblical-people-search','biblical-people-summary'].map(id=>[id,element()]));
 const document={readyState:'complete',getElementById:id=>controls.get(id)||null,querySelector:()=>null,querySelectorAll:()=>[],createElement:element,createTextNode:text=>text};
 const location=new URL('https://nolabelsdesignedbygod.org/biblical-people-genealogy.html'+query);
 const context=vm.createContext({document,location,URL,URLSearchParams,console,setTimeout,clearTimeout,requestAnimationFrame:callback=>callback()});context.window=context;
 for(const script of scripts)vm.runInContext(fs.readFileSync(script,'utf8'),context,{filename:script});
 return {profile:made[0],db:context.NLDG_BIBLICAL_GENEALOGY};
}
const safe='/ruth-study.html?lesson=2#person-context-4';
const result=run('?person=boaz&return='+encodeURIComponent(safe));
assert.equal(result.profile.children[0].href,'https://nolabelsdesignedbygod.org'+safe);
assert.match(result.profile.children[1].innerHTML,/Boaz/);
assert.equal(result.profile.focused,true);
assert.equal(result.profile.scrolled,true);
assert.equal(result.profile.children[1].firstElementChild.id,'selected-person-boaz');
assert.ok(result.profile.children[1].children[0].children.some(a=>a.textContent==='Ruth'));
// An existing non-study page still must be rejected by the return-path allowlist.
for(const bad of ['https://evil.example/ruth-study.html','//evil.example/ruth-study.html','javascript:alert(1)','/index.html']){
 assert.equal(run('?person=ruth&return='+encodeURIComponent(bad)).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
}
assert.match(run('?person=missing').profile.children[1].textContent,/could not be found/);
assert.equal(run('').profile,undefined);
for(const id of ['ruth','naomi','boaz','orpah','mahlon','elimelech','obed','jesse','david'])assert.ok(result.db.records.some(r=>r.id===id),id);
assert.match(run('?person=orpah').profile.children[1].innerHTML,/Probable|inferred|normally understood/i);
console.log('PASS: pilot IDs, exact record, family links, return context, unsafe return rejection, missing ID, direct reference, and uncertainty labels. Browser/mobile/print QA remains required.');
