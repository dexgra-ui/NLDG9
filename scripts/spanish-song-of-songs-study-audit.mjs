import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='song-of-songs-study-data'+js,enGuide='song-of-songs-study-guide'+js,esData='song-of-songs-study-data-es'+js,enPage='song-of-songs-study'+html,esPage=['es','cantares-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('song-of-songs');
if(book?.status!=='published')fail('Song of Songs must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Cantar de los Cantares':'Song of Songs','Génesis':'Genesis','1 Corintios':'1 Corinthians','Santiago':'James','Proverbios':'Proverbs','1 Tesalonicenses':'1 Thessalonians','2 Timoteo':'2 Timothy','Filipenses':'Philippians','Efesios':'Ephesians','Hebreos':'Hebrews','Gálatas':'Galatians','Salmo':'Psalm','Romanos':'Romans','1 Juan':'1 John','Marcos':'Mark'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='cantares-estudio')fail('Spanish Song of Songs slug must be cantares-estudio.');
 if(es?.book!=='Cantar de los Cantares')fail('Spanish book name must be Cantar de los Cantares.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Song of Songs must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)fail('Song of Songs must retain five lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<5;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Song of Songs lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight text-grounded teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Cantar de los Cantares '))fail(`${label}: Scripture reference must begin with Cantar de los Cantares.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Song of Songs theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Song of Songs must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Song of Songs series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Song of Songs series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Song of Songs series guide must retain eight discussion questions.');
 if(es.seriesTeaching.length!==en.seriesTeaching.length||es.seriesQuestions.length!==en.seriesQuestions.length)fail('Song of Songs series architecture must match across languages.');

 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Song of Songs contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['plain sense not secret code',['celebra amor humano','sin convertir cada cuerpo, especia, jardín o lugar en código secreto']],
  ['speaker ambiguity',['etiquetas de hablantes en Biblias modernas son ayudas editoriales','los intérpretes discrepan']],
  ['woman agency',['La voz de la mujer es central','La mujer habla ampliamente, inicia, desea, busca, alaba, invita']],
  ['colorism without anachronism',['rechazar colorismo','sin afirmar anacrónicamente']],
  ['family control',['El control de sus hermanos forma parte de su historia','La autoridad familiar no debe romantizarse']],
  ['timing not purity guarantee',['no es una promesa de que cumplir reglas garantice un matrimonio perfecto','cultura de pureza']],
  ['consent term humility',['Consentimiento es un término moderno aplicado con cuidado bíblico','no como si el poema diera una definición legal']],
  ['anti stalking',['rastreo digital','aparecer después de una petición clara de distancia']],
  ['little foxes humility',['no son un glosario oculto del versículo']],
  ['Solomon identity uncertainty',['La relación exacta entre esa figura y los amantes sigue debatida']],
  ['locked garden not virginity test',['No deben convertirse en pruebas de virginidad, mitos del himen','propiedad']],
  ['marital entitlement rejected',['rechaza derecho sexual marital','no autoriza fuerza, coerción, intimidación ni sexo sin participación voluntaria']],
  ['singleness dignity',['El matrimonio es un regalo, no la medida de plenitud cristiana','no condena a personas solteras']],
  ['watchmen violence not victim fault',['La violencia de los guardias es mala y no es culpa de ella','Sobrevivientes nunca son responsables de la violencia de otro']],
  ['unsafe return not required',['regresar a una relación insegura','no significa que regresar']],
  ['repair not automatic',['Alabanza renovada no equivale a reparación completada','no restauran automáticamente confianza, acceso, liderazgo, sexo, convivencia ni la relación anterior']],
  ['Shulammite ambiguity',['La escena de la sulamita conserva ambigüedad y agencia','no debemos convertir a la mujer en espectáculo público']],
  ['seal not ownership',['El sello expresa compromiso duradero, no propiedad','no debe convertirse en marca, vigilancia, aislamiento']],
  ['jealousy not control',['La fuerza del amor no santifica celos posesivos','no excusa amenazas, violencia, acecho, control']],
  ['flame of Yah humility',['«llama de Yah»','La traducción varía']],
  ['love cannot be bought',['El amor no puede comprarse','nunca compran afecto, sexo, perdón ni acceso relacional']],
  ['family control final agency',['La mujer responde al control familiar con su propia voz','El final no la deja sin voz bajo control familiar']],
  ['no forced disclosure',['No exijas revelación','No prometas confidencialidad absoluta']],
  ['safeguarding',['seguridad inmediata','preservación de evidencia','deberes de denuncia aplicables']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Song of Songs safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/cantares-estudio'+html+'"'))fail('English Song of Songs page must link Spanish alternate.');
 if(!english.includes('song-of-songs-study-data'+js+'?v=1.1.0')||!english.includes('song-of-songs-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Song of Songs page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/cantares-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/song-of-songs-study'+html+'"','../song-of-songs-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.59.0'])if(!spanish.includes(marker))fail(`Spanish Song of Songs page missing ${marker}.`);
 if(!i18n.includes("'song-of-songs-study"+html+"':'es/cantares-estudio"+html+"'"))fail('Song of Songs bilingual route is missing.');
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Book-by-Book library link is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Song of Songs study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Song of Songs study audit passed.');
