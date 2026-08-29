(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.name)r.name=p.name;if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];if(p.certainty)r.certainty=p.certainty;return true;};
const put=r=>db.records.some(x=>x.id===r.id)?merge(r.id,r):db.records.push(r);
const add=(id,ref,note='')=>merge(id,{ref,note});

// Historical names preserved in superscriptions.
add('david','Psalms: numerous Davidic superscriptions; Psalm 18; 78:70; 89; 132','Psalms repeatedly names David both in superscriptions and in the poetic/historical material.');
add('absalom','Psalm 3 superscription','Psalm 3 connects David’s prayer with his flight from Absalom his son.');
put(R('cush-benjamite','Cush the Benjamite','Psalms / David superscriptions','Person','male',[],[],'Psalm 7 superscription','Named Benjamite concerning whose words David sings. Scripture gives no further genealogy, and he is not identified with any other Cush.','explicit',['Cush the Benjamite']));
add('saul','Psalm 18 superscription; Psalm 52 superscription; Psalm 59 superscription','Several Davidic psalm superscriptions name Saul in their historical settings.');
put(R('abimelech-psalm34','Abimelech','Psalms / David superscriptions','King / ruler name','male',[],[],'Psalm 34 superscription','The Psalm 34 heading says David changed his behavior before Abimelech, while 1 Samuel 21 names the Gath ruler Achish. The database preserves both names and does not force Abimelech to be one of the Genesis kings.','textual variant',['Abimelech in Psalm 34'],[{type:'parallel narrative / possible royal title',target:'achish',ref:'Psalm 34 superscription; 1 Samuel 21:10–15'}]));
add('achish','Psalm 34 superscription parallel','First Samuel names Achish in the incident that Psalm 34’s superscription associates with Abimelech; the name difference remains visible.');
add('nathan-prophet','Psalm 51 superscription','Psalm 51’s heading names Nathan the prophet coming to David after the Bathsheba episode.');
add('bathsheba','Psalm 51 superscription','Psalm 51’s heading explicitly names Bathsheba in its historical setting.');
add('doeg','Psalm 52 superscription','Psalm 52’s heading names Doeg the Edomite reporting David’s visit to Ahimelech.');
add('ahimelech-priest','Psalm 52 superscription','Psalm 52’s heading names Ahimelech in the Nob episode.');
add('joab','Psalm 60 superscription','The Psalm 60 heading names Joab returning and striking Edom in the Valley of Salt.');

// Named authors/directors in headings.
put(R('asaph-singer','Asaph','Levitical singers','Singer / Levite','male',[],[],'Psalms 50; 73–83 superscriptions','Asaph is named in multiple psalm superscriptions. The Chronicles record identifies Asaph the singer in the Levitical music ministry.'));
put(R('jeduthun','Jeduthun','Levitical singers','Singer / music leader','male',[],[],'Psalms 39, 62, 77 superscriptions','Named in several psalm headings as a music-leadership designation/person. Chronicles also names Jeduthun in temple music; the same-name connection is retained without creating a second person if already present.'));
put(R('sons-korah-psalms','Sons of Korah','Psalms / Korahites','People group / clan','unknown',['korah-izhar'],[],'Psalms 42; 44–49; 84–85; 87–88 superscriptions','Collective Korahite singer designation in psalm headings. Stored as a group rather than pretending the phrase names one individual.'));
put(R('heman-ezrahite','Heman the Ezrahite','Psalms / wisdom singers','Psalmist / sage','male',[],[],'Psalm 88 superscription','Named in the Psalm 88 heading. Because Chronicles contains both Heman the Levitical singer and Heman son of Zerah, and the heading calls this Heman an Ezrahite while also associating the psalm with the sons of Korah, identity is not forced.','unresolved identification',['Heman the Ezrahite'],[{type:'possible identity',target:'heman-singer',ref:'Psalm 88 superscription; 1 Chronicles 6:33–38'},{type:'possible identity',target:'heman-zerah',ref:'Psalm 88 superscription; 1 Chronicles 2:6'}]));
put(R('ethan-ezrahite','Ethan the Ezrahite','Psalms / wisdom singers','Psalmist / sage','male',[],[],'Psalm 89 superscription','Named in the Psalm 89 heading. Chronicles names Ethan son of Zerah and a separate Merarite singer named Ethan; the Psalm heading alone does not require which one is intended.','unresolved identification',['Ethan the Ezrahite'],[{type:'possible identity',target:'ethan-zerah',ref:'Psalm 89 superscription; 1 Chronicles 2:6'},{type:'possible identity',target:'ethan-singer',ref:'Psalm 89 superscription; 1 Chronicles 6:44'}]));
add('solomon','Psalms 72 and 127 superscriptions','Solomon is named in the headings of Psalms 72 and 127.');
add('moses','Psalm 90 superscription; Psalms 99:6; 103:7; 105:26; 106:16,23,32','Psalm 90 is titled as a prayer of Moses; later historical psalms also name Moses.');

// Historical names in the body of Psalms.
add('samuel','Psalm 99:6','Psalm 99 names Samuel with Moses and Aaron among those who called on the LORD.');
add('aaron','Psalms 99:6; 105:26; 106:16','Historical psalms name Aaron alongside Moses.');
add('phinehas','Psalm 106:30','Psalm 106 names Phinehas in its retelling of the Peor crisis.');
add('abram','Psalms 47:9; 105:6,9,42','Psalms names Abraham in covenant and historical remembrance.');
add('isaac','Psalm 105:9','Psalm 105 names Isaac in the covenant line.');
add('jacob','Psalm 105:10','Psalm 105 names Jacob in the covenant line; many other psalms use Jacob/Israel collectively for the nation.');
add('joseph','Psalm 105:17','Psalm 105 names Joseph in its historical retelling.');
add('melchizedek','Psalm 110:4','Psalm 110 names Melchizedek in the declaration of priesthood “after the order of Melchizedek.”');
add('sihon','Psalms 135:11; 136:19','Psalms remember Sihon king of the Amorites among Israel’s defeated kings.');
add('og','Psalms 135:11; 136:20','Psalms remember Og king of Bashan among Israel’s defeated kings.');

// Terms that resemble personal names but are not entered as people are intentionally excluded: Mahalath and similar heading terms are musical/liturgical terms in context; Rahab in poetic passages can symbolize Egypt and is not silently linked to Rahab of Jericho.
db.scope='Genesis–Psalms';db.phase=8;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Psalms'])];
})();