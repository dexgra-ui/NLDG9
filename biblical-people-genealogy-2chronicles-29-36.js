(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);

// Hezekiah and temple cleansing.
merge('hezekiah',{ref:'2 Chronicles 29–32'});merge('abijah-hezekiah',{ref:'2 Chronicles 29:1',aliases:['Abijah','Abi']});
for(const [id,n,f,group] of [
 ['mahath-amasa','Mahath','Amasai','Kohathites'],['joel-azariah29','Joel','Azariah','Kohathites'],['kish-abdi','Kish','Abdi','Merarites'],['azariah-jehallelel','Azariah','Jehaleleel','Merarites'],['joah-zimmah','Joah','Zimmah','Gershonites'],['eden-joah','Eden','Joah','Gershonites']
]){
 const fid=`${id}-father`;put(R(fid,f,'Levi / Hezekiah cleansing','Person','male',[],[],'2 Chronicles 29:12',`Father of ${n}, a Levite participating in Hezekiah’s temple cleansing. Distinct from other people named ${f}.`,'explicit',[`${f} father of ${n}`]));
 put(R(id,n,'Levi / Hezekiah cleansing','Levite','male',[fid],[],'2 Chronicles 29:12–19',`${group} Levite participating in the cleansing of the temple in Hezekiah’s reign.`,'explicit',[`${n} son of ${f}`]));
}
for(const [id,n] of [['shimei-elizaphan','Shimei'],['jeiel-elizaphan','Jeiel']])put(R(id,n,'Levi / Hezekiah cleansing','Levite','male',[],[],'2 Chronicles 29:13',`Levite of the sons of Elizaphan participating in the temple cleansing. Distinct from other people named ${n}.`,'explicit',[`${n} of the sons of Elizaphan`]));
for(const [id,n] of [['zechariah-asaph29','Zechariah'],['mattaniah-asaph29','Mattaniah']])put(R(id,n,'Levi / Hezekiah cleansing','Levite / singer line','male',[],[],'2 Chronicles 29:13',`Levite of the sons of Asaph participating in the temple cleansing. Distinct from other people named ${n}.`,'explicit',[`${n} of the sons of Asaph`]));
for(const [id,n] of [['jehiel-heman29','Jehiel'],['shimei-heman29','Shimei']])put(R(id,n,'Levi / Hezekiah cleansing','Levite / singer line','male',[],[],'2 Chronicles 29:14',`Levite of the sons of Heman participating in the temple cleansing. Distinct from other people named ${n}.`,'explicit',[`${n} of the sons of Heman`]));
for(const [id,n] of [['shemaiah-jeduthun29','Shemaiah'],['uzziel-jeduthun29','Uzziel']])put(R(id,n,'Levi / Hezekiah cleansing','Levite / singer line','male',[],[],'2 Chronicles 29:14',`Levite of the sons of Jeduthun participating in the temple cleansing. Distinct from other people named ${n}.`,'explicit',[`${n} of the sons of Jeduthun`]));
merge('asaph',{ref:'2 Chronicles 29:30'});merge('david',{ref:'2 Chronicles 29:25–30'});

// Hezekiah temple administration.
put(R('azariah-chief-priest-hezekiah','Azariah','Priests / Hezekiah','Chief priest','male',[],[],'2 Chronicles 31:10,13','Chief priest from the house of Zadok who reports abundant offerings in Hezekiah’s reign. Distinct from other Azariahs.','explicit',['Azariah chief priest under Hezekiah']));
put(R('conaniah','Conaniah','Levi / Hezekiah','Levite overseer','male',[],[],'2 Chronicles 31:12–13','Levite placed in charge of contributions, tithes, and dedicated gifts. Brother of Shimei.','explicit',['Conaniah'],[{type:'brother',target:'shimei-conaniah',ref:'2 Chronicles 31:12'}]));
put(R('shimei-conaniah','Shimei','Levi / Hezekiah','Levite overseer','male',[],[],'2 Chronicles 31:12','Brother and second to Conaniah in oversight of temple contributions. Distinct from other Shimeis.','explicit',['Shimei brother of Conaniah'],[{type:'brother',target:'conaniah',ref:'2 Chronicles 31:12'}]));
for(const [id,n] of [['jehiel-overseer31','Jehiel'],['azaziah31','Azaziah'],['nahath31','Nahath'],['asahel31','Asahel'],['jerimoth31','Jerimoth'],['jozabad31','Jozabad'],['eliel31','Eliel'],['ismachiah','Ismachiah'],['mahath31','Mahath'],['benaiah31','Benaiah']])put(R(id,n,'Levi / Hezekiah','Temple overseer','male',[],[],'2 Chronicles 31:13',`Temple overseer under Conaniah and Shimei by appointment of Hezekiah and Azariah the chief priest. Distinct from other people named ${n}.`,'explicit',[`${n} (2 Chronicles 31:13)`]));
put(R('imnah-kore','Imnah','Levi / Hezekiah','Person','male',[],[],'2 Chronicles 31:14','Father of Kore the east-gate keeper. Distinct from Imnah son of Asher.','explicit',['Imnah father of Kore']));
put(R('kore-imnah','Kore','Levi / Hezekiah','Gatekeeper / overseer','male',['imnah-kore'],[],'2 Chronicles 31:14','Son of Imnah, keeper of the east gate, responsible for freewill offerings and dedicated portions.','explicit',['Kore son of Imnah']));
for(const [id,n] of [['eden31','Eden'],['miniamin31','Miniamin'],['jeshua31','Jeshua'],['shemaiah31','Shemaiah'],['amariah31','Amariah'],['shecaniah31','Shecaniah']])put(R(id,n,'Levi / Hezekiah','Distribution official','male',[],[],'2 Chronicles 31:15',`Faithfully assists Kore with distribution in the priestly cities. Distinct from other people named ${n}.`,'explicit',[`${n} (2 Chronicles 31:15)`]));

// Assyrian crisis.
merge('sennacherib',{ref:'2 Chronicles 32:1–23'});merge('isaiah',{ref:'2 Chronicles 26:22; 32:20,32',aliases:['Isaiah son of Amoz']});merge('amoz',{ref:'2 Chronicles 32:20,32'});

// Manasseh and Amon.
merge('manasseh-judah',{ref:'2 Chronicles 33:1–20',note:'Chronicles uniquely narrates Manasseh’s captivity, prayer, restoration, and later reforms.'});
merge('amon-judah',{ref:'2 Chronicles 33:21–25'});

// Josiah reform and officials.
merge('josiah',{ref:'2 Chronicles 34–35'});merge('huldah',{ref:'2 Chronicles 34:22–28'});merge('shallum-huldah',{ref:'2 Chronicles 34:22'});
put(R('azaliah-shaphan','Azaliah','Judah / Josiah','Person','male',[],[],'2 Chronicles 34:8','Father of Shaphan the secretary. Distinct from other Azaliahs.','explicit',['Azaliah father of Shaphan']));
merge('shaphan',{parents:['azaliah-shaphan'],ref:'2 Chronicles 34:8,15–20'});
put(R('maaseiah-governor','Maaseiah','Judah / Josiah','City governor','male',[],[],'2 Chronicles 34:8','Governor of Jerusalem involved in temple repair administration. Distinct from other Maaseiahs.','explicit',['Maaseiah governor of Jerusalem']));
put(R('joah-joahaz-recorder','Joah','Judah / Josiah','Recorder','male',['joahaz-father-joah'],[],'2 Chronicles 34:8','Son of Joahaz; recorder involved in temple repair administration. Distinct from other Joahs.','explicit',['Joah son of Joahaz']));
put(R('joahaz-father-joah','Joahaz','Judah / Josiah','Person','male',[],[],'2 Chronicles 34:8','Father of Joah the recorder. Distinct from King Jehoahaz.','explicit',['Joahaz father of Joah']));
merge('hilkiah-priest',{ref:'2 Chronicles 34:9,14–30; 35:8'});
merge('ahikam-shaphan',{ref:'2 Chronicles 34:20'});
put(R('abdon-micah34','Abdon','Judah / Josiah','Royal official','male',['micah-abdon34'],[],'2 Chronicles 34:20','Son of Micah; member of Josiah’s delegation to Huldah. 2 Kings 22:12 has the parallel name Achbor son of Micaiah, so the identity is textually parallel but not silently collapsed.','textual variant',['Abdon son of Micah','Achbor son of Micaiah parallel']));
put(R('micah-abdon34','Micah','Judah / Josiah','Person','male',[],[],'2 Chronicles 34:20','Father of Abdon in Chronicles; parallel to Micaiah father of Achbor in 2 Kings 22:12.','textual variant',['Micah father of Abdon','Micaiah parallel']));
put(R('asaiah-josiah','Asaiah','Judah / Josiah','Royal servant','male',[],[],'2 Chronicles 34:20','Royal servant sent by Josiah to inquire of the LORD through Huldah. Distinct from other Asaiahs.','explicit',['Asaiah servant of Josiah']));

// Passover leaders.
for(const [id,n,kind,ref] of [
 ['zechariah-priest35','Zechariah','Temple chief officer','2 Chronicles 35:8'],['jehiel-priest35','Jehiel','Temple chief officer','2 Chronicles 35:8'],
 ['conaniah35','Conaniah','Levite chief','2 Chronicles 35:9'],['shemaiah35','Shemaiah','Levite chief','2 Chronicles 35:9'],['nethanel35','Nethanel','Levite chief','2 Chronicles 35:9'],['hashabiah35','Hashabiah','Levite chief','2 Chronicles 35:9'],['jeiel35','Jeiel','Levite chief','2 Chronicles 35:9'],['jozabad35','Jozabad','Levite chief','2 Chronicles 35:9']
])put(R(id,n,'Josiah Passover',kind,'male',[],[],ref,`${kind} who contributes animals and leadership for Josiah’s Passover. Distinct from other people named ${n}.`,'explicit',[`${n} (2 Chronicles 35)`]));
merge('jeremiah',{ref:'2 Chronicles 35:25; 36:12,21–22',note:'Chronicles names Jeremiah in connection with laments for Josiah and with the prophetic word fulfilled in the exile.'});
merge('neco',{ref:'2 Chronicles 35:20–24; 36:4'});

// Final kings, exile, and Persian decree.
merge('jehoahaz-judah',{ref:'2 Chronicles 36:1–4'});merge('jehoiakim',{ref:'2 Chronicles 36:4–8'});merge('jehoiachin',{ref:'2 Chronicles 36:9–10'});merge('zedekiah-judah',{ref:'2 Chronicles 36:10–21'});merge('nebuchadnezzar',{ref:'2 Chronicles 36:6–20'});
put(R('cyrus','Cyrus','Persia / restoration','King / ruler','male',[],[],'2 Chronicles 36:22–23','King of Persia whose decree permits the return and rebuilding of the LORD’s house in Jerusalem. The same decree opens Ezra.','explicit',['Cyrus king of Persia']));

db.scope='Genesis–2 Chronicles';db.phase=6;db.completedBooks=[...new Set([...(db.completedBooks||[]),'1 Chronicles','2 Chronicles'])];db.completedPhases=[...new Set([...(db.completedPhases||[]),6])];
})();