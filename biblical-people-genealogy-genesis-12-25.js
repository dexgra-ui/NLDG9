(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,patch);};

update('abram',{name:'Abraham',aliases:['Abram'],spouses:['sarai','keturah'],ref:'Genesis 11:26–31; 12–25',note:'Son of Terah. Abram is renamed Abraham in Genesis 17:5.',connections:[C('half-sister','sarai','Genesis 20:12','Abraham says Sarah is the daughter of his father but not of his mother.'),C('concubine / wife relationship','hagar','Genesis 16:3; 25:6','Genesis 16:3 describes Hagar being given to Abram as a wife; Genesis 25:6 refers to Abraham’s concubines.')]});
update('sarai',{name:'Sarah',aliases:['Sarai'],parents:['terah'],spouses:['abram'],ref:'Genesis 11:29–31; 12:10–20; 16–18; 20–23',note:'Wife and half-sister of Abraham. Sarai is renamed Sarah in Genesis 17:15. Genesis 20:12 states that she shared Abraham’s father but not his mother.',connections:[C('half-brother','abram','Genesis 20:12')]});
update('lot',{ref:'Genesis 11:27,31; 12:4–5; 13–14; 19','note':'Son of Haran and nephew of Abraham; father of Moab and Ben-ammi by his two unnamed daughters.'});
update('nahor-terah',{ref:'Genesis 11:26–29; 22:20–24; 24:10,15,24','note':'Son of Terah; husband of Milcah. Genesis 22 names eight sons by Milcah and four by his concubine Reumah.'});
update('milcah',{ref:'Genesis 11:29; 22:20–24; 24:15,24,47','note':'Daughter of Haran; wife of Nahor; mother of the eight sons listed in Genesis 22:20–23.'});

const rows=[
R('amraphel','Amraphel','Patriarchal era','King / ruler','male',[],[],'Genesis 14:1,9','King of Shinar in the coalition of four kings.'),
R('arioch-ellasar','Arioch','Patriarchal era','King / ruler','male',[],[],'Genesis 14:1,9','King of Ellasar.'),
R('chedorlaomer','Chedorlaomer','Patriarchal era','King / ruler','male',[],[],'Genesis 14:1,4–5,9,17','King of Elam and leader of the eastern coalition.'),
R('tidal-goiim','Tidal','Patriarchal era','King / ruler','male',[],[],'Genesis 14:1,9','King of Goiim / nations.'),
R('bera-sodom','Bera','Patriarchal era','King / ruler','male',[],[],'Genesis 14:2,8,17,21','King of Sodom.'),
R('birsha-gomorrah','Birsha','Patriarchal era','King / ruler','male',[],[],'Genesis 14:2,8','King of Gomorrah.'),
R('shinab-admah','Shinab','Patriarchal era','King / ruler','male',[],[],'Genesis 14:2,8','King of Admah.'),
R('shemeber-zeboiim','Shemeber','Patriarchal era','King / ruler','male',[],[],'Genesis 14:2,8','King of Zeboiim.'),
R('melchizedek','Melchizedek','Patriarchal era','Person','male',[],[],'Genesis 14:18–20','King of Salem and priest of God Most High; blesses Abram.'),
R('mamre-amorite','Mamre','Patriarchal era','Person','male',[],[],'Genesis 14:13,24','Amorite ally of Abram; brother of Eshcol and Aner.','explicit',[],[C('brother','eshcol-amorite','Genesis 14:13'),C('brother','aner-amorite','Genesis 14:13')]),
R('eshcol-amorite','Eshcol','Patriarchal era','Person','male',[],[],'Genesis 14:13,24','Amorite ally of Abram; brother of Mamre and Aner.','explicit',[],[C('brother','mamre-amorite','Genesis 14:13'),C('brother','aner-amorite','Genesis 14:13')]),
R('aner-amorite','Aner','Patriarchal era','Person','male',[],[],'Genesis 14:13,24','Amorite ally of Abram; brother of Mamre and Eshcol.','explicit',[],[C('brother','mamre-amorite','Genesis 14:13'),C('brother','eshcol-amorite','Genesis 14:13')]),
R('eliezer-damascus','Eliezer of Damascus','Abraham','Person','male',[],[],'Genesis 15:2','Named in Abraham’s complaint about his household heir. The precise force of the Hebrew description is difficult, so the database does not add a family relationship.'),
R('hagar','Hagar','Abraham','Person','female',[],[],'Genesis 16; 21:9–21; 25:12','Egyptian servant of Sarah and mother of Ishmael.','explicit',[],[C('mistress','sarai','Genesis 16:1'),C('concubine / wife relationship','abram','Genesis 16:3; 25:6')]),
R('ishmael','Ishmael','Abraham','Person','male',['abram','hagar'],[],'Genesis 16:11–16; 17:18–26; 21:8–21; 25:9,12–18','Son of Abraham and Hagar; father of twelve named sons.'),
R('isaac','Isaac','Abraham','Person','male',['abram','sarai'],['rebekah'],'Genesis 17:19,21; 21:1–8; 22; 24–28; 35:27–29','Son of Abraham and Sarah; husband of Rebekah; father of Esau and Jacob.'),
R('abimelech-gerar-abraham','Abimelech','Abraham','King / ruler','male',[],[],'Genesis 20:2–18; 21:22–32','King of Gerar in Abraham’s time. A later Abimelech appears in Isaac’s story; Genesis does not explicitly identify the two as the same person.','unresolved identification',['Abimelech (Abraham narrative)']),
R('phicol-abraham','Phicol','Abraham','Person','male',[],[],'Genesis 21:22,32','Commander of Abimelech’s army in the Abraham narrative. A Phicol also appears in Genesis 26; identity is not explicitly stated.','unresolved identification',['Phicol (Abraham narrative)']),
R('moab-lot','Moab','Lot','Person / ancestor name','male',['lot'],[],'Genesis 19:37','Son of Lot by Lot’s unnamed elder daughter; ancestor-name of the Moabites.'),
R('ben-ammi','Ben-ammi','Lot','Person / ancestor name','male',['lot'],[],'Genesis 19:38','Son of Lot by Lot’s unnamed younger daughter; ancestor-name of the Ammonites.'),
R('uz-nahor','Uz','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:20–21','Firstborn son of Nahor and Milcah; distinct from Uz son of Aram in Genesis 10.','explicit',['Uz (son of Nahor)']),
R('buz-nahor','Buz','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:21','Son of Nahor and Milcah.'),
R('kemuel-nahor','Kemuel','Nahor','Person','male',['nahor-terah','milcah'],[],'Genesis 22:21','Son of Nahor and Milcah; father of Aram.'),
R('aram-kemuel','Aram','Nahor','Person / ancestor name','male',['kemuel-nahor'],[],'Genesis 22:21','Son of Kemuel; distinct from Aram son of Shem in Genesis 10.','explicit',['Aram (son of Kemuel)']),
R('chesed-nahor','Chesed','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:22','Son of Nahor and Milcah.','explicit',['Kesed']),
R('hazo','Hazo','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:22','Son of Nahor and Milcah.'),
R('pildash','Pildash','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:22','Son of Nahor and Milcah.'),
R('jidlaph','Jidlaph','Nahor','Person / ancestor name','male',['nahor-terah','milcah'],[],'Genesis 22:22','Son of Nahor and Milcah.'),
R('bethuel','Bethuel','Nahor','Person','male',['nahor-terah','milcah'],[],'Genesis 22:22–23; 24:15,24,47; 25:20; 28:2,5','Son of Nahor and Milcah; father of Rebekah and Laban.'),
R('rebekah','Rebekah','Isaac','Person','female',['bethuel'],['isaac'],'Genesis 22:23; 24–28; 35:8','Daughter of Bethuel, sister of Laban, wife of Isaac, and mother of Esau and Jacob.','explicit',[],[C('brother','laban','Genesis 24:29')]),
R('laban','Laban','Nahor','Person','male',['bethuel'],[],'Genesis 24:29–60; 27:43; 28:2,5; 29–31','Son of Bethuel and brother of Rebekah; later father of Leah and Rachel.','explicit',[],[C('sister','rebekah','Genesis 24:29')]),
R('reumah','Reumah','Nahor','Person','female',[],[],'Genesis 22:24','Concubine of Nahor and mother of Tebah, Gaham, Tahash, and Maacah.','explicit',[],[C('concubine','nahor-terah','Genesis 22:24')]),
R('tebah','Tebah','Nahor','Person / ancestor name','male',['nahor-terah','reumah'],[],'Genesis 22:24','Son of Nahor and Reumah.'),
R('gaham','Gaham','Nahor','Person / ancestor name','male',['nahor-terah','reumah'],[],'Genesis 22:24','Son of Nahor and Reumah.'),
R('tahash','Tahash','Nahor','Person / ancestor name','male',['nahor-terah','reumah'],[],'Genesis 22:24','Son of Nahor and Reumah.','explicit',['Thahash']),
R('maacah-nahor','Maacah','Nahor','Person / ancestor name','male',['nahor-terah','reumah'],[],'Genesis 22:24','Child of Nahor and Reumah; distinct from later biblical people named Maacah.','explicit',['Maakah']),
R('zohar-hittite','Zohar','Heth','Person','male',[],[],'Genesis 23:8; 25:9','Father of Ephron the Hittite; distinct from later Zohar son of Simeon.','explicit',['Zohar (father of Ephron)']),
R('ephron-hittite','Ephron','Heth','Person','male',['zohar-hittite'],[],'Genesis 23:8–17; 25:9; 49:29–30; 50:13','Hittite son of Zohar who sells Abraham the field and cave of Machpelah.'),
R('hittites','Hittites / sons of Heth','Heth','People group / clan','unknown',['heth'],[],'Genesis 23:3–20; 25:10','Collective people identified as the sons of Heth in the patriarchal burial account.','explicit',['Sons of Heth']),
R('keturah','Keturah','Abraham','Person','female',[],['abram'],'Genesis 25:1–6','Wife of Abraham; mother of six named sons.'),
R('zimran','Zimran','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2','Son of Abraham and Keturah.'),
R('jokshan','Jokshan','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2–3','Son of Abraham and Keturah; father of Sheba and Dedan.'),
R('medan','Medan','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2','Son of Abraham and Keturah.'),
R('midian','Midian','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2,4','Son of Abraham and Keturah; father of five named sons.'),
R('ishbak','Ishbak','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2','Son of Abraham and Keturah.'),
R('shuah-keturah','Shuah','Keturah','Person / ancestor name','male',['abram','keturah'],[],'Genesis 25:2','Son of Abraham and Keturah; distinct from Shua, Judah’s Canaanite father-in-law in Genesis 38.','explicit',['Shuah (son of Abraham)']),
R('sheba-jokshan','Sheba','Keturah','Person / ancestor name','male',['jokshan'],[],'Genesis 25:3','Son of Jokshan; distinct from the Shebas in Genesis 10.','explicit',['Sheba (son of Jokshan)']),
R('dedan-jokshan','Dedan','Keturah','Person / ancestor name','male',['jokshan'],[],'Genesis 25:3','Son of Jokshan; distinct from Dedan son of Raamah in Genesis 10.','explicit',['Dedan (son of Jokshan)']),
R('asshurim','Asshurim','Keturah','People group / clan','unknown',['dedan-jokshan'],[],'Genesis 25:3','Collective descendants of Dedan.'),
R('letushim','Letushim','Keturah','People group / clan','unknown',['dedan-jokshan'],[],'Genesis 25:3','Collective descendants of Dedan.'),
R('leummim','Leummim','Keturah','People group / clan','unknown',['dedan-jokshan'],[],'Genesis 25:3','Collective descendants of Dedan.'),
R('ephah-midian','Ephah','Keturah','Person / ancestor name','male',['midian'],[],'Genesis 25:4','Son of Midian.'),
R('epher-midian','Epher','Keturah','Person / ancestor name','male',['midian'],[],'Genesis 25:4','Son of Midian.'),
R('hanoch-midian','Hanoch','Keturah','Person / ancestor name','male',['midian'],[],'Genesis 25:4','Son of Midian; distinct from later Hanoch son of Reuben.','explicit',['Hanoch (son of Midian)']),
R('abida','Abida','Keturah','Person / ancestor name','male',['midian'],[],'Genesis 25:4','Son of Midian.'),
R('eldaah','Eldaah','Keturah','Person / ancestor name','male',['midian'],[],'Genesis 25:4','Son of Midian.'),
R('nebaioth','Nebaioth','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:13; 28:9; 36:3','Firstborn son of Ishmael.','explicit',['Nebajoth']),
R('kedar','Kedar','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:13','Son of Ishmael.'),
R('adbeel','Adbeel','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:13','Son of Ishmael.'),
R('mibsam-ishmael','Mibsam','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:13','Son of Ishmael; later a Mibsam appears in Simeon’s genealogy.','explicit',['Mibsam (son of Ishmael)']),
R('mishma','Mishma','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:14','Son of Ishmael.'),
R('dumah-ishmael','Dumah','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:14','Son of Ishmael.'),
R('massa-ishmael','Massa','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:14','Son of Ishmael.'),
R('hadad-ishmael','Hadad','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:15','Son of Ishmael. Some textual traditions/translations read Hadar.','textual variant',['Hadar']),
R('tema','Tema','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:15','Son of Ishmael.'),
R('jetur','Jetur','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:15','Son of Ishmael.'),
R('naphish','Naphish','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:15','Son of Ishmael.'),
R('kedemah','Kedemah','Ishmael','Person / ancestor name','male',['ishmael'],[],'Genesis 25:15','Son of Ishmael.'),
R('esau','Esau','Isaac','Person','male',['isaac','rebekah'],[],'Genesis 25:25–34; 26–28; 32–36','Son of Isaac and Rebekah; twin brother of Jacob; also called Edom.','explicit',['Edom'],[C('twin brother','jacob','Genesis 25:24–26')]),
R('jacob','Jacob / Israel','Isaac','Person','male',['isaac','rebekah'],[],'Genesis 25:26–34; 27–50','Son of Isaac and Rebekah; twin brother of Esau. God gives him the name Israel in Genesis 32:28 and again in Genesis 35:10.','explicit',['Jacob','Israel'],[C('twin brother','esau','Genesis 25:24–26')])
];
db.records.push(...rows);
db.scope='Genesis 1–25';
db.phase=2;
db.methodology.kinds=[...new Set([...(db.methodology.kinds||[]),'Person / ancestor name','King / ruler'])];
db.methodology.certainty=[...new Set([...(db.methodology.certainty||[]),'unresolved identification'])];
})();