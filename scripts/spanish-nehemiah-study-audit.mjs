import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='nehemiah-study-data'+js,enGuide='nehemiah-study-guide'+js,esData='nehemiah-study-data-es'+js,enPage='nehemiah-study'+html,esPage=['es','nehemias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('nehemiah');
if(book?.status!=='published')fail('Nehemiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='nehemias-estudio')fail('Spanish Nehemiah slug must be nehemias-estudio.');
 if(es?.book!=='Nehemías')fail('Spanish book name must be Nehemías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Nehemiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Nehemiah must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Nehemiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Nehemías '))fail(`${label}: Scripture reference must begin with Nehemías.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Nehemiah theme label must be Verdad clave.');
 if((es?.seriesGuideBlocks?.length??0)!==(en?.seriesGuideBlocks?.length??0))fail('Nehemiah series guide block count must match English.');
 if((es?.postLessonMapGuideBlocks?.length??0)!==(en?.postLessonMapGuideBlocks?.length??0))fail('Nehemiah post-lesson guide block count must match English.');
 if(!String(es?.recommendedRhythm||'').trim())fail('Nehemiah recommended rhythm is missing.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Nehemiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['grief and honest reality',['no se apresura a pasar por encima del dolor','buscamos la verdad en vez de protegernos de realidades incómodas']],
  ['vision and honest assessment',['no construye entusiasmo sobre suposiciones','promesas que ignoran la condición real de la obra']],
  ['shared work without exploitation',['no de coerción ni de un sistema que explota repetidamente a las personas confiables']],
  ['burnout dignity',['Los líderes no deben tratar la fatiga como rebeldía','permite nombrar límites y reorganizar cargas']],
  ['prayer and safety',['Las medidas de seguridad sabias pueden ser expresiones de responsabilidad']],
  ['debt and child exploitation',['pierden a sus hijos en servidumbre por deudas','acusa a los nobles de cobrar intereses y esclavizar']],
  ['public accountability',['La rendición de cuentas pública puede ser necesaria','cuando el secreto protege un daño continuo']],
  ['restitution',['Una disculpa sin reparación deja a la víctima cargando el costo','busca restaurar lo que puede ser restaurado']],
  ['leader privilege',['Los líderes deben preguntar cómo sus privilegios afectan a personas que ya están cargadas']],
  ['generosity without formula',['no es una fórmula financiera universal']],
  ['spiritual manipulation',['no viene de Dios solamente porque suena religioso','invoca autoridad espiritual']],
  ['Scripture clarity',['La claridad sirve a la obediencia y protege contra la manipulación']],
  ['immigrant and ethnic dignity',['no autorizan racismo, xenofobia, hostilidad contra inmigrantes ni coerción matrimonial hoy']],
  ['noncoercive reform',['no autorizan violencia física, humillación, abuso pastoral, decisiones matrimoniales forzadas ni disciplina eclesial coercitiva']],
  ['law and safety',['debe proteger la dignidad, la seguridad y la responsabilidad ante la ley']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Nehemiah safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['El lenguaje de oposición no debe usarse para etiquetar a cada crítico como enemigo','Algunas críticas revelan daño real','nunca presiones revelaciones','No glorifiques agotamiento, coerción, intimidación, violencia ni manipulación espiritual','no prometas confidencialidad absoluta','obligaciones legales de denuncia'])if(!all.includes(phrase))fail(`Nehemiah leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/nehemias-estudio'+html+'"'))fail('English Nehemiah page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.53.0'))fail('English Nehemiah page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/nehemias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/nehemiah-study'+html+'"','../nehemiah-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.53.0'])if(!spanish.includes(marker))fail(`Spanish Nehemiah page missing ${marker}.`);
 if(!i18n.includes("'nehemiah-study"+html+"':'es/nehemias-estudio"+html+"'"))fail('Nehemiah bilingual route is missing.');
 if(!hub.includes('href="nehemias-estudio'+html+'"'))fail('Spanish Nehemiah library card is missing.');
 if(!hub.includes('cuarenta y tres series completas y revisadas'))fail('Spanish library count must be forty-three series.');
}
if(errors.length){console.error('Spanish Nehemiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Nehemiah study audit passed.');