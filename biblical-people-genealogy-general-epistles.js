(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Hebrews. The human author is not named in the text, so no author identity is invented.
add('jesus','Hebrews 1:1–13:25','Jesus is named and presented throughout Hebrews as Son, high priest, mediator, and pioneer/perfecter of faith.');
addAny(['moses'],'Hebrews 3:2–5,16; 7:14; 9:19; 10:28; 11:23–29; 12:21','Moses is explicitly named repeatedly in Hebrews.');
addAny(['aaron'],'Hebrews 5:4; 7:11; 9:4','Aaron is explicitly named in priestly comparison.');
addAny(['melchizedek'],'Hebrews 5:6,10; 6:20; 7:1–17','Melchizedek is explicitly named and interpreted as king of Salem and priest of God Most High. Hebrews’ “without father or mother, without genealogy” language is part of the literary-theological comparison; the database does not invent parents or treat it as proof of a nonhuman identity.');
addAny(['abram'],'Hebrews 2:16; 6:13; 7:1–9; 11:8–19','Abraham is repeatedly named in covenant and faith examples.',{aliases:['Abraham']});
addAny(['levi'],'Hebrews 7:5,9','Levi is explicitly named in the priestly descent argument.');
addAny(['david'],'Hebrews 4:7; 11:32','David is explicitly named in the Psalm attribution and faith roll call.');
addAny(['joshua'],'Hebrews 4:8','Joshua is explicitly named in many modern translations; older English tradition may render the Greek Iēsous as Jesus. The reference is Joshua son of Nun in the land-rest context.',{aliases:['Joshua','Jesus in older KJV wording at Hebrews 4:8']});
addAny(['esau'],'Hebrews 12:16','Esau is explicitly named as an example of godlessness/profanity.');
addAny(['abel'],'Hebrews 11:4; 12:24','Abel is explicitly named in the faith roll call and blood comparison.');
addAny(['enoch-sethite'],'Hebrews 11:5','Enoch is explicitly named as one taken without seeing death.');
addAny(['noah'],'Hebrews 11:7','Noah is explicitly named in the faith roll call.');
addAny(['sarah'],'Hebrews 11:11','Sarah is explicitly named in the promise/faith example; some textual/translation traditions differ on whether Abraham or Sarah is the grammatical subject of the verse, but Sarah is named.');
addAny(['isaac'],'Hebrews 11:9,17–20','Isaac is explicitly named in the faith roll call.');
addAny(['jacob'],'Hebrews 11:9,20–21','Jacob is explicitly named in the faith roll call.');
addAny(['joseph'],'Hebrews 11:21–22','Joseph is explicitly named in the faith roll call.');
addAny(['rahab'],'Hebrews 11:31','Rahab is explicitly named in the faith roll call.');
addAny(['gideon'],'Hebrews 11:32','Gideon is explicitly named in the faith roll call.');
addAny(['barak'],'Hebrews 11:32','Barak is explicitly named in the faith roll call.');
addAny(['samson'],'Hebrews 11:32','Samson is explicitly named in the faith roll call.');
addAny(['jephthah'],'Hebrews 11:32','Jephthah is explicitly named in the faith roll call.');
addAny(['samuel'],'Hebrews 11:32','Samuel is explicitly named in the faith roll call.');

// James. The author names himself James but gives no family title; identity with James the Lord’s brother is traditional and probable, not stated by the letter itself.
put(R('james-epistle','James','General Epistles','Servant / letter sender','male',[],[],'James 1:1','Sender who identifies himself as a servant of God and of the Lord Jesus Christ. The letter does not say “brother of Jesus,” so identity with James the Lord’s brother/Jerusalem leader remains a probable historical identification rather than a direct statement of James 1:1.','probable',['James author of the Epistle'],[C('probable identity','james-brother-jesus','James 1:1; Galatians 1:19','Early church tradition and leadership context strongly support the identification, but the letter itself omits the family relationship.') ]));
addAny(['abram'],'James 2:21–23','Abraham is explicitly named as an example of faith shown by works.',{aliases:['Abraham']});
addAny(['isaac'],'James 2:21','Isaac is explicitly named as Abraham’s son in the offering example.');
addAny(['rahab'],'James 2:25','Rahab is explicitly named as an example whose actions demonstrate faith.');
addAny(['job'],'James 5:11','Job is explicitly named as an example of steadfastness.');
addAny(['elijah'],'James 5:17','Elijah is explicitly named as a human example of prayer.');

// 1 Peter.
add('simon-peter','1 Peter 1:1–5:14','Peter names himself as apostle of Jesus Christ and sender of the letter.');
addAny(['sarah'],'1 Peter 3:6','Sarah is explicitly named as an example of holy women, obeying Abraham.');
addAny(['abram'],'1 Peter 3:6','Abraham is explicitly named as Sarah’s husband/master in the example.',{aliases:['Abraham']});
addAny(['noah'],'1 Peter 3:20','Noah is explicitly named in the flood/baptism comparison.');
add('silvanus','1 Peter 5:12','Silvanus is named as a faithful brother through whom Peter says he has written briefly. Identity with Silas of Acts remains probable, not explicitly declared here.');
put(R('mark-1peter','Mark','Petrine network','Believer / spiritual child','male',[],[],'1 Peter 5:13','Mark sends greetings and is called Peter’s “son,” a common spiritual/familial ministry designation. Very likely connected with John Mark/Mark of Paul’s network, but 1 Peter gives no second name or Barnabas relationship.','probable',['Mark in 1 Peter'],[C('probable identity','john-mark','1 Peter 5:13; Acts 12:12,25','Early Christian tradition and ministry networks support the identification, but Scripture does not explicitly equate the references.'),C('probable identity','mark-barnabas-cousin','1 Peter 5:13; Colossians 4:10','Likely the same Mark, but no explicit cross-letter statement.') ]));

// 2 Peter.
add('simon-peter','2 Peter 1:1–3:18','The sender identifies himself as Simon Peter, servant and apostle of Jesus Christ.');
addAny(['noah'],'2 Peter 2:5','Noah is explicitly named as a preacher/herald of righteousness in the flood example.');
addAny(['lot'],'2 Peter 2:7','Lot is explicitly named as a righteous man rescued from Sodom.');
addAny(['balaam'],'2 Peter 2:15–16','Balaam is explicitly named in the false-teacher comparison.');
addAny(['beor-balaam'],'2 Peter 2:15','Many translations/texts call Balaam son of Beor; manuscript traditions also preserve Bosor in this verse.',{aliases:['Beor','Bosor textual form']});
add('saul-paul','2 Peter 3:15','Paul is explicitly named as “our beloved brother Paul” whose letters are known to the recipients.');

// 1 John. The letter never names its human sender, so “John” is not inserted as an explicit author record.
add('jesus','1 John 1:1–5:20','Jesus Christ is explicitly named and central throughout 1 John.');
addAny(['cain'],'1 John 3:12','Cain is explicitly named as a negative example who murdered his brother.');

// 2 John. The sender calls himself “the elder” and the recipient is “the elect lady and her children”; neither receives an invented personal name.
add('jesus','2 John 3,7,9','Jesus Christ is explicitly named in the letter.');

// 3 John.
put(R('gaius-3john','Gaius','General Epistles / 3 John','Believer / recipient','male',[],[],'3 John 1–8','Beloved recipient commended for walking in truth and showing hospitality to traveling believers. Several New Testament men are named Gaius; 3 John does not identify which, so this record remains distinct.','unresolved identification',['Gaius of 3 John']));
put(R('diotrephes','Diotrephes','General Epistles / 3 John','Church leader / opponent','male',[],[],'3 John 9–10','Man who loves preeminence, refuses the elder’s authority, and puts hospitable believers out of the church.','explicit',['Diotrephes']));
put(R('demetrius-3john','Demetrius','General Epistles / 3 John','Believer / commended person','male',[],[],'3 John 12','Man who has a good testimony from everyone and from the truth itself. Distinct from Demetrius the silversmith in Acts 19 unless Scripture connects them.','explicit',['Demetrius in 3 John']));

// Jude.
put(R('jude-epistle','Jude / Judas','General Epistles','Servant / letter sender','male',[],[],'Jude 1','Sender who calls himself a servant of Jesus Christ and brother of James. He is commonly identified with Judas/Jude the brother of Jesus because the Gospels name brothers James and Judas together, but Jude does not call himself Jesus’ brother.','probable',['Jude','Judas'],[C('brother','james-epistle','Jude 1','Jude explicitly says he is brother of James, but the letter does not further identify which James.'),C('probable identity','judas-brother-jesus','Jude 1; Matthew 13:55; Mark 6:3','The pairing of brothers James and Judas/Jude strongly supports the traditional identification, but Jude itself does not state it.') ]));
addAny(['moses'],'Jude 9','Moses is explicitly named in the reference to his body.');
addAny(['cain'],'Jude 11','Cain is explicitly named in the warning examples.');
addAny(['balaam'],'Jude 11','Balaam is explicitly named in the warning examples.');
addAny(['korah'],'Jude 11','Korah is explicitly named in the warning examples.');
addAny(['enoch-sethite'],'Jude 14','Enoch, seventh from Adam, is explicitly named in Jude’s quotation/tradition.');
addAny(['adam'],'Jude 14','Adam is explicitly named in the ancestry description of Enoch.');

// Michael in Jude 9 is an archangel, not a human person, and is outside the human genealogy database.
db.scope='Genesis–Jude';db.phase=13;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude'])];
})();