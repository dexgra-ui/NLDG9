(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('gideon',{ref:'Judges 6–9; 1 Samuel 12:11',note:'Gideon/Jerub-Baal is recalled in Samuel’s summary of Israel’s deliverers.'});
update('jephthah',{ref:'Judges 11:1–12:7; 1 Samuel 12:11',note:'Jephthah is recalled in Samuel’s summary of Israel’s deliverers.'});

const rows=[
R('zuph-samuel','Zuph','Samuel','Person / ancestor name','male',[],[],'1 Samuel 1:1','Ancestor of Samuel through Tohu, Elihu, Jeroham, and Elkanah. Distinct from the district called Zuph.','explicit',['Zuph (ancestor of Samuel)']),
R('tohu','Tohu','Samuel','Person / ancestor name','male',['zuph-samuel'],[],'1 Samuel 1:1','Son of Zuph and father of Elihu in Samuel’s ancestry.','explicit',['Tohu','Tohu (Samuel line)']),
R('elihu-samuel-line','Elihu','Samuel','Person / ancestor name','male',['tohu'],[],'1 Samuel 1:1','Son of Tohu and father of Jeroham in Samuel’s ancestry. Distinct from later people named Elihu.','explicit',['Elihu (Samuel line)']),
R('jeroham-elkanah','Jeroham','Samuel','Person','male',['elihu-samuel-line'],[],'1 Samuel 1:1','Son of Elihu and father of Elkanah. Distinct from later people named Jeroham.','explicit',['Jeroham (father of Elkanah)']),
R('elkanah-samuel','Elkanah','Samuel','Person','male',['jeroham-elkanah'],['hannah','peninnah'],'1 Samuel 1:1–8,19–23; 2:11,20','Son of Jeroham; husband of Hannah and Peninnah; father of Samuel by Hannah. Hannah later bears additional sons and daughters whose names are not given. Distinct from other biblical people named Elkanah.','explicit',['Elkanah (father of Samuel)']),
R('hannah','Hannah','Samuel','Person','female',[],['elkanah-samuel'],'1 Samuel 1–2','Wife of Elkanah and mother of Samuel. First Samuel 2:21 says she later bears three sons and two daughters, but does not name them.'),
R('peninnah','Peninnah','Samuel','Person','female',[],['elkanah-samuel'],'1 Samuel 1:2–7','Wife of Elkanah and mother of sons and daughters whose names are not given.'),
R('samuel','Samuel','Samuel','Prophet / judge','male',['elkanah-samuel','hannah'],[],'1 Samuel 1–28','Son of Elkanah and Hannah; prophet, judge, and priestly servant who anoints Saul and David. Father of Joel and Abijah.'),
R('eli','Eli','Eli priestly house','Priest / judge','male',[],[],'1 Samuel 1–4; 14:3','Priest and judge at Shiloh; father of Hophni and Phinehas. His ancestry is not stated in 1 Samuel.'),
R('hophni','Hophni','Eli priestly house','Priest','male',['eli'],[],'1 Samuel 1:3; 2:12–36; 4:4,11,17','Son of Eli and brother of Phinehas; priest at Shiloh who dies in battle when the ark is captured.'),
R('phinehas-eli','Phinehas','Eli priestly house','Priest','male',['eli'],[],'1 Samuel 1:3; 2:12–36; 4:4,11,17–22; 14:3','Son of Eli and brother of Hophni; father of Ichabod and Ahitub. Distinct from Phinehas son of Eleazar in the Aaronic line.','explicit',['Phinehas son of Eli']),
R('ichabod','Ichabod','Eli priestly house','Person','male',['phinehas-eli'],[],'1 Samuel 4:19–22; 14:3','Son of Phinehas and his unnamed wife; brother of Ahitub. His mother dies after naming him Ichabod.','explicit',['Ichabod','Ichabod son of Phinehas']),
R('ahitub-eli-line','Ahitub','Eli priestly house','Priest / ancestor name','male',['phinehas-eli'],[],'1 Samuel 14:3; 22:9,11–12,20','Son of Phinehas and brother of Ichabod. First Samuel later identifies Ahimelech as son of Ahitub.','explicit',['Ahitub (Eli line)'],[C('brother','ichabod','1 Samuel 14:3')]),
R('ahijah-ahitub','Ahijah','Eli priestly house','Priest','male',['ahitub-eli-line'],[],'1 Samuel 14:3,18','Son of Ahitub, grandson of Phinehas, great-grandson of Eli; priest serving with Saul. Distinct from the later prophet Ahijah the Shilonite.','explicit',['Ahijah son of Ahitub']),
R('joel-samuel','Joel','Samuel','Judge','male',['samuel'],[],'1 Samuel 8:2','Firstborn son of Samuel; judge in Beersheba with his brother Abijah. Distinct from later people named Joel.','explicit',['Joel son of Samuel']),
R('abijah-samuel','Abijah','Samuel','Judge','male',['samuel'],[],'1 Samuel 8:2','Son of Samuel; judge in Beersheba with his brother Joel. Distinct from later people named Abijah.','explicit',['Abijah son of Samuel']),

R('aphiah','Aphiah','Saul','Person / ancestor name','male',[],[],'1 Samuel 9:1','Benjaminite ancestor of Saul through Becorath, Zeror, Abiel, and Kish.'),
R('becorath','Becorath','Saul','Person / ancestor name','male',['aphiah'],[],'1 Samuel 9:1','Son of Aphiah and ancestor of Saul.','explicit',['Bekorath']),
R('zeror','Zeror','Saul','Person / ancestor name','male',['becorath'],[],'1 Samuel 9:1','Son of Becorath and father of Abiel in Saul’s ancestry.'),
R('abiel-saul','Abiel','Saul','Person / ancestor name','male',['zeror'],[],'1 Samuel 9:1; 14:51','Son of Zeror; father of Kish and Ner, making him grandfather of Saul and Abner.','explicit',['Abiel (Saul line)']),
R('kish-saul','Kish','Saul','Person','male',['abiel-saul'],[],'1 Samuel 9:1–3; 10:11,21; 14:51','Son of Abiel, brother of Ner, and father of Saul.','explicit',['Kish father of Saul'],[C('brother','ner-saul','1 Samuel 14:51')]),
R('ner-saul','Ner','Saul','Person','male',['abiel-saul'],[],'1 Samuel 14:50–51','Son of Abiel, brother of Kish, and father of Abner.','explicit',['Ner father of Abner'],[C('brother','kish-saul','1 Samuel 14:51')]),
R('saul','Saul','Saul royal house','King / ruler','male',['kish-saul'],['ahinoam-saul'],'1 Samuel 9–31','Son of Kish; first king of Israel. First Samuel names sons Jonathan, Ishvi, and Malchi-shua in 14:49 and Jonathan, Abinadab, and Malchi-shua in 31:2; daughters Merab and Michal are also named.'),
R('abner','Abner','Saul royal house','Military commander','male',['ner-saul'],[],'1 Samuel 14:50–51; 17:55–58; 20:25; 26:5–15','Son of Ner, cousin of Saul, and commander of Saul’s army.','explicit',['Abner son of Ner'],[C('cousin','saul','1 Samuel 14:50–51','Their fathers Ner and Kish are brothers, both sons of Abiel.')]),
R('ahimaaz-saul-inlaw','Ahimaaz','Saul royal house','Person','male',[],[],'1 Samuel 14:50','Father of Ahinoam, wife of Saul. Distinct from Ahimaaz son of Zadok in David’s time.','explicit',['Ahimaaz (father of Saul’s wife)']),
R('ahinoam-saul','Ahinoam','Saul royal house','Person','female',['ahimaaz-saul-inlaw'],['saul'],'1 Samuel 14:50','Daughter of Ahimaaz and wife of Saul. Distinct from Ahinoam of Jezreel, wife of David.','explicit',['Ahinoam wife of Saul']),
R('jonathan-saul','Jonathan','Saul royal house','Prince / military leader','male',['saul','ahinoam-saul'],[],'1 Samuel 13–31','Son of Saul and close covenant friend of David; father of a son later named Mephibosheth in 2 Samuel.'),
R('ishvi-saul','Ishvi','Saul royal house','Prince','male',['saul','ahinoam-saul'],[],'1 Samuel 14:49','Named as a son of Saul in 1 Samuel 14. First Samuel 31 instead names Abinadab among the sons who die with Saul; Scripture does not explicitly state that Ishvi and Abinadab are the same person.','unresolved identification',['Ishvi son of Saul']),
R('malchishua','Malchi-shua','Saul royal house','Prince','male',['saul','ahinoam-saul'],[],'1 Samuel 14:49; 31:2','Son of Saul who dies with Saul on Mount Gilboa.','explicit',['Malchishua','Malchi-shua']),
R('merab','Merab','Saul royal house','Person','female',['saul','ahinoam-saul'],[],'1 Samuel 14:49; 18:17–19','Older daughter of Saul. Saul promises her to David but gives her to Adriel the Meholathite.'),
R('michal','Michal','Saul royal house / David','Person','female',['saul','ahinoam-saul'],[],'1 Samuel 14:49; 18:20–29; 19:11–17; 25:44','Daughter of Saul who loves and marries David. Saul later gives her to Palti/ Paltiel son of Laish; 2 Samuel records her return to David.'),
R('nahash-ammonite','Nahash','Ammon','King / ruler','male',[],[],'1 Samuel 11:1–11; 12:12','King of the Ammonites who besieges Jabesh-gilead. A Nahash appears again in David’s era; identity across passages is not assumed without explicit connection.','unresolved identification',['Nahash (1 Samuel 11)']),
R('bedan','Bedan / Barak reading','Samuel’s historical summary','Deliverer name','male',[],[],'1 Samuel 12:11','Named among Israel’s deliverers in the Masoretic text as Bedan; ancient versions and some translations read Barak. The textual uncertainty is preserved.','textual variant',['Bedan','Barak']),
R('agag-1samuel','Agag','Amalek','King / ruler','male',[],[],'1 Samuel 15:8–33','King of the Amalekites spared by Saul and executed by Samuel. Kept distinct from the Agag named in Balaam’s oracle in Numbers 24.','unresolved identification',['Agag (1 Samuel 15)'])
];

db.records.push(...rows);
db.scope='Genesis–1 Samuel 15';
db.phase=5;
})();