(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Acts 1: recipient, apostles, and replacement of Judas.
add('theophilus','Acts 1:1','Acts is explicitly addressed to Theophilus as the continuation of Luke’s first account.');
add('jesus','Acts 1:1–11','Acts opens with the risen Jesus teaching the apostles before his ascension.');
for(const [id,ref] of [['simon-peter','Acts 1:13–26'],['john-zebedee','Acts 1:13'],['james-zebedee','Acts 1:13'],['andrew-apostle','Acts 1:13'],['philip-apostle','Acts 1:13'],['thomas-apostle','Acts 1:13'],['bartholomew','Acts 1:13'],['matthew-apostle','Acts 1:13'],['james-alphaeus','Acts 1:13'],['simon-zealot','Acts 1:13'],['judas-james-apostle','Acts 1:13']])add(id,ref,'Named among the apostolic group gathered in Jerusalem after Jesus’ ascension.');
add('mary-mother-jesus','Acts 1:14','Mary the mother of Jesus is explicitly named among those devoted to prayer. Jesus’ brothers are present but are not individually named in Acts 1.');
add('judas-iscariot','Acts 1:16–20,25','Peter recalls Judas’s betrayal and death while the group seeks a replacement.');
addAny(['david'],'Acts 1:16,20; 2:25–34','David is explicitly named in apostolic interpretation of the Psalms.');
put(R('joseph-barsabbas-justus','Joseph Barsabbas / Justus','Jerusalem church','Candidate / disciple','male',[],[],'Acts 1:23','One of two men proposed to replace Judas Iscariot; called Joseph Barsabbas and surnamed Justus. Distinct from Judas Barsabbas in Acts 15.','explicit',['Joseph called Barsabbas','Justus']));
put(R('matthias','Matthias','Jerusalem church','Apostle / disciple','male',[],[],'Acts 1:23–26','One of the two candidates to replace Judas Iscariot; selected by lot and numbered with the eleven apostles.','explicit',['Matthias']));

// Acts 2–3: prophetic and patriarchal names in apostolic preaching.
addAny(['joel-prophet'],'Acts 2:16','Peter explicitly names Joel as the prophet whose words frame Pentecost.');
addAny(['abram'],'Acts 3:13,25','Abraham is explicitly named in Peter’s temple preaching.',{aliases:['Abraham']});
addAny(['isaac'],'Acts 3:13','Isaac is explicitly named in Peter’s temple preaching.');
addAny(['jacob'],'Acts 3:13','Jacob is explicitly named in Peter’s temple preaching.');
addAny(['moses'],'Acts 3:22','Moses is explicitly named in Peter’s appeal to the prophets.');
addAny(['samuel'],'Acts 3:24','Samuel is explicitly named as beginning a line of prophets who announced these days.');

// Acts 4: high-priestly household and Barnabas.
add('annas','Acts 4:6','Annas is named in the high-priestly group questioning Peter and John.');
add('caiaphas','Acts 4:6','Caiaphas is named in the high-priestly group questioning Peter and John.');
put(R('john-high-priest-family','John','Jerusalem priesthood / Acts 4','High-priestly family member','male',[],[],'Acts 4:6','Named with Annas, Caiaphas, Alexander, and the high-priestly family. Distinct from John the apostle and John the Baptist.','explicit',['John of the high-priestly family']));
put(R('alexander-high-priest-family','Alexander','Jerusalem priesthood / Acts 4','High-priestly family member','male',[],[],'Acts 4:6','Named with the high-priestly family. Distinct from Alexander son of Simon of Cyrene and later Alexanders.','explicit',['Alexander of the high-priestly family']));
put(R('barnabas','Joseph / Barnabas','Early church / mission','Apostle / missionary associate','male',[],[],'Acts 4:36–37; 9:27; 11:22–30; 12:25; 13–15','Levite from Cyprus named Joseph, whom the apostles call Barnabas. He later becomes a major missionary partner and advocate for Saul/Paul.','explicit',['Barnabas','Joseph called Barnabas','son of encouragement'],[C('tribe / descendant of','levi','Acts 4:36')]));

// Acts 5: Ananias, Sapphira, Gamaliel, Theudas, and Judas the Galilean.
put(R('ananias-sapphira','Ananias','Jerusalem church / Acts 5','Church member','male',[],['sapphira'],'Acts 5:1–10','Husband of Sapphira who lies about the proceeds of a property sale and dies after Peter confronts him. Distinct from Ananias of Damascus and Ananias the high priest.','explicit',['Ananias husband of Sapphira']));
put(R('sapphira','Sapphira','Jerusalem church / Acts 5','Church member','female',[],['ananias-sapphira'],'Acts 5:1–10','Wife of Ananias who participates in the deception and later dies after Peter questions her.','explicit',['Sapphira']));
put(R('gamaliel','Gamaliel','Jerusalem / Pharisees','Teacher of the law','male',[],[],'Acts 5:34–40; 22:3','Pharisee and respected teacher of the law who advises restraint toward the apostles; Paul later says he was educated at Gamaliel’s feet.','explicit',['Gamaliel']));
put(R('theudas','Theudas','Judean movements','Leader','male',[],[],'Acts 5:36','Man who claimed significance and gathered followers before being killed; named by Gamaliel as a historical example.','explicit',['Theudas']));
put(R('judas-galilean','Judas the Galilean','Judean movements','Leader','male',[],[],'Acts 5:37','Leader who arose in the days of the census and drew people after him; distinct from the several disciples named Judas.','explicit',['Judas of Galilee']));

// Acts 6–7: the Seven and Stephen’s speech.
put(R('stephen','Stephen','Jerusalem church / Seven','Witness / martyr','male',[],[],'Acts 6:5–15; 7:1–60; 8:2; 11:19; 22:20','One of the Seven, described as full of faith and the Holy Spirit; first named Christian martyr in Acts.','explicit',['Stephen']));
put(R('philip-evangelist','Philip','Jerusalem church / Seven','Evangelist / one of the Seven','male',[],[],'Acts 6:5; 8:4–40; 21:8–9','One of the Seven and later called Philip the evangelist. Distinct from Philip the apostle; Acts 21 explicitly recalls him as one of the Seven.','explicit',['Philip the evangelist','Philip one of the Seven']));
for(const [id,n,note] of [['prochorus','Prochorus','One of the Seven chosen in Acts 6.'],['nicanor','Nicanor','One of the Seven chosen in Acts 6.'],['timon','Timon','One of the Seven chosen in Acts 6.'],['parmenas','Parmenas','One of the Seven chosen in Acts 6.']])put(R(id,n,'Jerusalem church / Seven','One of the Seven','male',[],[],'Acts 6:5',note));
put(R('nicolaus-antioch','Nicolaus','Jerusalem church / Seven','One of the Seven / proselyte','male',[],[],'Acts 6:5','Proselyte from Antioch named among the Seven.','explicit',['Nicolaus of Antioch']));
addAny(['abram'],'Acts 7:2–8','Stephen explicitly names Abraham in Israel’s ancestral story.',{aliases:['Abraham']});
addAny(['isaac'],'Acts 7:8','Isaac is explicitly named in Stephen’s speech.');
addAny(['jacob'],'Acts 7:8,12–15,46','Jacob is explicitly named in Stephen’s speech.');
addAny(['joseph'],'Acts 7:9–18','Joseph son of Jacob is explicitly named throughout Stephen’s Egypt narrative.');
addAny(['moses'],'Acts 7:20–44','Moses is the central named figure in Stephen’s exodus narrative.');
addAny(['aaron'],'Acts 7:40','Aaron is explicitly named in the golden-calf episode.');
addAny(['joshua'],'Acts 7:45','Joshua is explicitly named as the leader who brings the tent into the land; older English forms may read Jesus/Joshua.');
addAny(['david'],'Acts 7:45–46','David is explicitly named in Stephen’s temple-history argument.');
addAny(['solomon'],'Acts 7:47','Solomon is explicitly named as the builder of the house.');
addAny(['hamor'],'Acts 7:16','Hamor is explicitly named in Stephen’s burial-place summary; the wording has known textual/historical compression and is preserved without rewriting the Genesis accounts.');

// Acts 8: Saul, Philip, and Simon the magician.
put(R('saul-paul','Saul / Paul','Early church / mission','Apostle / missionary','male',[],[],'Acts 7:58; 8:1–3; 9:1–30; 11:25–30; 12:25; 13:1–28:31','First introduced as Saul, a persecutor of the church. Acts 13:9 explicitly says “Saul, who was also called Paul,” establishing the two names as one person.','explicit',['Saul','Paul','Paul the apostle']));
put(R('simon-magus','Simon','Samaria / Acts 8','Magician / convert figure','male',[],[],'Acts 8:9–24','Samaritan man who practiced magic, believed and was baptized, then was sharply rebuked by Peter for trying to buy spiritual authority. Distinct from every apostle named Simon.','explicit',['Simon the magician','Simon Magus']));
addAny(['isaiah'],'Acts 8:28–35','The Ethiopian official is explicitly reading Isaiah, and Philip explains the passage.');
// The Ethiopian eunuch and Candace are not entered as personal-name records: the official is unnamed, and Candace/Kandake functions as a royal title rather than a certain personal name.

// Acts 9: Damascus, Lydda, and Joppa.
put(R('ananias-damascus','Ananias','Damascus church','Disciple','male',[],[],'Acts 9:10–19; 22:12–16','Disciple in Damascus sent by the Lord to Saul; later recalled in Paul’s testimony. Distinct from Ananias in Acts 5 and Ananias the high priest.','explicit',['Ananias of Damascus']));
put(R('judas-straight-street','Judas','Damascus / Acts 9','Householder','male',[],[],'Acts 9:11','Man in Damascus whose house on Straight Street is where Saul is staying. Distinct from the many other Judases in the New Testament.','explicit',['Judas of Straight Street']));
put(R('aeneas','Aeneas','Lydda / Jesus mission','Person healed','male',[],[],'Acts 9:33–35','Man in Lydda bedridden for eight years whom Peter heals in the name of Jesus Christ.','explicit',['Aeneas']));
put(R('tabitha-dorcas','Tabitha / Dorcas','Joppa church','Disciple','female',[],[],'Acts 9:36–42','Disciple in Joppa known for good works and charity; her Aramaic name Tabitha is translated Dorcas in Greek. Peter raises her from death.','explicit',['Tabitha','Dorcas']));

// Acts 10: Cornelius and Simon the tanner.
put(R('cornelius','Cornelius','Caesarea / Gentile mission','Centurion','male',[],[],'Acts 10:1–48; 11:1–18','Centurion of the Italian Cohort in Caesarea whose household receives Peter and the Holy Spirit, marking a major Gentile inclusion moment.','explicit',['Cornelius']));
put(R('simon-tanner','Simon','Joppa / Acts 10','Tanner / host','male',[],[],'Acts 9:43; 10:6,17,32','Tanner in Joppa who hosts Simon Peter. Distinct from Simon Peter and other Simons.','explicit',['Simon the tanner']));

// Acts 11: Agabus and Claudius.
put(R('agabus','Agabus','Early church / prophets','Prophet','male',[],[],'Acts 11:28; 21:10–11','Prophet who predicts a severe famine and later symbolically warns Paul about arrest in Jerusalem.','explicit',['Agabus']));
put(R('claudius','Claudius','Roman Empire','Emperor / ruler','male',[],[],'Acts 11:28; 18:2','Roman emperor named in relation to the famine and later the expulsion of Jews from Rome.','explicit',['Claudius Caesar','Claudius']));

// Acts 12: Herod Agrippa I, John Mark, Rhoda, and Blastus.
put(R('herod-agrippa-i','Herod','Herodian dynasty / Acts 12','King / ruler','male',[],[],'Acts 12:1–23','King Herod who kills James son of Zebedee, imprisons Peter, and later dies after accepting divine honors. Historically identified as Herod Agrippa I; Acts itself calls him Herod the king.','explicit',['Herod Agrippa I','Herod the king in Acts 12']));
add('james-zebedee','Acts 12:2','James the brother of John is executed by Herod.');
add('john-zebedee','Acts 12:2','John is named as brother of the James executed by Herod.');
put(R('mary-john-mark','Mary','John Mark family / Jerusalem church','Householder / disciple','female',[],[],'Acts 12:12','Mother of John called Mark; her Jerusalem house is a gathering place for believers praying for Peter. Distinct from the many other women named Mary.','explicit',['Mary mother of John Mark']));
put(R('john-mark','John Mark','Early church / mission','Missionary associate','male',['mary-john-mark'],[],'Acts 12:12,25; 13:5,13; 15:37–39','John whose other name was Mark; son of Mary in Jerusalem and later missionary associate of Barnabas and Paul. Acts does not state his later Gospel authorship, so that traditional identification is not inserted as an explicit fact.','explicit',['John called Mark','Mark']));
put(R('rhoda','Rhoda','Jerusalem church','Servant / believer','female',[],[],'Acts 12:13–15','Servant girl who recognizes Peter’s voice at Mary’s gate and excitedly reports his arrival.','explicit',['Rhoda']));
put(R('blastus','Blastus','Herodian court / Acts 12','Royal chamberlain / official','male',[],[],'Acts 12:20','Trusted chamberlain of Herod through whom representatives of Tyre and Sidon seek peace.','explicit',['Blastus']));

db.scope='Genesis–Acts 12';db.phase=12;
})();