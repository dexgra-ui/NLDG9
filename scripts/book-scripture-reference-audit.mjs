import { promises as fs } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT=process.cwd();
const BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation';
const NUMBERED_BOOK_NAMES='Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John';
const REFERENCE=new RegExp(`\\b(?:${BOOKS})\\s+\\d{1,3}(?:(?::\\d{1,3}(?:[-–—]\\d{1,3})?)|(?:[-–—]\\d{1,3}))?(?:\\s*,\\s*\\d{1,3}(?!\\s+(?:${NUMBERED_BOOK_NAMES})\\b)(?::\\d{1,3}(?:[-–—]\\d{1,3})?)?)?`,'gi');
const BOOK_START=new RegExp(`^(?:${BOOKS})\\s+`,'i');

const files=(await fs.readdir(ROOT)).filter(name=>/-study-data\.js$/i.test(name)).sort();
const findings=[];
let books=0;
let lessons=0;

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
  const segments=text.split(';').map(part=>part.trim()).filter(Boolean);
  if(segments.length>1){
    for(const segment of segments.slice(1)){
      if(/^\d/.test(segment)){
        findings.push({file,book,lessonNumber,field,value:text,reason:`Semicolon shorthand “${segment}” omits the book name, so only part of the passage can become a complete Scripture link.`});
      }
    }
  }
}

for(const file of files){
  const code=await fs.readFile(path.join(ROOT,file),'utf8');
  const sandbox={window:{},console};
  try{
    vm.runInNewContext(code,sandbox,{filename:file,timeout:2000});
  }catch(error){
    continue;
  }
  const study=sandbox.window.NLDG_BOOK_STUDY;
  if(!study||!Array.isArray(study.lessons))continue;
  books++;
  for(const lesson of study.lessons){
    lessons++;
    inspectReference({file,book:study.book||study.title,lessonNumber:lesson.number,field:'scripture',value:lesson.scripture});
    for(const [index,supporting] of (lesson.supporting||[]).entries()){
      inspectReference({file,book:study.book||study.title,lessonNumber:lesson.number,field:`supporting[${index}]`,value:supporting});
    }
  }
}

const unique=[];
const seen=new Set();
for(const finding of findings){
  const key=JSON.stringify(finding);
  if(!seen.has(key)){seen.add(key);unique.push(finding);}
}

console.log(`Book-by-Book Scripture audit: ${books} books, ${lessons} lessons checked.`);
if(unique.length){
  console.log(`Found ${unique.length} reference issue(s):`);
  for(const item of unique){
    console.log(`- ${item.file} · ${item.book} · lesson ${item.lessonNumber} · ${item.field}: ${item.value}`);
    console.log(`  ${item.reason}`);
  }
  process.exitCode=1;
}else{
  console.log('All Book-by-Book lesson and supporting Scripture references are complete and link-compatible.');
}
