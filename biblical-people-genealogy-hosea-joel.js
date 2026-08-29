(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='')=>{for(const id of ids){if(merge(id,{ref,note}))return id;}return null;};

// Hosea 1 royal framework.
addAny(['uzziah','azariah-uzziah'],'Hosea 1:1','Uzziah is named in Hosea’s opening royal chronology.');
addAny(['jotham','jotham-judah'],'Hosea 1:1','Jotham is named in Hosea’s opening royal chronology.');
addAny(['ahaz','ahaz-judah'],'Hosea 1:1','Ahaz is named in Hosea’s opening royal chronology.');
addAny(['hezekiah'],'Hosea 1:1','Hezekiah is named in Hosea’s opening royal chronology.');
addAny(['jeroboam-ii'],'Hosea 1:1','Jeroboam son of Joash is named as king of Israel in Hosea’s opening chronology.');
addAny(['jehoash-israel'],'Hosea 1:1','Joash/Jehoash is named as father of Jeroboam II.');

put(R('beeri-hosea','Beeri','Hosea family','Person','male',[],[],'Hosea 1:1','Father of the prophet Hosea.'));
put(R('hosea-prophet','Hosea','Prophets / northern kingdom','Prophet','male',['beeri-hosea'],['gomer-hosea'],'Hosea 1:1–3','Son of Beeri and husband of Gomer daughter of Diblaim.','explicit',['Hosea son of Beeri']));
put(R('diblaim','Diblaim','Hosea family','Person','male',[],[],'Hosea 1:3','Father of Gomer.'));
put(R('gomer-hosea','Gomer','Hosea family','Person','female',['diblaim'],['hosea-prophet'],'Hosea 1:3–8','Daughter of Diblaim and wife of Hosea. She bears the three symbolically named children in Hosea 1.','explicit',['Gomer daughter of Diblaim']));
put(R('jezreel-hosea','Jezreel','Hosea family','Person','male',['hosea-prophet','gomer-hosea'],[],'Hosea 1:3–5','Named son born to Hosea and Gomer; his name becomes a prophetic sign concerning the house of Jehu and the valley of Jezreel.'));
put(R('lo-ruhamah','Lo-Ruhamah','Hosea family','Person','female',['gomer-hosea'],[],'Hosea 1:6–8','Named daughter born when Gomer conceives again. The continuing marriage context strongly suggests Hosea as father, but verse 6 explicitly names only Gomer as the one who conceives and gives birth, so paternal parentage is not silently inserted.','explicit',['Lo-Ruhamah'],[C('probable father','hosea-prophet','Hosea 1:3–6','Household context suggests Hosea, but the verse does not repeat the father statement used for Jezreel.') ]));
put(R('lo-ammi','Lo-Ammi','Hosea family','Person','male',['gomer-hosea'],[],'Hosea 1:8–9','Named son born after Lo-Ruhamah is weaned. The text continues Gomer’s births but does not explicitly restate Hosea as father, so the database keeps that paternal link labeled rather than assumed.','explicit',['Lo-Ammi'],[C('probable father','hosea-prophet','Hosea 1:3–9','Continuing household context suggests Hosea, but the immediate verse does not explicitly state the father.') ]));
addAny(['jacob'],'Hosea 12:2–5,12','Hosea explicitly names Jacob in its ancestral retelling; several uses also extend the name collectively to Israel.');

// Joel.
put(R('pethuel','Pethuel','Joel family','Person','male',[],[],'Joel 1:1','Father of the prophet Joel.'));
put(R('joel-prophet','Joel','Prophets / Judah','Prophet','male',['pethuel'],[],'Joel 1:1','Prophet explicitly identified as son of Pethuel. Distinct from the many other biblical men named Joel.','explicit',['Joel son of Pethuel']));
// Joel names no human king in its superscription, so no reign is inferred from chronology theories.

db.scope='Genesis–Joel';db.phase=10;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Hosea','Joel'])];
})();