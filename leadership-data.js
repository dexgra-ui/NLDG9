window.NLDG_LEADERSHIP_STUDIES=(window.NLDG_LEADERSHIP_STUDIES||[]).sort((a,b)=>a.number-b.number);
window.NLDG_LEADERSHIP_API={
 all:()=>window.NLDG_LEADERSHIP_STUDIES.map(study=>({...study})),
 byNumber:number=>window.NLDG_LEADERSHIP_STUDIES.find(study=>study.number===Number(number)),
 bySlug:slug=>window.NLDG_LEADERSHIP_STUDIES.find(study=>study.slug===slug)
};
