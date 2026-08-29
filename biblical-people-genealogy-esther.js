(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.parents)r.parents=p.parents;if(p.spouses)r.spouses=[...new Set([...(r.spouses||[]),...p.spouses])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);

put(R('ahasuerus-esther','Ahasuerus','Esther / Persia','King / ruler','male',[],['vashti','esther'],'Esther 1–10','Persian king in the Esther narrative. The biblical database records the name as Scripture gives it; historical identification with a particular Persian regnal name belongs to historical notes, not genealogy certainty.'));
put(R('vashti','Vashti','Esther / Persia','Queen','female',[],['ahasuerus-esther'],'Esther 1:9–19','Queen who refuses Ahasuerus’s command and is removed from royal position.'));
for(const n of ['Mehuman','Biztha','Harbona','Bigtha','Abagtha','Zethar','Carcas'])put(R(`esther-chamberlain-${n.toLowerCase()}`,n,'Esther / Persia','Royal eunuch / chamberlain','male',[],[],'Esther 1:10','One of seven chamberlains serving in the presence of King Ahasuerus.'));
for(const n of ['Carshena','Shethar','Admatha','Tarshish','Meres','Marsena','Memucan'])put(R(`esther-prince-${n.toLowerCase()}`,n,'Esther / Persia','Prince / royal counselor','male',[],[],'Esther 1:14–21','One of seven Persian and Median princes/counselors with access to the king.'));

put(R('kish-mordecai','Kish','Esther / Mordecai','Benjamite ancestor','male',[],[],'Esther 2:5–6','Benjamite ancestor in Mordecai’s stated genealogy. The shared name does not identify him with Saul’s father Kish; the exile syntax is also debated over which ancestor is the subject.','unresolved identification',['Kish in Mordecai’s genealogy']));
put(R('shimei-mordecai','Shimei','Esther / Mordecai','Benjamite ancestor','male',['kish-mordecai'],[],'Esther 2:5','Son/descendant of Kish and father/ancestor of Jair in Mordecai’s genealogy. Distinct from other Shimeis.','explicit',['Shimei in Mordecai’s genealogy']));
put(R('jair-mordecai','Jair','Esther / Mordecai','Person / ancestor name','male',['shimei-mordecai'],[],'Esther 2:5','Father/ancestor of Mordecai in the stated Benjamite genealogy. Distinct from Jair the judge and other Jairs.','explicit',['Jair father of Mordecai']));
put(R('mordecai-esther','Mordecai','Esther / Mordecai','Jewish leader / royal official','male',['jair-mordecai'],[],'Esther 2–10','Benjamite Jew, cousin/guardian of Esther, who uncovers a plot, opposes Haman, and later rises to high royal authority. Distinct from the Mordecai named in Ezra 2 / Nehemiah 7 unless Scripture explicitly identifies them.','unresolved identification',['Mordecai the Jew']));
put(R('abihail-esther','Abihail','Esther / Mordecai','Person','male',[],[],'Esther 2:15; 9:29','Father of Esther and uncle/relative of Mordecai. Distinct from other Abihails.','explicit',['Abihail father of Esther'],[{type:'relative / uncle connection',target:'mordecai-esther',ref:'Esther 2:15'}]));
put(R('esther','Esther / Hadassah','Esther / Mordecai','Queen','female',['abihail-esther'],['ahasuerus-esther'],'Esther 2–9','Jewish woman also named Hadassah, daughter of Abihail and younger relative/cousin of Mordecai, who becomes queen and intervenes for her people.','explicit',['Esther','Hadassah'],[{type:'cousin / guardian relationship',target:'mordecai-esther',ref:'Esther 2:7,15','note':'Translations render the exact kinship with Mordecai using cousin/young relative language; Mordecai raises her after her parents die.'}]));

put(R('hegai','Hegai','Esther / Persia','Royal eunuch / keeper of women','male',[],[],'Esther 2:3,8,15','Keeper of the women who favors Esther and oversees her preparation.','explicit',['Hegai','Hege']));
put(R('shaashgaz','Shaashgaz','Esther / Persia','Royal eunuch / keeper of concubines','male',[],[],'Esther 2:14','Keeper of the king’s concubines.'));
put(R('bigthan','Bigthan / Bigthana','Esther / Persia','Royal chamberlain','male',[],[],'Esther 2:21; 6:2','One of two royal chamberlains who plot against Ahasuerus. Name appears Bigthan/Bigthana.','textual variant',['Bigthan','Bigthana']));
put(R('teresh','Teresh','Esther / Persia','Royal chamberlain','male',[],[],'Esther 2:21; 6:2','Royal chamberlain who plots with Bigthan against the king.'));

put(R('hammedatha','Hammedatha','Haman family','Person','male',[],[],'Esther 3:1,10; 8:5; 9:10,24','Father of Haman.'));
put(R('haman','Haman','Haman family','Royal official / antagonist','male',['hammedatha'],['zeresh'],'Esther 3–9','Son of Hammedatha the Agagite, promoted by Ahasuerus and later executed after his plot against the Jews is exposed. Scripture’s “Agagite” designation is preserved without forcing a biological genealogy to Agag.','explicit',['Haman the Agagite']));
put(R('zeresh','Zeresh','Haman family','Person','female',[],['haman'],'Esther 5:10,14; 6:13','Wife of Haman who advises him concerning Mordecai and later warns of his downfall.'));
put(R('hathach','Hathach','Esther / Persia','Royal eunuch / messenger','male',[],[],'Esther 4:5–10','Royal chamberlain appointed to Esther who carries messages between Esther and Mordecai.'));
merge('esther-chamberlain-harbona',{ref:'Esther 7:9',note:'Harbona, one of the king’s chamberlains, tells Ahasuerus about Haman’s gallows prepared for Mordecai.'});

const sons=['Parshandatha','Dalphon','Aspatha','Poratha','Adalia','Aridatha','Parmashta','Arisai','Aridai','Vajezatha'];
for(const n of sons)put(R(`haman-son-${n.toLowerCase()}`,n,'Haman family','Person','male',['haman'],[],'Esther 9:7–10','One of the ten named sons of Haman killed in Susa. Esther explicitly identifies Haman as their father. Zeresh is Haman’s named wife, but Scripture does not individually identify her as the mother of these sons, so no maternal parent is assigned.','explicit',[`${n} son of Haman`]));

db.scope='Genesis–Esther';db.phase=7;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Esther'])];db.completedPhases=[...new Set([...(db.completedPhases||[]),7])];
})();