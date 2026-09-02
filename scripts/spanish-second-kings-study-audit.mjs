import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-kings-study-data'+js,enGuide='second-kings-study-guide'+js,esData='second-kings-study-data-es'+js,enPage='second-kings-study'+html,esPage=['es','segunda-reyes-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-kings');
if(book?.status!=='published')fail('2 Kings must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-reyes-estudio')fail('Spanish 2 Kings slug must be segunda-reyes-estudio.');
 if(es?.book!=='2 Reyes')fail('Spanish book name must be 2 Reyes.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Kings must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Kings must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Kings lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Reyes '))fail(`${label}: Scripture reference must begin with 2 Reyes.`);
 }
 if(es?.themeLabel!=='Compromisos interpretativos')fail('2 Kings must retain the interpretive-commitments foundation.');
 if((es?.seriesGuideBlocks?.length??0)!==(en?.seriesGuideBlocks?.length??0))fail('2 Kings series guide block count must match English.');
 for(const block of es?.seriesGuideBlocks||[])if(!block?.title?.trim()||!block?.text?.trim())fail('2 Kings contains an incomplete series guide block.');
 if(!String(es?.seriesPrayer||'').trim())fail('2 Kings series prayer is missing.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Kings contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['prophetic violence and children',['No autorizan a creyentes a amenazar oponentes','Nunca debe usarse para justificar violencia contra niños, jóvenes o críticos verbales']],
  ['war and prosperity misuse',['Dios respalda toda campaña militar','No es una técnica de prosperidad']],
  ['grief and healing dignity',['No garantiza que toda oración produzca sanidad inmediata','familia en duelo carezca de fe']],
  ['captivity and survivor agency',['sin aprobar su cautiverio','ni exigir que personas dañadas rescaten a quienes les hicieron daño']],
  ['illness disability dignity',['Personas con enfermedad o discapacidad llevan la imagen de Dios','nunca deben ser tratadas como maldiciones']],
  ['financial exploitation',['el acceso a Dios está en venta','engaño en recaudación, enriquecimiento privado']],
  ['siege trauma and hunger',['Lee el texto con lamento','sin sensacionalismo','ayuda alimentaria, planes de seguridad']],
  ['violent political reform',['no es un mandato permanente de violencia religiosa','Las víctimas no son utilería','necesitan seguridad, justicia, lamento y cuidado']],
  ['child protection and reporting',['Proteger a un niño de la tiranía','canales seguros de denuncia y protección contra represalias']],
  ['disaster blame and ethnicity',['todo desastre moderno es castigo directo','El problema no es la etnicidad','Rechaza el prejuicio']],
  ['medical care dignity',['Oración y atención médica no compiten','La sanidad es gracia, no medida del valor']],
  ['antisemitism and women prophets',['Nunca debe alimentar antisemitismo','La autoridad profética de Hulda','sin desprecio basado en género']],
  ['civilian suffering and exile dignity',['no autoriza desprecio hacia el pueblo judío ni celebración del sufrimiento civil','preservar identidad, dignidad y promesa en el desplazamiento']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Kings safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['Nunca presiones a sobrevivientes para reconciliarse sin seguridad y rendición de cuentas','atención médica, consejería, protección legal','prácticas financieras transparentes','Nombra la violencia sin detalles sensacionalistas','protege la libertad de cada participante para pasar una pregunta'])if(!all.includes(phrase))fail(`2 Kings leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-reyes-estudio'+html+'"'))fail('English 2 Kings page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.49.0'))fail('English 2 Kings page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-reyes-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-kings-study'+html+'"','../second-kings-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.49.0'])if(!spanish.includes(marker))fail(`Spanish 2 Kings page missing ${marker}.`);
 if(!i18n.includes("'second-kings-study"+html+"':'es/segunda-reyes-estudio"+html+"'"))fail('2 Kings bilingual route is missing.');
 if(!hub.includes('href="segunda-reyes-estudio'+html+'"'))fail('Spanish 2 Kings library card is missing.');
 if(!hub.includes('treinta y nueve series completas y revisadas'))fail('Spanish library count must be thirty-nine series.');
}
if(errors.length){console.error('Spanish 2 Kings study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Kings study audit passed.');