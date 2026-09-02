import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='first-chronicles-study-data'+js,enGuide='first-chronicles-study-guide'+js,esData='first-chronicles-study-data-es'+js,enPage='first-chronicles-study'+html,esPage=['es','primera-cronicas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('first-chronicles');
if(book?.status!=='published')fail('1 Chronicles must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='primera-cronicas-estudio')fail('Spanish 1 Chronicles slug must be primera-cronicas-estudio.');
 if(es?.book!=='1 Crónicas')fail('Spanish book name must be 1 Crónicas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 1 Chronicles must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('1 Chronicles must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Chronicles lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Crónicas '))fail(`${label}: Scripture reference must begin with 1 Crónicas.`);
  if(!b?.teaching?.some(move=>move.heading==='Jesús en el centro'))fail(`${label}: Jesus-at-the-center movement is missing.`);
 }
 if(es?.themeLabel!=='Compromisos interpretativos')fail('1 Chronicles must retain interpretive commitments.');
 if((es?.seriesGuideBlocks?.length??0)!==(en?.seriesGuideBlocks?.length??0))fail('1 Chronicles series guide block count must match English.');
 if(es?.lessonSubtitleMode!==true)fail('1 Chronicles must retain lesson subtitle mode.');
 if(!String(es?.seriesQuestion||'').trim()||!String(es?.seriesPrayer||'').trim())fail('1 Chronicles series question or prayer is missing.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Chronicles contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['identity and belonging',['no de intentar ganar pertenencia mediante desempeño','ninguno queda fuera de la memoria de Dios']],
  ['imperfect families',['sin aprobar el pecado ni minimizar el dolor familiar']],
  ['loss is not automatic punishment',['toda pérdida o muerte es castigo directo por un pecado específico']],
  ['unity without coercion',['La unidad bíblica no es acuerdo forzado ni silencio']],
  ['Uzzah and tragedy misuse',['nunca debe usarse para asustar a las personas hasta obedecer','explicar cada tragedia como castigo divino']],
  ['institutional humility',['ningún santuario controla a Dios','ni vuelve inmune a una institución frente a la corrección']],
  ['war nationalism and ethnic supremacy',['no pueden usar estos textos para bautizar odio, dominación, nacionalismo, supremacía étnica ni venganza personal']],
  ['leader accountability',['nunca exige ocultar abuso, explotación, engaño o daño']],
  ['census leadership harm',['personas comunes sufren por la decisión de un gobernante','La autoridad aumenta la responsabilidad']],
  ['repentance and repair',['no minimiza, desvía la culpa ni exige perdón rápido','reparación concreta y veraz donde la reparación es posible']],
  ['mentoring without control',['espacio para crecer en vez de controlar cada decisión']],
  ['shared ministry',['resiste liderazgo centrado en una personalidad']],
  ['voluntary giving',['nunca debe justificar presión, vergüenza pública, promesas de prosperidad','responsabilidades básicas o a personas vulnerables']],
  ['Jesus-centered leadership',['Jesús es el Hijo fiel de David','no excusa el pecado humano ni la coerción']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Chronicles safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['exigir lealtad, dinero, silencio o revelaciones inseguras','La violencia antigua no es un mandato para imitación cristiana','Protege a personas vulnerables','cumple responsabilidades de denuncia y protección','apoyo pastoral, médico, legal o profesional adecuado'])if(!all.includes(phrase))fail(`1 Chronicles leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-cronicas-estudio'+html+'"'))fail('English 1 Chronicles page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.50.0'))fail('English 1 Chronicles page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-cronicas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-chronicles-study'+html+'"','../first-chronicles-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.50.0'])if(!spanish.includes(marker))fail(`Spanish 1 Chronicles page missing ${marker}.`);
 if(!i18n.includes("'first-chronicles-study"+html+"':'es/primera-cronicas-estudio"+html+"'"))fail('1 Chronicles bilingual route is missing.');
 if(!hub.includes('href="primera-cronicas-estudio'+html+'"'))fail('Spanish 1 Chronicles library card is missing.');
 if(!hub.includes('cuarenta series completas y revisadas'))fail('Spanish library count must be forty series.');
}
if(errors.length){console.error('Spanish 1 Chronicles study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Chronicles study audit passed.');