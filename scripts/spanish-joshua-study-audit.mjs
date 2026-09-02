import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const enData='joshua-study-data'+js;
const enGuide='joshua-study-guide'+js;
const esData='joshua-study-data-es'+js;
const enPage='joshua-study'+html;
const esPage=['es','josue-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enData,enGuide,esData,enPage,esPage,hubPath,i18nPath];
const book=spanishOldTestamentByKey.get('joshua');
for(const file of required)if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(book?.status!=='published')fail('Joshua must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load(enData,enGuide),es=load(esData);
  if(es?.slug!=='josue-estudio')fail('Spanish Joshua slug must be josue-estudio.');
  if(es?.book!=='Josué')fail('Spanish book name must be Josué.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Joshua must declare Nueva Traducción Viviente (NTV).');
  if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Joshua must retain eight lessons in both languages.');
  const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<8;i++){
    const a=en.lessons[i],b=es.lessons[i],label=`Joshua lesson ${i+1}`;
    if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
    for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
    for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
    if(!String(b?.scripture||'').startsWith('Josué '))fail(`${label}: Scripture reference must begin with Josué.`);
  }
  for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Joshua series foundation missing ${field}.`);
  if((es?.seriesTeaching?.length??0)!==6)fail('Joshua series foundation must retain six teaching movements.');
  if((es?.seriesQuestions?.length??0)!==8)fail('Joshua series foundation must retain eight discussion questions.');
  const data=read(esData);
  for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))fail(`Spanish Joshua contains disallowed Bible version ${version}.`);
  const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
  if(!l1.teaching[2].body.includes('valor bíblico')||!l1.teaching[3].body.includes('no riqueza ni facilidad garantizadas')||!l1.teaching[5].body.includes('responsabilidad comunitaria'))fail('Lesson 1 must preserve non-aggressive courage, anti-prosperity, and shared-responsibility safeguards.');
  if(!l2.teaching[0].body.includes('no debe reducirla a una etiqueta')||!l2.teaching[2].body.includes('poder coercitivo')||!l2.teaching[5].body.includes('explotación sexual')||!l2.teaching[5].body.includes('dignidad, agencia y seguridad'))fail('Lesson 2 must preserve Rahab dignity, agency, wartime-context, and anti-exploitation safeguards.');
  if(!l3.teaching[0].body.includes('ni se convierten en su sustituto')||!l3.teaching[2].body.includes('personas vulnerables')||!l3.teaching[4].body.includes('no deben copiarse como prácticas coercitivas')||!l3.teaching[5].body.includes('Dios no es mascota de nuestro lado'))fail('Lesson 3 must preserve non-personality leadership, vulnerable-person care, noncoercion, and anti-triumphalism safeguards.');
  if(!l4.teaching[0].body.includes('No es estrategia militar moderna')||!l4.teaching[0].body.includes('violencia religiosa')||!l4.teaching[4].body.includes('procedimiento imparcial')||!l4.teaching[4].body.includes('protección contra represalias')||!l4.teaching[5].body.includes('nunca debe reproducirla')||!l4.teaching[5].body.includes('denuncia legal'))fail('Lesson 4 must preserve Jericho non-transfer, evidence, anti-retaliation, and nonviolent church-discipline safeguards.');
  if(!l5.teaching[3].body.includes('La oración no sustituye investigación')||!l5.teaching[4].body.includes('en vez de usar el engaño como excusa para matarlos')||!l5.teaching[5].body.includes('no es desconfiar de toda persona externa')||!l5.teaching[5].body.includes('conflictos de interés'))fail('Lesson 5 must preserve investigation, treaty integrity, outsider dignity, and accountable discernment safeguards.');
  if(!l6.teaching[1].body.includes('no deja lugar para superioridad étnica')||!l6.teaching[3].body.includes('no pueden declarar a opositores')||!l6.teaching[3].body.includes('ley, evidencia')||!l6.teaching[4].body.includes('no borra la violencia')||!l6.teaching[5].body.includes('no cananeos que destruir'))fail('Lesson 6 must preserve anti-superiority, anti-private-revenge, moral seriousness, and non-transferable warfare safeguards.');
  if(!l7.teaching[1].body.includes('no puede validar despojo moderno')||!l7.teaching[1].body.includes('derechos y dignidad de pueblos presentes')||!l7.teaching[2].body.includes('no deben ser presionadas')||!l7.teaching[3].body.includes('rendición de cuentas')||!l7.teaching[4].body.includes('debido proceso')||!l7.teaching[5].body.includes('investigan y escuchan antes de actuar'))fail('Lesson 7 must preserve present-peoples dignity, older-adult dignity, ministry accountability, due process, and conflict-resolution safeguards.');
  if(!l8.teaching[2].body.includes('La fe no puede ser coaccionada')||!l8.teaching[2].body.includes('nunca forzar declaraciones mediante temor')||!l8.teaching[4].body.includes('nación')||!l8.teaching[5].body.includes('en vez de preservar una personalidad'))fail('Lesson 8 must preserve noncoercive faith, anti-idolatry, and healthy legacy safeguards.');
  const foundation=es.seriesTeaching.map(move=>`${move.heading} ${move.body}`).join(' ');
  for(const phrase of ['colonialismo','genocidio','racismo','nacionalismo','violencia política','conflictos territoriales modernos','sumisión a Jesús'])if(!foundation.includes(phrase))fail(`Joshua series foundation must preserve ${phrase}.`);
  const guide=String(es.seriesLeaderGuidance||'');
  for(const phrase of ['violencia','nacionalismo','racismo','antisemitismo','abuso','cananeos','seguridad','cuidado calificado','proceso justo','denuncia'])if(!guide.includes(phrase))fail(`Joshua leader guidance must preserve ${phrase}.`);
  const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
  if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/josue-estudio'+html+'"'))fail('English Joshua page must link Spanish alternate.');
  if(!english.includes('nldg-i18n'+js+'?v=1.44.0'))fail('English Joshua page must load current language switcher.');
  for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/josue-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/joshua-study'+html+'"','../joshua-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.44.0'])if(!spanish.includes(marker))fail(`Spanish Joshua page missing ${marker}.`);
  if(!i18n.includes("'joshua-study"+html+"':'es/josue-estudio"+html+"'"))fail('Joshua bilingual route is missing.');
  if(!hub.includes('href="josue-estudio'+html+'"'))fail('Spanish Joshua library card is missing.');
  if(!hub.includes('treinta y cuatro series completas y revisadas'))fail('Spanish library count must be thirty-four series.');
}

if(errors.length){console.error('Spanish Joshua study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Joshua study audit passed.');