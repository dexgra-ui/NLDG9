(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,patch)=>{const r=db.records.find(x=>x.id===id);if(r)Object.assign(r,{...r,...patch,aliases:[...new Set([...(r.aliases||[]),...(patch.aliases||[])])],connections:[...(r.connections||[]),...(patch.connections||[])]});};

update('pallu',{ref:'Genesis 46:9; Numbers 26:5,8',note:'Son of Reuben; Numbers 26 explicitly names Eliab as his son.'});
update('eliab-reuben',{parents:['pallu'],ref:'Numbers 16:1,12; 26:8–9',note:'Reubenite son of Pallu and father of Nemuel, Dathan, and Abiram; distinct from Eliab son of Helon.'});
update('jemuel',{name:'Jemuel / Nemuel',ref:'Genesis 46:10; Numbers 26:12',note:'Son of Simeon. Genesis has Jemuel; Numbers has Nemuel.',certainty:'textual variant',aliases:['Jemuel','Nemuel']});
update('zohar-simeon',{name:'Zohar / Zerah',ref:'Genesis 46:10; Numbers 26:13',note:'Son of Simeon. Genesis has Zohar; Numbers has Zerah.',certainty:'textual variant',aliases:['Zohar','Zerah']});
update('ziphion-gad',{name:'Ziphion / Zephon',ref:'Genesis 46:16; Numbers 26:15',note:'Son of Gad. Genesis has Ziphion; Numbers has Zephon.',certainty:'textual variant',aliases:['Ziphion','Zephon']});
update('ezbon-gad',{name:'Ezbon / Ozni',ref:'Genesis 46:16; Numbers 26:16',note:'Son of Gad. Genesis has Ezbon; Numbers has Ozni.',certainty:'textual variant',aliases:['Ezbon','Ozni']});
update('arodi',{name:'Arodi / Arod',ref:'Genesis 46:16; Numbers 26:17',note:'Son of Gad. Genesis has Arodi; Numbers has Arod.',certainty:'textual variant',aliases:['Arodi','Arod']});
update('puvah-issachar',{name:'Puvah / Puah',ref:'Genesis 46:13; Numbers 26:23',note:'Son of Issachar; spelling varies among textual and genealogical traditions.',certainty:'textual variant',aliases:['Puvah','Puvvah','Puah']});
update('jashub-issachar',{name:'Jashub / Job',ref:'Genesis 46:13; Numbers 26:24',note:'Son of Issachar. Genesis textual tradition commonly reads Job/Iob; Numbers has Jashub.',certainty:'textual variant',aliases:['Jashub','Job','Iob']});
update('ehi-benjamin',{name:'Ehi / Ahiram',ref:'Genesis 46:21; Numbers 26:38',note:'Benjaminite name presented as Ehi in Genesis and Ahiram in Numbers; the variant is preserved rather than creating a false certainty.',certainty:'textual variant',aliases:['Ehi','Ahiram']});
update('muppim',{name:'Muppim / Shephupham',ref:'Genesis 46:21; Numbers 26:39',note:'Benjaminite genealogy preserves Muppim in Genesis and Shephupham/Shupham in Numbers.',certainty:'textual variant',aliases:['Muppim','Shephupham','Shupham']});
update('huppim',{name:'Huppim / Hupham',ref:'Genesis 46:21; Numbers 26:39',note:'Benjaminite genealogy preserves Huppim in Genesis and Hupham in Numbers.',certainty:'textual variant',aliases:['Huppim','Hupham']});
update('ard-benjamin',{ref:'Genesis 46:21; Numbers 26:40',note:'Genesis lists Ard directly under Benjamin; Numbers lists Ard under Bela. The database preserves the different genealogical presentation rather than silently changing generations.',connections:[C('presented as son/descendant of','bela-benjamin','Numbers 26:40','Numbers places Ard under Bela, while Genesis 46 places him directly under Benjamin.')],certainty:'textual variant'});
update('naaman-benjamin',{ref:'Genesis 46:21; Numbers 26:40',note:'Genesis lists Naaman directly under Benjamin; Numbers lists Naaman under Bela. The database preserves the different genealogical presentation.',connections:[C('presented as son/descendant of','bela-benjamin','Numbers 26:40','Numbers places Naaman under Bela, while Genesis 46 places him directly under Benjamin.')],certainty:'textual variant'});
update('hushim-dan',{name:'Hushim / Shuham',ref:'Genesis 46:23; Numbers 26:42',note:'Danite ancestor-name appearing as Hushim in Genesis and Shuham in Numbers.',certainty:'textual variant',aliases:['Hushim','Shuham']});
update('jochebed',{parents:['levi'],ref:'Exodus 6:20; Numbers 26:59',note:'Daughter of Levi, born to Levi in Egypt; wife of Amram and mother of Aaron, Moses, and Miriam. Exodus also describes her as Amram’s father’s sister.'});
update('miriam',{parents:['amram','jochebed'],ref:'Exodus 15:20–21; Numbers 12; 20:1; 26:59',note:'Daughter of Amram and Jochebed; sister of Aaron and Moses; prophetess.',connections:[C('brother','aaron','Exodus 15:20; Numbers 26:59'),C('brother','moses','Numbers 26:59')]});
update('moses',{parents:['amram','jochebed'],ref:'Exodus 2–40; Numbers 1–36',connections:[C('sister','miriam','Numbers 26:59')]});
update('aaron',{parents:['amram','jochebed'],ref:'Exodus 4–40; Leviticus 1–27; Numbers 1–20; 26:59–60; 33:38–39',connections:[C('sister','miriam','Numbers 26:59')]});

const rows=[
R('nemuel-eliab','Nemuel','Reuben','Person / ancestor name','male',['eliab-reuben'],[],'Numbers 26:9','Son of Eliab the Reubenite; brother of Dathan and Abiram. Distinct from Nemuel/Jemuel son of Simeon.','explicit',['Nemuel son of Eliab'],[C('brother','dathan','Numbers 26:9'),C('brother','abiram-eliab','Numbers 26:9')]),
R('machir','Machir','Manasseh','Person / ancestor name','male',['manasseh'],[],'Numbers 26:29; 27:1; 32:39–40; 36:1','Son of Manasseh and father of Gilead.'),
R('gilead-machir','Gilead','Manasseh','Person / ancestor name','male',['machir'],[],'Numbers 26:29–33; 27:1; 36:1','Son of Machir; father/ancestor of the Gileadite lines including Hepher and Zelophehad. Distinct from the region called Gilead.','explicit',['Gilead son of Machir']),
R('iezer-gilead','Iezer / Abiezer','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:30','Son/descendant of Gilead and clan ancestor. Later textual tradition uses Abiezer.', 'textual variant',['Iezer','Abiezer']),
R('helek-gilead','Helek','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:30','Son/descendant of Gilead and clan ancestor.'),
R('asriel-gilead','Asriel','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:31','Son/descendant of Gilead and clan ancestor.'),
R('shechem-gilead','Shechem','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:31','Son/descendant of Gilead and clan ancestor; distinct from Shechem son of Hamor.','explicit',['Shechem (Gileadite ancestor)']),
R('shemida','Shemida','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:32','Son/descendant of Gilead and clan ancestor.'),
R('hepher-gilead','Hepher','Manasseh','Person / ancestor name','male',['gilead-machir'],[],'Numbers 26:32–33; 27:1','Son/descendant of Gilead; father of Zelophehad.'),
R('zelophehad','Zelophehad','Manasseh','Person','male',['hepher-gilead'],[],'Numbers 26:33; 27:1–11; 36','Son of Hepher in the line of Gilead, Machir, and Manasseh. He had no sons and five named daughters.'),
R('mahlah-zelophehad','Mahlah','Manasseh / Zelophehad','Person','female',['zelophehad'],[],'Numbers 26:33; 27:1; 36:11','Daughter of Zelophehad; one of five sisters whose inheritance case establishes a legal precedent in Israel.'),
R('noah-zelophehad','Noah','Manasseh / Zelophehad','Person','female',['zelophehad'],[],'Numbers 26:33; 27:1; 36:11','Daughter of Zelophehad; distinct from Noah son of Lamech.','explicit',['Noah daughter of Zelophehad']),
R('hoglah','Hoglah','Manasseh / Zelophehad','Person','female',['zelophehad'],[],'Numbers 26:33; 27:1; 36:11','Daughter of Zelophehad.'),
R('milcah-zelophehad','Milcah','Manasseh / Zelophehad','Person','female',['zelophehad'],[],'Numbers 26:33; 27:1; 36:11','Daughter of Zelophehad; distinct from Milcah wife of Nahor.','explicit',['Milcah daughter of Zelophehad']),
R('tirzah-zelophehad','Tirzah','Manasseh / Zelophehad','Person','female',['zelophehad'],[],'Numbers 26:33; 27:1; 36:11','Daughter of Zelophehad.'),
R('shuthelah','Shuthelah','Ephraim','Person / ancestor name','male',['ephraim'],[],'Numbers 26:35–36','Son/descendant of Ephraim; father of Eran.'),
R('becher-ephraim','Becher','Ephraim','Person / ancestor name','male',['ephraim'],[],'Numbers 26:35','Son/descendant of Ephraim in the Numbers census; distinct from Becher in Benjamin’s Genesis genealogy.','explicit',['Becher (Ephraim)']),
R('tahan-ephraim','Tahan','Ephraim','Person / ancestor name','male',['ephraim'],[],'Numbers 26:35','Son/descendant of Ephraim and clan ancestor.'),
R('eran','Eran','Ephraim','Person / ancestor name','male',['shuthelah'],[],'Numbers 26:36','Son/descendant of Shuthelah and clan ancestor.'),

R('evi-midian','Evi','Midian','King / ruler','male',[],[],'Numbers 31:8','One of five named kings of Midian killed in Israel’s campaign.'),
R('rekem-midian','Rekem','Midian','King / ruler','male',[],[],'Numbers 31:8','One of five named kings of Midian killed in Israel’s campaign. Distinct from later people/places named Rekem.','explicit',['Rekem (Midianite king)']),
R('hur-midian','Hur','Midian','King / ruler','male',[],[],'Numbers 31:8','One of five named kings of Midian; distinct from the Hurs named in Exodus.','explicit',['Hur (Midianite king)']),
R('reba-midian','Reba','Midian','King / ruler','male',[],[],'Numbers 31:8','One of five named kings of Midian killed in Israel’s campaign.'),

R('jair-manasseh','Jair','Manasseh','Leader','male',['manasseh'],[],'Numbers 32:41','Called a son of Manasseh; captured settlements and called them Havvoth-jair. The expression may denote descent rather than immediate generation.','explicit',['Jair son/descendant of Manasseh']),
R('nobah','Nobah','Manasseh / Transjordan','Leader','male',[],[],'Numbers 32:42','Captured Kenath and its villages and called the place Nobah after his own name.'),

R('ammihud-shemuel','Ammihud','Land allocation','Person','male',[],[],'Numbers 34:20','Father of Shemuel of Simeon. Distinct from Ammihud father of Elishama and Ammihud father of Pedahel unless Scripture identifies them.','unresolved identification',['Ammihud (father of Shemuel)']),
R('shemuel-ammihud','Shemuel','Land allocation','Leader','male',['ammihud-shemuel'],[],'Numbers 34:20','Son of Ammihud; chief from Simeon appointed to divide the land.'),
R('chislon','Chislon','Land allocation','Person','male',[],[],'Numbers 34:21','Father of Elidad.'),
R('elidad','Elidad','Land allocation','Leader','male',['chislon'],[],'Numbers 34:21','Son of Chislon; chief from Benjamin appointed to divide the land.'),
R('jogli','Jogli','Land allocation','Person','male',[],[],'Numbers 34:22','Father of Bukki.'),
R('bukki-jogli','Bukki','Land allocation','Leader','male',['jogli'],[],'Numbers 34:22','Son of Jogli; chief from Dan appointed to divide the land. Distinct from later Bukki in priestly genealogy.','explicit',['Bukki son of Jogli']),
R('ephod-hanniel','Ephod','Land allocation','Person','male',[],[],'Numbers 34:23','Father of Hanniel. Distinct from the priestly garment called an ephod.','explicit',['Ephod (father of Hanniel)']),
R('hanniel','Hanniel','Land allocation','Leader','male',['ephod-hanniel'],[],'Numbers 34:23','Son of Ephod; chief from Manasseh appointed to divide the land.'),
R('shiphtan','Shiphtan','Land allocation','Person','male',[],[],'Numbers 34:24','Father of Kemuel.'),
R('kemuel-shiphtan','Kemuel','Land allocation','Leader','male',['shiphtan'],[],'Numbers 34:24','Son of Shiphtan; chief from Ephraim appointed to divide the land. Distinct from Kemuel son of Nahor and Milcah.','explicit',['Kemuel son of Shiphtan']),
R('parnach','Parnach','Land allocation','Person','male',[],[],'Numbers 34:25','Father of Elizaphan.'),
R('elizaphan-parnach','Elizaphan','Land allocation','Leader','male',['parnach'],[],'Numbers 34:25','Son of Parnach; chief from Zebulun appointed to divide the land. Distinct from Elizaphan/Elzaphan son of Uzziel.','explicit',['Elizaphan son of Parnach']),
R('azzan','Azzan','Land allocation','Person','male',[],[],'Numbers 34:26','Father of Paltiel.'),
R('paltiel-azzan','Paltiel','Land allocation','Leader','male',['azzan'],[],'Numbers 34:26','Son of Azzan; chief from Issachar appointed to divide the land. Distinct from later people named Paltiel.','explicit',['Paltiel son of Azzan']),
R('shelomi','Shelomi','Land allocation','Person','male',[],[],'Numbers 34:27','Father of Ahihud.'),
R('ahihud-shelomi','Ahihud','Land allocation','Leader','male',['shelomi'],[],'Numbers 34:27','Son of Shelomi; chief from Asher appointed to divide the land.'),
R('ammihud-pedahel','Ammihud','Land allocation','Person','male',[],[],'Numbers 34:28','Father of Pedahel of Naphtali. Distinct from other wilderness-generation people named Ammihud unless Scripture identifies them.','unresolved identification',['Ammihud (father of Pedahel)']),
R('pedahel','Pedahel','Land allocation','Leader','male',['ammihud-pedahel'],[],'Numbers 34:28','Son of Ammihud; chief from Naphtali appointed to divide the land.')
];

db.records.push(...rows);
db.scope='Genesis–Numbers';
db.phase=3;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Genesis','Exodus','Leviticus','Numbers'])];
})();