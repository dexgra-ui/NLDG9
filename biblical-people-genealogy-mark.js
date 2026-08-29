(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Mark 1: opening names and first disciples.
add('jesus','Mark 1:1–16:20','Jesus Christ is the central person of Mark’s Gospel.');
add('john-baptist','Mark 1:4–14; 2:18; 6:14–29; 8:28; 11:30–33','John the Baptist prepares the way, baptizes, is imprisoned, and is later executed by Herod.');
addAny(['isaiah'],'Mark 1:2–3; 7:6','Mark explicitly names Isaiah in prophetic citation language; Mark 1 combines prophetic material while attributing the citation heading to Isaiah in the dominant modern text tradition.');
add('simon-peter','Mark 1:16–18,29–36; 3:16; 5:37; 8:29–33; 9:2–5; 10:28; 11:21; 13:3; 14:29–72; 16:7','Simon/Peter is one of the first disciples called and a leading member of the Twelve.');
add('andrew-apostle','Mark 1:16–18,29; 3:18; 13:3','Andrew is Simon Peter’s brother and one of the Twelve.');
add('zebedee','Mark 1:19–20; 3:17; 10:35','Zebedee is explicitly named as father of James and John.');
add('james-zebedee','Mark 1:19–20,29; 3:17; 5:37; 9:2; 10:35–41; 13:3; 14:33','James son of Zebedee is one of the Twelve.');
add('john-zebedee','Mark 1:19–20,29; 3:17; 5:37; 9:2; 10:35–41; 13:3; 14:33','John son of Zebedee is one of the Twelve.');

// Mark 2–3: Levi and the apostolic list.
put(R('alphaeus-levi-mark','Alphaeus','Mark / Levi family','Person','male',[],[],'Mark 2:14','Father of Levi the tax collector. The Gospel does not say this Alphaeus is the father of James son of Alphaeus, so the two Alphaeus records remain separate.','unresolved identification',['Alphaeus father of Levi']));
put(R('levi-alphaeus-mark','Levi','Mark / disciples','Tax collector / disciple','male',['alphaeus-levi-mark'],[],'Mark 2:14–17','Tax collector son of Alphaeus whom Jesus calls. Christian tradition often identifies Levi with Matthew, but Mark does not explicitly make that identification; the records therefore remain linked as possible rather than silently merged.','unresolved identification',['Levi son of Alphaeus'],[C('possible identity','matthew-apostle','Mark 2:14; Matthew 9:9','Parallel calling accounts are commonly harmonized as the same disciple, but the Gospels use different names and do not explicitly state the equivalence.') ]));
addAny(['david'],'Mark 2:25–26; 11:10; 12:35–37','David is explicitly named in Sabbath teaching and messianic discussion.');
put(R('abiathar','Abiathar','Priestly house / David reference','High priest','male',[],[],'Mark 2:26','Named by Jesus in the David-and-showbread reference. Old Testament narratives associate the incident with Ahimelech while Abiathar belongs to the same priestly period; the Gospel wording is preserved without rewriting it.','explicit',['Abiathar the high priest']));
add('philip-apostle','Mark 3:18','Philip is named among the Twelve.');
add('bartholomew','Mark 3:18','Bartholomew is named among the Twelve.');
add('matthew-apostle','Mark 3:18','Matthew is named among the Twelve; Mark does not explicitly say Matthew is Levi son of Alphaeus.');
add('thomas-apostle','Mark 3:18','Thomas is named among the Twelve.');
add('alphaeus-james','Mark 3:18','Alphaeus is named as father of James the apostle.');
add('james-alphaeus','Mark 3:18','James son of Alphaeus is named among the Twelve.');
add('thaddaeus','Mark 3:18','Thaddaeus is named among the Twelve.');
add('simon-zealot','Mark 3:18','Simon the Cananaean/Zealot is named among the Twelve.');
add('judas-iscariot','Mark 3:19; 14:10–45','Judas Iscariot is named among the Twelve and later betrays Jesus.');
add('james-zebedee','Mark 3:17','Jesus gives James and John the collective nickname Boanerges, “sons of thunder.”',{aliases:['Boanerges (with John)']});
add('john-zebedee','Mark 3:17','Jesus gives James and John the collective nickname Boanerges, “sons of thunder.”',{aliases:['Boanerges (with James)']});

// Mark 5: Jairus.
put(R('jairus','Jairus','Jesus ministry / Galilee','Synagogue ruler','male',[],[],'Mark 5:22–43','Named synagogue ruler who asks Jesus to heal his daughter. His daughter is restored to life but is not personally named in Mark.','explicit',['Jairus']));

// Mark 6: Jesus’ family and Herod’s court.
add('mary-mother-jesus','Mark 6:3','Jesus is explicitly called the son of Mary.');
add('james-brother-jesus','Mark 6:3','James is explicitly named as Jesus’ brother.');
add('joseph-brother-jesus','Mark 6:3','Mark uses the form Joses for this named brother of Jesus.',{aliases:['Joses']});
add('judas-brother-jesus','Mark 6:3','Judas is explicitly named as Jesus’ brother.');
add('simon-brother-jesus','Mark 6:3','Simon is explicitly named as Jesus’ brother.');
add('herod-antipas','Mark 6:14–29; 8:15','Mark calls the ruler Herod/King Herod in the John the Baptist narrative; this is the same Herodian ruler called tetrarch in Matthew.');
add('herodias','Mark 6:17–29','Herodias is named in John the Baptist’s imprisonment and death narrative.');
add('philip-herod-brother','Mark 6:17','Philip is explicitly named as Herod’s brother and Herodias’s husband.');

// Mark 7–13: Scripture figures and Bartimaeus.
addAny(['isaiah'],'Mark 7:6','Isaiah is explicitly named in Jesus’ quotation about hypocritical worship.');
add('john-baptist','Mark 8:28','John the Baptist is named among the crowd’s proposed identities for Jesus.');
addAny(['elijah'],'Mark 8:28; 9:4–13; 15:35–36','Elijah is explicitly named in discussion, the transfiguration, and crucifixion crowd remarks.');
addAny(['moses'],'Mark 9:4–5; 10:3–4; 12:19,26','Moses is explicitly named in the transfiguration and later teaching disputes.');
put(R('timaeus','Timaeus','Jesus ministry / Jericho','Person','male',[],[],'Mark 10:46','Father of Bartimaeus.'));
put(R('bartimaeus','Bartimaeus','Jesus ministry / Jericho','Person healed by Jesus','male',['timaeus'],[],'Mark 10:46–52','Blind beggar explicitly identified as Bartimaeus, son of Timaeus, who calls Jesus Son of David and follows him after receiving sight.','explicit',['Bartimaeus son of Timaeus']));
addAny(['abram'],'Mark 12:26','Abraham is explicitly named in Jesus’ resurrection argument.',{aliases:['Abraham']});
addAny(['isaac'],'Mark 12:26','Isaac is explicitly named in Jesus’ resurrection argument.');
addAny(['jacob'],'Mark 12:26','Jacob is explicitly named in Jesus’ resurrection argument.');
// Some later manuscript traditions of Mark 13:14 explicitly add “spoken of by Daniel the prophet”; many modern critical texts do not. Daniel is not treated as a newly certain Mark-name on that variant alone.

// Mark 14–16: passion, burial, and resurrection witnesses.
put(R('pilate','Pilate','Roman rule / Jesus trial','Governor / ruler','male',[],[],'Mark 15:1–15,43–45','Pilate conducts the Roman hearing and hands Jesus over for crucifixion.'));
add('barabbas','Mark 15:7–15','Barabbas is the prisoner released instead of Jesus.');
add('simon-cyrene','Mark 15:21','Simon of Cyrene is compelled to carry Jesus’ cross.');
put(R('alexander-simon-cyrene','Alexander','Simon of Cyrene family','Person','male',['simon-cyrene'],[],'Mark 15:21','Son of Simon of Cyrene. Mark uniquely names Alexander and his brother Rufus.','explicit',['Alexander son of Simon of Cyrene'],[C('brother','rufus-simon-cyrene','Mark 15:21')]));
put(R('rufus-simon-cyrene','Rufus','Simon of Cyrene family','Person','male',['simon-cyrene'],[],'Mark 15:21','Son of Simon of Cyrene and brother of Alexander. Identification with Rufus in Romans 16:13 is possible but not forced.','unresolved identification',['Rufus son of Simon of Cyrene'],[C('brother','alexander-simon-cyrene','Mark 15:21')]));
add('mary-magdalene','Mark 15:40,47; 16:1,9','Mary Magdalene is named at the crucifixion, burial, and resurrection narrative.');
add('mary-james-joseph-matt27','Mark 15:40,47; 16:1','Mark names Mary as mother of James the younger and Joses/Joseph; the parallel setting strongly supports the same woman as Matthew’s Mary mother of James and Joseph.',{aliases:['Mary mother of James the younger and Joses']});
add('james-mary-matt27','Mark 15:40','Mark specifies James as “the younger/little” in the identification of his mother Mary.',{aliases:['James the younger','James the less']});
add('joseph-mary-matt27','Mark 15:40,47','Mark uses the form Joses for the son of Mary at the crucifixion/burial.',{aliases:['Joses']});
put(R('salome-disciple','Salome','Jesus ministry / resurrection witnesses','Disciple / witness','female',[],[],'Mark 15:40; 16:1','Named woman who witnesses the crucifixion and later comes to the tomb with spices. Matthew’s parallel list names “the mother of the sons of Zebedee” where Mark names Salome, making that identification probable but not explicitly stated.','probable',['Salome'],[C('probable identity','mother-zebedee-sons-unnamed','Matthew 27:56; Mark 15:40','Parallel witness lists strongly suggest Salome is the mother of James and John, but neither verse directly states the equivalence.') ]));
add('joseph-arimathea','Mark 15:43–46','Joseph of Arimathea, a respected council member waiting for God’s kingdom, asks Pilate for Jesus’ body and buries him.');

// The longer ending of Mark includes named Mary Magdalene but no additional human personal names. Text-critical questions about Mark 16:9–20 belong to textual notes, not invented identities.
db.scope='Genesis–Mark';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Mark'])];
})();