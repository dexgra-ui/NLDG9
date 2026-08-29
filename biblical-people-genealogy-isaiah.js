(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(ids,ref,note='')=>{for(const id of Array.isArray(ids)?ids:[ids])if(merge(id,{ref,note}))return true;return false;};

// Prophet and royal-era framework.
add('isaiah','Isaiah 1:1; 2:1; 7:3; 13:1; 20:2–3; 37–39','Isaiah son of Amoz is the named prophet throughout the book and appears directly in the Ahaz and Hezekiah narratives.');
add('amoz','Isaiah 1:1; 2:1; 13:1; 20:2; 37:2,21; 38:1','Amoz is repeatedly named as Isaiah’s father.');
add(['uzziah','azariah-uzziah'],'Isaiah 1:1; 6:1; 7:1','Uzziah is named in the book’s royal framework and in Isaiah’s temple vision dating.');
add(['jotham','jotham-judah'],'Isaiah 1:1; 7:1','Jotham is named in Isaiah’s royal framework and as father of Ahaz.');
add(['ahaz','ahaz-judah'],'Isaiah 1:1; 7:1–17; 14:28','Ahaz son of Jotham is central to Isaiah 7’s sign narrative.');
add('hezekiah','Isaiah 1:1; 36–39','Hezekiah is named in the book’s royal framework and the Assyrian/Babylonian historical narratives.');
add('rezin','Isaiah 7:1,4,8; 8:6; 9:11','Rezin king of Aram is named as an enemy of Ahaz.');
add('pekah','Isaiah 7:1–9; 8:6','Pekah is referred to as the son of Remaliah in Isaiah’s Syro-Ephraimite crisis narrative.');
add('remaliah','Isaiah 7:1,4,5,9; 8:6','Remaliah is named as father of Pekah.');

// Isaiah’s stated family.
put(R('shear-jashub','Shear-Jashub','Isaiah family','Person','male',['isaiah'],[],'Isaiah 7:3','Named son of Isaiah who accompanies the prophet when he meets Ahaz. Scripture names Isaiah as his father; his mother is not named.','explicit',['Shear-jashub']));
put(R('maher-shalal-hash-baz','Maher-Shalal-Hash-Baz','Isaiah family','Person','male',['isaiah'],[],'Isaiah 8:1–4,18','Named son born after Isaiah approaches “the prophetess.” The first-person narrative identifies Isaiah as father; the mother is described by title but never given a personal name.','explicit',['Maher-shalal-hash-baz','Mahershalalhashbaz']));

// Named witnesses and political figures.
put(R('tabeel-isaiah','Tabeel','Isaiah / Ahaz crisis','Person','male',[],[],'Isaiah 7:6','Father of the unnamed “son of Tabeel” whom Judah’s enemies propose to install as king. Because the son is unnamed, only Tabeel receives a named-person record.','explicit',['Tabeel in Isaiah 7']));
put(R('jeberechiah','Jeberechiah','Isaiah / witnesses','Person','male',[],[],'Isaiah 8:2','Father of Zechariah, one of Isaiah’s trustworthy witnesses.','explicit',['Jeberechiah','Jeberekiah']));
put(R('zechariah-jeberechiah','Zechariah','Isaiah / witnesses','Witness','male',['jeberechiah'],[],'Isaiah 8:2','Son of Jeberechiah and one of the trustworthy witnesses named by Isaiah. Distinct from the many other biblical Zechariahs unless Scripture supplies an identity link.','explicit',['Zechariah son of Jeberechiah']));
put(R('uriah-priest-isaiah8','Uriah','Isaiah / witnesses','Priest / witness','male',[],[],'Isaiah 8:2','Priest named as a trustworthy witness. He is often identified with the Uriah who served under Ahaz in 2 Kings 16, but Isaiah does not explicitly make that cross-book identification, so the records are linked as probable rather than silently merged.','probable',['Uriah the priest (Isaiah 8)'],[C('probable identity','uriah-priest-ahaz','Isaiah 8:2; 2 Kings 16:10–16','Same royal period and priestly role strongly suggest identity, but the biblical texts do not explicitly state it.') ]));
put(R('sargon','Sargon','Assyria','King / ruler','male',[],[],'Isaiah 20:1','King of Assyria named when his commander captures Ashdod. The “Tartan” in the verse is a military title, not entered as a personal name.','explicit',['Sargon king of Assyria','Sargon II']));

// Davidic and ancestral references.
add('david','Isaiah 9:7; 16:5; 22:22; 29:1; 37:35; 38:5; 55:3','Isaiah repeatedly names David in royal, covenant, and Jerusalem contexts.');
add('jesse','Isaiah 11:1,10','Isaiah names Jesse in the root/branch imagery.');
add('abram','Isaiah 41:8; 51:2','Isaiah explicitly names Abraham in covenant and ancestry language.');
add('sarai','Isaiah 51:2','Isaiah explicitly names Sarah alongside Abraham.');
add('jacob','Isaiah 2:3,5,6; 10:20; 14:1; 27:6; 29:22; 40–49; 58:14','Isaiah frequently uses Jacob both for the patriarchal name and, by extension, for Israel collectively.');
add('moses','Isaiah 63:11–12','Isaiah 63 explicitly recalls Moses in the exodus tradition.');
add('noah','Isaiah 54:9','Isaiah explicitly names Noah when recalling the covenant after the flood.');
add('cyrus','Isaiah 44:28; 45:1','Isaiah explicitly names Cyrus in the restoration oracle.');

// Hezekiah and Assyria: enrich existing Kings records rather than duplicate them.
add('sennacherib','Isaiah 36:1; 37:8,17,21,37–38','Isaiah repeats the Assyrian invasion narrative and Sennacherib’s death.');
add('eliakim-hilkiah','Isaiah 22:20–25; 36:3,11,22; 37:2','Isaiah names Eliakim son of Hilkiah as palace official and gives the expanded “key of the house of David” oracle.');
add('hilikiah-eliakim','Isaiah 22:20; 36:3; 37:2','Hilkiah is named as father of Eliakim.');
add('shebna','Isaiah 22:15–19; 36:3,11,22; 37:2','Isaiah gives additional material about Shebna before the Assyrian narrative.');
add('joah-asaph','Isaiah 36:3,11,22','Joah son of Asaph is named as recorder in Hezekiah’s delegation.');
add('asaph-joah','Isaiah 36:3,22','Asaph is named as father of Joah.');
add('tirhakah','Isaiah 37:9','Tirhakah king of Cush is named in Sennacherib’s campaign.');
add('adrammelech-sennacherib','Isaiah 37:38','Isaiah names Adrammelech as a son who kills Sennacherib.');
add('sharezer-sennacherib','Isaiah 37:38','Isaiah names Sharezer as a son who kills Sennacherib.');
add('esarhaddon','Isaiah 37:38','Esarhaddon is named as Sennacherib’s son who succeeds him.');
add('merodach-baladan','Isaiah 39:1','Isaiah names Merodach-Baladan son of Baladan, king of Babylon, who sends envoys to Hezekiah.');
add('baladan','Isaiah 39:1','Baladan is named as father of Merodach-Baladan.');

// Poetic “Rahab” references in Isaiah 30:7 and 51:9 function as symbolic/monster/Egypt imagery and are not attached to Rahab of Jericho. “Lucifer” in some English renderings of Isaiah 14:12 is likewise not entered as a named human person; the oracle’s Babylonian king is not personally named there.
db.scope='Genesis–Isaiah';db.phase=9;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Isaiah'])];
})();