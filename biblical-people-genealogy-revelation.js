(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='',extra={})=>merge(id,{ref,note,...extra});
const addAny=(ids,ref,note='',extra={})=>{for(const id of ids){if(merge(id,{ref,note,...extra}))return id;}return null;};

put(R('john-revelation','John','Revelation / churches of Asia','Witness / letter sender','male',[],[],'Revelation 1:1,4,9; 22:8','Human witness who identifies himself simply as John, a brother and partner in tribulation, and records the visions sent to the seven churches. Revelation itself does not say “John son of Zebedee” or “John the apostle,” so traditional authorship identification remains possible rather than Scripture-stated.','unresolved identification',['John of Revelation'],[C('possible identity','john-zebedee','Revelation 1:1,4,9; Gospel/apostolic tradition','Ancient Christian tradition commonly identifies the seer with John the apostle, but Revelation itself gives no patronymic or apostolic title.') ]));
add('jesus','Revelation 1:1–22:21','Jesus Christ is explicitly named throughout Revelation as faithful witness, Lamb, ruler, and returning Lord.');
addAny(['david'],'Revelation 3:7; 5:5; 22:16','David is explicitly named in messianic key, root, and offspring imagery.');
addAny(['judah'],'Revelation 5:5','Judah is explicitly named in the title “Lion of the tribe of Judah.”');
put(R('antipas','Antipas','Pergamum church','Witness / martyr','male',[],[],'Revelation 2:13','Jesus names Antipas as “my faithful witness,” killed in Pergamum. No family information is stated.','explicit',['Antipas']));
addAny(['balaam'],'Revelation 2:14','Balaam is explicitly named in the warning to Pergamum.');
addAny(['balak'],'Revelation 2:14','Balak is explicitly named as the one before whom Balaam placed a stumbling block.');
put(R('jezebel-revelation','Jezebel','Thyatira church / Revelation','Woman / self-styled prophetess','female',[],[],'Revelation 2:20–23','Woman in the Thyatira warning called Jezebel, who calls herself a prophetess and misleads servants. The name may be her actual name or a symbolic allusion to the Old Testament queen; Revelation does not explicitly identify her as Ahab’s Jezebel, so the records remain separate.','unresolved identification',['Jezebel of Thyatira'],[C('symbolic/name allusion','jezebel','Revelation 2:20; 1 Kings 16–21','The name evokes the Old Testament Jezebel, but the Thyatira figure is not the same historical person.') ]));
addAny(['moses'],'Revelation 15:3','Moses is explicitly named in the “song of Moses” title.');

// Michael is named in Revelation 12:7 but is an angelic being, not a human person, and remains outside this human people database.
// Gog and Magog in Revelation 20:8 function as collective/national apocalyptic names rather than newly named human individuals.
db.scope='Genesis–Revelation';db.phase=14;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Revelation'])];
db.completedPhases=[...new Set([...(db.completedPhases||[]),14])];
})();