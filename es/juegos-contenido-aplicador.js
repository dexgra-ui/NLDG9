(()=>{
const state=window.NLDG_SPANISH_GAME||{};
const outer=document.getElementById('gameHostFrame');
if(!outer)return;
const contentBySlug={
'scripture-or-suspicion':window.NLDG_ES_SCRIPTURE_OR_SUSPICION||null,
'who-am-i':window.NLDG_ES_WHO_AM_I?{prompts:window.NLDG_ES_WHO_AM_I.prompts,labels:window.NLDG_ES_WHO_AM_I.names}:null,
'bible-jeopardy':window.NLDG_ES_BIBLE_TRIVIA||null,
'lightning-round':window.NLDG_ES_LIGHTNING||null,
'memory-match':window.NLDG_ES_MEMORY||null
};
const content=contentBySlug[state.slug];
if(!content)return;
const setText=(el,value)=>{if(el&&value!=null&&el.textContent!==value)el.textContent=value};
const sourceChoice=button=>{if(!button.dataset.nldgSourceChoice)button.dataset.nldgSourceChoice=button.dataset.answer||button.textContent.trim();return button.dataset.nldgSourceChoice};
const translateReference=value=>{
 const raw=String(value||'').trim();if(!raw||!content.referenceBooks)return raw;
 const prefix=raw.startsWith('Reference: ')?'Reference: ':raw.startsWith('Referencia: ')?'Referencia: ':'';
 const reference=prefix?raw.slice(prefix.length):raw;
 const books=Object.keys(content.referenceBooks).sort((a,b)=>b.length-a.length);
 const book=books.find(name=>reference===name||reference.startsWith(`${name} `));
 return `Referencia: ${book?content.referenceBooks[book]+reference.slice(book.length):reference}`;
};
const translateGameDoc=doc=>{
if(!doc)return;
const file=(doc.location?.pathname||'').split('/').pop();
if(file!==state.game)return;
if(state.slug==='memory-match'){
 doc.querySelectorAll('#grid .card').forEach(card=>{const raw=card.textContent.trim();if(content.labels?.[raw])setText(card,content.labels[raw])});
 return;
}
const question=doc.getElementById('question');
if(question){
 const raw=question.textContent.trim();
 if(content.prompts?.[raw]){question.dataset.nldgSourcePrompt=raw;setText(question,content.prompts[raw]);}
 else if(!question.dataset.nldgSourcePrompt&&raw)question.dataset.nldgSourcePrompt=raw;
}
const buttons=[...doc.querySelectorAll('#answers .answer')];
buttons.forEach(button=>{const source=sourceChoice(button);const translated=content.labels?.[source];if(translated)setText(button,translated)});
const revealedAnswer=doc.getElementById('answer');
if(revealedAnswer){const raw=revealedAnswer.textContent.trim();if(content.answers?.[raw]){revealedAnswer.dataset.nldgSourceAnswer=raw;setText(revealedAnswer,content.answers[raw]);}}
const feedback=doc.getElementById('feedback');
if(feedback){
 const raw=feedback.textContent.trim();
 let correct=null;
 let match=raw.match(/^The answer is (.+)\.$/);if(match)correct=match[1];
 if(!correct){match=raw.match(/^La respuesta es (.+)\.$/);if(match){const shown=match[1];correct=Object.keys(content.labels||{}).find(key=>content.labels[key]===shown)||shown}}
 if(correct){const translated=content.labels?.[correct]||correct;setText(feedback,`La respuesta es ${translated}.`);buttons.forEach(button=>{if(sourceChoice(button)===correct)button.classList.add('correct')})}
}
const reference=doc.getElementById('reference');if(reference&&reference.textContent.trim())setText(reference,translateReference(reference.textContent));
};
const walk=doc=>{if(!doc)return;try{translateGameDoc(doc);doc.querySelectorAll('iframe').forEach(frame=>{try{walk(frame.contentDocument)}catch{}})}catch{}};
const apply=()=>{try{walk(outer.contentDocument)}catch{}};
outer.addEventListener('load',()=>{apply();setTimeout(apply,150);setTimeout(apply,500)});
const timer=setInterval(apply,220);
window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();