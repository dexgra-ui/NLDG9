import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const html='.ht'+'ml';
const js='.j'+'s';
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};

const required=['philemon-study'+html,'philemon-study-data'+js,'philemon-study-guide'+js,'philemon-study-data-es'+js,['es','filemon-estudio'+html].join('/'),'nldg-i18n'+js,['es','estudios-biblicos'+html].join('/')];
for(const file of required)if(!exists(file))errors.push(`Missing Filemón bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load('philemon-study-data'+js,'philemon-study-guide'+js);
 const es=load('philemon-study-data-es'+js);
 if(en?.lessons?.length!==3||es?.lessons?.length!==3)errors.push('Filemón must retain 3 English and 3 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Filemón must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`Filemón ${field} count must match English.`);
 for(let i=0;i<3;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Filemón lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('Filemón '))errors.push(`${label}: Scripture reference must use Filemón.`);
 }
 const data=read('philemon-study-data-es'+js);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Filemón contains disallowed Bible version label ${version}.`);
 const l2=es.lessons?.[1],l3=es.lessons?.[2],guides=[...(es.seriesGuideBlocks||[]),...(es.postLessonMapGuideBlocks||[])].map(x=>x.text||'').join(' ');
 if(!l2?.context?.includes('hombre esclavizado')||!l2?.context?.includes('persona como propiedad'))errors.push('Filemón lesson 2 must name slavery and reject treating a person as property.');
 if(!l2?.teaching?.[3]?.body?.includes('consentimiento')||!l2?.teaching?.[3]?.body?.includes('poder desigual'))errors.push('Filemón lesson 2 must preserve consent and unequal-power safeguards.');
 if(!l2?.teaching?.[4]?.body?.includes('“quizás”'))errors.push('Filemón lesson 2 must preserve humility about providence.');
 if(!l3?.teaching?.[1]?.body?.includes('pagar')||!l3?.teaching?.[2]?.body?.includes('camino más seguro'))errors.push('Filemón lesson 3 must preserve restitution and protective mediation.');
 if(!l3?.teaching?.[3]?.body?.includes('nunca deben explotar la gratitud'))errors.push('Filemón lesson 3 must reject spiritual-debt manipulation.');
 for(const phrase of ['la esclavitud viola la dignidad humana','poder','seguridad','consentimiento','restitución','rendición de cuentas','El perdón no borra consecuencias','no elimina límites','restaura automáticamente la confianza'])if(!guides.includes(phrase))errors.push(`Filemón guide must preserve ${phrase}.`);
 const i18n=read('nldg-i18n'+js),hub=read(['es','estudios-biblicos'+html].join('/')),enPage=read('philemon-study'+html),esPage=read(['es','filemon-estudio'+html].join('/'));
 expect('Filemón route pair',i18n,`'philemon-study${html}':'es/filemon-estudio${html}'`);
 expect('Filemón English page',enPage,'nldg-i18n'+js+'?v=1.22.0');
 expect('Filemón Spanish page',esPage,'../nldg-i18n'+js+'?v=1.22.0');
 expect('Filemón Spanish page',esPage,'https://nolabelsdesignedbygod.org/es/filemon-estudio'+html);
 expect('Filemón Spanish page',esPage,'hreflang="en" href="https://nolabelsdesignedbygod.org/philemon-study'+html+'"');
 expect('Spanish study hub',hub,'doce series completas y revisadas');
 expect('Spanish study hub',hub,'href="filemon-estudio'+html+'"');
 expect('Spanish study hub',hub,'3 lecciones completas');
}

if(errors.length){console.error('Spanish Philemon Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Philemon Audit PASSED');
console.log('OK: Filemón retains 3/3 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, bilingual routing, slavery/dignity, consent, power, restitution, boundaries, and reconciliation safeguards are protected.');