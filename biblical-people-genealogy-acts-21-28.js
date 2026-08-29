(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Acts 21: return to Jerusalem.
add('philip-evangelist','Acts 21:8–9','Philip is explicitly called the evangelist and one of the Seven; his four unmarried daughters prophesy but are not personally named.');
add('agabus','Acts 21:10–11','Agabus comes from Judea and symbolically warns Paul of coming arrest.');
put(R('mnason','Mnason','Early church / Cyprus','Disciple / host','male',[],[],'Acts 21:16','Early disciple from Cyprus with whom Paul’s group is to lodge in Jerusalem.','explicit',['Mnason of Cyprus']));
add('james-jerusalem','Acts 21:18–25','James receives Paul in Jerusalem with the elders and discusses concerns about the mission among the Jews.');
add('trophimus','Acts 21:29','Trophimus the Ephesian is explicitly named as Paul’s Gentile companion whose presence in Jerusalem contributes to the accusation against Paul.');

// Acts 22: Paul’s testimony.
add('gamaliel','Acts 22:3','Paul explicitly says he was educated at the feet of Gamaliel.');
add('ananias-damascus','Acts 22:12–16','Paul recounts Ananias of Damascus as the devout man sent to restore his sight and commission him.');
add('stephen','Acts 22:20','Paul explicitly recalls consenting to Stephen’s death.');

// Acts 23: Ananias the high priest, Claudius Lysias, and Felix.
put(R('ananias-high-priest','Ananias','Jerusalem priesthood / Acts 23','High priest','male',[],[],'Acts 23:2–5; 24:1','High priest who orders Paul to be struck and later travels with elders to present charges before Felix. Distinct from Ananias in Acts 5 and Ananias of Damascus.','explicit',['Ananias the high priest']));
put(R('claudius-lysias','Claudius Lysias','Roman military / Jerusalem','Tribune / commander','male',[],[],'Acts 23:26–30; 24:7,22','Roman commander who rescues Paul from violence and sends him to Governor Felix with a letter.','explicit',['Claudius Lysias','Lysias']));
put(R('felix','Felix','Roman Judea','Governor / ruler','male',[],['drusilla'],'Acts 23:24,26–35; 24:1–27','Governor who hears Paul’s case in Caesarea and keeps him imprisoned for two years. Acts names his wife Drusilla as Jewish.','explicit',['Governor Felix']));

// Acts 24: Tertullus and Drusilla.
put(R('tertullus','Tertullus','Jerusalem prosecution / Acts 24','Advocate / orator','male',[],[],'Acts 24:1–9','Orator/advocate who presents the high priest and elders’ case against Paul before Felix.','explicit',['Tertullus']));
put(R('drusilla','Drusilla','Roman Judea / Herodian world','Person','female',[],['felix'],'Acts 24:24','Jewish wife of Felix who hears Paul speak about faith in Christ Jesus. Acts does not state her parents or sibling relationships.','explicit',['Drusilla wife of Felix']));

// Acts 24–26: Festus, Agrippa, and Bernice.
put(R('festus','Festus','Roman Judea','Governor / ruler','male',[],[],'Acts 24:27; 25:1–27; 26:24–32','Governor who succeeds Felix, hears Paul’s case, and consults King Agrippa before sending Paul to Caesar.','explicit',['Governor Festus']));
put(R('agrippa-ii','Agrippa','Herodian dynasty / Acts 25–26','King / ruler','male',[],[],'Acts 25:13–27; 26:1–32','King Agrippa who hears Paul’s defense at Caesarea and discusses the case with Festus. Commonly identified historically as Herod Agrippa II; Acts itself names him Agrippa/King Agrippa.','explicit',['King Agrippa','Herod Agrippa II']));
put(R('bernice','Bernice','Herodian court / Acts 25–26','Royal court figure','female',[],[],'Acts 25:13,23; 26:30','Named royal woman who appears with King Agrippa at Caesarea. Acts does not state her family relationship to Agrippa, so historical sibling information is not inserted as a Scripture-stated connection.','explicit',['Bernice','Berenice']));
add('saul-paul','Acts 21:17–28:31','Paul is arrested in Jerusalem, gives repeated defenses, appeals to Caesar, survives the voyage and shipwreck, and reaches Rome.');
addAny(['moses'],'Acts 26:22','Paul explicitly says his testimony agrees with what Moses and the prophets said would happen.');

// Acts 27: voyage to Rome.
put(R('julius-centurion','Julius','Roman military / voyage to Rome','Centurion','male',[],[],'Acts 27:1,3,6,11,31,43','Centurion of the Augustan Cohort entrusted with Paul and other prisoners on the voyage to Italy; treats Paul kindly and later saves the prisoners from being killed.','explicit',['Julius the centurion']));
add('aristarchus','Acts 27:2','Aristarchus, a Macedonian from Thessalonica, accompanies Paul on the voyage toward Rome.');

// Acts 28: Malta and Rome.
put(R('publius','Publius','Malta / Acts 28','Chief official / host','male',[],[],'Acts 28:7–10','Chief man/leading official of Malta who hosts Paul’s group for three days. His father is healed by Paul but is not personally named.','explicit',['Publius']));

// Castor and Pollux in Acts 28:11 are the twin deities represented on the ship’s figurehead, not human travelers, so they are excluded from the human people database.
db.scope='Genesis–Acts';db.phase=12;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Acts'])];
})();