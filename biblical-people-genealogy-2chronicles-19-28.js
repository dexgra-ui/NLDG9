(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);

// Jehoshaphat's judicial reform and deliverance.
put(R('amariah-chief-priest19','Amariah','Judah / Jehoshaphat','Chief priest','male',[],[],'2 Chronicles 19:11','Chief priest over matters of the LORD in Jehoshaphat’s judicial arrangement. Distinct from other Amariahs.','explicit',['Amariah chief priest (2 Chronicles 19)']));
put(R('ishmael-zebadiah','Ishmael','Judah / Jehoshaphat','Person','male',[],[],'2 Chronicles 19:11','Father of Zebadiah, ruler of the house of Judah in Jehoshaphat’s judicial system. Distinct from other Ishmaels.','explicit',['Ishmael father of Zebadiah']));
put(R('zebadiah-ishmael','Zebadiah','Judah / Jehoshaphat','Royal official','male',['ishmael-zebadiah'],[],'2 Chronicles 19:11','Son of Ishmael; ruler of the house of Judah for royal matters.','explicit',['Zebadiah son of Ishmael']));
put(R('zechariah-jahaziel','Zechariah','Levi / Jahaziel line','Person','male',[],[],'2 Chronicles 20:14','Father of Jahaziel; distinct from other Zechariahs.','explicit',['Zechariah father of Jahaziel']));
put(R('benaiah-jahaziel','Benaiah','Levi / Jahaziel line','Person','male',[],[],'2 Chronicles 20:14','Father/ancestor in Jahaziel’s Levitical genealogy; distinct from Benaiah son of Jehoiada.','explicit',['Benaiah ancestor of Jahaziel']));
put(R('jeiel-jahaziel','Jeiel','Levi / Jahaziel line','Person','male',[],[],'2 Chronicles 20:14','Father/ancestor in Jahaziel’s genealogy; distinct from other Jeiels.','explicit',['Jeiel ancestor of Jahaziel']));
put(R('mattaniah-jahaziel','Mattaniah','Levi / Jahaziel line','Person','male',[],[],'2 Chronicles 20:14','Asaphite ancestor in Jahaziel’s genealogy; distinct from King Mattaniah/Zedekiah and other Mattaniahs.','explicit',['Mattaniah ancestor of Jahaziel']));
put(R('jahaziel-prophet','Jahaziel','Judah / Jehoshaphat','Prophet / Levite','male',['zechariah-jahaziel'],[],'2 Chronicles 20:14–17','Levite of the sons of Asaph upon whom the Spirit of the LORD comes during the Moabite-Ammonite crisis. His ancestry is given through Zechariah, Benaiah, Jeiel, and Mattaniah.','explicit',['Jahaziel son of Zechariah'],[C('ancestor','benaiah-jahaziel','2 Chronicles 20:14'),C('ancestor','jeiel-jahaziel','2 Chronicles 20:14'),C('ancestor','mattaniah-jahaziel','2 Chronicles 20:14')]));
put(R('dodavahu','Dodavahu','Judah / prophets','Person','male',[],[],'2 Chronicles 20:37','Father of Eliezer of Mareshah.'));
put(R('eliezer-dodavahu','Eliezer','Judah / prophets','Prophet','male',['dodavahu'],[],'2 Chronicles 20:37','Son of Dodavahu of Mareshah; prophesies against Jehoshaphat’s shipping alliance with Ahaziah of Israel. Distinct from other Eliezers.','explicit',['Eliezer son of Dodavahu']));
merge('ahaziah-israel',{ref:'2 Chronicles 20:35–37'});

// Jehoram of Judah and his brothers.
merge('jehoram-judah',{ref:'2 Chronicles 21',note:'Chronicles names six brothers of Jehoram and records Elijah’s letter against him.'});
for(const [id,n] of [['azariah-brother-jehoram','Azariah'],['jehiel-brother-jehoram','Jehiel'],['zechariah-brother-jehoram','Zechariah'],['azariahu-brother-jehoram','Azariahu'],['michael-brother-jehoram','Michael'],['shephatiah-brother-jehoram','Shephatiah']])put(R(id,n,'Davidic royal house','Royal son','male',['jehoshaphat'],[],'2 Chronicles 21:2',`Son of Jehoshaphat and brother of King Jehoram; killed after Jehoram secured the throne. Distinct from other biblical people named ${n}.`,'explicit',[`${n} son of Jehoshaphat`]));
merge('elijah',{ref:'2 Chronicles 21:12–15',note:'Chronicles preserves a written message from Elijah to Jehoram of Judah.'});
merge('athaliah',{ref:'2 Chronicles 22:2–12; 23:12–15',note:'Daughter/descendant of the house of Ahab, mother of Ahaziah of Judah, and usurping queen after his death.'});
merge('ahaziah-judah',{ref:'2 Chronicles 22:1–9',aliases:['Ahaziah','Jehoahaz'],note:'Chronicles calls him Ahaziah and in 21:17 refers to the surviving youngest son as Jehoahaz; the names are preserved as the same royal person in context.'});
merge('jehu',{ref:'2 Chronicles 22:7–9'});

// Jehoshabeath and Jehoiada.
put(R('jehoshabeath','Jehoshabeath / Jehosheba','Davidic royal house','Person','female',['jehoram-judah'],['jehoiada'],'2 Chronicles 22:11; 23:1–15','Daughter of King Jehoram, sister of Ahaziah, wife of Jehoiada the priest, and rescuer of the infant Joash from Athaliah. Kings uses the form Jehosheba.','textual variant',['Jehoshabeath','Jehosheba'],[C('brother','ahaziah-judah','2 Chronicles 22:11')]));
merge('jehoiada',{spouses:['jehoshabeath'],ref:'2 Chronicles 22:11; 23–24',note:'Priest and husband of Jehoshabeath; organizes Joash’s coronation and covenant renewal, then dies at age 130 according to Chronicles.'});
merge('joash-judah',{ref:'2 Chronicles 22:11; 23–24'});
for(const [id,n,f] of [['azariah-jeroham','Azariah','Jeroham'],['ishmael-jehohanan','Ishmael','Jehohanan'],['azariah-obed','Azariah','Obed'],['maaseiah-adaiah','Maaseiah','Adaiah'],['elishaphat-zichri','Elishaphat','Zichri']]){
 const fid=`${id}-father`;put(R(fid,f,'Joash restoration','Person','male',[],[],'2 Chronicles 23:1',`Father of ${n}, one of Jehoiada’s covenant captains. Distinct from other people named ${f}.`,'explicit',[`${f} father of ${n}`]));
 put(R(id,n,'Joash restoration','Military captain','male',[fid],[],'2 Chronicles 23:1–11',`${n} son of ${f}, one of the captains enlisted by Jehoiada to restore Joash.`,'explicit',[`${n} son of ${f}`]));
}
put(R('zechariah-jehoiada','Zechariah','Jehoiada / Joash','Priest / prophet','male',['jehoiada','jehoshabeath'],[],'2 Chronicles 24:20–22','Son of Jehoiada the priest. The Spirit of God comes upon him and he rebukes Judah; Joash orders him stoned in the temple court.','explicit',['Zechariah son of Jehoiada']));
put(R('shimeath','Shimeath','Joash assassination','Person','female',[],[],'2 Chronicles 24:26','Ammonite woman, mother of Zabad.'));
put(R('shimrith','Shimrith','Joash assassination','Person','female',[],[],'2 Chronicles 24:26','Moabite woman, mother of Jehozabad. Some textual traditions/forms correspond with Shomer in 2 Kings 12:21.','textual variant',['Shimrith','Shomer connection']));
put(R('zabad-shimeath','Zabad','Joash assassination','Assassin / official','male',['shimeath'],[],'2 Chronicles 24:26','Son of Shimeath the Ammonite; one of the servants who assassinate King Joash. 2 Kings 12:21 has Jozacar son of Shimeath, creating a parallel-name/textual issue.','textual variant',['Zabad','Jozacar?']));
put(R('jehozabad-shimrith','Jehozabad','Joash assassination','Assassin / official','male',['shimrith'],[],'2 Chronicles 24:26','Son of Shimrith the Moabite; one of the servants who assassinate Joash. Corresponds to Jehozabad son of Shomer in 2 Kings 12:21.','textual variant',['Jehozabad son of Shimrith','Jehozabad son of Shomer']));

// Amaziah.
merge('amaziah-judah',{ref:'2 Chronicles 25'});merge('jehoaddan',{ref:'2 Chronicles 25:1'});merge('joash-israel',{ref:'2 Chronicles 25:17–24'});
put(R('prophet-amaziah-unnamed','Unnamed man of God in Amaziah’s reign','Judah / Amaziah','Prophet','unknown',[],[],'2 Chronicles 25:7–9','A man of God warns Amaziah not to take the Israelite troops. Because Scripture does not name him, this is not part of the named-person index and is retained only as a methodological note.','explicit'));
// Remove intentionally unnamed methodological placeholder from named-person count.
db.records=db.records.filter(r=>r.id!=='prophet-amaziah-unnamed');

// Uzziah.
merge('azariah-uzziah',{ref:'2 Chronicles 26',aliases:['Uzziah','Azariah'],note:'Chronicles consistently uses Uzziah in this reign and names his mother Jecoliah, his counselor Zechariah, and officers Jeiel, Maaseiah, Hananiah, and Azariah the priest.'});
merge('jecoliah',{ref:'2 Chronicles 26:3'});
put(R('zechariah-uzziah-counselor','Zechariah','Judah / Uzziah','Spiritual counselor','male',[],[],'2 Chronicles 26:5','Man who instructed Uzziah in the fear of God. His exact office and genealogy are not stated. Distinct from other Zechariahs.','explicit',['Zechariah counselor of Uzziah']));
put(R('jeiel-uzziah-scribe','Jeiel','Judah / Uzziah','Scribe / military official','male',[],[],'2 Chronicles 26:11','Scribe who, with Maaseiah, musters Uzziah’s army under Hananiah. Distinct from other Jeiels.','explicit',['Jeiel scribe under Uzziah']));
put(R('maaseiah-uzziah-officer','Maaseiah','Judah / Uzziah','Royal official','male',[],[],'2 Chronicles 26:11','Officer who, with Jeiel, musters Uzziah’s army under Hananiah. Distinct from other Maaseiahs.','explicit',['Maaseiah officer under Uzziah']));
put(R('hananiah-uzziah','Hananiah','Judah / Uzziah','Military commander','male',[],[],'2 Chronicles 26:11','Commander under whose authority Uzziah’s army is organized. Distinct from other Hananiahs.','explicit',['Hananiah commander under Uzziah']));
put(R('azariah-chief-priest-uzziah','Azariah','Judah / Uzziah','Chief priest','male',[],[],'2 Chronicles 26:17–20','Chief priest who confronts Uzziah for unlawfully burning incense. Distinct from King Azariah/Uzziah and other Azariahs.','explicit',['Azariah the priest under Uzziah']));
merge('jotham-judah',{ref:'2 Chronicles 26:21–23; 27'});

// Jotham and Ahaz.
put(R('jerushah','Jerushah','Davidic royal house','Person','female',['zadok-jerushah'],['jotham-judah'],'2 Chronicles 27:1','Daughter of Zadok, wife/queen-mother in Jotham’s household, and mother of Ahaz.','explicit',['Jerusha']));
put(R('zadok-jerushah','Zadok','Davidic royal house','Person','male',[],[],'2 Chronicles 27:1','Father of Jerushah, mother of King Jotham’s son Ahaz. Distinct from Zadok the priest unless Scripture explicitly identifies them.','unresolved identification',['Zadok father of Jerushah']));
merge('ahaz-judah',{parents:['jotham-judah','jerushah'],ref:'2 Chronicles 27:9; 28'});merge('rezin',{ref:'2 Chronicles 28:5'});merge('pekah',{ref:'2 Chronicles 28:6'});merge('remaliah',{ref:'2 Chronicles 28:6'});merge('tiglath-pileser',{ref:'2 Chronicles 28:20'});
put(R('zichri-ephraim','Zichri','Israel / Ahaz crisis','Warrior','male',[],[],'2 Chronicles 28:7','Ephraimite warrior who kills Maaseiah, Azrikam, and Elkanah during Pekah’s attack on Judah. Distinct from other Zichris.','explicit',['Zichri the Ephraimite']));
put(R('maaseiah-son-king-ahaz','Maaseiah','Davidic royal house','Royal son','male',['ahaz-judah'],[],'2 Chronicles 28:7','Called “the king’s son” and killed by Zichri during Pekah’s invasion. The text does not explicitly state whether “king’s son” is biological or an office-title, so the parent connection is probable rather than certain.','probable',['Maaseiah the king’s son']));
put(R('azrikam-palace','Azrikam','Judah / Ahaz','Palace official','male',[],[],'2 Chronicles 28:7','Officer over the palace, killed by Zichri. Distinct from other Azrikams.','explicit',['Azrikam over the palace']));
put(R('elkanah-second-king','Elkanah','Judah / Ahaz','Royal official','male',[],[],'2 Chronicles 28:7','Official second to the king, killed by Zichri. Distinct from other Elkanahs.','explicit',['Elkanah second to the king']));
put(R('oded-prophet-samaria','Oded','Israel / Ahaz crisis','Prophet','male',[],[],'2 Chronicles 28:9–15','Prophet in Samaria who confronts the Israelite army for enslaving Judean captives. Distinct from Oded father of Azariah in 2 Chronicles 15.','explicit',['Oded the prophet in Samaria']));
for(const [id,n,f] of [['azariah-johanan28','Azariah','Johanan'],['berechiah-meshillemoth','Berechiah','Meshillemoth'],['jehizkiah-shallum','Jehizkiah','Shallum'],['amasa-hadlai','Amasa','Hadlai']]){
 const fid=`${id}-father`;put(R(fid,f,'Israel / Ahaz crisis','Person','male',[],[],'2 Chronicles 28:12',`Father of ${n}, an Ephraimite leader who opposes enslaving the captives from Judah.`,'explicit',[`${f} father of ${n}`]));
 put(R(id,n,'Israel / Ahaz crisis','Tribal leader','male',[fid],[],'2 Chronicles 28:12–15',`${n} son of ${f}; one of four Ephraimite leaders who intervene after Oded’s prophecy.`,'explicit',[`${n} son of ${f}`]));
}

db.scope='Genesis–2 Chronicles 28';db.phase=6;
})();