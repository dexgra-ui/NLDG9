(()=>{
const items=[
{id:'grief-of-aging',type:'Study',title:'The Grief of Aging',description:'Hold gratitude and grief in the same hand while trusting God with the season you are living now.',url:'study-grief-of-aging.html',category:'Christian Living',series:'Standalone Studies',scripture:['Ecclesiastes 3:1-11','Psalm 90:1-12','Isaiah 46:3-4','2 Corinthians 4:16-18','Psalm 71:17-18'],book:'Various',topics:['aging','grief','gratitude','seasons','hope','purpose','older adults','intergenerational faith'],audience:['Adults','Older Adults','Small Groups','Families','Churches'],difficulty:'All Levels',duration:85,featured:false,status:'published',publishedAt:'2026-08-27',updatedAt:'2026-08-27'}
];
window.NLDG_GRIEF_OF_AGING_LIBRARY=items;
const merge=()=>{
  if(!Array.isArray(window.NLDG_LIBRARY))return false;
  const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
  window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
  window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
  window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
  window.NLDG_GRIEF_OF_AGING_LIBRARY_LOADED=true;
  window.dispatchEvent(new Event('nldg-grief-of-aging-library-ready'));
  return true;
};
if(!merge()){
  let tries=0;
  const timer=setInterval(()=>{tries+=1;if(merge()||tries>=100)clearInterval(timer);},20);
}
})();
