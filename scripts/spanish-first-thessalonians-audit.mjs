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

const enPage='first-thessalonians-study'+html;
const enData='first-thessalonians-study-data'+js;
const enGuide='first-thessalonians-study-guide'+js;
const esData='first-thessalonians-study-data-es'+js;
const esPage=['es','primera-tesalonicenses-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing 1 Tesalonicenses bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)errors.push('1 Tesalonicenses must retain 6 English and 6 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('1 Tesalonicenses must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`1 Tesalonicenses ${field} count must match English.`);
 for(let i=0;i<6;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`1 Tesalonicenses lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('1 Tesalonicenses '))errors.push(`${label}: Scripture reference must use 1 Tesalonicenses.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('1 Tesalonicenses Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6]=es.lessons||[];
 if(!l1?.teaching?.[0]?.body?.includes('fundamento de la salvación')||!l1?.teaching?.[3]?.body?.includes('ejemplo vivido'))errors.push('1 Tesalonicenses lesson 1 must preserve grace and embodied-witness safeguards.');
 if(!l2?.teaching?.[2]?.body?.includes('ganancia personal, estatus o control')||!l2?.teaching?.[3]?.body?.includes('dignidad, la seguridad y los límites')||!l2?.teaching?.[5]?.body?.includes('rendición de cuentas'))errors.push('1 Tesalonicenses lesson 2 must preserve anti-greed, dignity, boundary, and leadership-accountability safeguards.');
 if(!l3?.teaching?.[3]?.body?.includes('no significa glorificarlo')||!l3?.teaching?.[3]?.body?.includes('daño evitable')||!l3?.teaching?.[4]?.body?.includes('no fluye en una sola dirección'))errors.push('1 Tesalonicenses lesson 3 must reject glorified suffering and one-directional care.');
 if(!l4?.teaching?.[1]?.body?.includes('coerción')||!l4?.teaching?.[2]?.body?.includes('consentimiento')||!l4?.teaching?.[5]?.body?.includes('trabajo no es la fuente del valor humano')||!l4?.teaching?.[5]?.body?.includes('incapacidad'))errors.push('1 Tesalonicenses lesson 4 must preserve consent, non-coercion, and work/human-worth safeguards.');
 if(!l5?.teaching?.[1]?.body?.includes('duelo no es falta de fe')||!l5?.teaching?.[4]?.body?.includes('cronologías especulativas')||!l5?.teaching?.[5]?.body?.includes('ritmos distintos de duelo'))errors.push('1 Tesalonicenses lesson 5 must preserve honest grief and non-speculative comfort.');
 if(!l6?.teaching?.[0]?.body?.includes('Fijar fechas')||!l6?.teaching?.[3]?.body?.includes('No todas las personas necesitan la misma respuesta')||!l6?.teaching?.[4]?.body?.includes('sin examinarla')||!l6?.teaching?.[5]?.body?.includes('perfeccionismo humano'))errors.push('1 Tesalonicenses lesson 6 must preserve non-date-setting, differentiated care, discernment, and non-perfectionist readiness.');
 for(const lesson of es.lessons||[]){
  for(const phrase of ['desastres modernos','duelo de la incredulidad','incapacidad de la falta de voluntad','cuidado pastoral del control','personas vulnerables'])if(!lesson?.caution?.includes(phrase))errors.push(`1 Tesalonicenses lesson ${lesson?.number}: shared guidance must preserve ${phrase}.`);
 }
 const guideText=[...(es.seriesOverviewParagraphs||[]),...(es.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])]),...(es.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])])].join(' ');
 for(const phrase of ['armas contra los de afuera','fijación de fechas','sensacionalismo','Nunca presionen','consentimiento y la seguridad','duelo honesto'])if(!guideText.includes(phrase))errors.push(`1 Tesalonicenses guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('1 Tesalonicenses route pair',i18n,`'first-thessalonians-study${html}':'es/primera-tesalonicenses-estudio${html}'`);
 expect('1 Thessalonians English page',english,'nldg-i18n'+js+'?v=1.27.0');
 expect('1 Tesalonicenses Spanish page',spanish,'../nldg-i18n'+js+'?v=1.27.0');
 expect('1 Tesalonicenses Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/primera-tesalonicenses-estudio'+html);
 expect('1 Tesalonicenses Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-thessalonians-study'+html+'"');
 expect('Spanish study hub',hub,'diecisiete series completas y revisadas');
 expect('Spanish study hub',hub,'href="primera-tesalonicenses-estudio'+html+'"');
 expect('Spanish study hub',hub,'1 Tesalonicenses: Fe, amor, santidad, comunidad y esperanza');
 expect('Spanish study hub',hub,'6 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.27.0');
}

if(errors.length){console.error('Spanish 1 Thessalonians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Thessalonians Audit PASSED');
console.log('OK: 1 Tesalonicenses retains 6/6 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, ministry accountability, consent, grief, work/human-worth, non-date-setting, discernment, and differentiated-care safeguards are protected.');
