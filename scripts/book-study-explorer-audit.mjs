import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const libraryPage=read('book-by-book.html');
const loader=read('book-by-book-library.js');
const explorer=read('study-explorer.js');
const topics=read('topics.html');
const scriptureIndex=read('scripture-index.html');

const cards=[...libraryPage.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Canonical Book-by-Book explorer source should contain 66 books, found ${cards.length}.`);
assert(lessonTotal===447,`Canonical Book-by-Book explorer source should contain 447 lessons, found ${lessonTotal}.`);
assert(loader.includes('uniquePush(window.NLDG_STUDIES,item)'),'Book-by-Book catalog must extend the published study list used by explorers.');
assert(loader.includes("window.dispatchEvent(new CustomEvent('nldg-book-library-ready'"),'Book-by-Book catalog must emit the explorer refresh event.');
assert(explorer.includes('const publishedStudies=()=>Array.isArray(window.NLDG_STUDIES)'),'Study Explorer must read the live published-study collection instead of snapshotting it at startup.');
assert(explorer.includes("window.addEventListener('nldg-book-library-ready',render)"),'Study Explorer must refresh after all 66 Book-by-Book studies load.');
assert(explorer.includes(".filter(topic=>!study.bookStudy||topic!==study.title)"),'Topic explorer must avoid turning every Book-by-Book title into a duplicate topic bucket.');
assert(explorer.includes("study.duration?"),'Explorer cards must handle Book-by-Book entries that do not define a duration.');
assert(explorer.includes("study.difficulty?"),'Explorer cards must handle Book-by-Book entries that do not define a difficulty.');
assert(topics.includes('study-data.js')&&topics.includes('study-explorer.js')&&topics.includes('script.js'),'Topic explorer must load study data, explorer rendering, and site integration.');
assert(scriptureIndex.includes('study-data.js')&&scriptureIndex.includes('study-explorer.js')&&scriptureIndex.includes('script.js'),'Scripture explorer must load study data, explorer rendering, and site integration.');
assert(scriptureIndex.includes('Browse by Scripture'),'Scripture explorer page must remain available as the Bible-book browsing surface.');

if(failures.length){
  console.error(`Book-by-Book study explorer audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Book-by-Book study explorer audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);
