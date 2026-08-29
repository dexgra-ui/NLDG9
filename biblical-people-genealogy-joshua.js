(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('joshua',{ref:'Exodus 17:9–14; 24:13; 32:17; 33:11; Numbers 11:28; 13:8,16; 14:6,30,38; Deuteronomy 1:38; 3:21,28; 31; 34:9; Joshua 1–24',note:'Son of Nun, formerly called Hoshea, assistant and successor of Moses; leads Israel in Joshua.'});
update('nun',{ref:'Exodus 33:11; Numbers 11:28; 13:8,16; Joshua 1:1; 24:29','note':'Father of Joshua.'});
update('caleb-jephunneh',{ref:'Numbers 13:6,30; 14:6,24,30,38; Deuteronomy 1:36; Joshua 14:6–15; 15:13–19','note':'Son of Jephunneh; faithful spy from Judah. Joshua records his inheritance and names his daughter Achsah.'});
update('anak',{ref:'Numbers 13:22,28,33; Joshua 15:13–14','note':'Ancestor-name associated with the Anakim. Joshua 15:13 calls Arba the father/forefather of Anak.'});
update('ahiman-anak',{ref:'Numbers 13:22; Joshua 15:14','note':'Named descendant/son of Anak driven from Hebron by Caleb.'});
update('sheshai',{ref:'Numbers 13:22; Joshua 15:14','note':'Named descendant/son of Anak driven from Hebron by Caleb.'});
update('talmai-anak',{ref:'Numbers 13:22; Joshua 15:14','note':'Named descendant/son of Anak driven from Hebron by Caleb.'});
update('zelophehad',{ref:'Numbers 26:33; 27:1–11; 36; Joshua 17:3–6','note':'Son of Hepher in Manasseh’s line; his five daughters receive inheritance in Joshua according to the command given through Moses.'});
['mahlah-zelophehad','noah-zelophehad','hoglah','milcah-zelophehad','tirzah-zelophehad'].forEach(id=>update(id,{ref:`${db.records.find(r=>r.id===id)?.ref||''}; Joshua 17:3–6`}));
update('eleazar-aaron',{ref:'Exodus 6:23,25; Leviticus 10; Numbers 3–34; Deuteronomy 10:6; Joshua 14:1; 17:4; 19:51; 21:1; 22:13,31–32; 24:33',note:'Son and successor of Aaron in the priesthood; participates with Joshua in land distribution. Joshua 24 records his death and burial.'});
update('phinehas',{ref:'Exodus 6:25; Numbers 25:7–13; Joshua 22:13–32; 24:33','note':'Son of Eleazar and grandson of Aaron; leads the delegation to the eastern tribes in Joshua 22.'});

const rows=[
R('rahab','Rahab','Joshua / Jericho','Person','female',[],[],'Joshua 2:1–21; 6:17,22–25','Woman of Jericho who shelters the Israelite spies and is preserved with her family. Joshua does not state her parents, husband, or children. Later New Testament texts name Rahab separately in the genealogy and faith tradition.'),
R('zabdi-zimri-achan','Zabdi / Zimri','Judah / Achan','Person / ancestor name','male',['zerah-judah'],[],'Joshua 7:1,17–18','Grandfather of Achan in Judah’s Zerahite line. The Hebrew text reads Zabdi; the Septuagint and a cross-tradition reflected in some translations read Zimri.','textual variant',['Zabdi','Zimri']),
R('carmi-achan','Carmi','Judah / Achan','Person','male',['zabdi-zimri-achan'],[],'Joshua 7:1,18','Father of Achan; distinct from Carmi son of Reuben in Genesis 46.','explicit',['Carmi (father of Achan)']),
R('achan','Achan','Judah / Achan','Person','male',['carmi-achan'],[],'Joshua 7:1,16–26; 22:20','Son of Carmi, grandson of Zabdi/Zimri, descendant of Zerah of Judah; takes devoted things from Jericho.','explicit',['Achar in 1 Chronicles 2:7']),
R('adoni-zedek','Adoni-Zedek','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:1–27','King of Jerusalem who leads a coalition against Gibeon.'),
R('hoham','Hoham','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:3,16–27','King of Hebron in the five-king coalition.'),
R('piram','Piram','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:3,16–27','King of Jarmuth in the five-king coalition.'),
R('japhia-lachish','Japhia','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:3,16–27','King of Lachish in the five-king coalition. Distinct from later people named Japhia.','explicit',['Japhia king of Lachish']),
R('debir-eglon','Debir','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:3,16–27','King of Eglon in the five-king coalition. Distinct from the city Debir and later people named Debir.','explicit',['Debir king of Eglon']),
R('horam-gezer','Horam','Joshua conquest kings','King / ruler','male',[],[],'Joshua 10:33','King of Gezer who comes to help Lachish and is defeated by Joshua.'),
R('jabin-hazor-joshua','Jabin','Joshua conquest kings','King / ruler','male',[],[],'Joshua 11:1–14','King of Hazor who organizes the northern coalition. Kept distinct from the later Jabin of Judges 4 because Scripture does not identify them as the same individual.','unresolved identification',['Jabin (Joshua 11)']),
R('jobab-madon','Jobab','Joshua conquest kings','King / ruler','male',[],[],'Joshua 11:1','King of Madon summoned by Jabin of Hazor; distinct from Jobab son of Joktan and Jobab king of Edom.','explicit',['Jobab king of Madon']),
R('arba','Arba','Anakim','Person / ancestor name','male',[],[],'Joshua 14:15; 15:13','Named ancestor associated with Anak and Kiriath Arba/Hebron; Joshua 15:13 calls him the father/forefather of Anak.','explicit',[],[C('son / descendant','anak','Joshua 15:13','Translation traditions render the relationship as father or forefather of Anak.')]),
R('kenaz-othniel','Kenaz','Judah / Caleb','Person','male',[],[],'Joshua 15:17; Judges 1:13; 3:9,11','Father of Othniel. The phrase linking Kenaz/Othniel with Caleb is rendered differently across translations; the database does not force a more specific generation than Scripture clearly supports.','unresolved identification',['Kenaz (father of Othniel)']),
R('othniel','Othniel','Judah / Caleb','Person',['male'][0],['kenaz-othniel'],['achsah'],'Joshua 15:17; Judges 1:13; 3:9–11','Son of Kenaz; captures Kiriath Sepher/Debir and receives Achsah as wife. Later becomes a judge/deliverer. The kinship phrase involving Caleb is translation-sensitive.','unresolved identification',[],[C('kinsman of','caleb-jephunneh','Joshua 15:17; Judges 3:9','Often rendered “Caleb’s younger brother,” but some translations understand Kenaz as Caleb’s younger brother.')]),
R('achsah','Achsah','Judah / Caleb','Person','female',['caleb-jephunneh'],['othniel'],'Joshua 15:16–19; Judges 1:12–15','Daughter of Caleb and wife of Othniel.','explicit',['Aksah'])
];

db.records.push(...rows);
db.scope='Genesis–Joshua';
db.phase=4;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Joshua'])];
})();