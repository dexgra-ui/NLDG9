import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const source=fs.readFileSync(path.join(root,'scripture-links.js'),'utf8');
const document={
  readyState:'loading',
  addEventListener(){},
  createElement(){return{}},
  head:{appendChild(){}}
};
const context={window:{},document,Node:{ELEMENT_NODE:1,TEXT_NODE:3},NodeFilter:{SHOW_TEXT:4,FILTER_REJECT:2,FILTER_ACCEPT:1},MutationObserver:class{},requestAnimationFrame(){}};
vm.createContext(context);
vm.runInContext(source,context);
const findReferences=context.window.NLDG_SCRIPTURE_LINKS?.findReferences;
if(typeof findReferences!=='function')throw new Error('Scripture parser did not expose findReferences().');

const failures=[];
const equal=(actual,expected,label)=>{
  if(JSON.stringify(actual)!==JSON.stringify(expected))failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
};

equal(
  findReferences('Mark 1:15, 1 Corinthians 15:3–4, Romans 10:9–10, and Ephesians 2:8–10'),
  ['Mark 1:15','1 Corinthians 15:3–4','Romans 10:9–10','Ephesians 2:8–10'],
  'Numbered book boundary'
);
equal(findReferences('John 3:16, 18 and 2 Timothy 3:16–17'),['John 3:16, 18','2 Timothy 3:16–17'],'Same-book verse list');
equal(findReferences('1 John 1:9, 2 John 1:6, and 3 John 1:4'),['1 John 1:9','2 John 1:6','3 John 1:4'],'Numbered John letters');
equal(findReferences('Psalm 23; Psalms 1–2; Jude 3; Obadiah 1'),['Psalm 23','Psalms 1–2','Jude 3','Obadiah 1'],'Single-chapter and chapter-range forms');

const numberedNames=['Samuel','Kings','Chronicles','Corinthians','Thessalonians','Timothy','Peter','John'];
for(const name of numberedNames){
  const available=name==='John'?[1,2,3]:[1,2];
  for(const number of available){
    const reference=`${number} ${name} 1:1`;
    equal(findReferences(reference),[reference],`Book recognition: ${number} ${name}`);
  }
}

const excluded=new Set(['.git','node_modules','library-downloads','scripts']);
const extensions=new Set(['.html','.js','.md']);
const files=[];
function walk(directory){
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    if(excluded.has(entry.name))continue;
    const full=path.join(directory,entry.name);
    if(entry.isDirectory())walk(full);
    else if(extensions.has(path.extname(entry.name)))files.push(full);
  }
}
walk(root);

let referenceCount=0;
for(const file of files){
  if(path.basename(file)==='scripture-links.js')continue;
  const text=fs.readFileSync(file,'utf8');
  const references=findReferences(text);
  referenceCount+=references.length;
  for(const reference of references){
    if(/,\s*[123]$/.test(reference))failures.push(`${path.relative(root,file)}: reference incorrectly ends at a numbered-book prefix: ${reference}`);
    if(!/^https:\/\/www\.biblegateway\.com\/passage\/\?search=/.test(context.window.NLDG_SCRIPTURE_LINKS.passageUrl(reference)))failures.push(`${path.relative(root,file)}: could not build passage URL for ${reference}`);
  }
}

if(!source.includes('content:"\\\\00a0↗"')||!source.includes('white-space:nowrap'))failures.push('External-link arrow is not protected from wrapping alone.');

if(failures.length){
  console.error(`Scripture link audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(failure=>console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Scripture link audit PASSED: ${referenceCount} repository references scanned across ${files.length} content files.`);
