import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='ezra-study-data'+js,enGuide='ezra-study-guide'+js,esData='ezra-study-data-es'+js,enPage='ezra-study'+html,esPage=['es','esdras-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('ezra');
if(book?.status!=='published')fail('Ezra must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='esdras-estudio')fail('Spanish Ezra slug must be esdras-estudio.');
 if(es?.book!=='Esdras')fail('Spanish book name must be Esdras.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Ezra must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)fail('Ezra must retain six lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<6;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ezra lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Esdras '))fail(`${label}: Scripture reference must begin with Esdras.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Ezra theme label must be Verdad clave.');
 if((es?.seriesTeaching?.length??0)!==(en?.seriesTeaching?.length??0))fail('Ezra series teaching count must match English.');
 if((es?.seriesQuestions?.length??0)!==(en?.seriesQuestions?.length??0))fail('Ezra series question count must match English.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Ezra missing ${field}.`);
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Ezra contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['political providence without ruler worship',['sin convertir a Ciro en rey del pacto','el acceso político nunca debe convertirse en adoración']],
  ['records and fair process',['nunca deben convertirse en herramientas de exclusión o vigilancia abusiva','Un proceso justo protege']],
  ['reasonable safety',['ningún líder debe usar este texto para ignorar medidas razonables de seguridad']],
  ['grief and hope together',['no exige que desaparezca el duelo para proteger una celebración']],
  ['ethnicity and partnership',['no da permiso para desconfiar de personas por su etnia']],
  ['conflict without dehumanization',['La oposición no autoriza lenguaje deshumanizante']],
  ['documentation and governance',['documentación clara financiera, legal y de gobierno']],
  ['political authority limits',['no deben confundir el permiso imperial con la aprobación divina']],
  ['prayer and practical security',['La oración expresa dependencia, no control mágico','Buscar seguridad práctica no es necesariamente falta de fe']],
  ['financial accountability',['Varios mayordomos y cuentas escritas protegen la confianza']],
  ['intermarriage is not racial purity',['no el color de piel, la pureza biológica ni una prohibición universal del matrimonio intercultural']],
  ['family vulnerability',['esposas e hijos quedan en gran medida sin voz','no celebración de la separación familiar']],
  ['no mechanical imitation',['no presenta directamente un mandato divino ni un oráculo profético que ordene cada paso']],
  ['responsible Christian marriage application',['prohíbe que creyentes se divorcien de cónyuges no creyentes dispuestos a permanecer únicamente por diferencia de fe']],
  ['anti-racism and immigrant dignity',['nunca debe usarse para justificar racismo, antisemitismo, hostilidad contra inmigrantes, divorcio forzado ni abandono']],
  ['protect children and spouses',['protege a niños y cónyuges vulnerables','nunca presiones una revelación pública']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Ezra safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['pureza étnica','hostilidad contra inmigrantes','divorcio forzado','abandono familiar','No prometas confidencialidad absoluta','obligaciones legales de denuncia'])if(!all.includes(phrase))fail(`Ezra leader safeguard missing ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/esdras-estudio'+html+'"'))fail('English Ezra page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.52.0'))fail('English Ezra page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/esdras-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/ezra-study'+html+'"','../ezra-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.52.0'])if(!spanish.includes(marker))fail(`Spanish Ezra page missing ${marker}.`);
 if(!i18n.includes("'ezra-study"+html+"':'es/esdras-estudio"+html+"'"))fail('Ezra bilingual route is missing.');
 if(!hub.includes('href="esdras-estudio'+html+'"'))fail('Spanish Ezra library card is missing.');
 if(!hub.includes('cuarenta y dos series completas y revisadas'))fail('Spanish library count must be forty-two series.');
}
if(errors.length){console.error('Spanish Ezra study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Ezra study audit passed.');