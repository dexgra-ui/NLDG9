(()=>{
const items=[
{id:'widows-mite',type:'Study',title:'The Widow’s Mite',description:'Read the widow’s offering in its full Gospel context and explore sacrificial faith, religious power, generosity, justice, and care for vulnerable people.',url:'study-widows-mite.html',category:'Christian Living',series:'Standalone Studies',scripture:['Mark 12:38-13:2','Luke 20:45-21:6','Deuteronomy 24:17-22','James 1:27'],book:'Mark',topics:['giving','generosity','stewardship','widows','justice','church leadership','accountability','religious manipulation'],audience:['Adults','Small Groups','Church Leaders','Teachers','Churches'],difficulty:'All Levels',duration:70,featured:false,status:'published',publishedAt:'2026-08-27',updatedAt:'2026-08-27'}
];
window.NLDG_WIDOWS_MITE_LIBRARY=items;
const merge=()=>{
  if(!Array.isArray(window.NLDG_LIBRARY))return false;
  const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
  window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
  window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
  window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
  window.NLDG_WIDOWS_MITE_LIBRARY_LOADED=true;
  window.dispatchEvent(new Event('nldg-widows-mite-library-ready'));
  return true;
};
if(!merge()){
  let tries=0;
  const timer=setInterval(()=>{tries+=1;if(merge()||tries>=100)clearInterval(timer);},20);
}
})();
