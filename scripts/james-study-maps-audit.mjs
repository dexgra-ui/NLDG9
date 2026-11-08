import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('biblical-study-map-links.js','utf8');
function mapLinks(path,{y=650,anchor=false}={}){
 const elements=[],scrolls=[],events={},historyCalls=[];
 const make=tag=>{const el={tag,children:[],dataset:{},events:{},appendChild(c){this.children.push(c)},setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},addEventListener(k,fn){this.events[k]=fn},querySelectorAll(){return [...this.innerHTML.matchAll(/<a href="([^"]+)">/g)].map(m=>{const a=make('a');a.href=m[1];return a})}};elements.push(el);return el};
 const hero=make('section');hero.insertAdjacentElement=(where,section)=>{assert.equal(where,'afterend');hero.map=section};
 const document={head:make('head'),createElement:make,querySelector:()=>hero.map||null,getElementById:id=>id===(path.startsWith('/james-series.html')?'james-hero':'book-hero')?hero:anchor&&id==='passage'?{scrollIntoView(){scrolls.push('anchor')}}:null};
 const location=new URL('https://nolabelsdesignedbygod.org'+path),window={scrollY:y,NLDG_BOOK_STUDY:path.startsWith('/genesis')?{book:'Genesis'}:undefined,addEventListener:(k,fn)=>events[k]=fn,scrollTo:pos=>scrolls.push(pos.top)};
 const history={state:null,replaceState:(state,title,url)=>historyCalls.push(url)};
 const context=vm.createContext({window,document,location,history,URL,URLSearchParams,requestAnimationFrame:fn=>fn(),setTimeout:fn=>fn()});
 vm.runInContext(source,context);
 const links=elements.filter(el=>el.tag==='a');
 if(hero.map){vm.runInContext(source,context);assert.equal(elements.filter(e=>e.className==='book-geography-resource').length,1)}
 return {hero,links,location,scrolls,historyCalls,window};
}
function backLink(mapUrl){
 const navs=[],make=tag=>({tag,children:[],dataset:{},setAttribute(){},appendChild(c){this.children.push(c)}}),main={querySelector:()=>false,prepend:nav=>navs.push(nav),append:nav=>navs.push(nav)};
 const context={window:{},location:new URL(mapUrl),URL,URLSearchParams,document:{readyState:'complete',head:{appendChild(){}},createElement:make,querySelector:()=>main}};
 vm.runInNewContext(fs.readFileSync('biblical-map-return.js','utf8'),context);
 assert.equal(navs.length,2);assert.equal(navs[0].children[0].href,navs[1].children[0].href);
 return navs[0].children[0];
}
for(const week of [0,1,2,3,4,5,6,7,8,9,10]){
 const path='/james-series.html'+(week?'?week='+week:'')+'#passage',r=mapLinks(path);
 assert.match(r.hero.map.innerHTML,/twelve tribes in the Dispersion/);
 assert.match(r.hero.map.innerHTML,/does not claim a precise writing location/);
 assert.equal(r.links.length,2);assert.equal(r.links[1].href,'biblical-maps.html');
 const a=r.links[0];let target=new URL(a.href,r.location);
 assert.equal(target.pathname,'/biblical-map-world.html');assert.equal(target.searchParams.get('return'),path);assert.equal(target.searchParams.get('returnLabel'),'James Study');assert.equal(target.searchParams.get('returnY'),'650');
 r.window.scrollY=1250;a.events.pointerdown();target=new URL(a.href,r.location);assert.equal(target.searchParams.get('returnY'),'1250');
 const back=backLink(target.href),url=new URL(back.href,r.location);
 assert.equal(back.textContent,'← Back to James Study');assert.equal(url.pathname,'/james-series.html');assert.equal(url.searchParams.get('week'),week?String(week):null);assert.equal(url.hash,'#passage');assert.equal(url.searchParams.get('nldgMapReturnY'),'1250');
 const restored=mapLinks(url.pathname+url.search+url.hash,{anchor:true});assert.ok(restored.scrolls.includes('anchor'));assert.ok(restored.historyCalls.every(v=>!v.includes('nldgMapReturnY')));
}
const restored=mapLinks('/james-series.html?week=4&nldgMapReturnY=900');assert.ok(restored.scrolls.includes(900));
assert.equal(mapLinks('/james-series.html?week=4&nldgMapReturnY=-2').scrolls.length,0);
assert.equal(mapLinks('/es/santiago-estudio.html?week=2').hero.map,undefined);
assert.equal(backLink('https://nolabelsdesignedbygod.org/biblical-map-world.html?return=https://evil.example').href,'biblical-maps.html');
const genesis=mapLinks('/genesis-study.html?lesson=5#book-view');assert.equal(genesis.links.length,3);assert.equal(new URL(genesis.links[0].href,genesis.location).searchParams.get('return'),'/genesis-study.html?lesson=5#book-view');
console.log('PASS: James overview/all weeks map links, context notes, click-time position, actual map back links, anchor/scroll restoration, duplicate guard, Spanish exclusion, unsafe return rejection and Genesis regression.');
