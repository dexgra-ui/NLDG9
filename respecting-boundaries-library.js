(()=>{
const items=[
{id:'respecting-boundaries-6-9',type:'Study',title:'Respecting Boundaries — Ages 6–9',description:'Teach optional affection, safe play, stopping when asked, trusted adults, and the memory line Ask. Listen. Respect. Stop. Tell.',url:'respecting-boundaries.html?view=lesson-6-9',category:'Christian Living',series:'Respecting Boundaries',scripture:['Genesis 1:26-27','Luke 6:31','1 Corinthians 13:4-5','Galatians 5:22-23'],book:'Various',topics:['consent','boundaries','body safety','dignity','trusted adults','children','safeguarding'],audience:['Children Ages 6–9','Parents','Caregivers','Ministry Leaders'],difficulty:'All Levels',duration:40,status:'published',publishedAt:'2026-10-04'},
{id:'respecting-boundaries-10-13',type:'Study',title:'Respecting Boundaries — Ages 10–13',description:'Explore consent, peer pressure, digital boundaries, grooming warning signs, spiritual pressure, and asking trusted adults for help.',url:'respecting-boundaries.html?view=lesson-10-13',category:'Christian Living',series:'Respecting Boundaries',scripture:['Genesis 1:26-27','Luke 6:31','1 Corinthians 13:4-5','Philippians 2:3-4','Galatians 5:22-23'],book:'Various',topics:['consent','boundaries','digital safety','peer pressure','grooming','dignity','preteens','safeguarding'],audience:['Preteens Ages 10–13','Parents','Caregivers','Ministry Leaders'],difficulty:'All Levels',duration:55,status:'published',publishedAt:'2026-10-04'},
{id:'respecting-boundaries-14-18',type:'Study',title:'Respecting Boundaries — Ages 14–18',description:'A Christian study of consent, dating, impairment, power differences, digital sexual content, controlling relationships, and spiritual manipulation.',url:'respecting-boundaries.html?view=lesson-14-18',category:'Christian Living',series:'Respecting Boundaries',scripture:['Genesis 1:26-27','Luke 6:31','1 Corinthians 13:4-5','Philippians 2:3-4','1 Thessalonians 4:3-6','Mark 10:42-45','Galatians 5:22-23'],book:'Various',topics:['consent','boundaries','dating','impairment','coercion','digital safety','power','teenagers','safeguarding'],audience:['Teens Ages 14–18','Parents','Caregivers','Ministry Leaders'],difficulty:'All Levels',duration:70,status:'published',publishedAt:'2026-10-04'}
];
window.NLDG_RESPECTING_BOUNDARIES_LIBRARY=items;
const merge=()=>{
  if(!Array.isArray(window.NLDG_LIBRARY))return false;
  const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
  window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
  window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
  window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
  window.NLDG_RESPECTING_BOUNDARIES_LIBRARY_LOADED=true;
  window.dispatchEvent(new Event('nldg-respecting-boundaries-library-ready'));
  return true;
};
if(!merge()){
  let tries=0;
  const timer=setInterval(()=>{tries+=1;if(merge()||tries>=100)clearInterval(timer);},20);
}
})();
