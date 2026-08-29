(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);

// Proverbs.
merge('solomon',{ref:'Proverbs 1:1; 10:1; 25:1',note:'Proverbs explicitly names Solomon in its major collection headings.'});
merge('david',{ref:'Proverbs 1:1',note:'Proverbs 1:1 identifies Solomon as son of David and king of Israel.'});
merge('hezekiah',{ref:'Proverbs 25:1',note:'Proverbs 25:1 says the men of Hezekiah king of Judah copied/collected additional proverbs of Solomon; the individual copyists are not named.'});
put(R('jakeh','Jakeh','Proverbs / Agur','Person','male',[],[],'Proverbs 30:1','Father of Agur according to the stated heading.'));
put(R('agur','Agur','Proverbs / Agur','Sage / teacher','male',['jakeh'],[],'Proverbs 30:1','Son of Jakeh and named source/speaker of Proverbs 30. Scripture does not identify Agur with Solomon.'));
put(R('ithiel-proverbs','Ithiel','Proverbs / Agur','Possible addressee / textual reading','male',[],[],'Proverbs 30:1','The Masoretic wording can be read as a proper name addressed by Agur, and several translations render Ithiel as a person; other translations divide/vocalize the Hebrew as “I am weary, O God.” The database therefore keeps Ithiel as a textual possibility, not an unquestioned individual.','textual variant',['Ithiel in Proverbs 30:1']));
put(R('ucal-proverbs','Ucal','Proverbs / Agur','Possible addressee / textual reading','male',[],[],'Proverbs 30:1','Several translations read Ucal as a second named addressee of Agur, while other translations understand the Hebrew differently. Retained as a textual possibility.','textual variant',['Ucal','Ukal']));
put(R('lemuel','Lemuel','Proverbs / Lemuel','King / sage','male',[],[],'Proverbs 31:1,4','King Lemuel, whose oracle/instruction is said to have been taught by his unnamed mother. Scripture does not identify Lemuel with Solomon, so no such identity is imposed.','explicit',['King Lemuel']));

// Ecclesiastes.
merge('david',{ref:'Ecclesiastes 1:1',note:'Ecclesiastes identifies the speaker as “son of David” but never gives the speaker a personal name in the book.'});
// No separate personal record is created for “the Preacher/Teacher/Qoheleth”: it is a role/designation in the text. Solomon is a traditional identification but is not explicitly named in Ecclesiastes, so the database does not mark Solomon as a Scripture-stated person in this book.

// Song of Songs.
merge('solomon',{ref:'Song of Songs 1:1,5; 3:7,9,11; 8:11–12',note:'Song of Songs explicitly names Solomon in its title and within the poem.'});
put(R('amminadib-song','Amminadib','Song of Songs','Possible personal name / textual reading','male',[],[],'Song of Songs 6:12 (KJV textual tradition)','KJV-style tradition can render the final phrase as “the chariots of Amminadib,” while many modern translations understand the Hebrew as “the chariots of my noble people” or similar. This is preserved only as a possible personal-name reading.','textual variant',['Amminadib','Ammi-Nadib']));
// “The Shulamite” is a geographic/ethnic designation, not a personal name supplied by the text, so no fabricated named-person record is created.

db.scope='Genesis–Song of Songs';db.phase=8;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Proverbs','Ecclesiastes','Song of Songs'])];db.completedPhases=[...new Set([...(db.completedPhases||[]),8])];
})();