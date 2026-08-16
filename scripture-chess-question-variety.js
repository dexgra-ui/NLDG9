(()=>{
const source=Array.isArray(window.SCRIPTURE_CHESS_QUESTIONS)?window.SCRIPTURE_CHESS_QUESTIONS:[];
const rotatingKinds=['fact','context','meaning','bonus'];
const expanded=[];

for(const question of source){
  if(question.kind==='big'){
    expanded.push(question);
    continue;
  }
  for(const kind of rotatingKinds){
    expanded.push({...question,kind});
  }
}

window.SCRIPTURE_CHESS_QUESTIONS=expanded;
})();
