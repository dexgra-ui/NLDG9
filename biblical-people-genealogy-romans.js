(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

add('saul-paul','Romans 1:1–16:27','Paul names himself as servant of Christ Jesus and apostle, and writes the letter to believers in Rome.');
add('jesus','Romans 1:1–16:27','Jesus Christ is named throughout Romans as the center of Paul’s gospel.');
addAny(['david'],'Romans 1:3; 4:6–8; 11:9','David is explicitly named in Jesus’ ancestry and in Paul’s Scripture arguments.');
addAny(['abram'],'Romans 4:1–25; 9:7; 11:1','Abraham is explicitly named as patriarch and example of faith.',{aliases:['Abraham']});
addAny(['adam'],'Romans 5:14','Adam is explicitly named in Paul’s comparison between Adam and Christ.');
addAny(['moses'],'Romans 5:14; 9:15; 10:5,19','Moses is explicitly named in Paul’s salvation-history arguments.');
addAny(['sarah'],'Romans 9:9','Sarah is explicitly named in the promise concerning Isaac.');
addAny(['isaac'],'Romans 9:7,10','Isaac is explicitly named in Paul’s patriarchal argument.');
addAny(['rebekah'],'Romans 9:10','Rebekah is explicitly named as mother in the Jacob/Esau example.',{aliases:['Rebecca','Rebekah']});
addAny(['jacob'],'Romans 9:13; 11:26','Jacob is explicitly named in patriarchal and collective Israel language.');
addAny(['esau'],'Romans 9:13','Esau is explicitly named in contrast with Jacob.');
addAny(['elijah'],'Romans 11:2','Elijah is explicitly named in Paul’s remnant argument.');

// Romans 16 church network.
put(R('phoebe','Phoebe','Roman church network','Deacon / servant / benefactor','female',[],[],'Romans 16:1–2','Believer commended by Paul as a servant/deacon of the church at Cenchreae and a benefactor/patron of many, including Paul.','explicit',['Phoebe of Cenchreae']));
add('priscilla','Romans 16:3–5','Prisca/Priscilla is greeted with Aquila as Paul’s coworker; the church meets in their house.',{aliases:['Prisca','Priscilla']});
add('aquila','Romans 16:3–5','Aquila is greeted with Prisca as Paul’s coworker; the church meets in their house.');
put(R('epaenetus','Epaenetus','Roman church network','Believer','male',[],[],'Romans 16:5','Beloved of Paul and described as the first convert/firstfruits for Christ in Asia.','explicit',['Epaenetus']));
put(R('mary-romans16','Mary','Roman church network','Believer / worker','female',[],[],'Romans 16:6','Woman greeted by Paul who worked very hard for the Roman believers. Distinct from the several Gospel women named Mary.','explicit',['Mary in Romans 16']));
put(R('andronicus','Andronicus','Roman church network','Believer / fellow prisoner','male',[],[],'Romans 16:7','Paul’s kinsman/fellow Jew and fellow prisoner, named with Junia; they were in Christ before Paul. The phrase concerning the apostles can be rendered “well known to” or “outstanding among” the apostles, so apostolic status is not forced.','textual variant',['Andronicus']));
put(R('junia','Junia','Roman church network','Believer / fellow prisoner','female',[],[],'Romans 16:7','Named with Andronicus as Paul’s kinswoman/fellow Jew and fellow prisoner, in Christ before Paul. Most modern scholarship and translations read the feminine name Junia; older traditions sometimes used Junias. The phrase concerning apostles is translation-sensitive.','textual variant',['Junia','Junias in older tradition']));
put(R('ampliatus','Ampliatus','Roman church network','Believer','male',[],[],'Romans 16:8','Beloved in the Lord greeted by Paul.','explicit',['Ampliatus','Amplias']));
put(R('urbanus','Urbanus','Roman church network','Believer / coworker','male',[],[],'Romans 16:9','Coworker in Christ greeted by Paul.','explicit',['Urbanus','Urbane']));
put(R('stachys','Stachys','Roman church network','Believer','male',[],[],'Romans 16:9','Beloved believer greeted by Paul.','explicit',['Stachys']));
put(R('apelles','Apelles','Roman church network','Believer','male',[],[],'Romans 16:10','Believer approved/tested in Christ greeted by Paul.','explicit',['Apelles']));
put(R('aristobulus-romans','Aristobulus','Roman church network','Household-name figure','male',[],[],'Romans 16:10','Paul greets those belonging to the household of Aristobulus. Aristobulus himself is named as the household reference, but the verse does not explicitly say he is present or a believer.','explicit',['Aristobulus household']));
put(R('herodion','Herodion','Roman church network','Believer / kinsman','male',[],[],'Romans 16:11','Paul’s kinsman/fellow Jew greeted in Rome.','explicit',['Herodion']));
put(R('narcissus-romans','Narcissus','Roman church network','Household-name figure','male',[],[],'Romans 16:11','Paul greets believers “of the household of Narcissus.” Narcissus is named as the household reference; personal faith or presence is not explicitly stated.','explicit',['Narcissus household']));
put(R('tryphaena','Tryphaena','Roman church network','Believer / worker','female',[],[],'Romans 16:12','Woman greeted as a worker in the Lord, named alongside Tryphosa.','explicit',['Tryphaena']));
put(R('tryphosa','Tryphosa','Roman church network','Believer / worker','female',[],[],'Romans 16:12','Woman greeted as a worker in the Lord, named alongside Tryphaena.','explicit',['Tryphosa']));
put(R('persis','Persis','Roman church network','Believer / worker','female',[],[],'Romans 16:12','Beloved woman who worked hard in the Lord.','explicit',['Persis']));
put(R('rufus-romans','Rufus','Roman church network','Believer','male',[],[],'Romans 16:13','Believer chosen/distinguished in the Lord. His mother is also called a mother to Paul but is not personally named. Possible identity with Rufus son of Simon of Cyrene in Mark 15:21 remains unproven.','unresolved identification',['Rufus in Romans'],[C('possible identity','rufus-simon-cyrene','Romans 16:13; Mark 15:21','The shared uncommon name makes the identification possible, but Scripture does not explicitly connect the two records.') ]));
put(R('asyncritus','Asyncritus','Roman church network','Believer','male',[],[],'Romans 16:14','Named in a group of Roman believers greeted by Paul.','explicit',['Asyncritus']));
put(R('phlegon','Phlegon','Roman church network','Believer','male',[],[],'Romans 16:14','Named in a group of Roman believers greeted by Paul.','explicit',['Phlegon']));
put(R('hermes','Hermes','Roman church network','Believer','male',[],[],'Romans 16:14','Named in a group of Roman believers greeted by Paul. Distinct from the Greek deity Hermes mentioned as a title applied to Paul in Acts 14.','explicit',['Hermes in Romans 16']));
put(R('patrobas','Patrobas','Roman church network','Believer','male',[],[],'Romans 16:14','Named in a group of Roman believers greeted by Paul.','explicit',['Patrobas']));
put(R('hermas','Hermas','Roman church network','Believer','male',[],[],'Romans 16:14','Named in a group of Roman believers greeted by Paul.','explicit',['Hermas']));
put(R('philologus','Philologus','Roman church network','Believer','male',[],[],'Romans 16:15','Named among Roman believers greeted by Paul.','explicit',['Philologus']));
put(R('julia-romans','Julia','Roman church network','Believer','female',[],[],'Romans 16:15','Woman named among Roman believers greeted by Paul.','explicit',['Julia']));
put(R('nereus','Nereus','Roman church network','Believer','male',[],[],'Romans 16:15','Believer greeted with his unnamed sister and others. The sister is not given an invented record.','explicit',['Nereus']));
put(R('olympas','Olympas','Roman church network','Believer','male',[],[],'Romans 16:15','Believer greeted with other saints in Rome.','explicit',['Olympas']));

// Romans 16:21–23 senders and coworkers.
add('timothy','Romans 16:21','Timothy is named as Paul’s coworker sending greetings.');
put(R('lucius-romans','Lucius','Pauline network / Romans','Kinsman / believer','male',[],[],'Romans 16:21','Named by Paul as a kinsman/fellow Jew sending greetings. Possible identity with Lucius of Cyrene in Acts 13:1 is not forced.','unresolved identification',['Lucius in Romans 16'],[C('possible identity','lucius-cyrene','Romans 16:21; Acts 13:1')]));
add('jason-thessalonica','Romans 16:21','Jason is named as Paul’s kinsman/fellow Jew sending greetings; possible continuity with Jason of Thessalonica is plausible and retained in the same established record.');
put(R('sosipater','Sosipater','Pauline network / Romans','Kinsman / believer','male',[],[],'Romans 16:21','Named by Paul as a kinsman/fellow Jew sending greetings. Possible identity with Sopater of Berea in Acts 20:4 is not forced.','unresolved identification',['Sosipater'],[C('possible identity','sopater','Romans 16:21; Acts 20:4')]));
put(R('tertius','Tertius','Pauline network / Romans','Scribe / believer','male',[],[],'Romans 16:22','Person who explicitly says he wrote the letter down and sends his own greeting in the Lord.','explicit',['Tertius']));
put(R('gaius-romans','Gaius','Pauline network / Corinth','Host / believer','male',[],[],'Romans 16:23','Host of Paul and of the whole church who sends greetings. Possible identity with Gaius baptized by Paul in 1 Corinthians 1:14 will be reconciled when that book is audited; Acts has more than one Gaius.','unresolved identification',['Gaius host of Paul']));
put(R('erastus-romans','Erastus','Corinth / civic administration','City treasurer / believer','male',[],[],'Romans 16:23','City treasurer who sends greetings. Possible identity with Paul’s associate Erastus in Acts 19:22 is plausible but not explicit.','unresolved identification',['Erastus the city treasurer'],[C('possible identity','erastus','Romans 16:23; Acts 19:22')]));
put(R('quartus','Quartus','Pauline network / Romans','Believer','male',[],[],'Romans 16:23','Believer called “the brother” who sends greetings.','explicit',['Quartus']));

db.scope='Genesis–Romans';db.phase=13;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Romans'])];
})();