(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Acts 13: Antioch leaders and Cyprus.
add('barnabas','Acts 13:1–14:28; 15:1–39','Barnabas is named among the prophets and teachers at Antioch and becomes Paul’s principal partner on the first missionary journey.');
put(R('simeon-niger','Simeon called Niger','Antioch church','Prophet / teacher','male',[],[],'Acts 13:1','Named among the prophets and teachers in Antioch. Distinct from Simon Peter and other Simons/Simeons.','explicit',['Simeon Niger','Simon Niger']));
put(R('lucius-cyrene','Lucius','Antioch church','Prophet / teacher','male',[],[],'Acts 13:1','Man of Cyrene named among the prophets and teachers at Antioch. Distinct from Lucius named in Romans unless later evidence establishes identity.','unresolved identification',['Lucius of Cyrene']));
put(R('manaen','Manaen','Antioch church / Herodian connection','Prophet / teacher','male',[],[],'Acts 13:1','Named among the Antioch prophets and teachers; described as having been brought up with Herod the tetrarch. The Greek relationship term can indicate a foster-brother/court-companion upbringing and is not converted into biological brotherhood.','explicit',['Manaen'],[C('brought up with / court companion','herod-antipas','Acts 13:1')]));
add('saul-paul','Acts 13:1–52','Acts 13:9 explicitly states that Saul was also called Paul, after which Acts normally uses Paul.');
add('herod-antipas','Acts 13:1','Herod the tetrarch is named through Manaen’s upbringing connection.');
add('john-mark','Acts 13:5,13','John Mark accompanies Barnabas and Saul as an assistant, then leaves the mission at Perga.');
put(R('bar-jesus-elymas','Bar-Jesus / Elymas','Cyprus / Acts 13','Magician / false prophet','male',[],[],'Acts 13:6–12','Jewish magician and false prophet attached to the proconsul Sergius Paulus. Acts identifies Bar-Jesus and Elymas as the same person; Elymas is explained as “the magician.”','explicit',['Bar-Jesus','Elymas']));
put(R('sergius-paulus','Sergius Paulus','Cyprus / Roman administration','Proconsul','male',[],[],'Acts 13:7–12','Proconsul of Cyprus who summons Barnabas and Saul and believes after witnessing the confrontation with Elymas.','explicit',['Sergius Paulus']));

// Named figures in Paul’s Pisidian Antioch sermon.
addAny(['samuel'],'Acts 13:20','Samuel is explicitly named as the prophet at the transition to Israel’s kings.');
addAny(['saul'],'Acts 13:21','Saul son of Kish, king of Israel, is explicitly named in Paul’s sermon.');
addAny(['kish'],'Acts 13:21','Kish is explicitly named as father of King Saul.');
addAny(['david'],'Acts 13:22,34,36','David is explicitly named throughout Paul’s sermon.');
addAny(['jesse'],'Acts 13:22','Jesse is explicitly named in the description of David son of Jesse.');
add('john-baptist','Acts 13:24–25','John is explicitly named as the preacher of repentance before Jesus’ coming.');

// Acts 15: Jerusalem council and missionary separation.
put(R('james-jerusalem','James','Jerusalem church / Acts','Church leader','male',[],[],'Acts 12:17; 15:13–21; 21:18','Prominent Jerusalem church leader to whom Peter sends word and who gives the concluding judgment at the Jerusalem council. He is strongly and traditionally identified with James the brother of Jesus, but Acts itself does not attach the family designation, so the identity remains labeled until the Epistles are audited.','probable',['James of Jerusalem'],[C('probable identity','james-brother-jesus','Acts 12:17; 15:13; 21:18; Galatians 1:19','The early-church leadership role aligns with James the Lord’s brother, but Acts alone does not say “brother of Jesus.”')]));
put(R('judas-barsabbas','Judas Barsabbas','Jerusalem church','Leader / prophet','male',[],[],'Acts 15:22,27,32','Leading man and prophet sent with Silas to Antioch after the Jerusalem council. Distinct from Joseph Barsabbas/Justus; the shared surname does not prove a family relationship.','explicit',['Judas called Barsabbas']));
put(R('silas','Silas','Early church / mission','Prophet / missionary associate','male',[],[],'Acts 15:22–40; 16–18','Leading Jerusalem believer and prophet sent to Antioch, then missionary partner of Paul. Later Epistles use the form Silvanus, a likely identity to be reconciled when those books are audited.','unresolved identification',['Silas','Silvanus?']));
add('john-mark','Acts 15:37–39','Barnabas wants to take John Mark; Paul objects because Mark had withdrawn from the earlier work, and Barnabas departs with Mark.');

// Acts 16: Timothy and Lydia.
put(R('timothy','Timothy','Pauline mission','Disciple / missionary associate','male',[],[],'Acts 16:1–5; 17:14–15; 18:5; 19:22; 20:4','Disciple from Lystra with a believing Jewish mother and Greek father; becomes a major missionary associate of Paul. Acts does not name his parents.','explicit',['Timothy','Timotheus']));
put(R('lydia','Lydia','Philippi church','Merchant / believer','female',[],[],'Acts 16:14–15,40','Seller of purple goods from Thyatira whose heart is opened to Paul’s message; she and her household are baptized and she hosts the missionaries.','explicit',['Lydia of Thyatira']));
add('silas','Acts 16:19–40','Silas is imprisoned with Paul at Philippi and participates in the mission.');

// Acts 17: Thessalonica and Athens.
put(R('jason-thessalonica','Jason','Thessalonica church','Host / believer','male',[],[],'Acts 17:5–9','Host associated with Paul and Silas in Thessalonica whose house is attacked and who is brought before the city authorities. Distinct from other men named Jason.','explicit',['Jason of Thessalonica']));
put(R('dionysius-areopagite','Dionysius','Athens church','Believer / Areopagite','male',[],[],'Acts 17:34','Member of the Areopagus who believes Paul’s message.','explicit',['Dionysius the Areopagite']));
put(R('damaris','Damaris','Athens church','Believer','female',[],[],'Acts 17:34','Woman named among those in Athens who believe after Paul’s Areopagus speech.','explicit',['Damaris']));

// Acts 18: Corinth, Aquila and Priscilla, Gallio, and Apollos.
put(R('aquila','Aquila','Pauline mission / Corinth','Tentmaker / missionary associate','male',[],['priscilla'],'Acts 18:2–3,18,26','Jew from Pontus who had recently come from Italy after Claudius’s decree; husband of Priscilla and coworker with Paul.','explicit',['Aquila']));
put(R('priscilla','Priscilla / Prisca','Pauline mission / Corinth','Missionary associate','female',[],['aquila'],'Acts 18:2,18,26','Wife of Aquila and coworker in ministry; she and Aquila instruct Apollos more accurately in the way of God. Later Epistles often use the shorter form Prisca.','textual variant',['Priscilla','Prisca']));
add('claudius','Acts 18:2','Claudius is explicitly named as the emperor who ordered Jews to leave Rome.');
put(R('titius-justus','Titius Justus','Corinth church','God-fearer / host','male',[],[],'Acts 18:7','Worshiper of God whose house next to the synagogue becomes a base for Paul’s ministry. Manuscript traditions vary between Justus and Titius Justus.','textual variant',['Titius Justus','Justus']));
put(R('crispus','Crispus','Corinth church','Synagogue ruler / believer','male',[],[],'Acts 18:8','Synagogue ruler in Corinth who believes in the Lord with his household.','explicit',['Crispus']));
put(R('gallio','Gallio','Achaia / Roman administration','Proconsul','male',[],[],'Acts 18:12–17','Proconsul of Achaia who refuses to adjudicate the Jewish religious dispute against Paul.','explicit',['Gallio']));
put(R('sosthenes','Sosthenes','Corinth / synagogue','Synagogue ruler','male',[],[],'Acts 18:17','Synagogue ruler beaten in front of Gallio’s tribunal. Possible identity with Sosthenes named with Paul in 1 Corinthians 1:1 will remain open until that Epistle is audited.','unresolved identification',['Sosthenes']));
put(R('apollos','Apollos','Early church / teaching mission','Teacher / evangelist','male',[],[],'Acts 18:24–28; 19:1','Jew from Alexandria, eloquent and competent in the Scriptures; instructed more accurately by Priscilla and Aquila and later ministers in Achaia.','explicit',['Apollos']));
add('john-baptist','Acts 18:25; 19:3–4','John’s baptism is explicitly named in the teaching surrounding Apollos and the Ephesian disciples.');

// Acts 19: Ephesus and companions.
put(R('sceva','Sceva','Ephesus / Acts 19','Jewish chief-priest figure','male',[],[],'Acts 19:14','Jewish chief priest named as father of seven sons who attempt to invoke Jesus’ name in exorcism. The sons are not individually named.','explicit',['Sceva']));
put(R('demetrius-silversmith','Demetrius','Ephesus / Acts 19','Silversmith','male',[],[],'Acts 19:24–38','Silversmith who makes silver shrines of Artemis and stirs the Ephesian trade riot against Paul’s mission. Distinct from later men named Demetrius.','explicit',['Demetrius the silversmith']));
put(R('gaius-macedonia','Gaius','Pauline mission / Macedonia','Missionary companion','male',[],[],'Acts 19:29','Macedonian companion of Paul seized with Aristarchus during the Ephesian riot. Kept distinct from Gaius of Derbe in Acts 20:4.','explicit',['Gaius the Macedonian']));
put(R('aristarchus','Aristarchus','Pauline mission','Missionary companion','male',[],[],'Acts 19:29; 20:4; 27:2','Macedonian/Thessalonian companion of Paul seized in Ephesus, later traveling with the mission and on the voyage toward Rome.','explicit',['Aristarchus of Thessalonica']));
put(R('alexander-ephesus','Alexander','Ephesus / Acts 19','Jewish spokesman','male',[],[],'Acts 19:33–34','Jew pushed forward by the Jews to address the Ephesian crowd. Distinct from Alexander of the high-priestly family and other Alexanders.','explicit',['Alexander in Ephesus']));
put(R('erastus','Erastus','Pauline mission','Missionary associate','male',[],[],'Acts 19:22','Associate sent by Paul with Timothy into Macedonia. Possible identification with Erastus in Romans 16:23 and 2 Timothy 4:20 will be assessed later.','unresolved identification',['Erastus']));

// Acts 20: travel companions and Eutychus.
put(R('pyrrhus','Pyrrhus','Sopater family','Person','male',[],[],'Acts 20:4','Father of Sopater in many modern textual traditions; some manuscripts omit the patronymic.','textual variant',['Pyrrhus']));
put(R('sopater','Sopater','Pauline mission','Missionary companion','male',['pyrrhus'],[],'Acts 20:4','Berean companion of Paul, called Sopater son of Pyrrhus in many modern texts. Some manuscript traditions omit “son of Pyrrhus.” Possible identity with Sosipater in Romans 16:21 is not forced.','textual variant',['Sopater of Berea','Sopater son of Pyrrhus','Sosipater?']));
add('aristarchus','Acts 20:4','Aristarchus is named among Paul’s travel companions from Thessalonica.');
put(R('secundus','Secundus','Pauline mission','Missionary companion','male',[],[],'Acts 20:4','Thessalonian companion traveling with Paul.','explicit',['Secundus']));
put(R('gaius-derbe','Gaius','Pauline mission / Derbe','Missionary companion','male',[],[],'Acts 20:4','Companion from Derbe traveling with Paul. Kept distinct from Gaius the Macedonian in Acts 19:29.','explicit',['Gaius of Derbe']));
add('timothy','Acts 20:4','Timothy is named among Paul’s travel companions.');
put(R('tychicus','Tychicus','Pauline mission','Missionary companion','male',[],[],'Acts 20:4','Asian companion traveling with Paul; later Epistles provide additional ministry references.','explicit',['Tychicus']));
put(R('trophimus','Trophimus','Pauline mission','Missionary companion','male',[],[],'Acts 20:4; 21:29','Asian/Ephesian companion traveling with Paul; later seen with Paul in Jerusalem.','explicit',['Trophimus the Ephesian']));
put(R('eutychus','Eutychus','Troas church','Young believer','male',[],[],'Acts 20:9–12','Young man who falls from a third-story window during Paul’s long teaching and is restored alive.','explicit',['Eutychus']));

db.scope='Genesis–Acts 20';db.phase=12;
})();