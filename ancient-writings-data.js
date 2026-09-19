(()=>{
const writings=[
  {id:'1-enoch',title:'1 Enoch',url:'ancient-writing-1-enoch.html',passages:['Jude 14–15'],relationship:'direct quotation',canonicalStudies:[{label:'Jude',url:'jude-study.html'}]},
  {id:'jubilees',title:'Jubilees',url:'ancient-writing-jubilees.html',passages:['Genesis','Exodus 1–20'],relationship:'historical background',canonicalStudies:[{label:'Genesis',url:'genesis-study.html'},{label:'Exodus',url:'exodus-study.html'}]},
  {id:'wisdom-solomon',title:'Wisdom of Solomon',url:'ancient-writing-wisdom-solomon.html',passages:['Wisdom tradition'],relationship:'historical background',canonicalStudies:[{label:'Proverbs',url:'proverbs-study.html'}]},
  {id:'sirach',title:'Sirach',url:'other-ancient-writings.html#sirach',passages:['Wisdom tradition'],relationship:'historical background',canonicalStudies:[{label:'Proverbs',url:'proverbs-study.html'}]},
  {id:'maccabees',title:'1 and 2 Maccabees',url:'other-ancient-writings.html#maccabees',passages:['Second Temple historical background'],relationship:'historical background',canonicalStudies:[{label:'Daniel',url:'daniel-study.html'}]},
  {id:'ethiopian-meqabyan',title:'Ethiopian Meqabyan',url:'other-ancient-writings.html#ethiopian-meqabyan',passages:['Kingship and faithfulness background'],relationship:'historical background',canonicalStudies:[{label:'1 Kings',url:'first-kings-study.html'}]},
  {id:'assumption-moses',title:'Assumption / Testament of Moses tradition',url:'other-ancient-writings.html#assumption-moses',passages:['Jude 9'],relationship:'ancient tradition',canonicalStudies:[{label:'Jude',url:'jude-study.html'}]},
  {id:'jannes-jambres',title:'Jannes and Jambres tradition',url:'other-ancient-writings.html#jannes-jambres',passages:['2 Timothy 3:8'],relationship:'ancient tradition',canonicalStudies:[{label:'2 Timothy',url:'second-timothy-study.html'}]},
  {id:'book-jashar',title:'Book of Jashar',url:'other-ancient-writings.html#book-jashar',passages:['Joshua 10:13','2 Samuel 1:18'],relationship:'named source',canonicalStudies:[{label:'Joshua',url:'joshua-study.html'},{label:'2 Samuel',url:'second-samuel-study.html'}]},
  {id:'wars-of-lord',title:'Book of the Wars of the Lord',url:'other-ancient-writings.html#wars-of-lord',passages:['Numbers 21:14'],relationship:'named source',canonicalStudies:[{label:'Numbers',url:'numbers-study.html'}]},
  {id:'nathan-gad',title:'Records of Nathan and Gad',url:'other-ancient-writings.html#nathan-gad',passages:['1 Chronicles 29:29'],relationship:'named records',canonicalStudies:[{label:'1 Chronicles',url:'first-chronicles-study.html'}]},
  {id:'royal-chronicles',title:'Royal chronicles and named records',url:'other-ancient-writings.html#royal-chronicles',passages:['1 Kings 14:19','1 Kings 22:39'],relationship:'named records',canonicalStudies:[{label:'1 Kings',url:'first-kings-study.html'},{label:'2 Kings',url:'second-kings-study.html'}]}
];
window.NLDG_ANCIENT_WRITINGS=writings;
window.NLDG_ANCIENT_WRITINGS_API={
  all:()=>writings.map(item=>({...item,passages:[...item.passages],canonicalStudies:item.canonicalStudies.map(link=>({...link}))})),
  byId:id=>writings.find(item=>item.id===id)||null,
  relatedToPassage:passage=>{
    const needle=String(passage||'').toLowerCase();
    return writings.filter(item=>item.passages.some(ref=>String(ref).toLowerCase().includes(needle)||needle.includes(String(ref).toLowerCase())));
  },
  relatedLink:id=>{
    const item=writings.find(entry=>entry.id===id);
    return item?{label:`Related Ancient Writing: Learn about ${item.title}${item.passages[0]?` and its connection to ${item.passages[0]}`:''}.`,href:item.url,relationship:item.relationship,passages:[...item.passages]}:null;
  }
};
})();