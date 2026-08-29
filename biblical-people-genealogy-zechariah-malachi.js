(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Zechariah’s stated ancestry and Persian dating.
addAny(['darius-ezra'],'Zechariah 1:1,7; 7:1','Darius is the Persian king used to date Zechariah’s early visions and messages.');
addAny(['iddo-zechariah-return'],'Zechariah 1:1,7','Iddo is explicitly named as ancestor/grandfather in Zechariah’s stated lineage.');
put(R('berechiah-zechariah','Berechiah','Zechariah family','Person','male',['iddo-zechariah-return'],[],'Zechariah 1:1,7','Son of Iddo and father of Zechariah the prophet. Distinct from the many other biblical men named Berechiah.','explicit',['Berechiah father of Zechariah']));
addAny(['zechariah-return-prophet'],'Zechariah 1:1,7; 7:1','The post-exile prophet identified in Ezra as descendant of Iddo is explicitly called son of Berechiah son of Iddo in his own book.',{parents:['berechiah-zechariah'],aliases:['Zechariah son of Berechiah','Zechariah son/descendant of Iddo']});

// Post-exile leaders already known from Ezra/Haggai.
addAny(['jeshua-jozadak'],'Zechariah 3:1–10; 6:9–15','Joshua/Jeshua the high priest is central to Zechariah’s priestly visions.',{aliases:['Jeshua','Joshua']});
addAny(['jozadak','jehozadak'],'Zechariah 6:11','Jehozadak/Jozadak is named as father of Joshua the high priest.',{aliases:['Jozadak','Jehozadak']});
addAny(['zerubbabel'],'Zechariah 4:6–10; 6:13','Zerubbabel is explicitly named in the temple-restoration visions.');
addAny(['shealtiel'],'Zechariah 4:6–10','Zechariah’s post-exile context continues the Zerubbabel son of Shealtiel identity established in Haggai and Ezra.');

// Zechariah 6: the crown delegation.
put(R('heldai-zechariah6','Heldai','Zechariah / crown delegation','Returnee / delegate','male',[],[],'Zechariah 6:10','Named among men who have come from Babylon and whose silver and gold are used for the symbolic crowns. Verse 14 uses Helem in the corresponding reminder list; possible identity is kept labeled.','unresolved identification',['Heldai'],[C('possible identity','helem-zechariah6','Zechariah 6:10,14','Heldai in verse 10 and Helem in verse 14 occupy corresponding positions, but the text preserves different forms.') ]));
put(R('helem-zechariah6','Helem','Zechariah / crown delegation','Returnee / memorial name','male',[],[],'Zechariah 6:14','Named in the crown memorial list. Often understood as the same person as Heldai of verse 10, but the distinct form is preserved rather than silently replaced.','textual variant',['Helem'],[C('possible identity','heldai-zechariah6','Zechariah 6:10,14')]));
put(R('tobijah-zechariah6','Tobijah','Zechariah / crown delegation','Returnee / delegate','male',[],[],'Zechariah 6:10,14','Named in both the crown delegation and memorial list. Distinct from Tobiah the Ammonite and other similarly named people.'));
put(R('jedaiah-zechariah6','Jedaiah','Zechariah / crown delegation','Returnee / delegate','male',[],[],'Zechariah 6:10,14','Named in both the crown delegation and memorial list. The book does not provide enough genealogy to merge him with other Jedaiahs.','unresolved identification',['Jedaiah in Zechariah 6']));
put(R('zephaniah-zechariah6','Zephaniah','Zechariah / crown delegation','Person','male',[],[],'Zechariah 6:10,14','Father of Josiah in verse 10 and of the Hen name/read­ing in verse 14. Distinct from the prophet Zephaniah and Zephaniah the priest unless Scripture supplies a link.','unresolved identification',['Zephaniah father in Zechariah 6']));
put(R('josiah-zechariah6','Josiah','Zechariah / crown delegation','Host / returnee','male',['zephaniah-zechariah6'],[],'Zechariah 6:10','Son of Zephaniah whose house receives the returning delegation. Distinct from King Josiah of Judah.','explicit',['Josiah son of Zephaniah']));
put(R('hen-zechariah6','Hen','Zechariah / crown delegation','Possible personal name / textual reading','male',['zephaniah-zechariah6'],[],'Zechariah 6:14','Some translations render Hen as a personal name, “Hen son of Zephaniah,” while the nearby verse 10 names Josiah son of Zephaniah in the same setting. The database retains the reading and marks the possible identity rather than forcing it.','textual variant',['Hen son of Zephaniah'],[C('possible identity','josiah-zechariah6','Zechariah 6:10,14')]));

// Zechariah 7 delegation.
put(R('sharezer-zechariah7','Sharezer','Zechariah / Bethel delegation','Delegate','male',[],[],'Zechariah 7:2','Named with Regem-Melech in the delegation sent to seek the LORD’s favor. Distinct from Sharezer son of Sennacherib by historical setting.','explicit',['Sharezer in Zechariah 7']));
put(R('regem-melech','Regem-Melech','Zechariah / Bethel delegation','Delegate','male',[],[],'Zechariah 7:2','Named with Sharezer in the delegation sent to seek the LORD’s favor.','explicit',['Regem-Melech']));

// Zechariah 12 household names.
addAny(['david'],'Zechariah 12:7–12; 13:1','David is explicitly named in the house-of-David language.');
put(R('nathan-zechariah12-house','Nathan','Zechariah 12 households','Ancestor / house name','male',[],[],'Zechariah 12:12','The “house of Nathan” is named in the mourning oracle. This may refer to the Davidic Nathan line, but Zechariah does not explicitly identify which Nathan, so the identity is not forced.','unresolved identification',['Nathan house in Zechariah 12']));
addAny(['levi'],'Zechariah 12:13','Levi is explicitly named in the “house of Levi” ancestry language.');
put(R('shimei-zechariah12-house','Shimei','Zechariah 12 households','Ancestor / house name','male',[],[],'Zechariah 12:13','The family/house of Shimei is named in the mourning oracle. Because many biblical men bear the name Shimei and the verse does not specify which ancestry, the identity remains unresolved.','unresolved identification',['Shimei house in Zechariah 12']));

// Malachi.
put(R('malachi-name','Malachi','Prophets / post-exile','Possible personal name / title','male',[],[],'Malachi 1:1','The superscription gives the Hebrew form Malachi, which can function as a proper name and also means “my messenger.” The database records the traditional personal name while keeping the name/title ambiguity visible.','textual variant',['Malachi','my messenger']));
addAny(['jacob'],'Malachi 1:2; 2:12; 3:6','Jacob is explicitly named, sometimes as ancestor and sometimes as collective covenant language.');
addAny(['esau'],'Malachi 1:2–3','Esau is explicitly named in contrast with Jacob.');
addAny(['levi'],'Malachi 2:4,8','Levi is explicitly named in covenant and priestly ancestry language.');
addAny(['moses'],'Malachi 4:4','Moses is explicitly named in the closing call to remember the law.');
addAny(['elijah'],'Malachi 4:5','Elijah the prophet is explicitly named in the closing promise.');

db.scope='Genesis–Malachi';db.phase=10;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Zechariah','Malachi'])];
})();