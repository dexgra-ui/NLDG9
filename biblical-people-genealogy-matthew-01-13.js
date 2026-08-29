(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Matthew 1: Abraham to David. Enrich the Old Testament people already entered rather than duplicate them.
addAny(['abram'],'Matthew 1:1–2,17','Matthew opens Jesus’ genealogy with Abraham and identifies Jesus as son/descendant of Abraham.',{aliases:['Abraham']});
addAny(['isaac'],'Matthew 1:2','Isaac is named as son of Abraham in Matthew’s genealogy.');
addAny(['jacob'],'Matthew 1:2','Jacob the patriarch is named as son of Isaac and father of Judah and his brothers.');
addAny(['judah'],'Matthew 1:2–3','Judah is named as son of Jacob and father of Perez and Zerah by Tamar.');
addAny(['tamar'],'Matthew 1:3','Tamar is explicitly named in the genealogy as mother of Perez and Zerah by Judah.');
addAny(['perez'],'Matthew 1:3','Perez is named as son of Judah and Tamar and father of Hezron.');
addAny(['zerah','zerah-judah'],'Matthew 1:3','Zerah is explicitly named alongside his brother Perez.');
addAny(['hezron-perez','hezron'],'Matthew 1:3','Hezron is named as son/descendant of Perez and father/ancestor of Ram in Matthew’s compressed genealogy.');
addAny(['ram-ruth','ram'],'Matthew 1:3–4','Ram is named between Hezron and Amminadab.');
addAny(['amminadab'],'Matthew 1:4','Amminadab is named as father/ancestor of Nahshon.');
addAny(['nahshon'],'Matthew 1:4','Nahshon is named as father/ancestor of Salmon.');
addAny(['salmon'],'Matthew 1:4–5','Salmon is named as father of Boaz by Rahab.');
addAny(['rahab'],'Matthew 1:5','Rahab is explicitly named as mother of Boaz by Salmon.');
addAny(['boaz'],'Matthew 1:5','Boaz is named as son of Salmon and Rahab and father of Obed by Ruth.');
addAny(['ruth'],'Matthew 1:5','Ruth is explicitly named as mother of Obed by Boaz.');
addAny(['obed'],'Matthew 1:5','Obed is named as son of Boaz and Ruth and father of Jesse.');
addAny(['jesse'],'Matthew 1:5–6','Jesse is named as father of David the king.');
addAny(['david'],'Matthew 1:1,6,17','David is the royal hinge of Matthew’s genealogy and is repeatedly named in the Gospel’s messianic framing.');

// Matthew 1: Davidic royal line to the exile.
addAny(['uriah'],'Matthew 1:6','Matthew names Uriah in the phrase “the wife of Uriah.” Bathsheba is not personally named in Matthew 1, so the wording is preserved rather than rewritten.');
addAny(['bathsheba'],'Matthew 1:6','Matthew refers to Bathsheba without naming her as “the wife of Uriah”; her established Old Testament record is not treated as a newly named Matthew person.');
addAny(['solomon'],'Matthew 1:6–7','Solomon is named as David’s son in the royal genealogy.');
addAny(['rehoboam'],'Matthew 1:7','Rehoboam is named in the Davidic royal line.');
addAny(['abijam','abijah-judah'],'Matthew 1:7','Matthew uses the Abijah/Abia form in the royal line.');
addAny(['asa'],'Matthew 1:7–8','Asa is named in the royal line.');
addAny(['jehoshaphat','jehoshaphat-king'],'Matthew 1:8','Jehoshaphat is named in the royal line.');
addAny(['jehoram-judah'],'Matthew 1:8','Matthew names Joram/Jehoram immediately before Uzziah; the genealogy is intentionally compressed relative to Kings/Chronicles.',{aliases:['Joram']});
addAny(['azariah-uzziah','uzziah'],'Matthew 1:8–9','Uzziah is named in Matthew’s compressed royal genealogy.');
addAny(['jotham-judah','jotham'],'Matthew 1:9','Jotham is named in the royal line.');
addAny(['ahaz-judah','ahaz'],'Matthew 1:9','Ahaz is named in the royal line.');
addAny(['hezekiah'],'Matthew 1:9–10','Hezekiah is named in the royal line.');
addAny(['manasseh-judah'],'Matthew 1:10','Manasseh is named in the royal line.');
addAny(['amon-judah'],'Matthew 1:10','Amon is named in the royal line.');
addAny(['josiah'],'Matthew 1:10–11','Josiah is named as father/ancestor at the generation of the Babylonian deportation.');
addAny(['jehoiachin'],'Matthew 1:11–12','Matthew uses the form Jeconiah for the exilic king already known as Jehoiachin/Coniah.',{aliases:['Jeconiah','Coniah']});

// Matthew 1: post-exile line. Shealtiel and Zerubbabel already occur in Ezra/Haggai/Zechariah; the remaining names are first entered here.
addAny(['shealtiel'],'Matthew 1:12','Shealtiel is named as father/ancestor of Zerubbabel after the deportation.');
addAny(['zerubbabel'],'Matthew 1:12–13','Zerubbabel is named in Matthew’s post-exile genealogy.');
put(R('abiud-matthew','Abiud','Matthew genealogy','Ancestor','male',['zerubbabel'],[],'Matthew 1:13','Named in Matthew’s genealogy as son/descendant of Zerubbabel and father/ancestor of Eliakim. Matthew’s genealogy may compress generations, so immediate biological fatherhood beyond the wording is not expanded from external reconstructions.'));
put(R('eliakim-matthew','Eliakim','Matthew genealogy','Ancestor','male',['abiud-matthew'],[],'Matthew 1:13','Named between Abiud and Azor in Matthew’s genealogy. Distinct from Old Testament men named Eliakim.','explicit',['Eliakim in Matthew 1']));
put(R('azor-matthew','Azor','Matthew genealogy','Ancestor','male',['eliakim-matthew'],[],'Matthew 1:13–14','Named between Eliakim and Zadok in Matthew’s genealogy.'));
put(R('zadok-matthew','Zadok','Matthew genealogy','Ancestor','male',['azor-matthew'],[],'Matthew 1:14','Named between Azor and Achim in Matthew’s genealogy. Distinct from Zadok the priest and other Old Testament Zadoks.','explicit',['Zadok in Matthew 1']));
put(R('achim-matthew','Achim','Matthew genealogy','Ancestor','male',['zadok-matthew'],[],'Matthew 1:14','Named between Zadok and Eliud in Matthew’s genealogy.'));
put(R('eliud-matthew','Eliud','Matthew genealogy','Ancestor','male',['achim-matthew'],[],'Matthew 1:14–15','Named between Achim and Eleazar in Matthew’s genealogy.'));
put(R('eleazar-matthew','Eleazar','Matthew genealogy','Ancestor','male',['eliud-matthew'],[],'Matthew 1:15','Named between Eliud and Matthan in Matthew’s genealogy. Distinct from Aaron’s son Eleazar and other biblical Eleazars.','explicit',['Eleazar in Matthew 1']));
put(R('matthan-matthew','Matthan','Matthew genealogy','Ancestor','male',['eleazar-matthew'],[],'Matthew 1:15','Named between Eleazar and Jacob in Matthew’s genealogy.'));
put(R('jacob-joseph-matthew','Jacob','Matthew genealogy','Ancestor','male',['matthan-matthew'],[],'Matthew 1:15–16','Father of Joseph, husband of Mary. Distinct from Jacob/Israel the patriarch.','explicit',['Jacob father of Joseph']));
put(R('joseph-mary','Joseph','Jesus family','Husband / legal father','male',['jacob-joseph-matthew'],['mary-mother-jesus'],'Matthew 1:16–25; 2:13–23','Son of Jacob in Matthew’s genealogy and husband of Mary. Matthew presents him as Jesus’ legal/household father but explicitly says Jesus was born of Mary, not fathered biologically by Joseph.','explicit',['Joseph husband of Mary'],[C('legal / household father','jesus','Matthew 1:16,20–25','Joseph names and raises Jesus; Matthew does not present him as Jesus’ biological father.') ]));
put(R('mary-mother-jesus','Mary','Jesus family','Mother of Jesus','female',[],['joseph-mary'],'Matthew 1:16,18–25; 2:11; 13:55','Wife of Joseph and mother of Jesus. Matthew explicitly makes Mary, not Joseph, the human parent in the wording of Matthew 1:16.','explicit',['Mary mother of Jesus']));
put(R('jesus','Jesus','Jesus / Gospel ministry','Messiah / teacher','male',['mary-mother-jesus'],[],'Matthew 1:1–28:20','Jesus Christ, son of David and son of Abraham in Matthew’s opening; born of Mary, named by Joseph, and central person of the Gospel. Joseph is recorded separately as legal/household father rather than biological parent.','explicit',['Jesus Christ','Jesus the Messiah','Son of David'],[C('legal / household father','joseph-mary','Matthew 1:16,20–25')]));

// Matthew 2: Herodian setting and prophetic remembrance.
put(R('herod-great','Herod','Herodian dynasty','King / ruler','male',[],[],'Matthew 2:1–22','King Herod who seeks the child Jesus and orders the killing of the boys around Bethlehem. Matthew later distinguishes other rulers also called Herod.','explicit',['Herod the Great','King Herod']));
put(R('archelaus','Archelaus','Herodian dynasty','King / ruler','male',['herod-great'],[],'Matthew 2:22','Son of Herod who reigns in Judea after his father.'));
addAny(['rachel'],'Matthew 2:18','Rachel is explicitly named in Matthew’s quotation of Jeremiah 31.');
addAny(['jeremiah'],'Matthew 2:17','Jeremiah is explicitly named as the prophet associated with the quoted lament.');

// Matthew 3–4: John the Baptist and the first disciples.
put(R('john-baptist','John the Baptist','John the Baptist','Prophet / forerunner','male',[],[],'Matthew 3:1–17; 4:12; 9:14; 11:2–19; 14:1–12; 17:10–13; 21:23–32','John called the Baptist, preacher in the wilderness and forerunner of Jesus. Matthew does not name his parents; Luke will later supply that family relationship.','explicit',['John the Baptist','John']));
addAny(['isaiah'],'Matthew 3:3; 4:14; 8:17; 12:17','Matthew explicitly names Isaiah in several fulfillment quotations.');
put(R('simon-peter','Simon Peter','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 4:18–20; 8:14; 10:2; 14:28–31; 16:16–23; 17:1–4,24–27; 18:21; 19:27; 26:33–75','Simon called Peter, brother of Andrew and one of the Twelve. Matthew 16 later names his father as Jonah/Bar-Jonah.','explicit',['Simon','Peter','Simon Peter'],[C('brother','andrew-apostle','Matthew 4:18')]));
put(R('andrew-apostle','Andrew','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 4:18–20; 10:2','Brother of Simon Peter and one of the Twelve.','explicit',['Andrew'],[C('brother','simon-peter','Matthew 4:18')]));
put(R('zebedee','Zebedee','Disciples / apostles','Person','male',[],[],'Matthew 4:21–22; 10:2; 20:20; 26:37','Father of James and John. His wife is mentioned but not personally named in Matthew.'));
put(R('james-zebedee','James','Disciples / apostles','Apostle / disciple','male',['zebedee'],[],'Matthew 4:21–22; 10:2; 17:1; 20:20–23; 26:37','Son of Zebedee and brother of John; one of the Twelve. Distinct from James son of Alphaeus and James the brother of Jesus.','explicit',['James son of Zebedee'],[C('brother','john-zebedee','Matthew 4:21')]));
put(R('john-zebedee','John','Disciples / apostles','Apostle / disciple','male',['zebedee'],[],'Matthew 4:21–22; 10:2; 17:1; 20:20–23; 26:37','Son of Zebedee and brother of James; one of the Twelve. Distinct from John the Baptist.','explicit',['John son of Zebedee'],[C('brother','james-zebedee','Matthew 4:21')]));

// Matthew 9–10: Matthew and the Twelve.
put(R('matthew-apostle','Matthew','Disciples / apostles','Apostle / tax collector','male',[],[],'Matthew 9:9–13; 10:3','Tax collector called by Jesus and named among the Twelve. Matthew’s Gospel does not name his father.','explicit',['Matthew the tax collector']));
put(R('philip-apostle','Philip','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 10:3','One of the Twelve. Distinct from Herod’s brother Philip.','explicit',['Philip the apostle']));
put(R('bartholomew','Bartholomew','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 10:3','One of the Twelve. Matthew does not identify him with Nathanael; any such cross-Gospel proposal remains separate until John is audited.'));
put(R('thomas-apostle','Thomas','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 10:3','One of the Twelve.'));
put(R('alphaeus-james','Alphaeus','Disciples / apostles','Person','male',[],[],'Matthew 10:3','Father of James son of Alphaeus. Distinct from other men named Alphaeus.'));
put(R('james-alphaeus','James','Disciples / apostles','Apostle / disciple','male',['alphaeus-james'],[],'Matthew 10:3','Son of Alphaeus and one of the Twelve. Distinct from James son of Zebedee and James the brother of Jesus.','explicit',['James son of Alphaeus']));
put(R('thaddaeus','Thaddaeus','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 10:3','One of the Twelve. Some manuscript traditions preserve the form Lebbaeus; later Gospel comparisons will keep alternate apostolic names labeled.','textual variant',['Thaddaeus','Lebbaeus']));
put(R('simon-zealot','Simon the Zealot','Disciples / apostles','Apostle / disciple','male',[],[],'Matthew 10:4','One of the Twelve, called the Cananaean/Zealot. Distinct from Simon Peter and Jesus’ brother Simon.','textual variant',['Simon the Cananaean','Simon the Zealot']));
put(R('judas-iscariot','Judas Iscariot','Disciples / apostles','Apostle / betrayer','male',[],[],'Matthew 10:4; 26:14–50; 27:3–10','One of the Twelve who betrays Jesus and later dies after returning the silver. Distinct from Judas the brother of Jesus and other Judases.','explicit',['Judas Iscariot']));

// Matthew 11–13: named biblical figures and Jesus’ named brothers.
addAny(['elijah'],'Matthew 11:14','Elijah is explicitly named in Jesus’ explanation of John the Baptist’s role.');
addAny(['david'],'Matthew 12:3,23','David is explicitly named in Jesus’ Sabbath example and messianic title.');
addAny(['jonah'],'Matthew 12:39–41','Jonah is explicitly named in Jesus’ sign and Nineveh teaching.');
addAny(['solomon'],'Matthew 12:42','Solomon is explicitly named in Jesus’ comparison with the queen of the South.');
put(R('james-brother-jesus','James','Jesus family','Brother of Jesus','male',[],[],'Matthew 13:55','Explicitly named as a brother of Jesus. Matthew does not state his father or mother in this verse, so parentage is not inferred from later tradition. Distinct from the two apostles named James.','explicit',['James brother of Jesus'],[C('brother','jesus','Matthew 13:55')]));
put(R('joseph-brother-jesus','Joseph / Joses','Jesus family','Brother of Jesus','male',[],[],'Matthew 13:55','Explicitly named as a brother of Jesus; manuscript/translation traditions use Joseph or Joses. Parentage is not inferred beyond the stated sibling relation.','textual variant',['Joseph brother of Jesus','Joses brother of Jesus'],[C('brother','jesus','Matthew 13:55')]));
put(R('simon-brother-jesus','Simon','Jesus family','Brother of Jesus','male',[],[],'Matthew 13:55','Explicitly named as a brother of Jesus. Distinct from Simon Peter and Simon the Zealot.','explicit',['Simon brother of Jesus'],[C('brother','jesus','Matthew 13:55')]));
put(R('judas-brother-jesus','Judas','Jesus family','Brother of Jesus','male',[],[],'Matthew 13:55','Explicitly named as a brother of Jesus. Distinct from Judas Iscariot. Identification with the later author Jude is not forced here.','unresolved identification',['Judas brother of Jesus','Jude?'],[C('brother','jesus','Matthew 13:55')]));

// Matthew 13 mentions Jesus’ sisters but does not name them; unnamed sisters remain relationships in the narrative, not invented person records.
db.scope='Genesis–Matthew 13';db.phase=11;
})();