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
 const names={'Salmo':'Psalm','Santiago':'James','Deuteronomio':'Deuteronomy','Colosenses':'Colossians','Mateo':'Matthew','Filipenses':'Philippians','Hebreos':'Hebrews','1 Corintios':'1 Corinthians','1 Tesalonicenses':'1 Thessalonians','Efesios':'Ephesians','Isaías':'Isaiah','2 Corintios':'2 Corinthians','Gálatas':'Galatians','Marcos':'Mark','Miqueas':'Micah','Romanos':'Romans','Lucas':'Luke'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='proverbios-estudio')fail('Spanish Proverbs slug must be proverbios-estudio.');
 if(es?.book!=='Proverbios')fail('Spanish book name must be Proverbios.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Proverbs must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Proverbs must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Proverbs lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Proverbios '))fail(`${label}: Scripture reference must begin with Proverbios.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Proverbs theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Proverbs must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Proverbs series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Proverbs series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Proverbs series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Proverbs series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Proverbs contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['wisdom patterns not guarantees',['patrones morales confiables sin prometer','Job y Eclesiastés']],
  ['fear not abusive control',['control por miedo','líderes religiosos a crear terror']],
  ['questions and authority',['preguntas sinceras','lealtad incuestionable']],
  ['group coercion',['coerción, manipulación, amenazas','misma libertad']],
  ['discipline not abuse',['disciplina es formación, no permiso para crueldad','control coercitivo o abuso']],
  ['trust not anti intellectualism',['Confiar en el SEÑOR no significa dejar de pensar','antiintelectualismo']],
  ['sexual responsibility',['nunca da permiso a hombres para culpar a mujeres','consentimiento, honestidad, ternura y honor mutuo']],
  ['victim blaming rejected',['no culpe a quien fue objetivo de coerción','Nunca preguntes a sobrevivientes qué hicieron para «provocar» daño']],
  ['speech not manifestation',['no poder mágico','No conviertas Proverbios 18:21 en enseñanza de «manifestación»']],
  ['abuse not covered by love',['El amor no significa cubrir abuso','No uses «el amor cubre ofensas» para esconder abuso']],
  ['confidentiality limits',['La confidencialidad tiene límites morales','No prometas confidencialidad absoluta']],
  ['poverty dignity',['La riqueza no salva, la pobreza no prueba pereza','No llames perezosa a toda persona desempleada o pobre']],
  ['giving not prosperity',['sin convertirse en fórmula de retorno','No prometas que generosidad garantiza aumento financiero']],
  ['public assistance dignity',['asistencia pública, apoyo por discapacidad, atención médica o ayuda comunitaria']],
  ['Proverbs 22:6 not guarantee',['no control parental de la vida adulta','no garantiza que una crianza fiel determine toda elección posterior']],
  ['Proverbs 31 not checklist',['no horario obligatorio para cada mujer','No conviertas Proverbios 31 en una puntuación para mujeres']],
  ['king sovereignty not endorsement',['La soberanía de Dios no santifica cada decisión','no elimina responsabilidad']],
  ['advocacy preserves agency',['no significa hablar encima de él','preserva agencia']],
  ['fair process and accountability',['proceso justo','revisión independiente']],
  ['anger serious harm distinction',['no deben reducirse a «una ofensa»','No digas a una persona abusada o amenazada que «pase por alto la ofensa»']],
  ['forgiveness not restored access',['no debe confianza, acceso ni reconciliación inmediata','consecuencias, restitución, límites o confianza ganada']],
  ['woman wisdom personification',['La Mujer Sabiduría es personificación poética','no debe usarse de manera simplista para decir que el Hijo fue creado']],
  ['Agur humility not self hate',['humildad intelectual sin odio propio','sin caer en inutilidad']],
  ['private habits public justice',['gobierno propio con justicia pública','juicio deteriorado puede producir daño público']],
  ['series parenting safeguard',['Proverbios 22:6 garantiza las decisiones de un hijo adulto']],
  ['series poverty safeguard',['prometer prosperidad, avergonzar pobreza']],
  ['series abuse safeguard',['excusa crianza cruel','personas abusadas que se sometan al peligro']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Proverbs safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No exijas revelación ni confrontación privada','Nunca uses confidencialidad para ocultar abuso o delito','deberes de denuncia','protección legal','cuidado calificado'])if(!all.includes(phrase))fail(`Proverbs leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/proverbios-estudio'+html+'"'))fail('English Proverbs page must link Spanish alternate.');
 if(!english.includes('proverbs-study-data'+js+'?v=1.1.0')||!english.includes('proverbs-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Proverbs page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/proverbios-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/proverbs-study'+html+'"','../proverbs-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.57.0'])if(!spanish.includes(marker))fail(`Spanish Proverbs page missing ${marker}.`);
 if(!i18n.includes("'proverbs-study"+html+"':'es/proverbios-estudio"+html+"'"))fail('Proverbs bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Proverbs study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Proverbs study audit passed.');
