(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;
if(!db)return;

const asArray=value=>Array.isArray(value)?value:(value==null||value===''?[]:[value]);
const records=asArray(db.records).filter(r=>r&&typeof r==='object'&&r.id&&r.name).map(r=>({
  ...r,
  parents:asArray(r.parents),
  spouses:asArray(r.spouses),
  aliases:asArray(r.aliases),
  connections:asArray(r.connections).filter(Boolean)
}));
const byId=new Map(records.map(r=>[r.id,r]));
const children=new Map();
records.forEach(r=>r.parents.forEach(p=>{if(!children.has(p))children.set(p,[]);children.get(p).push(r.id)}));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name=id=>byId.get(id)?.name||id;
const pick=(...ids)=>ids.find(id=>byId.has(id))||ids[0];
const unique=a=>[...new Set(a.filter(v=>v!=null&&v!==''))];
const isCollective=r=>/group|clan|nation/i.test(r.kind||'');
const stats={total:records.length,people:records.filter(r=>!isCollective(r)).length,collective:records.filter(isCollective).length,variants:records.filter(r=>r.certainty!=='explicit').length};

document.querySelectorAll('[data-genealogy-stat="total"]').forEach(el=>el.textContent=stats.total);
document.querySelectorAll('[data-genealogy-stat="people"]').forEach(el=>el.textContent=stats.people);
document.querySelectorAll('[data-genealogy-stat="collective"]').forEach(el=>el.textContent=stats.collective);
document.querySelectorAll('[data-genealogy-stat="variants"]').forEach(el=>el.textContent=stats.variants);

const grid=document.getElementById('biblical-people-grid');
const search=document.getElementById('biblical-people-search');
const lineFilter=document.getElementById('biblical-line-filter');
const kindFilter=document.getElementById('biblical-kind-filter');
const summary=document.getElementById('biblical-people-summary');
const tools=document.querySelector('.bp-tools');

if(!grid||!search||!summary){
 console.warn('Biblical people search controls are missing from the page.');
 return;
}

unique(records.map(r=>r.line)).forEach(v=>lineFilter?.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));
unique(records.map(r=>r.kind)).forEach(v=>kindFilter?.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));

const actions=document.createElement('div');
actions.className='bp-search-actions';
const searchButton=document.createElement('button');
searchButton.type='button';
searchButton.className='button primary';
searchButton.textContent='Search';
searchButton.id='biblical-people-search-button';
const clearButton=document.createElement('button');
clearButton.type='button';
clearButton.className='button secondary';
clearButton.textContent='Clear';
clearButton.id='biblical-people-clear-button';
actions.append(searchButton,clearButton);
tools?.appendChild(actions);

const connectionText=r=>r.connections.map(c=>`${c.type||'connection'}: ${name(c.target)}`);
function familyText(r){
 const p=r.parents.map(name);
 const s=r.spouses.map(name);
 const c=(children.get(r.id)||[]).map(name);
 return [p.length?`Parent${p.length>1?'s':''}: ${p.join(', ')}`:'',s.length?`Spouse${s.length>1?'s':''}: ${s.join(', ')}`:'',c.length?`${c.length>1?'Children':'Child'}: ${c.join(', ')}`:'',...connectionText(r)].filter(Boolean).join(' · ');
}
function certainty(r){
 if(r.certainty==='explicit')return ['Scripture-stated','explicit'];
 if(r.certainty==='probable')return ['Probable relationship','probable'];
 if(r.certainty==='textual variant')return ['Textual variant','variant'];
 if(r.certainty==='unresolved identification')return ['Identity not forced','variant'];
 return [r.certainty||'Review note','variant'];
}
function card(r){
 const [badge,cls]=certainty(r);
 const family=familyText(r);
 return `<article class="bp-card" id="person-${esc(r.id)}"><div class="bp-card-top"><span class="bp-line">${esc(r.line)}</span><span class="bp-certainty ${cls}">${esc(badge)}</span></div><h3>${esc(r.name)}</h3>${r.aliases.length?`<p class="bp-alias">Also/variant: ${r.aliases.map(esc).join(', ')}</p>`:''}<p class="bp-kind">${esc(r.kind)}${r.gender&&r.gender!=='unknown'?` · ${esc(r.gender)}`:''}</p>${family?`<p class="bp-family">${esc(family)}</p>`:''}<p class="bp-ref">${esc(r.ref)}</p>${r.note?`<p class="bp-note">${esc(r.note)}</p>`:''}</article>`;
}
function haystack(r){
 const connectionHay=r.connections.flatMap(c=>[c?.type,name(c?.target),c?.ref,c?.note]);
 return [r.name,r.line,r.kind,r.ref,r.note,r.certainty,...r.aliases,...r.parents.map(name),...r.spouses.map(name),...connectionHay].filter(Boolean).join(' ').toLowerCase();
}
function render({focusResults=false}={}){
 try{
  const q=search.value.trim().toLowerCase();
  const line=lineFilter?.value||'all';
  const kind=kindFilter?.value||'all';
  const matched=records.filter(r=>{
   const matchesText=!q||haystack(r).includes(q);
   return matchesText&&(line==='all'||r.line===line)&&(kind==='all'||r.kind===kind);
  });
  const cap=q||line!=='all'||kind!=='all'?150:80;
  const visible=matched.slice(0,cap);
  grid.innerHTML=visible.map(card).join('');
  if(!matched.length){
   summary.textContent=`No matches found${q?` for “${search.value.trim()}”`:''}. Try an alternate spelling, relative, book, or Scripture reference.`;
  }else if(matched.length>visible.length){
   summary.textContent=`Showing the first ${visible.length} of ${matched.length} matching records. Narrow the search to see a specific person.`;
  }else if(!q&&line==='all'&&kind==='all'){
   summary.textContent=`Showing the first ${visible.length} of ${records.length} records. Start typing a name to search the complete Genesis–Revelation database.`;
  }else{
   summary.textContent=`Showing ${matched.length} matching record${matched.length===1?'':'s'} of ${records.length} total.`;
  }
  if(focusResults)summary.scrollIntoView({behavior:'smooth',block:'nearest'});
 }catch(error){
  console.error('Biblical people search failed:',error);
  summary.textContent='The database search hit an error. Please refresh the page and try again.';
 }
}

let timer;
const scheduleRender=()=>{
 clearTimeout(timer);
 timer=setTimeout(()=>render(),60);
};
search.addEventListener('input',scheduleRender);
search.addEventListener('search',scheduleRender);
search.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();render({focusResults:true});}});
lineFilter?.addEventListener('change',()=>render());
kindFilter?.addEventListener('change',()=>render());
searchButton.addEventListener('click',()=>render({focusResults:true}));
clearButton.addEventListener('click',()=>{
 search.value='';
 if(lineFilter)lineFilter.value='all';
 if(kindFilter)kindFilter.value='all';
 render();
 search.focus();
});
render();

function renderLine(id,ids,title){
 const host=document.getElementById(id);if(!host)return;
 host.innerHTML=`<h3>${esc(title)}</h3><div class="bp-line-chain">${ids.map(x=>`<a href="#person-${esc(x)}">${esc(name(x))}</a>`).join('<span aria-hidden="true">→</span>')}</div>`;
}
function renderGroup(id,ids,title){
 const host=document.getElementById(id);if(!host)return;
 host.innerHTML=`<h3>${esc(title)}</h3><div class="bp-line-chain bp-line-group">${ids.map(x=>`<a href="#person-${esc(x)}">${esc(name(x))}</a>`).join('')}</div>`;
}
renderLine('seth-line',['adam','seth','enosh','kenan','mahalalel','jared','enoch-sethite','methuselah','lamech-sethite','noah'],'Adam to Noah through Seth');
renderLine('shem-line',['noah','shem','arpachshad','shelah','eber','peleg','reu','serug','nahor-ancestor','terah','abram'],'Noah to Abraham through Shem');
renderLine('patriarch-line',['abram','isaac','jacob'],'Abraham to Isaac to Jacob / Israel');
renderGroup('tribes-line',['reuben','simeon','levi','judah','dan','naphtali','gad','asher','issachar','zebulun','joseph','benjamin'],'The twelve sons of Jacob / Israel');
renderLine('davidic-line',['perez','hezron-perez','ram-ruth','amminadab','nahshon','salmon','boaz','obed','jesse','david'],'Perez to David in Ruth 4');
renderGroup('saul-house',['saul','jonathan-saul','ishvi-saul','malchishua','abinadab-saul','merab','michal','ishbosheth','mephibosheth-jonathan'],'Saul’s named royal house across Samuel and Chronicles');
renderLine('davidic-kings-line',['david','solomon','rehoboam',pick('abijam','abijah-judah'),'asa',pick('jehoshaphat-king','jehoshaphat'),'jehoram-judah','ahaziah-judah','joash-judah',pick('amaziah','amaziah-judah'),pick('uzziah','azariah-uzziah'),pick('jotham','jotham-judah'),pick('ahaz','ahaz-judah'),'hezekiah','manasseh-judah','amon-judah','josiah'],'Davidic royal line through Josiah');
renderLine('aaronic-line',['aaron','eleazar-aaron','phinehas','abishua-priest','bukki-priest','uzzi-priest','zerahiah-priest','meraioth-priest','amariah-priest-1','ahitub-priest-1','zadok-ahitub','ahimaaz-zadok'],'Aaronic priestly succession highlighted in Chronicles');
renderLine('postexile-priest-line',['jeshua-jozadak','joiakim-high-priest','eliashib-high-priest','joiada-high-priest','jonathan-high-priest','jaddua-high-priest'],'Post-exile high-priest succession in Nehemiah 12');
renderGroup('wisdom-voices',['job','eliphaz-job','bildad','zophar','elihu-job','agur','lemuel'],'Named voices in Job and Proverbs');
renderGroup('jesus-household',['mary-mother-jesus','joseph-mary','jesus','james-brother-jesus','joseph-brother-jesus','simon-brother-jesus','judas-brother-jesus'],'Jesus’ named household across the Gospels');
renderGroup('gospel-apostles',['simon-peter','andrew-apostle','james-zebedee','john-zebedee','philip-apostle','bartholomew','thomas-apostle','matthew-apostle','james-alphaeus','thaddaeus','judas-of-james','simon-zealot','judas-iscariot'],'Apostolic names across the Gospel lists · Thaddaeus / Judas of James remain visibly unresolved');
})();
