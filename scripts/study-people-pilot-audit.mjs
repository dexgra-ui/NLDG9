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
const estherReturn='/esther-study.html?lesson=3#person-context-5';
const estherResult=run('?person=mordecai-esther&return='+encodeURIComponent(estherReturn));
assert.equal(estherResult.profile.children[0].href,'https://nolabelsdesignedbygod.org'+estherReturn);
assert.equal(estherResult.profile.children[0].textContent,'← Back to Esther study');
assert.equal(estherResult.profile.children[1].firstElementChild.id,'selected-person-mordecai-esther');
assert.equal(estherResult.profile.scrolled,true);
assert.match(estherResult.profile.children[1].innerHTML,/Distinct from the Mordecai named in Ezra/);
for(const id of ['esther','mordecai-esther','haman','vashti','ahasuerus-esther','zeresh','hegai','hathach','abihail-esther'])assert.ok(result.db.records.some(r=>r.id===id),id);
console.log('PASS: pilot IDs, exact record, family links, return context, unsafe return rejection, missing ID, direct reference, and uncertainty labels. Browser/mobile/print QA remains required.');
for(const lesson of ['', '?lesson=8']){
 const back='/genesis-study.html'+lesson+'#study-people';
 const profile=run('?person=joseph&return='+encodeURIComponent(back)).profile;
 assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
 assert.equal(profile.children[0].textContent,'← Back to Genesis study');
 assert.match(profile.children[1].innerHTML,/Son of Jacob and Rachel/);
 assert.equal(profile.scrolled,true);
}
for(const id of ['adam','eve','noah','abram','sarai','isaac','rebekah','jacob','leah','rachel','joseph'])assert.ok(result.db.records.some(r=>r.id===id),id);
assert.equal(run('?person=adam&return='+encodeURIComponent('https://evil.example/genesis-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Genesis exact identities, overview/lesson returns, profile scrolling, and unsafe return rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/exodus-study.html'+lesson+'#study-people';
 const profile=run('?person=miriam&return='+encodeURIComponent(back)).profile;
 assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
 assert.equal(profile.children[0].textContent,'← Back to Exodus study');
 assert.match(profile.children[1].innerHTML,/<h3>Miriam<\/h3>/);
 assert.equal(profile.scrolled,true);
}
const miriam=result.db.records.find(r=>r.id==='miriam');
assert.equal(miriam.name,'Miriam');assert.equal(miriam.gender,'female');assert.equal(miriam.kind,'Person');
assert.ok(miriam.parents.includes('amram'));assert.ok(miriam.parents.includes('jochebed'));
for(const id of ['moses','aaron','miriam','jochebed','amram','shiphrah','puah-midwife','zipporah','jethro','joshua'])assert.ok(result.db.records.some(r=>r.id===id),id);
assert.match(run('?person=jethro').profile.children[1].innerHTML,/unresolved|Identity not forced|not force|rather than silently/i);
assert.equal(run('?person=moses&return='+encodeURIComponent('https://evil.example/exodus-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Exodus IDs, Miriam schema, exact returns, profile scroll, Jethro caveat, and unsafe return rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/leviticus-study.html'+lesson+'#study-people';
 for(const id of ['moses','aaron','nadab-aaron','abihu','eleazar-aaron','ithamar','shelomith-dibri','dibri']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to Leviticus study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);
  assert.equal(profile.scrolled,true);
 }
}
assert.match(run('?person=nadab-aaron').profile.children[1].innerHTML,/Son of Aaron/);
assert.match(run('?person=shelomith-dibri').profile.children[1].innerHTML,/daughter of Dibri/i);
assert.equal(run('?person=aaron&return='+encodeURIComponent('https://evil.example/leviticus-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Leviticus profiles, distinct identities, overview/lesson returns, automatic scrolling and unsafe return rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/numbers-study.html'+lesson+'#study-people';
 for(const id of ['moses','aaron','miriam','joshua','caleb-jephunneh','korah-izhar','balak','balaam','zelophehad','mahlah-zelophehad','noah-zelophehad','hoglah','milcah-zelophehad','tirzah-zelophehad']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to Numbers study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
for(const id of ['noah-zelophehad','milcah-zelophehad'])assert.ok(result.db.records.find(r=>r.id===id).parents.includes('zelophehad'));
assert.equal(run('?person=moses&return='+encodeURIComponent('https://evil.example/numbers-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Numbers profile IDs, daughters’ identities, exact overview/lesson returns and unsafe return rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/deuteronomy-study.html'+lesson+'#study-people';
 for(const id of ['moses','aaron','eleazar-aaron','joshua','caleb-jephunneh','abram','isaac','jacob','dathan','abiram-eliab','sihon','og','balaam']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to Deuteronomy study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.equal(run('?person=moses&return='+encodeURIComponent('https://evil.example/deuteronomy-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
assert.match(run('?person=abiram-eliab').profile.children[1].innerHTML,/Son of Eliab/);
console.log('PASS: Deuteronomy IDs, overview/lesson returns, profile scrolling, Abiram identity and unsafe return rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/joshua-study.html'+lesson+'#study-people';
 for(const id of ['joshua','caleb-jephunneh','eleazar-aaron','phinehas','rahab','achan','othniel','achsah','adoni-zedek','jabin-hazor-joshua']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to Joshua study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.match(run('?person=jabin-hazor-joshua').profile.children[1].innerHTML,/distinct from the later Jabin/i);
assert.match(run('?person=othniel').profile.children[1].innerHTML,/Identity not forced/);
assert.match(run('?person=othniel').profile.children[1].innerHTML,/kinsman of: Caleb/);
assert.equal(run('?person=rahab&return='+encodeURIComponent('https://evil.example/joshua-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Joshua IDs, exact returns, automatic scroll, Jabin/Othniel caveats and unsafe URL rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/judges-study.html'+lesson+'#study-people';
 for(const id of ['othniel','ehud','shamgar','deborah-judge','barak','gideon','jephthah','samson','jael','delilah','jotham-gideon','abimelech-gideon','sisera','jabin-hazor-judges']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to Judges study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.match(run('?person=jabin-hazor-judges').profile.children[1].innerHTML,/distinct from Jabin king of Hazor in Joshua/i);
assert.equal(result.db.records.find(r=>r.id==='deborah-judge').gender,'female');
assert.ok(result.db.records.find(r=>r.id==='abimelech-gideon').parents.includes('gideon'));
assert.equal(run('?person=jael&return='+encodeURIComponent('https://evil.example/judges-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: Judges IDs, exact returns, automatic scroll, distinct identities and unsafe URL rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/first-samuel-study.html'+lesson+'#study-people';
 for(const id of ['samuel','hannah','elkanah-samuel','peninnah','eli','saul','jonathan-saul','michal','abner','david','jesse','goliath','abigail-carmel','nabal']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to 1 Samuel study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.ok(result.db.records.find(r=>r.id==='jonathan-saul').parents.includes('saul'));
assert.ok(result.db.records.find(r=>r.id==='elkanah-samuel').spouses.includes('hannah'));
assert.ok(result.db.records.find(r=>r.id==='abigail-carmel').spouses.includes('nabal'));
assert.equal(run('?person=hannah&return='+encodeURIComponent('https://evil.example/first-samuel-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: 1 Samuel IDs, distinct families, exact returns, profile scroll and unsafe URL rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/second-samuel-study.html'+lesson+'#study-people';
 for(const id of ['david','nathan-prophet','joab','abner','michal','bathsheba','solomon','amnon','absalom','tamar-david','uriah','ishbosheth','mephibosheth-jonathan','rizpah']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to 2 Samuel study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.ok(result.db.records.find(r=>r.id==='tamar-david').parents.includes('david'));
assert.ok(result.db.records.find(r=>r.id==='mephibosheth-jonathan').parents.includes('jonathan-saul'));
assert.equal(result.db.records.find(r=>r.id==='nathan-prophet').kind,'Prophet');
assert.equal(run('?person=david&return='+encodeURIComponent('https://evil.example/second-samuel-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: 2 Samuel IDs, exact returns, profile scroll, distinct Tamar/Mephibosheth/Nathan identities and unsafe URL rejection.');
for(const lesson of ['', '?lesson=2']){
 const back='/first-kings-study.html'+lesson+'#study-people';
 for(const id of ['david','solomon','bathsheba','nathan-prophet','rehoboam','jeroboam-i','ahab','jezebel','elijah','elisha','ahijah-shilonite','micaiah-imlah','obadiah-ahab','naboth']){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to 1 Kings study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.ok(result.db.records.find(r=>r.id==='jeroboam-i').parents.includes('nebat'));
assert.equal(result.db.records.find(r=>r.id==='obadiah-ahab').kind,'Official');
assert.equal(result.db.records.find(r=>r.id==='ahijah-shilonite').kind,'Prophet');
assert.equal(run('?person=elijah&return='+encodeURIComponent('https://evil.example/first-kings-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: 1 Kings IDs, exact returns, auto-scroll, distinct identities and unsafe URL rejection.');

for(const lesson of ['', '?lesson=2']){
 const back='/second-kings-study.html'+lesson+'#study-people';
 for(const id of ["elijah", "elisha", "naaman-syria", "gehazi", "jehu-king", "jezebel", "athaliah", "jehosheba", "joash-judah", "jehoiada-priest", "hezekiah", "isaiah", "manasseh-judah", "josiah", "huldah", "nebuchadnezzar", "zedekiah", "jehoiachin"]){
  const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
  assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
  assert.equal(profile.children[0].textContent,'← Back to 2 Kings study');
  assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);assert.equal(profile.scrolled,true);
 }
}
assert.ok(result.db.records.find(r=>r.id==='joash-judah').parents.includes('ahaziah-judah'));
assert.ok(result.db.records.find(r=>r.id==='manasseh-judah').parents.includes('hezekiah'));
assert.equal(result.db.records.find(r=>r.id==='huldah').kind,'Prophet');
assert.equal(run('?person=elisha&return='+encodeURIComponent('https://evil.example/second-kings-study.html')).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
console.log('PASS: 2 Kings IDs, exact returns, auto-scroll, distinct Joash/Manasseh identities and unsafe URL rejection.');

const historyBatch={"first-chronicles":{"name":"1 Chronicles","ids":["david","saul","jonathan-saul","solomon","joab","benaiah-jehoiada","nathan-prophet","gad-prophet","asaph-singer","heman-singer","jeduthun","araunah"]},"second-chronicles":{"name":"2 Chronicles","ids":["solomon","rehoboam","abijam","asa","jehoshaphat-king","joash-judah","hezekiah","manasseh-judah","josiah","huldah","nebuchadnezzar","cyrus"]},"ezra":{"name":"Ezra","ids":["zerubbabel","jeshua-jozadak","sheshbazzar","ezra-scribe","haggai","zechariah-return-prophet","shecaniah-jehiel","cyrus","darius-ezra","artaxerxes-ezra","tattenai"]},"nehemiah":{"name":"Nehemiah","ids":["nehemiah-governor","hanani-nehemiah","hananiah-citadel","artaxerxes-ezra","ezra-scribe","eliashib-high-priest","sanballat","tobiah-ammonite","geshem","noadiah-prophetess"]}};
Object.assign(historyBatch,{"job":{"name":"Job","ids":["job","eliphaz-job","bildad","zophar","elihu-job","jemimah","keziah-job","keren-happuch"]},"psalms":{"name":"Psalms","ids":["david","solomon","moses","asaph-singer","jeduthun","heman-ezrahite","ethan-ezrahite","aaron","samuel"]},"proverbs":{"name":"Proverbs","ids":["solomon","david","hezekiah","agur","lemuel"]},"ecclesiastes":{"name":"Ecclesiastes","ids":["david"]},"song-of-songs":{"name":"Song of Songs","ids":["solomon"]}});
for(const [book,{name,ids}] of Object.entries(historyBatch)){
 for(const lesson of ['', '?lesson=2']){
  const back=`/${book}-study.html${lesson}#study-people`;
  for(const id of ids){
   const profile=run('?person='+id+'&return='+encodeURIComponent(back)).profile;
   assert.equal(profile.children[0].href,'https://nolabelsdesignedbygod.org'+back);
   assert.equal(profile.children[0].textContent,'← Back to '+name+' study');
   assert.equal(profile.children[1].firstElementChild.id,'selected-person-'+id);
   assert.equal(profile.scrolled,true);
  }
 }
 const passage=`/${book}-study.html?lesson=2#person-context-4`;
 assert.equal(run('?person='+ids[0]+'&return='+encodeURIComponent(passage)).profile.children[0].href,'https://nolabelsdesignedbygod.org'+passage);
 assert.equal(run('?person='+ids[0]+'&return='+encodeURIComponent(`https://evil.example/${book}-study.html`)).profile.children[0].href,'https://nolabelsdesignedbygod.org/studies.html');
 console.log('PASS: '+name+' profiles, overview/lesson/passage returns, scrolling and unsafe return rejection.');
}
assert.ok(result.db.records.find(r=>r.id==='nehemiah-governor').parents.includes('hachaliah'));
assert.ok(result.db.records.find(r=>r.id==='jeshua-jozadak').ref.includes('Ezra 3:2'));
assert.ok(result.db.records.find(r=>r.id==='shecaniah-jehiel').parents.includes('jehiel-shecaniah'));

assert.ok(result.db.records.find(r=>r.id==='elihu-job').parents.includes('barachel'));
assert.ok(result.db.records.find(r=>r.id==='jemimah').parents.includes('job'));
assert.equal(result.db.records.find(r=>r.id==='heman-ezrahite').certainty,'unresolved identification');
assert.equal(result.db.records.find(r=>r.id==='ethan-ezrahite').certainty,'unresolved identification');
assert.ok(result.db.records.find(r=>r.id==='agur').parents.includes('jakeh'));
