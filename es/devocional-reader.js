(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const DEVOTIONALS=window.NLDG_DEVOTIONALS_ES||[];
const pathId=(location.pathname.split('/').pop()||'').replace(/\.html$/i,'');
let index=DEVOTIONALS.findIndex(item=>item.id===pathId);
if(index<0)index=0;
const item=DEVOTIONALS[index];
const shell=document.querySelector('.reader-shell');
if(!item||!shell)return;
if(!shell.id)shell.id='contenido-principal';
if(!document.querySelector('.skip-link')){const skip=document.createElement('a');skip.className='skip-link';skip.href='#contenido-principal';skip.textContent='Saltar al contenido principal';document.body.insertBefore(skip,document.body.firstChild)}
shell.innerHTML=`<article><header class="reader-hero"><p class="devo-theme" id="theme"></p><h1 id="title">Devocional</h1><span class="reader-reference" id="reference"></span><p class="reader-summary" id="summary"></p><div class="reader-actions"><button class="button primary" id="print" type="button">Imprimir devocional</button><button class="button secondary" id="copy" type="button">Copiar enlace</button><a class="button secondary" href="devocionales.html">Todos los devocionales</a></div></header><div class="reader-content"><div class="reader-main"><section class="reader-block"><h2>Enfoque bíblico</h2><p id="scriptureFocus"></p><p><strong id="readPassage"></strong></p></section><section class="reader-block"><h2>Reflexión</h2><div id="reflection"></div></section><section class="reader-block"><h2>Pausa y considera</h2><ul id="questions"></ul></section><section class="reader-block"><h2>Vívelo hoy</h2><div id="action"></div></section><section class="reader-block prayer"><h2>Oración</h2><p id="prayer"></p></section></div><aside class="reader-side"><div class="reader-side-card"><strong>Ritmo devocional</strong><p>Lee despacio. Reflexiona con sinceridad. Responde con fidelidad. Ora con sencillez.</p></div><div class="reader-side-card"><strong id="time"></strong><p>Pensado para un momento tranquilo, una conversación familiar o la apertura de un grupo pequeño.</p></div><div class="reader-side-card"><strong>Recuerda</strong><p>La verdad de Dios acerca de ti y Su carácter permanecen firmes aun cuando cambien tus sentimientos o circunstancias.</p></div></aside></div><nav class="reader-nav content-sequence" aria-label="Devocional anterior y siguiente"><a id="previous" href="#"><span>Devocional anterior</span><strong></strong></a><a id="next" href="#"><span>Siguiente devocional</span><strong></strong></a></nav></article>`;
const text=(id,value)=>{const element=document.getElementById(id);if(element)element.textContent=value};
text('theme',item.theme);text('title',item.title);text('reference',item.reference);text('summary',item.summary);text('scriptureFocus',item.scriptureFocus);text('readPassage',`Lee el pasaje completo: ${item.reference}`);text('prayer',item.prayer);text('time',item.minutes);
const reflection=document.getElementById('reflection');if(reflection)reflection.innerHTML=item.reflection.map(value=>`<p>${escapeHtml(value)}</p>`).join('');
const questions=document.getElementById('questions');if(questions)questions.innerHTML=item.questions.map(value=>`<li>${escapeHtml(value)}</li>`).join('');
const action=document.getElementById('action');if(action)action.innerHTML=Array.isArray(item.action)?`<ul>${item.action.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ul>`:`<p>${escapeHtml(item.action)}</p>`;
const setNav=(id,navIndex)=>{const target=DEVOTIONALS[(navIndex+DEVOTIONALS.length)%DEVOTIONALS.length],link=document.getElementById(id);if(!link)return;link.href=`${target.id}.html`;link.querySelector('strong').textContent=target.title};
setNav('previous',index-1);setNav('next',index+1);
document.getElementById('print')?.addEventListener('click',()=>window.print());
document.getElementById('copy')?.addEventListener('click',async event=>{const button=event.currentTarget;try{await navigator.clipboard.writeText(location.href);button.textContent='Enlace copiado';setTimeout(()=>button.textContent='Copiar enlace',1800)}catch{prompt('Copia este enlace:',location.href)}});
})();
