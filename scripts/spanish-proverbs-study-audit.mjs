import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='proverbs-study-data'+js,enGuide='proverbs-study-guide'+js,esData='proverbs-study-data-es'+js,enPage='proverbs-study'+html,esPage=['es','proverbios-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('proverbs');
if(book?.status!=='published')fail('Proverbs must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='proverbios-estudio')fail('Spanish Proverbs slug must be proverbios-estudio.');
 if(es?.book!=='Proverbios')fail('Spanish book name must be Proverbios.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Proverbs must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Proverbs must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Proverbs lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Proverbios '))fail(`${label}: Scripture reference must begin with Proverbios.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesTeaching','seriesQuestions','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!es?.[field]||(Array.isArray(es[field])&&!es[field].length))fail(`Spanish Proverbs missing ${field}.`);
 if(es?.seriesTeaching?.length!==6)fail('Spanish Proverbs must retain six series teaching movements.');
 if(es?.seriesQuestions?.length!==8)fail('Spanish Proverbs must retain eight series questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Proverbs contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['wisdom not guarantees',['patrones generales de la vida, no promesas incondicionales','Job y Eclesiastés protegen contra culpar a quien sufre']],
  ['reverence not abusive fear',['No es terror producido por líderes abusivos']],
  ['authority not blind loyalty',['nunca exigir lealtad ciega']],
  ['discipline safety',['nunca justifican crueldad, humillación ni abuso físico','dignidad, seguridad, proporción y responsabilidad legal']],
  ['sexual consent and no entitlement',['El deseo nunca crea derecho sobre otra persona','consentimiento, honestidad y respeto']],
  ['confidentiality and reporting',['Nunca prometas secreto que oculte abuso o daño inminente']],
  ['work and disability dignity',['Enfermedad, discapacidad, cuidado de familiares, desempleo y sistemas injustos']],
  ['wealth and poverty dignity',['El éxito financiero no prueba superioridad espiritual y la pobreza no prueba pereza ni fe débil']],
  ['giving not prosperity formula',['Esto no es una fórmula de retorno garantizado']],
  ['loyalty not concealment',['lealtad no significa encubrir abuso ni delito']],
  ['women and Proverbs 31',['No armes estos dichos contra las mujeres','Es un poema acróstico, no una lista para comparaciones agotadoras']],
  ['justice over performance',['La adoración no compensa explotación, discriminación, negocios deshonestos ni daño ignorado']],
  ['fair process',['las poderosas merecen proceso justo, no confianza automática']],
  ['accountable leadership',['supervisión, transparencia financiera, caminos para presentar quejas y remoción de acceso']],
  ['serious abuse not minor offense',['Abuso grave, explotación, discriminación y amenazas no deben minimizarse como simples ofensas']],
  ['nonviolent anger',['acción verdadera y no violenta']],
  ['forgiveness not coerced',['El perdón no puede ser obligado']],
  ['no spiritual elitism',['no un producto secreto vendido por élites espirituales']],
  ['humble uncertainty',['Sabe cuándo decir: “No lo sé”']],
  ['series pastoral safeguards',['No uses Proverbios para avergonzar la pobreza, prometer riqueza, justificar disciplina cruel, culpar víctimas, estereotipar a las mujeres','una crianza fiel controla las decisiones de un hijo adulto']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Proverbs safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/proverbios-estudio'+html+'"'))fail('English Proverbs page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.57.0'))fail('English Proverbs page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/proverbios-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/proverbs-study'+html+'"','../proverbs-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.57.0'])if(!spanish.includes(marker))fail(`Spanish Proverbs page missing ${marker}.`);
 if(!i18n.includes("'proverbs-study"+html+"':'es/proverbios-estudio"+html+"'"))fail('Proverbs bilingual route is missing.');
 if(!hub.includes('href="proverbios-estudio'+html+'"'))fail('Spanish Proverbs library card is missing.');
 if(!hub.includes('cuarenta y siete series completas y revisadas'))fail('Spanish library count must be forty-seven series.');
}
if(errors.length){console.error('Spanish Proverbs study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Proverbs study audit passed.');
