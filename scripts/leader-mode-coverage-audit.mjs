import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const libraryPath=path.join(root,'content-library.js');
const source=fs.readFileSync(libraryPath,'utf8');
const entries=[...source.matchAll(/\{id:'([^']+)',type:'([^']+)',title:'([^']+)'[\s\S]*?url:'([^']+)'[\s\S]*?status:'([^']+)'/g)].map(match=>({id:match[1],type:match[2],title:match[3],url:match[4],status:match[5]}));
const excludedPages=new Set(['studies.html','study-library.html','current-events-series.html','james-series.html','women-of-faith.html','men-of-faith.html','marriage-family.html','difficult-questions.html','leadership.html','sunday-school.html','technology-ai.html','teaching-library.html']);
const isIndividual=item=>{
 const file=item.url.split('?')[0];
 return item.status==='published'&&/study|lesson/i.test(item.type)&&!/collection|library|series/i.test(item.type)&&(!excludedPages.has(file)||item.url.includes('?'));
};
const lessons=entries.filter(isIndividual);
const failures=[];
const rows=[];
for(const item of lessons){
 const file=item.url.split('?')[0];
 const full=path.join(root,file);
 const exists=fs.existsSync(full);
 const html=exists?fs.readFileSync(full,'utf8'):'';
 const globalLoader=/script\.js(?:\?|["'])/.test(html);
 const contentRoot=/(lesson-wrap|study-content|wof-study-content|mof-study-content|mf-study-content|<article\b)/i.test(html);
 const eligible=exists&&globalLoader&&contentRoot;
 if(!eligible)failures.push(`${item.id}: ${!exists?'page absent':!globalLoader?'global loader absent':'supported lesson content root absent'}`);
 rows.push(`| ${item.id} | ${item.title} | ${item.url} | ${exists?'Yes':'No'} | ${globalLoader?'Yes':'No'} | ${contentRoot?'Yes':'No'} | ${eligible?'Covered':'BLOCKED'} |`);
}
const customSource=fs.readFileSync(path.join(root,'leader-guide-data.js'),'utf8');
const customIds=new Set([...customSource.matchAll(/^'([^']+)':\{/gm)].map(match=>match[1]));
const custom=lessons.filter(item=>customIds.has(item.id));
const fallback=lessons.filter(item=>!customIds.has(item.id));
const report=[
 '# Leader Mode Coverage Audit','',
 `Published individual lessons: **${lessons.length}**`,
 `Custom expanded leader guides: **${custom.length}**`,
 `Universal baseline leader guides: **${fallback.length}**`,
 `Blocked lessons: **${failures.length}**`,'',
 '| Lesson ID | Title | URL | Page | Global Loader | Content Root | Status |',
 '|---|---|---|---:|---:|---:|---|',
 ...rows,'',
 '## Custom expanded guides','',...(custom.length?custom.map(item=>`- ${item.id} — ${item.title}`):['- None']),'',
 '## Baseline guides awaiting deeper custom content','',...(fallback.length?fallback.map(item=>`- ${item.id} — ${item.title}`):['- None']),'',
 '## Release blockers','',...(failures.length?failures.map(item=>`- ${item}`):['- None'])
].join('\n');
fs.writeFileSync(path.join(root,'LEADER-MODE-COVERAGE.md'),report+'\n');
console.log(report);
if(failures.length){console.error(`\nLeader Mode coverage failed for ${failures.length} lesson(s).`);process.exit(1)}
