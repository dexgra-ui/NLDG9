import fs from 'node:fs';

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const read=file=>fs.readFileSync(file,'utf8');
const explorer=read('study-explorer.js');
const topicPage=read('topics.html');
const scripturePage=read('scripture-index.html');
const bookLoader=read('book-by-book-library.js');
const libraryPage=read('book-by-book.html');

const cards=[...libraryPage.matchAll(/<article class="book-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
const lessonTotal=cards.reduce((sum,card)=>sum+Number(card.match(/·\s*(\d+)\s+lessons/)?.[1]||0),0);

assert(cards.length===66,`Canonical Book-by-Book explorer source should contain 66 books, found ${cards.length}.`);
assert(lessonTotal===447,`Canonical Book-by-Book explorer source should contain 447 lessons, found ${lessonTotal}.`);
assert(topicPage.includes('study-explorer.js')&&scripturePage.includes('study-explorer.js'),'Both study explorer pages must use the shared study explorer renderer.');
assert(topicPage.includes('script.js')&&scripturePage.includes('script.js'),'Both study explorer pages must load the sitewide integrations that add the dynamic Book-by-Book catalog.');
assert(bookLoader.includes("window.dispatchEvent(new Event('nldg-library-ready'))"),'Book-by-Book loader must notify explorer surfaces after dynamic catalog merge.');
assert(explorer.includes("const published=()=>[...(window.NLDG_STUDIES||[])]"),'Study explorers must read the current live study collection on every render.');
assert(explorer.includes("window.addEventListener('nldg-library-ready',render)"),'Study explorers must rerender when the dynamic Book-by-Book catalog becomes available.');
assert(explorer.includes('study.bookStudy&&study.lessons'),'Study cards must support Book-by-Book lesson metadata without rendering undefined difficulty or duration fields.');
assert(explorer.includes("study.bookStudy&&key.toLowerCase()===String(study.book||study.title||'').trim().toLowerCase()"),'Topic Explorer must avoid creating one redundant topic button for every Book-by-Book title.');
assert(explorer.includes('const canonicalOrder=studies.filter(study=>study.bookStudy&&study.book).map(study=>study.book)'),'Scripture Explorer must derive biblical book order from the dynamically loaded canonical Book-by-Book catalog.');
assert(explorer.includes("aria-pressed=\"${topic===selectedTopic?'true':'false'}\"")&&explorer.includes("aria-pressed=\"${book===selectedBook?'true':'false'}\""),'Explorer selection controls must expose pressed state to assistive technology.');

if(failures.length){
 console.error(`Study explorer Book-by-Book audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log(`Study explorer Book-by-Book audit PASSED for ${cards.length} books and ${lessonTotal} lessons.`);