(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];return true;};
if(!db.records.some(r=>r.id==='simon-leper'))db.records.push(R('simon-leper','Simon','Jesus passion / Bethany','Person','male',[],[],'Matthew 26:6; Mark 14:3','Man called Simon the leper whose house in Bethany is the setting for the anointing of Jesus. The woman who anoints Jesus is not named in Matthew or Mark. Distinct from the many other Simons.','explicit',['Simon the leper']));
else merge('simon-leper',{ref:'Matthew 26:6; Mark 14:3'});
merge('naaman-syria',{ref:'Luke 4:27',note:'Jesus explicitly names Naaman the Syrian while teaching in Nazareth.'});
merge('noah',{ref:'Luke 17:26–27',note:'Jesus explicitly names Noah when comparing the days of Noah with the coming of the Son of Man.'});
merge('lot',{ref:'Luke 17:28–32',note:'Jesus explicitly names Lot and refers to Lot’s unnamed wife in teaching about readiness; the wife remains unnamed in the database.'});
merge('david',{ref:'Luke 6:3; 20:41–44',note:'Luke explicitly names David in the Sabbath grain-field account and in Jesus’ messianic teaching.'});
})();