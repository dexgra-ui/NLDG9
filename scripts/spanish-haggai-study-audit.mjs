import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='haggai-study-data'+js,enGuide='haggai-study-guide'+js,esData='haggai-study-data-es'+js,enPage='haggai-study'+html,esPage=['es','hageo-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('haggai')?.status!=='published')fail('Haggai must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Hageo':'Haggai','Deuteronomio':'Deuteronomy','Esdras':'Ezra','Mateo':'Matthew','Lucas':'Luke','Santiago':'James','Éxodo':'Exodus','Zacarías':'Zechariah','Juan':'John','Hebreos':'Hebrews','Levítico':'Leviticus','Números':'Numbers','Salmo':'Psalm','Marcos':'Mark','Jeremías':'Jeremiah','Efesios':'Ephesians','1 Pedro':'1 Peter'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);

 if(es?.slug!=='hageo-estudio')fail('Spanish Haggai slug must be hageo-estudio.');
 if(es?.book!=='Hageo')fail('Spanish book name must be Hageo.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Haggai must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Haggai theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Haggai must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Haggai must retain four lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Haggai series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Haggai lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b?.scripture)!==a?.scripture)fail(`${label}: main Scripture range must match English exactly.`);
  if(JSON.stringify((b?.supporting||[]).map(norm))!==JSON.stringify(a?.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','openingParagraphs','contextParagraphs','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain exactly two Scripture-context paragraphs.`);
  if((b?.jesusParagraphs?.length??0)!==1)fail(`${label}: must retain one Jesus Connection paragraph.`);
  if((b?.guardrailParagraphs?.length??0)!==1)fail(`${label}: must retain one Do Not Miss This paragraph.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Hageo '))fail(`${label}: Scripture reference must begin with Hageo.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Haggai series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Haggai series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Haggai series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Haggai series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Haggai contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Persian historical setting',['darío i de persia']],
  ['paneled houses not automatic luxury',['no demuestra necesariamente que cada hogar viviera en lujo']],
  ['hardship not automatic sin proof',['no digas a alguien que su enfermedad, desempleo, deuda, pérdida de cosecha']],
  ['no church building pressure',['campaña de capital de iglesia']],
  ['church building not Jerusalem temple',['no equipares edificios de iglesia con el templo de jerusalén']],
  ['Haggai 2:7 translation humility',['la expresión hebrea detrás de la frase tradicional deseo de todas las naciones es debatida']],
  ['no prosperity silver and gold',['no prometas abundancia financiera por el lenguaje de plata y oro']],
  ['no modern shaking speculation',['no identifiques terremotos, guerras, mercados o gobiernos específicos']],
  ['ritual purity not stigma',['no estigmatices muerte, duelo, enfermedad, discapacidad, menstruación, pobreza, etnia o trauma']],
  ['foundation chronology humility',['preguntas cronológicas']],
  ['blessing not prosperity guarantee',['no uses desde este día los bendeciré como garantía de riqueza, sanidad, fertilidad, empleo o éxito de negocio']],
  ['Jeremiah signet background',['jeremías 22:24–30']],
  ['Zerubbabel not final king',['no digas que zorobabel se convirtió en el rey final prometido']],
  ['Hebrews citation accuracy',['hebreos 12 cita directamente hageo 2:6']],
  ['no modern political fulfillment mapping',['no identifiques un gobierno actual, elección, guerra, alianza o colapso militar como cumplimiento específico']],
  ['Jesus temple connection',['juan 2:19–21']],
  ['Zerubbabel in Jesus genealogy',['mateo 1:12–13']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Haggai safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/hageo-estudio'+html+'"'))fail('English Haggai page must link Spanish alternate.');
 if(!english.includes('haggai-study-data'+js+'?v=1.1.0')||!english.includes('haggai-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.74.0'))fail('English Haggai page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/hageo-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/haggai-study'+html+'"','../haggai-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.74.0'])if(!spanish.includes(marker))fail(`Spanish Haggai page missing ${marker}.`);
 if(!i18n.includes("'haggai-study"+html+"':'es/hageo-estudio"+html+"'"))fail('Haggai bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Haggai study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Haggai study audit passed.');
