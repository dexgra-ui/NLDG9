(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,patch);};

update('joseph',{spouses:['asenath'],ref:'Genesis 30:22–24; 37–50',note:'Son of Jacob and Rachel; sold into Egypt, later elevated under Pharaoh, and given the Egyptian name Zaphenath-paneah.',aliases:['Zaphenath-paneah']});
update('judah',{ref:'Genesis 29:35; 37–38; 43–46; 49:8–12',note:'Son of Jacob and Leah; father of Er, Onan, Shelah, Perez, and Zerah. The mother of his first three sons is the unnamed daughter of Shua.'});

const rows=[
R('potiphar','Potiphar','Joseph in Egypt','Person','male',[],[],'Genesis 37:36; 39:1–20','Egyptian official of Pharaoh, captain of the guard, who purchases Joseph. Distinct from Potiphera, father of Asenath.','explicit',['Potiphar the Egyptian']),
R('hirah-adullamite','Hirah','Judah','Person','male',[],[],'Genesis 38:1,12,20','Adullamite friend / associate of Judah.'),
R('shua-canaanite','Shua','Judah','Person','male',[],[],'Genesis 38:2,12','Canaanite father of Judah’s unnamed wife; distinct from Shuah son of Abraham and Keturah.','explicit',['Shua (Judah’s father-in-law)']),
R('er-judah','Er','Judah','Person','male',['judah'],['tamar'],'Genesis 38:3,6–7; 46:12','Firstborn son of Judah by the unnamed daughter of Shua; husband of Tamar.','explicit',['Er (son of Judah)'],[C('maternal grandfather','shua-canaanite','Genesis 38:2–3')]),
R('onan-judah','Onan','Judah','Person','male',['judah'],[],'Genesis 38:4,8–10; 46:12','Second son of Judah by the unnamed daughter of Shua.','explicit',['Onan (son of Judah)'],[C('maternal grandfather','shua-canaanite','Genesis 38:2,4')]),
R('shelah-judah','Shelah','Judah','Person','male',['judah'],[],'Genesis 38:5,11,14,26; 46:12','Son of Judah by the unnamed daughter of Shua; distinct from Shelah in the line of Shem.','explicit',['Shelah (son of Judah)'],[C('maternal grandfather','shua-canaanite','Genesis 38:2,5')]),
R('tamar','Tamar','Judah','Person','female',[],['er-judah'],'Genesis 38','Wife of Er and mother of Perez and Zerah by Judah.','explicit',[],[C('father of children','judah','Genesis 38:24–30')]),
R('perez','Perez','Judah','Person','male',['judah','tamar'],[],'Genesis 38:27–30; 46:12','Twin son of Judah and Tamar; father of Hezron and Hamul.','explicit',['Pharez'],[C('twin brother','zerah-judah','Genesis 38:27–30')]),
R('zerah-judah','Zerah','Judah','Person','male',['judah','tamar'],[],'Genesis 38:27–30; 46:12','Twin son of Judah and Tamar; distinct from other biblical people named Zerah.','explicit',['Zerah (son of Judah)','Zarah'],[C('twin brother','perez','Genesis 38:27–30')]),
R('asenath','Asenath','Joseph in Egypt','Person','female',['potiphera'],['joseph'],'Genesis 41:45,50; 46:20','Daughter of Potiphera, priest of On; wife of Joseph; mother of Manasseh and Ephraim.'),
R('potiphera','Potiphera','Joseph in Egypt','Person','male',[],[],'Genesis 41:45,50; 46:20','Priest of On and father of Asenath; distinct from Potiphar.','explicit',['Poti-phera']),
R('manasseh','Manasseh','Joseph','Person','male',['joseph','asenath'],[],'Genesis 41:50–51; 46:20; 48; 50:23','Firstborn son of Joseph and Asenath.'),
R('ephraim','Ephraim','Joseph','Person','male',['joseph','asenath'],[],'Genesis 41:50,52; 46:20; 48; 50:23','Second son of Joseph and Asenath.'),

R('hanoch-reuben','Hanoch','Reuben','Person / ancestor name','male',['reuben'],[],'Genesis 46:9','Son of Reuben; distinct from Hanoch son of Midian.','explicit',['Hanok','Hanoch (son of Reuben)']),
R('pallu','Pallu','Reuben','Person / ancestor name','male',['reuben'],[],'Genesis 46:9','Son of Reuben.'),
R('hezron-reuben','Hezron','Reuben','Person / ancestor name','male',['reuben'],[],'Genesis 46:9','Son of Reuben; distinct from Hezron son of Perez.','explicit',['Hezron (son of Reuben)']),
R('carmi-reuben','Carmi','Reuben','Person / ancestor name','male',['reuben'],[],'Genesis 46:9','Son of Reuben.','explicit',['Karmi']),
R('jemuel','Jemuel','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon. Later genealogical traditions use Nemuel.','textual variant',['Nemuel']),
R('jamin-simeon','Jamin','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon.'),
R('ohad','Ohad','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon.'),
R('jachin-simeon','Jachin','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon.','explicit',['Jakin']),
R('zohar-simeon','Zohar','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon; distinct from Zohar father of Ephron.','explicit',['Zohar (son of Simeon)']),
R('shaul-simeon','Shaul','Simeon','Person / ancestor name','male',['simeon'],[],'Genesis 46:10','Son of Simeon by an unnamed Canaanite woman; distinct from Shaul king of Edom.','explicit',['Shaul (son of Simeon)']),
R('gershon-levi','Gershon','Levi','Person / ancestor name','male',['levi'],[],'Genesis 46:11','Son of Levi.'),
R('kohath','Kohath','Levi','Person / ancestor name','male',['levi'],[],'Genesis 46:11','Son of Levi.'),
R('merari','Merari','Levi','Person / ancestor name','male',['levi'],[],'Genesis 46:11','Son of Levi.'),
R('hezron-perez','Hezron','Judah','Person / ancestor name','male',['perez'],[],'Genesis 46:12','Son of Perez; distinct from Hezron son of Reuben.','explicit',['Hezron (son of Perez)']),
R('hamul','Hamul','Judah','Person / ancestor name','male',['perez'],[],'Genesis 46:12','Son of Perez.'),
R('tola-issachar','Tola','Issachar','Person / ancestor name','male',['issachar'],[],'Genesis 46:13','Son of Issachar.'),
R('puvah-issachar','Puvah / Puah','Issachar','Person / ancestor name','male',['issachar'],[],'Genesis 46:13','Son of Issachar. Manuscript and translation traditions vary between Puvah and Puah.','textual variant',['Puvah','Puah']),
R('jashub-issachar','Jashub / Job','Issachar','Person / ancestor name','male',['issachar'],[],'Genesis 46:13','Son of Issachar. The Masoretic form is often rendered Job; Samaritan/Syriac and later genealogies support Jashub.','textual variant',['Jashub','Job']),
R('shimron','Shimron','Issachar','Person / ancestor name','male',['issachar'],[],'Genesis 46:13','Son of Issachar.'),
R('sered','Sered','Zebulun','Person / ancestor name','male',['zebulun'],[],'Genesis 46:14','Son of Zebulun.'),
R('elon-zebulun','Elon','Zebulun','Person / ancestor name','male',['zebulun'],[],'Genesis 46:14','Son of Zebulun; distinct from Elon the Hittite.','explicit',['Elon (son of Zebulun)']),
R('jahleel','Jahleel','Zebulun','Person / ancestor name','male',['zebulun'],[],'Genesis 46:14','Son of Zebulun.'),
R('ziphion-gad','Ziphion / Zephon','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad. The Masoretic form is commonly Ziphion; other ancient witnesses and later genealogy use Zephon.','textual variant',['Ziphion','Zephon']),
R('haggi','Haggi','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad.'),
R('shuni','Shuni','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad.'),
R('ezbon-gad','Ezbon','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad. Later genealogy has Ozni.','textual variant',['Ozni']),
R('eri','Eri','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad.'),
R('arodi','Arodi','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad.','explicit',['Arod']),
R('areli','Areli','Gad','Person / ancestor name','male',['gad'],[],'Genesis 46:16','Son of Gad.'),
R('imnah','Imnah','Asher','Person / ancestor name','male',['asher'],[],'Genesis 46:17','Son of Asher.'),
R('ishvah','Ishvah','Asher','Person / ancestor name','male',['asher'],[],'Genesis 46:17','Son of Asher.','explicit',['Ishua']),
R('ishvi','Ishvi','Asher','Person / ancestor name','male',['asher'],[],'Genesis 46:17','Son of Asher.','explicit',['Isui']),
R('beriah-asher','Beriah','Asher','Person / ancestor name','male',['asher'],[],'Genesis 46:17','Son of Asher; father of Heber and Malchiel.'),
R('serah-asher','Serah','Asher','Person','female',['asher'],[],'Genesis 46:17','Daughter of Asher; sister of Imnah, Ishvah, Ishvi, and Beriah.','explicit',[],[C('brother','imnah','Genesis 46:17'),C('brother','ishvah','Genesis 46:17'),C('brother','ishvi','Genesis 46:17'),C('brother','beriah-asher','Genesis 46:17')]),
R('heber-beriah','Heber','Asher','Person / ancestor name','male',['beriah-asher'],[],'Genesis 46:17','Son of Beriah.'),
R('malchiel','Malchiel','Asher','Person / ancestor name','male',['beriah-asher'],[],'Genesis 46:17','Son of Beriah.','explicit',['Malkiel']),
R('bela-benjamin','Bela','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son of Benjamin; distinct from Bela king of Edom.','explicit',['Bela (son of Benjamin)']),
R('becher-benjamin','Becher','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.','explicit',['Beker']),
R('ashbel','Ashbel','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('gera-benjamin','Gera','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('naaman-benjamin','Naaman','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin; distinct from later people named Naaman.'),
R('ehi-benjamin','Ehi','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('rosh-benjamin','Rosh','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('muppim','Muppim','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('huppim','Huppim','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('ard-benjamin','Ard','Benjamin','Person / ancestor name','male',['benjamin'],[],'Genesis 46:21','Son / descendant listed under Benjamin.'),
R('hushim-dan','Hushim','Dan','Person / ancestor name','male',['dan'],[],'Genesis 46:23','Son / descendant listed under Dan. Later genealogy uses Shuham.','textual variant',['Shuham']),
R('jahzeel','Jahzeel','Naphtali','Person / ancestor name','male',['naphtali'],[],'Genesis 46:24','Son of Naphtali.','explicit',['Jahziel']),
R('guni','Guni','Naphtali','Person / ancestor name','male',['naphtali'],[],'Genesis 46:24','Son of Naphtali.'),
R('jezer','Jezer','Naphtali','Person / ancestor name','male',['naphtali'],[],'Genesis 46:24','Son of Naphtali.'),
R('shillem','Shillem','Naphtali','Person / ancestor name','male',['naphtali'],[],'Genesis 46:24','Son of Naphtali.','explicit',['Shillem','Shallum in 1 Chronicles 7:13'])
];
db.records.push(...rows);
db.scope='Genesis 1–50';
db.phase=2;
db.status='in development';
db.completedBooks=['Genesis'];
})();