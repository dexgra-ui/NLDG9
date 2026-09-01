import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const html='.ht'+'ml';
const js='.j'+'s';
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};

const enPage='titus-study'+html;
const enData='titus-study-data'+js;
const enGuide='titus-study-guide'+js;
const esData='titus-study-data-es'+js;
const esPage=['es','tito-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath];
for(const file of required)if(!exists(file))errors.push(`Missing Tito bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)errors.push('Tito must retain 5 English and 5 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Tito must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`Tito ${field} count must match English.`);
 for(let i=0;i<5;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Tito lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('Tito '))errors.push(`${label}: Scripture reference must use Tito.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Tito contains disallowed Bible version label ${version}.`);
 const l1=es.lessons?.[0],l2=es.lessons?.[1],l3=es.lessons?.[2],l4=es.lessons?.[3],l5=es.lessons?.[4];
 if(!l1?.teaching?.[2]?.body?.includes('no significa perfección')||!l1?.teaching?.[3]?.body?.includes('decisión independiente')||!l1?.teaching?.[4]?.body?.includes('no es posesión del líder'))errors.push('Tito lesson 1 must preserve non-perfectionist, family-agency, and anti-domination leadership safeguards.');
 if(!l2?.teaching?.[1]?.body?.includes('Prácticas financieras transparentes')||!l2?.teaching?.[3]?.body?.includes('evidencia')||!l2?.teaching?.[4]?.body?.includes('no deben generalizar desprecio'))errors.push('Tito lesson 2 must preserve financial transparency, evidence-based correction, and anti-prejudice safeguards.');
 if(!l3?.teaching?.[2]?.body?.includes('sin encerrar a todas las mujeres')||!l3?.teaching?.[4]?.body?.includes('no debe tratarse como el ideal de Dios')||!l3?.caution?.includes('estereotipos rígidos'))errors.push('Tito lesson 3 must preserve non-stereotyping and anti-slavery safeguards.');
 if(!l4?.teaching?.[1]?.body?.includes('no perfección instantánea')||!l4?.teaching?.[5]?.body?.includes('Dios salva por misericordia')||!l4?.caution?.includes('no exige silencio ante la injusticia o el abuso'))errors.push('Tito lesson 4 must preserve grace, non-perfectionism, non-merit salvation, and abuse-accountability safeguards.');
 if(!l5?.teaching?.[2]?.body?.includes('desacuerdo sano')||!l5?.teaching?.[3]?.body?.includes('primera y una segunda advertencia')||!l5?.caution?.includes('víctimas')||!l5?.caution?.includes('denunciantes')||!l5?.caution?.includes('preguntas legítimas'))errors.push('Tito lesson 5 must distinguish divisiveness from disagreement and protect victims, whistleblowers, and legitimate questions.');
 const guideText=[...(es.seriesOverviewParagraphs||[]),...(es.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])]),...(es.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[])])].join(' ');
 for(const phrase of ['carácter observable','sin estereotipos rígidos','sin respaldar explotación','no salvan','patrones sostenidos y observables','sin presentar la esclavitud como el ideal de Dios','no para autorizar desprecio'])if(!guideText.includes(phrase))errors.push(`Tito guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('Tito route pair',i18n,`'titus-study${html}':'es/tito-estudio${html}'`);
 expect('Tito English page',english,'nldg-i18n'+js+'?v=1.23.0');
 expect('Tito Spanish page',spanish,'../nldg-i18n'+js+'?v=1.23.0');
 expect('Tito Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/tito-estudio'+html);
 expect('Tito Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/titus-study'+html+'"');
 expect('Spanish study hub',hub,'trece series completas y revisadas');
 expect('Spanish study hub',hub,'href="tito-estudio'+html+'"');
 expect('Spanish study hub',hub,'Tito: Liderazgo sano, gracia y buenas obras');
 expect('Spanish study hub',hub,'5 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.23.0');
}

if(errors.length){console.error('Spanish Titus Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Titus Audit PASSED');
console.log('OK: Tito retains 5/5 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, bilingual routing, leadership, money, prejudice, slavery, grace, good works, boundaries, and public-witness safeguards are protected.');