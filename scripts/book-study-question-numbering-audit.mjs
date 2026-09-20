import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root=path.resolve('.');
const entries=await fs.readdir(root,{withFileTypes:true});
const dataFiles=entries
  .filter(entry=>entry.isFile()&&/-study-data(?:-es)?\.js$/.test(entry.name))
  .map(entry=>entry.name)
  .sort();
const guideFiles=entries
  .filter(entry=>entry.isFile()&&/-study-guide(?:-es)?\.js$/.test(entry.name))
  .map(entry=>entry.name)
  .sort();

const failures=[];
let questionArrays=0;
let questionStrings=0;
let seriesQuestionArrays=0;
let seriesQuestionStrings=0;

function lineNumber(source,index){
  return source.slice(0,index).split(/\r?\n/).length;
}

function auditArrays(source,file,key){
  const arrayPattern=new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`,'g');
  let match;
  let arrays=0;
  let strings=0;

  while((match=arrayPattern.exec(source))){
    arrays+=1;
    const body=match[1];
    strings+=(body.match(/^\s*["']/gm)||[]).length;

    const numbered=/(?:^|\r?\n)\s*["'](\d+)\.\s+/g;
    let item;
    while((item=numbered.exec(body))){
      const absoluteIndex=match.index+match[0].indexOf(body)+item.index;
      failures.push(`${file}:${lineNumber(source,absoluteIndex)} ${key} string begins with manual numbering "${item[1]}."`);
    }
  }

  return {arrays,strings};
}

for(const file of dataFiles){
  const source=await fs.readFile(path.join(root,file),'utf8');
  const result=auditArrays(source,file,'questions');
  questionArrays+=result.arrays;
  questionStrings+=result.strings;
}

for(const file of guideFiles){
  const source=await fs.readFile(path.join(root,file),'utf8');
  const result=auditArrays(source,file,'seriesQuestions');
  seriesQuestionArrays+=result.arrays;
  seriesQuestionStrings+=result.strings;
}

if(!dataFiles.length)failures.push('No English or Spanish book-study data files were discovered.');
if(!questionArrays)failures.push('No book-study questions arrays were discovered.');

console.log(`Scanned ${dataFiles.length} English/Spanish book-study data files: ${questionArrays} questions arrays, ${questionStrings} question strings.`);
console.log(`Scanned ${guideFiles.length} book-study guide files: ${seriesQuestionArrays} seriesQuestions arrays, ${seriesQuestionStrings} series question strings.`);

if(failures.length){
  console.error('\nManual question numbering found:');
  for(const failure of failures)console.error(`- ${failure}`);
  process.exitCode=1;
}else{
  console.log('PASS: no questions or seriesQuestions string begins with manual numeric numbering.');
}
