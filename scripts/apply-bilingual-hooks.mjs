import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT=process.cwd();
const pages=[
  'bible-jeopardy.html',
  'bible-survey-game.html',
  'bible-survey-host.html',
  'bible-tic-tac-toe.html',
  'devotionals/you-dont-have-to-see-the-whole-road.html',
  'es/gran-mandamiento.html',
  'faith-wheel.html',
  'finish-the-verse.html',
  'games-presentation.html',
  'games.html',
  'lightning-round.html',
  'memory-match.html',
  'multi-team-game-v093.html',
  'multi-team-game.html',
  'question-review.html',
  'scripture-chess-prototype.html',
  'scripture-chess.html',
  'scripture-or-suspicion.html',
  'who-am-i.html'
];

let changed=0;
for(const relative of pages){
  const file=path.join(ROOT,relative);
  let html=await fs.readFile(file,'utf8');
  if(/nldg-i18n\.js/i.test(html))continue;
  const depth=relative.split('/').length-1;
  const prefix='../'.repeat(depth);
  const tag=`<script src="${prefix}nldg-i18n.js?v=1.1.0"></script>`;
  if(!/<\/body>/i.test(html))throw new Error(`No body close tag found in ${relative}`);
  html=html.replace(/<\/body>/i,`${tag}</body>`);
  await fs.writeFile(file,html,'utf8');
  changed+=1;
  console.log(`Added bilingual access: ${relative}`);
}
console.log(`Updated ${changed} page${changed===1?'':'s'}.`);
