import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='nahum-study-data'+js,enGuide='nahum-study-guide'+js,esData='nahum-study-data-es'+js,enPage='nahum-study'+html,esPage=['es','nahum-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail('Missing '+file+'.');
if(spanishOldTestamentByKey.get('nahum')?.status!=='published')fail('Nahum must be marked published.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='nahum-estudio')fail('Spanish Nahum slug must be nahum-estudio.');
 if(es?.book!=='Nahúm')fail('Spanish book name must be Nahúm.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Nahum must declare NTV.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Nahum must retain four lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Nahum lesson '+(i+1);
  if(a?.number!==b?.number)fail(label+': lesson number mismatch.');
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(label+': missing '+field+'.');
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(label+': '+field+' count must match English.');
  if((b?.teaching?.length??0)!==6)fail(label+': expected six teaching movements.');
  if((b?.questions?.length??0)!==8)fail(label+': expected eight discussion questions.');
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(label+': incomplete teaching movement.');
  if(!String(b?.scripture||'').startsWith('Nahúm '))fail(label+': Scripture reference must begin with Nahúm.');
 }
 if((es?.seriesTeaching?.length??-1)!==(en?.seriesTeaching?.length??0))fail('Spanish Nahum series teaching count must match English.');
 if((es?.seriesQuestions?.length??-1)!==(en?.seriesQuestions?.length??0))fail('Spanish Nahum series question count must match English.');
 const richFields=['themeLabel','seriesPurposeLabel','lessonPurposeLabel','openingLabel','mainPassageLabel','supportingScriptureLabel','scriptureContextLabel','keyTruthLabel','lessonQuestionLabel','lessonFoundationLabel','lessonTeachingLabel','discussionQuestionsLabel','personalExaminationLabel','weeklyPracticeLabel','leaderGuidanceLabel','closingPrayerLabel','seriesFoundationLabel','seriesMainScriptureLabel','seriesQuestionLabel','seriesOpeningLabel','seriesScriptureContextLabel','seriesTeachingLabel','seriesQuestionsLabel','seriesExaminationLabel','seriesPracticeLabel','seriesLeaderGuidanceLabel','seriesPrayerLabel','seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'];
 for(const field of richFields)if(!String(es?.[field]||'').trim())fail('Spanish Nahum missing '+field+'.');
 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(raw))fail('Spanish Nahum contains disallowed Bible version '+version+'.');
 const safeguards=[
  ['historical imperial violence','conquista, terror, tributo forzado y crueldad pública'],
  ['no modern Nineveh labeling','no es permiso para que naciones o individuos modernos etiqueten a sus enemigos como nínive'],
  ['divine anger distinguished','su ira no es irritación impulsiva'],
  ['disaster victim-blaming rejected','no autoriza a identificar tormentas ni desastres concretos como castigo'],
  ['lawful accountability','rendición de cuentas conforme a la ley'],
  ['personal vengeance rejected','rechazamos la venganza personal'],
  ['combat not romanticized','no deben romantizar el combate'],
  ['no nation owns God','ninguna nación posee a dios'],
  ['modern self-righteousness rejected','ningún pueblo moderno debe imaginarse automáticamente justo'],
  ['dehumanizing speech rejected','rechazar lenguaje deshumanizante'],
  ['women not shamed','nunca usarlas para avergonzar a mujeres ni culpar a víctimas'],
  ['survivor dignity','a quienes sobrevivieron nunca se les debe exhibir'],
  ['safe reporting','denuncia segura'],
  ['living people not beyond grace','personas vivas están fuera del alcance de la gracia'],
  ['relief distinguished from delight','no es lo mismo que deleitarse en el dolor'],
  ['courts and boundaries preserved','no prohíbe tribunales, límites, rescate ni denuncia'],
  ['no tragedy certainty','una tragedia actual demuestra una sentencia divina específica'],
  ['collective blame rejected','culpa colectiva'],
  ['retaliation harassment nationalism rejected','represalias, acoso, nacionalismo ni deleite en el sufrimiento'],
  ['trauma disclosure rejected','no pidas a los participantes que revelen experiencias traumáticas'],
  ['immediate safety and care','seguridad inmediata, atención pastoral o profesional competente'],
  ['reporting duties preserved','obligaciones de denuncia aplicables'],
  ['forgiveness safeguards','el perdón nunca exige secreto, negación, acceso inseguro ni eliminación de la rendición de cuentas'],
  ['Jesus-centered formation','bajo el señorío de jesús']
 ];
 for(const [label,phrase] of safeguards)if(!all.includes(phrase.toLowerCase()))fail('Nahum safeguard missing '+label+': '+phrase+'.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/nahum-estudio'+html+'"'))fail('English Nahum page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.71.0'))fail('English Nahum page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/nahum-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/nahum-study'+html+'"','../nahum-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.71.0'])if(!spanish.includes(marker))fail('Spanish Nahum page missing '+marker+'.');
 if(!i18n.includes("'nahum-study"+html+"':'es/nahum-estudio"+html+"'"))fail('Nahum bilingual route is missing.');
 if(!hub.includes('href="nahum-estudio'+html+'"'))fail('Spanish Nahum library card is missing.');
 if(!hub.includes('sesenta y una series completas y revisadas'))fail('Spanish library count must be sixty-one series.');
}
if(errors.length){console.error('Spanish Nahum study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Nahum study audit passed.');
