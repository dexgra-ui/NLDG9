(()=>{
const state=window.NLDG_SPANISH_GAME||{};
const frame=document.getElementById('gameHostFrame');
if(!frame)return;
const spanishHub=new URL('juegos.html',location.href).href;
const playFile='play'+'.html';
const teamHostFile='multi-team-game-v095'+'.html';
const teamShellFile='multi-team-game-v094'+'.html';
const slugOf=file=>String(file||'').replace(/\.html$/,'');
const gameTitles={
'scripture-or-suspicion':'Escritura o sospecha',
'who-am-i':'¿Quién soy?',
'finish-the-verse':'Completa el versículo',
'bible-jeopardy':'Trivia bíblica',
'lightning-round':'Ronda relámpago',
'memory-match':'Memoria bíblica'
};
const exact={
'Game Center':'Centro de juegos','Fullscreen':'Pantalla completa','Game Setup':'Configuración del juego',
'Audience':'Audiencia','Questions':'Preguntas','Play mode':'Modo de juego','Game pack':'Paquete de juego','Difficulty':'Dificultad','Seconds':'Segundos','Pairs':'Parejas','Number of Teams':'Número de equipos','Starting Team':'Equipo inicial','Celebrations & Sound':'Celebraciones y sonido',
'Preschool':'Preescolar','Kids':'Niños','Teens':'Adolescentes','Adults':'Adultos','Family':'Familia','Mixed':'Mixta','Easy':'Fácil','Medium':'Intermedia','Hard':'Difícil','Two Teams':'Dos equipos','Solo':'Solo','On':'Activado','Off':'Desactivado','Choose Randomly':'Elegir al azar','All Active Packs':'Todos los paquetes activos','General Bible':'Biblia general',
'Start Game':'Comenzar juego','Start Board':'Comenzar tablero','Reset Recent Questions':'Reiniciar preguntas recientes','Reset Pack History':'Reiniciar historial del paquete','Reset Clue History':'Reiniciar historial de pistas','Reset Recent Pairs':'Reiniciar parejas recientes','New Board':'Nuevo tablero','End Game':'Terminar juego','Reveal Answer':'Mostrar respuesta','No Award':'Sin puntos','Next Question':'Siguiente pregunta','Play Again':'Jugar otra vez','Return to Game Center':'Volver al Centro de juegos','← Exit':'← Salir','Exit':'Salir',
'Undo':'Deshacer','Skip':'Saltar','Flag Question':'Marcar pregunta','Reset Scores':'Reiniciar puntuaciones','← Team':'← Equipo','Team →':'Equipo →','🔊 Effects On':'🔊 Efectos activados','🔇 Effects Off':'🔇 Efectos desactivados',
'Round Complete!':'¡Ronda completada!','Game Complete!':'¡Juego completado!','All Matches Found!':'¡Encontraste todas las parejas!','Round Complete':'Ronda completada','We Have a Tie!':'¡Tenemos un empate!','Start Tiebreaker':'Comenzar desempate','End in a Tie':'Terminar en empate','Game Ends in a Tie':'El juego termina en empate','Final Result':'Resultado final','Tiebreaker Complete':'Desempate completado',
'Correct!':'¡Correcto!','Match found!':'¡Pareja encontrada!','No match. Next turn.':'No hay pareja. Siguiente turno.','Checking match...':'Comprobando pareja...','Scripture':'Escritura','Suspicion':'Sospecha',
'No repeats during a round':'Sin repeticiones durante una ronda','Recent questions rotate out':'Las preguntas recientes van rotando','Timed questions':'Preguntas con tiempo','Randomized numbered cards':'Tarjetas numeradas al azar','Recent pairs rotate out':'Las parejas recientes van rotando','Less-used questions appear first':'Las preguntas menos usadas aparecen primero','Loading game packs…':'Cargando paquetes de juego…','Fallback mode':'Modo de respaldo',
'Host controls ready':'Controles del anfitrión listos','Nothing to undo':'Nada que deshacer','Turn skipped':'Turno saltado','Clue skipped':'Pista saltada','Question skipped':'Pregunta saltada','Scores reset':'Puntuaciones reiniciadas','Great job!':'¡Muy bien!','Round complete!':'¡Ronda completada!',
'Old Testament':'Antiguo Testamento','Jesus & Gospels':'Jesús y los Evangelios','Acts & Church':'Hechos y la Iglesia','Faith & Teaching':'Fe y enseñanza','Bible People & Events':'Personas y eventos bíblicos',
'Team Grace':'Equipo Gracia','Team Truth':'Equipo Verdad','Team Faith':'Equipo Fe','Team Hope':'Equipo Esperanza','Team Mercy':'Equipo Misericordia','Team Joy':'Equipo Gozo','Team Peace':'Equipo Paz','Team Light':'Equipo Luz'
};
const descriptions={
'scripture-or-suspicion':'Decide si cada afirmación viene de la Escritura o solamente suena bíblica.',
'who-am-i':'Identifica personajes bíblicos por pistas sobre sus vidas, decisiones y encuentros con Dios.',
'finish-the-verse':'Completa pasajes conocidos de la Escritura y fortalece la memoria bíblica.',
'bible-jeopardy':'Elige una categoría, revela la respuesta y otorga los puntos.',
'lightning-round':'Responde rápido antes de que el temporizador llegue a cero.',
'memory-match':'Encuentra parejas de personas, lugares, eventos y enseñanzas bíblicas.'
};
const setText=(el,value)=>{if(el&&value!=null&&el.textContent!==value)el.textContent=value};
const translateExact=(el)=>{if(!el)return;const raw=el.textContent.trim();if(exact[raw])setText(el,exact[raw])};
const translateOptions=(doc)=>doc.querySelectorAll('option').forEach(option=>{const raw=option.textContent.trim();if(exact[raw])option.textContent=exact[raw];else if(/^([0-9]+) pairs$/.test(raw))option.textContent=raw.replace(' pairs',' parejas')});
const translateLabels=(doc)=>doc.querySelectorAll('label').forEach(label=>{for(const node of label.childNodes){if(node.nodeType!==3)continue;const raw=node.textContent.trim();if(exact[raw]){node.textContent=node.textContent.replace(raw,exact[raw]);break}const team=raw.match(/^Team (\d+)$/);if(team){node.textContent=node.textContent.replace(raw,`Equipo ${team[1]}`);break}}});
const translateDefaults=(doc)=>doc.querySelectorAll('input').forEach(input=>{if(exact[input.value])input.value=exact[input.value]});
const dynamic=(text)=>{
let value=String(text||'').trim();if(!value)return value;if(exact[value])return exact[value];
let m;
if((m=value.match(/^(\d+) of (\d+)$/)))return `${m[1]} de ${m[2]}`;
if((m=value.match(/^Matches (\d+) of (\d+)$/)))return `Parejas ${m[1]} de ${m[2]}`;
if((m=value.match(/^(\d+) pair combinations available$/)))return `${m[1]} combinaciones de parejas disponibles`;
if((m=value.match(/^(\d+) matching questions available$/)))return `${m[1]} preguntas coincidentes disponibles`;
if((m=value.match(/^(\d+) matching clues available\. The board favors unused and less-played clues\.$/)))return `${m[1]} pistas coincidentes disponibles. El tablero favorece las pistas no usadas o menos jugadas.`;
if((m=value.match(/^(\d+) questions available$/)))return `${m[1]} preguntas disponibles`;
if((m=value.match(/^(\d+) of (\d+) unused in this pack$/)))return `${m[1]} de ${m[2]} sin usar en este paquete`;
if((m=value.match(/^Reference: (.+)$/)))return `Referencia: ${m[1]}`;
if((m=value.match(/^The answer is (.+)\.$/)))return `La respuesta es ${m[1]}.`;
if((m=value.match(/^You answered (\d+) of (\d+) correctly\.$/)))return `Respondiste correctamente ${m[1]} de ${m[2]}.`;
if((m=value.match(/^You completed the board in (\d+) turns\.$/)))return `Completaste el tablero en ${m[1]} turnos.`;
if((m=value.match(/^Team (Grace|Truth):/)))return value.replace('Team Grace','Equipo Gracia').replace('Team Truth','Equipo Verdad').replace(/ points/g,' puntos');
if((m=value.match(/^(.+)'s turn$/)))return `Turno de ${m[1]}`;
if((m=value.match(/^(.+) selected$/)))return `${m[1]} seleccionado`;
if((m=value.match(/^Undid (.+)$/)))return `Se deshizo: ${m[1]}`;
if((m=value.match(/^Award (.+) \+(\d+)$/)))return `Otorgar a ${m[1]} +${m[2]}`;
if((m=value.match(/^(.+) found a match!$/)))return `¡${m[1]} encontró una pareja!`;
if((m=value.match(/^(.+) answered correctly!$/)))return `¡${m[1]} respondió correctamente!`;
if((m=value.match(/^(.+) are tied at (\d+) points\.$/)))return `${m[1].replace(/ and /g,' y ')} están empatados con ${m[2]} puntos.`;
if((m=value.match(/^(.+) finish with (\d+) points each\.$/)))return `${m[1].replace(/ and /g,' y ')} terminan con ${m[2]} puntos cada uno.`;
if((m=value.match(/^(.+) Wins!$/)))return `¡Gana ${m[1]}!`;
if(value.includes(' points.'))value=value.replace(/ points/g,' puntos');
return value;
};
const patchDialogs=(doc)=>{const win=doc.defaultView;if(!win||win.__nldgEsDialogs)return;win.__nldgEsDialogs=true;const alert0=win.alert.bind(win),confirm0=win.confirm.bind(win),prompt0=win.prompt.bind(win);const modal=text=>({
'Exit this game?':'¿Salir de este juego?','Reset all team scores?':'¿Reiniciar la puntuación de todos los equipos?','Recent-pair history has been reset.':'Se reinició el historial de parejas recientes.','Fullscreen is blocked here. On iPad, use Share → Add to Home Screen.':'La pantalla completa está bloqueada aquí. En iPad, usa Compartir → Añadir a pantalla de inicio.','Fullscreen is unavailable in this browser':'La pantalla completa no está disponible en este navegador.','What should be reviewed about this question?':'¿Qué debe revisarse de esta pregunta?','Check wording or biblical accuracy':'Revisar redacción o precisión bíblica'}[text]||text);win.alert=message=>alert0(modal(message));win.confirm=message=>confirm0(modal(message));win.prompt=(message,defaultValue)=>prompt0(modal(message),modal(defaultValue));};
const rewriteGameCenter=(doc)=>doc.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')!==playFile)return;link.href=spanishHub;link.target='_top';if(link.textContent.trim()==='Game Center'||link.textContent.trim()==='Return to Game Center')link.textContent=link.textContent.trim()==='Game Center'?'Centro de juegos':'Volver al Centro de juegos'});
const translateV095=(doc)=>{
patchDialogs(doc);rewriteGameCenter(doc);setText(doc.getElementById('tieLabel'),dynamic(doc.getElementById('tieLabel')?.textContent));setText(doc.getElementById('tieTitle'),dynamic(doc.getElementById('tieTitle')?.textContent));setText(doc.getElementById('tieMessage'),dynamic(doc.getElementById('tieMessage')?.textContent));['startTiebreaker','acceptTie','playAgain'].forEach(id=>translateExact(doc.getElementById(id)));translateExact(doc.querySelector('#finalChoices a[href]'));doc.querySelector('h1.sr-only')?.replaceChildren(document.createTextNode('Juego bíblico por equipos de No Labels'));
};
const translateV094=(doc)=>{
patchDialogs(doc);rewriteGameCenter(doc);setText(doc.getElementById('gameTitle'),gameTitles[state.slug]||'Juego en equipo');setText(doc.querySelector('.hero h1'),'Configuración del juego');setText(doc.querySelector('.hero p'),'Elige la audiencia y de uno a ocho equipos. Las respuestas correctas pueden incluir efectos opcionales de sonido y celebración.');translateLabels(doc);translateOptions(doc);translateDefaults(doc);setText(doc.getElementById('begin'),'Comenzar juego');
const ids={previous:'← Equipo',nextTeam:'Equipo →',undo:'Deshacer',skip:'Saltar',flagQuestion:'Marcar pregunta',fullscreen:'Pantalla completa',resetScores:'Reiniciar puntuaciones'};Object.entries(ids).forEach(([id,text])=>setText(doc.getElementById(id),text));const effects=doc.getElementById('effectsToggle');if(effects)setText(effects,effects.textContent.includes('Off')?'🔇 Efectos desactivados':'🔊 Efectos activados');const status=doc.getElementById('status');if(status)setText(status,dynamic(status.textContent));doc.querySelectorAll('#awardPanel button').forEach(button=>setText(button,dynamic(button.textContent)));
};
const translateRaw=(doc,file)=>{
const slug=slugOf(file);patchDialogs(doc);rewriteGameCenter(doc);const title=gameTitles[slug];if(title){setText(doc.querySelector('.brand small'),title);setText(doc.querySelector('.hero h1'),title);if(descriptions[slug])setText(doc.querySelector('.hero p'),descriptions[slug]);doc.title=`${title} | No Labels, Designed by God`;}
translateLabels(doc);translateOptions(doc);translateDefaults(doc);translateExact(doc.getElementById('fullscreen'));
const buttonIds=['start','resetHistory','quit','next','again','newBoard','endGame','reveal','noAward'];buttonIds.forEach(id=>translateExact(doc.getElementById(id)));
const reset=doc.getElementById('resetHistory');if(reset){const map={'scripture-or-suspicion':'Reiniciar historial del paquete','bible-jeopardy':'Reiniciar historial de pistas','memory-match':'Reiniciar parejas recientes'};setText(reset,map[slug]||'Reiniciar preguntas recientes')}
doc.querySelectorAll('.stats .stat').forEach(translateExact);['bankCount','historyCount','packNotice','notice','counter','feedback','summary','reference','status'].forEach(id=>{const el=doc.getElementById(id);if(el)setText(el,dynamic(el.textContent))});
const complete=doc.querySelector('#completeView h2');if(complete){const map={'memory-match':'¡Encontraste todas las parejas!','bible-jeopardy':'¡Juego completado!'};setText(complete,map[slug]||'¡Ronda completada!')}
if(slug==='scripture-or-suspicion'){doc.querySelectorAll('.answer[data-answer="Scripture"]').forEach(el=>setText(el,'Escritura'));doc.querySelectorAll('.answer[data-answer="Suspicion"]').forEach(el=>setText(el,'Sospecha'))}
if(slug==='bible-jeopardy'){doc.querySelectorAll('.cell.header').forEach(el=>setText(el,dynamic(el.textContent)));const meta=doc.getElementById('meta');if(meta){let text=meta.textContent;Object.entries(exact).forEach(([en,es])=>{if(['Old Testament','Jesus & Gospels','Acts & Church','Faith & Teaching','Bible People & Events'].includes(en))text=text.replace(en,es)});setText(meta,text)}['award1','award2'].forEach(id=>{const el=doc.getElementById(id);if(el)setText(el,dynamic(el.textContent))})}
};
const translateDocument=(doc)=>{if(!doc)return;try{doc.documentElement.lang='es';const file=doc.location.pathname.split('/').pop();if(file===teamHostFile)translateV095(doc);else if(file===teamShellFile)translateV094(doc);else if(gameTitles[slugOf(file)])translateRaw(doc,file);doc.querySelectorAll('iframe').forEach(child=>{try{translateDocument(child.contentDocument)}catch{}})}catch{}};
const apply=()=>{try{translateDocument(frame.contentDocument)}catch{}};
frame.addEventListener('load',()=>{apply();setTimeout(apply,150);setTimeout(apply,500)});
const timer=setInterval(apply,300);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();