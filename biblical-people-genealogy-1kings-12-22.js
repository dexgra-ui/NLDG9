(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('rehoboam',{ref:'1 Kings 11:43; 12–14','note':'Son of Solomon and Naamah the Ammonite; first king of the southern kingdom after the division. Father of Abijam by Maacah daughter of Abishalom.'});
update('jeroboam-i',{ref:'1 Kings 11:26–40; 12–14','note':'Son of Nebat and Zeruah; first king of northern Israel; father of Abijah and Nadab. His wife is not named in 1 Kings.'});

const rows=[
R('shemaiah-prophet','Shemaiah','Prophets / Judah','Prophet','male',[],[],'1 Kings 12:22–24','Man of God who tells Rehoboam and Judah not to fight the northern tribes. Distinct from later people named Shemaiah.','explicit',['Shemaiah the man of God']),
R('abijah-jeroboam','Abijah','Jeroboam house','Prince','male',['jeroboam-i'],[],'1 Kings 14:1–18','Son of Jeroboam whose illness leads Jeroboam’s unnamed wife to consult Ahijah the Shilonite. He dies according to the prophet’s word.','explicit',['Abijah son of Jeroboam']),
R('nadab-jeroboam','Nadab','Northern kingdom','King / ruler','male',['jeroboam-i'],[],'1 Kings 14:20; 15:25–31','Son of Jeroboam; succeeds him as king of Israel and is killed by Baasha. Distinct from Nadab son of Aaron.','explicit',['Nadab son of Jeroboam']),
R('shishak','Shishak','Egypt / Judah','King / ruler','male',[],[],'1 Kings 14:25–26','King of Egypt who attacks Jerusalem in Rehoboam’s reign.','explicit',['Shishak king of Egypt','Shoshenq']),
R('abishalom','Abishalom','Davidic kings','Person','male',[],[],'1 Kings 15:2,10','Father/ancestor of Maacah, queen mother in Judah. Often identified with Absalom, but First Kings uses the name Abishalom and does not explicitly make the identification.','unresolved identification',['Abishalom']),
R('maacah-abijam','Maacah','Davidic kings','Queen mother','female',['abishalom'],['rehoboam'],'1 Kings 15:2,10,13','Daughter/descendant of Abishalom and mother of Abijam. First Kings 15:10 also calls Maacah Asa’s “mother,” but because Asa is Abijam’s son the title is commonly understood as queen mother/grandmother; biological parentage to Asa is therefore not entered.','explicit',['Maacah daughter of Abishalom'],[C('grandmother / queen mother','asa','1 Kings 15:10,13','Royal “mother” terminology appears to refer to Asa’s grandmother and queen mother.')]),
R('abijam','Abijam / Abijah','Davidic kings','King / ruler','male',['rehoboam','maacah-abijam'],[],'1 Kings 14:31; 15:1–8','Son of Rehoboam and Maacah; king of Judah. Chronicles generally uses the form Abijah.','textual variant',['Abijam','Abijah']),
R('asa','Asa','Davidic kings','King / ruler','male',['abijam'],[],'1 Kings 15:8–24; 22:41–43','Son of Abijam; king of Judah; father of Jehoshaphat. First Kings names Maacah as royal “mother” in his reign, understood as queen mother/grandmother rather than certain biological mother.','explicit',['Asa king of Judah']),
R('ahijah-baasha-father','Ahijah','Northern kingdom','Person','male',[],[],'1 Kings 15:27,33; 21:22','Father of Baasha. Distinct from Ahijah the Shilonite and other people named Ahijah.','explicit',['Ahijah father of Baasha']),
R('baasha','Baasha','Northern kingdom','King / ruler','male',['ahijah-baasha-father'],[],'1 Kings 15:27–16:7; 21:22','Son of Ahijah; kills Nadab and becomes king of Israel; father of Elah.'),
R('hanani-jehu','Hanani','Prophets / northern kingdom','Person','male',[],[],'1 Kings 16:1,7','Father of Jehu the prophet. Chronicles later names a seer Hanani; identity will be assessed in that audit.','unresolved identification',['Hanani father of Jehu']),
R('jehu-hanani','Jehu','Prophets / northern kingdom','Prophet','male',['hanani-jehu'],[],'1 Kings 16:1–7,12','Son of Hanani; prophet who announces judgment on Baasha’s house. Distinct from King Jehu son/descendant of Nimshi.','explicit',['Jehu son of Hanani']),
R('elah-baasha','Elah','Northern kingdom','King / ruler','male',['baasha'],[],'1 Kings 16:6–14','Son of Baasha; king of Israel killed by Zimri. Distinct from Ela father of Shimei in Solomon’s administration.','explicit',['Elah son of Baasha']),
R('zimri-king','Zimri','Northern kingdom','King / ruler','male',[],[],'1 Kings 16:9–20','Chariot commander who kills Elah and reigns seven days before dying in the burning palace. Distinct from Zimri son of Salu and other people named Zimri.','explicit',['Zimri king of Israel']),
R('ginath','Ginath','Northern kingdom','Person','male',[],[],'1 Kings 16:21–22','Father of Tibni.'),
R('tibni','Tibni','Northern kingdom','Rival king','male',['ginath'],[],'1 Kings 16:21–22','Son of Ginath; rival claimant supported by half the people during Omri’s rise.'),
R('omri','Omri','Northern kingdom','King / ruler','male',[],[],'1 Kings 16:16–28','Army commander who becomes king of Israel; father of Ahab and founder of the Omride dynasty.'),
R('ethbaal','Ethbaal','Sidon / Phoenicia','King / ruler','male',[],[],'1 Kings 16:31','King of the Sidonians and father of Jezebel.','explicit',['Ethbaal king of the Sidonians']),
R('jezebel','Jezebel','Northern kingdom','Queen','female',['ethbaal'],['ahab'],'1 Kings 16:31; 18:4,13,19; 19:1–2; 21; 22:52','Daughter of Ethbaal king of the Sidonians; wife of Ahab; mother of Ahaziah and, as later Kings shows, part of the Omride royal house.'),
R('ahab','Ahab','Northern kingdom','King / ruler','male',['omri'],['jezebel'],'1 Kings 16:28–22:40','Son of Omri; king of Israel; husband of Jezebel; father of Ahaziah and other sons later referenced.'),
R('hiel-bethel','Hiel','Northern kingdom','Person','male',[],[],'1 Kings 16:34','Man of Bethel who rebuilds Jericho; father of Abiram and Segub, whose deaths are tied to Joshua’s curse.'),
R('abiram-hiel','Abiram','Northern kingdom','Person','male',['hiel-bethel'],[],'1 Kings 16:34','Firstborn son of Hiel, who dies when Jericho’s foundation is laid. Distinct from Abiram son of Eliab in Numbers.','explicit',['Abiram son of Hiel']),
R('segub-hiel','Segub','Northern kingdom','Person','male',['hiel-bethel'],[],'1 Kings 16:34','Youngest son of Hiel, who dies when Jericho’s gates are set. Distinct from later people named Segub.','explicit',['Segub son of Hiel']),
R('elijah','Elijah','Prophets / northern kingdom','Prophet','male',[],[],'1 Kings 17–19; 21; 2 Kings 1–2','Tishbite prophet who confronts Ahab and Jezebel and later is taken up as Elisha succeeds him. His parents are not named.','explicit',['Elijah the Tishbite']),
R('obadiah-ahab','Obadiah','Northern kingdom','Official','male',[],[],'1 Kings 18:3–16','Palace administrator under Ahab who feared the LORD and hid prophets. Distinct from the prophet/book figure Obadiah unless Scripture identifies them.','unresolved identification',['Obadiah in Ahab’s household']),
R('shaphat-elisha','Shaphat','Elisha','Person','male',[],[],'1 Kings 19:16,19,21; 2 Kings 3:11','Father of Elisha.'),
R('elisha','Elisha','Prophets / northern kingdom','Prophet','male',['shaphat-elisha'],[],'1 Kings 19:16,19–21; 2 Kings 2–13','Son of Shaphat; called by Elijah and later succeeds him as prophet.'),
R('nimshi','Nimshi','Jehu house','Person / ancestor name','male',[],[],'1 Kings 19:16; 2 Kings 9:2,14,20','Named as ancestor of Jehu. First Kings calls Jehu son of Nimshi; 2 Kings specifies Jehu son of Jehoshaphat son of Nimshi, showing “son” in 1 Kings can denote descendant.'),
R('jehoshaphat-jehu-father','Jehoshaphat','Jehu house','Person','male',['nimshi'],[],'2 Kings 9:2,14','Son of Nimshi and father of Jehu. Distinct from King Jehoshaphat of Judah and other people named Jehoshaphat.','explicit',['Jehoshaphat father of Jehu']),
R('jehu-king','Jehu','Jehu house','King / ruler','male',['jehoshaphat-jehu-father'],[],'1 Kings 19:16–17; 2 Kings 9–10','Son of Jehoshaphat and grandson of Nimshi; anointed to overthrow Ahab’s house and later becomes king of Israel. First Kings abbreviates him as “son of Nimshi.”','explicit',['Jehu son of Nimshi','Jehu son of Jehoshaphat']),
R('tabrimmon','Tabrimmon','Aram / Damascus','Person / ancestor name','male',['hezion'],[],'1 Kings 15:18','Son of Hezion and father of Ben-Hadad king of Aram.'),
R('hezion','Hezion','Aram / Damascus','Person / ancestor name','male',[],[],'1 Kings 15:18','Father of Tabrimmon and grandfather of Ben-Hadad in Asa’s time.'),
R('benhadad-asa','Ben-Hadad','Aram / Damascus','King / ruler','male',['tabrimmon'],[],'1 Kings 15:18–20','Son of Tabrimmon and grandson of Hezion; king of Aram in Damascus whom Asa hires against Baasha. The later Ben-Hadad confronting Ahab may be the same king or a successor; identity is not forced.','unresolved identification',['Ben-Hadad (Asa era)']),
R('benhadad-ahab','Ben-Hadad','Aram / Damascus','King / ruler','male',[],[],'1 Kings 20:1–34','King of Aram who wars against Ahab and is later released after defeat. He may be identical with Ben-Hadad son of Tabrimmon in 1 Kings 15 or may be a successor; Scripture does not explicitly settle the identity.','unresolved identification',['Ben-Hadad (Ahab era)']),
R('naboth','Naboth','Northern kingdom','Person','male',[],[],'1 Kings 21','Jezreelite owner of the vineyard Ahab desires; falsely accused and killed through Jezebel’s scheme. His sons are not named in 1 Kings.'),
R('imlah','Imlah','Prophets / northern kingdom','Person','male',[],[],'1 Kings 22:8–9','Father of Micaiah.'),
R('micaiah-imlah','Micaiah','Prophets / northern kingdom','Prophet','male',['imlah'],[],'1 Kings 22:8–28','Son of Imlah; prophet who foretells Ahab’s defeat despite pressure from the royal court. Distinct from other people named Micaiah/Micah.','explicit',['Micaiah son of Imlah']),
R('chenaanah-zedekiah','Chenaanah','Prophets / northern kingdom','Person','male',[],[],'1 Kings 22:11,24','Father of Zedekiah, one of Ahab’s prophets.'),
R('zedekiah-chenaanah','Zedekiah','Prophets / northern kingdom','Prophet / court figure','male',['chenaanah-zedekiah'],[],'1 Kings 22:11,24','Son of Chenaanah; court prophet who opposes Micaiah. Distinct from King Zedekiah of Judah.','explicit',['Zedekiah son of Chenaanah']),
R('amon-governor','Amon','Northern kingdom','Governor / official','male',[],[],'1 Kings 22:26','Governor of the city who is ordered to imprison Micaiah. Distinct from King Amon of Judah.','explicit',['Amon the city governor']),
R('joash-ahab-prince','Joash','Northern kingdom','Prince / official','male',[],[],'1 Kings 22:26','Called “the king’s son” and involved in Micaiah’s imprisonment. The title may denote a royal prince or court office; biological parentage to Ahab is not forced.','unresolved identification',['Joash the king’s son']),
R('shilhi','Shilhi','Davidic kings','Person','male',[],[],'1 Kings 22:42','Father of Azubah.'),
R('azubah-shilhi','Azubah','Davidic kings','Queen mother','female',['shilhi'],['asa'],'1 Kings 22:42','Daughter of Shilhi, wife/consort of Asa, and mother of Jehoshaphat.'),
R('jehoshaphat-king','Jehoshaphat','Davidic kings','King / ruler','male',['asa','azubah-shilhi'],[],'1 Kings 22:41–50','Son of Asa and Azubah daughter of Shilhi; king of Judah and ally of Ahab in the Ramoth-gilead campaign.','explicit',['Jehoshaphat king of Judah']),
R('ahaziah-ahab','Ahaziah','Omride dynasty','King / ruler','male',['ahab','jezebel'],[],'1 Kings 22:40,51–53; 2 Kings 1','Son of Ahab and Jezebel; succeeds Ahab as king of Israel. Distinct from Ahaziah king of Judah later in 2 Kings.','explicit',['Ahaziah son of Ahab'])
];

db.records.push(...rows);
db.scope='Genesis–1 Kings';
db.phase=5;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'1 Kings'])];
})();