(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,patch);};

['reuben','simeon','levi','judah','issachar','zebulun','benjamin','dan','naphtali','gad','asher','joseph'].forEach(id=>{const r=db.records.find(x=>x.id===id);if(r&&!r.ref.includes('Exodus 1'))r.ref+=`; Exodus 1:1–5`;});
update('gershon-levi',{ref:'Genesis 46:11; Exodus 6:16–17','note':'Son of Levi; father of Libni and Shimei.'});
update('kohath',{ref:'Genesis 46:11; Exodus 6:16,18','note':'Son of Levi; father of Amram, Izhar, Hebron, and Uzziel.'});
update('merari',{ref:'Genesis 46:11; Exodus 6:16,19','note':'Son of Levi; father of Mahli and Mushi.'});

const rows=[
R('shiphrah','Shiphrah','Exodus','Person','female',[],[],'Exodus 1:15–21','One of the two named Hebrew midwives who feared God and did not carry out Pharaoh’s command.'),
R('puah-midwife','Puah','Exodus','Person','female',[],[],'Exodus 1:15–21','One of the two named Hebrew midwives who feared God and did not carry out Pharaoh’s command. Distinct from later biblical people named Puah.','explicit',['Puah (midwife)']),
R('moses','Moses','Levi / Moses','Person','male',['amram','jochebed'],['zipporah'],'Exodus 2–40','Son of Amram and Jochebed; brother of Aaron. His relationship to Miriam as sibling is made explicit later in Numbers 26:59.','explicit',[],[C('brother','aaron','Exodus 4:14; 7:1–7'),C('father-in-law','jethro','Exodus 3:1; 18:1–27')]),
R('reuel-midian','Reuel','Midian / Moses','Person','male',[],[],'Exodus 2:16–21','Priest of Midian and father of seven daughters, including Zipporah. Exodus later calls Jethro Moses’ father-in-law; the database does not force Reuel and Jethro into one record because the text uses both names without an explicit identification statement.','unresolved identification',['Reuel (priest of Midian)'],[C('daughter','zipporah','Exodus 2:21')]),
R('zipporah','Zipporah','Midian / Moses','Person','female',['reuel-midian'],['moses'],'Exodus 2:21–22; 4:20,25–26; 18:2–6','Daughter of Reuel, wife of Moses, and mother of Gershom and Eliezer.'),
R('gershom-moses','Gershom','Moses','Person','male',['moses','zipporah'],[],'Exodus 2:22; 18:3','Son of Moses and Zipporah; distinct from Gershon son of Levi.','explicit',['Gershom (son of Moses)']),
R('jethro','Jethro','Midian / Moses','Person','male',[],[],'Exodus 3:1; 4:18; 18:1–27','Priest of Midian and father-in-law of Moses. Exodus 2 names Reuel as father of Zipporah; their precise name/identity relationship is left visible rather than silently harmonized.','unresolved identification',['Jethro (father-in-law of Moses)'],[C('son-in-law','moses','Exodus 3:1; 18:1–27')]),
R('aaron','Aaron','Levi / Aaronic','Person','male',['amram','jochebed'],['elisheba'],'Exodus 4:14–30; 6:20,23–27; 7–40','Son of Amram and Jochebed; brother of Moses; husband of Elisheba; father of Nadab, Abihu, Eleazar, and Ithamar.','explicit',[],[C('brother','moses','Exodus 4:14; 7:1–7')]),
R('eliezer-moses','Eliezer','Moses','Person','male',['moses','zipporah'],[],'Exodus 18:4','Son of Moses and Zipporah; distinct from Eliezer of Damascus.','explicit',['Eliezer (son of Moses)']),
R('libni-gershon','Libni','Levi / Gershonites','Person / ancestor name','male',['gershon-levi'],[],'Exodus 6:17','Son of Gershon.'),
R('shimei-gershon','Shimei','Levi / Gershonites','Person / ancestor name','male',['gershon-levi'],[],'Exodus 6:17','Son of Gershon; distinct from later people named Shimei.','explicit',['Shimei (son of Gershon)']),
R('amram','Amram','Levi / Kohathites','Person','male',['kohath'],['jochebed'],'Exodus 6:18,20','Son of Kohath; husband of Jochebed; father of Aaron and Moses. Numbers 26 later also names Miriam as their child.'),
R('izhar','Izhar','Levi / Kohathites','Person / ancestor name','male',['kohath'],[],'Exodus 6:18,21','Son of Kohath; father of Korah, Nepheg, and Zichri.'),
R('hebron-kohath','Hebron','Levi / Kohathites','Person / ancestor name','male',['kohath'],[],'Exodus 6:18','Son of Kohath; distinct from the place Hebron.','explicit',['Hebron (son of Kohath)']),
R('uzziel-kohath','Uzziel','Levi / Kohathites','Person','male',['kohath'],[],'Exodus 6:18,22','Son of Kohath; father of Mishael, Elzaphan, and Sithri.','explicit',['Uzziel (son of Kohath)']),
R('mahli-merari','Mahli','Levi / Merarites','Person / ancestor name','male',['merari'],[],'Exodus 6:19','Son of Merari.'),
R('mushi','Mushi','Levi / Merarites','Person / ancestor name','male',['merari'],[],'Exodus 6:19','Son of Merari.'),
R('jochebed','Jochebed','Levi / Aaronic','Person','female',[],['amram'],'Exodus 6:20','Wife of Amram and his father’s sister; mother of Aaron and Moses. Numbers 26:59 later explicitly calls her a daughter of Levi and names Miriam among her children.','explicit',[],[C('paternal aunt','amram','Exodus 6:20')]),
R('korah-izhar','Korah','Levi / Kohathites','Person','male',['izhar'],[],'Exodus 6:21,24','Son of Izhar; father of Assir, Elkanah, and Abiasaph. Distinct from Korah son of Esau and Oholibamah.','explicit',['Korah (son of Izhar)']),
R('nepheg-izhar','Nepheg','Levi / Kohathites','Person','male',['izhar'],[],'Exodus 6:21','Son of Izhar.'),
R('zichri-izhar','Zichri','Levi / Kohathites','Person','male',['izhar'],[],'Exodus 6:21','Son of Izhar.','explicit',['Zithri in some translations']),
R('mishael-uzziel','Mishael','Levi / Kohathites','Person','male',['uzziel-kohath'],[],'Exodus 6:22','Son of Uzziel; later assists with removal of Nadab and Abihu in Leviticus 10.','explicit',['Mishael (son of Uzziel)']),
R('elzaphan-uzziel','Elzaphan','Levi / Kohathites','Person','male',['uzziel-kohath'],[],'Exodus 6:22','Son of Uzziel; later named in Leviticus 10:4.','explicit',['Elzaphan','Elizaphan']),
R('sithri','Sithri','Levi / Kohathites','Person','male',['uzziel-kohath'],[],'Exodus 6:22','Son of Uzziel.'),
R('elisheba','Elisheba','Aaronic','Person','female',['amminadab'],['aaron'],'Exodus 6:23','Daughter of Amminadab, sister of Nahshon, wife of Aaron, and mother of Nadab, Abihu, Eleazar, and Ithamar.','explicit',[],[C('brother','nahshon','Exodus 6:23')]),
R('amminadab','Amminadab','Judah / Aaronic connection','Person / ancestor name','male',[],[],'Exodus 6:23','Father of Elisheba and Nahshon. Later genealogies connect him to the line of Judah.'),
R('nahshon','Nahshon','Judah / Aaronic connection','Person','male',['amminadab'],[],'Exodus 6:23','Son of Amminadab and brother of Elisheba; later named as leader of Judah in Numbers.','explicit',['Nahshon','Naasson'],[C('sister','elisheba','Exodus 6:23')]),
R('nadab-aaron','Nadab','Aaronic','Person','male',['aaron','elisheba'],[],'Exodus 6:23; 24:1,9; 28:1','Son of Aaron and Elisheba; brother of Abihu, Eleazar, and Ithamar.','explicit',['Nadab (son of Aaron)']),
R('abihu','Abihu','Aaronic','Person','male',['aaron','elisheba'],[],'Exodus 6:23; 24:1,9; 28:1','Son of Aaron and Elisheba; brother of Nadab, Eleazar, and Ithamar.'),
R('eleazar-aaron','Eleazar','Aaronic','Person','male',['aaron','elisheba'],[],'Exodus 6:23,25; 28:1','Son of Aaron and Elisheba; husband of an unnamed daughter of Putiel; father of Phinehas.','explicit',['Eleazar (son of Aaron)'],[C('father-in-law','putiel','Exodus 6:25','Eleazar married one of Putiel’s daughters.')]),
R('ithamar','Ithamar','Aaronic','Person','male',['aaron','elisheba'],[],'Exodus 6:23; 28:1; 38:21','Son of Aaron and Elisheba; brother of Nadab, Abihu, and Eleazar.'),
R('assir-korah','Assir','Levi / Korahites','Person / ancestor name','male',['korah-izhar'],[],'Exodus 6:24','Son of Korah.'),
R('elkanah-korah','Elkanah','Levi / Korahites','Person / ancestor name','male',['korah-izhar'],[],'Exodus 6:24','Son of Korah; distinct from later people named Elkanah.','explicit',['Elkanah (son of Korah)']),
R('abiasaph','Abiasaph','Levi / Korahites','Person / ancestor name','male',['korah-izhar'],[],'Exodus 6:24','Son of Korah.','explicit',['Ebiasaph']),
R('putiel','Putiel','Aaronic','Person','male',[],[],'Exodus 6:25','Father of the unnamed woman who married Eleazar; maternal grandfather of Phinehas.'),
R('phinehas','Phinehas','Aaronic','Person','male',['eleazar-aaron'],[],'Exodus 6:25','Son of Eleazar and an unnamed daughter of Putiel; grandson of Aaron.','explicit',[],[C('maternal grandfather','putiel','Exodus 6:25')]),
R('miriam','Moses / Aaron','Person','female',[],[],'Exodus 15:20–21','Prophetess explicitly called Aaron’s sister. Numbers 26:59 later names her as daughter of Amram and Jochebed and sister of Moses as well.','explicit',[],[C('brother','aaron','Exodus 15:20')]),
R('joshua','Joshua','Ephraim / Moses','Person','male',['nun'],[],'Exodus 17:9–14; 24:13; 32:17; 33:11','Son of Nun; assistant of Moses and military leader against Amalek.','explicit',['Joshua son of Nun','Hoshea (later name relationship stated in Numbers 13:16)']),
R('nun','Nun','Ephraim / Joshua','Person','male',[],[],'Exodus 33:11','Father of Joshua.'),
R('hur-leader','Hur','Exodus leadership','Person','male',[],[],'Exodus 17:10–12; 24:14','Leader who supports Moses with Aaron and is left with Aaron during Moses’ ascent. Scripture does not explicitly identify him with the Hur who is Bezalel’s grandfather.','unresolved identification',['Hur (with Moses and Aaron)']),
R('bezalel','Bezalel','Tabernacle craftsmen','Person','male',['uri-bezalel'],[],'Exodus 31:2–5; 35:30–35; 36–38','Son of Uri, grandson of Hur, of the tribe of Judah; specially called and equipped for tabernacle craftsmanship.','explicit',[],[C('grandfather','hur-bezalel','Exodus 31:2')]),
R('uri-bezalel','Uri','Tabernacle craftsmen','Person','male',['hur-bezalel'],[],'Exodus 31:2; 35:30; 38:22','Father of Bezalel and son of Hur.'),
R('hur-bezalel','Hur','Tabernacle craftsmen','Person','male',[],[],'Exodus 31:2; 35:30; 38:22','Grandfather of Bezalel through Uri. Scripture does not explicitly identify him with Hur who appears beside Moses and Aaron.','unresolved identification',['Hur (grandfather of Bezalel)']),
R('oholiab','Oholiab','Tabernacle craftsmen','Person','male',['ahisamach'],[],'Exodus 31:6; 35:34; 36:1–2; 38:23','Son of Ahisamach, of the tribe of Dan; appointed with Bezalel for tabernacle craftsmanship.','explicit',['Aholiab']),
R('ahisamach','Ahisamach','Tabernacle craftsmen','Person','male',[],[],'Exodus 31:6; 35:34; 38:23','Father of Oholiab, of the tribe of Dan.','explicit',['Ahisamach'])
];
db.records.push(...rows);
db.scope='Genesis–Exodus';
db.phase=3;
db.completedBooks=[...new Set([...(db.completedBooks||['Genesis']),'Genesis','Exodus'])];
})();