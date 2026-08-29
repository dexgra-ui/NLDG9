(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='')=>{for(const id of ids){if(merge(id,{ref,note}))return id;}return null;};

// Amos.
put(R('amos-prophet','Amos','Prophets / northern kingdom','Prophet / shepherd','male',[],[],'Amos 1:1; 7:8–17; 8:1–2','Prophet from among the shepherds of Tekoa. Scripture does not name his father. Distinct from Amoz, father of Isaiah.','explicit',['Amos of Tekoa']));
addAny(['uzziah','azariah-uzziah'],'Amos 1:1','Uzziah king of Judah is named in Amos’s opening chronology.');
addAny(['jeroboam-ii'],'Amos 1:1; 7:9–11','Jeroboam son of Joash is named as king of Israel in Amos’s setting and Amaziah narrative.');
addAny(['jehoash-israel'],'Amos 1:1','Joash/Jehoash is named as father of Jeroboam II.');
addAny(['hazael'],'Amos 1:4','Hazael is named in the oracle against Damascus.');
put(R('benhadad-amos','Ben-Hadad','Aram / Amos oracle','Royal / dynastic name','male',[],[],'Amos 1:4','The palaces/fortresses of Ben-Hadad are named in the Damascus oracle. Because several Aramean rulers bear this name and Amos does not specify which individual, the identity remains unresolved.','unresolved identification',['Ben-Hadad in Amos 1']));
put(R('amaziah-bethel','Amaziah','Amos / Bethel','Priest','male',[],[],'Amos 7:10–17','Priest of Bethel who reports Amos to Jeroboam and orders Amos to leave. Distinct from King Amaziah of Judah.','explicit',['Amaziah priest of Bethel']));
addAny(['david'],'Amos 9:11','David is explicitly named in the promise to restore the fallen booth/house of David.');
addAny(['jacob'],'Amos 7:2,5; 8:7','Jacob is used as an ancestral/collective name for Israel in Amos.');

// Obadiah.
put(R('obadiah-prophet','Obadiah','Prophets / Edom oracle','Prophet','male',[],[],'Obadiah 1','Named in the book’s superscription. His father and ancestry are not stated. Kept distinct from Obadiah in Ahab’s household and other biblical Obadiahs.','explicit',['Obadiah the prophet']));
addAny(['esau'],'Obadiah 6,8–10,18–21','Esau is explicitly named as the ancestral name of Edom in Obadiah.');
addAny(['jacob'],'Obadiah 10,17–18','Jacob is explicitly named in the brother/house language of Obadiah.');
addAny(['joseph'],'Obadiah 18','Joseph is explicitly named in the “house of Joseph” ancestry language.');

// Jonah enriches the person already introduced in 2 Kings.
addAny(['jonah'],'Jonah 1:1–17; 2:1,10; 3:1–4; 4:1–9','The Book of Jonah identifies Jonah as son of Amittai and follows his mission to Nineveh.');
addAny(['amittai'],'Jonah 1:1','Amittai is explicitly named as Jonah’s father.');
// The king of Nineveh is not personally named, so no royal personal name is invented.

db.scope='Genesis–Jonah';db.phase=10;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Amos','Obadiah','Jonah'])];
})();