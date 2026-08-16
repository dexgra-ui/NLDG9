const CHESS_ENGINE_URL='https://cdn.jsdelivr.net/npm/chess.js@1.4.0/dist/esm/chess.js';
let ChessCtor;
try{
  ({Chess:ChessCtor}=await import(CHESS_ENGINE_URL));
}catch(error){
  console.error('Scripture Chess could not load the chess rules engine.',error);
  const status=document.getElementById('gameStatus');
  if(status)status.textContent='Chess engine unavailable. Please reload when connected.';
  throw error;
}

const questions=Array.isArray(window.SCRIPTURE_CHESS_QUESTIONS)?window.SCRIPTURE_CHESS_QUESTIONS:[];
const $=selector=>document.querySelector(selector);
const files='abcdefgh';
const pieceNames={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const pieces={w:{p:'♙',n:'♘',b:'♗',r:'♖',q:'♕',k:'♔'},b:{p:'♟',n:'♞',b:'♝',r:'♜',q:'♛',k:'♚'}};
const pieceValues={p:100,n:320,b:330,r:500,q:900,k:20000};
const eventLabels={capture:'Capture',check:'Check',castle:'Castling',promotion:'Promotion',checkmate:'Checkmate',defense:'Stand Firm'};
const eventKinds={capture:'fact',check:'context',castle:'meaning',promotion:'bonus',checkmate:'big',defense:'context'};
const COMPUTER_NAME='Scripture Chess Computer';

const setupView=$('#setupView');
const gameView=$('#gameView');
const completeView=$('#completeView');
const board=$('#chessboard');
const boardLock=$('#boardLock');
const gameStatus=$('#gameStatus');
const whiteCard=$('#whiteCard');
const blackCard=$('#blackCard');
const whiteNameEl=$('#whiteName');
const blackNameEl=$('#blackName');
const whiteScoreEl=$('#whiteScore');
const blackScoreEl=$('#blackScore');
const moveList=$('#moveList');
const instructionPanel=$('#instructionPanel');
const instructionTitle=$('#instructionTitle');
const instructionText=$('#instructionText');
const challengePanel=$('#challengePanel');
const eventBadge=$('#eventBadge');
const challengeReference=$('#challengeReference');
const challengeQuestion=$('#challengeQuestion');
const choiceList=$('#choiceList');
const answerPanel=$('#answerPanel');
const challengeFeedback=$('#challengeFeedback');
const revealAnswerBtn=$('#revealAnswerBtn');
const leaderScoreButtons=$('#leaderScoreButtons');
const awardPointBtn=$('#awardPointBtn');
const noPointBtn=$('#noPointBtn');
const continueBtn=$('#continueBtn');
const undoBtn=$('#undoBtn');
const promotionDialog=$('#promotionDialog');
const modeSelect=$('#modeSelect');
const aiDifficultySelect=$('#aiDifficultySelect');
const blackNameField=$('#blackNameField');
const aiDifficultyField=$('#aiDifficultyField');
const whiteNameLabel=$('#whiteNameLabel');
const modeHelp=$('#modeHelp');
const blackScriptureMeta=$('#blackScriptureMeta');
const computerRoleMeta=$('#computerRoleMeta');
const finalBlackCard=$('#finalBlackCard');
const finalScores=$('#finalScores');

let game=new ChessCtor();
let playerNames={w:'Player',b:COMPUTER_NAME};
let level='intermediate';
let mode='single';
let aiDifficulty='medium';
let scores={w:0,b:0};
let selectedSquare='';
let legalMoves=[];
let currentChallenge=null;
let pendingPromotion=null;
let pendingCompletion=false;
let usedQuestionIds=new Set();
let snapshots=[];
let moveLog=[];
let lastMove=null;
let aiThinking=false;
let aiTimer=0;
let aiGeneration=0;

function safeName(value,fallback){const text=String(value||'').trim().replace(/[<>]/g,'');return text.slice(0,28)||fallback;}
function colorName(color){return color==='w'?'White':'Black';}
function playerName(color){return playerNames[color]||colorName(color);}
function pieceLabel(piece){return piece?`${colorName(piece.color)} ${pieceNames[piece.type]}`:'empty';}
function difficultyLabel(){return aiDifficulty.charAt(0).toUpperCase()+aiDifficulty.slice(1);}
function isSinglePlayer(){return mode==='single';}
function isComputerTurn(){return isSinglePlayer()&&game.turn()==='b';}

function syncSetupMode(){
  const solo=modeSelect.value==='single';
  blackNameField.classList.toggle('hidden',solo);
  aiDifficultyField.classList.toggle('hidden',!solo);
  whiteNameLabel.textContent=solo?'Your Name':'White Player or Team';
  modeHelp.textContent=solo
    ?'You play White. The computer plays Black and never earns Scripture Points. If it puts you in check, you receive a Stand Firm Scripture challenge.'
    :'Both sides play normal chess. Significant moves open Scripture challenges for the player or team that made the move.';
}

function cancelAi(){
  aiGeneration+=1;
  aiThinking=false;
  if(aiTimer){clearTimeout(aiTimer);aiTimer=0;}
}

function startGame(fromCurrent=false){
  cancelAi();
  if(!fromCurrent){
    mode=modeSelect.value;
    aiDifficulty=aiDifficultySelect.value;
    playerNames={
      w:safeName($('#whiteNameInput').value,isSinglePlayer()?'Player':'Team Faith'),
      b:isSinglePlayer()?COMPUTER_NAME:safeName($('#blackNameInput').value,'Team Grace')
    };
    level=$('#levelSelect').value;
  }
  game=new ChessCtor();scores={w:0,b:0};selectedSquare='';legalMoves=[];currentChallenge=null;pendingPromotion=null;pendingCompletion=false;usedQuestionIds=new Set();snapshots=[];moveLog=[];lastMove=null;
  closeChallenge();closePromotion();
  whiteNameEl.textContent=playerNames.w;blackNameEl.textContent=playerNames.b;
  blackScriptureMeta.classList.toggle('hidden',isSinglePlayer());
  computerRoleMeta.classList.toggle('hidden',!isSinglePlayer());
  computerRoleMeta.textContent=isSinglePlayer()?`${difficultyLabel()} computer`:'Chess opponent';
  finalBlackCard.classList.toggle('hidden',isSinglePlayer());
  finalScores.classList.toggle('solo',isSinglePlayer());
  awardPointBtn.textContent=isSinglePlayer()?'I Got It · +1':'Award Scripture Point';
  noPointBtn.textContent=isSinglePlayer()?'Keep Learning · No Point':'No Point';
  setupView.classList.add('hidden');completeView.classList.add('hidden');gameView.classList.remove('hidden');
  render();
}

function render(){renderBoard();renderScores();renderStatus();renderMoves();renderInstruction();updateUndo();}
function renderScores(){
  whiteScoreEl.textContent=scores.w;blackScoreEl.textContent=scores.b;
  const turn=game.turn();
  whiteCard.classList.toggle('active',turn==='w'&&!game.isGameOver()&&!currentChallenge);
  blackCard.classList.toggle('active',turn==='b'&&!game.isGameOver()&&!currentChallenge);
}
function renderStatus(){
  if(currentChallenge){gameStatus.textContent=`${eventLabels[currentChallenge.event]} · ${playerName(currentChallenge.color)} Scripture challenge`;return;}
  if(aiThinking){gameStatus.textContent=`${COMPUTER_NAME} is thinking · Black to move`;return;}
  if(game.isCheckmate()){gameStatus.textContent='Checkmate';return;}
  if(game.isStalemate()){gameStatus.textContent='Stalemate · chess match drawn';return;}
  if(game.isDraw()){gameStatus.textContent='Drawn chess position';return;}
  const turn=game.turn();
  if(isSinglePlayer()&&turn==='b'){gameStatus.textContent=`${COMPUTER_NAME} · Black to move`;return;}
  gameStatus.textContent=game.isCheck()?`${playerName(turn)} is in check · ${colorName(turn)} to move`:`${playerName(turn)} · ${colorName(turn)} to move`;
}
function renderInstruction(){
  if(currentChallenge)return;
  if(aiThinking||isComputerTurn()){
    instructionTitle.textContent='Computer is thinking…';
    instructionText.textContent=`${difficultyLabel()} difficulty is choosing a legal move. Scripture Points remain yours alone.`;
  }else if(isSinglePlayer()){
    instructionTitle.textContent='Your move.';
    instructionText.textContent='Your captures, checks, castling, promotions, and checkmate open Scripture challenges. A computer check opens a Stand Firm challenge for you.';
  }else{
    instructionTitle.textContent='Make a legal chess move.';
    instructionText.textContent='Captures, checks, castling, promotions, and checkmate will open a Scripture challenge.';
  }
}
function renderMoves(){moveList.innerHTML=moveLog.length?moveLog.map((move,index)=>`<span class="move-chip">${index+1}. ${escapeHtml(move)}</span>`).join(''):'<span class="move-chip">Game ready</span>';}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}

function renderBoard(){
  const currentTurn=game.turn();
  const checkedKing=game.isCheck()?findKing(currentTurn):'';
  const legalTargets=new Map();
  legalMoves.forEach(move=>{const rows=legalTargets.get(move.to)||[];rows.push(move);legalTargets.set(move.to,rows)});
  const locked=Boolean(currentChallenge||aiThinking||isComputerTurn());
  let html='';
  for(let row=0;row<8;row++){
    for(let col=0;col<8;col++){
      const square=`${files[col]}${8-row}`;
      const piece=game.get(square);
      const light=(row+col)%2===0;
      const targetMoves=legalTargets.get(square)||[];
      const isCapture=targetMoves.some(move=>Boolean(move.captured));
      const isLast=lastMove&&(lastMove.from===square||lastMove.to===square);
      const classes=['square',light?'light':'dark',selectedSquare===square?'selected':'',targetMoves.length?'legal':'',isCapture?'capture-target':'',isLast?'last-move':'',checkedKing===square?'in-check':''].filter(Boolean).join(' ');
      const glyph=piece?pieces[piece.color][piece.type]:'';
      const label=`${square}, ${pieceLabel(piece)}${selectedSquare===square?', selected':''}`;
      html+=`<button type="button" class="${classes}" data-square="${square}" aria-label="${escapeHtml(label)}" ${locked?'disabled':''}><span class="piece ${piece?.color==='b'?'black-piece':''}" aria-hidden="true">${glyph}</span>${row===7?`<span class="coord file" aria-hidden="true">${files[col]}</span>`:''}${col===0?`<span class="coord rank" aria-hidden="true">${8-row}</span>`:''}</button>`;
    }
  }
  board.innerHTML=html;
  board.querySelectorAll('[data-square]').forEach(button=>button.addEventListener('click',()=>handleSquare(button.dataset.square)));
  boardLock.classList.toggle('hidden',!locked);
  boardLock.setAttribute('aria-hidden',String(!locked));
  if(currentChallenge)boardLock.textContent='Complete the Scripture challenge to continue.';
  else if(aiThinking||isComputerTurn())boardLock.textContent='Computer is thinking…';
}
function findKing(color){for(const file of files){for(let rank=1;rank<=8;rank++){const square=`${file}${rank}`;const piece=game.get(square);if(piece?.type==='k'&&piece.color===color)return square;}}return '';}

function handleSquare(square){
  if(currentChallenge||pendingPromotion||aiThinking||isComputerTurn()||game.isGameOver())return;
  const piece=game.get(square);
  if(!selectedSquare){if(piece?.color===game.turn())selectSquare(square);return;}
  if(square===selectedSquare){clearSelection();return;}
  const candidates=legalMoves.filter(move=>move.to===square);
  if(candidates.length){
    if(candidates.some(move=>move.promotion)){pendingPromotion={from:selectedSquare,to:square};openPromotion();return;}
    commitMove({from:selectedSquare,to:square},'human');return;
  }
  if(piece?.color===game.turn()){selectSquare(square);return;}
  clearSelection();
}
function selectSquare(square){selectedSquare=square;legalMoves=game.moves({square,verbose:true});renderBoard();}
function clearSelection(){selectedSquare='';legalMoves=[];renderBoard();}

function snapshot(){return {fen:game.fen(),scores:{...scores},used:[...usedQuestionIds],moveLog:[...moveLog],lastMove:lastMove?{...lastMove}:null};}
function restore(state){
  cancelAi();
  game.load(state.fen);scores={...state.scores};usedQuestionIds=new Set(state.used);moveLog=[...state.moveLog];lastMove=state.lastMove?{...state.lastMove}:null;selectedSquare='';legalMoves=[];currentChallenge=null;pendingCompletion=false;closeChallenge();render();
}

function commitMove(moveInput,source='human'){
  if(currentChallenge||game.isGameOver())return null;
  if(source==='human'&&(aiThinking||isComputerTurn()))return null;
  const before=snapshot();
  let move;
  try{move=game.move(moveInput);}catch{return null;}
  if(!move)return null;
  snapshots.push(before);selectedSquare='';legalMoves=[];lastMove={from:move.from,to:move.to};moveLog.push(move.san);
  const event=eventForMove(move);
  render();

  if(isSinglePlayer()&&source==='computer'){
    aiThinking=false;
    if(game.isGameOver()){completeGame();return move;}
    if(game.isCheck()){openChallenge('defense','w');return move;}
    render();
    return move;
  }

  if(event)openChallenge(event,move.color);
  else if(game.isGameOver())completeGame();
  else maybeScheduleAi();
  return move;
}
function eventForMove(move){
  if(game.isCheckmate())return 'checkmate';
  if(move.promotion)return 'promotion';
  if(/^O-O/.test(move.san))return 'castle';
  if(game.isCheck())return 'check';
  if(move.captured)return 'capture';
  return '';
}

function evaluatePosition(){
  if(game.isCheckmate())return game.turn()==='w'?100000:-100000;
  if(game.isDraw())return 0;
  let score=0;
  for(const row of game.board())for(const piece of row)if(piece)score+=(piece.color==='b'?1:-1)*pieceValues[piece.type];
  if(game.isCheck())score+=game.turn()==='w'?35:-35;
  return score;
}
function orderedMoves(){
  return game.moves({verbose:true}).sort((a,b)=>{
    const aScore=(a.captured?pieceValues[a.captured]:0)+(a.promotion?pieceValues[a.promotion]:0);
    const bScore=(b.captured?pieceValues[b.captured]:0)+(b.promotion?pieceValues[b.promotion]:0);
    return bScore-aScore;
  });
}
function minimax(depth,alpha,beta,deadline){
  if(depth<=0||game.isGameOver()||Date.now()>=deadline)return evaluatePosition();
  const maximizing=game.turn()==='b';
  const moves=orderedMoves();
  if(maximizing){
    let best=-Infinity;
    for(const move of moves){
      game.move(move);const value=minimax(depth-1,alpha,beta,deadline);game.undo();
      if(value>best)best=value;if(best>alpha)alpha=best;if(beta<=alpha||Date.now()>=deadline)break;
    }
    return best;
  }
  let best=Infinity;
  for(const move of moves){
    game.move(move);const value=minimax(depth-1,alpha,beta,deadline);game.undo();
    if(value<best)best=value;if(best<beta)beta=best;if(beta<=alpha||Date.now()>=deadline)break;
  }
  return best;
}
function chooseAiMove(){
  const moves=game.moves({verbose:true});
  if(!moves.length)return null;
  if(aiDifficulty==='easy')return moves[Math.floor(Math.random()*moves.length)];
  const deadline=Date.now()+(aiDifficulty==='hard'?850:180);
  const depth=aiDifficulty==='hard'?2:0;
  let bestScore=-Infinity;let bestMoves=[];
  for(const candidate of moves){
    game.move(candidate);
    let score=minimax(depth,-Infinity,Infinity,deadline);
    if(game.isCheck())score+=18;
    if(candidate.captured)score+=pieceValues[candidate.captured]*.12;
    game.undo();
    score+=Math.random()*(aiDifficulty==='hard'?1:14);
    if(score>bestScore+0.001){bestScore=score;bestMoves=[candidate];}
    else if(Math.abs(score-bestScore)<0.001)bestMoves.push(candidate);
    if(Date.now()>=deadline&&bestMoves.length)break;
  }
  return bestMoves[Math.floor(Math.random()*bestMoves.length)]||moves[0];
}
function maybeScheduleAi(){
  if(!isSinglePlayer()||!isComputerTurn()||currentChallenge||pendingPromotion||game.isGameOver()||aiThinking)return;
  const token=++aiGeneration;
  aiThinking=true;render();
  aiTimer=setTimeout(()=>{
    aiTimer=0;
    if(token!==aiGeneration||!isSinglePlayer()||game.turn()!=='b'||currentChallenge||game.isGameOver()){aiThinking=false;render();return;}
    const chosen=chooseAiMove();
    aiThinking=false;
    if(!chosen){completeGame();return;}
    commitMove({from:chosen.from,to:chosen.to,...(chosen.promotion?{promotion:chosen.promotion}:{})},'computer');
  },360);
}

function chooseQuestion(event){
  const kind=eventKinds[event];
  const pool=questions.filter(question=>question.level===level&&question.kind===kind);
  if(!pool.length)throw new Error(`No Scripture Chess questions for ${level}/${kind}.`);
  let available=pool.filter(question=>!usedQuestionIds.has(question.id));
  if(!available.length){pool.forEach(question=>usedQuestionIds.delete(question.id));available=[...pool];}
  const question=available[Math.floor(Math.random()*available.length)];
  usedQuestionIds.add(question.id);return question;
}
function openChallenge(event,color){
  const question=chooseQuestion(event);
  currentChallenge={event,color,question,scored:false,revealed:false};
  pendingCompletion=event==='checkmate';
  instructionPanel.classList.add('hidden');challengePanel.classList.remove('hidden');eventBadge.textContent=eventLabels[event];
  challengeReference.textContent=question.reference;challengeQuestion.textContent=question.prompt;choiceList.innerHTML='';answerPanel.classList.add('hidden');answerPanel.innerHTML='';challengeFeedback.textContent='';
  revealAnswerBtn.classList.add('hidden');leaderScoreButtons.classList.add('hidden');continueBtn.classList.add('hidden');
  if(level==='beginner')renderChoices(question);else revealAnswerBtn.classList.remove('hidden');
  render();
}
function renderChoices(question){
  choiceList.innerHTML=question.choices.map(choice=>`<button type="button" class="choice" data-choice="${escapeHtml(choice)}" data-correct="${choice===question.answer?'true':'false'}">${escapeHtml(choice)}</button>`).join('');
  choiceList.querySelectorAll('.choice').forEach(button=>button.addEventListener('click',()=>answerChoice(button)));
}
function answerChoice(button){
  if(!currentChallenge||currentChallenge.scored)return;
  const correct=button.dataset.correct==='true';
  choiceList.querySelectorAll('.choice').forEach(item=>{item.disabled=true;if(item.dataset.correct==='true')item.classList.add('correct');});
  if(!correct)button.classList.add('wrong');
  revealCurrentAnswer();
  currentChallenge.scored=true;
  if(correct){addPoint(currentChallenge.color);challengeFeedback.textContent=`Correct! Scripture Point for ${playerName(currentChallenge.color)}.`;}else{challengeFeedback.textContent='Not this time. Read the explanation and keep learning.';}
  continueBtn.classList.remove('hidden');renderStatus();updateUndo();
}
function revealCurrentAnswer(){
  if(!currentChallenge)return;
  currentChallenge.revealed=true;
  const {question}=currentChallenge;
  answerPanel.innerHTML=`<strong>Suggested answer:</strong> ${escapeHtml(question.answer)}<br><br>${escapeHtml(question.explanation)}`;
  answerPanel.classList.remove('hidden');revealAnswerBtn.classList.add('hidden');
  if(level!=='beginner'&&!currentChallenge.scored)leaderScoreButtons.classList.remove('hidden');
}
function scoreLeader(award){
  if(!currentChallenge||currentChallenge.scored)return;
  currentChallenge.scored=true;
  if(award){addPoint(currentChallenge.color);challengeFeedback.textContent=`Scripture Point awarded to ${playerName(currentChallenge.color)}.`;}else{challengeFeedback.textContent='No point awarded. The explanation stays visible for learning.';}
  leaderScoreButtons.classList.add('hidden');continueBtn.classList.remove('hidden');updateUndo();
}
function addPoint(color){if(isSinglePlayer()&&color==='b')return;scores[color]+=1;renderScores();}
function closeChallenge(){
  currentChallenge=null;instructionPanel.classList.remove('hidden');challengePanel.classList.add('hidden');eventBadge.textContent='Ready';choiceList.innerHTML='';answerPanel.classList.add('hidden');challengeFeedback.textContent='';revealAnswerBtn.classList.add('hidden');leaderScoreButtons.classList.add('hidden');continueBtn.classList.add('hidden');boardLock.classList.add('hidden');
}
function continueAfterChallenge(){
  if(!currentChallenge?.scored)return;
  const shouldComplete=pendingCompletion;pendingCompletion=false;closeChallenge();
  if(shouldComplete||game.isGameOver()){completeGame();return;}
  render();maybeScheduleAi();
}

function undoMove(){
  if(currentChallenge||pendingPromotion||aiThinking||!snapshots.length)return;
  let previous=snapshots.pop();
  if(isSinglePlayer()&&game.turn()==='w'&&snapshots.length)previous=snapshots.pop();
  restore(previous);
}
function updateUndo(){undoBtn.disabled=Boolean(currentChallenge||pendingPromotion||aiThinking||!snapshots.length);}

function openPromotion(){promotionDialog.classList.remove('hidden');promotionDialog.querySelector('[data-promotion]')?.focus();updateUndo();}
function closePromotion(){promotionDialog.classList.add('hidden');pendingPromotion=null;updateUndo();}
function promote(piece){if(!pendingPromotion)return;const move={...pendingPromotion,promotion:piece};promotionDialog.classList.add('hidden');pendingPromotion=null;commitMove(move,'human');}

function completeGame(){
  cancelAi();closeChallenge();gameView.classList.add('hidden');completeView.classList.remove('hidden');
  let title='Chess Match Complete';let chessResult='The chess game has ended.';
  if(game.isCheckmate()){
    const winner=game.turn()==='w'?'b':'w';title=`${playerName(winner)} wins the chess match!`;chessResult=`Checkmate. ${playerName(winner)} wins on the board.`;
  }else if(game.isStalemate())chessResult='The chess match ends in stalemate.';
  else if(game.isThreefoldRepetition())chessResult='The chess match ends by threefold repetition.';
  else if(game.isInsufficientMaterial())chessResult='The chess match ends because there is insufficient material to force checkmate.';
  else if(game.isDrawByFiftyMoves())chessResult='The chess match ends by the fifty-move rule.';
  else if(game.isDraw())chessResult='The chess match ends in a draw.';
  const scriptureSummary=isSinglePlayer()
    ?`${playerNames.w} earned ${scores.w} Scripture Point${scores.w===1?'':'s'}. The computer does not earn Scripture Points.`
    :scores.w===scores.b?'Scripture Points are tied.':scores.w>scores.b?`${playerNames.w} leads the Scripture score.`:`${playerNames.b} leads the Scripture score.`;
  $('#completeTitle').textContent=title;$('#completeText').textContent=`${chessResult} ${scriptureSummary} Chess and Scripture scoring stay separate.`;
  $('#finalWhiteName').textContent=playerNames.w;$('#finalBlackName').textContent=playerNames.b;$('#finalWhiteScore').textContent=scores.w;$('#finalBlackScore').textContent=scores.b;
}
function returnToSetup(){cancelAi();gameView.classList.add('hidden');completeView.classList.add('hidden');setupView.classList.remove('hidden');syncSetupMode();}

modeSelect.addEventListener('change',syncSetupMode);
$('#startGameBtn').addEventListener('click',()=>startGame(false));
$('#newGameBtn').addEventListener('click',()=>startGame(true));
undoBtn.addEventListener('click',undoMove);
revealAnswerBtn.addEventListener('click',revealCurrentAnswer);
awardPointBtn.addEventListener('click',()=>scoreLeader(true));
noPointBtn.addEventListener('click',()=>scoreLeader(false));
continueBtn.addEventListener('click',continueAfterChallenge);
$('#rematchBtn').addEventListener('click',()=>startGame(true));
$('#changePlayersBtn').addEventListener('click',returnToSetup);
promotionDialog.querySelectorAll('[data-promotion]').forEach(button=>button.addEventListener('click',()=>promote(button.dataset.promotion)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pendingPromotion){promotionDialog.classList.add('hidden');pendingPromotion=null;clearSelection();updateUndo();}});
$('#fullscreenBtn').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{}});
syncSetupMode();

function setTestPosition(fen){
  if(!new URLSearchParams(location.search).has('test'))return false;
  cancelAi();
  try{game.load(fen);}catch{return false;}
  selectedSquare='';legalMoves=[];currentChallenge=null;pendingPromotion=null;pendingCompletion=false;snapshots=[];moveLog=[];lastMove=null;scores={w:0,b:0};usedQuestionIds=new Set();closeChallenge();setupView.classList.add('hidden');completeView.classList.add('hidden');gameView.classList.remove('hidden');render();return true;
}
function getTestState(){return {fen:game.fen(),turn:game.turn(),pieceCount:game.board().flat().filter(Boolean).length,scores:{...scores},challenge:currentChallenge?{event:currentChallenge.event,color:currentChallenge.color,id:currentChallenge.question.id,scored:currentChallenge.scored,revealed:currentChallenge.revealed}:null,isCheck:game.isCheck(),isCheckmate:game.isCheckmate(),isDraw:game.isDraw(),moves:[...moveLog],gameViewVisible:!gameView.classList.contains('hidden'),completeVisible:!completeView.classList.contains('hidden'),mode,aiDifficulty,aiThinking};}
if(new URLSearchParams(location.search).has('test')){
  window.ScriptureChessTest={
    start:(requestedLevel='intermediate')=>{cancelAi();mode='two-player';level=requestedLevel;playerNames={w:'Team Faith',b:'Team Grace'};startGame(true);return getTestState();},
    startSolo:(requestedLevel='intermediate',difficulty='medium')=>{cancelAi();mode='single';level=requestedLevel;aiDifficulty=difficulty;playerNames={w:'Player',b:COMPUTER_NAME};startGame(true);return getTestState();},
    setPosition:setTestPosition,
    move:(from,to,promotion)=>Boolean(commitMove({from,to,...(promotion?{promotion}:{})},'human')),
    forceComputerMove:(from,to,promotion)=>{cancelAi();return Boolean(commitMove({from,to,...(promotion?{promotion}:{})},'computer'));},
    state:getTestState,
    continueChallenge:continueAfterChallenge,
    undo:undoMove,
    reset:()=>startGame(true),
    engineVersion:'1.4.0',
    engineUrl:CHESS_ENGINE_URL
  };
  window.dispatchEvent(new Event('scripture-chess-test-ready'));
}
