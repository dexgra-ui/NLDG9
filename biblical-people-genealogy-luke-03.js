(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};
const gc=(target,ref)=>C('Luke genealogy predecessor',target,ref,'Luke records this genealogical link; the Gospel does not explain whether every link should be read as immediate biological fatherhood, legal descent, or a compressed genealogical relationship.');
const G=(id,name,target,ref,note='',certainty='explicit',aliases=[])=>put(R(id,name,'Luke 3 genealogy','Genealogical ancestor','male',[],[],ref,note,certainty,aliases,target?[gc(target,ref)]:[]));
const GE=(ids,target,ref,note='',extra={})=>{const id=addAny(ids,ref,note,{...extra,connections:[...(extra.connections||[]),gc(target,ref)]});return id;};

// Luke 3:1–2 political and priestly chronology.
put(R('tiberius','Tiberius Caesar','Roman Empire','Emperor / ruler','male',[],[],'Luke 3:1','Roman emperor whose fifteenth year dates the beginning of John the Baptist’s public ministry.','explicit',['Tiberius Caesar','Tiberius']));
add('pilate','Luke 3:1','Pilate is named as governor of Judea in Luke’s chronological framework.');
add('herod-antipas','Luke 3:1,19–20','Herod is named as tetrarch of Galilee and later as the ruler rebuked by John.');
put(R('philip-tetrarch','Philip','Herodian dynasty','Tetrarch / ruler','male',[],[],'Luke 3:1','Herod’s brother Philip, tetrarch of the region of Iturea and Trachonitis. He is kept distinct from the Philip whom Matthew and Mark call Herodias’s husband because the texts do not themselves equate those two Philips.','explicit',['Philip the tetrarch'],[C('brother','herod-antipas','Luke 3:1')]));
put(R('lysanias','Lysanias','Abilene','Tetrarch / ruler','male',[],[],'Luke 3:1','Named as tetrarch of Abilene in Luke’s chronological framework.'));
put(R('annas','Annas','Jerusalem priesthood / Jesus era','High priestly figure','male',[],[],'Luke 3:2','Named with Caiaphas in Luke’s high-priestly dating formula. Later John and Acts add more information about his priestly household.','explicit',['Annas']));
add('caiaphas','Luke 3:2','Caiaphas is named with Annas in Luke’s high-priestly dating formula.');
add('john-baptist','Luke 3:2–20','John son of Zechariah receives the word of God and begins preaching and baptizing.');
add('zechariah-john-baptist','Luke 3:2','Zechariah is explicitly named as John’s father.');
addAny(['isaiah'],'Luke 3:4','Isaiah is explicitly named as the prophet whose words frame John’s ministry.');

// Luke 3:23 begins with Jesus and Joseph, but Luke says Jesus was “as was supposed” son of Joseph.
add('jesus','Luke 3:23–38','Luke places Jesus at the head of a genealogy and explicitly qualifies Joseph’s fatherhood with “as was supposed.”');
G('heli-luke','Heli','matthat-luke-1','Luke 3:23–24','First named predecessor after Joseph in Luke’s genealogy. The Gospel does not explain how Heli’s relation to Joseph corresponds with Matthew’s explicit statement that Jacob fathered Joseph.');
add('joseph-mary','Luke 3:23','Luke records Joseph “of Heli” after qualifying Jesus as “as was supposed” son of Joseph. Matthew 1 explicitly names Jacob as Joseph’s father, so Heli is preserved as Luke’s genealogical relation rather than replacing Matthew’s parent record.',{connections:[gc('heli-luke','Luke 3:23')]});

// Luke’s line from Heli back to Zerubbabel.
G('matthat-luke-1','Matthat','levi-luke-1','Luke 3:24','First of two men named Matthat in Luke’s genealogy.');
G('levi-luke-1','Levi','melchi-luke-1','Luke 3:24','Genealogical Levi near Heli; distinct from Levi son of Jacob and Levi the tax collector.','explicit',['Levi in Luke 3:24']);
G('melchi-luke-1','Melchi','jannai-luke','Luke 3:24','First of two men named Melchi in Luke’s genealogy.');
G('jannai-luke','Jannai','joseph-luke-1','Luke 3:24','Named ancestor in Luke’s genealogy.','explicit',['Jannai','Janna']);
G('joseph-luke-1','Joseph','mattathias-luke-1','Luke 3:24–25','First of multiple genealogical men named Joseph in Luke 3; distinct from Joseph husband of Mary.','explicit',['Joseph in Luke 3:24']);
G('mattathias-luke-1','Mattathias','amos-luke-genealogy','Luke 3:25','First of two men named Mattathias in this portion of Luke’s genealogy.');
G('amos-luke-genealogy','Amos','nahum-luke-genealogy','Luke 3:25','Genealogical ancestor named Amos; distinct from the Old Testament prophet Amos.','explicit',['Amos in Luke 3 genealogy']);
G('nahum-luke-genealogy','Nahum','esli-luke','Luke 3:25','Genealogical ancestor named Nahum; distinct from the Old Testament prophet Nahum.','explicit',['Nahum in Luke 3 genealogy']);
G('esli-luke','Esli','naggai-luke','Luke 3:25','Named ancestor in Luke’s genealogy.');
G('naggai-luke','Naggai','maath-luke','Luke 3:25–26','Named ancestor in Luke’s genealogy.','explicit',['Naggai','Nagge']);
G('maath-luke','Maath','mattathias-luke-2','Luke 3:26','Named ancestor in Luke’s genealogy.');
G('mattathias-luke-2','Mattathias','semein-luke','Luke 3:26','Second Mattathias in this section of Luke’s genealogy.');
G('semein-luke','Semein','josech-luke','Luke 3:26','Named ancestor in Luke’s genealogy.','textual variant',['Semein','Semei']);
G('josech-luke','Josech','joda-luke','Luke 3:26','Named ancestor in Luke’s genealogy; translations/manuscripts preserve several spelling forms.','textual variant',['Josech','Jose','Joseph']);
G('joda-luke','Joda','joanan-luke','Luke 3:26','Named ancestor in Luke’s genealogy.','textual variant',['Joda','Joda/Judah']);
G('joanan-luke','Joanan','rhesa-luke','Luke 3:27','Named ancestor in Luke’s genealogy.','textual variant',['Joanan','Johanan']);
G('rhesa-luke','Rhesa','zerubbabel','Luke 3:27','Named in Luke’s genealogy immediately after Zerubbabel. Scripture outside Luke does not independently establish Rhesa as Zerubbabel’s biological son, so the link remains a Luke genealogical connection rather than an added Old Testament parent record.');
GE(['zerubbabel'],'shealtiel','Luke 3:27','Luke names Zerubbabel in the genealogy immediately after Rhesa and before Shealtiel.');
GE(['shealtiel'],'neri-luke','Luke 3:27','Luke records Shealtiel “of Neri.” Old Testament and Matthew traditions connect Shealtiel differently; Luke’s relationship is preserved without replacing those records.');

// Luke’s line from Neri back to Nathan son of David.
G('neri-luke','Neri','melchi-luke-2','Luke 3:27','Named as Luke’s genealogical predecessor of Shealtiel.');
G('melchi-luke-2','Melchi','addi-luke','Luke 3:28','Second Melchi in Luke’s genealogy.');
G('addi-luke','Addi','cosam-luke','Luke 3:28','Named ancestor in Luke’s genealogy.');
G('cosam-luke','Cosam','elmadam-luke','Luke 3:28','Named ancestor in Luke’s genealogy.');
G('elmadam-luke','Elmadam','er-luke','Luke 3:28','Named ancestor in Luke’s genealogy.','textual variant',['Elmadam','Elmodam']);
G('er-luke','Er','joshua-luke-genealogy','Luke 3:28','Genealogical ancestor named Er; distinct from Er son of Judah and other biblical men named Er.','explicit',['Er in Luke 3 genealogy']);
G('joshua-luke-genealogy','Joshua','eliezer-luke-genealogy','Luke 3:29','Genealogical ancestor named Joshua/Jesus in some older English forms; distinct from Joshua son of Nun and Jesus Christ.','textual variant',['Joshua','Jesus/Jose in some traditions']);
G('eliezer-luke-genealogy','Eliezer','jorim-luke','Luke 3:29','Genealogical ancestor named Eliezer; distinct from Abraham’s servant/kinsman traditions and other Eliezers.','explicit',['Eliezer in Luke 3 genealogy']);
G('jorim-luke','Jorim','matthat-luke-2','Luke 3:29','Named ancestor in Luke’s genealogy.');
G('matthat-luke-2','Matthat','levi-luke-2','Luke 3:29','Second Matthat in Luke’s genealogy.');
G('levi-luke-2','Levi','simeon-luke-genealogy','Luke 3:29','Second genealogical Levi in Luke 3; distinct from Levi son of Jacob and Levi the tax collector.','explicit',['Levi in Luke 3:29']);
G('simeon-luke-genealogy','Simeon','judah-luke-genealogy','Luke 3:30','Genealogical ancestor named Simeon; distinct from Jacob’s son Simeon and Simeon at the temple.','explicit',['Simeon in Luke 3 genealogy']);
G('judah-luke-genealogy','Judah','joseph-luke-2','Luke 3:30','Genealogical ancestor named Judah; distinct from Judah son of Jacob.','explicit',['Judah in Luke 3:30']);
G('joseph-luke-2','Joseph','jonam-luke','Luke 3:30','Another genealogical Joseph in Luke 3; distinct from Joseph husband of Mary.','explicit',['Joseph in Luke 3:30']);
G('jonam-luke','Jonam','eliakim-luke-genealogy','Luke 3:30','Named ancestor in Luke’s genealogy.');
G('eliakim-luke-genealogy','Eliakim','melea-luke','Luke 3:30','Genealogical Eliakim; distinct from Matthew’s Eliakim and Old Testament men named Eliakim.','explicit',['Eliakim in Luke 3']);
G('melea-luke','Melea','menna-luke','Luke 3:31','Named ancestor in Luke’s genealogy.');
G('menna-luke','Menna','mattatha-luke','Luke 3:31','Named ancestor in Luke’s genealogy.','textual variant',['Menna','Menan']);
G('mattatha-luke','Mattatha','nathan-david','Luke 3:31','Named immediately before Nathan son of David in Luke’s genealogy.');
GE(['nathan-david'],'david','Luke 3:31','Luke follows the Davidic line through Nathan son of David rather than Solomon, explicitly naming Nathan in the genealogy.');

// From David to Abraham: enrich established Old Testament people and preserve Luke’s genealogy connections.
GE(['david'],'jesse','Luke 3:31–32','David is explicitly named in Luke’s genealogy.');
GE(['jesse'],'obed','Luke 3:32','Jesse is explicitly named in Luke’s genealogy.');
GE(['obed'],'boaz','Luke 3:32','Obed is explicitly named in Luke’s genealogy.');
GE(['boaz'],'salmon','Luke 3:32','Boaz is explicitly named in Luke’s genealogy.');
GE(['salmon'],'nahshon','Luke 3:32','Luke’s form is rendered Sala/Salmon across translation traditions; the established Salmon record is enriched rather than duplicated.',{aliases:['Sala']});
GE(['nahshon'],'amminadab','Luke 3:32–33','Nahshon is explicitly named in Luke’s genealogy.');

// Luke 3:33 has notable manuscript variation around Admin/Arni/Ram. Preserve the critical-text forms without erasing the Matthew/Chronicles Ram line.
G('admin-luke','Admin','arni-luke','Luke 3:33','Name preserved in many modern critical-text translations between Amminadab and Arni. Other manuscript traditions arrange this section differently.','textual variant',['Admin','Admin/Aram textual tradition']);
G('arni-luke','Arni','hezron-perez','Luke 3:33','Name preserved in many modern critical-text translations before Hezron. Some manuscript traditions instead have Aram/Ram, corresponding more directly to Matthew and Chronicles.','textual variant',['Arni','Aram','Ram?'],[ ]);
merge('arni-luke',{connections:[gc('hezron-perez','Luke 3:33'),C('possible textual identity','ram-ruth','Luke 3:33; Matthew 1:3–4; 1 Chronicles 2:9–10','Some manuscript/translation traditions use Aram/Ram here rather than the critical-text Arni/Admin sequence.')]});
// Remove duplicate predecessor connection introduced by the helper + explanatory merge.
const arni=db.records.find(r=>r.id==='arni-luke');if(arni)arni.connections=arni.connections.filter((c,i,a)=>a.findIndex(x=>x.type===c.type&&x.target===c.target&&x.ref===c.ref)===i;
GE(['amminadab'],'admin-luke','Luke 3:33','Luke’s critical-text sequence places Admin after Amminadab; other textual traditions differ.');
GE(['hezron-perez'],'perez','Luke 3:33','Hezron is explicitly named in Luke’s genealogy.');
GE(['perez'],'judah','Luke 3:33','Perez is explicitly named in Luke’s genealogy.');
GE(['judah'],'jacob','Luke 3:33–34','Judah son of Jacob is explicitly named in Luke’s genealogy.');
GE(['jacob'],'isaac','Luke 3:34','Jacob the patriarch is explicitly named in Luke’s genealogy.');
GE(['isaac'],'abram','Luke 3:34','Isaac is explicitly named in Luke’s genealogy.');
GE(['abram'],'terah','Luke 3:34','Abraham is explicitly named in Luke’s genealogy.',{aliases:['Abraham']});

// Abraham back to Adam.
GE(['terah'],'nahor-ancestor','Luke 3:34','Terah is explicitly named in Luke’s genealogy.');
GE(['nahor-ancestor'],'serug','Luke 3:34–35','Nahor is explicitly named in Luke’s genealogy.');
GE(['serug'],'reu','Luke 3:35','Serug is explicitly named in Luke’s genealogy.');
GE(['reu'],'peleg','Luke 3:35','Reu is explicitly named in Luke’s genealogy.');
GE(['peleg'],'eber','Luke 3:35','Peleg is explicitly named in Luke’s genealogy.');
GE(['eber'],'shelah','Luke 3:35','Eber is explicitly named in Luke’s genealogy.');
G('cainan-luke-postflood','Cainan','arpachshad','Luke 3:35–36','Luke includes a Cainan between Shelah and Arphaxad/Arpachshad, following a genealogy form also found in the Septuagint tradition but absent from the Masoretic Genesis 11 sequence. Kept distinct from the earlier Cainan/Kenan before Mahalaleel.','textual variant',['Cainan after Arphaxad']);
GE(['shelah'],'cainan-luke-postflood','Luke 3:35','Luke’s genealogy places Cainan between Shelah and Arpachshad in many textual traditions.');
GE(['arpachshad'],'shem','Luke 3:36','Arpachshad is explicitly named in Luke’s genealogy.');
GE(['shem'],'noah','Luke 3:36','Shem is explicitly named in Luke’s genealogy.');
GE(['noah'],'lamech-sethite','Luke 3:36','Noah is explicitly named in Luke’s genealogy.');
GE(['lamech-sethite'],'methuselah','Luke 3:36–37','Lamech father of Noah is explicitly named in Luke’s genealogy.');
GE(['methuselah'],'enoch-sethite','Luke 3:37','Methuselah is explicitly named in Luke’s genealogy.');
GE(['enoch-sethite'],'jared','Luke 3:37','Enoch is explicitly named in Luke’s genealogy.');
GE(['jared'],'mahalalel','Luke 3:37','Jared is explicitly named in Luke’s genealogy.');
GE(['mahalalel'],'kenan','Luke 3:37','Mahalaleel/Mahalalel is explicitly named in Luke’s genealogy.');
GE(['kenan'],'enosh','Luke 3:37–38','Kenan appears in Luke under the form Cainan in many English traditions.',{aliases:['Cainan']});
GE(['enosh'],'seth','Luke 3:38','Enos/Enosh is explicitly named in Luke’s genealogy.',{aliases:['Enos']});
GE(['seth'],'adam','Luke 3:38','Seth is explicitly named in Luke’s genealogy.');
addAny(['adam'],'Luke 3:38','Adam closes the human side of Luke’s genealogy. Luke then says “of God”; God is not entered as a human parent record.',{connections:[C('Luke genealogy source statement','God','Luke 3:38','Luke ends the genealogy with Adam “of God”; this is theological origin language, not a human genealogy record for God.')]});

db.scope='Genesis–Luke 3';db.phase=11;
})();