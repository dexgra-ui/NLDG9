import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='zechariah-study-data'+js,enGuide='zechariah-study-guide'+js,esData='zechariah-study-data-es'+js,enPage='zechariah-study'+html,esPage=['es','zacarias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('zechariah')?.status!=='published')fail('Zechariah must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='zacarias-estudio')fail('Spanish Zechariah slug must be zacarias-estudio.');
 if(es?.book!=='Zacarías')fail('Spanish book name must be Zacarías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Zechariah must declare NTV.');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Zechariah must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Zechariah lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  if(!String(b?.context||'').trim())fail(label+': missing context.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if((b?.supporting?.length??0)!==0)fail(label+': supporting Scriptures must remain empty to match English.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Zacarías '))fail(label+': Scripture reference must begin with Zacarías.');
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Zechariah guide block count must match English.');
 for(let i=0;i<(en?.seriesGuideBlocks?.length||0);i++){
  const a=en.seriesGuideBlocks[i],b=es.seriesGuideBlocks[i],label='Zechariah guide block '+(i+1);
  if(!b?.title?.trim())fail(label+': missing title.');
  if(Array.isArray(a?.items)){
   if((b?.items?.length??-1)!==a.items.length)fail(label+': item count must match English.');
   for(const item of b?.items||[])if(!String(item).trim())fail(label+': empty item.');
  }else if(!String(b?.text||'').trim())fail(label+': missing text.');
 }
 const richFields=['seriesPurposeLabel','purpose','lessonPurposeLabel','openingLabel','mainPassageLabel','scriptureContextLabel','keyTruthLabel','lessonQuestionLabel','lessonFoundationLabel','lessonTeachingLabel','discussionQuestionsLabel','personalExaminationLabel','weeklyPracticeLabel','leaderGuidanceLabel','closingPrayerLabel'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Zechariah missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Zechariah contains disallowed Bible version '+version+'.');
 for(const phrase of ['Study Foundation','Series Purpose','Interpretive Commitments','Lesson Map','Recommended Rhythm','Facilitator Safeguards','How to Read Together','Teaching Movements','Discussion Questions','Personal Examination','Weekly Practice','Leader Guidance','Closing Prayer'])if(raw.includes(phrase))fail('Spanish Zechariah contains untranslated interface label: '+phrase+'.');
 const safeguards=[
  ['postexilic Jewish setting','contexto judío posexílico de Zacarías'],
  ['apocalyptic humility','trata los símbolos apocalípticos con humildad'],
  ['no politician mapping','no identifiques cada figura con políticos actuales'],
  ['no date prediction','no predigas fechas'],
  ['no targeting Jewish people','no señales al pueblo judío'],
  ['no violence justification','ni justifiques la violencia'],
  ['no replacement contempt','sin desprecio de reemplazo'],
  ['no conspiracy claims','teorías de conspiración'],
  ['no partisan decoding','interpretaciones partidistas'],
  ['no pressured disclosure','nunca presiones a nadie para revelar información personal'],
  ['no unsafe reconciliation','buscar una reconciliación insegura'],
  ['no speculative agreement','aceptar especulaciones'],
  ['consent and safety','da prioridad al consentimiento, la seguridad'],
  ['truthful accountability','la rendición de cuentas veraz'],
  ['no military or political domination','la fuerza militar, el dominio político, la manipulación ni la celebridad'],
  ['public safety and intergenerational belonging','la seguridad pública y el sentido de pertenencia entre generaciones'],
  ['children elders disability protection','proteger a los niños, a las personas mayores y a las personas con discapacidades'],
  ['Christian fulfillment without erasing Israel','los lectores cristianos ven su cumplimiento en Jesús, mientras el texto sigue formando parte de la esperanza profética de Israel'],
  ['antisemitism rejected','la interpretación nunca debe alimentar el antisemitismo'],
  ['violent imagery not authorization','nunca autoriza a los creyentes a atacar al pueblo judío, a adversarios políticos ni a personas de otras religiones'],
  ['participants may pass','los participantes pueden omitir preguntas'],
  ['professional care partnership','ayuda médica, de salud mental, legal, financiera, de vivienda y de protección de personas vulnerables'],
  ['ancient judgment not modern permission','nunca conviertas un juicio antiguo en permiso moderno para hacer daño']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Zechariah safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/zacarias-estudio'+html+'"'))fail('English Zechariah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.75.0'))fail('English Zechariah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/zacarias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/zechariah-study'+html+'"','../zechariah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.75.0'])if(!spanish.includes(marker))fail('Spanish Zechariah page missing '+marker+'.');
 if(!i18n.includes("'zechariah-study"+html+"':'es/zacarias-estudio"+html+"'"))fail('Zechariah bilingual route is missing.');
 if(!hub.includes('href="zacarias-estudio'+html+'"'))fail('Spanish Zechariah library card is missing.');
 if(!hub.includes('sesenta y cinco series completas y revisadas'))fail('Spanish library count must be sixty-five series.');
}
if(errors.length){console.error('Spanish Zechariah study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Zechariah study audit passed.');
