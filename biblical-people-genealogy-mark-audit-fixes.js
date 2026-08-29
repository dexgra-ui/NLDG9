(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const abiathar=db.records.find(r=>r.id==='abiathar');
if(abiathar){abiathar.parents=['ahimelech-priest'];abiathar.ref=[abiathar.ref,'Mark 2:26'].filter(Boolean).join('; ');abiathar.note=[abiathar.note,'Mark names Abiathar in Jesus’ David-and-showbread reference; the established Old Testament priestly parentage remains intact.'].filter(Boolean).join(' ');}
const salome=db.records.find(r=>r.id==='salome-disciple');
if(salome){salome.connections=(salome.connections||[]).filter(c=>c.target!=='mother-zebedee-sons-unnamed');salome.note='Named woman who witnesses the crucifixion and later comes to the tomb with spices. Matthew’s parallel witness list names the mother of Zebedee’s sons where Mark names Salome, making that identification a reasonable comparison, but the unnamed Matthew figure is not turned into a database person or forced as the same woman.';}
})();