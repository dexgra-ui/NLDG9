import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='isaiah-study-data'+js,enGuide='isaiah-study-guide'+js,esData='isaiah-study-data-es'+js,enPage='isaiah-study'+html,esPage=['es','isaias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('isaiah');
if(book?.status!=='published')fail('Isaiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='isaias-estudio')fail('Spanish Isaiah slug must be isaias-estudio.');
 if(es?.book!=='Isaías')fail('Spanish book name must be Isaías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Isaiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Isaiah must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Isaiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Isaías '))fail(`${label}: Scripture reference must begin with Isaías.`);
 }
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','recommendedRhythm','facilitatorSafeguards','howToReadTogether','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Spanish Isaiah missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Isaiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Israel and antisemitism',['sin borrar a Israel ni fomentar antisemitismo','la identidad judía']],
  ['partisan prophecy',['decodificación partidista','no un calendario para conquista política']],
  ['ethnic scapegoating',['chivos expiatorios étnicos','nunca deben convertirse en odio étnico']],
  ['worship and justice',['La actividad religiosa no compensa la explotación','El arrepentimiento tiene una forma pública y material']],
  ['Jewish context and fulfillment',['honra ambos horizontes sin borrar el contexto judío']],
  ['judgment not vigilantism',['El juicio pertenece a Dios, no a vigilantes religiosos']],
  ['disability dignity',['nunca a un menor valor humano en el presente','la dignidad de personas con discapacidad']],
  ['chronic illness and depression',['nunca vivirán enfermedad crónica, discapacidad, fatiga o depresión','El descanso y la atención adecuada siguen siendo dones']],
  ['replacement theology',['La interpretación cristiana debe rechazar el desprecio por reemplazo y el antisemitismo']],
  ['mission not domination',['La misión es servicio, no dominación ni borrado cultural']],
  ['Servant suffering and abuse',['nunca debe usarse para ordenar a víctimas permanecer en abuso ni para negar seguridad y justicia','No santifica el abuso involuntario']],
  ['infertility dignity',['La infertilidad no es vergüenza','no mide la bendición']],
  ['grace not sold',['La gracia no puede venderse por líderes religiosos ni ligarse a riqueza']],
  ['inclusive belonging',['Extranjeros y eunucos reciben lugar y nombre','desafía exclusión basada en etnia, nacionalidad, estado familiar o diferencia corporal']],
  ['leader accountability',['El oficio espiritual requiere rendición de cuentas','la rendición de cuentas del liderazgo']],
  ['true fasting and material justice',['justicia laboral, alimento, vivienda y solidaridad']],
  ['grief and qualified care',['No apresura a las personas para dejar atrás el dolor','consejería, restitución y apoyo a largo plazo']],
  ['divine warrior not imitation',['Los cristianos no pueden imitarlas mediante venganza, guerra o ataques contra opositores']],
  ['human leaders not potters',['Ningún pastor es dueño de otra persona como si fuera barro']],
  ['new creation and bodies',['La esperanza es creación renovada, no desprecio por el mundo físico']],
  ['no health guarantee',['no una garantía de que cada persona fiel evitará enfermedad o muerte ahora']],
  ['unanswered prayer',['la oración no respondida nunca debe atribuirse a una fe deficiente']],
  ['no nationalism or punishment delight',['La esperanza no debe convertirse en antisemitismo, nacionalismo ni deleite en el castigo']],
  ['survivor safety',['la seguridad de sobrevivientes','interpretaciones que ordenen a víctimas permanecer en abuso']],
  ['medical care',['la atención médica']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Isaiah safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/isaias-estudio'+html+'"'))fail('English Isaiah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.60.0'))fail('English Isaiah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/isaias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/isaiah-study'+html+'"','../isaiah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.60.0'])if(!spanish.includes(marker))fail(`Spanish Isaiah page missing ${marker}.`);
 if(!i18n.includes("'isaiah-study"+html+"':'es/isaias-estudio"+html+"'"))fail('Isaiah bilingual route is missing.');
 if(!hub.includes('href="isaias-estudio'+html+'"'))fail('Spanish Isaiah library card is missing.');
 if(!hub.includes('cincuenta series completas y revisadas'))fail('Spanish library count must be fifty series.');
}
if(errors.length){console.error('Spanish Isaiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Isaiah study audit passed.');
