(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('gideon',{ref:'Judges 6–9','note':'Son of Joash the Abiezrite; also called Jerub-Baal. Scripture says he had seventy sons by many wives; Jether and Jotham are named among them, while Abimelech is separately named as his son by a concubine in Shechem.'});
update('hamor',{ref:'Genesis 33:19; 34; Judges 9:28','note':'Hivite father of Shechem. Judges 9 invokes Hamor and Shechem as ancestral identity markers for the citizens of Shechem.'});
update('shechem-hamor',{ref:'Genesis 33:19; 34; Judges 9:28','note':'Son of Hamor the Hivite. Judges 9 refers to the line/men of Hamor and Shechem.'});
update('sihon',{ref:'Numbers 21:21–35; Deuteronomy 1–31; Judges 11:19–22','note':'Amorite king defeated by Israel; Jephthah recounts the victory in Judges 11.'});
update('balak',{ref:'Numbers 22–24; Judges 11:25','note':'Son of Zippor and king of Moab; named in Jephthah’s historical argument.'});
update('gershom-moses',{ref:'Exodus 2:22; 18:3; Judges 18:30','note':'Son of Moses and Zipporah. Judges 18:30 names Jonathan as son of Gershom; the following generation is textually associated with Moses in many manuscripts and Manasseh in others.'});
update('phinehas',{ref:'Exodus 6:25; Numbers 25:7–13; Joshua 22:13–32; 24:33; Judges 20:28','note':'Son of Eleazar and grandson of Aaron; Judges 20 places him ministering before the ark during the Benjamin conflict.'});

const rows=[
R('abimelech-gideon','Abimelech','Gideon / Judges','King / ruler','male',['gideon'],[],'Judges 8:31; 9:1–57','Son of Gideon/Jerub-Baal by his unnamed concubine in Shechem. He kills his brothers except Jotham and is made king at Shechem. Distinct from the Abimelechs in Genesis.','explicit',['Abimelech son of Gideon','Abimelek son of Jerub-Baal']),
R('jotham-gideon','Jotham','Gideon / Judges','Person','male',['gideon'],[],'Judges 9:5,7–21,57','Youngest named son of Gideon/Jerub-Baal; escapes Abimelech’s massacre and delivers the parable from Mount Gerizim.','explicit',['Jotham son of Gideon']),
R('ebed-gaal','Ebed','Judges / Shechem','Person','male',[],[],'Judges 9:26,28,30–35','Father of Gaal.'),
R('gaal','Gaal','Judges / Shechem','Person','male',['ebed-gaal'],[],'Judges 9:26–41','Son of Ebed who challenges Abimelech’s rule at Shechem.'),
R('zebul','Zebul','Judges / Shechem','Governor / official','male',[],[],'Judges 9:28–41','Governor/official of Shechem who remains aligned with Abimelech and opposes Gaal.'),
R('puah-tola','Puah','Issachar / Judges','Person','male',['dodo-tola'],[],'Judges 10:1','Father of Tola and son of Dodo. Kept distinct from the much earlier Puvah/Puah son of Issachar unless Scripture explicitly identifies the generations.','unresolved identification',['Puah (father of Tola)']),
R('dodo-tola','Dodo','Issachar / Judges','Person','male',[],[],'Judges 10:1','Grandfather of Tola through Puah. Distinct from later people named Dodo.','explicit',['Dodo (grandfather of Tola)']),
R('tola-judge','Tola','Judges','Judge / deliverer','male',['puah-tola'],[],'Judges 10:1–2','Man of Issachar, son of Puah and grandson of Dodo, who judges Israel twenty-three years. Distinct from Tola son of Issachar in Genesis 46.','unresolved identification',['Tola the judge']),
R('jair-judge','Jair','Judges','Judge / deliverer','male',[],[],'Judges 10:3–5','Gileadite judge who has thirty sons and judges Israel twenty-two years. Kept distinct from Jair son/descendant of Manasseh in Numbers and Deuteronomy.','unresolved identification',['Jair the judge']),
R('gilead-jephthah','Gilead','Jephthah','Person','male',[],[],'Judges 11:1–2','Named as Jephthah’s father. Kept distinct from the earlier ancestral Gilead son of Machir unless Scripture explicitly connects the individuals.','unresolved identification',['Gilead (father of Jephthah)']),
R('jephthah','Jephthah','Judges','Judge / deliverer','male',['gilead-jephthah'],[],'Judges 11:1–12:7','Gileadite warrior and judge; son of a man named Gilead and an unnamed prostitute. His half-brothers by Gilead’s wife are not named.','explicit',['Jephthah the Gileadite']),
R('ibzan','Ibzan','Judges','Judge / deliverer','male',[],[],'Judges 12:8–10','Judge from Bethlehem who has thirty sons and thirty daughters; none of the children are individually named.'),
R('elon-judge','Elon','Judges','Judge / deliverer','male',[],[],'Judges 12:11–12','Zebulunite judge who leads Israel ten years. Distinct from Elon son of Zebulun and Elon the Hittite.','unresolved identification',['Elon the judge']),
R('hillel-abdon','Hillel','Judges','Person','male',[],[],'Judges 12:13,15','Father of Abdon the judge; distinct from later people named Hillel.','explicit',['Hillel (father of Abdon)']),
R('abdon-judge','Abdon','Judges','Judge / deliverer','male',['hillel-abdon'],[],'Judges 12:13–15','Son of Hillel from Pirathon; judge who has forty sons and thirty grandsons, none individually named.','explicit',['Abdon son of Hillel']),
R('manoah','Manoah','Samson','Person','male',[],[],'Judges 13:2–23; 14:2–10; 16:31','Danite from Zorah; husband of Samson’s unnamed mother and father of Samson.'),
R('samson','Samson','Judges / Samson','Judge / deliverer','male',['manoah'],[],'Judges 13–16','Son of Manoah and an unnamed Danite woman; Nazirite from birth and judge/deliverer against the Philistines. Scripture does not name his mother, Timnite wife, or the woman in Gaza.'),
R('delilah','Delilah','Samson','Person','female',[],[],'Judges 16:4–22','Woman in the Valley of Sorek whom Samson loves. Scripture does not call her Samson’s wife.','explicit',[],[C('loved by','samson','Judges 16:4','The text states Samson loved Delilah; it does not state a marriage.')]),
R('micah-judges','Micah','Judges / Danite shrine','Person','male',[],[],'Judges 17–18','Ephraimite whose household shrine and hired Levite priest become connected with the Danite migration. His mother and son are mentioned but not named.','explicit',['Micah (Judges 17–18)']),
R('jonathan-gershom','Jonathan','Levi / Danite priests','Person','male',['gershom-moses'],[],'Judges 18:30','Son of Gershom who, with his sons, serves as priest for the tribe of Dan. Many manuscripts identify Gershom’s father as Moses; other manuscripts read Manasseh, so the grandparent identification is kept visibly textual.','textual variant',['Jonathan son of Gershom'],[C('grandfather textual reading','moses','Judges 18:30','Many Hebrew manuscripts and ancient witnesses read Moses; other Hebrew manuscripts read Manasseh.')])
];

db.records.push(...rows);
db.scope='Genesis–Judges';
db.phase=4;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Judges'])];
})();