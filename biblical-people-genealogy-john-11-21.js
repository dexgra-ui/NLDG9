(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=[...new Set([...(r.parents||[]),...p.parents])];if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// John 11–12: Bethany siblings.
put(R('martha-bethany','Martha','Bethany family / Jesus disciples','Disciple / sister','female',[],[],'John 11:1–40; 12:2','Sister of Mary and Lazarus in Bethany. Commonly identified with Martha in Luke 10, but the Gospels do not explicitly state the equivalence, so the records remain linked as probable rather than merged.','probable',['Martha of Bethany'],[C('sister','mary-bethany','John 11:1–5'),C('sister','lazarus-bethany','John 11:1–5'),C('probable identity','martha-luke','Luke 10:38–42; John 11:1–5','Same distinctive Martha/Mary sister pair, but Luke does not name Bethany or Lazarus.') ]));
put(R('mary-bethany','Mary','Bethany family / Jesus disciples','Disciple / sister','female',[],[],'John 11:1–5,19–45; 12:1–8','Sister of Martha and Lazarus in Bethany; anoints Jesus’ feet and wipes them with her hair. Commonly identified with Mary in Luke 10 but not explicitly equated by the texts.','probable',['Mary of Bethany'],[C('sister','martha-bethany','John 11:1–5'),C('sister','lazarus-bethany','John 11:1–5'),C('probable identity','mary-martha-luke','Luke 10:39–42; John 11:1–5','Same distinctive Martha/Mary sister pair, but the Gospels do not explicitly identify the women across the scenes.') ]));
put(R('lazarus-bethany','Lazarus','Bethany family / Jesus disciples','Person / friend of Jesus','male',[],[],'John 11:1–44; 12:1–11,17','Brother of Mary and Martha in Bethany whom Jesus raises from the dead. Distinct from the Lazarus named in Luke 16’s rich-man parable.','explicit',['Lazarus of Bethany'],[C('brother','martha-bethany','John 11:1–5'),C('brother','mary-bethany','John 11:1–5'),C('distinct from','lazarus-rich-man-parable','Luke 16:19–31; John 11','The narratives do not identify these two named Lazarus figures as the same person.') ]));
addAny(['lazarus-rich-man-parable'],'Luke 16:19–31','Kept distinct from Lazarus of Bethany in John 11.',{connections:[C('distinct from','lazarus-bethany','Luke 16; John 11')]});
addAny(['martha-luke'],'Luke 10:38–42','John’s Martha of Bethany is a probable cross-Gospel counterpart, not a forced identity.',{connections:[C('probable identity','martha-bethany','Luke 10; John 11')]});
addAny(['mary-martha-luke'],'Luke 10:39–42','John’s Mary of Bethany is a probable cross-Gospel counterpart, not a forced identity.',{connections:[C('probable identity','mary-bethany','Luke 10; John 11')]});

// Thomas and Caiaphas in the Lazarus narrative.
addAny(['thomas-apostle'],'John 11:16; 14:5; 20:24–29; 21:2','John calls Thomas Didymus/the Twin and records his words around Lazarus, the farewell discourse, resurrection appearance, and fishing scene.',{aliases:['Thomas','Didymus','the Twin']});
addAny(['caiaphas'],'John 11:49–53; 18:13–14,24,28','Caiaphas is named as high priest who advises that one man should die for the people and later receives Jesus in the high-priestly proceedings.');
addAny(['judas-iscariot'],'John 12:4–6; 13:2,26–30; 18:2–5','Judas Iscariot objects to Mary’s anointing, receives the morsel at supper, and later leads the arrest party.');
addAny(['philip-apostle'],'John 12:21–22; 14:8–9','Philip appears in the Greek visitors’ request and the farewell discourse.');
addAny(['andrew-apostle'],'John 12:22','Andrew joins Philip in bringing the Greek visitors’ request to Jesus.');
addAny(['isaiah'],'John 12:38–41','John explicitly names Isaiah in two prophetic quotations/explanations.');

// John 13–14: Judas not Iscariot.
put(R('judas-not-iscariot','Judas, not Iscariot','Jesus disciples','Disciple / probable apostle','male',[],[],'John 14:22','Disciple named Judas whom John explicitly distinguishes from Judas Iscariot. Usually identified with Judas of James/Thaddaeus from the apostolic lists, but John supplies no patronymic here.','unresolved identification',['Judas not Iscariot'],[C('possible identity','judas-of-james','Luke 6:16; John 14:22','Likely the other apostolic Judas, but John does not specify his family designation.'),C('possible identity','thaddaeus','Matthew 10:3; Mark 3:18; John 14:22','Traditional apostolic-list harmonization; not explicit in John.') ]));

// John 18: high-priestly family and Malchus.
addAny(['annas'],'John 18:13,19–24','Annas receives Jesus first and is explicitly identified as father-in-law of Caiaphas.',{connections:[C('father-in-law','caiaphas','John 18:13')]});
addAny(['caiaphas'],'John 18:13–14,24,28','John identifies Caiaphas as son-in-law of Annas and high priest that year.',{connections:[C('son-in-law','annas','John 18:13')]});
put(R('malchus','Malchus','High-priest household / Jesus arrest','Servant of high priest','male',[],[],'John 18:10','High priest’s servant whose right ear Simon Peter cuts off. John uniquely supplies his personal name.','explicit',['Malchus']));
addAny(['simon-peter'],'John 18:10–27','John explicitly identifies Peter as the disciple who cuts off Malchus’s ear and later denies Jesus.');
addAny(['judas-iscariot'],'John 18:2–5','Judas is named as knowing the garden and leading those who arrest Jesus.');
addAny(['pilate'],'John 18:29–19:22,31,38','Pilate conducts Jesus’ Roman hearing and orders the inscription placed on the cross.');

// John 19: Jesus’ mother remains unnamed in John; Mary wife of Clopas and Mary Magdalene are named.
addAny(['mary-mother-jesus'],'John 19:25–27','John identifies her only as Jesus’ mother; the personal name Mary comes from the other Gospels and is not claimed as a name supplied by John.');
put(R('clopas','Clopas','Jesus crucifixion witnesses','Person','male',[],['mary-clopas'],'John 19:25','Husband of a Mary present near the cross. The name resembles Cleopas in Luke 24:18, but the Gospels do not explicitly identify them as the same person.','unresolved identification',['Clopas'],[C('possible identity','cleopas','Luke 24:18; John 19:25','Similar Greek name forms and early tradition invite comparison, but Scripture does not state the identity.') ]));
put(R('mary-clopas','Mary','Jesus crucifixion witnesses','Disciple / witness','female',[],['clopas'],'John 19:25','Mary identified as wife of Clopas. The punctuation of John 19:25 allows discussion over the number/relationship of women listed; she is not automatically made the sister of Jesus’ mother.','explicit',['Mary wife of Clopas']));
addAny(['cleopas'],'Luke 24:18','Clopas in John 19:25 is a possible name-form/identity connection but is not forced.',{connections:[C('possible identity','clopas','Luke 24:18; John 19:25')]});
addAny(['mary-magdalene'],'John 19:25; 20:1–18','Mary Magdalene is named at the cross and as the first individual in John’s empty-tomb/resurrection encounter.');
addAny(['joseph-arimathea'],'John 19:38–42','Joseph of Arimathea asks Pilate for Jesus’ body and buries him with Nicodemus.');
addAny(['nicodemus'],'John 19:39–42','Nicodemus assists Joseph of Arimathea with a large mixture of burial spices.');

// John 20–21: Thomas, Nathanael, Peter, and father-name John.
addAny(['thomas-apostle'],'John 20:24–29; 21:2','Thomas called Didymus/the Twin is named in the resurrection appearance and fishing scene.',{aliases:['Didymus','the Twin']});
addAny(['nathanael'],'John 21:2','Nathanael of Cana in Galilee is named among the disciples at the Sea of Tiberias.');
addAny(['zebedee'],'John 21:2','John 21 names “the sons of Zebedee” as present, but does not individually name James and John in that verse. The father’s name is therefore recorded without pretending the verse itself names the sons.');
addAny(['simon-peter'],'John 20:2–10; 21:2–21','Peter is named in the empty-tomb narrative, fishing scene, and restoration dialogue.');
addAny(['jonah-peter-father'],'John 21:15–17','Jesus repeatedly addresses Peter as Simon son of John; the shared Jonah/John father record preserves the Gospel name forms.',{name:'Jonah / John',aliases:['Jonah','John'],certainty:'textual variant'});

// John repeatedly refers to “the disciple whom Jesus loved” without giving that disciple a personal name. The database therefore does not identify that figure as John son of Zebedee merely from church tradition.
db.scope='Genesis–John';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'John'])];
})();