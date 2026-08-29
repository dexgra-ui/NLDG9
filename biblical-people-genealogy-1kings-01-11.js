(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('solomon',{spouses:[],ref:'2 Samuel 12:24–25; 1 Kings 1–11','note':'Son of David and Bathsheba; also called Jedidiah. Succeeds David as king. First Kings says Solomon had seven hundred royal wives and three hundred concubines but does not name most of them; Pharaoh’s daughter is also unnamed.'});
update('david',{ref:'Ruth 4:17,22; 1 Samuel 16–31; 2 Samuel 1–24; 1 Kings 1–2','note':'Son of Jesse and king of Israel; dies after arranging Solomon’s succession.'});
update('bathsheba',{ref:'2 Samuel 11–12; 1 Kings 1:11–31; 2:13–25','note':'Daughter of Eliam, widow of Uriah, wife of David, and mother of Solomon; advocates for Solomon’s succession and later speaks with Adonijah.'});
update('nathan-prophet',{ref:'2 Samuel 7; 12:1–25; 1 Kings 1:8–45','note':'Prophet who supports Solomon’s accession and works with Bathsheba to alert David to Adonijah’s attempt.'});
update('zadok-ahitub',{ref:'2 Samuel 8:17; 15–20; 1 Kings 1:8,26,32–45; 2:26–35','note':'Priest loyal to David and Solomon; anoints Solomon king and later replaces Abiathar as chief priestly authority.'});
update('abiathar',{ref:'1 Samuel 22–30; 2 Samuel 8–20; 1 Kings 1:7,19,25,42; 2:22,26–27,35','note':'Priest from Eli’s line who supports Adonijah and is removed by Solomon, fulfilling the judgment on Eli’s house.'});
update('benaiah-jehoiada',{ref:'2 Samuel 8:18; 20:23; 23:20–23; 1 Kings 1–2; 4:4','note':'Son of Jehoiada; loyal to Solomon and becomes commander of the army after Joab’s death.'});
update('joab',{ref:'1 Samuel 26:6; 2 Samuel 2–24; 1 Kings 1:7,19; 2:5–6,28–35','note':'Son of Zeruiah and former commander of David’s army; supports Adonijah and is executed by Benaiah on Solomon’s order.'});
update('adonijah',{ref:'2 Samuel 3:4; 1 Kings 1–2','note':'Son of David and Haggith; attempts to secure the throne and is later executed after requesting Abishag as wife.'});
update('shimei-gera',{ref:'2 Samuel 16:5–13; 19:16–23; 1 Kings 2:8–9,36–46','note':'Benjaminite son of Gera; eventually executed by Solomon after violating the travel restriction imposed on him.'});
update('jonathan-abiathar',{ref:'2 Samuel 15:27,36; 17:17–21; 1 Kings 1:42–48','note':'Son of Abiathar; brings Adonijah news that Solomon has been made king.'});
update('hiram-tyre-david',{ref:'2 Samuel 5:11; 1 Kings 5:1–18; 9:11–14,26–28; 10:11,22','note':'King of Tyre and ally of David and Solomon; supplies cedar, craftsmen, and maritime cooperation.'});

const rows=[
R('abishag','Abishag','David royal house','Person','female',[],[],'1 Kings 1:3–4,15; 2:13–25','Shunammite young woman who cares for aged David. The text says David did not have sexual relations with her. Adonijah later requests her as wife, prompting Solomon to interpret the request politically.','explicit',['Abishag the Shunammite']),
R('rei-david','Rei','David administration','Person','male',[],[],'1 Kings 1:8','Named among those who do not support Adonijah. Little additional identifying information is given.','explicit',['Rei']),
R('achish-maacah','Achish','Philistines','King / ruler','male',['maacah-achish-father'],[],'1 Kings 2:39–40','King of Gath to whom Shimei’s servants flee; son of Maacah. May be related to or distinct from Achish son of Maoch in 1 Samuel; the text does not explicitly identify them.','unresolved identification',['Achish son of Maacah']),
R('maacah-achish-father','Maacah','Philistines','Person','male',[],[],'1 Kings 2:39','Father of Achish king of Gath. Distinct from numerous women and men named Maacah elsewhere.','explicit',['Maacah father of Achish']),
R('azariah-zadok','Azariah','Solomon administration','Official / priest','male',['zadok-ahitub'],[],'1 Kings 4:2','Son of Zadok, listed as priest/chief official in Solomon’s administration. Distinct from later people named Azariah.','explicit',['Azariah son of Zadok']),
R('shisha','Shisha','Solomon administration','Person','male',[],[],'1 Kings 4:3','Father of Elihoreph and Ahijah, Solomon’s secretaries.'),
R('elihoreph','Elihoreph','Solomon administration','Official','male',['shisha'],[],'1 Kings 4:3','Son of Shisha and secretary under Solomon.','explicit',[],[C('brother','ahijah-shisha','1 Kings 4:3')]),
R('ahijah-shisha','Ahijah','Solomon administration','Official','male',['shisha'],[],'1 Kings 4:3','Son of Shisha and secretary under Solomon. Distinct from Ahijah the Shilonite and Ahijah son of Ahitub.','explicit',['Ahijah son of Shisha'],[C('brother','elihoreph','1 Kings 4:3')]),
R('azariah-nathan','Azariah','Solomon administration','Official','male',['nathan-official-father'],[],'1 Kings 4:5','Son of a man named Nathan and official over district governors. The father is not automatically identified with Nathan the prophet.','unresolved identification',['Azariah son of Nathan']),
R('zabud-nathan','Zabud','Solomon administration','Priest / royal friend','male',['nathan-official-father'],[],'1 Kings 4:5','Son of Nathan, priest and king’s friend. First Kings places Azariah son of Nathan and Zabud son of Nathan together, strongly suggesting a shared father, but does not explicitly say they are brothers.','probable',['Zabud son of Nathan']),
R('nathan-official-father','Nathan','Solomon administration','Person','male',[],[],'1 Kings 4:5','Father named for Azariah and Zabud in Solomon’s administration. Often identified with Nathan the prophet, but 1 Kings 4 does not explicitly make that identification, so the record is kept separate.','unresolved identification',['Nathan (father of Solomon’s officials)']),
R('ahishar','Ahishar','Solomon administration','Official','male',[],[],'1 Kings 4:6','Official in charge of Solomon’s palace.'),
R('abda-adoniram','Abda','Solomon administration','Person','male',[],[],'1 Kings 4:6','Father of Adoniram.'),
R('adoniram','Adoniram','Solomon administration','Official','male',['abda-adoniram'],[],'1 Kings 4:6; 5:14; 12:18','Son of Abda and official over forced labor. He may be the same as Adoram in 2 Samuel 20, but the name forms and long span are not silently merged.','unresolved identification',['Adoniram son of Abda'],[C('possible same officeholder','adoram-david','2 Samuel 20:24; 1 Kings 4:6','The names Adoram/Adoniram may reflect the same person or office tradition.')]),
R('ben-hur-official','Ben-Hur','Solomon district governors','Official designation','male',[],[],'1 Kings 4:8','District governor over the hill country of Ephraim. Scripture preserves only the patronymic-style designation “Ben-Hur,” not a separate personal name.'),
R('ben-deker','Ben-Deker','Solomon district governors','Official designation','male',[],[],'1 Kings 4:9','District governor over Makaz, Shaalbim, Beth-shemesh, and Elon Beth-hanan. Personal name beyond the patronymic-style designation is not given.'),
R('ben-hesed','Ben-Hesed','Solomon district governors','Official designation','male',[],[],'1 Kings 4:10','District governor over Arubboth, Socoh, and the land of Hepher. Personal name beyond the designation is not given.'),
R('ben-abinadab','Ben-Abinadab','Solomon district governors','Official designation','male',[],['taphath'],'1 Kings 4:11','District governor over Naphath Dor; husband of Taphath daughter of Solomon. His personal name beyond “son of Abinadab” is not preserved.'),
R('taphath','Taphath','Solomon royal house','Princess','female',['solomon'],['ben-abinadab'],'1 Kings 4:11','Daughter of Solomon and wife of the district governor called Ben-Abinadab.'),
R('baana-ahilud','Baana','Solomon district governors','Official','male',['ahilud-baana'],[],'1 Kings 4:12','Son of a man named Ahilud; district governor over Taanach, Megiddo, and surrounding territory. Distinct from Baanah son of Rimmon and other Baanahs.','explicit',['Baana son of Ahilud']),
R('ahilud-baana','Ahilud','Solomon district governors','Person','male',[],[],'1 Kings 4:12','Father of Baana the district governor. He may be the same Ahilud who fathered Jehoshaphat the recorder, but First Kings does not explicitly identify the fathers as one person.','unresolved identification',['Ahilud father of Baana']),
R('ben-geber','Ben-Geber','Solomon district governors','Official designation','male',[],[],'1 Kings 4:13','District governor over Ramoth Gilead and the Havvoth Jair region. Personal name beyond the patronymic-style designation is not given.'),
R('iddo-ahinadab','Iddo','Solomon district governors','Person','male',[],[],'1 Kings 4:14','Father of Ahinadab. Distinct from later prophets or people named Iddo.'),
R('ahinadab','Ahinadab','Solomon district governors','Official','male',['iddo-ahinadab'],[],'1 Kings 4:14','Son of Iddo; district governor over Mahanaim.'),
R('ahimaaz-governor','Ahimaaz','Solomon district governors','Official','male',[],['basemath-solomon'],'1 Kings 4:15','District governor over Naphtali and husband of Basemath daughter of Solomon. He may be Ahimaaz son of Zadok, but the text does not explicitly identify him.','unresolved identification',['Ahimaaz governor of Naphtali']),
R('basemath-solomon','Basemath','Solomon royal house','Princess','female',['solomon'],['ahimaaz-governor'],'1 Kings 4:15','Daughter of Solomon and wife of Ahimaaz, district governor of Naphtali. Distinct from women named Basemath in Esau’s family.','explicit',['Basemath daughter of Solomon']),
R('hushai-baana','Hushai','Solomon district governors','Person','male',[],[],'1 Kings 4:16','Father of Baana, district governor over Asher and Aloth. May be Hushai the Arkite, but the text does not explicitly identify them.','unresolved identification',['Hushai father of Baana']),
R('baana-hushai','Baana','Solomon district governors','Official','male',['hushai-baana'],[],'1 Kings 4:16','Son of Hushai; district governor over Asher and Aloth. Distinct from other Baanahs.','explicit',['Baana son of Hushai']),
R('paruah','Paruah','Solomon district governors','Person','male',[],[],'1 Kings 4:17','Father of Jehoshaphat, district governor of Issachar.'),
R('jehoshaphat-paruah','Jehoshaphat','Solomon district governors','Official','male',['paruah'],[],'1 Kings 4:17','Son of Paruah; district governor over Issachar. Distinct from Jehoshaphat son of Ahilud and King Jehoshaphat of Judah.','explicit',['Jehoshaphat son of Paruah']),
R('ela-shimei','Ela','Solomon district governors','Person','male',[],[],'1 Kings 4:18','Father of Shimei, governor in Benjamin. Distinct from King Elah of Israel.'),
R('shimei-ela','Shimei','Solomon district governors','Official','male',['ela-shimei'],[],'1 Kings 4:18','Son of Ela; district governor over Benjamin. Distinct from Shimei son of Gera.','explicit',['Shimei son of Ela']),
R('uri-geber','Uri','Solomon district governors','Person','male',[],[],'1 Kings 4:19','Father of Geber.'),
R('geber-uri','Geber','Solomon district governors','Official','male',['uri-geber'],[],'1 Kings 4:19','Son of Uri; district governor over Gilead. Distinct from the official designated Ben-Geber.','explicit',['Geber son of Uri']),
R('hiram-craftsman','Hiram','Temple craftsmen','Craftsman','male',[],[],'1 Kings 7:13–45','Bronze craftsman from Tyre, son of a widow from Naphtali and a Tyrian bronze worker whose personal name is not given. Distinct from Hiram king of Tyre.','explicit',['Hiram the bronze worker','Huram']),
R('naamah-ammonite','Naamah','Solomon royal house','Queen mother','female',[],['solomon'],'1 Kings 11:21; 14:21,31','Ammonite wife of Solomon and mother of Rehoboam. First Kings names her again as Rehoboam’s mother.','explicit',['Naamah the Ammonite']),
R('rehoboam','Rehoboam','Davidic kings','King / ruler','male',['solomon','naamah-ammonite'],[],'1 Kings 11:43; 12–14','Son of Solomon and Naamah the Ammonite; succeeds Solomon as king of Judah.'),
R('hadad-edomite','Hadad','Solomon adversaries','Prince / adversary','male',[],[],'1 Kings 11:14–22','Edomite from the royal house who flees to Egypt as a child and later becomes an adversary to Solomon. His father is not named.'),
R('tahpenes','Tahpenes','Egypt / Hadad','Queen','female',[],[],'1 Kings 11:19–20','Queen of Egypt whose unnamed sister is given by Pharaoh to Hadad the Edomite; aunt of Genubath.'),
R('genubath','Genubath','Edom / Egypt','Person','male',['hadad-edomite'],[],'1 Kings 11:20','Son of Hadad the Edomite and the unnamed sister of Queen Tahpenes; raised in Pharaoh’s household.','explicit',[],[C('maternal aunt','tahpenes','1 Kings 11:19–20')]),
R('eliada-rezon','Eliada','Aram / Damascus','Person','male',[],[],'1 Kings 11:23','Father of Rezon.'),
R('rezon','Rezon','Aram / Damascus','King / adversary','male',['eliada-rezon'],[],'1 Kings 11:23–25','Son of Eliada; former servant of Hadadezer who becomes ruler in Damascus and adversary to Israel.'),
R('nebat','Nebat','Jeroboam house','Person','male',[],['zeruah'], '1 Kings 11:26; 12:2','Ephraimite father of Jeroboam. His wife Zeruah is described as a widow when Jeroboam is introduced.'),
R('zeruah','Zeruah','Jeroboam house','Person','female',[],['nebat'],'1 Kings 11:26','Mother of Jeroboam and widow of Nebat. Distinct from Zeruiah, mother of Joab.'),
R('jeroboam-i','Jeroboam','Northern kingdom','King / ruler','male',['nebat','zeruah'],[],'1 Kings 11:26–40; 12–14','Son of Nebat and Zeruah; Ephraimite servant of Solomon who becomes first king of the northern kingdom of Israel.','explicit',['Jeroboam son of Nebat','Jeroboam I']),
R('ahijah-shilonite','Ahijah','Prophets / northern kingdom','Prophet','male',[],[],'1 Kings 11:29–39; 14:2–18','Prophet from Shiloh who announces Jeroboam’s rise and later judgment on Jeroboam’s house. Distinct from Ahijah son of Ahitub and Ahijah son of Shisha.','explicit',['Ahijah the Shilonite'])
];

db.records.push(...rows);
db.scope='Genesis–1 Kings 11';
db.phase=5;
})();