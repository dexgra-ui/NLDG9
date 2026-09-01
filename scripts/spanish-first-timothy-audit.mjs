import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const rejectVersion=(label,source,version)=>{if(new RegExp(`\\b${version}\\b`).test(source))errors.push(`${label}: contains disallowed Bible version label ${JSON.stringify(version)}`)};
const html='.ht'+'ml';
const js='.j'+'s';
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};

const enPage='first-timothy-study'+html;
const enData='first-timothy-study-data'+js;
const enGuide='first-timothy-study-guide'+js;
const esData='first-timothy-study-data-es'+js;
const esPage=['es','primera-timoteo-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing 1 Timoteo bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==7||es?.lessons?.length!==7)errors.push('1 Timoteo must retain 7 English and 7 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('1 Timoteo must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`1 Timoteo ${field} count must match English.`);
 for(let i=0;i<7;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`1 Timoteo lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('1 Timoteo '))errors.push(`${label}: Scripture reference must use 1 Timoteo.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('1 Timoteo Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6,l7]=es.lessons||[];
 if(!l1?.teaching?.[2]?.body?.includes('estatus')||!l1?.teaching?.[4]?.body?.includes('no en una insignia de superioridad'))errors.push('1 Timoteo lesson 1 must preserve anti-control and mercy-over-superiority safeguards.');
 if(!l2?.teaching?.[4]?.body?.includes('mujer aprenda')||!l2?.teaching?.[5]?.body?.includes('dignidad de las mujeres')||!l2?.teaching?.[5]?.body?.includes('silenciar informes de daño'))errors.push('1 Timoteo lesson 2 must protect women as learners, dignity, and reports of harm.');
 if(!l3?.teaching?.[1]?.body?.includes('no exige una familia perfecta')||!l3?.teaching?.[2]?.body?.includes('ministerio les perteneciera')||!l3?.teaching?.[4]?.body?.includes('evaluación responsable'))errors.push('1 Timoteo lesson 3 must preserve family agency, anti-domination, and tested-character safeguards.');
 if(!l4?.teaching?.[2]?.body?.includes('no significa castigo')||!l4?.teaching?.[2]?.body?.includes('ganar el amor de Dios'))errors.push('1 Timoteo lesson 4 must keep grace-driven training distinct from punishment and earning God’s love.');
 if(!l5?.teaching?.[1]?.body?.includes('acceso sexual')||!l5?.teaching?.[3]?.body?.includes('familia es ausente, abusiva o incapaz')||!l5?.teaching?.[4]?.body?.includes('no debe avergonzar'))errors.push('1 Timoteo lesson 5 must protect against sexual exploitation, family abandonment, and shaming vulnerable people.');
 if(!l6?.teaching?.[1]?.body?.includes('informes creíbles')||!l6?.teaching?.[1]?.body?.includes('documentar')||!l6?.teaching?.[3]?.body?.includes('donaciones')||!l6?.teaching?.[4]?.body?.includes('tratamiento')||!l6?.teaching?.[5]?.body?.includes('trata humana')||!l6?.teaching?.[5]?.body?.includes('explotación laboral'))errors.push('1 Timoteo lesson 6 must preserve evidence, impartiality, health, and anti-slavery safeguards.');
 if(!l7?.teaching?.[1]?.body?.includes('no exige negar pobreza')||!l7?.teaching?.[2]?.body?.includes('dinero en sí mismo')||!l7?.teaching?.[4]?.body?.includes('dispuestos a compartir')||!l7?.teaching?.[5]?.body?.includes('no con superioridad intelectual'))errors.push('1 Timoteo lesson 7 must preserve nuanced contentment, money, generosity, and humility safeguards.');
 for(const lesson of es.lessons||[]){
  for(const phrase of ['terminar la conversación','informes creíbles','dignidad de las mujeres','avergonzar a personas necesitadas','defender la esclavitud'])if(!lesson?.caution?.includes(phrase))errors.push(`1 Timoteo lesson ${lesson?.number}: shared guidance must preserve ${phrase}.`);
 }
 const guideText=[...(es.seriesOverviewParagraphs||[]),...(es.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])]),...(es.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])])].join(' ');
 for(const phrase of ['textos sobre juicio, género, liderazgo, esclavitud o dinero','silenciar a personas vulnerables','Nunca presiones a nadie a revelar','rendición de cuentas basada en evidencia','dignidad humana','Jesús es el único Mediador'])if(!guideText.includes(phrase))errors.push(`1 Timoteo guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('1 Timoteo route pair',i18n,`'first-timothy-study${html}':'es/primera-timoteo-estudio${html}'`);
 expect('1 Timothy English page',english,'nldg-i18n'+js+'?v=1.25.0');
 expect('1 Timoteo Spanish page',spanish,'../nldg-i18n'+js+'?v=1.25.0');
 expect('1 Timoteo Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/primera-timoteo-estudio'+html);
 expect('1 Timoteo Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-timothy-study'+html+'"');
 expect('Spanish study hub',hub,'quince series completas y revisadas');
 expect('Spanish study hub',hub,'href="primera-timoteo-estudio'+html+'"');
 expect('Spanish study hub',hub,'1 Timoteo: Sana enseñanza, carácter, cuidado y ministerio fiel');
 expect('Spanish study hub',hub,'7 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.25.0');
}

if(errors.length){console.error('Spanish 1 Timothy Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Timothy Audit PASSED');
console.log('OK: 1 Timoteo retains 7/7 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, women’s dignity, leadership accountability, vulnerable-person care, slavery, money, and evidence safeguards are protected.');