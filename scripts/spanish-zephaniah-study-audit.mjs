import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='zephaniah-study-data'+js,enGuide='zephaniah-study-guide'+js,esData='zephaniah-study-data-es'+js,enPage='zephaniah-study'+html,esPage=['es','sofonias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('zephaniah')?.status!=='published')fail('Zephaniah must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='sofonias-estudio')fail('Spanish Zephaniah slug must be sofonias-estudio.');
 if(es?.book!=='Sofonías')fail('Spanish book name must be Sofonías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Zephaniah must declare NTV.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Zephaniah must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Zephaniah lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  if((b?.supporting?.length??0)!==3)fail(label+': expected three supporting Scriptures.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Sofonías '))fail(label+': Scripture reference must begin with Sofonías.');
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Zephaniah guide block count must match English.');
 for(let i=0;i<(en?.seriesGuideBlocks?.length||0);i++){
  const a=en.seriesGuideBlocks[i],b=es.seriesGuideBlocks[i],label='Zephaniah guide block '+(i+1);
  if(!b?.title?.trim())fail(label+': missing title.');
  if(Array.isArray(a?.items)){
   if((b?.items?.length??-1)!==a.items.length)fail(label+': item count must match English.');
   for(const item of b?.items||[])if(!String(item).trim())fail(label+': empty item.');
  }else if(!String(b?.text||'').trim())fail(label+': missing text.');
 }
 const richFields=['themeLabel','seriesPurposeLabel','purpose','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Zephaniah missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Zephaniah contains disallowed Bible version '+version+'.');
 for(const phrase of ['Central Aim','Series Purpose','Historical and Literary Setting','Lesson Map','Recommended Rhythm','Leader Commitments','Pastoral Safeguards','Christ-Centered Reading','Desired Fruit','Interpretive Emphasis'])if(raw.includes(phrase))fail('Spanish Zephaniah contains untranslated interface label: '+phrase+'.');
 const safeguards=[
  ['Josiah and mixed-worship setting','durante el reinado de josías, antes de sus reformas o mientras estas se desarrollan'],
  ['Baal and astral worship named','la adoración al señor con el culto a baal, la adoración de los astros'],
  ['judgment begins at home','el día del señor comienza en casa'],
  ['divided loyalty is idolatry','la lealtad dividida sigue siendo idolatría'],
  ['leaders remain accountable','los líderes religiosos y políticos deben rendir cuentas'],
  ['worship-space exploitation exposed','la violencia y el fraude entran en los espacios de adoración'],
  ['practical atheism exposed','viven como si él no existiera'],
  ['wealth cannot rescue','las riquezas no pueden rescatar'],
  ['all political power accountable','ninguna región geográfica ni poder político está fuera de la autoridad de dios'],
  ['vulnerable people protected from expansion','expansión contra personas vulnerables'],
  ['Jerusalem itself confronted','jerusalén misma se convierte en la ciudad opresora'],
  ['predatory leadership exposed','líderes que tratan a las personas como presa'],
  ['God not complicit in corruption','la corrupción institucional no hace a dios cómplice'],
  ['restoration includes mobility limitations','incluye a quienes tienen dificultades para caminar'],
  ['vulnerable people centered','la restauración pone en el centro a las personas vulnerables'],
  ['no modern disaster judgments','no atribuyas desastres actuales al juicio divino'],
  ['no prophetic speculation','ni conviertas en especulación los pasajes proféticos o los que hablan del regreso de cristo'],
  ['grief distinguished from unbelief','distingue el duelo de la incredulidad'],
  ['inability distinguished from unwillingness','la incapacidad de la falta de voluntad'],
  ['pastoral care distinguished from control','el cuidado pastoral del control'],
  ['vulnerable participants protected','protege a quienes estén en una situación vulnerable'],
  ['judgment not weaponized against outsiders','no conviertas los textos de juicio en armas contra quienes están fuera de la iglesia'],
  ['date-setting and sensationalism rejected','rechaza los intentos de poner fecha al fin de los tiempos y el sensacionalismo'],
  ['correction begins with believers','aplica la corrección primero a la comunidad creyente'],
  ['trauma disclosure not pressured','nunca presiones a nadie para que revele esas experiencias'],
  ['consent and safety affirmed','afirma el consentimiento y la seguridad'],
  ['Jesus-centered roles','jesús es el rey salvador presente entre su pueblo, el juez justo'],
  ['disasters not assigned to hidden sins','atribuir desastres concretos a pecados ocultos'],
  ['no modern national superiority','permiso para afirmar una superioridad nacional moderna'],
  ['Jesus-centered hope','centra la esperanza en jesús']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Zephaniah safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/sofonias-estudio'+html+'"'))fail('English Zephaniah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.73.0'))fail('English Zephaniah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/sofonias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/zephaniah-study'+html+'"','../zephaniah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.73.0'])if(!spanish.includes(marker))fail('Spanish Zephaniah page missing '+marker+'.');
 if(!i18n.includes("'zephaniah-study"+html+"':'es/sofonias-estudio"+html+"'"))fail('Zephaniah bilingual route is missing.');
 if(!hub.includes('href="sofonias-estudio'+html+'"'))fail('Spanish Zephaniah library card is missing.');
 if(!hub.includes('sesenta y tres series completas y revisadas'))fail('Spanish library count must be sixty-three series.');
}
if(errors.length){console.error('Spanish Zephaniah study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Zephaniah study audit passed.');
