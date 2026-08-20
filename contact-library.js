(()=>{
if(window.NLDG_CONTACT_LIBRARY_LOADED||!window.NLDG_LIBRARY)return;
const items=[
 {id:'contact-feedback',type:'Ministry Page',title:'Contact & Feedback',description:'Contact the No Labels, Designed by God team with questions, prayer requests, website feedback, resource suggestions, or collaboration inquiries.',url:'contact.html#contact',category:'Ministry Information',series:'No Labels, Designed by God',scripture:[],book:'',topics:['contact','email','prayer request','feedback','resource suggestion','collaboration','ministry inquiry'],audience:['Individuals','Families','Small Groups','Churches','Leaders'],difficulty:'All Levels',duration:2,featured:false,status:'published',publishedAt:'2026-07-30',updatedAt:'2026-08-20'},
 {id:'prayer-center',type:'Prayer Resource',title:'Prayer Center',description:'Submit a private prayer request, request public sharing after review, pray for approved requests, and share answered-prayer updates with privacy and safety safeguards.',url:'prayer.html',category:'Prayer',series:'No Labels, Designed by God',scripture:[],book:'',topics:['prayer','prayer request','prayer wall','private prayer','public prayer','answered prayer','prayer care','intercession'],audience:['Individuals','Families','Small Groups','Churches','Leaders'],difficulty:'All Levels',duration:3,featured:false,status:'published',publishedAt:'2026-08-20',updatedAt:'2026-08-20'}
];
const existing=new Set(window.NLDG_LIBRARY.map(entry=>entry.id));
window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(entry=>entry.type==='Study'&&entry.status==='published');
window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(entry=>entry.status==='published');
window.NLDG_CONTACT_LIBRARY_LOADED=true;
})();
