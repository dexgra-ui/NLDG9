(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const addRef=(id,ref,note='')=>{const r=db.records.find(x=>x.id===id);if(!r)return;if(ref&&!r.ref.includes(ref))r.ref+=`; ${ref}`;if(note&&!r.note.includes(note))r.note=`${r.note||''}${r.note?' ':''}${note}`;};

addRef('moses','Deuteronomy 1–34','Deuteronomy closes with Moses’ death and burial, while Joshua succeeds him.');
addRef('aaron','Deuteronomy 9:20; 10:6; 32:50','Deuteronomy recalls Aaron’s wilderness role and death.');
addRef('eleazar-aaron','Deuteronomy 10:6','Eleazar succeeds Aaron in the priesthood.');
addRef('joshua','Deuteronomy 1:38; 3:21,28; 31; 32:44; 34:9','Joshua son of Nun is commissioned to lead Israel after Moses.');
addRef('caleb-jephunneh','Deuteronomy 1:36','Caleb son of Jephunneh is remembered for following the LORD wholeheartedly.');
addRef('dathan','Deuteronomy 11:6','Deuteronomy recalls what happened to Dathan and Abiram sons of Eliab.');
addRef('abiram-eliab','Deuteronomy 11:6','Deuteronomy recalls what happened to Dathan and Abiram sons of Eliab.');
addRef('eliab-reuben','Deuteronomy 11:6','Named again as father of Dathan and Abiram.');
addRef('sihon','Deuteronomy 1:4; 2:24–36; 3:2,6; 4:46–47; 29:7; 31:4','Remembered as the Amorite king defeated east of the Jordan.');
addRef('og','Deuteronomy 1:4; 3:1–13; 4:47; 29:7; 31:4','Remembered as king of Bashan defeated east of the Jordan.');
addRef('jair-manasseh','Deuteronomy 3:14','Jair’s captured region is remembered as Havvoth-jair.');
addRef('machir','Deuteronomy 3:15','Machir receives Gilead in the Transjordan settlement account.');
addRef('balaam','Deuteronomy 23:4–5','Balaam son of Beor is recalled in the command concerning Ammon and Moab.');
addRef('beor-balaam','Deuteronomy 23:4','Named again as Balaam’s father.');
addRef('esau','Deuteronomy 2:4–8','Esau is named as ancestor of Israel’s relatives in Seir.');
addRef('lot','Deuteronomy 2:9,19','Lot is named as ancestor connected with Moab and Ammon.');
addRef('abram','Deuteronomy 1:8; 6:10; 9:5,27; 29:13; 30:20; 34:4','Abraham is repeatedly named with Isaac and Jacob as recipient of the covenant promises.');
addRef('isaac','Deuteronomy 1:8; 6:10; 9:5,27; 29:13; 30:20; 34:4','Isaac is repeatedly named with Abraham and Jacob in the covenant promises.');
addRef('jacob','Deuteronomy 1:8; 6:10; 9:5,27; 29:13; 30:20; 34:4','Jacob is repeatedly named with Abraham and Isaac in the covenant promises.');

db.scope='Genesis–Deuteronomy';
db.phase=3;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Genesis','Exodus','Leviticus','Numbers','Deuteronomy'])];
db.completedPhases=[...new Set([...(db.completedPhases||[]),1,2,3])];
})();