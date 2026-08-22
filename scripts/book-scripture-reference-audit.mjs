import { promises as fs } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT=process.cwd();
const BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation';
const NUMBERED_BOOK_NAMES='Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John';
const RANGE_TAIL='(?:(?::\\d{1,3}(?:[-–—](?:\\d{1,3}(?::\\d{1,3})?))?)|(?:[-–—]\\d{1,3}(?::\\d{1,3})?))?';
const CORE=`\\d{1,3}${RANGE_TAIL}`;
const CONTINUATION=`\\d{1,3}(?!\\s+(?:${NUMBERED_BOOK_NAMES})\\b)${RANGE_TAIL}`;
const REFERENCE=new RegExp(`\\b(?:${BOOKS})\\s+${CORE}(?:\\s*,\\s*${CONTINUATION})*(?:\\s*;\\s*${CONTINUATION}(?:\\s*,\\s*${CONTINUATION})*)*`,'gi');
const BOOK_START=new RegExp(`^(?:${BOOKS})\\s+`,'i');

const catalog=await fs.readFile(path.join(ROOT,'book-by-book.html'),'utf8');
const cards=[...catalog.matchAll(/<article class="book-card">[\s\S]*?<h2>([^<]+)<\/h2>[\s\S]*?<a href="([^"]+)"/gi)].map(match=>({book:match[1].trim(),url:match[2].trim()}));
const findings=[];
let books=0;
let lessons=0;

if(cards.length!==66){
  findings.push({file:'book-by-book.html',book:'Catalog',lessonNumber:'—',field:'catalog',value:String(cards.length),reason:`Expected 66 Book-by-Book catalog cards, found ${cards.length}.`});
}

function normalizedRemainder(value){
  REFERENCE.lastIndex=0;
  return String(value||'')
    .replace(REFERENCE,'')
    .replace(/[\s;,.·&()+/]/g,'')
    .trim();
}

function inspectReference({file,book,lessonNumber,field,value}){
  const text=String(value||'').trim();
  if(!text){
    findings.push({file,book,lessonNumber,field,value:text,reason:'Reference is blank.'});
    return;
  }
  if(!BOOK_START.test(text)){
    findings.push({file,book,lessonNumber,field,value:text,reason:'Reference does not begin with an explicit Bible book name.'});
  }
  const remainder=normalizedRemainder(text);
  if(remainder){
    findings.push({file,book,lessonNumber,field,value:text,reason:`Part of the reference is not recognized by the site Scripture-link parser: “${remainder}”.`});
  }
}

const dataSuffix=['-data','js'].join('.');
for(const card of cards){
  const james=card.url==='james-series.html';
  const file=james?'james-series-data.js':card.url.replace(/\.html$/i,dataSuffix);
  const fullPath=path.join(ROOT,file);
  try{
    await fs.access(fullPath);
  }catch{
    findings.push({file,book:card.book,lessonNumber:'—',field:'file',value:'',reason:'Catalog study is missing its expected data file.'});
    continue;
  }
  const code=await fs.readFile(fullPath,'utf8');
  const sandbox={window:{},console};
  try{
    vm.runInNewContext(code,sandbox,{filename:file,timeout:2000});
  }catch(error){
    findings.push({file,book:card.book,lessonNumber:'—',field:'load',value:error.message,reason:'Study data could not be evaluated by the audit.'});
    continue;
  }
  const source=james?sandbox.window.NLDG_JAMES_SERIES:sandbox.window.NLDG_BOOK_STUDY;
  if(!source||!Array.isArray(source.lessons)){
    findings.push({file,book:card.book,lessonNumber:'—',field:'load',value:'',reason:'Study data did not expose the expected lesson collection.'});
    continue;
  }
  books++;
  for(const lesson of source.lessons){
    lessons++;
    const lessonNumber=lesson.number??lesson.week;
    inspectReference({file,book:card.book,lessonNumber,field:'scripture',value:lesson.scripture});
    for(const [index,supporting] of (lesson.supporting||[]).entries()){
      inspectReference({file,book:card.book,lessonNumber,field:`supporting[${index}]`,value:supporting});
    }
  }
}

if(books!==66||lessons!==447){
  findings.push({file:'book-by-book.html',book:'Catalog',lessonNumber:'—',field:'coverage',value:`${books} books / ${lessons} lessons`,reason:'Audit coverage must equal the published 66 books / 447 lessons.'});
}

const unique=[];
const seen=new Set();
for(const finding of findings){
  const key=JSON.stringify(finding);
  if(!seen.has(key)){seen.add(key);unique.push(finding);}
}

console.log(`Book-by-Book Scripture audit: ${books} books, ${lessons} lessons checked.`);
if(unique.length){
  console.log(`Found ${unique.length} reference or coverage issue(s):`);
  for(const item of unique){
    console.log(`- ${item.file} · ${item.book} · lesson ${item.lessonNumber} · ${item.field}: ${item.value}`);
    console.log(`  ${item.reason}`);
  }
  process.exitCode=1;
}else{
  console.log('All 66 Book-by-Book studies and 447 lessons have complete, link-compatible Scripture references.');
}
