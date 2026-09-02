import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='first-samuel-study-data'+js,enGuide='first-samuel-study-guide'+js,esData='first-samuel-study-data-es'+js,enPage='first-samuel-study'+html,esPage=['es','primera-samuel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('first-samuel');
if(book?.status!=='published')fail('1 Samuel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='primera-samuel-estudio')fail('Spanish 1 Samuel slug must be primera-samuel-estudio.');
 if(es?.book!=='1 Samuel')fail('Spanish book name must be 1 Samuel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 1 Samuel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('1 Samuel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`1 Samuel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('1 Samuel '))fail(`${label}: Scripture reference must begin with 1 Samuel.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`1 Samuel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('1 Samuel series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('1 Samuel series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 1 Samuel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['infertility dignity',['no dice que su sufrimiento pruebe una fe débil','Nunca prometas embarazo','medida del valor de una mujer']],
  ['corrupt ministry and survivor protection',['explotan las ofrendas y a mujeres','no limita su acceso ni detiene el daño']],
  ['religious symbols and non-vandalism',['Los símbolos sagrados no garantizan éxito','no autoriza vandalizar']],
  ['political power limits',['El poder concentrado puede consumir a las personas','límites, transparencia y rendición de cuentas pública']],
  ['harmful vows and modern violence',['Los votos dañinos deben ser arrepentidos, no impuestos','no puede justificar violencia moderna']],
  ['mental-health dignity',['no debe usarse para diagnosticar toda enfermedad mental como demoníaca','atención profesional calificada']],
  ['anointed-abuser safety',['no está obligada a permanecer cerca de un abusador “ungido”','Planificar la seguridad y salir no es rebelión']],
  ['evidence over family loyalty',['no debe silenciar la evidencia','ayudar a alguien a ponerse a salvo']],
  ['authority limits and safe distance',['La obediencia a la autoridad tiene límites morales','Rechazar la venganza no significa fingir confianza']],
  ['Abigail peacemaking',['impedir la represalia sangrienta de David','intervenir con valentía']],
  ['occult rejection and human dignity',['no legitima prácticas ocultistas ni intentos de contactar a los muertos','no debe borrar la dignidad humana']],
  ['truthful grief over failed leaders',['El final es tragedia, no celebración','puede ser juzgado con verdad y todavía ser llorado']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`1 Samuel safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','procedimientos aprobados de protección','obligaciones legales de denuncia','encubrir abuso','forzar acceso inseguro'])if(!all.includes(phrase))fail(`1 Samuel leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-samuel-estudio'+html+'"'))fail('English 1 Samuel page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.46.0'))fail('English 1 Samuel page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/primera-samuel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-samuel-study'+html+'"','../first-samuel-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.46.0'])if(!spanish.includes(marker))fail(`Spanish 1 Samuel page missing ${marker}.`);
 if(!i18n.includes("'first-samuel-study"+html+"':'es/primera-samuel-estudio"+html+"'"))fail('1 Samuel bilingual route is missing.');
 if(!hub.includes('href="primera-samuel-estudio'+html+'"'))fail('Spanish 1 Samuel library card is missing.');
 if(!hub.includes('treinta y seis series completas y revisadas'))fail('Spanish library count must be thirty-six series.');
}
if(errors.length){console.error('Spanish 1 Samuel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 1 Samuel study audit passed.');