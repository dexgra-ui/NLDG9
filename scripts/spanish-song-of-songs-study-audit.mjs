import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='song-of-songs-study-data'+js,enGuide='song-of-songs-study-guide'+js,esData='song-of-songs-study-data-es'+js,enPage='song-of-songs-study'+html,esPage=['es','cantares-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('song-of-songs');
if(book?.status!=='published')fail('Song of Songs must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='cantares-estudio')fail('Spanish Song of Songs slug must be cantares-estudio.');
 if(es?.book!=='Cantar de los Cantares')fail('Spanish book name must be Cantar de los Cantares.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Song of Songs must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)fail('Song of Songs must retain five lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<5;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Song of Songs lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Cantar de los Cantares '))fail(`${label}: Scripture reference must begin with Cantar de los Cantares.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesTeaching','seriesQuestions','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!es?.[field]||(Array.isArray(es[field])&&!es[field].length))fail(`Spanish Song of Songs missing ${field}.`);
 if(es?.seriesTeaching?.length!==6)fail('Spanish Song of Songs must retain six series teaching movements.');
 if(es?.seriesQuestions?.length!==8)fail('Spanish Song of Songs must retain eight series questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Song of Songs contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['plain love poetry',['honra el amor humano del poema','sin convertir cada imagen en un código escondido']],
  ['woman has agency',['La mujer habla ampliamente','dignidad incluye agencia']],
  ['colorism and body dignity',['resiste colorismo y vergüenza corporal','La belleza no pertenece a una sola tez, edad, talla, capacidad o estándar cultural']],
  ['no entitlement',['Un cumplido nunca crea deuda, derecho de acceso','El lenguaje del pacto nunca justifica control, vigilancia, coerción o aislamiento']],
  ['marriage not only complete life',['sin presentar el matrimonio como la única vida cristiana completa']],
  ['invitation not consent',['Una invitación no es consentimiento si no puede aceptarse, rechazarse o posponerse libremente sin castigo']],
  ['anti stalking',['La poesía no autoriza acecho, monitoreo ni negarse a respetar el límite de otra persona']],
  ['consent requirements',['El consentimiento debe ser específico, mutuo, continuo y libre de miedo, intoxicación, manipulación, presión espiritual o poder desigual','derecho a pausar o decir no ahora']],
  ['marital consent',['El pacto nunca cancela el consentimiento']],
  ['singleness dignity',['Las personas solteras no están incompletas']],
  ['abuse safety over appearances',['Donde existe abuso, seguridad y rendición de cuentas tienen prioridad sobre apariencias']],
  ['violence not romance',['La violencia no es romance','Este daño no debe romantizarse ni tratarse como merecido']],
  ['survivors not blamed',['Las sobrevivientes nunca son responsables de la violencia de otra persona']],
  ['unsafe return not required',['extrañar a alguien no obliga a regresar a una relación insegura']],
  ['repair not coerced',['La reparación real no puede forzarse','Una disculpa no compra acceso','el perdón no restaura automáticamente confianza, cercanía, liderazgo ni la relación anterior']],
  ['jealousy not violence',['Los celos nunca justifican amenazas, violencia, control o vigilancia']],
  ['love cannot be bought',['la riqueza no puede comprarlo','nunca crean derecho al afecto o al acceso','El amor se da libremente o no es amor']],
  ['forced disclosure prohibited',['nadie debe ser presionado a revelar experiencias personales','Guía sin sensacionalismo ni revelación forzada']],
  ['forgiveness and accountability',['El perdón nunca exige secreto, negación, acceso inseguro ni eliminación de la rendición de cuentas']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Song of Songs safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/cantares-estudio'+html+'"'))fail('English Song of Songs page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.59.0'))fail('English Song of Songs page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/cantares-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/song-of-songs-study'+html+'"','../song-of-songs-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.59.0'])if(!spanish.includes(marker))fail(`Spanish Song of Songs page missing ${marker}.`);
 if(!i18n.includes("'song-of-songs-study"+html+"':'es/cantares-estudio"+html+"'"))fail('Song of Songs bilingual route is missing.');
 if(!hub.includes('href="cantares-estudio'+html+'"'))fail('Spanish Song of Songs library card is missing.');
 if(!hub.includes('cuarenta y nueve series completas y revisadas'))fail('Spanish library count must be forty-nine series.');
}
if(errors.length){console.error('Spanish Song of Songs study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Song of Songs study audit passed.');
