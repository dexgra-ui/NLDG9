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
 const names={'Nehemías':'Nehemiah','Deuteronomio':'Deuteronomy','Daniel':'Daniel','Salmo':'Psalm','Santiago':'James','Lucas':'Luke','Proverbios':'Proverbs','Esdras':'Ezra','Filipenses':'Philippians','1 Corintios':'1 Corinthians','Romanos':'Romans','Efesios':'Ephesians','Gálatas':'Galatians','1 Pedro':'1 Peter','Mateo':'Matthew','Éxodo':'Exodus','Levítico':'Leviticus','Isaías':'Isaiah','1 Juan':'1 John','2 Corintios':'2 Corinthians','Miqueas':'Micah','Rut':'Ruth'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='nehemias-estudio')fail('Spanish Nehemiah slug must be nehemias-estudio.');
 if(es?.book!=='Nehemías')fail('Spanish book name must be Nehemías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Nehemiah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Nehemiah must retain eight lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Nehemiah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)<5)fail(`${label}: needs at least five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Nehemías '))fail(`${label}: Scripture reference must begin with Nehemías.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Nehemiah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Nehemiah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Nehemiah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6||(en?.seriesTeaching?.length??0)!==6)fail('Nehemiah series guide must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Nehemiah series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Nehemiah series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Nehemiah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['burden is not automatic mandate',['Una carga fuerte no demuestra automáticamente','antes de llamar «voluntad de Dios» a una visión personal']],
  ['political access and safety',['El permiso político no equivale','La escolta real no es fe débil']],
  ['shared work and women',['Las mujeres aparecen en el registro de reconstrucción','no trabajo forzado']],
  ['armed defense limits',['no crean un mandato cristiano para iglesias armadas, milicias o violencia política','no todo desacuerdo es ataque']],
  ['fatigue dignity',['El agotamiento interno debe ser escuchado','no debe convertirse en espiritualidad de sobretrabajo crónico']],
  ['debt and children',['servidumbre por deuda','Los niños no son garantía aceptable']],
  ['restitution and leader privilege',['El arrepentimiento incluye restitución','La gobernación no da derecho a maximizar privilegio']],
  ['great work accountability',['«Estoy haciendo una gran obra» no es permiso para ignorar supervisión','bloquear investigación o protección']],
  ['spiritual manipulation',['Consejo que suena espiritual debe ser probado','manipulación espiritual']],
  ['genealogy and Scripture clarity',['Las genealogías no son pruebas modernas de pureza racial','la enseñanza clara no debe hacer a las personas dependientes']],
  ['joy and inclusion',['«el gozo del SEÑOR» no debe usarse para silenciar duelo','quienes no tienen nada preparado']],
  ['immigrant and ethnic dignity',['no justifican racismo ni hostilidad contra inmigrantes','Rut la moabita']],
  ['chapter 13 violence',['amenazas, maldiciones, golpes, cabello arrancado','no son modelos de disciplina pastoral o consejería familiar']],
  ['forced marriage rejection',['no deben imitar esta violencia ni forzar decisiones matrimoniales','no divorciarse de un cónyuge no creyente dispuesto a permanecer']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Nehemiah safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['No prometas confidencialidad absoluta','deberes de protección y denuncia','ayuda calificada','Nunca etiquetes a todo crítico como enemigo','No reclutes mediante culpa','Nunca presiones a revelar estatus migratorio'])if(!all.includes(phrase))fail(`Nehemiah leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/nehemias-estudio'+html+'"'))fail('English Nehemiah page must link Spanish alternate.');
 if(!english.includes('nehemiah-study-data'+js+'?v=1.1.0')||!english.includes('nehemiah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Nehemiah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/nehemias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/nehemiah-study'+html+'"','../nehemiah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.53.0'])if(!spanish.includes(marker))fail(`Spanish Nehemiah page missing ${marker}.`);
 if(!i18n.includes("'nehemiah-study"+html+"':'es/nehemias-estudio"+html+"'"))fail('Nehemiah bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Nehemiah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Nehemiah study audit passed.');
