(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

// Ezra and the priestly genealogy. Biblical genealogies may telescope generations, so the sequence is recorded as stated without claiming every link is chronologically immediate.
put(R('seraiah-ezra-line','Seraiah','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:1','First named ancestor above Ezra. Possibly related to/identified with the late-monarchy priest Seraiah, but the chronology and telescoping genealogy mean identity is not forced.','unresolved identification',['Seraiah in Ezra’s genealogy']));
put(R('azariah-ezra-line-1','Azariah','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:1','Ancestor named between Seraiah and Hilkiah in Ezra’s genealogy; distinct from other Azariahs unless the cross-book genealogy explicitly establishes identity.','unresolved identification',['Azariah in Ezra 7:1']));
put(R('hilkiah-ezra-line','Hilkiah','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:1','Ancestor in Ezra’s priestly genealogy. Possible relationship to the Josiah-era high priest Hilkiah is not forced solely from the shared name.','unresolved identification',['Hilkiah in Ezra’s genealogy']));
put(R('shallum-ezra-line','Shallum','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:2','Ancestor in Ezra’s priestly genealogy.'));
put(R('zadok-ezra-line','Zadok','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:2','Ancestor in Ezra’s priestly genealogy; likely tied to the Zadokite line, but the compressed genealogy is kept distinct from individual-identification claims.','unresolved identification',['Zadok in Ezra’s genealogy']));
put(R('ahitub-ezra-line','Ahitub','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:2','Ancestor in Ezra’s priestly genealogy.'));
put(R('amariah-ezra-line','Amariah','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:3','Ancestor in Ezra’s priestly genealogy.'));
put(R('azariah-ezra-line-2','Azariah','Ezra priestly line','Priestly ancestor','male',[],[],'Ezra 7:3','Second Azariah named in Ezra’s genealogy; kept separate from the earlier Azariah in the same list.','explicit',['Azariah in Ezra 7:3']));
for(const [id,n,ref] of [['meraioth-ezra','Meraioth','Ezra 7:3'],['zerahiah-ezra','Zerahiah','Ezra 7:4'],['uzzi-ezra','Uzzi','Ezra 7:4'],['bukki-ezra','Bukki','Ezra 7:4'],['abishua-ezra','Abishua','Ezra 7:5']])put(R(id,n,'Ezra priestly line','Priestly ancestor','male',[],[],ref,`Ancestor in Ezra’s genealogy. Cross-book identity with the similarly named Aaronic succession record is not forced solely from the repeated name.`,'unresolved identification',[`${n} in Ezra 7`]));
merge('phinehas',{ref:'Ezra 7:5'});merge('eleazar-aaron',{ref:'Ezra 7:5'});merge('aaron',{ref:'Ezra 7:5'});
put(R('ezra-scribe','Ezra','Return / Ezra','Priest / scribe','male',['seraiah-ezra-line'],[],'Ezra 7–10','Priest and skilled scribe in the Law of Moses who leads a later return and reform movement under Artaxerxes. Ezra 7 traces his priestly ancestry back to Aaron.','explicit',['Ezra the priest','Ezra the scribe']));
merge('artaxerxes-ezra',{ref:'Ezra 7:1,11–28; 8:1'});

// Ezra 8 return leaders.
put(R('gershom-phinehas-ezra','Gershom','Ezra return party','Return leader','male',[],[],'Ezra 8:2','Leader from the descendants of Phinehas in Ezra’s return party. Distinct from Gershom son of Moses.','explicit',['Gershom of the sons of Phinehas']));
put(R('daniel-ithamar-ezra','Daniel','Ezra return party','Return leader','male',[],[],'Ezra 8:2','Leader from the descendants of Ithamar. Distinct from Daniel of the exile narrative unless Scripture explicitly connects them.','explicit',['Daniel of the sons of Ithamar']));
put(R('hattush-ezra8','Hattush','Ezra return party','Return leader','male',[],[],'Ezra 8:2','Leader from the descendants of David in Ezra’s return party; exact intervening ancestry is not supplied in this verse.','explicit',['Hattush of the sons of David']));
put(R('zechariah-parosh','Zechariah','Ezra return party','Return leader','male',[],[],'Ezra 8:3','Leader associated with the sons of Shecaniah / Parosh; 150 males are registered with him. The verse’s family syntax varies across textual traditions.','textual variant',['Zechariah of Parosh']));
put(R('zerahiah-eliehoenai','Zerahiah','Ezra return party','Person','male',[],[],'Ezra 8:4','Father of Eliehoenai, leader from the family of Pahath-Moab.'));
put(R('eliehoenai-zerahiah','Eliehoenai','Ezra return party','Return leader','male',['zerahiah-eliehoenai'],[],'Ezra 8:4','Son of Zerahiah; leader from the family of Pahath-Moab.'));
put(R('jahaziel-shecaniah','Jahaziel','Ezra return party','Person','male',[],[],'Ezra 8:5','Father of the return leader named in the Shecaniah family line. The verse’s textual structure is compressed.','textual variant',['Jahaziel in Ezra 8:5']));
put(R('shecaniah-jahaziel-ezra','Shecaniah','Ezra return party','Return leader','male',['jahaziel-shecaniah'],[],'Ezra 8:5','Return leader associated with a family of Shecaniah; 300 males accompany the group. Textual traditions vary over the family heading.','textual variant',['Shecaniah son of Jahaziel']));
const leaders=[
['ebed-jonathan-ezra','Ebed','Jonathan','Ezra 8:6','Adin'],['jeshaiah-athaliah','Jeshaiah','Athaliah','Ezra 8:7','Elam'],['zebadiah-michael-ezra','Zebadiah','Michael','Ezra 8:8','Shephatiah'],['obadiah-jehiel-ezra','Obadiah','Jehiel','Ezra 8:9','Joab'],['shelomith-josiphiah','Shelomith','Josiphiah','Ezra 8:10','Shelomith'],['zechariah-bebai','Zechariah','Bebai','Ezra 8:11','Bebai'],['johanan-hakkatan','Johanan','Hakkatan','Ezra 8:12','Azgad']];
for(const [id,n,f,ref,fam] of leaders){const fid=`${id}-father`;put(R(fid,f,'Ezra return party','Person','male',[],[],ref,`Father of ${n}, return leader from the family of ${fam}. Distinct from other people named ${f}.`,'explicit',[`${f} father of ${n}`]));put(R(id,n,'Ezra return party','Return leader','male',[fid],[],ref,`Leads a group from the family of ${fam} in Ezra’s return.`,'explicit',[`${n} son of ${f}`]));}
for(const n of ['Eliphelet','Jeiel','Shemaiah'])put(R(`adonikam-last-${slug(n)}`,n,'Ezra return party','Return leader','male',[],[],'Ezra 8:13',`Named among the last descendants of Adonikam who return with Ezra. Distinct from other people named ${n}.`,'explicit',[`${n} of Adonikam`]));
for(const n of ['Uthai','Zabbud'])put(R(`bigvai-ezra8-${slug(n)}`,n,'Ezra return party','Return leader','male',[],[],'Ezra 8:14',`Leader from the descendants of Bigvai in Ezra’s return party.`,'explicit',[`${n} of Bigvai`]));

// Men sent to Iddo at Casiphia. Repeated Elnathan names are deliberately separate occurrences unless the text identifies them.
for(const [id,n] of [['eliezer-ezra8','Eliezer'],['ariel-ezra8','Ariel'],['shemaiah-ezra8','Shemaiah'],['elnathan-ezra8-a','Elnathan'],['jarib-ezra8','Jarib'],['elnathan-ezra8-b','Elnathan'],['nathan-ezra8','Nathan'],['zechariah-ezra8','Zechariah'],['meshullam-ezra8','Meshullam'],['joiarib-ezra8','Joiarib'],['elnathan-ezra8-c','Elnathan']])put(R(id,n,'Ezra return party','Leader / teacher','male',[],[],'Ezra 8:16',`Named man sent by Ezra to Iddo at Casiphia. ${n==='Elnathan'?'Ezra 8:16 names Elnathan more than once; the occurrences are kept separate because identity is not specified.':''}`,'unresolved identification',[`${n} (Ezra 8:16)`]));
put(R('iddo-casiphia','Iddo','Ezra return party','Leader','male',[],[],'Ezra 8:17','Chief at Casiphia from whom Ezra requests ministers for the house of God. Distinct from Iddo the seer and Iddo in Zechariah’s ancestry.','explicit',['Iddo at Casiphia']));
put(R('sherebiah','Sherebiah','Levi / Ezra','Levite leader','male',[],[],'Ezra 8:18,24; Nehemiah 8:7; 9:4–5; 10:12; 12:8,24','Levite of the line of Mahli brought to Ezra with sons and brothers; later appears in Nehemiah’s worship leadership.'));
put(R('hashabiah-ezra8','Hashabiah','Levi / Ezra','Levite leader','male',[],[],'Ezra 8:19,24','Levite associated with Jeshaiah of the descendants of Merari. Distinct from other Hashabiahs.','explicit',['Hashabiah in Ezra 8']));
put(R('jeshaiah-merari-ezra','Jeshaiah','Levi / Ezra','Levite leader','male',[],[],'Ezra 8:19','Levite from the descendants of Merari accompanying Hashabiah. Distinct from other Jeshaiahs.','explicit',['Jeshaiah of Merari']));

// Officials receiving the weighed treasure in Jerusalem.
put(R('uriah-meremoth','Uriah','Priests / Ezra','Priest','male',[],[],'Ezra 8:33','Father of Meremoth the priest. Distinct from other Uriahs.','explicit',['Uriah father of Meremoth']));
put(R('meremoth-uriah','Meremoth','Priests / Ezra','Priest','male',['uriah-meremoth'],[],'Ezra 8:33; 10:36; Nehemiah 3:4,21; 10:5; 12:3','Priest, son of Uriah, who receives the weighed treasure and later works on Jerusalem’s wall.'));
put(R('eleazar-phinehas-ezra','Eleazar','Priests / Ezra','Priest','male',['phinehas-ezra8'],[],'Ezra 8:33','Priest, son of a Phinehas, who helps receive the treasure. Distinct from Eleazar son of Aaron.','explicit',['Eleazar son of Phinehas (Ezra 8)']));
put(R('phinehas-ezra8','Phinehas','Priests / Ezra','Priest','male',[],[],'Ezra 8:33','Father of Eleazar in Ezra’s return period; distinct from Aaron’s grandson Phinehas by chronology.','explicit',['Phinehas father of Eleazar in Ezra 8']));
put(R('jeshua-jozabad-ezra','Jeshua','Levi / Ezra','Levite','male',[],[],'Ezra 8:33','Father of Jozabad the Levite. Distinct from Jeshua son of Jozadak.','explicit',['Jeshua father of Jozabad in Ezra 8']));
put(R('jozabad-jeshua-ezra','Jozabad','Levi / Ezra','Levite','male',['jeshua-jozabad-ezra'],[],'Ezra 8:33; 10:23','Levite, son of Jeshua, involved in receiving the treasure and later listed in the marriage reform.'));
put(R('binnui-noadiah','Binnui','Levi / Ezra','Levite','male',[],[],'Ezra 8:33','Father of Noadiah the Levite. Distinct from other Binnuis.','explicit',['Binnui father of Noadiah']));
put(R('noadiah-binnui','Noadiah','Levi / Ezra','Levite','male',['binnui-noadiah'],[],'Ezra 8:33','Levite, son of Binnui, involved in receiving the treasure.'));

// Ezra 10 reform leaders.
put(R('jehiel-shecaniah','Jehiel','Ezra reform','Person','male',[],[],'Ezra 10:2','Father of Shecaniah of the family of Elam. Distinct from other Jehiels.','explicit',['Jehiel father of Shecaniah']));
put(R('shecaniah-jehiel','Shecaniah','Ezra reform','Leader','male',['jehiel-shecaniah'],[],'Ezra 10:2–4','Son of Jehiel, of the descendants of Elam; urges Ezra to lead covenant reform.'));
put(R('eliashib-johanan-ezra','Eliashib','Ezra reform','Person','male',[],[],'Ezra 10:6','Father of Johanan whose chamber Ezra enters. Distinct from later high priest Eliashib unless Scripture connects them.','unresolved identification',['Eliashib father of Johanan']));
put(R('johanan-eliashib-ezra','Johanan','Ezra reform','Person','male',['eliashib-johanan-ezra'],[],'Ezra 10:6','Son of Eliashib; has a chamber in the temple complex.'));
put(R('asahel-jonathan-ezra','Asahel','Ezra reform','Person','male',[],[],'Ezra 10:15','Father of Jonathan who opposes or is appointed over the marriage investigation, depending translation. Distinct from David’s nephew Asahel.','explicit',['Asahel father of Jonathan']));
put(R('jonathan-asahel-ezra','Jonathan','Ezra reform','Leader','male',['asahel-jonathan-ezra'],[],'Ezra 10:15','Named in connection with administration/opposition concerning the marriage investigation.'));
put(R('tikvah-jahaziah','Tikvah','Ezra reform','Person','male',[],[],'Ezra 10:15','Father of Jahaziah.'));
put(R('jahaziah-tikvah','Jahaziah','Ezra reform','Leader','male',['tikvah-jahaziah'],[],'Ezra 10:15','Named with Jonathan son of Asahel in connection with the marriage investigation.'));
put(R('meshullam-ezra10','Meshullam','Ezra reform','Assistant','male',[],[],'Ezra 10:15','Assists Jonathan and Jahaziah in the matter; distinct from other Meshullams.','explicit',['Meshullam in Ezra 10:15']));
put(R('shabbethai-ezra','Shabbethai','Levi / Ezra','Levite','male',[],[],'Ezra 10:15; Nehemiah 8:7; 11:16','Levite who assists in the reform and later appears in Nehemiah.'));

// Named men in Ezra 10:18-44. Each is an actual present individual; family labels remain in the notes rather than being treated as their parents.
const lists={
 'Jeshua son of Jozadak priestly house':['Maaseiah','Eliezer','Jarib','Gedaliah'],
 'Immer priestly family':['Hanani','Zebadiah'],
 'Harim priestly family':['Maaseiah','Elijah','Shemaiah','Jehiel','Uzziah'],
 'Pashhur priestly family':['Elioenai','Maaseiah','Ishmael','Nethanel','Jozabad','Elasah'],
 'Levites':['Jozabad','Shimei','Kelaiah / Kelita','Pethahiah','Judah','Eliezer'],
 'Singers':['Eliashib'],
 'Gatekeepers':['Shallum','Telem','Uri'],
 'Parosh family':['Ramiah','Jeziah','Malchiah','Miamin','Eleazar','Malchijah','Benaiah'],
 'Elam family':['Mattaniah','Zechariah','Jehiel','Abdi','Jeremoth','Eliah'],
 'Zattu family':['Elioenai','Eliashib','Mattaniah','Jeremoth','Zabad','Aziza'],
 'Bebai family':['Jehohanan','Hananiah','Zabbai','Athlai'],
 'Bani family A':['Meshullam','Malluch','Adaiah','Jashub','Sheal','Ramoth'],
 'Pahath-Moab family':['Adna','Chelal','Benaiah','Maaseiah','Mattaniah','Bezalel','Binnui','Manasseh'],
 'Harim family':['Eliezer','Ishijah','Malchiah','Shemaiah','Shimeon','Benjamin','Malluch','Shemariah'],
 'Hashum family':['Mattenai','Mattathah','Zabad','Eliphelet','Jeremai','Manasseh','Shimei'],
 'Bani family B':['Maadai','Amram','Uel','Benaiah','Bedeiah','Chelluh','Vaniah','Meremoth','Eliashib','Mattaniah','Mattenai','Jaasau','Bani','Binnui','Shimei','Shelemiah','Nathan','Adaiah','Machnadebai','Shashai','Sharai','Azareel','Shelemiah','Shemariah','Shallum','Amariah','Joseph'],
 'Nebo family':['Jeiel','Mattithiah','Zabad','Zebina','Jadau','Joel','Benaiah']
};
let seq=0;for(const [family,names] of Object.entries(lists)){for(const raw of names){seq++;const aliases=raw.includes(' / ')?raw.split(' / '):[];const n=raw.split(' / ')[0];put(R(`ezra10-${seq}-${slug(n)}`,raw,'Ezra reform','Named individual','male',[],[],'Ezra 10:18–43',`Named man listed in the marriage-reform register under the ${family}. Kept separate from same-name people elsewhere unless Scripture supplies an identity link.`,'explicit',aliases));}}

db.scope='Genesis–Ezra';db.phase=7;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Ezra'])];
})();