import fs from 'node:fs';import vm from 'node:vm';
const errors=[],read=p=>fs.readFileSync(p,'utf8'),exists=fs.existsSync,fail=m=>errors.push(m);
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const enData='luke-study-data.js',enGuide='luke-study-guide.js',esData='luke-study-data-es.js',enPage='luke-study.html',esPage='es/lucas-estudio.html',hub='es/estudios-biblicos.html',i18n='nldg-i18n.js';
for(const f of [enData,enGuide,esData,enPage,esPage,hub,i18n,'book-study-series.js','book-study-series-es.js'])if(!exists(f))fail('Missing '+f);
if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Lucas':'Luke','Isaías':'Isaiah','Malaquías':'Malachi','Génesis':'Genesis','Éxodo':'Exodus','Levítico':'Leviticus','Números':'Numbers','Deuteronomio':'Deuteronomy','Josué':'Joshua','Jueces':'Judges','Rut':'Ruth','1 Samuel':'1 Samuel','2 Samuel':'2 Samuel','1 Reyes':'1 Kings','2 Reyes':'2 Kings','Salmo':'Psalm','Salmos':'Psalms','Proverbios':'Proverbs','Eclesiastés':'Ecclesiastes','Jeremías':'Jeremiah','Ezequiel':'Ezekiel','Daniel':'Daniel','Oseas':'Hosea','Joel':'Joel','Amós':'Amos','Jonás':'Jonah','Miqueas':'Micah','Zacarías':'Zechariah','Mateo':'Matthew','Marcos':'Mark','Juan':'John','Hechos':'Acts','Romanos':'Romans','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians','Gálatas':'Galatians','Efesios':'Ephesians','Filipenses':'Philippians','Colosenses':'Colossians','1 Tesalonicenses':'1 Thessalonians','1 Timoteo':'1 Timothy','Hebreos':'Hebrews','Santiago':'James','1 Pedro':'1 Peter'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const list=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es.slug!=='lucas-estudio')fail('Spanish Luke slug must be lucas-estudio.');
 if(es.book!=='Lucas')fail('Spanish book name must be Lucas.');
 if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Luke must declare Nueva Traducción Viviente (NTV).');
 if(es.themeLabel!=='Verdad clave')fail('Spanish Luke theme label must be Verdad clave.');
 if(es.lessonSubtitleMode!==true||en.lessonSubtitleMode!==true)fail('Luke must retain lesson subtitle mode.');
 if(en.lessons?.length!==8||es.lessons?.length!==8)fail('Luke must retain eight lessons in both languages.');
 if(JSON.stringify(list(es.seriesMainScripture))!==JSON.stringify(list(en.seriesMainScripture)))fail('Series Scripture references must match English.');
 if(es.seriesTeaching?.length!==8||en.seriesTeaching?.length!==8)fail('Series must retain eight teaching movements.');
 if(es.seriesQuestions?.length!==8||en.seriesQuestions?.length!==8)fail('Series must retain eight discussion questions.');
 if(String(es.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)fail('Spanish series context must retain two paragraphs.');
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Luke lesson '+(i+1);
  if(a.number!==b.number)fail(label+': number mismatch.');
  if(norm(b.scripture)!==a.scripture)fail(label+': main Scripture mismatch.');
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(label+': supporting Scripture mismatch.');
  for(const f of ['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'])if(!String(b[f]||'').trim())fail(label+': missing '+f+'.');
  if((b.supporting?.length||0)!==5)fail(label+': must retain five supporting Scriptures.');
  if((b.teaching?.length||0)!==8)fail(label+': must retain eight teaching movements.');
  if((b.questions?.length||0)!==8)fail(label+': must retain eight discussion questions.');
  if((b.contextParagraphs?.length||0)!==2)fail(label+': must retain two context paragraphs.');
  if((b.jesusParagraphs?.length||0)!==1)fail(label+': must retain Jesus Connection.');
  if((b.guardrailParagraphs?.length||0)!==1)fail(label+': must retain Do Not Miss This.');
 }
 const all=JSON.stringify(es).toLowerCase();
 for(const phrase of ['consentimiento','infertilidad','antisemit','enfermedad mental','ansiedad','restitución','fijar fechas','lucas 22:43–44','lucas 23:34a','nueva traducción viviente'])if(!all.includes(phrase.toLowerCase()))fail('Missing safeguard/theme: '+phrase);
 const ep=read(enPage),sp=read(esPage),im=read(i18n),hb=read(hub);
 if(!ep.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/lucas-estudio.html"'))fail('English bilingual route missing.');
 if(!sp.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/luke-study.html"'))fail('Spanish bilingual route missing.');
 if(!sp.includes('luke-study-data-es.js?v=1.1.0')||!sp.includes('luke-study-guide.js?v=1.1.0')||!sp.includes('book-study-series.js?v=0.2.0'))fail('Spanish Luke assets are stale.');
 if(!im.includes("'luke-study.html':'es/lucas-estudio.html'"))fail('i18n Luke route missing.');
 if(!hb.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library completion state missing.');
}
if(errors.length){console.error('Spanish Luke audit failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Spanish Luke audit passed: exact English/Spanish reference parity, NTV standard, structure, safeguards, assets, routes, and completed library state validated.');
