(()=>{
if(window.NLDG_NEW_BELIEVERS_NTV_ES_LOADED)return;
window.NLDG_NEW_BELIEVERS_NTV_ES_LOADED=true;
const steps=window.NEW_BELIEVER_STEPS_ES;
if(!Array.isArray(steps))return;
const replacements=[
  ['“Creo; ayuda mi incredulidad.”','“¡Sí, creo, pero ayúdame a superar mi incredulidad!”'],
  ['“Pero no se haga mi voluntad, sino la Tuya”.','“Sin embargo, quiero que se haga tu voluntad, no la mía”.']
];
const apply=value=>{
  if(typeof value==='string')return replacements.reduce((text,[from,to])=>text.split(from).join(to),value);
  if(Array.isArray(value)){value.forEach((item,index)=>{value[index]=apply(item)});return value;}
  if(value&&typeof value==='object'){Object.keys(value).forEach(key=>{value[key]=apply(value[key])});}
  return value;
};
apply(steps);
window.NLDG_NEW_BELIEVERS_ES_SCRIPTURE_STANDARD={
  version:'NTV',
  attribution:'La Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Todos los derechos reservados.',
  reviewedDirectQuotations:['Marcos 9:24','Mateo 26:39']
};
})();