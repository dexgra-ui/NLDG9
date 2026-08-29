(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('caleb-jephunneh',{ref:'Numbers 13–14; Deuteronomy 1:36; Joshua 14–15; Judges 1:12–15','note':'Son of Jephunneh; faithful spy and Judahite leader. Judges repeats the Achsah and Othniel account.'});
update('othniel',{ref:'Joshua 15:17; Judges 1:13; 3:9–11','note':'Son of Kenaz; kinsman of Caleb; husband of Achsah; first named deliverer/judge in Judges.'});
update('achsah',{ref:'Joshua 15:16–19; Judges 1:12–15','note':'Daughter of Caleb and wife of Othniel.'});
update('hobab',{ref:'Numbers 10:29–32; Judges 4:11','note':'Son of Reuel. Judges 4 connects the Kenite clan of Heber with Hobab, using a kinship description of Hobab to Moses that varies across translations.'});

const rows=[
R('adoni-bezek','Adoni-Bezek','Judges conquest','King / ruler designation','male',[],[],'Judges 1:5–7','Ruler encountered at Bezek. The designation may function as a title, “lord of Bezek,” rather than a personal birth name.'),
R('cushan-rishathaim','Cushan-Rishathaim','Judges','King / ruler','male',[],[],'Judges 3:8–10','King of Aram Naharaim / Mesopotamia under whom Israel serves before Othniel’s deliverance.'),
R('eglon-moab','Eglon','Judges','King / ruler','male',[],[],'Judges 3:12–30','King of Moab who oppresses Israel and is killed by Ehud. Distinct from the city Eglon and other uses of the name.','explicit',['Eglon king of Moab']),
R('gera-ehud','Gera','Benjamin / Ehud','Person','male',[],[],'Judges 3:15','Father of Ehud, a Benjaminite. Kept distinct from the much earlier Gera in Benjamin’s Genesis genealogy because Scripture does not identify them as the same individual.','unresolved identification',['Gera (father of Ehud)']),
R('ehud','Ehud','Benjamin / Judges','Judge / deliverer','male',['gera-ehud'],[],'Judges 3:15–30; 4:1','Son of Gera, a left-handed Benjaminite raised as deliverer from Moab.'),
R('shamgar','Shamgar','Judges','Judge / deliverer','male',[],[],'Judges 3:31; 5:6','Called “son of Anath” and credited with striking six hundred Philistines with an oxgoad. Because “Anath” may function as a personal name, deity-related designation, or military epithet, no human parent record is forced.','unresolved identification',['Shamgar son of Anath']),
R('jabin-hazor-judges','Jabin','Judges / Canaan','King / ruler','male',[],[],'Judges 4:2,7,17,23–24','Canaanite king reigning at Hazor during Deborah and Barak’s time. Kept distinct from Jabin king of Hazor in Joshua 11.','unresolved identification',['Jabin (Judges 4)']),
R('sisera','Sisera','Judges / Canaan','Military commander','male',[],[],'Judges 4–5','Commander of Jabin’s army, defeated by Barak’s forces and killed by Jael.'),
R('lappidoth','Lappidoth','Deborah','Person','male',[],['deborah-judge'],'Judges 4:4','Traditionally understood as Deborah’s husband. The Hebrew phrase can be discussed differently by interpreters, so the marital identification is noted without adding further family claims.','probable',['Lapidoth']),
R('deborah-judge','Deborah','Judges','Judge / prophet','female',[],['lappidoth'],'Judges 4–5','Prophet and judge who summons Barak. Traditionally described as wife of Lappidoth. Distinct from Deborah, Rebekah’s nurse in Genesis 35.','probable',['Deborah (judge)']),
R('abinoam','Abinoam','Judges / Barak','Person','male',[],[],'Judges 4:6,12; 5:1,12','Father of Barak.'),
R('barak','Barak','Judges','Military leader','male',['abinoam'],[],'Judges 4–5','Son of Abinoam from Kedesh in Naphtali; military leader summoned by Deborah.'),
R('heber-kenite','Heber','Kenites','Person','male',[],['jael'],'Judges 4:11,17,21; 5:24','Kenite who separates from the other Kenites; husband of Jael. Judges connects his Kenite line with Hobab, Moses’ relative by marriage.','explicit',['Heber the Kenite'],[C('clan/descendant connection','hobab','Judges 4:11','The text connects Heber’s Kenite line with Hobab; it does not state Hobab as Heber’s immediate father.')]),
R('jael','Jael','Kenites / Judges','Person','female',[],['heber-kenite'],'Judges 4:17–22; 5:6,24–27','Wife of Heber the Kenite who kills Sisera.'),
R('joash-abiezrite','Joash','Gideon','Person','male',[],[],'Judges 6:11,29–32; 8:13,29,32','Abiezrite father of Gideon/Jerub-Baal. Distinct from later biblical people named Joash.','explicit',['Joash the Abiezrite']),
R('gideon','Gideon / Jerub-Baal','Judges / Gideon','Judge / deliverer','male',['joash-abiezrite'],[],'Judges 6–9','Son of Joash the Abiezrite; judge and deliverer against Midian. He receives the name Jerub-Baal after tearing down Baal’s altar. Scripture says he had seventy sons by many wives and an additional son, Abimelech, by a concubine in Shechem.','explicit',['Gideon','Jerub-Baal','Jerubbaal']),
R('purah','Purah','Gideon','Person','male',[],[],'Judges 7:10–11','Servant of Gideon who accompanies him to the edge of the Midianite camp.','explicit',[],[C('servant of','gideon','Judges 7:10–11')]),
R('oreb','Oreb','Midian','Military leader','male',[],[],'Judges 7:25; 8:3','One of two named Midianite leaders captured and killed by the Ephraimites.'),
R('zeeb','Zeeb','Midian','Military leader','male',[],[],'Judges 7:25; 8:3','One of two named Midianite leaders captured and killed by the Ephraimites.'),
R('zebah','Zebah','Midian','King / ruler','male',[],[],'Judges 8:5–21','One of two named kings of Midian pursued and killed by Gideon.'),
R('zalmunna','Zalmunna','Midian','King / ruler','male',[],[],'Judges 8:5–21','One of two named kings of Midian pursued and killed by Gideon.'),
R('jether-gideon','Jether','Gideon','Person','male',['gideon'],[],'Judges 8:20','Firstborn son of Gideon, still a youth when Gideon orders him to kill Zebah and Zalmunna.','explicit',['Jether son of Gideon'])
];

db.records.push(...rows);
db.scope='Genesis–Judges 8';
db.phase=4;
})();