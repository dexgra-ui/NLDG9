(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const refs=(ids,ref)=>ids.forEach(id=>merge(id,{ref}));

// Solomon and temple era.
refs(['david','solomon','zadok-ahitub','huram-tyre','huram-abi'],'2 Chronicles 1–9');
merge('solomon',{ref:'2 Chronicles 1–9',note:'Chronicles retells Solomon’s accession, temple building, dedication, wealth, and death.'});
put(R('huram-tyre-chron','Huram / Hiram','Solomon / Tyre','King / ruler','male',[],[],'2 Chronicles 2:3,11–12; 8:2,18; 9:10,21','King of Tyre who corresponds with Solomon. Chronicles uses Huram; Kings commonly uses Hiram.','textual variant',['Huram','Hiram']));
put(R('huram-abi-chron','Huram-Abi','Temple craftsmen','Master craftsman','male',[],[],'2 Chronicles 2:13–14; 4:11,16','Master craftsman sent by the king of Tyre. His mother is from Dan and his father a man of Tyre; neither parent is named. Distinct from Huram/Hiram king of Tyre.','explicit',['Huram-Abi','Huram-abi']));

// Rehoboam family and early divided monarchy.
merge('rehoboam',{ref:'2 Chronicles 10–12',spouses:['mahalath-rehoboam','maacah-rehoboam'],note:'Chronicles adds extensive information about Rehoboam’s wives, sons, fortified cities, and repentance during Shishak’s invasion.'});
merge('naamah-ammonite',{ref:'2 Chronicles 12:13'});
merge('jeroboam-nebat',{ref:'2 Chronicles 10:2–15; 11:4,14; 13:1–20'});
put(R('jerimoth-david','Jerimoth','Davidic family','Person','male',['david'],[],'2 Chronicles 11:18','Named son of David and father of Mahalath, a wife of Rehoboam. He is not among the six Hebron sons or the Jerusalem sons listed in 2 Samuel 3 and 5, showing Chronicles preserves an additional named son.','explicit',['Jerimoth son of David']));
put(R('abihail-eliab','Abihail','Davidic family','Person','female',['eliab-jesse'],[],'2 Chronicles 11:18','Daughter of Eliab son of Jesse; named in Mahalath’s ancestry. The syntax of 2 Chronicles 11:18 is compressed, but she is presented as Mahalath’s mother.','explicit',['Abihail daughter of Eliab']));
put(R('mahalath-rehoboam','Mahalath','Davidic royal house','Person','female',['jerimoth-david','abihail-eliab'],['rehoboam'],'2 Chronicles 11:18–19','Wife of Rehoboam; daughter of Jerimoth son of David and Abihail daughter of Eliab son of Jesse; mother of Jeush, Shemariah, and Zaham.'));
put(R('jeush-rehoboam','Jeush','Davidic royal house','Royal son','male',['rehoboam','mahalath-rehoboam'],[],'2 Chronicles 11:19','Son of Rehoboam and Mahalath; distinct from other biblical people named Jeush.','explicit',['Jeush son of Rehoboam']));
put(R('shemariah-rehoboam','Shemariah','Davidic royal house','Royal son','male',['rehoboam','mahalath-rehoboam'],[],'2 Chronicles 11:19','Son of Rehoboam and Mahalath.'));
put(R('zaham','Zaham','Davidic royal house','Royal son','male',['rehoboam','mahalath-rehoboam'],[],'2 Chronicles 11:19','Son of Rehoboam and Mahalath.'));
put(R('maacah-rehoboam','Maacah','Davidic royal house','Person','female',[],['rehoboam'],'2 Chronicles 11:20–22; 13:2','Favorite wife of Rehoboam and mother of Abijah, Attai, Ziza, and Shelomith. Chronicles calls her daughter of Absalom/Abishalom in 11:20 and gives the related maternal tradition in 13:2; exact generation is handled cautiously.','unresolved identification',['Maacah wife of Rehoboam','Micaiah in 2 Chronicles 13:2'],[C('ancestral connection','absalom','2 Chronicles 11:20','Chronicles calls her daughter of Absalom; this may use “daughter” in a descendant sense.') ]));
merge('abijah-judah',{parents:['rehoboam','maacah-rehoboam'],ref:'2 Chronicles 11:20–22; 13:1–22',aliases:['Abijah','Abijam'],note:'Chronicles names Abijah as son of Rehoboam and Maacah/Micaiah and gives a fuller account of his war with Jeroboam.'});
put(R('attai-rehoboam','Attai','Davidic royal house','Royal son','male',['rehoboam','maacah-rehoboam'],[],'2 Chronicles 11:20','Son of Rehoboam and Maacah; distinct from later people named Attai.','explicit',['Attai son of Rehoboam']));
put(R('ziza-rehoboam','Ziza','Davidic royal house','Royal son','male',['rehoboam','maacah-rehoboam'],[],'2 Chronicles 11:20','Son of Rehoboam and Maacah.'));
put(R('shelomith-rehoboam','Shelomith','Davidic royal house','Royal son','male',['rehoboam','maacah-rehoboam'],[],'2 Chronicles 11:20','Son of Rehoboam and Maacah; distinct from other people named Shelomith.','explicit',['Shelomith son of Rehoboam']));
put(R('shemaiah-prophet-rehoboam','Shemaiah','Judah / Rehoboam','Prophet','male',[],[],'2 Chronicles 11:2–4; 12:5–8,15','Prophet who restrains civil war and later interprets Shishak’s invasion. Distinct from other biblical Shemaiahs.','explicit',['Shemaiah the prophet']));
put(R('iddo-seer','Iddo','Judah / prophetic records','Prophet / seer','male',[],[],'2 Chronicles 9:29; 12:15; 13:22','Seer/prophet whose writings and genealogical records are cited as sources for Solomon, Rehoboam, and Abijah. Distinct from later people named Iddo.','explicit',['Iddo the seer','Iddo the prophet']));
put(R('shishak','Shishak','Egypt / Rehoboam','King / ruler','male',[],[],'2 Chronicles 12:2–9','King of Egypt who invades Judah in Rehoboam’s fifth year.','explicit',['Sheshonq identification is historical, not stated by Scripture']));

// Asa and prophetic figures.
merge('asa',{ref:'2 Chronicles 14–16'});
put(R('zerah-cushite','Zerah','Judah / Asa','Military leader','male',[],[],'2 Chronicles 14:9–15','Cushite/Ethiopian commander who invades Judah with a large army and is defeated by Asa. Distinct from other biblical Zerahs.','explicit',['Zerah the Cushite','Zerah the Ethiopian']));
put(R('oded-azariah','Oded','Judah / prophets','Person','male',[],[],'2 Chronicles 15:1,8','Father of Azariah the prophet. Verse 8 has a textual/syntactical tradition in some translations that repeats Oded’s name with the prophecy.','textual variant',['Oded father of Azariah']));
put(R('azariah-oded','Azariah','Judah / Asa','Prophet','male',['oded-azariah'],[],'2 Chronicles 15:1–8','Son of Oded; Spirit-empowered prophet who exhorts Asa and Judah to seek the LORD. Distinct from many other Azariahs.','explicit',['Azariah son of Oded']));
put(R('hanani-seer','Hanani','Judah / Asa','Prophet / seer','male',[],[],'2 Chronicles 16:7–10; 19:2; 20:34','Seer who rebukes Asa; father of Jehu the prophet/seer.','explicit',['Hanani the seer']));
put(R('jehu-hanani','Jehu','Judah / prophets','Prophet / seer','male',['hanani-seer'],[],'2 Chronicles 19:2; 20:34','Son of Hanani; rebukes Jehoshaphat and is cited as a prophetic historian. Distinct from Jehu king of Israel.','explicit',['Jehu son of Hanani']));
merge('ben-hadad-asa',{ref:'2 Chronicles 16:2–4'});
merge('baasha',{ref:'2 Chronicles 16:1–6'});

// Jehoshaphat teaching mission and military organization.
merge('jehoshaphat',{ref:'2 Chronicles 17–20'});
for(const [id,n] of [['ben-hail','Ben-Hail'],['obadiah-jehoshaphat','Obadiah'],['zechariah-jehoshaphat','Zechariah'],['nethanel-jehoshaphat','Nethanel'],['micaiah-jehoshaphat','Micaiah']])put(R(id,n,'Judah / Jehoshaphat','Royal official','male',[],[],'2 Chronicles 17:7',`Official sent by Jehoshaphat to teach in Judah${n==='Micaiah'?'; distinct from Micaiah son of Imlah':''}.`,'explicit',[`${n} (Jehoshaphat official)`]));
for(const [id,n] of [['shemaiah-levite17','Shemaiah'],['nethaniah-levite17','Nethaniah'],['zebadiah-levite17','Zebadiah'],['asahel-levite17','Asahel'],['shemiramoth','Shemiramoth'],['jehonathan-levite17','Jehonathan'],['adonijah-levite17','Adonijah'],['tobijah-levite17','Tobijah'],['tob-adonijah','Tob-Adonijah']])put(R(id,n,'Levi / Jehoshaphat','Levite teacher','male',[],[],'2 Chronicles 17:8',`Levite sent to teach throughout Judah in Jehoshaphat’s reign. Distinct from other biblical people with the same or similar name.`,'explicit',[`${n} (2 Chronicles 17)`]));
put(R('elishama-priest17','Elishama','Priests / Jehoshaphat','Priest / teacher','male',[],[],'2 Chronicles 17:8','Priest sent with the teaching mission in Jehoshaphat’s reign. Distinct from Elishama son of Ammihud.','explicit',['Elishama the priest (2 Chronicles 17)']));
put(R('jehoram-priest17','Jehoram','Priests / Jehoshaphat','Priest / teacher','male',[],[],'2 Chronicles 17:8','Priest sent with the teaching mission in Jehoshaphat’s reign. Distinct from King Jehoram of Judah and other Jehorams.','explicit',['Jehoram the priest (2 Chronicles 17)']));
for(const [id,n,ref,note] of [
 ['adnah-general','Adnah','2 Chronicles 17:14','Judahite commander over 300,000 mighty men.'],
 ['jehohanan-general','Jehohanan','2 Chronicles 17:15','Commander over 280,000; distinct from other Jehohanans.'],
 ['amasiah-zichri','Amasiah','2 Chronicles 17:16','Son of Zichri; volunteered himself to the LORD and commanded 200,000.'],
 ['eliada-benjamin','Eliada','2 Chronicles 17:17','Benjaminite warrior commanding 200,000 armed with bow and shield.'],
 ['jehozabad-general','Jehozabad','2 Chronicles 17:18','Commander over 180,000; distinct from other Jehozabads.']
])put(R(id,n,'Judah / Jehoshaphat','Military commander','male',id==='amasiah-zichri'?['zichri-amasiah']:[],[],ref,note,'explicit',[`${n} (Jehoshaphat commander)`]));
put(R('zichri-amasiah','Zichri','Judah / Jehoshaphat','Person','male',[],[],'2 Chronicles 17:16','Father of Amasiah, Jehoshaphat’s commander. Distinct from other Zichris.','explicit',['Zichri father of Amasiah']));

// Ahab alliance and Micaiah.
merge('ahab',{ref:'2 Chronicles 18'});merge('micaiah-imlah',{ref:'2 Chronicles 18:7–27'});merge('imlah',{ref:'2 Chronicles 18:7–8'});merge('zedekiah-chenaanah',{ref:'2 Chronicles 18:10–23'});merge('chenaanah',{ref:'2 Chronicles 18:10'});

db.scope='Genesis–2 Chronicles 18';db.phase=6;
})();