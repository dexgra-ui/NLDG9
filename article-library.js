(()=>{
if(window.NLDG_ARTICLE_LIBRARY_LOADED||!window.NLDG_LIBRARY)return;
const items=[
 {id:'article-jesus-loves-you',type:'Article',title:'Jesus Loves You',description:'A sign declaring “Jesus Loves You” carries a powerful message. Christians are called to make those words visible through compassion, kindness, and action.',url:'articles/jesus-loves-you.html',category:'Christian Living',series:'Everyday Discipleship',scripture:['John 13:34-35','1 John 3:18'],book:'John',topics:['Jesus’ love','Christian witness','compassion','service','kindness','discipleship','church'],audience:['Individuals','Families','Small Groups','Churches'],difficulty:'All Levels',duration:5,featured:false,status:'published',publishedAt:'2026-07-30',updatedAt:'2026-07-30'}
];
const existing=new Set(window.NLDG_LIBRARY.map(item=>item.id));
window.NLDG_LIBRARY.push(...items.filter(item=>!existing.has(item.id)));
window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(item=>item.type==='Study'&&item.status==='published');
window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(item=>item.status==='published');
window.NLDG_ARTICLE_LIBRARY_LOADED=true;
})();
