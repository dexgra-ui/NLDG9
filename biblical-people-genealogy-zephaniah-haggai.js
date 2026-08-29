(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Zephaniah 1:1 gives a four-generation ancestry.
put(R('hezekiah-zephaniah-ancestor','Hezekiah','Zephaniah family','Person / ancestor name','male',[],[],'Zephaniah 1:1','Great-great-grandfather of the prophet Zephaniah through Amariah, Gedaliah, and Cushi. The text does not call this ancestor “King Hezekiah,” so identity with the Davidic king is not forced.','unresolved identification',['Hezekiah ancestor of Zephaniah']));
put(R('amariah-zephaniah','Amariah','Zephaniah family','Person / ancestor name','male',['hezekiah-zephaniah-ancestor'],[],'Zephaniah 1:1','Son/descendant of the Hezekiah named in Zephaniah’s ancestry and father of Gedaliah. Distinct from other men named Amariah.','explicit',['Amariah ancestor of Zephaniah']));
put(R('gedaliah-zephaniah','Gedaliah','Zephaniah family','Person / ancestor name','male',['amariah-zephaniah'],[],'Zephaniah 1:1','Son of Amariah and father of Cushi in Zephaniah’s ancestry. Distinct from Gedaliah son of Ahikam and other men named Gedaliah.','explicit',['Gedaliah ancestor of Zephaniah']));
put(R('cushi-zephaniah','Cushi','Zephaniah family','Person','male',['gedaliah-zephaniah'],[],'Zephaniah 1:1','Son of Gedaliah and father of the prophet Zephaniah.'));
put(R('zephaniah-prophet','Zephaniah','Prophets / Judah','Prophet','male',['cushi-zephaniah'],[],'Zephaniah 1:1','Son of Cushi, grandson of Gedaliah, great-grandson of Amariah, and descendant of a Hezekiah whose identity is not further specified. Distinct from Zephaniah the priest in Jeremiah.','explicit',['Zephaniah son of Cushi']));
addAny(['josiah'],'Zephaniah 1:1','Josiah son of Amon is named as king of Judah in Zephaniah’s superscription.');
addAny(['amon-judah'],'Zephaniah 1:1','Amon is explicitly named as father of King Josiah.');

// Haggai enriches the post-exile people already entered from Ezra.
addAny(['haggai'],'Haggai 1:1–15; 2:1–23','Haggai is the named prophet delivering the book’s dated messages.');
addAny(['darius-ezra'],'Haggai 1:1,15; 2:10','Darius is the Persian king used to date Haggai’s messages.');
addAny(['zerubbabel'],'Haggai 1:1,12,14; 2:2,4,21,23','Zerubbabel son of Shealtiel is governor of Judah and a central recipient of Haggai’s messages.',{parents:['shealtiel']});
addAny(['shealtiel'],'Haggai 1:1,12,14; 2:2,23','Shealtiel is explicitly named as father of Zerubbabel.');
addAny(['jeshua-jozadak'],'Haggai 1:1,12,14; 2:2,4','The post-exile high priest called Jeshua in Ezra is called Joshua in Haggai; the name forms are retained as aliases.',{aliases:['Jeshua','Joshua']});
addAny(['jozadak','jehozadak'],'Haggai 1:1,12,14; 2:2,4','Jozadak/Jehozadak is explicitly named as father of Joshua/Jeshua the high priest.',{aliases:['Jozadak','Jehozadak']});

db.scope='Genesis–Haggai';db.phase=10;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Zephaniah','Haggai'])];
})();