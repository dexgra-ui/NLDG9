(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Ephesians.
add('saul-paul','Ephesians 1:1–6:24','Paul names himself as apostle and sender of Ephesians.');
add('tychicus','Ephesians 6:21–22','Tychicus is called a beloved brother and faithful minister who will report Paul’s circumstances and encourage the recipients.');

// Philippians.
add('saul-paul','Philippians 1:1–4:23','Paul names himself with Timothy as servant of Christ Jesus and primary voice of the letter.');
add('timothy','Philippians 1:1; 2:19–24','Timothy is co-sender and trusted coworker whom Paul hopes to send to Philippi.');
put(R('epaphroditus','Epaphroditus','Philippi church / Pauline mission','Messenger / coworker','male',[],[],'Philippians 2:25–30; 4:18','Paul’s brother, fellow worker and fellow soldier, and the Philippians’ messenger who ministered to Paul’s need and became seriously ill.','explicit',['Epaphroditus']));
put(R('euodia','Euodia','Philippi church','Believer / coworker','female',[],[],'Philippians 4:2–3','Woman urged to agree in the Lord with Syntyche; Paul says the women labored side by side with him in the gospel.','explicit',['Euodia']));
put(R('syntyche','Syntyche','Philippi church','Believer / coworker','female',[],[],'Philippians 4:2–3','Woman urged to agree in the Lord with Euodia; Paul says the women labored side by side with him in the gospel.','explicit',['Syntyche']));
put(R('clement-philippians','Clement','Philippi church','Believer / coworker','male',[],[],'Philippians 4:3','Named among Paul’s fellow workers whose names are in the book of life. Distinct from later historical figures unless Scripture identifies them.','explicit',['Clement in Philippians']));

// Colossians.
add('saul-paul','Colossians 1:1–4:18','Paul names himself as apostle and primary sender.');
add('timothy','Colossians 1:1','Timothy is named as Paul’s brother and co-sender.');
put(R('epaphras','Epaphras','Colossae church / Pauline mission','Minister / coworker','male',[],[],'Colossians 1:7–8; 4:12–13; Philemon 23','Beloved fellow servant and faithful minister associated with Colossae; later sends greetings as Paul’s fellow prisoner in Philemon.','explicit',['Epaphras']));
add('tychicus','Colossians 4:7–8','Tychicus is called a beloved brother, faithful minister, and fellow servant sent to report Paul’s affairs.');
put(R('onesimus','Onesimus','Colossae / Philemon household','Believer / servant','male',[],[],'Colossians 4:9; Philemon 10–21','Faithful and beloved brother from Colossae, later central to Philemon as Paul’s spiritual child. Philemon describes a former master/servant relationship with Philemon; no biological family relation is stated.','explicit',['Onesimus']));
add('aristarchus','Colossians 4:10','Aristarchus is named as Paul’s fellow prisoner sending greetings.');
put(R('mark-barnabas-cousin','Mark','Pauline mission / Barnabas family','Missionary associate','male',[],[],'Colossians 4:10; Philemon 24','Mark is explicitly called the cousin of Barnabas and sends greetings. He is very likely John Mark of Acts, but Colossians does not use the name John, so the identity remains labeled rather than silently collapsed.','probable',['Mark cousin of Barnabas'],[C('cousin','barnabas','Colossians 4:10'),C('probable identity','john-mark','Acts 12:12,25; 15:37–39; Colossians 4:10','Barnabas’s close association with John Mark plus the name Mark strongly supports identity, but no verse explicitly says “John Mark, cousin of Barnabas.”')]));
add('barnabas','Colossians 4:10','Barnabas is explicitly named as cousin of Mark.',{connections:[C('cousin','mark-barnabas-cousin','Colossians 4:10')]});
put(R('jesus-justus','Jesus called Justus','Pauline mission / Colossians','Jewish coworker','male',[],[],'Colossians 4:11','Jewish coworker of Paul called Jesus who is also known as Justus. Distinct from Jesus Christ and from Joseph Barsabbas called Justus.','explicit',['Jesus Justus','Justus']));
put(R('luke-physician','Luke','Pauline mission','Physician / coworker','male',[],[],'Colossians 4:14; Philemon 24; 2 Timothy 4:11','Beloved physician and coworker who sends greetings and later remains with Paul. Scripture does not explicitly state that this Luke authored Luke–Acts, so authorship tradition is not entered as a Scripture-stated identity.','explicit',['Luke the beloved physician']));
put(R('demas','Demas','Pauline mission','Coworker','male',[],[],'Colossians 4:14; Philemon 24; 2 Timothy 4:10','Coworker who sends greetings in Colossians and Philemon; 2 Timothy later says he deserted Paul because he loved the present age.','explicit',['Demas']));
put(R('nympha','Nympha','Laodicea church','House-church host','female',[],[],'Colossians 4:15','Person in Laodicea associated with a church meeting in her house. Manuscript traditions vary between feminine Nympha and masculine Nymphas and between “her/his/their house,” so the gender is textually variable.','textual variant',['Nympha','Nymphas']));
put(R('archippus','Archippus','Colossae / Philemon church','Minister / fellow soldier','male',[],[],'Colossians 4:17; Philemon 2','Person exhorted to fulfill the ministry received in the Lord; Philemon calls Archippus a fellow soldier. No family relationship to Philemon or Apphia is explicitly stated.','explicit',['Archippus']));

// 1 Thessalonians and 2 Thessalonians.
add('saul-paul','1 Thessalonians 1:1–5:28; 2 Thessalonians 1:1–3:18','Paul is named with Silvanus and Timothy as sender in both Thessalonian letters.');
put(R('silvanus','Silvanus','Pauline mission','Missionary associate','male',[],[],'1 Thessalonians 1:1; 2 Thessalonians 1:1','Named with Paul and Timothy as co-sender. Silvanus is widely understood as the Latinized name of Silas in Acts, but the New Testament does not explicitly state “Silas is Silvanus.”','probable',['Silvanus'],[C('probable identity','silas','Acts 15–18; 1 Thessalonians 1:1','Missionary context strongly supports the traditional identification.') ]));
add('silas','1 Thessalonians 1:1; 2 Thessalonians 1:1','The Acts missionary Silas is probably the Silvanus named in the Thessalonian letters; kept as a reciprocal probable identity.',{connections:[C('probable identity','silvanus','Acts 15–18; 1 Thessalonians 1:1')]});
add('timothy','1 Thessalonians 1:1; 3:2,6; 2 Thessalonians 1:1','Timothy is co-sender and is explicitly sent to strengthen and encourage the Thessalonian believers.');

// 1 Timothy.
add('saul-paul','1 Timothy 1:1–6:21','Paul names himself as apostle and writes to Timothy.');
add('timothy','1 Timothy 1:2,18; 6:20','Timothy is addressed as Paul’s true child in the faith and entrusted with pastoral responsibility.');
put(R('hymenaeus','Hymenaeus','Early church / false teaching','Teacher under discipline','male',[],[],'1 Timothy 1:20; 2 Timothy 2:17–18','Man named with Alexander as having made shipwreck of faith and later with Philetus as spreading teaching that the resurrection had already happened.','explicit',['Hymenaeus']));
put(R('alexander-1timothy','Alexander','Early church / discipline','Person under discipline','male',[],[],'1 Timothy 1:20','Named with Hymenaeus as one whom Paul handed over for discipline. Possible identity with Alexander the coppersmith in 2 Timothy 4:14 is not forced.','unresolved identification',['Alexander in 1 Timothy']));
addAny(['adam'],'1 Timothy 2:13–14','Adam is explicitly named in Paul’s creation-order argument.');
put(R('eve','Eve','Primeval family / NT reference','Person','female',[],[],'1 Timothy 2:13–14','Eve is explicitly named in 1 Timothy’s creation and deception reference; the Genesis database may represent her under an earlier established record if present, but this record preserves the New Testament name if no shared ID exists.','explicit',['Eve']));
add('pilate','1 Timothy 6:13','Pontius Pilate is explicitly named in connection with Jesus’ good confession.',{aliases:['Pontius Pilate','Pilate']});

// 2 Timothy: Timothy’s family and Paul’s final network.
add('saul-paul','2 Timothy 1:1–4:22','Paul writes to Timothy and names a wide circle of friends, deserters, opponents, and coworkers.');
add('timothy','2 Timothy 1:2–5; 3:10–15; 4:9,21','Timothy is addressed as Paul’s beloved child; the letter explicitly names his grandmother Lois and mother Eunice.');
put(R('lois','Lois','Timothy family','Person','female',[],[],'2 Timothy 1:5','Timothy’s grandmother, whose sincere faith Paul recalls. The maternal/paternal side is not explicitly specified except that Eunice is Timothy’s mother.','explicit',['Lois grandmother of Timothy'],[C('grandmother','timothy','2 Timothy 1:5')]));
put(R('eunice','Eunice','Timothy family','Person','female',[],[],'2 Timothy 1:5; Acts 16:1','Timothy’s mother, explicitly named in 2 Timothy; Acts 16 identifies Timothy’s mother as a believing Jewish woman but does not name her there.','explicit',['Eunice mother of Timothy'],[C('mother','timothy','2 Timothy 1:5')]));
merge('timothy',{parents:['eunice'],connections:[...(db.records.find(r=>r.id==='timothy')?.connections||[]),C('grandmother','lois','2 Timothy 1:5')]});
put(R('phygelus','Phygelus','Pauline network / Asia','Person who turned away','male',[],[],'2 Timothy 1:15','Named with Hermogenes among those in Asia who turned away from Paul.','explicit',['Phygelus','Phygellus']));
put(R('hermogenes','Hermogenes','Pauline network / Asia','Person who turned away','male',[],[],'2 Timothy 1:15','Named with Phygelus among those in Asia who turned away from Paul.','explicit',['Hermogenes']));
put(R('onesiphorus','Onesiphorus','Pauline network','Believer / supporter','male',[],[],'2 Timothy 1:16–18; 4:19','Paul prays blessing on the household of Onesiphorus because he often refreshed Paul and searched for him in Rome. The household is named collectively; spouse/children are not named.','explicit',['Onesiphorus']));
put(R('philetus','Philetus','Early church / false teaching','False teacher','male',[],[],'2 Timothy 2:17–18','Named with Hymenaeus as teaching that the resurrection had already happened.','explicit',['Philetus']));
add('hymenaeus','2 Timothy 2:17–18','Hymenaeus is named with Philetus as spreading destructive resurrection teaching.');
put(R('jannes','Jannes','Moses opposition tradition','Opponent of Moses','male',[],[],'2 Timothy 3:8','Named with Jambres as men who opposed Moses. Exodus does not give the magicians these personal names, so 2 Timothy supplies the names in the canonical text.','explicit',['Jannes']));
put(R('jambres','Jambres','Moses opposition tradition','Opponent of Moses','male',[],[],'2 Timothy 3:8','Named with Jannes as men who opposed Moses. Exodus does not personally name the magicians.','explicit',['Jambres']));
addAny(['moses'],'2 Timothy 3:8','Moses is explicitly named in the Jannes and Jambres comparison.');
add('demas','2 Timothy 4:10','Demas is said to have deserted Paul because he loved the present age and gone to Thessalonica.');
put(R('crescens','Crescens','Pauline mission','Missionary associate','male',[],[],'2 Timothy 4:10','Coworker who has gone to Galatia.','explicit',['Crescens']));
add('titus','2 Timothy 4:10','Titus is said to have gone to Dalmatia.');
add('luke-physician','2 Timothy 4:11','Luke alone is said to be with Paul.');
add('john-mark','2 Timothy 4:11','Paul asks Timothy to bring Mark because he is useful in ministry. This is traditionally identified with John Mark; the Acts record is enriched while the Colossians cousin identity remains separately labeled.');
add('tychicus','2 Timothy 4:12','Paul says he sent Tychicus to Ephesus.');
put(R('carpus','Carpus','Pauline network / Troas','Believer / host','male',[],[],'2 Timothy 4:13','Person at Troas with whom Paul left a cloak and books/parchments.','explicit',['Carpus']));
put(R('alexander-coppersmith','Alexander','Pauline opposition','Coppersmith / opponent','male',[],[],'2 Timothy 4:14–15','Coppersmith who did Paul great harm and whom Timothy is warned to avoid. Possible identity with Alexander in 1 Timothy 1:20 or Acts 19 is not forced.','unresolved identification',['Alexander the coppersmith']));
add('priscilla','2 Timothy 4:19','Prisca/Priscilla is greeted with Aquila.',{aliases:['Prisca','Priscilla']});
add('aquila','2 Timothy 4:19','Aquila is greeted with Prisca.');
add('onesiphorus','2 Timothy 4:19','Paul sends greetings to the household of Onesiphorus.');
add('erastus','2 Timothy 4:20','Paul says Erastus remained at Corinth. Possible identity with other Erastus records remains unresolved.');
add('trophimus','2 Timothy 4:20','Paul says he left Trophimus ill at Miletus.');
put(R('eubulus','Eubulus','Roman church / Pauline network','Believer','male',[],[],'2 Timothy 4:21','Believer who sends greetings to Timothy.','explicit',['Eubulus']));
put(R('pudens','Pudens','Roman church / Pauline network','Believer','male',[],[],'2 Timothy 4:21','Believer who sends greetings to Timothy.','explicit',['Pudens']));
put(R('linus','Linus','Roman church / Pauline network','Believer','male',[],[],'2 Timothy 4:21','Believer who sends greetings to Timothy. Later church tradition gives him additional roles, but Scripture does not.','explicit',['Linus']));
put(R('claudia','Claudia','Roman church / Pauline network','Believer','female',[],[],'2 Timothy 4:21','Believer who sends greetings to Timothy.','explicit',['Claudia']));

// Titus.
add('saul-paul','Titus 1:1–3:15','Paul names himself as sender and writes to Titus.');
add('titus','Titus 1:4; 3:12–15','Titus is addressed as Paul’s true child in a common faith and entrusted with organizing churches in Crete.');
put(R('artemas','Artemas','Pauline mission','Missionary associate','male',[],[],'Titus 3:12','Coworker Paul may send to Titus in Crete.','explicit',['Artemas']));
add('tychicus','Titus 3:12','Tychicus is one of the coworkers Paul may send to Titus.');
put(R('zenas','Zenas','Pauline mission','Lawyer / coworker','male',[],[],'Titus 3:13','Lawyer whom Titus is instructed to help on his journey with Apollos. Scripture does not clarify whether “lawyer” means Roman jurist or expert in Jewish law.','explicit',['Zenas the lawyer']));
add('apollos','Titus 3:13','Apollos is named as traveling with Zenas and needing support for the journey.');

// Philemon.
add('saul-paul','Philemon 1–25','Paul names himself as prisoner of Christ Jesus and addresses Philemon and his house church concerning Onesimus.');
add('timothy','Philemon 1','Timothy is named as Paul’s brother and co-sender.');
put(R('philemon','Philemon','Colossae / house church','Believer / householder','male',[],[],'Philemon 1–25','Beloved coworker addressed by Paul; a church meets in the addressed household. Onesimus is presented as belonging to Philemon’s household in a master/servant relationship, not as a biological relative.','explicit',['Philemon']));
put(R('apphia','Apphia','Colossae / house church','Believer','female',[],[],'Philemon 2','Beloved “sister” addressed with Philemon and Archippus. A marital relationship to Philemon is often proposed but is not explicitly stated in the letter.','explicit',['Apphia']));
add('archippus','Philemon 2','Archippus is called Paul’s fellow soldier and is addressed with Philemon and Apphia; no family relationship is explicitly stated.');
add('onesimus','Philemon 10–21','Onesimus is called Paul’s child in the faith and is sent back to Philemon no longer merely as a slave but as a beloved brother.',{connections:[C('household / former master-servant relationship','philemon','Philemon 10–21','The letter clearly places Onesimus in a prior servant/slave relationship to Philemon without making them biological family.')]});
add('epaphras','Philemon 23','Epaphras is named as Paul’s fellow prisoner.');
add('mark-barnabas-cousin','Philemon 24','Mark is named among Paul’s fellow workers.');
add('aristarchus','Philemon 24','Aristarchus is named among Paul’s fellow workers.');
add('demas','Philemon 24','Demas is named among Paul’s fellow workers at this point in the correspondence.');
add('luke-physician','Philemon 24','Luke is named among Paul’s fellow workers.');

db.scope='Genesis–Philemon';db.phase=13;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon'])];
})();