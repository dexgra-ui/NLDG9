(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('jesse',{ref:'Ruth 4:17,22; 1 Samuel 16:1–13; 17:12–58; 20:27–34; 22:1–4','note':'Son of Obed and father of David. First Samuel says Jesse had eight sons and names Eliab, Abinadab, Shammah, and David; the other four sons are not named there.'});
update('david',{parents:['jesse'],spouses:['michal','ahinoam-david','abigail-carmel'],ref:'Ruth 4:17,22; 1 Samuel 16–31','note':'Son of Jesse; anointed by Samuel and rises from shepherd to warrior and fugitive before becoming king. First Samuel names Michal, Ahinoam of Jezreel, and Abigail as wives.'});
update('michal',{spouses:['david','palti-laish'],ref:'1 Samuel 14:49; 18:20–29; 19:11–17; 25:44','note':'Daughter of Saul who loves and marries David. Saul later gives her to Palti son of Laish; 2 Samuel records her return to David.'});
update('ahitub-eli-line',{ref:'1 Samuel 14:3; 22:9,11–12,20','note':'Son of Phinehas, brother of Ichabod, and father of Ahimelech in the Nob priestly line.'});

const rows=[
R('eliab-jesse','Eliab','David family','Person','male',['jesse'],[],'1 Samuel 16:6–7; 17:13,28–30','Oldest named son of Jesse and older brother of David. Distinct from other biblical people named Eliab.','explicit',['Eliab son of Jesse'],[C('brother','david','1 Samuel 17:28')]),
R('abinadab-jesse','Abinadab','David family','Person','male',['jesse'],[],'1 Samuel 16:8; 17:13','Son of Jesse and older brother of David. Distinct from Saul’s son Abinadab and other people named Abinadab.','explicit',['Abinadab son of Jesse']),
R('shammah-jesse','Shammah / Shimeah','David family','Person','male',['jesse'],[],'1 Samuel 16:9; 17:13','Son of Jesse and older brother of David. Later Samuel text uses Shimeah/Shammah forms for David’s brother; the variant is preserved.','textual variant',['Shammah son of Jesse','Shimeah']),
R('goliath','Goliath','Philistines / David','Warrior','male',[],[],'1 Samuel 17:4–54; 21:9; 22:10','Philistine champion from Gath killed by David. Later texts discuss additional Gittite giants and a Goliath-related textual issue.'),
R('adriel','Adriel','Saul royal house','Person','male',['barzillai-meholathite'],['merab'],'1 Samuel 18:19; 2 Samuel 21:8','Meholathite son of Barzillai and husband of Merab daughter of Saul. A textual issue in 2 Samuel 21 affects the naming of the mother of five sons associated with Adriel.'),
R('barzillai-meholathite','Barzillai','Saul royal house','Person','male',[],[],'1 Samuel 18:19','Father of Adriel the Meholathite. Distinct from Barzillai the Gileadite in 2 Samuel.','explicit',['Barzillai the Meholathite']),
R('gad-prophet','Gad','David','Prophet','male',[],[],'1 Samuel 22:5; 2 Samuel 24:11–19','Prophet/seer who advises David during his fugitive years and later after David’s census. Distinct from Gad son of Jacob.'),
R('ahimelech-priest','Ahimelech','Eli priestly house','Priest','male',['ahitub-eli-line'],[],'1 Samuel 21:1–9; 22:9–23; 23:6','Son of Ahitub and priest at Nob who assists David and is killed by Doeg at Saul’s command. Father of Abiathar. Distinct from Ahimelech the Hittite.','explicit',['Ahimelech son of Ahitub']),
R('abiathar','Abiathar','Eli priestly house / David','Priest','male',['ahimelech-priest'],[],'1 Samuel 22:20–23; 23:6–13; 30:7; 2 Samuel 8:17; 15:24–36; 20:25','Son of Ahimelech who escapes the massacre at Nob and joins David; later serves as priest during David’s reign.'),
R('doeg','Doeg','Saul','Official','male',[],[],'1 Samuel 21:7; 22:9–19','Edomite chief of Saul’s shepherds/servants who reports Ahimelech and kills the priests of Nob.'),
R('nabal','Nabal','David / Carmel','Person','male',[],['abigail-carmel'],'1 Samuel 25:2–38','Wealthy man of Maon whose business is in Carmel; husband of Abigail. He dies after refusing provisions to David and his men.'),
R('abigail-carmel','Abigail','David','Person','female',[],['nabal','david'],'1 Samuel 25:3–42; 27:3; 30:5,18','Wife of Nabal and, after Nabal’s death, wife of David. Later mother of Chileab/Daniel by David in 2 Samuel/Chronicles. Distinct from Abigail connected with Zeruiah and Amasa.'),
R('ahinoam-david','Ahinoam','David','Person','female',[],['david'],'1 Samuel 25:43; 27:3; 30:5,18','Woman of Jezreel and wife of David; later mother of Amnon. Distinct from Ahinoam daughter of Ahimaaz, wife of Saul.','explicit',['Ahinoam of Jezreel']),
R('laish-palti','Laish','Saul royal house','Person','male',[],[],'1 Samuel 25:44; 2 Samuel 3:15','Father of Palti/Paltiel, to whom Saul gives Michal. Distinct from the city Laish.'),
R('palti-laish','Palti / Paltiel','Saul royal house','Person','male',['laish-palti'],['michal'],'1 Samuel 25:44; 2 Samuel 3:15–16','Son of Laish. First Samuel calls him Palti; 2 Samuel calls him Paltiel. Saul gives Michal to him after she had been David’s wife.','textual variant',['Palti','Paltiel']),
R('achish','Achish','Philistines / David','King / ruler','male',['maoch'],[],'1 Samuel 21:10–15; 27:2–12; 28:1–2; 29:2–11','King of Gath with whom David seeks refuge. First Samuel 27 identifies him as son of Maoch.'),
R('maoch','Maoch','Philistines','Person','male',[],[],'1 Samuel 27:2','Father of Achish king of Gath.','explicit',['Maok']),
R('zeruiah','Zeruiah','David family','Person','female',[],[],'1 Samuel 26:6; 2 Samuel 2–23','Mother of Joab, Abishai, and Asahel. First Samuel names Abishai son of Zeruiah and brother of Joab. Later texts expand her family connections.'),
R('joab','Joab','David family / military','Military commander','male',['zeruiah'],[],'1 Samuel 26:6; 2 Samuel 2–24','Son of Zeruiah and brother of Abishai and Asahel; later commander of David’s army.','explicit',[],[C('brother','abishai','1 Samuel 26:6'),C('brother','asahel','2 Samuel 2:18')]),
R('abishai','Abishai','David family / military','Military commander','male',['zeruiah'],[],'1 Samuel 26:6–12; 2 Samuel 2–23','Son of Zeruiah and brother of Joab; accompanies David into Saul’s camp and later becomes a major commander.','explicit',[],[C('brother','joab','1 Samuel 26:6'),C('brother','asahel','2 Samuel 2:18')]),
R('ahimelech-hittite','Ahimelech','David','Person','male',[],[],'1 Samuel 26:6','Hittite among David’s companions whom David asks about going down into Saul’s camp. Distinct from Ahimelech the priest.','explicit',['Ahimelech the Hittite']),
R('abinadab-saul','Abinadab','Saul royal house','Prince','male',['saul','ahinoam-saul'],[],'1 Samuel 31:2','Named as a son of Saul who dies with Jonathan and Malchi-shua at Mount Gilboa. First Samuel 14:49 instead names Ishvi among Saul’s sons; the text does not explicitly equate Ishvi and Abinadab.','unresolved identification',['Abinadab son of Saul'])
];

db.records.push(...rows);
db.scope='Genesis–1 Samuel';
db.phase=5;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'1 Samuel'])];
})();