import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
function render(week=0,spanish=false){
 const elements=[],writes=[];let saved=JSON.stringify({completed:[1,3]});
 const make=tag=>{const el={tag,children:[],events:{},value:'',append(...children){this.children.push(...children)},prepend(child){this.children.unshift(child)},setAttribute(k,v){this[k]=v},addEventListener(k,v){this.events[k]=v},focus(){this.focused=true},scrollIntoView(){this.scrolled=true},querySelectorAll(){return []},querySelector(selector){return this.innerHTML?.includes('class="book-lesson james-lesson"')&&selector==='.james-lesson'?{}:this.innerHTML?.includes('class="book-lesson')&&selector==='.book-lesson'?{}:null}};elements.push(el);return el};
 const hero=make('section'),view=make('section'),toggle=make('button'),head=make('head');hero.id='james-hero';view.id='james-view';toggle.id='toggle';head.appendChild=el=>head.append(el);
 const location=new URL('https://nolabelsdesignedbygod.org/'+(spanish?'es/santiago-estudio.html':'james-series.html')+(week?'?week='+week:''));location.reload=()=>{};
 const document={head,readyState:'complete',getElementById:id=>elements.find(e=>e.id===id),createElement:make};
 const localStorage={getItem:k=>{assert.equal(k,'nldg-series-james');return saved},setItem:(k,v)=>{assert.equal(k,'nldg-series-james');writes.push(v);saved=v}};
 const c=vm.createContext({document,location,localStorage,URL,URLSearchParams,setTimeout:fn=>fn()});c.window=c;
 for(const file of ['james-series-data.js','james-series.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
 const loads=head.children.filter(e=>e.tag==='script');assert.equal(loads.length,spanish?0:2);
 if(!spanish){assert.match(loads[0].src,/study-people-pilot.js/);assert.match(loads[1].src,/biblical-study-map-links.js/);vm.runInContext(fs.readFileSync('study-people-pilot.js','utf8'),c);}
 return {view,elements,toggle,writes,read:()=>JSON.parse(saved)};
}
for(const week of [0,1,2,3,4,5,6,7,8,9,10]){
 const r=render(week),panel=r.elements.find(e=>e.id==='study-people');
 assert.equal(panel.tag,week?'details':'section');assert.equal(r.writes.length,0);
 assert.deepEqual(r.read().completed,[1,3]);
 assert.match(r.view.innerHTML,week?/james-lesson/:/james-series-guide/);
 if(week){r.toggle.onclick();assert.deepEqual(r.read().completed,[1,3].includes(week)?[1,3].filter(n=>n!==week):[1,3,week].sort((a,b)=>a-b));}
}
assert.equal(render(2,true).elements.find(e=>e.id==='study-people'),undefined);
console.log('PASS: actual James renderer and people integration across overview/all ten weeks; overview guide does not become a lesson panel; progress read/toggle preserved; Spanish loader excluded.');
