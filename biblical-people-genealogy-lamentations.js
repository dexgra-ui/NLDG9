(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
// Lamentations does not name a human author or introduce a named human character in its own text.
// Traditional attribution to Jeremiah is not converted into a Scripture-stated person record here.
db.scope='Genesis–Lamentations';
db.phase=9;
db.completedBooks=[...new Set([...(db.completedBooks||[]),'Lamentations'])];
})();