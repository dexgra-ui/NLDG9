import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const libraryPage=read('book-by-book.html');
const unified=read('unified-library.js');
const studyLibrary=read('study-library.html');

const cards=[...libraryPage.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Canonical Book-by-Book library should contain 66 books, found ${cards.length}.`);
assert(lessonTotal===447,`Canonical Book-by-Book library should contain 447 lessons, found ${lessonTotal}.`);
assert(studyLibrary.includes('unified-library.js'),'My Library must load the unified library renderer.');
assert(unified.includes("fetch('book-by-book.html')"),'Unified library must derive Book-by-Book studies from the canonical library page.');
assert(unified.includes("new DOMParser().parseFromString(html,'text/html')"),'Unified library must parse the canonical Book-by-Book page instead of duplicating the 66-book registry.');
assert(unified.includes("querySelectorAll('.book-card')"),'Unified library must discover all canonical Book-by-Book cards.');
assert(unified.includes("bookCatalog.length!==66"),'Unified library must reject incomplete Book-by-Book discovery.');
assert(unified.includes("bookStudy:true"),'Unified library must identify Book-by-Book entries for progress handling.');
assert(unified.includes("url==='james-series.html'?'nldg-series-james':`nldg-book-${slug}`"),'Unified library must preserve both James and shared Book-by-Book progress storage contracts.');
assert(unified.includes("catalog.filter(item=>!bookUrls.has(item.url))"),'Unified library must deduplicate existing catalog entries by route.');
assert(unified.includes("if(item.bookStudy)return bookProgress(item).complete"),'Completed filter must recognize Book-by-Book lesson progress.');
assert(unified.includes("const parameter=item.url==='james-series.html'?'week':'lesson'"),'Book-by-Book cards must continue directly to the next incomplete lesson.');
assert(unified.includes("loadBookCatalog().then(()=>render())"),'Unified library must refresh after Book-by-Book discovery completes.');

if(failures.length){
  console.error(`Unified library Book-by-Book audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Unified library Book-by-Book audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);