(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const group=(id,n,ref,note='')=>put(R(id,n,'Return from exile','Family / clan','unknown',[],[],ref,note||`Family/clan label in the return list. The text counts descendants/household members rather than presenting ${n} as one of the current returnees.`));

merge('cyrus',{ref:'Ezra 1:1–8; 3:7; 4:3,5; 5:13–17; 6:3–14'});
put(R('mithredath-treasurer','Mithredath','Persia / return','Treasurer','male',[],[],'Ezra 1:8','Treasurer of Cyrus who counts out the temple vessels to Sheshbazzar. Distinct from Mithredath named in Ezra 4:7.','unresolved identification',['Mithredath the treasurer']));
put(R('sheshbazzar','Sheshbazzar','Return from exile','Leader / governor','male',[],[],'Ezra 1:8,11; 5:14–16','Called prince of Judah and later governor; receives the temple vessels and is credited with laying the foundation. His identification with Zerubbabel is debated and is not forced.','unresolved identification',['Sheshbazzar prince of Judah']));

// Named leaders of the first return.
for(const [id,n] of [['zerubbabel','Zerubbabel'],['jeshua-jozadak','Jeshua'],['nehemiah-return','Nehemiah'],['seraiah-return','Seraiah'],['reelaiah','Reelaiah'],['mordecai-return','Mordecai'],['bilshan','Bilshan'],['mispar','Mispar'],['bigvai-leader','Bigvai'],['rehum-return','Rehum'],['baanah-return','Baanah']])put(R(id,n,'Return from exile','Return leader','male',[],[],'Ezra 2:2',`Named among the leaders of the first return from Babylon. ${['Nehemiah','Mordecai','Seraiah','Rehum'].includes(n)?'Kept distinct from later people with the same name unless Scripture connects them.':''}`,'explicit',[`${n} (Ezra 2:2)`]));

// Return families in Ezra 2:3-35. These are collective descendant groups, not quietly individual people.
const fam=[
['parosh-family','Parosh','Ezra 2:3'],['shephatiah-family','Shephatiah','Ezra 2:4'],['arah-family','Arah','Ezra 2:5'],['pahath-moab-family','Pahath-Moab','Ezra 2:6'],['elam-family','Elam','Ezra 2:7'],['zattu-family','Zattu','Ezra 2:8'],['zaccai-family','Zaccai','Ezra 2:9'],['bani-family','Bani','Ezra 2:10'],['bebai-family','Bebai','Ezra 2:11'],['azgad-family','Azgad','Ezra 2:12'],['adonikam-family','Adonikam','Ezra 2:13'],['bigvai-family','Bigvai','Ezra 2:14'],['adin-family','Adin','Ezra 2:15'],['ater-hezekiah-family','Ater of Hezekiah','Ezra 2:16'],['bezai-family','Bezai','Ezra 2:17'],['jorah-family','Jorah','Ezra 2:18'],['hashum-family','Hashum','Ezra 2:19'],['gibbar-family','Gibbar','Ezra 2:20'],['bethlehem-family','Bethlehem returnees','Ezra 2:21'],['netophah-family','Netophah returnees','Ezra 2:22'],['anathoth-family','Anathoth returnees','Ezra 2:23'],['azmaveth-family','Azmaveth returnees','Ezra 2:24'],['kiriath-arim-family','Kiriath-Arim / Chephirah / Beeroth returnees','Ezra 2:25'],['ramah-geba-family','Ramah and Geba returnees','Ezra 2:26'],['michmas-family','Michmas returnees','Ezra 2:27'],['bethel-ai-family','Bethel and Ai returnees','Ezra 2:28'],['nebo-family','Nebo returnees','Ezra 2:29'],['magbish-family','Magbish returnees','Ezra 2:30'],['other-elam-family','Other Elam family','Ezra 2:31'],['harim-family','Harim','Ezra 2:32'],['lod-hadid-ono-family','Lod, Hadid, and Ono returnees','Ezra 2:33'],['jericho-family','Jericho returnees','Ezra 2:34'],['senaah-family','Senaah','Ezra 2:35']];fam.forEach(x=>group(...x));

// Priestly and Levitical families.
for(const [id,n,ref] of [['jedaiah-jeshua-priest-family','Jedaiah of the house of Jeshua','Ezra 2:36'],['immer-priest-family','Immer','Ezra 2:37'],['pashhur-priest-family','Pashhur','Ezra 2:38'],['harim-priest-family','Harim priestly family','Ezra 2:39'],['jeshua-kadmiel-levite-family','Jeshua and Kadmiel / Hodaviah Levites','Ezra 2:40'],['asaph-singers-family','Sons of Asaph','Ezra 2:41']])group(id,n,ref);
for(const n of ['Shallum','Ater','Talmon','Akkub','Hatita','Shobai'])group(`gatekeepers-${n.toLowerCase()}`,`Gatekeeper family of ${n}`,'Ezra 2:42');

// Temple servants (Nethinim) and Solomon's servants are collective family labels.
const neth=['Ziha','Hasupha','Tabbaoth','Keros','Siaha','Padon','Lebanah','Hagabah','Akkub','Hagab','Shalmai','Hanan','Giddel','Gahar','Reaiah','Rezin','Nekoda','Gazzam','Uzza','Paseah','Besai','Asnah','Meunim','Nephusim','Bakbuk','Hakupha','Harhur','Bazluth','Mehida','Harsha','Barkos','Sisera','Temah','Neziah','Hatipha'];
neth.forEach((n,i)=>group(`nethinim-${n.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,`Nethinim family of ${n}`,`Ezra 2:${43+Math.floor(i/6)}–54`,'Named temple-servant family in Ezra’s return list; treated as a collective family label, not automatically as a current individual.'));
const solServ=['Sotai','Hassophereth','Peruda','Jaalah','Darkon','Giddel','Shephatiah','Hattil','Pochereth-Hazzebaim','Ami'];solServ.forEach(n=>group(`solomon-servants-${n.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,`Servants-of-Solomon family of ${n}`,'Ezra 2:55–57'));

// Families unable to prove ancestry.
for(const [id,n] of [['delaiah-unregistered-family','Delaiah'],['tobiah-unregistered-family','Tobiah'],['nekoda-unregistered-family','Nekoda']])group(id,`${n} family unable to prove Israelite ancestry`,'Ezra 2:59–60');
for(const [id,n] of [['habaiah-priest-family','Habaiah'],['hakkoz-priest-family','Hakkoz'],['barzillai-priest-family','Barzillai priestly family']])group(id,n,'Ezra 2:61–63','Priestly family unable to establish genealogy in the register.');
merge('barzillai-gileadite',{ref:'Ezra 2:61',note:'A priestly ancestor had married a daughter of Barzillai the Gileadite and took that family name.'});

// Temple rebuilding leadership.
merge('zerubbabel',{parents:['shealtiel'],ref:'Ezra 3:2,8; 4:2–3; 5:2; 6:14'});merge('shealtiel',{ref:'Ezra 3:2,8; 5:2'});
put(R('jozadak','Jozadak','Aaronic / return','Priestly ancestor','male',[],[],'Ezra 3:2,8; 5:2; 10:18','Father of Jeshua the high priest; Chronicles calls Jehozadak a priest carried into exile. The forms are treated as the same name tradition.','textual variant',['Jozadak','Jehozadak']));
merge('jeshua-jozadak',{parents:['jozadak'],ref:'Ezra 3:2,8; 4:3; 5:2; 10:18',note:'High-priestly leader of the return, son of Jozadak/Jehozadak.'});
put(R('kadmiel','Kadmiel','Levi / return','Levite leader','male',[],[],'Ezra 2:40; 3:9','Levite leader associated with Jeshua in overseeing temple work.'));
put(R('henadad-family','Henadad','Levi / return','Family / clan','unknown',[],[],'Ezra 3:9','Levite family whose sons and brothers join the temple-work oversight.'));

// Persian correspondence and opposition.
put(R('ahasuerus-ezra4','Ahasuerus','Persia / opposition','King / ruler','male',[],[],'Ezra 4:6','Persian king in whose reign an accusation is written against Judah. Kept distinct in this database from any later Esther identification until the Persian royal chronology is audited together.','unresolved identification',['Ahasuerus (Ezra 4)']));
put(R('bishlam','Bishlam','Persia / opposition','Official / correspondent','male',[],[],'Ezra 4:7','Named in correspondence to Artaxerxes concerning Jerusalem.'));
put(R('mithredath-ezra4','Mithredath','Persia / opposition','Official / correspondent','male',[],[],'Ezra 4:7','Named in correspondence to Artaxerxes. Kept distinct from Cyrus’s treasurer in Ezra 1 because the text does not identify them.','unresolved identification',['Mithredath (Ezra 4:7)']));
put(R('tabeel','Tabeel','Persia / opposition','Official / correspondent','male',[],[],'Ezra 4:7','Named in correspondence to Artaxerxes.'));
put(R('rehum-commander','Rehum','Persia / opposition','Commander / official','male',[],[],'Ezra 4:8–23','Commander who writes with Shimshai to Artaxerxes opposing Jerusalem’s rebuilding. Distinct from Rehum in Ezra 2.','explicit',['Rehum the commander']));
put(R('shimshai','Shimshai','Persia / opposition','Scribe / official','male',[],[],'Ezra 4:8–23','Scribe who writes with Rehum to Artaxerxes.'));
put(R('artaxerxes-ezra','Artaxerxes','Persia / return','King / ruler','male',[],[],'Ezra 4:7–23; 6:14; 7–8','Persian king named in the correspondence and later in Ezra’s commission. The database keeps the biblical royal name without forcing modern regnal identification into the genealogy record.'));
put(R('darius-ezra','Darius','Persia / return','King / ruler','male',[],[],'Ezra 4:24; 5:5–17; 6:1–15','Persian king under whom the temple rebuilding is investigated and completed.'));
put(R('haggai','Haggai','Return / prophets','Prophet','male',[],[],'Ezra 5:1; 6:14','Prophet who, with Zechariah, prophesies to the Jews during temple rebuilding.'));
put(R('iddo-zechariah-return','Iddo','Return / prophets','Person / ancestor name','male',[],[],'Ezra 5:1; 6:14','Ancestor/father-line name attached to Zechariah the prophet. The prophetic book gives Berechiah son of Iddo; Ezra abbreviates the ancestry.','unresolved identification',['Iddo ancestor of Zechariah']));
put(R('zechariah-return-prophet','Zechariah','Return / prophets','Prophet','male',[],[],'Ezra 5:1; 6:14','Prophet identified in Ezra as descendant/son of Iddo; corresponds to Zechariah the post-exile prophet.','explicit',['Zechariah son/descendant of Iddo']));
put(R('tattenai','Tattenai','Persia / return','Governor','male',[],[],'Ezra 5:3–17; 6:6–13','Governor of the province Beyond the River who investigates the temple rebuilding and reports to Darius.'));
put(R('shethar-bozenai','Shethar-Bozenai','Persia / return','Official','male',[],[],'Ezra 5:3–17; 6:6–13','Official associated with Tattenai in the investigation of temple rebuilding.'));

db.scope='Genesis–Ezra 6';db.phase=7;
})();