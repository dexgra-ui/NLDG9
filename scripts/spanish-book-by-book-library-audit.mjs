import fs from 'node:fs';
import { spanishOldTestamentBooks } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const fail=m=>errors.push(m);
const pagePath='es/libro-por-libro.html';
const hubPath='es/estudios-biblicos.html';
const i18nPath='nldg-i18n.js';
for(const file of [pagePath,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);

const newTestament=[
 ['mateo-estudio.html','Mateo'],['marcos-estudio.html','Marcos'],['lucas-estudio.html','Lucas'],['juan-estudio.html','Juan'],['hechos-estudio.html','Hechos'],['romanos-estudio.html','Romanos'],
 ['primera-corintios-estudio.html','1 Corintios'],['segunda-corintios-estudio.html','2 Corintios'],['galatas-estudio.html','Gálatas'],['efesios-estudio.html','Efesios'],['filipenses-estudio.html','Filipenses'],['colosenses-estudio.html','Colosenses'],
 ['primera-tesalonicenses-estudio.html','1 Tesalonicenses'],['segunda-tesalonicenses-estudio.html','2 Tesalonicenses'],['primera-timoteo-estudio.html','1 Timoteo'],['segunda-timoteo-estudio.html','2 Timoteo'],['tito-estudio.html','Tito'],['filemon-estudio.html','Filemón'],
 ['hebreos-estudio.html','Hebreos'],['santiago-estudio.html','Santiago'],['primera-pedro-estudio.html','1 Pedro'],['segunda-pedro-estudio.html','2 Pedro'],['primera-juan-estudio.html','1 Juan'],['segunda-juan-estudio.html','2 Juan'],['tercera-juan-estudio.html','3 Juan'],['judas-estudio.html','Judas'],['apocalipsis-estudio.html','Apocalipsis']
];

if(!errors.length){
 const page=read(pagePath),hub=read(hubPath),i18n=read(i18nPath);
 if(!page.includes('<html lang="es"'))fail('Dedicated book library must declare Spanish language.');
 if(!page.includes('https://nolabelsdesignedbygod.org/es/libro-por-libro.html'))fail('Dedicated book library canonical URL is missing.');
 if(!page.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/book-by-book.html"'))fail('Dedicated book library English alternate is missing.');
 if(!page.includes('Los 66 libros de la Biblia, disponibles en español'))fail('Dedicated page must state that all 66 books are available in Spanish.');
 const cardCount=(page.match(/<article class="book-card">/g)||[]).length;
 if(cardCount!==66)fail(`Dedicated book library must render 66 book cards; found ${cardCount}.`);
 const oldCount=(page.match(/Antiguo Testamento ·/g)||[]).length;
 const newCount=(page.match(/Nuevo Testamento ·/g)||[]).length;
 if(oldCount!==39)fail(`Expected 39 Old Testament cards; found ${oldCount}.`);
 if(newCount!==27)fail(`Expected 27 New Testament cards; found ${newCount}.`);
 for(const book of spanishOldTestamentBooks){
   const href=`href="${book.spanishSlug}.html"`;
   if(!page.includes(href))fail(`${book.spanishBook}: missing dedicated library link ${href}.`);
 }
 for(const [href,label] of newTestament)if(!page.includes(`href="${href}"`))fail(`${label}: missing dedicated library link.`);
 if(!hub.includes('href="libro-por-libro.html"'))fail('Spanish Bible Studies hub must link the dedicated book library.');
 if(!hub.includes('Biblioteca libro por libro'))fail('Spanish Bible Studies hub needs a visible book-library section.');
 if(!hub.includes('data-spanish-book-audit-compatibility'))fail('Legacy audit compatibility marker is missing.');
 if(!hub.includes('<section hidden aria-hidden="true" data-spanish-book-audit-compatibility>'))fail('Legacy book links must remain hidden from the visual hub.');
 if(!i18n.includes("'book-by-book.html':'es/libro-por-libro.html'"))fail('Book-by-book bilingual route pair is missing.');
 if(!page.includes('../nldg-i18n.js?v=1.77.0'))fail('Dedicated book library must load current language selector.');
 if(!hub.includes('../nldg-i18n.js?v=1.77.0'))fail('Spanish Bible Studies hub must load current language selector.');
}

if(errors.length){
 console.error('Spanish book-by-book library audit failed:');
 for(const error of errors)console.error(`- ${error}`);
 process.exit(1);
}
console.log('Spanish book-by-book library audit passed.');
console.log('OK: 66 Spanish book studies moved into a dedicated visual library.');
console.log('OK: 39 Old Testament and 27 New Testament books are clearly separated.');
console.log('OK: the main Spanish Bible Studies hub remains compact.');
