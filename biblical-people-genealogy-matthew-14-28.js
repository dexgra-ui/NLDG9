(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Matthew 14: Herod’s court and John the Baptist.
put(R('philip-herod-brother','Philip','Herodian dynasty','Herodian prince / person','male',[],['herodias'],'Matthew 14:3','Named as Herod’s brother and Herodias’s husband. This Philip is kept distinct from Philip the apostle and is not automatically merged with Philip the tetrarch from other sources.','explicit',['Philip brother of Herod'],[C('brother','herod-antipas','Matthew 14:3')]));
put(R('herodias','Herodias','Herodian dynasty','Herodian woman','female',[],['philip-herod-brother'],'Matthew 14:3–11','Wife of Herod’s brother Philip in Matthew’s wording. Herod takes/has her unlawfully, prompting John the Baptist’s rebuke. Her daughter is present in the narrative but is not personally named in Matthew.','explicit',['Herodias'],[C('unlawful union / taken by','herod-antipas','Matthew 14:3–4')]));
put(R('herod-antipas','Herod','Herodian dynasty','Tetrarch / ruler','male',[],[],'Matthew 14:1–12','Herod the tetrarch who imprisons and executes John the Baptist. Commonly identified historically as Herod Antipas; Matthew itself uses the name Herod and the title tetrarch. He is explicitly brother of Philip in Matthew 14:3.','explicit',['Herod the tetrarch','Herod Antipas'],[C('brother','philip-herod-brother','Matthew 14:3'),C('unlawful union / takes','herodias','Matthew 14:3–4')]));
addAny(['john-baptist'],'Matthew 14:1–12','John the Baptist is imprisoned and executed by Herod the tetrarch after confronting his relationship with Herodias.');

// Matthew 15–22: named Scripture figures and Peter’s stated father.
addAny(['isaiah'],'Matthew 15:7','Isaiah is explicitly named in Jesus’ quotation concerning hypocritical worship.');
put(R('jonah-peter-father','Jonah','Peter family','Person','male',[],[],'Matthew 16:17','Father named in Jesus’ address “Simon Bar-Jonah,” meaning Simon son of Jonah. Distinct from the prophet Jonah unless Scripture explicitly identifies them.','explicit',['Jonah father of Simon Peter','Bar-Jonah father']));
addAny(['simon-peter'],'Matthew 16:16–23; 17:1–4,24–27; 18:21; 19:27; 26:33–75','Matthew 16 explicitly identifies Simon Peter as Bar-Jonah, son of Jonah.',{parents:['jonah-peter-father']});
addAny(['john-baptist'],'Matthew 16:14; 17:13; 21:25–32','John the Baptist is explicitly named or identified in Jesus’ discussions.');
addAny(['elijah'],'Matthew 16:14; 17:3–12; 27:47,49','Elijah is explicitly named in the transfiguration, interpretation, and crucifixion crowd remarks.');
addAny(['jeremiah'],'Matthew 16:14; 27:9','Jeremiah is explicitly named in the disciples’ report and in Matthew’s passion quotation attribution.');
addAny(['moses'],'Matthew 17:3–4; 19:7–8; 22:24','Moses is explicitly named in the transfiguration and teaching disputes.');
addAny(['david'],'Matthew 20:30–31; 21:9,15; 22:42–45','David is repeatedly named in the “Son of David” title and Jesus’ Psalm argument.');
addAny(['abram'],'Matthew 22:32','Abraham is explicitly named in Jesus’ resurrection argument.',{aliases:['Abraham']});
addAny(['isaac'],'Matthew 22:32','Isaac is explicitly named in Jesus’ resurrection argument.');
addAny(['jacob'],'Matthew 22:32','Jacob the patriarch is explicitly named in Jesus’ resurrection argument.');

// Matthew 23: Abel and the disputed Zechariah identification.
addAny(['abel'],'Matthew 23:35','Abel is explicitly named as righteous Abel in Jesus’ judgment saying.');
put(R('berechiah-matthew23','Berechiah','Matthew 23 martyr saying','Person','male',[],[],'Matthew 23:35','Named as father of the Zechariah killed between the sanctuary and altar. Because the identity of this Zechariah is debated, Berechiah is kept local to Matthew’s statement rather than merged with another Berechiah.','explicit',['Berechiah father of Zechariah in Matthew 23']));
put(R('zechariah-berechiah-matthew23','Zechariah','Matthew 23 martyr saying','Martyr / historical reference','male',['berechiah-matthew23'],[],'Matthew 23:35','Jesus names Zechariah son of Berechiah as killed between the sanctuary and altar. The patronymic matches the post-exile prophet Zechariah, while the manner/location of death resembles Zechariah son of Jehoiada in 2 Chronicles 24. Matthew does not explain the identity, so the database does not force either solution.','unresolved identification',['Zechariah son of Berechiah (Matthew 23)'],[C('possible identity','zechariah-return-prophet','Matthew 23:35; Zechariah 1:1','Same patronymic Berechiah, but the Old Testament prophetic book does not record this death.'),C('possible identity','zechariah-jehoiada','Matthew 23:35; 2 Chronicles 24:20–22','Temple-area martyrdom resembles Zechariah son of Jehoiada, but Matthew says son of Berechiah.') ]));

// Matthew 24–26.
addAny(['daniel'],'Matthew 24:15','Daniel the prophet is explicitly named in Jesus’ Olivet discourse.');
put(R('caiaphas','Caiaphas','Jerusalem priesthood / Jesus trial','High priest','male',[],[],'Matthew 26:3,57','High priest named in the plot against Jesus and the council hearing at his house. Matthew does not state his ancestry.','explicit',['Caiaphas the high priest']));
addAny(['judas-iscariot'],'Matthew 26:14–50; 27:3–10','Judas Iscariot bargains to betray Jesus, identifies him in Gethsemane, then returns the silver and dies.');
addAny(['simon-peter'],'Matthew 26:33–75','Peter follows Jesus to the high-priestly courtyard and denies knowing him three times.');
addAny(['james-zebedee'],'Matthew 26:37','James son of Zebedee is one of the three disciples taken farther into Gethsemane.');
addAny(['john-zebedee'],'Matthew 26:37','John son of Zebedee is one of the two sons of Zebedee taken with Peter farther into Gethsemane.');

// Matthew 27–28: Roman hearing, crucifixion, burial, and resurrection witnesses.
put(R('pilate','Pilate','Roman rule / Jesus trial','Governor / ruler','male',[],[],'Matthew 27:2,11–26,58,62–65; 28:14','Roman governor who questions Jesus, releases Barabbas, and hands Jesus over for crucifixion. Some textual/traditional forms give the fuller name Pontius Pilate; Matthew’s core narrative repeatedly calls him Pilate.','textual variant',['Pilate','Pontius Pilate']));
put(R('barabbas','Barabbas','Roman custody / Jesus trial','Prisoner','male',[],[],'Matthew 27:16–26','Notorious prisoner released instead of Jesus. Some ancient manuscripts preserve the fuller reading “Jesus Barabbas”; the variant is noted without confusing him with Jesus Christ.','textual variant',['Barabbas','Jesus Barabbas']));
put(R('simon-cyrene','Simon','Crucifixion','Person','male',[],[],'Matthew 27:32','Man from Cyrene compelled to carry Jesus’ cross. Distinct from Simon Peter, Simon the Zealot, and Jesus’ brother Simon.','explicit',['Simon of Cyrene']));
put(R('mary-magdalene','Mary Magdalene','Jesus ministry / resurrection','Disciple / witness','female',[],[],'Matthew 27:56,61; 28:1–10','Named follower present at the crucifixion, burial, and empty tomb; one of the first resurrection witnesses in Matthew.','explicit',['Mary Magdalene']));
put(R('mary-james-joseph-matt27','Mary','Crucifixion / resurrection witnesses','Disciple / witness','female',[],[],'Matthew 27:56,61; 28:1','Named as mother of James and Joseph and later called “the other Mary.” She is kept distinct from Mary mother of Jesus because Matthew does not explicitly identify them as the same woman.','unresolved identification',['Mary mother of James and Joseph','the other Mary']));
put(R('james-mary-matt27','James','Crucifixion witness family','Person','male',['mary-james-joseph-matt27'],[],'Matthew 27:56','Named as a son of the Mary who witnesses the crucifixion. The text does not establish identity with James the brother of Jesus or either apostle named James.','unresolved identification',['James son of the other Mary'],[C('possible identity','james-brother-jesus','Matthew 13:55; 27:56','Same common name and possible family overlap, but Matthew does not equate the two.') ]));
put(R('joseph-mary-matt27','Joseph','Crucifixion witness family','Person','male',['mary-james-joseph-matt27'],[],'Matthew 27:56','Named as a son of the Mary who witnesses the crucifixion. Some traditions use the form Joses. Identity with Joseph/Joses the brother of Jesus is not forced.','unresolved identification',['Joseph son of the other Mary','Joses?'],[C('possible identity','joseph-brother-jesus','Matthew 13:55; 27:56','Possible overlap, but the Gospel does not explicitly equate the two.') ]));
put(R('joseph-arimathea','Joseph of Arimathea','Jesus burial','Disciple / council figure','male',[],[],'Matthew 27:57–60','Rich man from Arimathea who had become a disciple of Jesus and places Jesus’ body in his own new tomb.','explicit',['Joseph of Arimathea']));

// Pilate’s wife and the mother of Zebedee’s sons are present but unnamed in Matthew; Salome and other later/traditional names are not imported into Matthew’s record.
db.scope='Genesis–Matthew';db.phase=11;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Matthew'])];
})();