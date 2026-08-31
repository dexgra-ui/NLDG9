(()=>{
const state=window.NLDG_SPANISH_GAME||{};
const outer=document.getElementById('gameHostFrame');
if(!outer)return;
const contentStatus=document.getElementById('contentStatus');
const contentBySlug={
'scripture-or-suspicion':window.NLDG_ES_SCRIPTURE_OR_SUSPICION||null,
'who-am-i':window.NLDG_ES_WHO_AM_I?{prompts:window.NLDG_ES_WHO_AM_I.prompts,labels:window.NLDG_ES_WHO_AM_I.names}:null,
'finish-the-verse':window.NLDG_ES_FINISH_VERSE||null,
'bible-jeopardy':window.NLDG_ES_BIBLE_TRIVIA||null,
'lightning-round':window.NLDG_ES_LIGHTNING||null,
'memory-match':window.NLDG_ES_MEMORY||null
};
const content=contentBySlug[state.slug];
if(!content)return;
const setText=(el,value)=>{if(el&&value!=null&&el.textContent!==value)el.textContent=value};
const sourceChoice=button=>{if(!button.dataset.nldgSourceChoice)button.dataset.nldgSourceChoice=button.dataset.answer||button.textContent.trim();return button.dataset.nldgSourceChoice};
const sourceReference=value=>{
 const raw=String(value||'').trim();
 if(raw.startsWith('Reference: '))return raw.slice('Reference: '.length);
 if(raw.startsWith('Referencia: '))return raw.slice('Referencia: '.length);
 return raw;
};
const translateReference=value=>{
 const reference=sourceReference(value);if(!reference||!content.referenceBooks)return String(value||'').trim();
 const books=Object.keys(content.referenceBooks).sort((a,b)=>b.length-a.length);
 const book=books.find(name=>reference===book||reference.startsWith(`${name} `));
 return `Referencia: ${book?content.referenceBooks[book]+reference.slice(book.length):reference}`;
};
const translateFinishVerse=doc=>{
 const group=doc.getElementById('group')?.value;
 const audience=content.audiences?.[group]||null;
 const reviewed=Boolean(audience&&content.reviewedAudiences?.includes(group));
 setText(contentStatus,reviewed?`Interfaz y banco ${audience.label} revisados en español · NTV`:'Interfaz en español · banco NTV de esta audiencia aún en revisión');
 if(!reviewed)return;
 const reference=doc.getElementById('reference');
 if(!reference)return;
 const current=sourceReference(reference.textContent);
 if(audience.entries?.[current])reference.dataset.nldgSourceReference=current;
 const source=reference.dataset.nldgSourceReference||current;
 const entry=audience.entries?.[source];
 if(!entry?.verified)return;
 setText(doc.getElementById('question'),entry.prompt);
 const buttons=[...doc.querySelectorAll('#answers .answer')];
 buttons.forEach(button=>{const sourceAnswer=sourceChoice(button);const translated=entry.choiceMap?.[sourceAnswer];if(translated)setText(button,translated)});
 const feedback=doc.getElementById('feedback');
 if(feedback){
  const raw=feedback.textContent.trim();
  let correct=null;
  let match=raw.match(/^The answer is (.+)\.$/);if(match)correct=match[1];
  if(!correct){match=raw.match(/^La respuesta es (.+)\.$/);if(match){const shown=match[1];correct=Object.keys(entry.choiceMap||{}).find(key=>entry.choiceMap[key]===shown)||shown}}
  if(correct){const translated=entry.choiceMap?.[correct]||entry.answer||correct;setText(feedback,`La respuesta es ${translated}.`);buttons.forEach(button=>{if(sourceChoice(button)===correct)button.classList.add('correct')})}
 }
 setText(reference,translateReference(source));
};
const translateGameDoc=doc=>{
if(!doc)return;
const file=(doc.location?.pathname||'').split('/').pop();
if(file!==state.game)return;
if(state.slug==='memory-match'){
 doc.querySelectorAll('#grid .card').forEach(card=>{const raw=card.textContent.trim();if(content.labels?.[raw])setText(card,content.labels[raw])});
 return;
}
if(state.slug==='finish-the-verse'){translateFinishVerse(doc);return;}
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