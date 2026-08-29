(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='')=>merge(id,{ref,note});

put(R('hilkiah-jeremiah','Hilkiah','Jeremiah family','Priest / person','male',[],[],'Jeremiah 1:1','Father of Jeremiah, from the priests at Anathoth. He is kept separate from Hilkiah the Josiah-era high priest because Jeremiah does not identify his father with that official.','unresolved identification',['Hilkiah father of Jeremiah']));
put(R('jeremiah','Jeremiah','Prophets / Judah','Prophet / priest','male',['hilkiah-jeremiah'],[],'Jeremiah 1–52','Son of Hilkiah, one of the priests at Anathoth; prophet whose ministry spans the reigns of Josiah, Jehoiakim, and Zedekiah and the fall of Jerusalem.','explicit',['Jeremiah the prophet']));
add('josiah','Jeremiah 1:2–3; 3:6; 25:3','Jeremiah dates his call and early ministry to Josiah son of Amon.');
add('amon-judah','Jeremiah 1:2','Amon is named as father of Josiah in Jeremiah’s opening chronology.');
add('jehoiakim','Jeremiah 1:3; 22:18,24; 24:1; 25:1','Jehoiakim son of Josiah is named repeatedly in Jeremiah’s royal chronology and oracles.');
add('zedekiah-judah','Jeremiah 1:3; 21:1–7; 24:8; 25:3','Zedekiah son of Josiah is named as Judah’s final king in Jeremiah’s ministry.');

// Earlier biblical figures explicitly named in Jeremiah.
add('moses','Jeremiah 15:1','The LORD names Moses with Samuel as archetypal intercessors.');
add('samuel','Jeremiah 15:1','The LORD names Samuel with Moses as archetypal intercessors.');

// Pashhur and the Zedekiah court delegation.
put(R('immer-pashhur','Immer','Jeremiah / temple officials','Priestly ancestor','male',[],[],'Jeremiah 20:1','Father of Pashhur, chief officer in the house of the LORD. Distinct from the post-exile priestly family name Immer unless genealogy proves continuity.','explicit',['Immer father of Pashhur']));
put(R('pashhur-immer','Pashhur / Magor-Missabib','Jeremiah / temple officials','Priest / chief officer','male',['immer-pashhur'],[],'Jeremiah 20:1–6','Son of Immer, priest and chief officer who strikes and confines Jeremiah. Jeremiah gives him the prophetic sign-name Magor-Missabib. Distinct from Pashhur son of Malchijah.','explicit',['Pashhur son of Immer','Magor-Missabib']));
put(R('malchijah-pashhur21','Malchijah','Jeremiah / Zedekiah court','Person','male',[],[],'Jeremiah 21:1','Father of Pashhur sent by Zedekiah to Jeremiah. Distinct from other Malchijahs.','explicit',['Malchijah father of Pashhur']));
put(R('pashhur-malchijah','Pashhur','Jeremiah / Zedekiah court','Royal official','male',['malchijah-pashhur21'],[],'Jeremiah 21:1; 38:1','Son of Malchijah, official sent by Zedekiah to consult Jeremiah and later one of those pressing for Jeremiah’s death. Distinct from Pashhur son of Immer.','explicit',['Pashhur son of Malchijah']));
put(R('maaseiah-zephaniah','Maaseiah','Jeremiah / priestly officials','Person','male',[],[],'Jeremiah 21:1; 29:25; 37:3','Father of Zephaniah the priest. Distinct from other Maaseiahs.','explicit',['Maaseiah father of Zephaniah']));
put(R('zephaniah-maaseiah','Zephaniah','Jeremiah / priestly officials','Priest / official','male',['maaseiah-zephaniah'],[],'Jeremiah 21:1; 29:25–29; 37:3; 52:24','Son of Maaseiah, priest involved in royal delegations and correspondence. Distinct from the prophet Zephaniah.','explicit',['Zephaniah son of Maaseiah']));
add('nebuchadnezzar','Jeremiah 21:2,7; 22:25; 24:1; 25:1,9','Nebuchadnezzar king of Babylon is named as the imperial ruler against Judah.');

// Royal names in Jeremiah 22-24.
add('david','Jeremiah 21:12; 22:2,4; 23:5','Jeremiah invokes the house and throne of David in royal judgment and restoration oracles.');
add('jehoahaz-judah','Jeremiah 22:11–12','Jeremiah calls Josiah’s son Shallum; this is the king otherwise known as Jehoahaz.');
// If the existing Jehoahaz record is absent under a different ID, preserve a local cross-name record.
put(R('shallum-josiah-jeremiah','Shallum / Jehoahaz','Davidic kings','King / ruler','male',['josiah'],[],'Jeremiah 22:11–12','Son of Josiah who succeeded his father and went into exile. Jeremiah uses the name Shallum; Kings uses Jehoahaz. This local record remains only if the existing Jehoahaz ID is unavailable.','textual variant',['Shallum son of Josiah','Jehoahaz']));
if(db.records.some(r=>r.id==='jehoahaz-judah'))db.records=db.records.filter(r=>r.id!=='shallum-josiah-jeremiah');
add('jehoiachin','Jeremiah 22:24–30; 24:1','Jehoiachin is called Coniah/Jeconiah in Jeremiah and identified as son of Jehoiakim.');
if(db.records.some(r=>r.id==='jehoiachin'))merge('jehoiachin',{aliases:['Coniah','Jeconiah']});

// Jeremiah 25 closes this block with Josiah and Babylon. “Sheshach” is an Atbash cryptogram for Babylon in Jeremiah 25:26, not entered as a human personal name.
db.scope='Genesis–Jeremiah 25';db.phase=9;
})();