(()=>{
  const params=new URLSearchParams(location.search);
  const runtimeRoot=new URL('./',document.currentScript?.src||location.href);
  const isSpanishRoute=decodeURI(location.pathname).split('/').includes('es');
  const lang=(isSpanishRoute||params.get('lang')==='es')?'es':'en';
  const steps=lang==='es'?(window.NEW_BELIEVER_STEPS_ES||[]):(window.NEW_BELIEVER_STEPS||[]);
  document.documentElement.lang=lang;
  const suffix=lang==='es'?'-es':'';
  const completed=JSON.parse(localStorage.getItem(`nldg-new-believers-progress${suffix}`)||'[]');
  const q=(s)=>document.querySelector(s),qa=(s)=>[...document.querySelectorAll(s)];
  const siteHref=path=>new URL(path,runtimeRoot).href;
  const pathHref=lang==='es'?siteHref('es/empezar.html'):siteHref('new-believers.html');
  const stepHref=n=>lang==='es'?`${siteHref('es/paso-nuevo-creyente.html')}?step=${n}`:`${siteHref('new-believer-step.html')}?step=${n}`;
  const languageSwitch=`<div class="actions path-language-switch"><a class="button secondary" href="${siteHref('new-believers.html')}" lang="en">English</a><a class="button secondary" href="${siteHref('es/empezar.html')}" lang="es">Español</a></div>`;
  if(lang==='es'){
    document.title='Camino para Nuevos Creyentes | No Labels, Designed by God';
    const hero=q('.path-hero > div:first-child');
    hero.querySelector('.kicker').textContent='Camino para Nuevos Creyentes';
    hero.querySelector('h1').innerHTML='Da tu próximo paso <span>con Jesús.</span>';
    hero.querySelector('.lead').textContent='Un recorrido claro y centrado en las Escrituras para quienes están explorando el cristianismo y para quienes han comenzado recientemente a confiar en Cristo. Avanza a tu propio ritmo, haz preguntas honestas y comienza a construir una vida arraigada en Jesús.';
    const heroActions=hero.querySelector('.actions');heroActions.children[0].textContent='Comenzar Paso 1';heroActions.children[0].href=stepHref(1);heroActions.children[1].textContent='Ver el Camino Completo';
    hero.insertAdjacentHTML('beforeend',languageSwitch);
    const art=q('.path-hero-art');art.children[0].textContent='Recorrido guiado completo';art.children[1].textContent='No necesitas saberlo todo para dar el próximo paso fiel.';art.children[2].textContent='10 pasos guiados • Escrituras • reflexión • oración • progreso guardado';
    const intro=qa('.path-intro article');
    intro[0].querySelector('.kicker').textContent='¿Explorando el cristianismo?';intro[0].querySelector('h2').textContent='Puedes comenzar antes de tener todas las respuestas.';intro[0].querySelector('p:last-child').textContent='Usa este camino para comprender quién es Jesús, qué quieren decir los cristianos con salvación y qué significa confiar en Él. Las preguntas honestas no son una amenaza para la fe. Pueden formar parte del camino hacia la verdad.';
    intro[1].querySelector('.kicker').textContent='¿Comenzaste recientemente a confiar en Cristo?';intro[1].querySelector('h2').textContent='La vida nueva necesita un fundamento firme.';intro[1].querySelector('p:last-child').textContent='Este camino te ayudará a comprender la seguridad de la salvación, las Escrituras, la oración, el Espíritu Santo, la iglesia, el bautismo, la Cena del Señor, la tentación, cómo compartir tu fe y el discipulado diario.';
    const doctrine=q('.path-doctrine');doctrine.querySelector('.kicker').textContent='Cómo enseña este camino';doctrine.querySelector('h2').textContent='Primero las Escrituras. Las interpretaciones se identifican con honestidad.';doctrine.querySelector('div > p:last-child').textContent='Cada lección comienza con el texto bíblico, explica lo que el pasaje enseña con claridad e identifica áreas donde cristianos fieles pueden entender preguntas secundarias de manera diferente.';
    const cards=qa('.path-doctrine-card');
    const cardText=[['Lee en contexto','Consideramos el pasaje alrededor, la audiencia original, la forma literaria y la historia bíblica más amplia.'],['Separa texto e interpretación','Las Escrituras son autoritativas. Nuestras explicaciones y tradiciones permanecen abiertas al examen cuidadoso y la corrección.'],['Reconoce diferencias cristianas','Los desacuerdos secundarios se reconocen sin convertirlos en requisitos para la salvación.'],['Declaramos nuestra perspectiva','Cuando la enseñanza wesleyana de santidad influye en una lección, esa perspectiva se identifica abiertamente en vez de presentarse como el único lenguaje cristiano.']];
    cards.forEach((c,i)=>{c.querySelector('strong').textContent=cardText[i][0];c.querySelector('p').textContent=cardText[i][1]});
    q('.path-progress-top span').textContent='Tu progreso y las notas de las lecciones se guardan en este dispositivo.';
    const heading=q('#pathway .section-heading');heading.querySelector('.kicker').textContent='El recorrido completo';heading.querySelector('h2').textContent='Diez fundamentos para seguir a Jesús.';heading.querySelector('p').textContent='Todos los pasos están disponibles. Trabájalos en orden o vuelve al área donde más necesitas ayuda.';
    const guide=q('.path-guide');guide.querySelector('.kicker').textContent='Cómo usar este camino';guide.querySelector('h2').textContent='Avanza lo suficientemente despacio para que la verdad eche raíces.';guide.querySelector('div > p:last-child').textContent='Esto no es un examen que debes aprobar. Es una guía para aprender, reflexionar, responder y formar hábitos saludables mientras sigues a Jesús.';guide.querySelector('.path-guide-card h3').textContent='En cada paso';guide.querySelector('.path-guide-card ol').innerHTML=['Lee los pasajes bíblicos indicados.','Trabaja la enseñanza.','Responde las preguntas de reflexión con honestidad.','Escribe notas privadas guardadas en tu dispositivo.','Practica el próximo paso sugerido.','Ora con tus propias palabras.','Habla con un cristiano maduro o un líder de iglesia local.'].map(x=>`<li>${x}</li>`).join('');
    const footer=q('.ministry-footer .footer-invitation p');if(footer)footer.textContent='Creemos que cada persona fue creada a imagen de Dios. Dondequiera que estés en tu caminar con Cristo, eres bienvenido aquí.';
  }else{
    q('.path-hero > div:first-child').insertAdjacentHTML('beforeend',languageSwitch);
  }
  const grid=document.getElementById('pathGrid');
  grid.innerHTML=steps.map(item=>`<a class="path-step ${completed.includes(item.step)?'complete':''}" data-step="${item.step}" href="${stepHref(item.step)}"><span class="path-step-number">${item.step}</span><div><h3>${item.title}</h3><p>${item.goal}</p><div class="path-step-meta"><span>${item.keyScriptures.split(' • ')[0]}</span><span>${item.keyScriptures.split(' • ')[1]||''}</span><span>${item.minutes}</span></div></div><span class="path-step-status">${completed.includes(item.step)?(lang==='es'?'Completado ✓':'Completed ✓'):item.step===1?(lang==='es'?'Comenzar →':'Begin →'):(lang==='es'?'Abrir Paso →':'Open Step →')}</span></a>`).join('');
  const count=completed.filter(step=>step>=1&&step<=10).length;
  document.getElementById('progressLabel').textContent=lang==='es'?`Tu progreso: ${count} de 10 pasos`:`Your progress: ${count} of 10 steps`;
  document.getElementById('progressBar').style.width=`${count*10}%`;
  window.NLDG_NEW_BELIEVER_PATH={lang,pathHref,stepHref};
})();