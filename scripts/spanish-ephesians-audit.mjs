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

const enPage='ephesians-study'+html;
const enData='ephesians-study-data'+js;
const enGuide='ephesians-study-guide'+js;
const esData='ephesians-study-data-es'+js;
const esPage=['es','efesios-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Efesios bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==9||es?.lessons?.length!==9)errors.push('Efesios must retain 9 English and 9 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Efesios must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`Efesios ${field} count must match English.`);
 for(let i=0;i<9;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Efesios lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Efesios '))errors.push(`${label}: Scripture reference must use Efesios.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('Efesios Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6,l7,l8,l9]=es.lessons||[];
 if(!l1?.caution?.includes('superiores')||!l1?.teaching?.[1]?.body?.includes('no es una insignia de superioridad'))errors.push('Efesios lesson 1 must reject election-as-superiority readings.');
 if(!l2?.caution?.includes('resultados dramáticos')||!l2?.caution?.includes('transformación silenciosa'))errors.push('Efesios lesson 2 must preserve quiet-resurrection-power safeguards.');
 if(!l3?.caution?.includes('deshumanice')||!l3?.caution?.includes('desprecio'))errors.push('Efesios lesson 3 must reject contempt toward nonbelievers.');
 if(!l4?.caution?.includes('racismo')||!l4?.caution?.includes('abuso')||!l4?.caution?.includes('injusticia')||!l4?.caution?.includes('reparación')||!l4?.caution?.includes('seguridad'))errors.push('Efesios lesson 4 must preserve truthful and safe reconciliation safeguards.');
 if(!l5?.caution?.includes('abuso')||!l5?.caution?.includes('agotamiento')||!l5?.caution?.includes('límites'))errors.push('Efesios lesson 5 must reject romanticized abuse and burnout.');
 if(!l6?.caution?.includes('silenciar')||!l6?.caution?.includes('daño')||!l6?.caution?.includes('reparación responsable'))errors.push('Efesios lesson 6 must reject unity-as-silencing and preserve accountable repair.');
 if(!l7?.caution?.includes('chisme')||!l7?.caution?.includes('humillación pública')||!l7?.caution?.includes('abuso')||!l7?.caution?.includes('canales seguros'))errors.push('Efesios lesson 7 must preserve safe exposure and anti-humiliation safeguards.');
 if(!l8?.teaching?.[2]?.body?.includes('violencia')||!l8?.teaching?.[2]?.body?.includes('control coercitivo')||!l8?.teaching?.[2]?.body?.includes('violación dentro del matrimonio')||!l8?.teaching?.[3]?.body?.includes('abuso físico')||!l8?.teaching?.[4]?.body?.includes('sin presentar la esclavitud como el ideal de Dios')||!l8?.teaching?.[5]?.body?.includes('justicia, dignidad, seguridad')||!l8?.caution?.includes('reconciliación insegura')||!l8?.caution?.includes('apoyo profesional'))errors.push('Efesios lesson 8 must preserve anti-abuse, anti-slavery, workplace-justice, and safety safeguards.');
 if(!l9?.teaching?.[1]?.body?.includes('no deben ser deshumanizadas')||!l9?.caution?.includes('enfermedad mental')||!l9?.caution?.includes('desacuerdo')||!l9?.caution?.includes('actividad demoníaca')||!l9?.caution?.includes('atención médica'))errors.push('Efesios lesson 9 must preserve sober spiritual-warfare and care safeguards.');
 const guide=guideText(es);
 for(const phrase of ['arma de superioridad','reconciliación étnica','sumisión mutua','violencia','coerción','violación dentro del matrimonio','abuso infantil','control severo','condiciones inseguras','esclavitud dentro del mundo romano caído','mayor poder responden directamente ante Cristo'])if(!guide.includes(phrase))errors.push(`Efesios guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('Efesios route pair',i18n,`'ephesians-study${html}':'es/efesios-estudio${html}'`);
 expect('Ephesians English page',english,'nldg-i18n'+js+'?v=1.29.0');
 expect('Efesios Spanish page',spanish,'../nldg-i18n'+js+'?v=1.29.0');
 expect('Efesios Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/efesios-estudio'+html);
 expect('Efesios Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/ephesians-study'+html+'"');
 expect('Spanish study hub',hub,'diecinueve series completas y revisadas');
 expect('Spanish study hub',hub,'href="efesios-estudio'+html+'"');
 expect('Spanish study hub',hub,'Efesios: Identidad en Cristo, reconciliación, unidad y fe firme');
 expect('Spanish study hub',hub,'9 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.29.0');
}

if(errors.length){console.error('Spanish Ephesians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ephesians Audit PASSED');
console.log('OK: Efesios retains 9/9 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, reconciliation, anti-abuse, anti-slavery, workplace-justice, unity, safe exposure, and sober spiritual-warfare safeguards are protected.');