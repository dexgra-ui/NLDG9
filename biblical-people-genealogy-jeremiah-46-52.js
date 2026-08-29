(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='')=>merge(id,{ref,note});

add('jeremiah','Jeremiah 46–52');
add('pharaoh-neco','Jeremiah 46:2','Jeremiah explicitly names Pharaoh Neco in the oracle concerning Egypt at Carchemish.');
add('nebuchadnezzar','Jeremiah 46:2,13,26; 49:28,30; 50:17; 51:34; 52:4–30','Nebuchadnezzar is named repeatedly in the foreign-nation oracles and Jerusalem-fall appendix.');
put(R('benhadad-jer49','Ben-Hadad','Aram / Jeremiah oracle','Royal / dynastic name','male',[],[],'Jeremiah 49:27','Jeremiah names the palaces of Ben-Hadad in Damascus. Because multiple Aramean kings bear this name/title in Kings and Jeremiah does not specify which individual, the reference remains an unresolved royal/dynastic identification.','unresolved identification',['Ben-Hadad in Jeremiah 49']));

// Jeremiah 51: Seraiah shares the same stated father and grandfather as Baruch.
put(R('seraiah-neriah','Seraiah','Baruch family','Quartermaster / royal official','male',['neriah'],[],'Jeremiah 51:59–64','Son of Neriah and grandson of Mahseiah; quartermaster who carries Jeremiah’s scroll against Babylon and reads it there. Because Baruch is also explicitly son of Neriah son of Mahseiah, the database’s shared parent structure makes the sibling relationship visible without inventing an extra statement.','explicit',['Seraiah son of Neriah'],[{type:'grandfather',target:'mahseiah-baruch',ref:'Jeremiah 51:59'}]));

// Jeremiah 52 parallels 2 Kings 24–25 and enriches existing people.
add('zedekiah','Jeremiah 52:1–11','Jeremiah 52 names Zedekiah son of Josiah and Hamutal and recounts Jerusalem’s fall.');
add('hamutal','Jeremiah 52:1','Hamutal daughter of Jeremiah of Libnah is named as Zedekiah’s mother.');
add('jeremiah-hamutal','Jeremiah 52:1','Jeremiah of Libnah is named as father of Hamutal and remains distinct from Jeremiah the prophet.');
add('nebuzaradan','Jeremiah 52:12–30','Nebuzaradan captain of the guard is named in Jerusalem’s destruction and deportations.');
add('seraiah-chief-priest','Jeremiah 52:24–27','Seraiah the chief priest is captured and executed at Riblah.');
add('zephaniah-second-priest','Jeremiah 52:24–27','Zephaniah the second priest is captured and executed at Riblah.');
add('jehoiachin','Jeremiah 52:31–34','Jehoiachin king of Judah is released and honored in Babylon.');
add('evil-merodach','Jeremiah 52:31–34','Evil-Merodach king of Babylon releases Jehoiachin in the thirty-seventh year of his exile.');

// Chemosh, Milcom/Malcam, Bel, and Merodach in Jeremiah’s foreign-nation oracles are deities, not human people records. Kedar, Teman, Dedan, and similar names may function as peoples/places in these chapters and are not silently attached to the earlier individual ancestors without explicit genealogical wording.
db.scope='Genesis–Jeremiah';db.phase=9;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Jeremiah'])];
})();