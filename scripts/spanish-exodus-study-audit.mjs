import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const enData='exodus-study-data'+js;
const enGuide='exodus-study-guide'+js;
const esData='exodus-study-data-es'+js;
const enPage='exodus-study'+html;
const esPage=['es','exodo-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enData,enGuide,esData,enPage,esPage,hubPath,i18nPath];
const book=spanishOldTestamentByKey.get('exodus');
for(const file of required)if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(book?.status!=='published')fail('Exodus must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load(enData,enGuide),es=load(esData);
  if(es?.slug!=='exodo-estudio')fail('Spanish Exodus slug must be exodo-estudio.');
  if(es?.book!=='Éxodo')fail('Spanish book name must be Éxodo.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Exodus must declare Nueva Traducción Viviente (NTV).');
  if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Exodus must retain eight lessons in both languages.');
  const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<8;i++){
    const a=en.lessons[i],b=es.lessons[i],label=`Exodus lesson ${i+1}`;
    if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
    for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
    for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
    if(!String(b?.scripture||'').startsWith('Éxodo '))fail(`${label}: Scripture reference must use Éxodo.`);
  }
  for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Exodus series foundation missing ${field}.`);
  if((es?.seriesTeaching?.length??0)!==6)fail('Exodus series foundation must retain six teaching movements.');
  if((es?.seriesQuestions?.length??0)!==8)fail('Exodus series foundation must retain eight discussion questions.');
  const data=read(esData);
  for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))fail(`Spanish Exodus contains disallowed Bible version ${version}.`);
  const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
  if(!l1.teaching[0].body.includes('imagen de Dios')||!l1.teaching[1].body.includes('autoridad humana nunca es absoluta')||!l1.teaching[3].body.includes('matanza impulsiva'))fail('Lesson 1 must preserve dignity, civil-resistance, and nonviolent-liberation safeguards.');
  if(!l2.teaching[5].body.includes('adaptaciones')||!l2.teaching[5].body.includes('discapacidad')||!l2.teaching[5].body.includes('falta de fe'))fail('Lesson 2 must preserve disability dignity and accommodation.');
  if(!l3.teaching[1].body.includes('trauma')||!l3.teaching[3].body.includes('abusadores modernos')||!l3.teaching[5].body.includes('no debe celebrarse con ligereza'))fail('Lesson 3 must preserve trauma care, agency, and sober judgment language.');
  if(!l4.teaching[0].body.includes('identidad judía continua')||!l4.teaching[0].body.includes('antisemitismo')||!l4.teaching[2].body.includes('planificación de seguridad')||!l4.teaching[4].body.includes('no autoriza guerra religiosa'))fail('Lesson 4 must preserve Jewish dignity, survivor safety, and nonviolence safeguards.');
  if(!l5.teaching[2].body.includes('atención médica')||!l5.teaching[3].body.includes('no es una fórmula')||!l5.teaching[4].body.includes('enemigos étnicos o políticos modernos')||!l5.teaching[5].body.includes('agotamiento no es fidelidad'))fail('Lesson 5 must preserve material care, non-formula faith, anti-scapegoating, and sustainable leadership.');
  if(!l6.teaching[3].body.includes('regulación no es respaldo final')||!l6.teaching[3].body.includes('secuestro es condenado')||!l6.teaching[3].body.includes('esclavitud racial')||!l6.teaching[3].body.includes('trata de personas')||!l6.teaching[3].body.includes('trabajo forzado'))fail('Lesson 6 must preserve slavery and trafficking safeguards.');
  if(!l6.teaching[4].body.includes('inmigrantes')||!l6.teaching[4].body.includes('viudas')||!l6.teaching[4].body.includes('huérfanos'))fail('Lesson 6 must preserve vulnerable-neighbor protections.');
  if(!l7.teaching[1].body.includes('decisiones que facilitaron')||!l7.teaching[3].body.includes('Nunca autoriza')||!l7.teaching[3].body.includes('desacuerdo religioso'))fail('Lesson 7 must preserve accountable leadership and reject religious violence.');
  if(!l8.teaching[0].body.includes('coerción')||!l8.teaching[0].body.includes('riqueza garantizada')||!l8.teaching[4].body.includes('límites humanos')||!l8.teaching[5].body.includes('líderes puedan controlar'))fail('Lesson 8 must preserve voluntary giving, anti-prosperity, rest, and non-controlling leadership safeguards.');
  const guide=String(es.seriesLeaderGuidance||'');
  for(const phrase of ['esclavitud','antisemitismo','violencia religiosa','represalias modernas','médica','legal','financiera','protección'])if(!guide.includes(phrase))fail(`Exodus leader guidance must preserve ${phrase}.`);
  const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
  if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/exodo-estudio'+html+'"'))fail('English Exodus page must link Spanish alternate.');
  if(!english.includes('nldg-i18n'+js+'?v=1.40.0'))fail('English Exodus page must load current language switcher.');
  for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/exodo-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/exodus-study'+html+'"','../exodus-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.40.0'])if(!spanish.includes(marker))fail(`Spanish Exodus page missing ${marker}.`);
  if(!i18n.includes("'exodus-study"+html+"':'es/exodo-estudio"+html+"'"))fail('Exodus bilingual route is missing.');
  if(!hub.includes('href="exodo-estudio'+html+'"'))fail('Spanish Exodus library card is missing.');
  if(!hub.includes('treinta series completas y revisadas'))fail('Spanish library count must be thirty series.');
}

if(errors.length){console.error('Spanish Exodus study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Exodus study audit passed.');