(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='')=>{for(const id of ids){if(merge(id,{ref,note}))return id;}return null;};

// Micah.
put(R('micah-moresheth','Micah','Prophets / Judah','Prophet','male',[],[],'Micah 1:1','Micah of Moresheth, prophet in the days of Jotham, Ahaz, and Hezekiah. His father is not named. Distinct from Micaiah son of Imlah and other men named Micah/Micaiah.','explicit',['Micah the Morasthite','Micah of Moresheth']));
addAny(['jotham','jotham-judah'],'Micah 1:1','Jotham king of Judah is named in Micah’s superscription.');
addAny(['ahaz','ahaz-judah'],'Micah 1:1','Ahaz king of Judah is named in Micah’s superscription.');
addAny(['hezekiah'],'Micah 1:1','Hezekiah king of Judah is named in Micah’s superscription.');
addAny(['nimrod'],'Micah 5:6','Nimrod is explicitly named in the phrase “land of Nimrod.” The reference is territorial/ancestral and does not create a new Nimrod.');
addAny(['moses'],'Micah 6:4','Moses is explicitly named in the exodus remembrance.');
addAny(['aaron'],'Micah 6:4','Aaron is explicitly named with Moses and Miriam.');
addAny(['miriam'],'Micah 6:4','Miriam is explicitly named with Moses and Aaron.');
addAny(['balak'],'Micah 6:5','Balak king of Moab is explicitly named in the Balaam remembrance.');
addAny(['balaam'],'Micah 6:5','Balaam son of Beor is explicitly named in the Balaam remembrance.');
addAny(['beor-balaam'],'Micah 6:5','Beor is explicitly named as Balaam’s father.');
addAny(['jacob'],'Micah 7:20','Jacob is explicitly named in the closing covenant appeal.');
addAny(['abram'],'Micah 7:20','Abraham is explicitly named in the closing covenant appeal.');

// Nahum.
put(R('nahum-prophet','Nahum','Prophets / Nineveh oracle','Prophet','male',[],[],'Nahum 1:1','Nahum the Elkoshite, named in the book’s superscription. Scripture does not name his father or define Elkosh as a person.','explicit',['Nahum the Elkoshite']));

// Habakkuk.
put(R('habakkuk-prophet','Habakkuk','Prophets / Judah','Prophet','male',[],[],'Habakkuk 1:1; 3:1','Prophet named in the superscription and again in the prayer heading. Scripture does not name his father or ancestry.','explicit',['Habakkuk the prophet']));

db.scope='Genesis–Habakkuk';db.phase=10;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Micah','Nahum','Habakkuk'])];
})();