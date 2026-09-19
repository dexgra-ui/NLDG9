import fs from 'node:fs';import vm from 'node:vm';
const errors=[],read=p=>fs.readFileSync(p,'utf8'),exists=fs.existsSync,fail=m=>errors.push(m);
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const enData='john-study-data.js',enGuide='john-study-guide.js',esData='john-study-data-es.js',enPage='john-study.html',esPage='es/juan-estudio.html',hub='es/estudios-biblicos.html',i18n='nldg-i18n.js';
for(const f of [enData,enGuide,esData,enPage,esPage,hub,i18n,'book-study-series.js','book-study-series-es.js'])if(!exists(f))fail('Missing '+f);
if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Juan':'John','Génesis':'Genesis','Éxodo':'Exodus','Levítico':'Leviticus','Números':'Numbers','Deuteronomio':'Deuteronomy','Josué':'Joshua','Jueces':'Judges','Rut':'Ruth','1 Samuel':'1 Samuel','2 Samuel':'2 Samuel','1 Reyes':'1 Kings','2 Reyes':'2 Kings','Salmo':'Psalm','Salmos':'Psalms','Proverbios':'Proverbs','Eclesiastés':'Ecclesiastes','Isaías':'Isaiah','Jeremías':'Jeremiah','Ezequiel':'Ezekiel','Daniel':'Daniel','Oseas':'Hosea','Joel':'Joel','Amós':'Amos','Jonás':'Jonah','Miqueas':'Micah','Zacarías':'Zechariah','Malaquías':'Malachi','Mateo':'Matthew','Marcos':'Mark','Lucas':'Luke','Hechos':'Acts','Romanos':'Romans','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians','Gálatas':'Galatians','Efesios':'Ephesians','Filipenses':'Philippians','Colosenses':'Colossians','1 Tesalonicenses':'1 Thessalonians','1 Timoteo':'1 Timothy','Hebreos':'Hebrews','Santiago':'James','1 Pedro':'1 Peter','1 Juan':'1 John'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const list=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es.slug!=='juan-estudio')fail('Spanish John slug must be juan-estudio.');
 if(es.book!=='Juan')fail('Spanish book name must be Juan.');
 if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish John must declare Nueva Traducción Viviente (NTV).');
 if(es.themeLabel!=='Verdad clave')fail('Spanish John theme label must be Verdad clave.');
 if(es.lessonSubtitleMode!==true||en.lessonSubtitleMode!==true)fail('John must retain lesson subtitle mode.');
 if(en.lessons?.length!==8||es.lessons?.length!==8)fail('John must retain eight lessons in both languages.');
 if(JSON.stringify(list(es.seriesMainScripture))!==JSON.stringify(list(en.seriesMainScripture)))fail('Series Scripture references must match English.');
 if(es.seriesTeaching?.length!==8||en.seriesTeaching?.length!==8)fail('Series must retain eight teaching movements.');
 if(es.seriesQuestions?.length!==8||en.seriesQuestions?.length!==8)fail('Series must retain eight discussion questions.');
 if(String(es.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)fail('Spanish series context must retain two paragraphs.');
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label='John lesson '+(i+1);
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
 for(const phrase of ['antisemit','discapacidad','mujer samaritana','juan 5:3b–4','juan 7:53–8:11','abuso','poda','unidad','ejecución romana','restauración','nueva traducción viviente'])if(!all.includes(phrase.toLowerCase()))fail('Missing safeguard/theme: '+phrase);
 const ep=read(enPage),sp=read(esPage),im=read(i18n),hb=read(hub);
 if(!ep.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/juan-estudio.html"'))fail('English bilingual route missing.');
 if(!sp.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/john-study.html"'))fail('Spanish bilingual route missing.');
 if(!sp.includes('john-study-data-es.js?v=1.1.0')||!sp.includes('john-study-guide.js?v=1.1.0')||!sp.includes('book-study-series.js?v=0.2.0'))fail('Spanish John assets are stale.');
 if(!im.includes("'john-study.html':'es/juan-estudio.html'"))fail('i18n John route missing.');
 if(!hb.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library completion state missing.');
}
if(errors.length){console.error('Spanish John audit failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Spanish John audit passed: exact English/Spanish reference parity, NTV standard, structure, safeguards, assets, routes, and completed library state validated.');
