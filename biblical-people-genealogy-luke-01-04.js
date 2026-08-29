(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=[...new Set([...(r.parents||[]),...p.parents])];if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// Luke 1: named recipient, John’s family, and Jesus’ infancy family.
put(R('theophilus','Theophilus','Luke-Acts recipient','Recipient','male',[],[],'Luke 1:3; Acts 1:1','Person addressed by Luke as “most excellent” Theophilus. Identity and office are not further stated in Luke.','explicit',['Theophilus']));
addAny(['herod-great'],'Luke 1:5','Luke dates John’s family narrative to the days of Herod king of Judea.');
addAny(['abijah-course'],'Luke 1:5','Zechariah belongs to the priestly division of Abijah, linking Luke’s priestly setting to the Davidic-era priestly course name.');
addAny(['aaron'],'Luke 1:5','Elizabeth is described as being from the daughters/descendants of Aaron.');
put(R('zechariah-john-baptist','Zechariah','John the Baptist family','Priest','male',[],['elizabeth-john-baptist'],'Luke 1:5–80; 3:2','Priest of the division of Abijah, husband of Elizabeth, and father of John the Baptist. Distinct from other biblical men named Zechariah.','explicit',['Zechariah father of John','Zacharias']));
put(R('elizabeth-john-baptist','Elizabeth','John the Baptist family','Person','female',[],['zechariah-john-baptist'],'Luke 1:5–80','Wife of Zechariah, descendant of Aaron, relative of Mary, and mother of John the Baptist. Her parents are not named.','explicit',['Elizabeth'],[C('relative','mary-mother-jesus','Luke 1:36','Luke calls Elizabeth Mary’s relative without defining the exact degree of kinship.') ]));
addAny(['john-baptist'],'Luke 1:13–80; 3:2–20; 7:18–35; 9:7,9,19; 11:1; 16:16; 20:4–8','Luke supplies John the Baptist’s parents as Zechariah and Elizabeth.',{parents:['zechariah-john-baptist','elizabeth-john-baptist']});
addAny(['mary-mother-jesus'],'Luke 1:26–56; 2:5–51','Luke names Mary as the virgin betrothed to Joseph and mother of Jesus.',{connections:[C('relative','elizabeth-john-baptist','Luke 1:36','Luke calls Elizabeth Mary’s relative; the exact relationship is not stated.') ]});
addAny(['joseph-mary'],'Luke 1:27; 2:4–52; 3:23; 4:22','Joseph is betrothed/husband to Mary and is described as of the house and line of David. Luke 3 says Jesus was “as was supposed” Joseph’s son.');
addAny(['jesus'],'Luke 1:31–35; 2:1–52; 3:21–23; 4:1–44','Luke names Jesus before his birth and distinguishes divine conception from the socially supposed sonship to Joseph.');
addAny(['david'],'Luke 1:27,32,69; 2:4,11; 3:31','David is explicitly named as royal ancestor and in Luke’s genealogy.');
addAny(['jacob'],'Luke 1:33','Jacob is named in the phrase “house of Jacob.”');
addAny(['abram'],'Luke 1:55,73; 3:34','Abraham is explicitly named in Mary’s and Zechariah’s songs and in Luke’s genealogy.',{aliases:['Abraham']});

// Luke 2: Roman rulers and temple witnesses.
put(R('augustus-caesar','Caesar Augustus','Roman Empire','Emperor','male',[],[],'Luke 2:1','Roman emperor whose decree frames Luke’s account of Jesus’ birth.','explicit',['Augustus','Caesar Augustus']));
put(R('quirinius','Quirinius','Roman administration','Governor / ruler','male',[],[],'Luke 2:2','Governor of Syria named in Luke’s census dating.','explicit',['Quirinius','Cyrenius']));
put(R('simeon-temple','Simeon','Jesus infancy / temple','Devout witness','male',[],[],'Luke 2:25–35','Righteous and devout man in Jerusalem who takes the infant Jesus in his arms and blesses God. Distinct from the many other biblical Simeons.','explicit',['Simeon in the temple']));
put(R('phanuel-anna','Phanuel','Anna family','Person','male',[],[],'Luke 2:36','Father of Anna the prophetess.','explicit',['Phanuel','Penuel']));
put(R('anna-prophetess','Anna','Jesus infancy / temple','Prophetess','female',['phanuel-anna'],[],'Luke 2:36–38','Prophetess, daughter of Phanuel, from the tribe of Asher. Her deceased husband is not named.','explicit',['Anna the prophetess'],[C('tribe / descent','asher','Luke 2:36','Luke explicitly identifies Anna with the tribe of Asher.') ]));
addAny(['asher'],'Luke 2:36','Anna the prophetess is explicitly identified as being from the tribe of Asher.');

// Luke 3 political and priestly framework.
put(R('tiberius-caesar','Tiberius Caesar','Roman Empire','Emperor','male',[],[],'Luke 3:1','Roman emperor whose fifteenth year dates the beginning of John’s public ministry.','explicit',['Tiberius Caesar','Tiberius']));
addAny(['pilate'],'Luke 3:1; 13:1; 23:1–52','Luke names Pontius Pilate as governor of Judea and later as the Roman authority in Jesus’ trial.',{aliases:['Pontius Pilate']});
addAny(['herod-antipas'],'Luke 3:1,19–20; 8:3; 9:7–9; 13:31–32; 23:7–15','Luke names Herod as tetrarch of Galilee and later ruler who questions Jesus.',{aliases:['Herod the tetrarch']});
put(R('philip-tetrarch','Philip','Herodian dynasty','Tetrarch / ruler','male',[],[],'Luke 3:1','Herod’s brother and tetrarch of Iturea and Trachonitis. Kept distinct from Philip the apostle and from the Philip named as Herodias’s husband in Matthew/Mark because the biblical texts do not equate those two Herodian Philips.','unresolved identification',['Philip the tetrarch'],[C('brother','herod-antipas','Luke 3:1')]));
put(R('lysanias','Lysanias','Roman client rulers','Tetrarch / ruler','male',[],[],'Luke 3:1','Tetrarch of Abilene named in Luke’s chronological framework.'));
put(R('annas','Annas','Jerusalem priesthood / Jesus era','High priestly figure','male',[],[],'Luke 3:2','Named with Caiaphas in the high-priestly setting of John’s ministry. Later appears in John and Acts.','explicit',['Annas']));
addAny(['caiaphas'],'Luke 3:2','Caiaphas is named with Annas in Luke’s high-priestly dating.');
addAny(['zechariah-john-baptist'],'Luke 3:2','John is explicitly called son of Zechariah.');
addAny(['isaiah'],'Luke 3:4','Isaiah the prophet is explicitly named in the wilderness quotation introducing John’s ministry.');
addAny(['herodias'],'Luke 3:19','Herodias is explicitly named in John’s rebuke of Herod.');

// Luke 3 genealogy: Jesus to David. Luke says Jesus was “as was supposed” son of Joseph; Joseph’s Matthew parentage is not overwritten.
put(R('heli-luke','Heli / Eli','Jesus genealogy / Luke','Ancestor','male',[],[],'Luke 3:23–24','Named immediately after Joseph in Luke’s genealogy. Luke does not explain how Heli relates to Matthew’s Jacob, so Heli is not installed as Joseph’s sole biological father.','unresolved identification',['Heli','Eli']));
addAny(['joseph-mary'],'Luke 3:23','Luke says Jesus was “as was supposed” son of Joseph and then continues “of Heli.” This genealogical relationship is retained separately from Matthew’s Jacob-father-of-Joseph statement.',{connections:[C('genealogical relation / son of in Luke','heli-luke','Luke 3:23','Luke’s genealogy names Heli after Joseph, while Matthew 1:16 names Jacob as Joseph’s father. The Gospels do not explain the mechanism.') ]});
const lukeChainToNeri=[
 ['matthat-1-luke','Matthat'],['levi-1-luke','Levi'],['melchi-1-luke','Melchi'],['jannai-luke','Jannai'],['joseph-1-luke','Joseph'],['mattathias-1-luke','Mattathias'],['amos-luke','Amos'],['nahum-luke','Nahum'],['esli-luke','Esli / Hesli'],['naggai-luke','Naggai'],['maath-luke','Maath'],['mattathias-2-luke','Mattathias'],['semein-luke','Semein'],['josech-luke','Josech'],['joda-luke','Joda'],['joanan-luke','Joanan'],['rhesa-luke','Rhesa']
];
let child='heli-luke';
for(const [id,n] of lukeChainToNeri){put(R(id,n,'Jesus genealogy / Luke','Ancestor','male',[],[],'Luke 3:24–27',`Named in Luke’s genealogy; distinct from same-named biblical people unless the genealogy itself supplies the connection.`,n.includes('/')?'textual variant':'explicit',n.includes('/')?n.split(' / '):[]));const c=db.records.find(r=>r.id===child);if(c)c.parents=[id];child=id;}
// Rhesa is son/descendant of Zerubbabel in Luke’s presentation.
const rhesa=db.records.find(r=>r.id==='rhesa-luke');if(rhesa)rhesa.parents=['zerubbabel'];
addAny(['zerubbabel'],'Luke 3:27','Zerubbabel appears in Luke’s genealogy between Rhesa and Shealtiel.');
addAny(['shealtiel'],'Luke 3:27','Shealtiel appears as father/ancestor of Zerubbabel in Luke. Luke then names Neri as Shealtiel’s father, differing from Matthew/Chronicles presentations.');
put(R('neri-luke','Neri','Jesus genealogy / Luke','Ancestor','male',[],[],'Luke 3:27–28','Named as father/ancestor of Shealtiel in Luke’s genealogy. This differs from the Jeconiah-related line in Matthew/Chronicles and is retained as Luke’s separate genealogical presentation.','explicit',['Neri'],[C('genealogical child in Luke','shealtiel','Luke 3:27')]));
addAny(['shealtiel'],'Luke 3:27','Luke names Neri immediately before Shealtiel.',{connections:[C('genealogical father in Luke','neri-luke','Luke 3:27','This Luke relationship is recorded without overwriting other canonical genealogical presentations of Shealtiel.') ]});

// From Neri backward to Nathan son of David.
const neriAnc=[
 ['melchi-2-luke','Melchi'],['addi-luke','Addi'],['cosam-luke','Cosam'],['elmadam-luke','Elmadam'],['er-luke','Er'],['joshua-luke-genealogy','Joshua / Jesus'],['eliezer-luke','Eliezer'],['jorim-luke','Jorim'],['matthat-2-luke','Matthat'],['levi-2-luke','Levi'],['simeon-luke-genealogy','Simeon'],['judah-luke-genealogy','Judah / Judas'],['joseph-2-luke','Joseph'],['jonam-luke','Jonam'],['eliakim-luke-genealogy','Eliakim'],['melea-luke','Melea'],['menna-luke','Menna'],['mattatha-luke','Mattatha']
];
child='neri-luke';
for(const [id,n] of neriAnc){put(R(id,n,'Jesus genealogy / Luke','Ancestor','male',[],[],'Luke 3:28–31','Named in Luke’s genealogy; kept distinct from same-named people elsewhere unless Scripture explicitly joins them.',n.includes('/')?'textual variant':'explicit',n.includes('/')?n.split(' / '):[]));const c=db.records.find(r=>r.id===child);if(c)c.parents=[id];child=id;}
const mattatha=db.records.find(r=>r.id==='mattatha-luke');if(mattatha)mattatha.parents=['nathan-david'];
addAny(['nathan-david'],'Luke 3:31','Luke’s genealogy reaches David through Nathan rather than Solomon.');
addAny(['david'],'Luke 3:31','David is explicitly named as father/ancestor of Nathan in Luke’s line.');

// David back to Abraham. Existing OT records stay intact; textual-name additions in Luke are preserved separately.
for(const [ids,ref] of [
 [['jesse'],'Luke 3:32'],[['obed'],'Luke 3:32'],[['boaz'],'Luke 3:32'],[['salmon'],'Luke 3:32'],[['nahshon'],'Luke 3:32'],[['amminadab'],'Luke 3:33'],[['hezron-perez'],'Luke 3:33'],[['perez'],'Luke 3:33'],[['judah'],'Luke 3:33'],[['jacob'],'Luke 3:34'],[['isaac'],'Luke 3:34'],[['abram'],'Luke 3:34']
])addAny(ids,ref,'Named in Luke’s genealogy.');
addAny(['salmon'],'Luke 3:32','Some Greek/transliteration traditions give Sala/Salmon in this slot.',{aliases:['Salmon','Sala']});
put(R('admin-luke','Admin','Jesus genealogy / Luke','Textual genealogy name','male',[],[],'Luke 3:33','Name present in major modern critical-text translations between Amminadab and the Hezron/Ram-Arni portion of Luke’s genealogy. The manuscript tradition varies, so it is not used to overwrite the Old Testament Ram line.','textual variant',['Admin']));
put(R('arni-luke','Arni / Ram','Jesus genealogy / Luke','Textual genealogy name','male',['hezron-perez'],[],'Luke 3:33','Critical-text traditions include Arni, while other manuscripts/translations use Ram/Aram in this position. The existing Old Testament Ram record remains unchanged.','textual variant',['Arni','Ram','Aram'],[C('possible textual identity','ram-ruth','Luke 3:33; Ruth 4:19','Luke manuscript traditions vary in the name sequence around Admin/Arni/Ram.') ]));
const admin=db.records.find(r=>r.id==='admin-luke');if(admin)admin.parents=['arni-luke'];
addAny(['amminadab'],'Luke 3:33','Luke’s textual tradition contains Admin/Arni/Ram variation between Amminadab and Hezron; the OT parent chain is preserved.',{connections:[C('Luke genealogy textual parent slot','admin-luke','Luke 3:33','This records Luke’s textual sequence without replacing Ruth/Chronicles genealogy.') ]});

// Abraham to Adam. Luke inserts a post-flood Cainan between Arphaxad and Shelah in the Greek genealogy.
for(const [ids,ref,aliases] of [
 [['terah'],'Luke 3:34',[]],[['nahor-ancestor'],'Luke 3:34',[]],[['serug'],'Luke 3:35',[]],[['reu'],'Luke 3:35',['Reu','Ragau']],[['peleg'],'Luke 3:35',[]],[['eber'],'Luke 3:35',['Eber','Heber']],[['shelah'],'Luke 3:35–36',[]],[['arpachshad'],'Luke 3:36',['Arpachshad','Arphaxad']],[['shem'],'Luke 3:36',[]],[['noah'],'Luke 3:36',[]],[['lamech-sethite'],'Luke 3:36',[]],[['methuselah'],'Luke 3:37',[]],[['enoch-sethite'],'Luke 3:37',[]],[['jared'],'Luke 3:37',[]],[['mahalalel'],'Luke 3:37',['Mahalalel','Mahalaleel']],[['kenan'],'Luke 3:37',['Kenan','Cainan']],[['enosh'],'Luke 3:38',['Enosh','Enos']],[['seth'],'Luke 3:38',[]],[['adam'],'Luke 3:38',[]]
])addAny(ids,ref,'Named in Luke’s genealogy.',aliases.length?{aliases}:{});
put(R('cainan-postflood-luke','Cainan','Jesus genealogy / Luke','Ancestor / textual genealogy name','male',['arpachshad'],[],'Luke 3:36','Luke’s Greek genealogy includes a Cainan between Arphaxad/Arpachshad and Shelah. This additional generation is not in the Masoretic Genesis genealogy, so the Luke record remains visibly distinct.','textual variant',['Cainan after Arphaxad']));
addAny(['shelah'],'Luke 3:35–36','Luke’s Greek genealogy places a Cainan between Arphaxad and Shelah, unlike the Hebrew Genesis parent chain.',{connections:[C('genealogical father in Luke','cainan-postflood-luke','Luke 3:36','The existing Genesis parent relationship is not overwritten.') ]});
addAny(['adam'],'Luke 3:38','Luke closes the human genealogy with Adam and calls Adam “of God”; God is not entered as a human parent record.');

// Luke 4 named Scripture figures.
addAny(['elijah'],'Luke 4:25–26','Jesus explicitly names Elijah in the Nazareth synagogue.');
addAny(['elisha'],'Luke 4:27','Jesus explicitly names Elisha in the Nazareth synagogue.');

db.scope='Genesis–Luke 4';db.phase=11;
})();