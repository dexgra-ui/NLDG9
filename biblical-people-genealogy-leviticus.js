(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind,gender,parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const C=(type,target,ref='',note='')=>({type,target,ref,note});
const update=(id,refAdd,noteAdd='',connections=[])=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(refAdd&&!r.ref.includes(refAdd))r.ref+=`; ${refAdd}`;if(noteAdd)r.note=`${r.note||''}${r.note?' ':''}${noteAdd}`;if(connections.length)r.connections=[...(r.connections||[]),...connections];};

update('moses','Leviticus 1–27','Leviticus repeatedly names Moses as the recipient and mediator of the LORD’s instructions for Israel.');
update('aaron','Leviticus 1–27','Aaron serves as high priest and receives priestly, purity, and worship instructions with Moses.');
update('nadab-aaron','Leviticus 10:1–2','Nadab dies with Abihu after offering unauthorized fire before the LORD.');
update('abihu','Leviticus 10:1–2','Abihu dies with Nadab after offering unauthorized fire before the LORD.');
update('eleazar-aaron','Leviticus 10:6,12,16–20','Eleazar continues priestly service after the deaths of Nadab and Abihu.');
update('ithamar','Leviticus 10:6,12,16–20','Ithamar continues priestly service after the deaths of Nadab and Abihu.');
update('mishael-uzziel','Leviticus 10:4','Mishael is summoned with Elzaphan to carry Nadab and Abihu outside the camp.');
update('elzaphan-uzziel','Leviticus 10:4','Elzaphan is summoned with Mishael to carry Nadab and Abihu outside the camp.');
update('uzziel-kohath','Leviticus 10:4','Leviticus explicitly calls Uzziel an uncle of Aaron.',[C('nephew','aaron','Leviticus 10:4','Uzziel is called Aaron’s uncle; Aaron is therefore his nephew.')]);

const rows=[
R('shelomith-dibri','Shelomith','Leviticus','Person','female',['dibri'],[],'Leviticus 24:10–11','Israelite woman of the tribe of Dan; daughter of Dibri and mother of the unnamed man involved in the blasphemy case.','explicit',['Shelomith daughter of Dibri']),
R('dibri','Dibri','Leviticus','Person','male',[],[],'Leviticus 24:11','Father of Shelomith; identified with the tribe of Dan.')
];
db.records.push(...rows);
db.scope='Genesis–Leviticus';
db.phase=3;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Genesis','Exodus','Leviticus'])];
})();