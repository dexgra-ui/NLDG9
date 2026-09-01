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
const guideText=s=>[
 ...(s.seriesOverviewParagraphs||[]),
 ...(s.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[]),...(x.paragraphs||[])]),
 ...(s.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[]),...(x.paragraphs||[])])
].join(' ');

const enPage='colossians-study'+html;
const enData='colossians-study-data'+js;
const enGuide='colossians-study-guide'+js;
const esData='colossians-study-data-es'+js;
const esPage=['es','colosenses-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Colosenses bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)errors.push('Colosenses must retain 6 English and 6 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Colosenses must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`Colosenses ${field} count must match English.`);
 for(let i=0;i<6;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Colosenses lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Colosenses '))errors.push(`${label}: Scripture reference must use Colosenses.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('Colosenses Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6]=es.lessons||[];
 if(!l1?.caution?.includes('tabla de rendimiento')||!l1?.caution?.includes('fluye de la gracia'))errors.push('Colosenses lesson 1 must preserve grace-over-performance safeguards.');
 if(!l2?.teaching?.[1]?.body?.includes('no está diciendo que Él fue creado')||!l2?.caution?.includes('plena divinidad')||!l2?.caution?.includes('primera criatura'))errors.push('Colosenses lesson 2 must preserve Christ-deity and firstborn safeguards.');
 if(!l3?.teaching?.[0]?.body?.includes('no porque el dolor sea bueno')||!l3?.teaching?.[1]?.body?.includes('no añade nada a la cruz')||!l3?.teaching?.[3]?.body?.includes('dependencia malsana')||!l3?.caution?.includes('abuso')||!l3?.caution?.includes('agotamiento')||!l3?.caution?.includes('daño evitable'))errors.push('Colosenses lesson 3 must preserve non-romanticized suffering, complete atonement, and anti-dependence safeguards.');
 if(!l4?.teaching?.[1]?.body?.includes('no condena la educación')||!l4?.teaching?.[4]?.body?.includes('superioridad')||!l4?.caution?.includes('medicina')||!l4?.caution?.includes('consejería')||!l4?.caution?.includes('ciencia')||!l4?.caution?.includes('cultura'))errors.push('Colosenses lesson 4 must preserve anti-elitist and non-anti-intellectual safeguards.');
 if(!l5?.teaching?.[3]?.body?.includes('valor de una persona')||!l5?.teaching?.[4]?.body?.includes('límites')||!l5?.teaching?.[4]?.body?.includes('seguridad')||!l5?.caution?.includes('reconciliación inmediata')||!l5?.caution?.includes('abuso no arrepentido')||!l5?.caution?.includes('restaurar acceso inseguro'))errors.push('Colosenses lesson 5 must preserve dignity, forgiveness, boundary, and safety safeguards.');
 if(!l6?.teaching?.[0]?.body?.includes('Ningún cónyuge')||!l6?.teaching?.[0]?.body?.includes('pastor')||!l6?.teaching?.[1]?.body?.includes('violencia')||!l6?.teaching?.[1]?.body?.includes('coerción')||!l6?.teaching?.[1]?.body?.includes('violación sexual')||!l6?.teaching?.[1]?.body?.includes('Buscar seguridad no es rebelión')||!l6?.teaching?.[3]?.body?.includes('sin presentar la esclavitud como ideal de Dios')||!l6?.teaching?.[3]?.body?.includes('justicia, dignidad, seguridad')||!l6?.caution?.includes('trata de personas')||!l6?.caution?.includes('explotación laboral')||!l6?.caution?.includes('apoyo profesional'))errors.push('Colosenses lesson 6 must preserve anti-abuse, anti-slavery, workplace-justice, and safety-response safeguards.');
 const guide=guideText(es);
 for(const phrase of ['no que el Hijo haya sido creado','no rechaza la educación','medicina','consejería','Nunca usen sumisión o perdón','abuso','coerción','peligro','injusticia','explotación'])if(!guide.includes(phrase))errors.push(`Colosenses guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('Colosenses route pair',i18n,`'colossians-study${html}':'es/colosenses-estudio${html}'`);
 expect('Colossians English page',english,'nldg-i18n'+js+'?v=1.28.0');
 expect('Colosenses Spanish page',spanish,'../nldg-i18n'+js+'?v=1.28.0');
 expect('Colosenses Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/colosenses-estudio'+html);
 expect('Colosenses Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/colossians-study'+html+'"');
 expect('Spanish study hub',hub,'href="colosenses-estudio'+html+'"');
 expect('Spanish study hub',hub,'Colosenses: La supremacía y suficiencia de Cristo');
 expect('Spanish study hub',hub,'6 lecciones completas');
}

if(errors.length){console.error('Spanish Colossians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Colossians Audit PASSED');
console.log('OK: Colosenses retains 6/6 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, Christ-deity, suffering, anti-elitism, education/care, forgiveness, household-power, anti-slavery, workplace-justice, and safety safeguards are protected.');