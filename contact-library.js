(()=>{
if(window.NLDG_CONTACT_LIBRARY_LOADED||!window.NLDG_LIBRARY)return;
const item={id:'contact-feedback',type:'Ministry Page',title:'Contact & Feedback',description:'Contact the No Labels, Designed by God team with questions, prayer requests, website feedback, resource suggestions, or collaboration inquiries.',url:'contact.html#contact',category:'Ministry Information',series:'No Labels, Designed by God',scripture:[],book:'',topics:['contact','email','prayer request','feedback','resource suggestion','collaboration','ministry inquiry'],audience:['Individuals','Families','Small Groups','Churches','Leaders'],difficulty:'All Levels',duration:2,featured:false,status:'published',publishedAt:'2026-07-30',updatedAt:'2026-07-30'};
if(!window.NLDG_LIBRARY.some(existing=>existing.id===item.id))window.NLDG_LIBRARY.push(item);
window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(entry=>entry.type==='Study'&&entry.status==='published');
window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(entry=>entry.status==='published');
window.NLDG_CONTACT_LIBRARY_LOADED=true;
})();
