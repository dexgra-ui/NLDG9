(()=>{
const db=window.NLDG_BIBLICAL_GENEALOGY;if(!db)return;
const R=(id,name,line,kind='Person',gender='male',parents=[],spouses=[],ref='',note='',certainty='explicit',aliases=[],connections=[])=>({id,name,line,kind,gender,parents,spouses,ref,note,certainty,aliases,connections});
const put=r=>db.records.some(x=>x.id===r.id)?null:db.records.push(r);

put(R('job','Job','Job','Person','male',[],[],'Job 1–42','Man from the land of Uz whose suffering, dialogues, restoration, and family are the center of the book. His wife, seven sons, and three initial daughters are mentioned but not named; only the three daughters born/identified after his restoration receive names in Job 42.'));
put(R('eliphaz-job','Eliphaz the Temanite','Job','Friend / counselor','male',[],[],'Job 2:11; 4–5; 15; 22; 42:7–9','One of Job’s three named friends. The title Temanite is explicit, but Scripture does not identify him with Eliphaz son of Esau, so the two records remain separate.','unresolved identification',['Eliphaz the Temanite']));
put(R('bildad','Bildad the Shuhite','Job','Friend / counselor','male',[],[],'Job 2:11; 8; 18; 25; 42:9','One of Job’s three named friends. “Shuhite” may reflect a people/clan connection, but no direct genealogy to Shuah son of Abraham is stated.','unresolved identification',['Bildad the Shuhite']));
put(R('zophar','Zophar the Naamathite','Job','Friend / counselor','male',[],[],'Job 2:11; 11; 20; 42:9','One of Job’s three named friends. No parentage is stated.','explicit',['Zophar the Naamathite']));
put(R('barachel','Barachel','Job / Elihu','Person','male',[],[],'Job 32:2,6','Father of Elihu; identified as a Buzite. The text does not explicitly identify this Buzite line with Buz son of Nahor.','unresolved identification',['Barachel the Buzite']));
put(R('ram-elihu-kindred','Ram','Job / Elihu','Clan / ancestor designation','unknown',[],[],'Job 32:2','Elihu is described as being of the kindred/family of Ram. This Ram is kept separate from the Ram in Judah’s Davidic genealogy because Job does not identify them.','unresolved identification',['Ram of Elihu’s kindred']));
put(R('elihu-job','Elihu','Job / Elihu','Speaker / counselor','male',['barachel'],[],'Job 32–37','Son of Barachel the Buzite, of the kindred of Ram. Elihu speaks after Job’s three older friends. Distinct from other biblical people named Elihu.','explicit',['Elihu son of Barachel'],[{type:'kindred / clan connection',target:'ram-elihu-kindred',ref:'Job 32:2'}]));
put(R('jemimah','Jemimah','Job family','Person','female',['job'],[],'Job 42:14–15','First of Job’s three named daughters after his restoration; receives an inheritance among her brothers.','explicit',['Jemima']));
put(R('keziah-job','Keziah','Job family','Person','female',['job'],[],'Job 42:14–15','Second of Job’s three named daughters after his restoration; receives an inheritance among her brothers.','explicit',['Kezia']));
put(R('keren-happuch','Keren-Happuch','Job family','Person','female',['job'],[],'Job 42:14–15','Third of Job’s three named daughters after his restoration; receives an inheritance among her brothers.','explicit',['Keren-happuch','Keren Happuch']));

db.scope='Genesis–Job';db.phase=8;db.completedBooks=[...new Set([...(db.completedBooks||[]),'Job'])];
})();