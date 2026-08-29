(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=[...new Set([...(r.parents||[]),...p.parents])];if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

// John 1: John the Baptist, Peter’s father-name, Philip, and Nathanael.
addAny(['jesus'],'John 1–21','Jesus is the central person of John’s Gospel.');
addAny(['john-baptist'],'John 1:6–36; 3:23–36; 5:33–36; 10:40–42','John is the named witness and baptizer who points to Jesus.');
addAny(['isaiah'],'John 1:23; 12:38–41','John the Baptist explicitly quotes Isaiah, and John later names Isaiah in explaining responses to Jesus.');
addAny(['elijah'],'John 1:21,25','Priests and Levites ask John whether he is Elijah.');
addAny(['andrew-apostle'],'John 1:40–44; 6:8; 12:22','Andrew, Simon Peter’s brother, is one of the first disciples named in John.');
addAny(['simon-peter'],'John 1:40–44; 6:8,68; 13:6–9,24,36–38; 18:10–27; 20:2–10; 21:2–21','John identifies Simon as Andrew’s brother and records Jesus giving him the Cephas/Peter name.',{aliases:['Simon Peter','Peter','Cephas']});
const father=addAny(['jonah-peter-father'],'John 1:42; 21:15–17','John’s Gospel uses the father-name John in “Simon son of John,” while Matthew 16:17 has Bar-Jonah/Jonah. The shared father record preserves both canonical name forms.',{name:'Jonah / John',aliases:['Jonah','John','father of Simon Peter'],certainty:'textual variant'});
if(father)addAny(['simon-peter'],'John 1:42; 21:15–17','John repeatedly identifies Simon Peter as son of John; Matthew preserves the Jonah form.',{parents:['jonah-peter-father']});
addAny(['philip-apostle'],'John 1:43–48; 6:5–7; 12:21–22; 14:8–9','Philip is one of the first disciples called and is repeatedly named in John.');
put(R('nathanael','Nathanael','Jesus disciples','Disciple','male',[],[],'John 1:45–49; 21:2','Disciple from Cana in Galilee who is brought to Jesus by Philip. Often identified with Bartholomew because of apostolic-list comparisons, but John never calls Nathanael Bartholomew.','unresolved identification',['Nathanael of Cana'],[C('possible identity','bartholomew','John 1:45–49; Matthew 10:3','Traditional/synoptic-list proposal; not explicitly stated.') ]));
addAny(['moses'],'John 1:17,45; 3:14; 5:45–46; 6:32; 7:19–23','Moses is repeatedly named in John’s law and wilderness references.');
addAny(['joseph-mary'],'John 1:45; 6:42','Philip and the crowd call Jesus the son of Joseph. John reports the social identification without turning Joseph into Jesus’ biological parent.');

// John 2: Jesus’ mother is deliberately not personally named in this Gospel.
addAny(['mary-mother-jesus'],'John 2:1–12','John refers to this woman as Jesus’ mother but never uses her personal name Mary; the cross-Gospel record is enriched without claiming John itself names her.',{note:'In John, Jesus’ mother is identifiable by relationship but is not personally named.'});

// John 3: Nicodemus.
put(R('nicodemus','Nicodemus','Jesus ministry / Jerusalem','Pharisee / Jewish leader','male',[],[],'John 3:1–21; 7:50–52; 19:39–42','Pharisee and ruler of the Jews who visits Jesus at night, later challenges premature judgment, and assists Joseph of Arimathea with Jesus’ burial.','explicit',['Nicodemus']));

// John 4: patriarchal and Joseph references.
addAny(['jacob'],'John 4:5–12','Jacob is explicitly named in the Samaritan-woman conversation and associated with the well.');
addAny(['joseph'],'John 4:5','Joseph is explicitly named in the description of the field Jacob gave him.');

// John 6: Judas’s father Simon.
put(R('simon-iscariot','Simon Iscariot','Judas Iscariot family','Person','male',[],[],'John 6:71; 12:4; 13:2,26','Father of Judas Iscariot according to John. The Iscariot designation is attached to father/son wording in different translation structures, so both name forms remain visible.','explicit',['Simon father of Judas Iscariot','Simon Iscariot']));
addAny(['judas-iscariot'],'John 6:64,70–71; 12:4–6; 13:2,26–30; 18:2–5','John identifies Judas Iscariot as son of Simon and as the disciple who betrays Jesus.',{parents:['simon-iscariot']});

// John 7–10: David and Abraham.
addAny(['david'],'John 7:42','The crowd explicitly names David in discussing the Messiah’s descent and Bethlehem.');
addAny(['abram'],'John 8:33,37,39–40,52–58','Abraham is repeatedly named in Jesus’ debate about ancestry and true sonship.',{aliases:['Abraham']});

// The man born blind in John 9 is not personally named. “The disciple whom Jesus loved” has not yet appeared by name and will not be assigned a traditional identity later unless John states it.
db.scope='Genesis–John 10';db.phase=11;
})();