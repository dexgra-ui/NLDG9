import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='daniel-study-data'+js,enGuide='daniel-study-guide'+js,esData='daniel-study-data-es'+js,enPage='daniel-study'+html,esPage=['es','daniel-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
const book=spanishOldTestamentByKey.get('daniel');
if(book?.status!=='published')fail('Daniel must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 if(es?.slug!=='daniel-estudio')fail('Spanish Daniel slug must be daniel-estudio.');
 if(es?.book!=='Daniel')fail('Spanish book name must be Daniel.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Daniel must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Daniel must retain eight lessons in both languages.');
 const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Daniel lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Daniel '))fail(`${label}: Scripture reference must begin with Daniel.`);
 }
 for(const field of ['themeLabel','seriesPurposeLabel','lessonPurposeLabel','seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesTeaching','seriesQuestions','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!es?.[field]||(Array.isArray(es[field])&&!es[field].length))fail(`Spanish Daniel missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==(en?.seriesTeaching?.length??0))fail('Spanish Daniel seriesTeaching count must match English.');
 if((es?.seriesQuestions?.length??0)!==(en?.seriesQuestions?.length??0))fail('Spanish Daniel seriesQuestions count must match English.');
 const raw=read(esData),all=JSON.stringify(es);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Daniel contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['exile dignity',['Las personas desplazadas merecen duelo, dignidad, seguridad y apoyo práctico']],
  ['cooperation does not require danger',['El respeto no obliga a una persona a permanecer en peligro']],
  ['success not identity',['El éxito es mayordomía, no identidad']],
  ['no political idolatry',['ningún imperio, partido o nación merece lealtad final']],
  ['coercion is not worship',['La coerción no es adoración']],
  ['church coercion rejected',['Las iglesias traicionan a Cristo cuando usan esas mismas herramientas para exigir lealtad']],
  ['faith does not guarantee rescue',['La fe no garantiza que toda persona fiel escape enfermedad, persecución, pérdida o muerte']],
  ['lawful nonviolent protection',['protección legal, defensa de derechos y rendición de cuentas']],
  ['religious language not transformation',['El lenguaje religioso no transforma automáticamente el liderazgo']],
  ['mental health dignity',['Nunca uses esta historia para diagnosticar enfermedad mental como castigo divino','atención profesional competente']],
  ['leader accountability',['Un líder restaurado debe mostrar humildad, límites y responsabilidad durante el tiempo']],
  ['prophetic integrity not for sale',['Dinero, acceso o prestigio no deben comprar silencio']],
  ['no private judgment claims',['No reclames capacidad privada para identificar toda caída moderna como juicio específico de Dios']],
  ['unjust laws exist',['el estatus legal no convierte toda orden en moral']],
  ['no rescue victim blaming',['sin insinuar que quien no fue rescatado tenía menos fe']],
  ['collective punishment rejected',['El castigo colectivo viola responsabilidad personal']],
  ['beast symbolism humility',['no conviertas automáticamente a cada dirigente actual en una bestia profetizada']],
  ['church must not become beastly',['La iglesia no debe volverse bestial mientras afirma combatir bestias']],
  ['emotional dignity',['La fe no exige entumecimiento emocional']],
  ['historical horizon first',['La lectura responsable comienza con el horizonte histórico']],
  ['no date setting',['Sin fijar fechas','Predicciones que producen miedo, lucro o certeza absoluta exceden el texto']],
  ['prophecy deepens repentance',['El estudio profético debe profundizar arrepentimiento']],
  ['no demonizing people',['no autoriza llamar demonios a personas']],
  ['no automatic escape promises',['nunca deben prometer escape automático, seguridad física garantizada ni riqueza por obediencia']],
  ['resurrection hope',['confianza en que Dios levantará a su pueblo']],
  ['no Christian nationalism',['nacionalismo cristiano']],
  ['no headline codes',['convertir titulares en códigos proféticos']],
  ['no current beast certainty',['identificar con certeza a líderes o naciones actuales como bestias']],
  ['no partisan kingdom claims',['apoyar un partido o nación como Reino de Dios']],
  ['no physical rescue formula',['No prometas rescate físico automático por tener fe']],
  ['unsafe reconciliation rejected',['presionar reconciliación insegura']],
  ['qualified safety care',['prioriza seguridad, cuidado calificado y las responsabilidades aplicables de denuncia']],
  ['professional practical support',['seguridad, apoyo profesional, protección legal y deberes aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase))fail(`Daniel safeguard missing ${label}: ${phrase}.`);
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/daniel-estudio'+html+'"'))fail('English Daniel page must link Spanish alternate.');
 if(!english.includes('nldg-i18n'+js+'?v=1.64.0'))fail('English Daniel page must load current language switcher.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/daniel-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/daniel-study'+html+'"','../daniel-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.64.0'])if(!spanish.includes(marker))fail(`Spanish Daniel page missing ${marker}.`);
 if(!i18n.includes("'daniel-study"+html+"':'es/daniel-estudio"+html+"'"))fail('Daniel bilingual route is missing.');
 if(!hub.includes('href="daniel-estudio'+html+'"'))fail('Spanish Daniel library card is missing.');
 if(!hub.includes('cincuenta y cuatro series completas y revisadas'))fail('Spanish library count must be fifty-four series.');
}
if(errors.length){console.error('Spanish Daniel study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Daniel study audit passed.');
