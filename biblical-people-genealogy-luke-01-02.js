(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

put(R('theophilus','Theophilus','Luke / recipient','Recipient','male',[],[],'Luke 1:3','Named recipient addressed as “most excellent Theophilus.” The Gospel does not state his family or office.','explicit',['Theophilus']));
add('herod-great','Luke 1:5','Luke dates John the Baptist’s family story to the days of Herod king of Judea.');

// John the Baptist’s stated family.
put(R('zechariah-john-baptist','Zechariah','John the Baptist family','Priest','male',[],['elizabeth'],'Luke 1:5–23,40,59–79; 3:2','Priest of the division of Abijah, husband of Elizabeth and father of John the Baptist. Distinct from the many Old Testament men named Zechariah.','explicit',['Zechariah father of John the Baptist'],[C('priestly division','abijah-priestly-division-luke','Luke 1:5','Luke names the division of Abijah; this is a priestly course designation rather than a newly identified contemporary person.') ]));
put(R('abijah-priestly-division-luke','Abijah','Priestly divisions','Priestly division / ancestor name','unknown',[],[],'Luke 1:5','Name of the priestly division to which Zechariah belongs. Luke does not present Abijah here as a contemporary individual, so this record is a division/ancestor-name label rather than a living-person claim.','unresolved identification',['Division of Abijah']));
put(R('elizabeth','Elizabeth','John the Baptist family','Person','female',[],['zechariah-john-baptist'],'Luke 1:5–7,13,24–25,36–45,57–60','Wife of Zechariah, mother of John the Baptist, and explicitly described as descended from Aaron. Mary is called her relative, but Luke does not specify the exact degree of kinship.','explicit',['Elizabeth mother of John'],[C('descendant of','aaron','Luke 1:5','Luke calls Elizabeth one of the daughters/descendants of Aaron.'),C('relative','mary-mother-jesus','Luke 1:36')]));
add('john-baptist','Luke 1:13–17,57–66,76–80; 3:2',{},{parents:['zechariah-john-baptist','elizabeth']});
// Correct the merge above with a descriptive note; keep parentage explicit.
merge('john-baptist',{note:'Luke explicitly names Zechariah and Elizabeth as John’s father and mother, adding the family relationships Matthew and Mark did not state.',parents:['zechariah-john-baptist','elizabeth']});

// Mary, Joseph, Jesus, and named ancestral references in Luke 1.
add('mary-mother-jesus','Luke 1:26–56; 2:5–51','Mary is the virgin betrothed to Joseph, mother of Jesus, and relative of Elizabeth.',{connections:[C('relative','elizabeth','Luke 1:36')]});
add('joseph-mary','Luke 1:27; 2:4–5,16,33,43,48','Joseph is betrothed/husband to Mary and is explicitly of the house of David in Luke’s birth narrative.',{connections:[C('descendant / house of','david','Luke 1:27; 2:4')]});
add('jesus','Luke 1:31–35; 2:7–52','Jesus is named before birth and is born to Mary; Luke calls Joseph his parent/father in household speech while preserving the miraculous-conception account.');
addAny(['david'],'Luke 1:27,32,69; 2:4,11','David is explicitly named in Jesus’ royal-house and messianic framing.');
addAny(['jacob'],'Luke 1:33','Jacob is explicitly named in the promise concerning the house of Jacob.');
addAny(['abram'],'Luke 1:55,73','Abraham is explicitly named in Mary’s song and Zechariah’s prophecy.',{aliases:['Abraham']});
addAny(['aaron'],'Luke 1:5','Aaron is explicitly named as the ancestral line of Elizabeth.');

// Luke 2 historical rulers.
put(R('augustus','Caesar Augustus','Roman Empire','Emperor / ruler','male',[],[],'Luke 2:1','Roman emperor named in the decree associated with the census. “Caesar” is an imperial title; Augustus is the personal/regnal designation given by Luke.','explicit',['Augustus Caesar','Caesar Augustus']));
put(R('quirinius','Quirinius','Roman Syria','Governor / ruler','male',[],[],'Luke 2:2','Named as governor of Syria in Luke’s census notice.','explicit',['Quirinius governor of Syria','Cyrenius']));

// Luke 2 temple witnesses.
put(R('simeon-temple','Simeon','Jesus infancy / temple','Devout witness','male',[],[],'Luke 2:25–35','Righteous and devout man in Jerusalem who takes the infant Jesus in his arms and blesses God. Distinct from the patriarch Simeon and other biblical Simeons.','explicit',['Simeon in the temple']));
put(R('phanuel','Phanuel','Anna family','Person','male',[],[],'Luke 2:36','Father of Anna the prophetess.'));
put(R('anna-prophetess','Anna','Anna family','Prophetess','female',['phanuel'],[],'Luke 2:36–38','Prophetess, daughter of Phanuel, explicitly from the tribe of Asher. She speaks about Jesus to those awaiting Jerusalem’s redemption.','explicit',['Anna daughter of Phanuel'],[C('tribe / descendant of','asher','Luke 2:36')]));
addAny(['asher'],'Luke 2:36','Asher is explicitly named as Anna’s tribal ancestry.');

// Gabriel is explicitly named in Luke 1 but is an angelic being, not a human person; he is intentionally outside this human people/genealogy database.
db.scope='Genesis–Luke 2';db.phase=11;
})();