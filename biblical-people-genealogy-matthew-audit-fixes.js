(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const merge=(id,p)=>{const r=db.records.find(x=>x.id===id);if(!r)return false;if(p.ref&&!String(r.ref||'').includes(p.ref))r.ref=[r.ref,p.ref].filter(Boolean).join('; ');if(p.note)r.note=[r.note,p.note].filter(Boolean).join(' ');if(p.parents)r.parents=[...new Set([...(r.parents||[]),...p.parents])];if(p.aliases)r.aliases=[...new Set([...(r.aliases||[]),...p.aliases])];if(p.connections)r.connections=[...(r.connections||[]),...p.connections];return true;};
merge('boaz',{parents:['rahab'],ref:'Matthew 1:5',note:'Matthew explicitly adds Rahab as Boaz’s mother alongside the paternal line already established through Salmon.'});
merge('rahab',{connections:[{type:'mother of',target:'boaz',ref:'Matthew 1:5',note:'Matthew explicitly names Rahab as the woman through whom Salmon fathered Boaz.'}]});
merge('daniel-judean',{ref:'Matthew 24:15',note:'Jesus explicitly names Daniel the prophet when referring to the abomination of desolation.'});
})();