import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='jeremiah-study-data'+js,enGuide='jeremiah-study-guide'+js,esData='jeremiah-study-data-es'+js,enPage='jeremiah-study'+html,esPage=['es','jeremias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('jeremiah');
if(book?.status!=='published')fail('Jeremiah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Jeremías':'Jeremiah','Éxodo':'Exodus','Isaías':'Isaiah','Ezequiel':'Ezekiel','1 Timoteo':'1 Timothy','Santiago':'James','Deuteronomio':'Deuteronomy','Oseas':'Hosea','Juan':'John','Romanos':'Romans','Apocalipsis':'Revelation','1 Samuel':'1 Samuel','Miqueas':'Micah','Mateo':'Matthew','Salmo':'Psalm','2 Corintios':'2 Corinthians','1 Juan':'1 John','2 Reyes':'2 Kings','1 Tesalonicenses':'1 Thessalonians','1 Pedro':'1 Peter','Lucas':'Luke','Hebreos':'Hebrews','Hechos':'Acts','2 Timoteo':'2 Timothy','Génesis':'Genesis','Abdías':'Obadiah'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='jeremias-estudio')fail('Spanish Jeremiah slug must be jeremias-estudio.');
 if(es?.book!=='Jeremías')fail('Spanish book name must be Jeremías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Jeremiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Jeremiah must retain eight lessons in both languages.');
 const expectedEn=['Jeremiah 1','Jeremiah 2–6','Jeremiah 7–13','Jeremiah 14–20','Jeremiah 21–29','Jeremiah 30–35','Jeremiah 36–45','Jeremiah 46–52'];
 const expectedEs=['Jeremías 1','Jeremías 2–6','Jeremías 7–13','Jeremías 14–20','Jeremías 21–29','Jeremías 30–35','Jeremías 36–45','Jeremías 46–52'];
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Jeremiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(a?.scripture!==expectedEn[i]||b?.scripture!==expectedEs[i])fail(`${label}: full-book Scripture range mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Jeremías '))fail(`${label}: Scripture reference must begin with Jeremías.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Jeremiah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Jeremiah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Jeremiah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Jeremiah series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Jeremiah series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Jeremiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['calling accountability',['El llamado nunca hace intocable a un profeta','Ningún líder moderno puede usar llamado para quedar por encima de prueba']],
  ['critics not enemies',['La oposición no demuestra automáticamente','sus críticos sean enemigos de Dios']],
  ['sexualized metaphor care',['Las metáforas sexualizadas requieren cuidado pastoral','No uses metáforas sexuales del pacto para avergonzar mujeres o sobrevivientes']],
  ['ancient paths not nostalgia',['Las sendas antiguas son fidelidad del pacto, no nostalgia']],
  ['institutional accountability',['«Templo del SEÑOR» se vuelve falsa seguridad','Ninguna iglesia, denominación o ministerio queda fuera de rendición de cuentas']],
  ['child safeguarding',['Tofet muestra el horror de sacrificar niños','prioriza protección y denuncia obligatoria']],
  ['balm not cure formula',['«¿No hay bálsamo en Galaad?» es lamento, no fórmula de cura']],
  ['potter conditional',['El pasaje del Alfarero es explícitamente condicional','El Alfarero es Dios, no un controlador humano']],
  ['Pashhur abuse',['La violencia de Pasur es abuso de autoridad']],
  ['suicide safety',['desea no haber nacido','intención suicida actual, plan, medios o incapacidad para mantenerse a salvo']],
  ['Jeremiah 29 context',['Jeremías 29:11 habla a esa comunidad dentro de setenta años','no promete prosperidad individual instantánea']],
  ['yoke not tyranny',['No uses el yugo para exigir sumisión a abuso o tiranía']],
  ['new covenant Israel Judah',['El nuevo pacto es hecho con Israel y Judá','sin declarar obsoleta la identidad judía']],
  ['forgiveness boundaries',['El perdón no obliga acceso','el nuevo pacto para borrar a Israel']],
  ['slavery reversal',['La libertad dada y luego revocada expone hipocresía']],
  ['Rechabites not universal rule',['Los recabitas muestran constancia, no regla universal']],
  ['Ebed-melech dignity',['Ebed-melec usa su acceso para rescatar','Un extranjero a la élite de Judá actúa con valentía moral']],
  ['Jerusalem tragedy',['La caída de Jerusalén es catástrofe, no entretenimiento','nunca debe alimentar antisemitismo']],
  ['safety plan dignity',['el paso fiel puede ser planificar seguridad','No equipares un plan de seguridad con cobardía']],
  ['nation oracles not ethnic hate',['Las naciones son responsables sin volverse blancos de odio étnico','No autorizan a tratar egipcios, palestinos, jordanos, sirios, árabes']],
  ['Babylon providence accountability',['Babilonia es usada por Dios y también juzgada','nunca coloca a una nación, ejército, institución o gobernante fuera de responsabilidad moral']],
  ['vengeance not Christian violence',['No autoriza venganza privada, milicias, terrorismo']],
  ['qualified care',['Nunca prometas confidencialidad absoluta','deberes de protección','seguridad inmediata y apoyo calificado']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Jeremiah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/jeremias-estudio'+html+'"'))fail('English Jeremiah page must link Spanish alternate.');
 if(!english.includes('jeremiah-study-data'+js+'?v=1.1.0')||!english.includes('jeremiah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Jeremiah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/jeremias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/jeremiah-study'+html+'"','../jeremiah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.61.0'])if(!spanish.includes(marker))fail(`Spanish Jeremiah page missing ${marker}.`);
 if(!i18n.includes("'jeremiah-study"+html+"':'es/jeremias-estudio"+html+"'"))fail('Jeremiah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Jeremiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Jeremiah study audit passed.');
