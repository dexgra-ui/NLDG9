(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Luke 4: named figures in Jesus’ Nazareth teaching.
addAny(['isaiah'],'Luke 4:17','Jesus reads from the scroll of Isaiah in the Nazareth synagogue.');
addAny(['elijah'],'Luke 4:25–26; 9:8,19,30–33,54','Elijah is explicitly named in Jesus’ Nazareth teaching and later Gospel scenes.');
addAny(['elisha'],'Luke 4:27','Elisha the prophet is explicitly named in Jesus’ Nazareth teaching.');
addAny(['naaman'],'Luke 4:27','Naaman the Syrian is explicitly named in Jesus’ example from Elisha’s ministry.');

// Luke 5–6: disciples and Luke’s apostolic naming variant.
add('simon-peter','Luke 5:3–11; 6:14; 8:45,51; 9:20,28,32–33; 12:41; 18:28; 22:8,31–34,54–62; 24:12,34','Simon Peter is central in Luke’s disciple narratives.');
add('james-zebedee','Luke 5:10; 6:14; 8:51; 9:28,54','James is named with John as a son/partner in Zebedee’s fishing household and among the Twelve.');
add('john-zebedee','Luke 5:10; 6:14; 8:51; 9:28,49,54; 22:8','John is named with James as a son/partner in Zebedee’s fishing household and among the Twelve.');
add('zebedee','Luke 5:10','Zebedee is explicitly named as father of James and John.');
add('levi-alphaeus-mark','Luke 5:27–32','Luke calls the tax collector Levi in the parallel calling narrative. Luke does not name Levi’s father, but the same narrative name supports continuity with Mark’s Levi record.');
add('andrew-apostle','Luke 6:14','Andrew is named among the Twelve.');
add('philip-apostle','Luke 6:14','Philip is named among the Twelve.');
add('bartholomew','Luke 6:14','Bartholomew is named among the Twelve.');
add('matthew-apostle','Luke 6:15','Matthew is named among the Twelve; Luke does not explicitly say Matthew is the Levi called in Luke 5.');
add('thomas-apostle','Luke 6:15','Thomas is named among the Twelve.');
add('james-alphaeus','Luke 6:15','James son of Alphaeus is named among the Twelve.');
add('alphaeus-james','Luke 6:15','Alphaeus is named as father of James.');
add('simon-zealot','Luke 6:15','Simon called the Zealot is named among the Twelve.');
put(R('james-judas-apostle','James','Disciples / apostolic family designation','Person / relation name','male',[],[],'Luke 6:16; Acts 1:13','James is the person from whom the apostle Judas is designated. Greek “Judas of James” is commonly rendered “Judas son of James,” while some older English tradition renders “brother of James,” so the exact relationship label remains visible as a translation issue.','textual variant',['James related to Judas the apostle']));
put(R('judas-james-apostle','Judas','Disciples / apostles','Apostle / disciple','male',[],[],'Luke 6:16; Acts 1:13','One of the Twelve, designated “Judas of James.” Commonly understood as Judas son of James; older English tradition may say brother of James. He is commonly identified with Thaddaeus in Matthew/Mark, but the Synoptic lists do not explicitly state the equivalence.','textual variant',['Judas son of James','Judas brother of James'],[C('relationship designation','james-judas-apostle','Luke 6:16','Greek allows a genitive family designation; most modern translations supply “son of.”'),C('probable identity','thaddaeus','Matthew 10:3; Mark 3:18; Luke 6:16','The position in the apostolic lists strongly supports the traditional identification, but the Gospels do not explicitly say the two names belong to one person.') ]));
add('judas-iscariot','Luke 6:16; 22:3,47–48','Judas Iscariot is named as the apostle who becomes a traitor.');

// Luke 7–9: named followers and Herodian setting.
add('john-baptist','Luke 7:18–35; 9:7,9,19','John the Baptist is central to Jesus’ teaching and Herod’s questions.');
add('mary-magdalene','Luke 8:2; 24:10','Mary called Magdalene is named among women who traveled with and supported Jesus; Luke says seven demons had gone out from her.');
put(R('chuza','Chuza','Herodian household / disciples','Household manager','male',[],['joanna'],'Luke 8:3','Husband of Joanna and manager/steward of Herod’s household.'));
put(R('joanna','Joanna','Jesus ministry / resurrection witnesses','Disciple / supporter','female',[],['chuza'],'Luke 8:3; 24:10','Wife of Chuza, Herod’s household manager; one of the women supporting Jesus and later named among the resurrection witnesses.','explicit',['Joanna wife of Chuza']));
put(R('susanna','Susanna','Jesus ministry / supporters','Disciple / supporter','female',[],[],'Luke 8:3','Named among women who supported Jesus and the disciples from their resources.'));
add('jairus','Luke 8:41–56','Jairus is named as a synagogue ruler whose daughter Jesus restores to life.');
add('herod-antipas','Luke 9:7–9; 13:31–32; 23:7–15','Herod the tetrarch appears in Luke’s questions about Jesus, a warning to Jesus, and the passion hearing.');
addAny(['moses'],'Luke 9:30–33; 16:29,31; 20:28,37; 24:27,44','Moses is explicitly named in the transfiguration and later teachings.');
addAny(['elijah'],'Luke 9:8,19,30–33,54','Elijah is explicitly named in Luke’s ministry narratives.');

// Luke 10: Martha and Mary.
put(R('martha','Martha','Jesus ministry / household','Disciple / host','female',[],[],'Luke 10:38–42','Woman who welcomes Jesus into her home and is explicitly sister of Mary. Luke does not name the village; identification with Martha of Bethany in John is highly plausible but will be labeled when John is audited.','explicit',['Martha'],[C('sister','mary-martha','Luke 10:39')]));
put(R('mary-martha','Mary','Jesus ministry / household','Disciple','female',[],[],'Luke 10:39–42','Sister of Martha who sits at Jesus’ feet and listens to his teaching. Distinct from Mary mother of Jesus and Mary Magdalene. Identification with Mary of Bethany in John is probable but not forced yet.','probable',['Mary sister of Martha'],[C('sister','martha','Luke 10:39')]));

// Luke 11–13 named Scripture figures.
addAny(['jonah'],'Luke 11:29–32','Jonah is explicitly named in Jesus’ sign teaching.');
addAny(['solomon'],'Luke 11:31','Solomon is explicitly named in Jesus’ comparison with the queen of the South.');
addAny(['abel'],'Luke 11:51','Abel is explicitly named in Jesus’ judgment saying.');
add('zechariah-berechiah-matthew23','Luke 11:51','Luke’s parallel saying names Zechariah as the martyr at the end of the sequence but does not give his father. The Matthew 23 record remains the shared unresolved identity record rather than creating another Zechariah.');
addAny(['abram'],'Luke 13:16,28; 16:22–30; 19:9','Abraham is explicitly named in Jesus’ teaching and in Zacchaeus’s declaration of covenant belonging.',{aliases:['Abraham']});
addAny(['isaac'],'Luke 13:28','Isaac is explicitly named in the kingdom saying.');
addAny(['jacob'],'Luke 13:28','Jacob is explicitly named in the kingdom saying.');

// Luke 16: the named Lazarus in a parable is not Lazarus of Bethany.
put(R('lazarus-parable','Lazarus','Jesus parable / Luke 16','Named parable character','male',[],[],'Luke 16:19–31','Poor man named Lazarus in Jesus’ rich-man-and-Lazarus story. He is a named human character within the parable and is kept completely separate from Lazarus of Bethany in John 11–12.','explicit',['Lazarus in the rich man parable']));

// Luke 19: Zacchaeus.
put(R('zacchaeus','Zacchaeus','Jesus ministry / Jericho','Chief tax collector','male',[],[],'Luke 19:1–10','Chief tax collector at Jericho who receives Jesus joyfully and responds with restitution and generosity.','explicit',['Zacchaeus']));

// Luke 20–23: named figures in teaching and the passion.
addAny(['david'],'Luke 20:41–44','David is explicitly named in Jesus’ messianic Psalm argument.');
add('pilate','Luke 23:1–25,52','Pilate hears the charges against Jesus, sends him to Herod, and ultimately gives sentence for crucifixion.');
add('herod-antipas','Luke 23:7–15','Herod questions Jesus during the passion proceedings and returns him to Pilate.');
add('barabbas','Luke 23:18–25','Barabbas is the prisoner released instead of Jesus.');
add('simon-cyrene','Luke 23:26','Simon of Cyrene is compelled to carry Jesus’ cross.');
add('joseph-arimathea','Luke 23:50–53','Joseph of Arimathea is named as a good and righteous council member who had not consented to the council’s decision and who buries Jesus.');

// Luke 24: resurrection witnesses and Emmaus.
add('mary-magdalene','Luke 24:10','Mary Magdalene is explicitly named among the women reporting the empty tomb.');
add('joanna','Luke 24:10','Joanna is explicitly named among the women reporting the empty tomb.');
add('mary-james-joseph-matt27','Luke 24:10','Luke names Mary the mother of James among the women reporting the resurrection. This fits the crucifixion witness Mary known from Matthew and Mark; no claim is made that she is Mary mother of Jesus.');
put(R('cleopas','Cleopas','Resurrection / Emmaus','Disciple','male',[],[],'Luke 24:18','One of the two disciples walking to Emmaus; Luke names Cleopas but not his companion. Identification with Clopas in John 19:25 is possible but not forced.','unresolved identification',['Cleopas'],[C('possible identity','clopas-john19','Luke 24:18; John 19:25','Similar Greek names and early tradition invite comparison, but the texts do not explicitly identify them.') ]));
add('simon-peter','Luke 24:12,34','Peter runs to the tomb, and the gathered disciples later report that the risen Lord appeared to Simon.');
addAny(['moses'],'Luke 24:27,44','Moses is explicitly named in Jesus’ explanation of the Scriptures after the resurrection.');

// Unnamed figures such as the widow of Nain, the rich ruler, the repentant criminal, and Cleopas’s Emmaus companion remain unnamed and therefore do not receive invented person records.
db.scope='Genesis–Luke';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Luke'])];
})();