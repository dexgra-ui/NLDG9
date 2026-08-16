import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const dashboard=read('dashboard.js');
const library=read('book-by-book.html');
const sharedRenderer=read('book-study-series.js');
const jamesRenderer=read('james-series.js');

const cards=[...library.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Book-by-Book dashboard source should expose 66 books, found ${cards.length}.`);
assert(lessonTotal===447,`Book-by-Book dashboard source should expose 447 lessons, found ${lessonTotal}.`);
assert(sharedRenderer.includes('const key=`nldg-book-${s.slug}`'),'Shared Book-by-Book renderer storage key contract changed.');
assert(jamesRenderer.includes("const key='nldg-series-james'"),'James progress storage key contract changed.');
assert(dashboard.includes("fetch('book-by-book.html')"),'My Journey must derive its Book-by-Book registry from book-by-book.html.');
assert(dashboard.includes("new DOMParser().parseFromString(html,'text/html')"),'My Journey must parse the live Book-by-Book library rather than duplicate a registry.');
assert(dashboard.includes("querySelectorAll('.book-card')"),'My Journey must discover Book-by-Book cards from the canonical library page.');
assert(dashboard.includes("url==='james-series.html'?'nldg-series-james':`nldg-book-${slug}`"),'My Journey must read both James and shared Book-by-Book storage keys.');
assert(dashboard.includes("id=\"book-progress-summary\"")&&dashboard.includes("id=\"book-progress-grid\""),'My Journey must render the Book-by-Book progress summary and study grid.');
assert(dashboard.includes('const totalLessons=progress.reduce((sum,item)=>sum+item.lessons,0)'),'My Journey must calculate the lesson total from the canonical library data.');
assert(dashboard.includes('renderBookProgress();'),'My Journey render cycle must include Book-by-Book progress.');
assert(dashboard.includes("window.addEventListener('storage',render)"),'My Journey must continue responding to progress changes from another tab.');
assert(!dashboard.includes('window.NLDG_BOOK_STUDY'),'My Journey should read stored progress without loading or rewriting authoritative study data.');

if(failures.length){
  console.error(`Book progress dashboard audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Book progress dashboard audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);