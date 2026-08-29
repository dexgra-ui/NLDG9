(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=[...new Set([...(r.parents||[]),...p.parents])];if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Luke 5–6: call narratives and Luke’s Twelve.
addAny(['simon-peter'],'Luke 5:1–11; 6:14; 8:45; 9:20,28,32–33; 12:41; 18:28; 22:8,31–34,54–62; 24:12,34','Simon Peter is central in Luke’s call, apostolic list, transfiguration, passion, and resurrection reports.');
addAny(['james-zebedee'],'Luke 5:10; 6:14; 8:51; 9:28,54','James is named with John as son/partner in the fishing circle and one of the Twelve.');
addAny(['john-zebedee'],'Luke 5:10; 6:14; 8:51; 9:28,49,54; 22:8','John is named with James as one of the Twelve and later sent with Peter to prepare Passover.');
addAny(['zebedee'],'Luke 5:10','Luke explicitly identifies James and John as sons of Zebedee.');
addAny(['levi-alphaeus-mark'],'Luke 5:27–32','Luke also calls the tax collector Levi but does not name his father here; this reinforces the Mark-Luke Levi record without automatically merging it with Matthew.');
addAny(['moses'],'Luke 5:14; 9:30–33; 16:29,31; 20:28,37; 24:27,44','Moses is explicitly named in healing instructions, the transfiguration, parable dialogue, resurrection teaching, and Scripture interpretation.');
addAny(['andrew-apostle'],'Luke 6:14','Andrew is named among the Twelve.');
addAny(['philip-apostle'],'Luke 6:14','Philip is named among the Twelve.');
addAny(['bartholomew'],'Luke 6:14','Bartholomew is named among the Twelve.');
addAny(['matthew-apostle'],'Luke 6:15','Matthew is named among the Twelve, while Luke 5 separately calls the tax collector Levi.');
addAny(['thomas-apostle'],'Luke 6:15','Thomas is named among the Twelve.');
addAny(['james-alphaeus'],'Luke 6:15','James son of Alphaeus is named among the Twelve.');
addAny(['alphaeus-james'],'Luke 6:15','Alphaeus is explicitly named as father of James.');
addAny(['simon-zealot'],'Luke 6:15','Luke explicitly calls this apostle Simon who was called the Zealot.',{aliases:['Simon the Zealot']});
put(R('james-father-judas-apostle','James','Judas apostle family','Person','male',[],[],'Luke 6:16','James named in the designation of Judas “of James.” Many modern translations render “son of James,” while older English traditions can render “brother of James.” The Greek relation is kept visible in the note.','textual variant',['James connected to Judas apostle']));
put(R('judas-of-james','Judas of James','Disciples / apostles','Apostle / disciple','male',[],[],'Luke 6:16; Acts 1:13','One of the Twelve, designated Judas of James. Modern translations usually understand “son of James”; some older traditions render “brother of James.” Often identified with Thaddaeus in Matthew/Mark, but the Gospels do not explicitly equate the names.','unresolved identification',['Judas son of James','Judas brother of James?'],[C('family relation','james-father-judas-apostle','Luke 6:16','Greek designation Judas of James; exact English kinship rendering varies.'),C('possible identity','thaddaeus','Matthew 10:3; Mark 3:18; Luke 6:16','The apostolic-list slot corresponds, but the names are not explicitly equated by the Gospels.') ]));
addAny(['judas-iscariot'],'Luke 6:16; 22:3–48','Judas Iscariot is named among the Twelve and as Jesus’ betrayer.');

// Luke 7: John the Baptist.
addAny(['john-baptist'],'Luke 7:18–35','John the Baptist sends messengers to Jesus and is the subject of Jesus’ teaching.');

// Luke 8: named women and Jairus.
addAny(['mary-magdalene'],'Luke 8:2; 24:10','Mary called Magdalene is named among the women supporting Jesus and later among the resurrection witnesses.');
put(R('chuza','Chuza','Herodian administration / disciples','Herod’s steward / household manager','male',[],['joanna-chuza'],'Luke 8:3','Manager/steward of Herod’s household and husband of Joanna.'));
put(R('joanna-chuza','Joanna','Jesus disciples / women','Disciple / supporter','female',[],['chuza'],'Luke 8:3; 24:10','Wife of Chuza, Herod’s household manager, who supports Jesus and the Twelve from her resources and is later named among the resurrection witnesses.','explicit',['Joanna wife of Chuza']));
put(R('susanna-luke','Susanna','Jesus disciples / women','Disciple / supporter','female',[],[],'Luke 8:3','Named among the women who supported Jesus and the Twelve from their resources. Distinct from extra-biblical or deuterocanonical people of the same name.','explicit',['Susanna']));
addAny(['jairus'],'Luke 8:41–56','Luke also names Jairus as synagogue ruler whose daughter Jesus restores.');

// Luke 9: Herod, John, Elijah, Moses, and core disciples.
addAny(['herod-antipas'],'Luke 9:7–9; 13:31–32; 23:7–15','Herod is perplexed by reports about Jesus, later is called a fox by Jesus, and questions Jesus during the passion.');
addAny(['john-baptist'],'Luke 9:7,9,19','John the Baptist is explicitly named in Herod’s and the crowd’s speculation about Jesus.');
addAny(['elijah'],'Luke 9:8,19,30,33,54','Elijah is named in speculation, the transfiguration, and a disciple comparison.');

// Luke 10: Martha and Mary. Luke does not name Lazarus here or state Bethany, so the sisters remain a Luke-local record until John is compared.
put(R('martha-luke','Martha','Jesus ministry / sisters','Disciple / host','female',[],[],'Luke 10:38–42','Woman who welcomes Jesus into her home and is sister of Mary. Commonly identified with Martha of Bethany in John, but Luke does not name the village or Lazarus, so the cross-Gospel identity is not forced yet.','unresolved identification',['Martha in Luke 10'],[C('sister','mary-martha-luke','Luke 10:39')]));
put(R('mary-martha-luke','Mary','Jesus ministry / sisters','Disciple','female',[],[],'Luke 10:39–42','Sister of Martha who sits at Jesus’ feet and listens. Commonly identified with Mary of Bethany, but Luke does not state that identity.','unresolved identification',['Mary sister of Martha'],[C('sister','martha-luke','Luke 10:39')]));

// Luke 11: Jonah, Solomon, Abel, and Zechariah.
addAny(['jonah'],'Luke 11:29–32','Jesus explicitly names Jonah in the sign-of-Jonah teaching.');
addAny(['solomon'],'Luke 11:31','Jesus explicitly names Solomon in the Queen-of-the-South comparison.');
addAny(['abel'],'Luke 11:51','Jesus explicitly names Abel in the blood-from-Abel-to-Zechariah saying.');
put(R('zechariah-luke11','Zechariah','Luke 11 martyr saying','Martyr / historical reference','male',[],[],'Luke 11:51','Zechariah named as killed between the altar and the sanctuary. Luke gives no patronymic. This likely corresponds to Matthew 23:35’s Zechariah son of Berechiah, but Luke’s wording alone does not resolve the Old Testament identity.','unresolved identification',['Zechariah in Luke 11'],[C('probable parallel identity','zechariah-berechiah-matthew23','Luke 11:51; Matthew 23:35','The sayings are close synoptic parallels; Matthew supplies the patronymic Berechiah.') ]));

// Luke 13: Pilate, Herod, patriarchs.
addAny(['pilate'],'Luke 13:1; 23:1–52','Pilate is named in a Galilean tragedy reference and throughout Jesus’ Roman hearing.');
addAny(['abram'],'Luke 13:16,28; 16:22–30; 19:9; 20:37','Abraham is explicitly named in teaching, parable, Zacchaeus’s story, and resurrection argument.',{aliases:['Abraham']});
addAny(['isaac'],'Luke 13:28; 20:37','Isaac is explicitly named among the patriarchs.');
addAny(['jacob'],'Luke 13:28; 20:37','Jacob is explicitly named among the patriarchs.');

// Luke 16: named Lazarus in a parable. He is distinct from Lazarus of Bethany in John 11.
put(R('lazarus-rich-man-parable','Lazarus','Jesus parables','Named parable character','male',[],[],'Luke 16:19–31','Poor man named in Jesus’ rich-man-and-Lazarus parable. Whether the story uses a historical individual or a literary character is not stated; he is kept distinct from Lazarus of Bethany.','unresolved identification',['Lazarus in Luke 16'],[C('distinct from','lazarus-bethany','Luke 16; John 11','Same name, but the narratives give no identity connection.') ]));
addAny(['moses'],'Luke 16:29,31','Abraham’s speech in the parable explicitly names Moses.');

// Luke 19: Zacchaeus.
put(R('zacchaeus','Zacchaeus','Jesus ministry / Jericho','Chief tax collector','male',[],[],'Luke 19:1–10','Chief tax collector at Jericho who welcomes Jesus and responds with restitution and generosity.','explicit',['Zacchaeus']));
addAny(['abram'],'Luke 19:9','Jesus calls Zacchaeus a son of Abraham.');

// Luke 20–22: David, Moses, and the passion disciples.
addAny(['david'],'Luke 20:41–44','Jesus explicitly names David in the Messiah-and-Psalm discussion.');
addAny(['moses'],'Luke 20:28,37','Moses is explicitly named in the resurrection dispute.');
addAny(['simon-peter'],'Luke 22:8,31–34,54–62','Peter prepares Passover with John and later denies Jesus.');
addAny(['john-zebedee'],'Luke 22:8','John is sent with Peter to prepare Passover.');

// Luke 23: Roman/Herodian hearing, crucifixion, and burial.
addAny(['pilate'],'Luke 23:1–25,52','Pilate presides over Jesus’ Roman hearing and later receives Joseph of Arimathea’s burial request.');
addAny(['herod-antipas'],'Luke 23:7–15','Herod questions Jesus after Pilate sends him because Jesus is a Galilean under Herod’s jurisdiction.');
addAny(['barabbas'],'Luke 23:18–25','Barabbas is the prisoner released instead of Jesus.');
addAny(['simon-cyrene'],'Luke 23:26','Simon of Cyrene is compelled to carry the cross behind Jesus.');
addAny(['joseph-arimathea'],'Luke 23:50–53','Joseph of Arimathea is a council member who had not consented to the council’s decision and places Jesus in a tomb.');

// Luke 24: named Emmaus disciple and resurrection references.
put(R('cleopas','Cleopas','Jesus resurrection / Emmaus','Disciple','male',[],[],'Luke 24:18','One of the two disciples traveling to Emmaus. The other disciple is not named. Identification with Clopas in John 19:25 is possible but not forced before John is audited.','unresolved identification',['Cleopas']));
addAny(['moses'],'Luke 24:27,44','The risen Jesus explicitly explains the Scriptures beginning with Moses and later names the Law of Moses.');
addAny(['simon-peter'],'Luke 24:34','The gathered disciples report that the risen Lord appeared to Simon; the narrative context supports Simon Peter.');
addAny(['mary-magdalene'],'Luke 24:10','Mary Magdalene is named among the women reporting the empty tomb.');
addAny(['joanna-chuza'],'Luke 24:10','Joanna is named among the women reporting the resurrection message.');

// Luke 24 also says “Mary the mother of James.” The cross-Gospel Mary record is enriched while identity with Mary mother of Jesus remains unforced.
addAny(['mary-james-joseph-matt27'],'Luke 24:10','Luke names Mary the mother of James among the resurrection witnesses.',{aliases:['Mary mother of James']});

db.scope='Genesis–Luke';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Luke'])];
})();