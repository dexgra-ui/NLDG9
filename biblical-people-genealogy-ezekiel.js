(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);

merge('jehoiachin',{ref:'Ezekiel 1:2',note:'Ezekiel dates his opening vision to the fifth year of King Jehoiachin’s exile.'});
merge('nebuchadnezzar',{ref:'Ezekiel 26:7; 29:18–20; 30:10',aliases:['Nebuchadnezzar','Nebuchadrezzar'],note:'Ezekiel names Nebuchadnezzar king of Babylon in oracles concerning Tyre and Egypt.'});
merge('noah',{ref:'Ezekiel 14:14,20'});
merge('job',{ref:'Ezekiel 14:14,20'});
merge('abram',{ref:'Ezekiel 33:24',note:'Ezekiel 33 recalls Abraham as the one man who possessed the land before Israel became many.'});
merge('jacob',{ref:'Ezekiel 20:5; 28:25; 37:25'});
merge('david',{ref:'Ezekiel 34:23–24; 37:24–25',note:'Ezekiel uses David in the promised shepherd/servant-king hope; the text names David while the prophetic fulfillment language remains distinct from a new genealogical David.'});
merge('joseph',{ref:'Ezekiel 37:16,19'});

put(R('buzi','Buzi','Ezekiel','Person','male',[],[],'Ezekiel 1:3','Father of Ezekiel the priest-prophet.'));
put(R('ezekiel-prophet','Ezekiel','Prophets / exile','Prophet / priest','male',['buzi'],[],'Ezekiel 1:3; 24:18; 33:21','Son of Buzi, a priest among the exiles by the Kebar River. His wife is mentioned in Ezekiel 24 but is not named, so no named-wife record is created.','explicit',['Ezekiel son of Buzi']));
put(R('jaazaniah-shaphan','Jaazaniah','Ezekiel / Jerusalem elders','Elder / leader','male',['shaphan'],[],'Ezekiel 8:11','Son of Shaphan, standing among seventy elders in Ezekiel’s temple vision. Distinct from Jaazaniah son of Azzur in Ezekiel 11.','explicit',['Jaazaniah son of Shaphan']));
put(R('azzur-jaazaniah','Azzur','Ezekiel / Jerusalem leaders','Person','male',[],[],'Ezekiel 11:1','Father of Jaazaniah, one of the leaders seen at the east gate. Distinct from other men named Azzur/Azur.','explicit',['Azzur father of Jaazaniah']));
put(R('jaazaniah-azzur','Jaazaniah','Ezekiel / Jerusalem leaders','Leader','male',['azzur-jaazaniah'],[],'Ezekiel 11:1','Son of Azzur and one of the leaders of the people seen at the east gate. Distinct from Jaazaniah son of Shaphan.','explicit',['Jaazaniah son of Azzur']));
put(R('benaiah-pelatiah','Benaiah','Ezekiel / Jerusalem leaders','Person','male',[],[],'Ezekiel 11:1,13','Father of Pelatiah. Distinct from Benaiah son of Jehoiada and other men named Benaiah.','explicit',['Benaiah father of Pelatiah']));
put(R('pelatiah-benaiah','Pelatiah','Ezekiel / Jerusalem leaders','Leader','male',['benaiah-pelatiah'],[],'Ezekiel 11:1,13','Son of Benaiah and one of the leaders of the people. Ezekiel reports Pelatiah’s death during the vision.','explicit',['Pelatiah son of Benaiah']));
put(R('daniel-ezekiel','Daniel / Danel','Ezekiel wisdom references','Named righteous/wisdom figure','male',[],[],'Ezekiel 14:14,20; 28:3','Named with Noah and Job as a model of righteousness and later as a figure of exceptional wisdom. The Hebrew spelling and chronology have led to debate over whether Ezekiel means the Daniel of the biblical book or a different ancient figure sometimes rendered Danel, so the identity is not forced.','unresolved identification',['Daniel in Ezekiel','Danel']));
put(R('gog-magog-ezekiel','Gog','Prophetic rulers','Ruler / prophetic figure','male',[],[],'Ezekiel 38:2–3,14–18; 39:1,11','Named ruler from the land of Magog in Ezekiel’s prophetic oracle. Kept distinct from the much earlier genealogical Gog named in 1 Chronicles 5.','explicit',['Gog of Magog'],[C('associated realm','magog','Ezekiel 38:2','Gog is described as being of the land of Magog; Magog is not treated as his biological parent.') ]));

// Ezekiel 23's Oholah/Oholibah are symbolic personifications of Samaria and Jerusalem, not historical named human individuals, so they are not entered as human-person records.
// Tammuz in Ezekiel 8:14 is a deity-name, outside this human people/genealogy database.
db.scope='Genesis–Ezekiel';
db.phase=9;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Ezekiel'])];
})();