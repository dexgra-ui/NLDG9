(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const byId=new Map(db.records.map(r=>[r.id,r]));
const children=new Map();
db.records.forEach(r=>(r.parents||[]).forEach(p=>{if(!children.has(p))children.set(p,[]);children.get(p).push(r.id)}));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name=id=>byId.get(id)?.name||id;
const unique=a=>[...new Set(a)];
const isCollective=r=>/group|clan|nation/i.test(r.kind||'');
const stats={total:db.records.length,people:db.records.filter(r=>!isCollective(r)).length,collective:db.records.filter(isCollective).length,variants:db.records.filter(r=>r.certainty!=='explicit').length};

document.querySelectorAll('[data-genealogy-stat="total"]').forEach(el=>el.textContent=stats.total);
document.querySelectorAll('[data-genealogy-stat="people"]').forEach(el=>el.textContent=stats.people);
document.querySelectorAll('[data-genealogy-stat="collective"]').forEach(el=>el.textContent=stats.collective);
document.querySelectorAll('[data-genealogy-stat="variants"]').forEach(el=>el.textContent=stats.variants);

const grid=document.getElementById('biblical-people-grid');
const search=document.getElementById('biblical-people-search');
const lineFilter=document.getElementById('biblical-line-filter');
const kindFilter=document.getElementById('biblical-kind-filter');
const summary=document.getElementById('biblical-people-summary');

const lines=unique(db.records.map(r=>r.line));
if(lineFilter){lines.forEach(v=>lineFilter.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));}
const kinds=unique(db.records.map(r=>r.kind));
if(kindFilter){kinds.forEach(v=>kindFilter.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));}

const connectionText=r=>(r.connections||[]).map(c=>`${c.type}: ${name(c.target)}`);
function familyText(r){
  const p=(r.parents||[]).map(name);
  const s=(r.spouses||[]).map(name);
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
 return `<article class="bp-card" id="person-${esc(r.id)}"><div class="bp-card-top"><span class="bp-line">${esc(r.line)}</span><span class="bp-certainty ${cls}">${esc(badge)}</span></div><h3>${esc(r.name)}</h3>${r.aliases?.length?`<p class="bp-alias">Also/variant: ${r.aliases.map(esc).join(', ')}</p>`:''}<p class="bp-kind">${esc(r.kind)}${r.gender&&r.gender!=='unknown'?` · ${esc(r.gender)}`:''}</p>${familyText(r)?`<p class="bp-family">${esc(familyText(r))}</p>`:''}<p class="bp-ref">${esc(r.ref)}</p>${r.note?`<p class="bp-note">${esc(r.note)}</p>`:''}</article>`;
}
function render(){
 const q=(search?.value||'').trim().toLowerCase();
 const line=lineFilter?.value||'all';
 const kind=kindFilter?.value||'all';
 const rows=db.records.filter(r=>{
   const connectionHay=(r.connections||[]).flatMap(c=>[c.type,name(c.target),c.ref,c.note]);
   const hay=[r.name,r.line,r.kind,r.ref,r.note,r.certainty,...(r.aliases||[]),...(r.parents||[]).map(name),...(r.spouses||[]).map(name),...connectionHay].join(' ').toLowerCase();
   return (!q||hay.includes(q))&&(line==='all'||r.line===line)&&(kind==='all'||r.kind===kind);
 });
 if(grid)grid.innerHTML=rows.map(card).join('');
 if(summary)summary.textContent=`Showing ${rows.length} of ${db.records.length} ${db.scope||'biblical'} records.`;
}
[search,lineFilter,kindFilter].forEach(el=>el?.addEventListener(el===search?'input':'change',render));
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
renderLine('davidic-kings-line',['david','solomon','rehoboam','abijah-judah','asa','jehoshaphat','jehoram-judah','ahaziah-judah','joash-judah','amaziah-judah','azariah-uzziah','jotham-judah','ahaz-judah','hezekiah','manasseh-judah','amon-judah','josiah'],'Davidic royal line through Josiah');
renderLine('aaronic-line',['aaron','eleazar-aaron','phinehas','abishua-priest','bukki-priest','uzzi-priest','zerahiah-priest','meraioth-priest','amariah-priest-1','ahitub-priest-1','zadok-ahitub','ahimaaz-zadok'],'Aaronic priestly succession highlighted in Chronicles');
renderLine('postexile-priest-line',['jeshua-jozadak','joiakim-high-priest','eliashib-high-priest','joiada-high-priest','jonathan-high-priest','jaddua-high-priest'],'Post-exile high-priest succession in Nehemiah 12');
renderGroup('wisdom-voices',['job','eliphaz-job','bildad','zophar','elihu-job','agur','lemuel'],'Named voices in Job and Proverbs');
})();