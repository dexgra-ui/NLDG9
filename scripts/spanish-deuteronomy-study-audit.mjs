import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const enData='deuteronomy-study-data'+js;
const enGuide='deuteronomy-study-guide'+js;
const esData='deuteronomy-study-data-es'+js;
const enPage='deuteronomy-study'+html;
const esPage=['es','deuteronomio-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enData,enGuide,esData,enPage,esPage,hubPath,i18nPath];
const book=spanishOldTestamentByKey.get('deuteronomy');
for(const file of required)if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(book?.status!=='published')fail('Deuteronomy must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load(enData,enGuide),es=load(esData);
  if(es?.slug!=='deuteronomio-estudio')fail('Spanish Deuteronomy slug must be deuteronomio-estudio.');
  if(es?.book!=='Deuteronomio')fail('Spanish book name must be Deuteronomio.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Deuteronomy must declare Nueva Traducción Viviente (NTV).');
  if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Deuteronomy must retain eight lessons in both languages.');
  const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<8;i++){
    const a=en.lessons[i],b=es.lessons[i],label=`Deuteronomy lesson ${i+1}`;
    if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
    for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
    for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
    if(!String(b?.scripture||'').startsWith('Deuteronomio '))fail(`${label}: Scripture reference must use Deuteronomio.`);
  }
  for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Deuteronomy series foundation missing ${field}.`);
  if((es?.seriesTeaching?.length??0)!==6)fail('Deuteronomy series foundation must retain six teaching movements.');
  if((es?.seriesQuestions?.length??0)!==8)fail('Deuteronomy series foundation must retain eight discussion questions.');
  const data=read(esData);
  for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))fail(`Spanish Deuteronomy contains disallowed Bible version ${version}.`);
  const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
  if(!l1.teaching[1].body.includes('distribuye responsabilidad')||!l1.teaching[4].body.includes('preferencias personales como ley divina'))fail('Lesson 1 must preserve shared leadership and anti-coercive law safeguards.');
  if(!l2.teaching[1].body.includes('inmigrantes')||!l2.teaching[4].body.includes('no con “porque yo lo digo”'))fail('Lesson 2 must preserve inclusive rest and non-authoritarian formation safeguards.');
  if(!l3.teaching[0].body.includes('antisemitismo')||!l3.teaching[1].body.includes('genocidio')||!l3.teaching[1].body.includes('colonialismo')||!l3.teaching[1].body.includes('conversión forzada')||!l3.teaching[5].body.includes('Ama al inmigrante'))fail('Lesson 3 must preserve anti-superiority, anti-conquest, and immigrant-love safeguards.');
  if(!l4.teaching[1].body.includes('Seguridad y dignidad no son negociables')||!l4.teaching[2].body.includes('respetan la observancia judía')||!l4.teaching[4].body.includes('liberación periódica de deuda'))fail('Lesson 4 must preserve child safety, Jewish respect, and debt-release safeguards.');
  if(!l5.teaching[1].body.includes('autoridad pública tiene límites')||!l5.teaching[3].body.includes('ofrendas coaccionadas')||!l5.teaching[3].body.includes('finanzas secretas')||!l5.teaching[5].body.includes('fuera de examen'))fail('Lesson 5 must preserve limits on power, financial accountability, and tested spiritual claims.');
  if(!l6.teaching[0].body.includes('evidencia y proceso')||!l6.teaching[1].body.includes('sin exigir silencio a víctimas')||!l6.teaching[3].body.includes('obligar a víctimas a casarse con agresores')||!l6.teaching[3].body.includes('culpar a sobrevivientes')||!l6.teaching[4].body.includes('salarios deben pagarse a tiempo'))fail('Lesson 6 must preserve due process, survivor safety, and worker protections.');
  if(!l7.teaching[2].body.includes('No son una fórmula')||!l7.teaching[3].body.includes('enfermedad')||!l7.teaching[3].body.includes('discapacidad')||!l7.teaching[3].body.includes('infertilidad')||!l7.teaching[4].body.includes('antisemitismo')||!l7.teaching[5].body.includes('no deben usar temor a maldiciones para controlar'))fail('Lesson 7 must preserve anti-prosperity, suffering dignity, anti-antisemitism, and non-coercion safeguards.');
  if(!l8.teaching[0].body.includes('no es transferencia privada de propiedad')||!l8.teaching[1].body.includes('La Escritura pertenece a toda la comunidad')||!l8.teaching[4].body.includes('no fingir que el liderazgo hace indispensable')||!l8.teaching[5].body.includes('futuro que no controlará personalmente'))fail('Lesson 8 must preserve public succession, Scripture access, and non-personality-centered leadership safeguards.');
  const guide=String(es.seriesLeaderGuidance||'');
  for(const phrase of ['sobrevivientes','inmigrantes','trabajadores','niños','discapacidad','pobreza','antisemitismo','nacionalismo religioso','coerción sexual','culpabilización de víctimas','fórmulas de prosperidad','cuidado legal','médico','salud mental'])if(!guide.includes(phrase))fail(`Deuteronomy leader guidance must preserve ${phrase}.`);
  const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
  if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/deuteronomio-estudio'+html+'"'))fail('English Deuteronomy page must link Spanish alternate.');
  if(!english.includes('nldg-i18n'+js+'?v=1.43.0'))fail('English Deuteronomy page must load current language switcher.');
  for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/deuteronomio-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/deuteronomy-study'+html+'"','../deuteronomy-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.43.0'])if(!spanish.includes(marker))fail(`Spanish Deuteronomy page missing ${marker}.`);
  if(!i18n.includes("'deuteronomy-study"+html+"':'es/deuteronomio-estudio"+html+"'"))fail('Deuteronomy bilingual route is missing.');
  if(!hub.includes('href="deuteronomio-estudio'+html+'"'))fail('Spanish Deuteronomy library card is missing.');
  if(!hub.includes('treinta y tres series completas y revisadas'))fail('Spanish library count must be thirty-three series.');
}

if(errors.length){console.error('Spanish Deuteronomy study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Deuteronomy study audit passed.');