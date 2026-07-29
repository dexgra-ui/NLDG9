(()=>{
if(window.NLDG_DEVOTIONAL_LIBRARY_LOADED||!window.NLDG_LIBRARY)return;
const items=[
 {id:'devotional-when-god-feels-silent',type:'Devotional',title:'When God Feels Silent',description:'There are seasons when God seems silent, but His silence is never His absence. Learn to trust His faithfulness even when you cannot hear His voice.',url:'devotional.html?id=when-god-feels-silent',category:'Faith',series:'No Labels Devotionals',scripture:['Psalm 13:1-6','Psalm 13:5-6'],book:'Psalms',topics:['faith','waiting','unanswered prayer','God’s presence','trust','lament','unfailing love'],audience:['Individuals','Families','Small Groups'],difficulty:'All Levels',duration:6,featured:false,status:'published',publishedAt:'2026-07-28',updatedAt:'2026-07-28'}
];
const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
window.NLDG_DEVOTIONAL_LIBRARY_LOADED=true;
})();
