import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='ecclesiastes-study-data'+js,enGuide='ecclesiastes-study-guide'+js,esData='ecclesiastes-study-data-es'+js,enPage='ecclesiastes-study'+html,esPage=['es','eclesiastes-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('ecclesiastes');
if(book?.status!=='published')fail('Ecclesiastes must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Eclesiastés':'Ecclesiastes','Lucas':'Luke','Mateo':'Matthew','Marcos':'Mark','Filipenses':'Philippians','1 Timoteo':'1 Timothy','Salmo':'Psalm','Romanos':'Romans','Génesis':'Genesis','Hechos':'Acts','Apocalipsis':'Revelation','Santiago':'James','Hebreos':'Hebrews','Miqueas':'Micah','1 Corintios':'1 Corinthians','Efesios':'Ephesians','Colosenses':'Colossians','2 Corintios':'2 Corinthians'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='eclesiastes-estudio')fail('Spanish Ecclesiastes slug must be eclesiastes-estudio.');
 if(es?.book!=='Eclesiastés')fail('Spanish book name must be Eclesiastés.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Ecclesiastes must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)fail('Ecclesiastes must retain six lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<6;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ecclesiastes lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Eclesiastés '))fail(`${label}: Scripture reference must begin with Eclesiastés.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Ecclesiastes theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Ecclesiastes must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Ecclesiastes series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Ecclesiastes series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Ecclesiastes series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Ecclesiastes series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Ecclesiastes contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['hebel not nihilism',['hebel: como vapor','pero no por eso carece de valor']],
  ['authorship humility',['Qohelet','autoría discutida']],
  ['under the sun scope',['«bajo el sol»','no la última palabra bíblica sobre resurrección o eternidad']],
  ['death wish safety',['«Odié la vida» es evaluación angustiada, no instrucción de autolesión','intención suicida presente, un plan o incapacidad para mantenerse a salvo']],
  ['seasons descriptive',['El poema de temporadas describe amplitud, no permiso moral','«Tiempo de matar» no bendice violencia personal']],
  ['trauma not beautified',['su trauma fue hermoso o necesario']],
  ['sovereignty not approval',['no conviertas soberanía de Dios en aprobación de abuso, injusticia o daño prevenible']],
  ['oppression suicide lament',['«Los muertos están mejor» es lamento, no instrucción suicida','deseos actuales de morir, intención, planificación o incapacidad para mantenerse a salvo']],
  ['singleness dignity',['no condena la soltería como tal','No uses «dos son mejor que uno» para avergonzar a solteros']],
  ['threefold cord humility',['no identifica explícitamente a Dios como tercer hilo','no insistas en que el cordón de tres hilos sea explícitamente una fórmula matrimonial']],
  ['vows not coercion',['Los votos no deben manipularse, imponerse','no uses votos para atar a alguien a abuso']],
  ['stillbirth dignity',['nunca debe usarse para devaluar hijos perdidos','pérdida gestacional']],
  ['not too righteous',['«No seas demasiado justo» no recomienda mediocridad moral','no a permiso para pecar un poco']],
  ['anti misogyny',['no debe convertirse en misoginia','las mujeres como grupo']],
  ['authority not absolute',['La autoridad real es real pero no absoluta','limita obediencia cuando mandatos humanos contradicen a Dios']],
  ['outcomes not moral proof',['resultados presentes son medidas poco confiables del valor moral','no trates prosperidad o sufrimiento como prueba confiable de condición moral']],
  ['dead know nothing scope',['«Los muertos no saben nada» describe participación perdida bajo el sol','no deben tratarse como respuesta final de toda la Biblia']],
  ['marriage not required',['no hace del matrimonio requisito para una vida significativa']],
  ['hustle rejected',['es fidelidad, no cultura de agotamiento','no uses «todo lo que te venga a la mano» para glorificar sobretrabajo']],
  ['meritocracy rejected',['Tiempo y ocasión rompen la meritocracia','circunstancias más allá del mérito afectan resultados']],
  ['money not doctrine',['no es doctrina bíblica de que el dinero resuelve todo','no prediques «el dinero responde por todo» como aprobación divina']],
  ['leader criticism allowed',['no debe usarse para prohibir crítica verdadera y legal','no uses 10:20 para silenciar crítica legítima a líderes']],
  ['aging dignity',['El poema del envejecimiento exige dignidad y humildad interpretativa','no burla, capacitismo o miedo a depender']],
  ['goads not harshness',['no autoriza a líderes a herir, intimidar, agotar','No uses «aguijones» para justificar enseñanza áspera']],
  ['fear God not surveillance',['no es fórmula para ganar salvación ni licencia para religión basada en vigilancia','no confundas juicio final con salvación por desempeño']],
  ['epilogue distinction',['hablan del Maestro en tercera persona','funcionan como epílogo o voz marco']],
  ['resurrection hope',['Jesucristo resucitado','esperanza cristiana mira más allá de la muerte hacia resurrección']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Ecclesiastes safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No diagnostiques a participantes desde el texto','intención presente, plan o incapacidad para mantenerse a salvo','apoyo inmediato de crisis o emergencia','silenciar denuncia','deberes de denuncia','preservación de evidencia','ayuda calificada'])if(!all.includes(phrase))fail(`Ecclesiastes leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/eclesiastes-estudio'+html+'"'))fail('English Ecclesiastes page must link Spanish alternate.');
 if(!english.includes('ecclesiastes-study-data'+js+'?v=1.1.0')||!english.includes('ecclesiastes-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Ecclesiastes page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/eclesiastes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/ecclesiastes-study'+html+'"','../ecclesiastes-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.58.0'])if(!spanish.includes(marker))fail(`Spanish Ecclesiastes page missing ${marker}.`);
 if(!i18n.includes("'ecclesiastes-study"+html+"':'es/eclesiastes-estudio"+html+"'"))fail('Ecclesiastes bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Ecclesiastes study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ecclesiastes study audit passed.');
