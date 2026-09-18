import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='esther-study-data'+js,enGuide='esther-study-guide'+js,esData='esther-study-data-es'+js,enPage='esther-study'+html,esPage=['es','ester-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('esther');
if(book?.status!=='published')fail('Esther must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Ester':'Esther','Proverbios':'Proverbs','Eclesiastés':'Ecclesiastes','Marcos':'Mark','Santiago':'James','Génesis':'Genesis','Salmo':'Psalm','Daniel':'Daniel','1 Pedro':'1 Peter','Isaías':'Isaiah','Efesios':'Ephesians','Nehemías':'Nehemiah','Miqueas':'Micah','Lucas':'Luke','Hebreos':'Hebrews','Mateo':'Matthew','Romanos':'Romans','Deuteronomio':'Deuteronomy','Apocalipsis':'Revelation'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='ester-estudio')fail('Spanish Esther slug must be ester-estudio.');
 if(es?.book!=='Ester')fail('Spanish book name must be Ester.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Esther must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==9||es?.lessons?.length!==9)fail('Esther must retain nine lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<9;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Esther lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Ester '))fail(`${label}: Scripture reference must begin with Ester.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Esther theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Esther must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Esther series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==6||(en?.seriesTeaching?.length??0)!==6)fail('Esther series guide must retain six teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Esther series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Esther series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Esther contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Vashti restraint',['atribuyas motivos que el texto no da','excusar ira masculina']],
  ['coercion and consent',['Sobrevivir no equivale a consentir','favor no equivale a justicia']],
  ['unsafe disclosure',['No exijas revelar etnia, fe, abuso, sexualidad','pueda aumentar el peligro']],
  ['antisemitism and genocide',['genocidio antisemita','No reduzcas Ester a una historia genérica']],
  ['collective punishment',['el castigo colectivo nunca se justifica','Diferencia de costumbre, etnia o fe no es prueba de deslealtad cívica']],
  ['calling humility',['Mardoqueo dice «quién sabe»','No presiones a vulnerables a exponerse al peligro']],
  ['Hebrew fasting precision',['El texto hebreo nombra explícitamente ayuno, no oración','«¿quién sabe?»']],
  ['providence without superstition',['La providencia no es superstición','no autoriza interpretar cada coincidencia como mensaje privado de Dios']],
  ['couch accusation precision',['No digas que el texto prueba que Amán agredió sexualmente a Ester','el rey interpreta así la escena del diván']],
  ['due process',['debido proceso','castigo autocrático']],
  ['counter decree violence',['El contra-decreto devuelve agencia pero usa lenguaje de violencia severa','lenguaje de violencia y botín']],
  ['fear driven identity',['no debe ser modelo de conversión cristiana','miedo es central']],
  ['second day moral difficulty',['La petición de un segundo día intensifica la dificultad moral','no debe esconderse bajo un eslogan sencillo de defensa propia']],
  ['refusal of plunder',['no toman botín','rechazo repetido del botín']],
  ['Purim Jewish identity',['Purim sigue siendo una fiesta judía','no convertirla en ordenanza de la iglesia']],
  ['violence rejection',['No celebres el saldo de muertos','venganza, vigilantismo, violencia étnica']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Esther safeguard missing ${label}: ${phrase}.`);
 for(const phrase of ['Pueden pasar o salir sin explicación','No romantices la entrada de Ester al sistema real','deberes de protección y denuncia','ayuda calificada','Da aviso de contenido y permite pasar'])if(!all.includes(phrase))fail(`Esther leader safeguard missing ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/ester-estudio'+html+'"'))fail('English Esther page must link Spanish alternate.');
 if(!english.includes('esther-study-data'+js+'?v=1.1.0')||!english.includes('esther-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Esther page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/ester-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/esther-study'+html+'"','../esther-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.54.0'])if(!spanish.includes(marker))fail(`Spanish Esther page missing ${marker}.`);
 if(!i18n.includes("'esther-study"+html+"':'es/ester-estudio"+html+"'"))fail('Esther bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Esther study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Esther study audit passed.');
