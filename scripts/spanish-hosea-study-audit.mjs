import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='hosea-study-data'+js,enGuide='hosea-study-guide'+js,esData='hosea-study-data-es'+js,enPage='hosea-study'+html,esPage=['es','oseas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('hosea');
if(book?.status!=='published')fail('Hosea must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='oseas-estudio')fail('Spanish Hosea slug must be oseas-estudio.');
 if(es?.book!=='Oseas')fail('Spanish book name must be Oseas.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Hosea must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Hosea must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Hosea lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Oseas '))fail(`${label}: Scripture reference must begin with Oseas.`);
 }
 if((es?.seriesGuideBlocks?.length??-1)!==(en?.seriesGuideBlocks?.length??0))fail('Spanish Hosea series guide block count must match English.');
 if((es?.postLessonMapGuideBlocks?.length??-1)!==(en?.postLessonMapGuideBlocks?.length??0))fail('Spanish Hosea post-lesson guide block count must match English.');
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel'])if(!String(es?.[field]||'').trim())fail(`Spanish Hosea missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Hosea contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['marriage metaphor not abuse',['nunca deben exigir que alguien permanezca con un cónyuge abusivo o infiel','Distingue metáfora profética de consejería matrimonial']],
  ['coercion and stalking rejected',['acoso, vigilancia o control','consentimiento, seguridad, rendición de cuentas']],
  ['Gomer dignity',['Gomer es una persona','no autoriza misoginia']],
  ['children not shamed',['Ningún niño debe ser etiquetado, humillado o tratado como portador de la culpa']],
  ['antisemitism rejected',['no debe utilizarse para deshumanizar a judíos, justificar antisemitismo']],
  ['violent marriage language not copied',['Nunca pongas esas palabras en boca de un cónyuge abusivo']],
  ['abuse cycle distinguished',['no se parece al ciclo de abuso']],
  ['trafficking and sexual exploitation',['trata, explotación sexual, servidumbre coercitiva']],
  ['boundaries not ownership',['Los límites no son propiedad']],
  ['no forced return to danger',['no obliga a una víctima a regresar a peligro']],
  ['replacement theology rejected',['teología de reemplazo arrogante']],
  ['leader financial exploitation',['convertir culpa, miedo, confesión, dinero o dependencia espiritual en una fuente de poder']],
  ['leader accountability',['La autoridad espiritual aumenta responsabilidad']],
  ['women not selectively blamed',['Nunca uses Oseas para vergüenza selectiva hacia mujeres']],
  ['medical care dignity',['La medicina y la oración pueden caminar juntas']],
  ['political idolatry rejected',['Ningún partido, presidente, nación, movimiento o proyecto político merece la confianza']],
  ['victim blaming rejected',['no autoriza culpar a víctimas por desastres, violencia, pobreza o enfermedad']],
  ['mercy not cover for abuse',['La misericordia tampoco significa ocultar abuso']],
  ['repentance requires fruit',['Una disculpa emotiva no elimina la necesidad de límites, consecuencias, tratamiento, restitución o supervisión']],
  ['no forced access after harm',['sin exigir acceso restaurado']],
  ['parental image not abusive parenting',['No legitima crianza humillante, castigo abusivo, control total']],
  ['family care not codependency',['no convertir amor en agotamiento o codependencia']],
  ['no messianic nationalism',['ninguna fuerza militar, partido, dirigente o nación merece confianza mesiánica']],
  ['healing not instant medical promise',['No prometas que todo trastorno, enfermedad, trauma o discapacidad desaparecerá inmediatamente']],
  ['qualified care',['atención médica y de salud mental competente']],
  ['no prosperity formula',['no es una fórmula de riqueza, fertilidad, salud física o éxito visible']],
  ['unsafe reconciliation rejected',['Nunca presiones revelaciones personales ni reconciliación insegura']],
  ['legal safeguarding',['prioriza seguridad, ayuda profesional calificada y responsabilidades legales de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Hosea safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/oseas-estudio'+html+'"'))fail('English Hosea page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.65.0'))fail('English Hosea page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/oseas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/hosea-study'+html+'"','../hosea-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.65.0'])if(!spanish.includes(marker))fail(`Spanish Hosea page missing ${marker}.`);
 if(!i18n.includes("'hosea-study"+html+"':'es/oseas-estudio"+html+"'"))fail('Hosea bilingual route is missing.');
 if(!hub.includes('href="oseas-estudio'+html+'"'))fail('Spanish Hosea library card is missing.');
 if(!hub.includes('cincuenta y cinco series completas y revisadas'))fail('Spanish library count must be fifty-five series.');
}
if(errors.length){console.error('Spanish Hosea study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Hosea study audit passed.');
