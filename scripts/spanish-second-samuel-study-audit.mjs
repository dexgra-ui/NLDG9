import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='second-samuel-study-data'+js,enGuide='second-samuel-study-guide'+js,esData='second-samuel-study-data-es'+js,enPage='second-samuel-study'+html,esPage=['es','segunda-samuel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('second-samuel');
if(book?.status!=='published')fail('2 Samuel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='segunda-samuel-estudio')fail('Spanish 2 Samuel slug must be segunda-samuel-estudio.');
 if(es?.book!=='2 Samuel')fail('Spanish book name must be 2 Samuel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish 2 Samuel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('2 Samuel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`2 Samuel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Samuel '))fail(`${label}: Scripture reference must begin with 2 Samuel.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`2 Samuel series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6)fail('2 Samuel series foundation must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8)fail('2 Samuel series foundation must retain eight discussion questions.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish 2 Samuel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['survivor-centered lament and anti-summary violence',['no es modelo moderno para castigos sumarios','sin borrar la historia ni obligar a sobrevivientes']],
  ['clergy authority and infertility dignity',['obediencia incuestionable al clero','ni para culpar a alguien por infertilidad']],
  ['disability dignity and anti-nationalism',['La discapacidad no reduce la dignidad','no autoriza expansión moderna ni nacionalismo religioso']],
  ['Bathsheba power imbalance and victim blaming',['La diferencia de poder hace indefendible culpar a Betsabé','No especules sobre ropa, motivos o consentimiento']],
  ['crime reporting and consequences',['reporta delitos y exige cambio responsable','no debe usarse para afirmar que los niños son castigados mecánicamente']],
  ['Tamar consent and survivor care',['Tamar dice no con claridad','La culpa es completamente de él','merecen ser creídas, seguridad, capacidad de decisión y apoyo competente']],
  ['institutional abuse response',['denuncia, investigación independiente, restricciones protectoras y rendición de cuentas legal','no secretos manejados por la familia']],
  ['political sexual violence',['víctimas de violencia sexual política','no convierte el abuso en algo moralmente bueno']],
  ['grief without coercion',['nunca obliga a sobrevivientes a sentir lo mismo','El duelo todavía merece apoyo']],
  ['disability exploitation and peacemaking',['dependencia relacionada con discapacidad pueden ser explotadas','una mujer sabia negocia para salvar su ciudad']],
  ['collective punishment and Rizpah dignity',['no debe convertirse en modelo de castigo colectivo','Rizpa protege los cuerpos durante meses']],
  ['leadership limits and accountable repentance',['Aceptar límites protege a la comunidad','arrepentimiento costoso y misericordia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`2 Samuel safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','procedimientos aprobados de protección','rendición de cuentas independiente','obligaciones legales de denuncia','proteger a ofensores poderosos','promover antisemitismo','forzar acceso inseguro'])if(!all.includes(phrase))fail(`2 Samuel leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/segunda-samuel-estudio'+html+'"'))fail('English 2 Samuel page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.47.0'))fail('English 2 Samuel page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/segunda-samuel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-samuel-study'+html+'"','../second-samuel-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.47.0'])if(!spanish.includes(marker))fail(`Spanish 2 Samuel page missing ${marker}.`);
 if(!i18n.includes("'second-samuel-study"+html+"':'es/segunda-samuel-estudio"+html+"'"))fail('2 Samuel bilingual route is missing.');
 if(!hub.includes('href="segunda-samuel-estudio'+html+'"'))fail('Spanish 2 Samuel library card is missing.');
 if(!hub.includes('treinta y siete series completas y revisadas'))fail('Spanish library count must be thirty-seven series.');
}
if(errors.length){console.error('Spanish 2 Samuel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Samuel study audit passed.');