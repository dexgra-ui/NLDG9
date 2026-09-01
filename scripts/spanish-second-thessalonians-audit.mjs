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

const enPage='second-thessalonians-study'+html;
const enData='second-thessalonians-study-data'+js;
const enGuide='second-thessalonians-study-guide'+js;
const esData='second-thessalonians-study-data-es'+js;
const esPage=['es','segunda-tesalonicenses-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing 2 Tesalonicenses bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)errors.push('2 Tesalonicenses must retain 5 English and 5 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('2 Tesalonicenses must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`2 Tesalonicenses ${field} count must match English.`);
 for(let i=0;i<5;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`2 Tesalonicenses lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('2 Tesalonicenses '))errors.push(`${label}: Scripture reference must use 2 Tesalonicenses.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('2 Tesalonicenses Spanish data',data,version);
 const [l1,l2,l3,l4,l5]=es.lessons||[];
 if(!l1?.teaching?.[0]?.body?.includes('no celebra el sufrimiento')||!l1?.teaching?.[2]?.body?.includes('frena la venganza personal')||!l1?.teaching?.[4]?.body?.includes('nunca placer ante la condenación'))errors.push('2 Tesalonicenses lesson 1 must preserve suffering, non-retaliation, and sober-judgment safeguards.');
 if(!l2?.teaching?.[0]?.body?.includes('pánico constante')||!l2?.teaching?.[1]?.body?.includes('examina la fuente')||!l2?.teaching?.[3]?.body?.includes('cronologías inciertas')||!l2?.teaching?.[3]?.body?.includes('verdad incuestionable'))errors.push('2 Tesalonicenses lesson 2 must reject panic, untested authority, and false end-times certainty.');
 if(!l3?.teaching?.[3]?.body?.includes('no una terquedad que se niega a aprender')||!l3?.teaching?.[4]?.body?.includes('no convierte cada costumbre humana en intocable'))errors.push('2 Tesalonicenses lesson 3 must distinguish firmness from rigidity and apostolic teaching from untouchable human custom.');
 if(!l4?.context?.includes('no es incapacidad, desempleo, enfermedad, cuidado de otros o pobreza')||!l4?.teaching?.[4]?.body?.includes('no debe usarse como arma contra personas vulnerables')||!l4?.teaching?.[5]?.body?.includes('trabajo no es la fuente del valor humano'))errors.push('2 Tesalonicenses lesson 4 must distinguish unwillingness from genuine need and preserve human worth.');
 if(!l5?.teaching?.[2]?.body?.includes('humillación, aislamiento punitivo ni represalias')||!l5?.teaching?.[3]?.body?.includes('no se considere enemigo')||!l5?.teaching?.[3]?.body?.includes('dignidad de la persona'))errors.push('2 Tesalonicenses lesson 5 must preserve proportional, non-retaliatory, family-centered accountability.');
 for(const lesson of es.lessons||[]){
  for(const phrase of ['incapacidad de falta de voluntad','límites proporcionales','dignidad de la persona','camino hacia la restauración'])if(!lesson?.caution?.includes(phrase))errors.push(`2 Tesalonicenses lesson ${lesson?.number}: shared guidance must preserve ${phrase}.`);
 }
 const guideText=[...(es.seriesOverviewParagraphs||[]),...(es.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])]),...(es.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])])].join(' ');
 for(const phrase of ['pruebas de salvación','fijar fechas','personas con discapacidad','humillación, aislamiento o represalias','protege a cualquiera que esté en riesgo de daño','no es fascinación con la catástrofe'])if(!guideText.includes(phrase))errors.push(`2 Tesalonicenses guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('2 Tesalonicenses route pair',i18n,`'second-thessalonians-study${html}':'es/segunda-tesalonicenses-estudio${html}'`);
 expect('2 Thessalonians English page',english,'nldg-i18n'+js+'?v=1.26.0');
 expect('2 Tesalonicenses Spanish page',spanish,'../nldg-i18n'+js+'?v=1.26.0');
 expect('2 Tesalonicenses Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/segunda-tesalonicenses-estudio'+html);
 expect('2 Tesalonicenses Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-thessalonians-study'+html+'"');
 expect('Spanish study hub',hub,'dieciséis series completas y revisadas');
 expect('Spanish study hub',hub,'href="segunda-tesalonicenses-estudio'+html+'"');
 expect('Spanish study hub',hub,'2 Tesalonicenses: Perseverancia, discernimiento, trabajo fiel y esperanza');
 expect('Spanish study hub',hub,'5 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.26.0');
}

if(errors.length){console.error('Spanish 2 Thessalonians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Thessalonians Audit PASSED');
console.log('OK: 2 Tesalonicenses retains 5/5 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, non-sensational eschatology, careful authority testing, work/need distinctions, dignity, and restorative accountability are protected.');
