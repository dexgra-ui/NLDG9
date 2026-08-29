(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('joshua',{ref:'Exodus 17:9–14; 24:13; 32:17; 33:11; Numbers 11:28; 13:8,16; 14:6,30,38',note:'Son of Nun and assistant of Moses. Numbers 13:16 explicitly says Moses called Hoshea son of Nun Joshua.',aliases:['Joshua','Hoshea']});
update('nun',{ref:'Exodus 33:11; Numbers 11:28; 13:8,16','note':'Father of Joshua, who was called Hoshea before Moses named him Joshua.'});
update('korah-izhar',{ref:'Exodus 6:21,24; Numbers 16; 26:9–11','note':'Son of Izhar, grandson of Kohath, great-grandson of Levi; leader in the wilderness rebellion. Numbers 26:11 explicitly says the sons of Korah did not die.'});
update('phinehas',{ref:'Exodus 6:25; Numbers 25:7–13','note':'Son of Eleazar and grandson of Aaron; his action at Peor is followed by a covenant of peace and perpetual priesthood for his descendants.'});

const rows=[
R('zaccur-shammua','Zaccur','Numbers spies','Person','male',[],[],'Numbers 13:4','Father of Shammua of Reuben.'),
R('shammua-spy','Shammua','Numbers spies','Leader / spy','male',['zaccur-shammua'],[],'Numbers 13:4','Son of Zaccur; representative from Reuben sent to spy out Canaan. Distinct from later people named Shammua.','explicit',['Shammua son of Zaccur']),
R('hori-shaphat','Hori','Numbers spies','Person','male',[],[],'Numbers 13:5','Father of Shaphat of Simeon. Distinct from Hori son of Lotan in Genesis 36.','explicit',['Hori (father of Shaphat)']),
R('shaphat-spy','Shaphat','Numbers spies','Leader / spy','male',['hori-shaphat'],[],'Numbers 13:5','Son of Hori; representative from Simeon sent to spy out Canaan.','explicit',['Shaphat son of Hori']),
R('jephunneh-caleb','Jephunneh','Caleb','Person','male',[],[],'Numbers 13:6; 14:6,30,38','Father of Caleb the Judahite spy.','explicit',['Jephunneh (father of Caleb)']),
R('caleb-jephunneh','Caleb','Caleb','Leader / spy','male',['jephunneh-caleb'],[],'Numbers 13:6,30; 14:6,24,30,38','Son of Jephunneh; representative from Judah who, with Joshua, gives a faithful report.','explicit',['Caleb son of Jephunneh']),
R('joseph-igal-father','Joseph','Numbers spies','Person','male',[],[],'Numbers 13:7','Father of Igal of Issachar. Because this is a wilderness-generation father, the database does not identify him with Joseph son of Jacob.','unresolved identification',['Joseph (father of Igal)']),
R('igal','Igal','Numbers spies','Leader / spy','male',['joseph-igal-father'],[],'Numbers 13:7','Son of Joseph; representative from Issachar sent to spy out Canaan.'),
R('raphu','Raphu','Numbers spies','Person','male',[],[],'Numbers 13:9','Father of Palti of Benjamin.'),
R('palti-raphu','Palti','Numbers spies','Leader / spy','male',['raphu'],[],'Numbers 13:9','Son of Raphu; representative from Benjamin sent to spy out Canaan. Distinct from later people with similar names.','explicit',['Palti son of Raphu']),
R('sodi','Sodi','Numbers spies','Person','male',[],[],'Numbers 13:10','Father of Gaddiel of Zebulun.'),
R('gaddiel','Gaddiel','Numbers spies','Leader / spy','male',['sodi'],[],'Numbers 13:10','Son of Sodi; representative from Zebulun sent to spy out Canaan.'),
R('susi','Susi','Numbers spies','Person','male',[],[],'Numbers 13:11','Father of Gaddi of Manasseh.'),
R('gaddi','Gaddi','Numbers spies','Leader / spy','male',['susi'],[],'Numbers 13:11','Son of Susi; representative from Manasseh sent to spy out Canaan.'),
R('gemalli','Gemalli','Numbers spies','Person','male',[],[],'Numbers 13:12','Father of Ammiel of Dan.'),
R('ammiel-gemalli','Ammiel','Numbers spies','Leader / spy','male',['gemalli'],[],'Numbers 13:12','Son of Gemalli; representative from Dan sent to spy out Canaan. Distinct from later people named Ammiel.','explicit',['Ammiel son of Gemalli']),
R('michael-sethur-father','Michael','Numbers spies','Person','male',[],[],'Numbers 13:13','Father of Sethur of Asher. Distinct from later people named Michael.','explicit',['Michael (father of Sethur)']),
R('sethur','Sethur','Numbers spies','Leader / spy','male',['michael-sethur-father'],[],'Numbers 13:13','Son of Michael; representative from Asher sent to spy out Canaan.'),
R('vophsi','Vophsi','Numbers spies','Person','male',[],[],'Numbers 13:14','Father of Nahbi of Naphtali.'),
R('nahbi','Nahbi','Numbers spies','Leader / spy','male',['vophsi'],[],'Numbers 13:14','Son of Vophsi; representative from Naphtali sent to spy out Canaan.'),
R('machi','Machi','Numbers spies','Person','male',[],[],'Numbers 13:15','Father of Geuel of Gad.'),
R('geuel','Geuel','Numbers spies','Leader / spy','male',['machi'],[],'Numbers 13:15','Son of Machi; representative from Gad sent to spy out Canaan.'),
R('anak','Anak','Anakim','Person / ancestor name','male',[],[],'Numbers 13:22,28,33','Ancestor-name associated with the Anakim. Ahiman, Sheshai, and Talmai are described as descendants of Anak; the text does not require that they be his immediate sons.'),
R('ahiman-anak','Ahiman','Anakim','Person','male',[],[],'Numbers 13:22','One of three named descendants of Anak seen at Hebron.','explicit',['Ahiman (descendant of Anak)'],[C('descendant of','anak','Numbers 13:22')]),
R('sheshai','Sheshai','Anakim','Person','male',[],[],'Numbers 13:22','One of three named descendants of Anak seen at Hebron.','explicit',[],[C('descendant of','anak','Numbers 13:22')]),
R('talmai-anak','Talmai','Anakim','Person','male',[],[],'Numbers 13:22','One of three named descendants of Anak seen at Hebron. Distinct from later people named Talmai.','explicit',['Talmai (descendant of Anak)'],[C('descendant of','anak','Numbers 13:22')]),

R('eliab-reuben','Eliab','Reuben / Korah rebellion','Person','male',[],[],'Numbers 16:1,12; 26:8–9','Reubenite father of Dathan and Abiram; Numbers 26 also identifies him as a son of Pallu. Distinct from Eliab son of Helon.','explicit',['Eliab the Reubenite']),
R('dathan','Dathan','Reuben / Korah rebellion','Person','male',['eliab-reuben'],[],'Numbers 16; 26:9–10','Son of Eliab and brother of Abiram; participates in the rebellion associated with Korah.','explicit',[],[C('brother','abiram','Numbers 16:1')]),
R('abiram-eliab','Abiram','Reuben / Korah rebellion','Person','male',['eliab-reuben'],[],'Numbers 16; 26:9–10','Son of Eliab and brother of Dathan; participates in the rebellion associated with Korah.','explicit',['Abiram son of Eliab'],[C('brother','dathan','Numbers 16:1')]),
R('peleth','Peleth','Reuben / Korah rebellion','Person','male',[],[],'Numbers 16:1','Father of On.'),
R('on-peleth','On','Reuben / Korah rebellion','Person','male',['peleth'],[],'Numbers 16:1','Son of Peleth, named with Korah, Dathan, and Abiram at the opening of the rebellion account.','explicit',['On son of Peleth']),

R('sihon','Sihon','Transjordan kings','King / ruler','male',[],[],'Numbers 21:21–35','King of the Amorites defeated by Israel east of the Jordan.'),
R('og','Og','Transjordan kings','King / ruler','male',[],[],'Numbers 21:33–35','King of Bashan defeated by Israel.'),
R('zippor','Zippor','Moab / Balaam','Person','male',[],[],'Numbers 22:2,4,10,16; 23:18','Father of Balak king of Moab.'),
R('balak','Balak','Moab / Balaam','King / ruler','male',['zippor'],[],'Numbers 22–24','Son of Zippor and king of Moab who summons Balaam to curse Israel.'),
R('beor-balaam','Beor','Balaam','Person','male',[],[],'Numbers 22:5; 24:3,15','Father of Balaam. Distinct from Beor, father of Bela king of Edom in Genesis 36, unless Scripture explicitly identifies them.','unresolved identification',['Beor (father of Balaam)']),
R('balaam','Balaam','Moab / Balaam','Person','male',['beor-balaam'],[],'Numbers 22–24; 31:8,16','Son of Beor, diviner summoned by Balak. Numbers 31 says he was killed in the war with Midian and connects his counsel with the Peor incident.','explicit',['Balaam son of Beor']),
R('agag-numbers','Agag','Balaam oracle','King / ruler name','male',[],[],'Numbers 24:7','Royal name in Balaam’s oracle. The database does not identify this Agag with the later Amalekite king in 1 Samuel; Agag may also function as a dynastic royal name/title.','unresolved identification',['Agag (Numbers 24)']),
R('salu','Salu','Simeon / Peor','Leader','male',[],[],'Numbers 25:14','Father of Zimri and head of a Simeonite fathers’ house.'),
R('zimri-salu','Zimri','Simeon / Peor','Leader','male',['salu'],[],'Numbers 25:14','Son of Salu and chief of a Simeonite fathers’ house; killed with Cozbi during the Peor incident. Distinct from later people named Zimri.','explicit',['Zimri son of Salu']),
R('zur-midian','Zur','Midian','King / tribal leader','male',[],[],'Numbers 25:15; 31:8','Father of Cozbi and tribal head in Midian; later named among the five kings of Midian.'),
R('cozbi','Cozbi','Midian / Peor','Person','female',['zur-midian'],[],'Numbers 25:15,18','Daughter of Zur, a Midianite tribal head; killed with Zimri during the Peor incident.')
];
db.records.push(...rows);
db.scope='Genesis–Numbers 25';
db.phase=3;
})();