import fs from 'node:fs';
import { spanishOldTestamentBooks } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const pagePath=['es','libro-por-libro'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
for(const file of [pagePath,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);

const newTestament=[
 ['mateo-estudio','Mateo'],['marcos-estudio','Marcos'],['lucas-estudio','Lucas'],['juan-estudio','Juan'],['hechos-estudio','Hechos'],['romanos-estudio','Romanos'],
 ['primera-corintios-estudio','1 Corintios'],['segunda-corintios-estudio','2 Corintios'],['galatas-estudio','Gálatas'],['efesios-estudio','Efesios'],['filipenses-estudio','Filipenses'],['colosenses-estudio','Colosenses'],
 ['primera-tesalonicenses-estudio','1 Tesalonicenses'],['segunda-tesalonicenses-estudio','2 Tesalonicenses'],['primera-timoteo-estudio','1 Timoteo'],['segunda-timoteo-estudio','2 Timoteo'],['tito-estudio','Tito'],['filemon-estudio','Filemón'],
 ['hebreos-estudio','Hebreos'],['santiago-estudio','Santiago'],['primera-pedro-estudio','1 Pedro'],['segunda-pedro-estudio','2 Pedro'],['primera-juan-estudio','1 Juan'],['segunda-juan-estudio','2 Juan'],['tercera-juan-estudio','3 Juan'],['judas-estudio','Judas'],['apocalipsis-estudio','Apocalipsis']
];

if(!errors.length){
 const page=read(pagePath),hub=read(hubPath),i18n=read(i18nPath);
 if(!page.includes('<html lang="es"'))fail('Dedicated book library must declare Spanish language.');
 if(!page.includes('https://nolabelsdesignedbygod.org/es/libro-por-libro'+html))fail('Dedicated book library canonical URL is missing.');
 if(!page.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/book-by-book'+html+'"'))fail('Dedicated book library English alternate is missing.');
 if(!page.includes('Los 66 libros de la Biblia, disponibles en español'))fail('Dedicated page must state that all 66 books are available in Spanish.');
 const cardCount=(page.match(/<article class="book-card">/g)||[]).length;
 if(cardCount!==66)fail(`Dedicated book library must render 66 book cards; found ${cardCount}.`);
 const oldCount=(page.match(/Antiguo Testamento ·/g)||[]).length;
 const newCount=(page.match(/Nuevo Testamento ·/g)||[]).length;
 if(oldCount!==39)fail(`Expected 39 Old Testament cards; found ${oldCount}.`);
 if(newCount!==27)fail(`Expected 27 New Testament cards; found ${newCount}.`);
 for(const book of spanishOldTestamentBooks){
   const href=`href="${book.spanishSlug}${html}"`;
   if(!page.includes(href))fail(`${book.spanishBook}: missing dedicated library link ${href}.`);
 }
 for(const [stem,label] of newTestament){
   const href=`href="${stem}${html}"`;
   if(!page.includes(href))fail(`${label}: missing dedicated library link.`);
 }
 if(!hub.includes('href="libro-por-libro'+html+'"'))fail('Spanish Bible Studies hub must link the dedicated book library.');
 if(!hub.includes('Biblioteca libro por libro'))fail('Spanish Bible Studies hub needs a visible book-library section.');
 if(hub.includes('data-spanish-book-audit-compatibility'))fail('Spanish Bible Studies hub must not carry legacy hidden audit compatibility markup.');
 if(!i18n.includes("'book-by-book"+html+"':'es/libro-por-libro"+html+"'"))fail('Book-by-book bilingual route pair is missing.');
 if(!page.includes('../nldg-i18n'+js+'?v=1.77.0'))fail('Dedicated book library must load its published language selector version.');
 if(!hub.includes('../nldg-i18n'+js+'?v=1.78.0'))fail('Spanish Bible Studies hub must load the current language selector.');
}

if(errors.length){
 console.error('Spanish book-by-book library audit failed:');
 for(const error of errors)console.error(`- ${error}`);
 process.exit(1);
}
console.log('Spanish book-by-book library audit passed.');
console.log('OK: 66 Spanish book studies live in the dedicated visual library.');
console.log('OK: 39 Old Testament and 27 New Testament books are clearly separated.');
console.log('OK: the main Spanish Bible Studies hub remains compact and free of legacy compatibility markup.');
