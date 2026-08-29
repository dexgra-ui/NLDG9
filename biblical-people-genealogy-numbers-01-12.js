(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('nahshon',{ref:'Exodus 6:23; Numbers 1:7; 2:3; 7:12–17; 10:14',note:'Son of Amminadab, brother of Elisheba, and named leader of the tribe of Judah in the wilderness census and camp order.'});
update('elzaphan-uzziel',{ref:'Exodus 6:22; Leviticus 10:4; Numbers 3:30',note:'Son of Uzziel; chief of the Kohathite clans in Numbers 3.',aliases:['Elzaphan','Elizaphan']});
update('eleazar-aaron',{ref:'Exodus 6:23,25; 28:1; Leviticus 10:6,12,16–20; Numbers 3:32; 4; 8:2; 19:3',note:'Son of Aaron; priest with oversight responsibilities for the Levites and sanctuary.'});
update('joshua',{ref:'Exodus 17:9–14; 24:13; 32:17; 33:11; Numbers 11:28',note:'Son of Nun, assistant of Moses. Numbers 13:16 later states that Moses changed his name from Hoshea to Joshua.'});

const rows=[
R('shedeur','Shedeur','Numbers tribal leaders','Person','male',[],[],'Numbers 1:5; 2:10; 7:30,35; 10:18','Father of Elizur, leader from Reuben.'),
R('elizur','Elizur','Numbers tribal leaders','Leader','male',['shedeur'],[],'Numbers 1:5; 2:10; 7:30,35; 10:18','Son of Shedeur; leader of Reuben.'),
R('zurishaddai','Zurishaddai','Numbers tribal leaders','Person','male',[],[],'Numbers 1:6; 2:12; 7:36,41; 10:19','Father of Shelumiel.'),
R('shelumiel','Shelumiel','Numbers tribal leaders','Leader','male',['zurishaddai'],[],'Numbers 1:6; 2:12; 7:36,41; 10:19','Son of Zurishaddai; leader of Simeon.'),
R('zuar','Zuar','Numbers tribal leaders','Person','male',[],[],'Numbers 1:8; 2:5; 7:18,23; 10:15','Father of Nethanel.'),
R('nethanel-zuar','Nethanel','Numbers tribal leaders','Leader','male',['zuar'],[],'Numbers 1:8; 2:5; 7:18,23; 10:15','Son of Zuar; leader of Issachar. Distinct from later people named Nethanel.','explicit',['Nethanel son of Zuar']),
R('helon','Helon','Numbers tribal leaders','Person','male',[],[],'Numbers 1:9; 2:7; 7:24,29; 10:16','Father of Eliab, leader of Zebulun.'),
R('eliab-helon','Eliab','Numbers tribal leaders','Leader','male',['helon'],[],'Numbers 1:9; 2:7; 7:24,29; 10:16','Son of Helon; leader of Zebulun. Distinct from Eliab the Reubenite in Numbers 16 and 26.','explicit',['Eliab son of Helon']),
R('ammihud-elishama','Ammihud','Numbers tribal leaders','Person','male',[],[],'Numbers 1:10; 2:18; 7:48,53; 10:22','Father of Elishama, leader of Ephraim. Distinct from the Ammihud named as Pedahel’s father in Numbers 34 unless Scripture identifies them.','unresolved identification',['Ammihud (father of Elishama)']),
R('elishama-ammihud','Elishama','Numbers tribal leaders','Leader','male',['ammihud-elishama'],[],'Numbers 1:10; 2:18; 7:48,53; 10:22','Son of Ammihud; leader of Ephraim.'),
R('pedahzur','Pedahzur','Numbers tribal leaders','Person','male',[],[],'Numbers 1:10; 2:20; 7:54,59; 10:23','Father of Gamaliel.'),
R('gamaliel-pedahzur','Gamaliel','Numbers tribal leaders','Leader','male',['pedahzur'],[],'Numbers 1:10; 2:20; 7:54,59; 10:23','Son of Pedahzur; leader of Manasseh. Distinct from the later New Testament teacher Gamaliel.','explicit',['Gamaliel son of Pedahzur']),
R('gideoni','Gideoni','Numbers tribal leaders','Person','male',[],[],'Numbers 1:11; 2:22; 7:60,65; 10:24','Father of Abidan.'),
R('abidan','Abidan','Numbers tribal leaders','Leader','male',['gideoni'],[],'Numbers 1:11; 2:22; 7:60,65; 10:24','Son of Gideoni; leader of Benjamin.'),
R('ammishaddai','Ammishaddai','Numbers tribal leaders','Person','male',[],[],'Numbers 1:12; 2:25; 7:66,71; 10:25','Father of Ahiezer.'),
R('ahiezer-ammishaddai','Ahiezer','Numbers tribal leaders','Leader','male',['ammishaddai'],[],'Numbers 1:12; 2:25; 7:66,71; 10:25','Son of Ammishaddai; leader of Dan.'),
R('ocran','Ocran','Numbers tribal leaders','Person','male',[],[],'Numbers 1:13; 2:27; 7:72,77; 10:26','Father of Pagiel.','explicit',['Ochran']),
R('pagiel','Pagiel','Numbers tribal leaders','Leader','male',['ocran'],[],'Numbers 1:13; 2:27; 7:72,77; 10:26','Son of Ocran; leader of Asher.'),
R('deuel','Deuel / Reuel','Numbers tribal leaders','Person','male',[],[],'Numbers 1:14; 2:14; 7:42,47; 10:20','Father of Eliasaph. Numbers 2:14 preserves Reuel in the Masoretic text while the other occurrences read Deuel; the variant is kept visible.','textual variant',['Deuel','Reuel']),
R('eliasaph-deuel','Eliasaph','Numbers tribal leaders','Leader','male',['deuel'],[],'Numbers 1:14; 2:14; 7:42,47; 10:20','Son of Deuel/Reuel; leader of Gad. Distinct from Eliasaph son of Lael, the Gershonite leader.','textual variant',['Eliasaph son of Deuel','Eliasaph son of Reuel']),
R('enan','Enan','Numbers tribal leaders','Person','male',[],[],'Numbers 1:15; 2:29; 7:78,83; 10:27','Father of Ahira.'),
R('ahira','Ahira','Numbers tribal leaders','Leader','male',['enan'],[],'Numbers 1:15; 2:29; 7:78,83; 10:27','Son of Enan; leader of Naphtali.'),
R('lael','Lael','Levi / Gershonites','Person','male',[],[],'Numbers 3:24','Father of Eliasaph, chief of the Gershonite fathers’ house.'),
R('eliasaph-lael','Eliasaph','Levi / Gershonites','Leader','male',['lael'],[],'Numbers 3:24','Son of Lael; chief of the Gershonite fathers’ house. Distinct from Eliasaph son of Deuel/Reuel of Gad.','explicit',['Eliasaph son of Lael']),
R('abihail-zuriel','Abihail','Levi / Merarites','Person','male',[],[],'Numbers 3:35','Father of Zuriel. Distinct from later people named Abihail.','explicit',['Abihail (father of Zuriel)']),
R('zuriel','Zuriel','Levi / Merarites','Leader','male',['abihail-zuriel'],[],'Numbers 3:35','Son of Abihail; chief of the Merarite fathers’ house.'),
R('hobab','Hobab','Midian / Moses','Person','male',['reuel-midian'],[],'Numbers 10:29–32','Son of Reuel the Midianite. The Hebrew kinship phrase in Numbers 10:29 is translated in different ways regarding “father-in-law”; the database records Hobab’s explicit father and leaves his precise in-law title to Moses unforced.','unresolved identification',['Hobab son of Reuel'],[C('kin by marriage','moses','Numbers 10:29','Translation traditions differ over whether Hobab or Reuel is called Moses’ father-in-law.')]),
R('eldad','Eldad','Wilderness elders','Person','male',[],[],'Numbers 11:26–29','One of the two named men who remained in the camp and prophesied when the Spirit rested on the elders.'),
R('medad','Medad','Wilderness elders','Person','male',[],[],'Numbers 11:26–29','One of the two named men who remained in the camp and prophesied when the Spirit rested on the elders.')
];
db.records.push(...rows);
db.scope='Genesis–Numbers 12';
db.phase=3;
})();