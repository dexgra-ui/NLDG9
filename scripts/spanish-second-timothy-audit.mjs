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

const enPage='second-timothy-study'+html;
const enData='second-timothy-study-data'+js;
const enGuide='second-timothy-study-guide'+js;
const esData='second-timothy-study-data-es'+js;
const esPage=['es','segunda-timoteo-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing 2 Timoteo bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)errors.push('2 Timoteo must retain 6 English and 6 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('2 Timoteo must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`2 Timoteo ${field} count must match English.`);
 for(let i=0;i<6;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`2 Timoteo lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('2 Timoteo '))errors.push(`${label}: Scripture reference must use 2 Timoteo.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('2 Timoteo Spanish data',data,version);
 const l1=es.lessons?.[0],l2=es.lessons?.[1],l3=es.lessons?.[2],l4=es.lessons?.[3],l5=es.lessons?.[4],l6=es.lessons?.[5];
 if(!l1?.caution?.includes('trastornos de ansiedad')||!l1?.caution?.includes('trauma')||!l1?.caution?.includes('consejería'))errors.push('2 Timoteo lesson 1 must preserve anxiety, trauma, and care safeguards.');
 if(!l2?.caution?.includes('liderazgo autoritario')||!l2?.caution?.includes('trabajo sin descanso')||!l2?.caution?.includes('reposo'))errors.push('2 Timoteo lesson 2 must reject authoritarian soldier imagery and nonstop work.');
 if(!l3?.teaching?.[2]?.body?.includes('evidencia')||!l3?.teaching?.[5]?.body?.includes('no son trofeos')||!l3?.caution?.includes('protección')||!l3?.caution?.includes('documentación'))errors.push('2 Timoteo lesson 3 must preserve evidence-based, non-humiliating, abuse-accountability correction.');
 if(!l4?.teaching?.[0]?.body?.includes('primero como espejo')||!l4?.teaching?.[2]?.body?.includes('vulnerabilidad para control')||!l4?.caution?.includes('últimos días'))errors.push('2 Timoteo lesson 4 must preserve mirror-first, anti-exploitation, and non-fearmongering interpretation.');
 if(!l5?.teaching?.[2]?.body?.includes('no debe convertirse en agresión')||!l5?.caution?.includes('salud')||!l5?.caution?.includes('familia')||!l5?.caution?.includes('duelo')||!l5?.caution?.includes('transiciones sabias'))errors.push('2 Timoteo lesson 5 must preserve patient correction and healthy finishing safeguards.');
 if(!l6?.teaching?.[1]?.body?.includes('evita tratar cada ausencia como traición')||!l6?.caution?.includes('no exige restaurar acceso')||!l6?.caution?.includes('continúa siendo dañino'))errors.push('2 Timoteo lesson 6 must preserve nuanced departures and safe forgiveness boundaries.');
 const guideText=[...(es.seriesOverviewParagraphs||[]),...(es.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])]),...(es.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])])].join(' ');
 for(const phrase of ['no debe usarse para glorificar agotamiento','tolerar abuso','cuidado legítimo','ignorar salud, duelo, familia, límites o seguridad','preocupación doctrinal basada en evidencia','cada desacuerdo como apostasía','libre de orgullo contencioso'])if(!guideText.includes(phrase))errors.push(`2 Timoteo guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('2 Timoteo route pair',i18n,`'second-timothy-study${html}':'es/segunda-timoteo-estudio${html}'`);
 expect('2 Timothy English page',english,'nldg-i18n'+js+'?v=1.24.0');
 expect('2 Timoteo Spanish page',spanish,'../nldg-i18n'+js+'?v=1.24.0');
 expect('2 Timoteo Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/segunda-timoteo-estudio'+html);
 expect('2 Timoteo Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-timothy-study'+html+'"');
 expect('Spanish study hub',hub,'href="segunda-timoteo-estudio'+html+'"');
 expect('Spanish study hub',hub,'2 Timoteo: Fidelidad valiente, sana enseñanza y un final fiel');
 expect('Spanish study hub',hub,'6 lecciones completas');
}

if(errors.length){console.error('Spanish 2 Timothy Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Timothy Audit PASSED');
console.log('OK: 2 Timoteo retains 6/6 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, anxiety/trauma care, non-authoritarian endurance, evidence-based correction, Scripture formation, healthy finishing, and safe forgiveness boundaries are protected.');