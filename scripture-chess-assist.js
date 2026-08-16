(()=>{
function init(){
  const panel=document.getElementById('challengePanel');
  const actions=panel?.querySelector('.challenge-actions');
  const choiceList=document.getElementById('choiceList');
  const reference=document.getElementById('challengeReference');
  const question=document.getElementById('challengeQuestion');
  const answerPanel=document.getElementById('answerPanel');
  const reveal=document.getElementById('revealAnswerBtn');
  const award=document.getElementById('awardPointBtn');
  const noPoint=document.getElementById('noPointBtn');
  const mode=document.getElementById('modeSelect');
  const level=document.getElementById('levelSelect');
  if(!panel||!actions||!choiceList||!reference||!question||!answerPanel||!reveal||!award||!noPoint||!mode||!level)return;

  const button=document.createElement('button');
  button.id='giveChoicesBtn';
  button.className='btn hidden';
  button.type='button';
  button.textContent='Give Me Choices';
  reveal.before(button);

  let activeKey='';
  let assistanceUsed=false;

  function currentQuestion(){
    const ref=reference.textContent.trim();
    const prompt=question.textContent.trim();
    return (window.SCRIPTURE_CHESS_QUESTIONS||[]).find(item=>item.reference===ref&&item.prompt===prompt)||null;
  }

  function resetIfClosed(){
    if(panel.classList.contains('hidden')){
      activeKey='';
      assistanceUsed=false;
      button.classList.add('hidden');
    }
  }

  function sync(){
    resetIfClosed();
    if(panel.classList.contains('hidden'))return;
    const item=currentQuestion();
    const key=item?.id||'';
    if(key&&key!==activeKey){activeKey=key;assistanceUsed=false;}
    const assist=key?(window.SCRIPTURE_CHESS_ASSIST_CHOICES||{})[key]:null;
    const alreadyRevealed=!answerPanel.classList.contains('hidden');
    const eligible=mode.value==='single'&&level.value!=='beginner'&&assist&&Array.isArray(assist.choices)&&assist.choices.length===4&&!alreadyRevealed&&!assistanceUsed;
    button.classList.toggle('hidden',!eligible);
  }

  function renderChoices(){
    const item=currentQuestion();
    const assist=item?(window.SCRIPTURE_CHESS_ASSIST_CHOICES||{})[item.id]:null;
    if(!assist||!Array.isArray(assist.choices)||assist.choices.length!==4)return;
    assistanceUsed=true;
    button.classList.add('hidden');
    reveal.classList.add('hidden');
    choiceList.innerHTML=assist.choices.map(choice=>`<button type="button" class="choice" data-assist-correct="${choice===assist.answer?'true':'false'}">${escapeHtml(choice)}</button>`).join('');
    choiceList.querySelectorAll('.choice').forEach(option=>option.addEventListener('click',()=>answerChoice(option)));
  }

  function answerChoice(option){
    if(option.disabled)return;
    const correct=option.dataset.assistCorrect==='true';
    choiceList.querySelectorAll('.choice').forEach(item=>{
      item.disabled=true;
      if(item.dataset.assistCorrect==='true')item.classList.add('correct');
    });
    if(!correct)option.classList.add('wrong');
    reveal.click();
    queueMicrotask(()=>{
      if(correct)award.click();
      else noPoint.click();
    });
  }

  function escapeHtml(value){
    return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  button.addEventListener('click',renderChoices);
  mode.addEventListener('change',sync);
  level.addEventListener('change',sync);
  new MutationObserver(sync).observe(panel,{attributes:true,subtree:true,childList:true,characterData:true});
  sync();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
