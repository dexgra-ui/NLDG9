(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('perez',{ref:'Genesis 38:27–30; 46:12; Ruth 4:18','note':'Twin son of Judah and Tamar; Ruth begins the closing Davidic genealogy with Perez.'});
update('hezron-perez',{ref:'Genesis 46:12; Ruth 4:18–19','note':'Son of Perez; father of Ram in Ruth’s genealogy from Perez to David.'});
update('amminadab',{parents:['ram-ruth'],ref:'Exodus 6:23; Ruth 4:19–20','note':'Father of Elisheba and Nahshon; Ruth explicitly places Amminadab after Ram in the Perez-to-David genealogy.'});
update('nahshon',{parents:['amminadab'],ref:'Exodus 6:23; Numbers 1:7; 2:3; 7:12–17; 10:14; Ruth 4:20','note':'Son of Amminadab, brother of Elisheba, wilderness leader of Judah, and father of Salmon in Ruth’s closing genealogy.'});

const rows=[
R('elimelech','Elimelech','Ruth','Person','male',[],['naomi'],'Ruth 1:2–3; 2:1,3; 4:3,9','Ephrathite from Bethlehem in Judah; husband of Naomi and father of Mahlon and Chilion/Kilion.','explicit',['Elimelek']),
R('naomi','Naomi','Ruth','Person','female',[],['elimelech'],'Ruth 1–4','Wife of Elimelech and mother of Mahlon and Chilion/Kilion. After returning to Bethlehem she says to call her Mara, though the narrative continues to call her Naomi.','explicit',['Mara']),
R('mahlon','Mahlon','Ruth','Person','male',['elimelech','naomi'],['ruth'],'Ruth 1:2,5; 4:9–10','Son of Elimelech and Naomi. Ruth 4:10 explicitly identifies Ruth as the widow/wife of Mahlon.'),
R('chilion','Chilion / Kilion','Ruth','Person','male',['elimelech','naomi'],[],'Ruth 1:2,5; 4:9','Son of Elimelech and Naomi. Ruth 1 names two Moabite wives, Orpah and Ruth; because Ruth is later explicitly identified as Mahlon’s widow, Orpah is normally understood as Chilion’s wife, but the text never directly pairs their names in a single statement.','probable',['Chilion','Kilion'],[C('probable spouse','orpah','Ruth 1:4; 4:10','Inferred from the two marriages plus Ruth’s explicit identification as Mahlon’s widow.')]),
R('orpah','Orpah','Ruth','Person','female',[],[],'Ruth 1:4,6–15','Moabite daughter-in-law of Naomi. She is normally understood as Chilion/Kilion’s widow after Ruth is explicitly identified as Mahlon’s widow, but the pairing is not directly worded.','probable',[],[C('probable spouse','chilion','Ruth 1:4; 4:10','Inferred from the two marriages plus Ruth’s explicit identification as Mahlon’s widow.')]),
R('ruth','Ruth','Ruth / Davidic line','Person','female',[],['mahlon','boaz'],'Ruth 1–4','Moabite widow of Mahlon, daughter-in-law of Naomi, and later wife of Boaz; mother of Obed.','explicit',[],[C('mother-in-law','naomi','Ruth 1:6–18; 4:14–17')]),
R('ram-ruth','Ram','Judah / Davidic line','Person / ancestor name','male',['hezron-perez'],[],'Ruth 4:19','Son of Hezron and father of Amminadab in the genealogy from Perez to David.','explicit',['Ram (Davidic line)']),
R('salmon','Salmon','Judah / Davidic line','Person / ancestor name','male',['nahshon'],[],'Ruth 4:20–21','Son of Nahshon and father of Boaz in Ruth’s genealogy. Ruth does not name Boaz’s mother; Matthew later does.','explicit',['Salma in some Old Testament genealogical contexts']),
R('boaz','Boaz','Ruth / Davidic line','Person','male',['salmon'],['ruth'],'Ruth 2–4','Man of standing from the clan of Elimelech; son of Salmon in Ruth’s closing genealogy; guardian-redeemer who marries Ruth and fathers Obed. The exact genealogical degree of his kinship to Elimelech is not stated.','explicit',[],[C('kinsman / guardian-redeemer connection','elimelech','Ruth 2:1,20; 3:12; 4:1–10','Boaz belongs to Elimelech’s clan and acts as guardian-redeemer; the exact family degree is not stated.')]),
R('obed','Obed','Ruth / Davidic line','Person','male',['boaz','ruth'],[],'Ruth 4:13–17,21–22','Son of Boaz and Ruth; father of Jesse. Naomi becomes his caregiver/nurse, but she is not recorded as a biological parent.'),
R('jesse','Jesse','Davidic line','Person','male',['obed'],[],'Ruth 4:17,22','Son of Obed and father of David. Later books name additional children and family relationships.'),
R('david','David','Davidic line','Person','male',['jesse'],[],'Ruth 4:17,22','Son of Jesse. Ruth ends by carrying the Perez line through Obed and Jesse to David; later books expand David’s family extensively.')
];

db.records.push(...rows);
db.scope='Genesis–Ruth';
db.phase=4;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Ruth'])];
db.completedPhases=[...new Set([...(db.completedPhases||[]),4])];
})();