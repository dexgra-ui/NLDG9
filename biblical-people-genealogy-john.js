(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// John 1: John the Baptist, first disciples, and Nathanael.
add('jesus','John 1:1–21:25','Jesus is the central human person of John’s Gospel, identified theologically as the Word made flesh and narratively as Jesus of Nazareth.');
add('john-baptist','John 1:6–8,15–36; 3:23–36; 5:33–36; 10:40–42','John is the witness sent from God who baptizes and points others to Jesus. John’s Gospel generally calls him simply John rather than “the Baptist.”');
addAny(['isaiah'],'John 1:23; 12:38–41','Isaiah is explicitly named in John’s fulfillment quotations.');
add('andrew-apostle','John 1:40–44; 6:8–9; 12:22','Andrew is named as Simon Peter’s brother and a disciple who brings others to Jesus.');
add('simon-peter','John 1:40–44; 6:68; 13:6–37; 18:10–27; 20:2–10; 21:2–21','Simon Peter is named throughout John and explicitly identified as son of John/Jonah in 1:42 and 21:15–17.');
merge('jonah-peter-father',{name:'John / Jonah',ref:'Matthew 16:17; John 1:42; 21:15–17',note:'Matthew addresses Simon as Bar-Jonah (“son of Jonah”), while John’s textual tradition commonly reads Simon son of John/Johanan. The database preserves the forms together as the father designation rather than inventing two fathers.',aliases:['Jonah','John','Johanan'],certainty:'textual variant'});
add('philip-apostle','John 1:43–48; 6:5–7; 12:21–22; 14:8–9','Philip is called by Jesus and later appears repeatedly among the disciples.');
put(R('nathanael','Nathanael','Disciples / John','Disciple','male',[],[],'John 1:45–51; 21:2','Disciple from Cana in Galilee who is brought to Jesus by Philip and later appears after the resurrection. Common Christian tradition identifies Nathanael with Bartholomew, but John never says this explicitly.','unresolved identification',['Nathanael of Cana'],[C('possible identity','bartholomew','John 1:45–51; Matthew 10:3; Mark 3:18; Luke 6:14','Nathanael is associated with Philip in John and Bartholomew follows Philip in Synoptic lists, supporting a traditional identification that is not directly stated.') ]));
addAny(['moses'],'John 1:17,45; 3:14; 5:45–46; 6:32; 7:19–23','Moses is explicitly named repeatedly in John.');
add('joseph-mary','John 1:45; 6:42','People identify Jesus as son of Joseph in ordinary social speech. John does not use this language to overturn the birth traditions in Matthew and Luke.');

// John 2–6: Nicodemus and named ancestral references.
add('mary-mother-jesus','John 2:1–12; 19:25–27','John refers to Jesus’ mother but does not personally name her; the already-established Mary record is linked without claiming John supplies the name.');
put(R('nicodemus','Nicodemus','Jesus ministry / Jerusalem','Pharisee / council figure','male',[],[],'John 3:1–21; 7:50–52; 19:39–42','Pharisee and ruler of the Jews who visits Jesus by night, later speaks in the council, and helps Joseph of Arimathea prepare Jesus’ body for burial.','explicit',['Nicodemus']));
addAny(['jacob'],'John 4:5–12','Jacob is explicitly named in the Samaritan-well narrative.');
addAny(['joseph'],'John 4:5','Joseph son of Jacob is explicitly named in the land reference near Sychar.');
addAny(['abram'],'John 8:33,37,39–40,52–58','Abraham is repeatedly named in Jesus’ dispute concerning ancestry and true children of Abraham.',{aliases:['Abraham']});

// John 6 and 13: Judas Iscariot’s stated father.
put(R('simon-iscariot','Simon Iscariot','Judas Iscariot family','Person','male',[],[],'John 6:71; 13:2,26','Father of Judas Iscariot in John’s Gospel. Distinct from Simon Peter, Simon the Zealot, Simon of Cyrene, and other Simons.','explicit',['Simon father of Judas Iscariot']));
add('judas-iscariot','John 6:71; 12:4; 13:2,26–30; 18:2–5','John explicitly identifies Judas Iscariot as son of Simon Iscariot.',{parents:['simon-iscariot']});

// John 7–10: named ancestral figures.
addAny(['david'],'John 7:42','David is explicitly named in the crowd’s messianic discussion.');

// John 11–12: Lazarus, Martha, and Mary of Bethany.
put(R('lazarus-bethany','Lazarus','Bethany household','Friend / disciple household','male',[],[],'John 11:1–44; 12:1–11','Lazarus of Bethany, brother of Mary and Martha, whom Jesus raises from the dead. Kept completely distinct from the named Lazarus in Luke 16’s parable.','explicit',['Lazarus of Bethany'],[C('brother','martha','John 11:1–5'),C('brother','mary-martha','John 11:1–5')]));
add('martha','John 11:1–40; 12:2','John identifies Martha as sister of Mary and Lazarus in Bethany. This makes the traditional identification with Luke 10’s Martha highly plausible, though Luke itself did not name the village.',{connections:[C('sister','lazarus-bethany','John 11:1–5'),C('sister','mary-martha','John 11:1–5')]});
add('mary-martha','John 11:1–33; 12:3–8','John identifies Mary as sister of Martha and Lazarus in Bethany and as the woman who anoints Jesus’ feet. This strongly supports continuity with Luke 10’s Mary sister of Martha while keeping the cross-Gospel inference visible.',{connections:[C('sister','lazarus-bethany','John 11:1–5'),C('sister','martha','John 11:1–5')]});
add('caiaphas','John 11:49–52; 18:13–28','Caiaphas is named as high priest in the council plot and passion narrative.');
add('thomas-apostle','John 11:16; 14:5; 20:24–29; 21:2','Thomas is repeatedly called Didymus, meaning Twin.',{aliases:['Didymus','Thomas called the Twin']});
addAny(['isaiah'],'John 12:38–41','Isaiah is explicitly named in John’s explanation of unbelief.');

// John 14: Judas who is not Iscariot.
add('judas-james-apostle','John 14:22','John names a disciple Judas “not Iscariot.” The Gospel does not give his patronymic here; the record is linked to Luke’s Judas of James as the probable apostolic identity.');

// John 18: named people in the arrest and priestly hearing.
put(R('malchus','Malchus','High priest household / arrest','Servant','male',[],[],'John 18:10','Named servant of the high priest whose right ear Simon Peter cuts off during Jesus’ arrest.','explicit',['Malchus']));
add('annas','John 18:13,19–24','Annas receives Jesus first and is explicitly called father-in-law of Caiaphas.',{connections:[C('father-in-law','caiaphas','John 18:13')]});
add('caiaphas','John 18:13–14,24,28','Caiaphas is explicitly son-in-law of Annas and high priest associated with the council decision.',{connections:[C('son-in-law','annas','John 18:13')]});
add('pilate','John 18:29–19:22,31,38','Pilate conducts the Roman interrogation and crucifixion proceedings.');

// John 19: women at the cross, Clopas, burial witnesses.
put(R('clopas-john19','Clopas','Crucifixion witness family','Person','male',[],['mary-clopas'],'John 19:25','Husband of a Mary standing near Jesus’ cross. The similar name Cleopas in Luke 24 may refer to the same man, but the texts do not explicitly say so.','unresolved identification',['Clopas'],[C('possible identity','cleopas','John 19:25; Luke 24:18')]));
put(R('mary-clopas','Mary','Crucifixion witnesses','Disciple / witness','female',[],['clopas-john19'],'John 19:25','Mary identified by relationship to Clopas among the women at Jesus’ cross. Possible identification with the Synoptic Mary mother of James and Joses is traditional/probable, but John does not name her children.','probable',['Mary wife of Clopas','Mary of Clopas'],[C('probable identity','mary-james-joseph-matt27','John 19:25; Matthew 27:56; Mark 15:40','Parallel crucifixion witness traditions may describe the same Mary, but the texts use different relationship identifiers.') ]));
add('mary-magdalene','John 19:25; 20:1–18','Mary Magdalene stands near the cross and is the first named visitor to the tomb in John, later encountering the risen Jesus.');
add('joseph-arimathea','John 19:38–42','Joseph of Arimathea asks Pilate for Jesus’ body and buries him with Nicodemus.');
add('nicodemus','John 19:39–42','Nicodemus brings spices and assists Joseph of Arimathea in Jesus’ burial.');

// John 20–21: resurrection appearances.
add('simon-peter','John 20:2–10; 21:2–21','Peter runs to the tomb and later is restored/commissioned by Jesus beside the Sea of Tiberias.');
add('thomas-apostle','John 20:24–29; 21:2','Thomas called Didymus encounters the risen Jesus and later appears in Galilee.');
add('nathanael','John 21:2','Nathanael of Cana is explicitly named among disciples present by the sea.');
add('james-zebedee','John 21:2','John 21 refers collectively to the sons of Zebedee without personally naming them in that verse; the established James record is linked as one of those sons.');
add('john-zebedee','John 21:2','John 21 refers collectively to the sons of Zebedee without personally naming them in that verse; the established John son of Zebedee record is linked as one of those sons.');

// The “disciple whom Jesus loved” is never directly given a personal name in John’s text, so the database does not convert the traditional identification with John son of Zebedee into an explicit Scripture statement.
db.scope='Genesis–John';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'John'])];
})();