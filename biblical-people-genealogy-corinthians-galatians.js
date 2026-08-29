(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// 1 Corinthians.
add('saul-paul','1 Corinthians 1:1–16:24','Paul names himself as apostle and primary sender of 1 Corinthians.');
put(R('sosthenes-corinthians','Sosthenes','Corinth church / Pauline network','Believer / co-sender','male',[],[],'1 Corinthians 1:1','Called “our brother” and named with Paul as co-sender. Possible identity with Sosthenes the synagogue ruler in Acts 18:17 is plausible but not explicit.','unresolved identification',['Sosthenes our brother'],[C('possible identity','sosthenes','1 Corinthians 1:1; Acts 18:17')]));
put(R('chloe','Chloe','Corinth church network','Household-name believer','female',[],[],'1 Corinthians 1:11','Woman whose people/household report divisions in Corinth to Paul. The individuals “of Chloe” are not named.','explicit',['Chloe']));
add('apollos','1 Corinthians 1:12; 3:4–6,22; 4:6; 16:12','Apollos is repeatedly named as a teacher/worker known to the Corinthian church.');
add('simon-peter','1 Corinthians 1:12; 3:22; 9:5; 15:5','Paul uses the Aramaic name Cephas for Peter in 1 Corinthians.',{aliases:['Cephas']});
add('crispus','1 Corinthians 1:14','Paul explicitly says he baptized Crispus.');
put(R('gaius-corinth','Gaius','Corinth church','Believer','male',[],[],'1 Corinthians 1:14','One of the few people Paul says he personally baptized in Corinth. Strongly compatible with Gaius who hosts Paul in Romans 16:23, but the identity is not explicitly stated.','unresolved identification',['Gaius baptized by Paul'],[C('probable identity','gaius-romans','1 Corinthians 1:14; Romans 16:23')]));
put(R('stephanas','Stephanas','Corinth church','Believer / church worker','male',[],[],'1 Corinthians 1:16; 16:15–18','Paul baptized the household of Stephanas; Stephanas’s household is called the firstfruits of Achaia and devoted to serving the saints.','explicit',['Stephanas']));
add('barnabas','1 Corinthians 9:6','Barnabas is explicitly named with Paul in a discussion of apostolic rights.');
addAny(['moses'],'1 Corinthians 9:9; 10:2','Moses is explicitly named in Paul’s Scripture and wilderness arguments.');
addAny(['adam'],'1 Corinthians 15:22,45','Adam is explicitly named in Paul’s resurrection comparison between the first Adam and Christ.');
add('timothy','1 Corinthians 4:17; 16:10–11','Timothy is Paul’s beloved and faithful child in the Lord, sent to remind the Corinthians of Paul’s ways.');
add('james-jerusalem','1 Corinthians 15:7','James is explicitly named as one of those to whom the risen Jesus appeared. The verse does not attach a family title; connection with the Jerusalem leader and Jesus’ brother is strengthened by Galatians.');
put(R('fortunatus','Fortunatus','Corinth church','Believer / delegate','male',[],[],'1 Corinthians 16:17–18','Named with Stephanas and Achaicus as visitors whose presence refreshes Paul.','explicit',['Fortunatus']));
put(R('achaicus','Achaicus','Corinth church','Believer / delegate','male',[],[],'1 Corinthians 16:17–18','Named with Stephanas and Fortunatus as visitors who refresh Paul.','explicit',['Achaicus']));
add('aquila','1 Corinthians 16:19','Aquila sends greetings with Prisca/Priscilla; a church meets in their house.');
add('priscilla','1 Corinthians 16:19','Prisca/Priscilla sends greetings with Aquila; a church meets in their house.',{aliases:['Prisca','Priscilla']});

// 2 Corinthians.
add('saul-paul','2 Corinthians 1:1–13:14','Paul names himself as apostle and primary sender of 2 Corinthians.');
add('timothy','2 Corinthians 1:1,19','Timothy is named as Paul’s brother/co-sender and as a coworker in preaching Christ.');
addAny(['moses'],'2 Corinthians 3:7,13,15','Moses is explicitly named in Paul’s discussion of the old covenant and veil.');
add('titus','2 Corinthians 2:13; 7:6–16; 8:6,16–24; 12:18','Titus is Paul’s trusted coworker and delegate in the Corinthian mission.');
put(R('titus','Titus','Pauline mission','Missionary associate','male',[],[],'2 Corinthians 2:13; 7:6–16; 8:6,16–24; 12:18','Trusted coworker of Paul, central to communication and collection work with Corinth. Galatians later identifies him as Greek.','explicit',['Titus']));
addAny(['abram'],'2 Corinthians 11:22','Abraham is explicitly named in Paul’s ancestry comparison.',{aliases:['Abraham']});
put(R('aretas','Aretas','Nabatea / Damascus','King / ruler','male',[],[],'2 Corinthians 11:32','King Aretas whose ethnarch/governor guarded Damascus in an attempt to seize Paul. Paul does not give Aretas’s genealogy.','explicit',['King Aretas']));

// Galatians.
add('saul-paul','Galatians 1:1–6:18','Paul names himself as apostle and recounts his calling, Jerusalem contacts, and Gentile mission.');
add('barnabas','Galatians 2:1,9,13','Barnabas accompanies Paul and Titus to Jerusalem and later is drawn into the Antioch separation controversy.');
add('titus','Galatians 2:1–5','Titus accompanies Paul and Barnabas to Jerusalem and is explicitly identified as Greek.');
add('simon-peter','Galatians 1:18; 2:7–14','Paul names Cephas/Peter repeatedly. Galatians 2 uses both Peter and Cephas in the textual tradition, supporting the same established apostolic record.',{aliases:['Cephas','Peter']});
add('john-zebedee','Galatians 2:9','John is named with James and Cephas as reputed pillars. The text does not add a patronymic here, but the apostolic context supports John the apostle while not creating a new John.');
add('james-brother-jesus','Galatians 1:19; 2:9,12','Paul explicitly calls James “the Lord’s brother” and later names James among the Jerusalem pillars. This supplies direct New Testament evidence linking Jesus’ brother James with the Jerusalem leadership role.',{connections:[C('same leadership identity','james-jerusalem','Galatians 1:19; 2:9; Acts 12:17; 15:13; 21:18','Galatians explicitly identifies the prominent Jerusalem James as the Lord’s brother.') ]});
add('james-jerusalem','Galatians 1:19; 2:9,12','Galatians explicitly identifies the prominent Jerusalem James as “the Lord’s brother,” strengthening this record’s identity with James brother of Jesus.',{connections:[C('same leadership identity','james-brother-jesus','Galatians 1:19; 2:9','The same letter calls James the Lord’s brother and later places James among the Jerusalem pillars.')],certainty:'explicit'});
addAny(['abram'],'Galatians 3:6–29; 4:22','Abraham is repeatedly named in Paul’s promise-and-faith argument.',{aliases:['Abraham']});
addAny(['isaac'],'Galatians 4:28','Isaac is explicitly named in the free-child analogy.');
addAny(['hagar'],'Galatians 4:24–25','Hagar is explicitly named in Paul’s allegorical comparison.');

// Galatians mentions “the son of the slave woman” and “the son of the free woman” without personally naming Ishmael or Sarah in that passage, so those names are not imported into Galatians merely from Genesis.
db.scope='Genesis–Galatians';db.phase=13;db.completedBooks=[...new Set([...(db.completedBooks||[]),'1 Corinthians','2 Corinthians','Galatians'])];
})();