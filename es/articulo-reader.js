(()=>{
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const ARTICLES=window.NLDG_ARTICLES_ES||[];
const pathId=(location.pathname.split('/').pop()||'').replace(/\.html$/i,'');
const article=window.NLDG_ARTICLES_ES_API?.byId(pathId)||ARTICLES[0];
const rootElement=document.getElementById('article-detail');
if(!article||!rootElement)return;
if(!rootElement.id)rootElement.id='article-detail';
if(!document.querySelector('.skip-link')){const skip=document.createElement('a');skip.className='skip-link';skip.href='#article-detail';skip.textContent='Saltar al contenido principal';document.body.insertBefore(skip,document.body.firstChild)}
const sections=article.content||[];
const hasQuestions=Array.isArray(article.questions)&&article.questions.length>0;
const hasPrayer=Boolean(String(article.prayer||'').trim());
const related=window.NLDG_ARTICLES_ES_API?.related(article,3)||[];
const asideExtras=`${hasQuestions?'<a href="#reflexion">Preguntas</a>':''}${hasPrayer?'<a href="#oracion">Oración</a>':''}`;
const reflection=hasQuestions?`<section id="reflexion" class="reflection-box"><h2>Preguntas para reflexionar</h2><ol>${article.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></section>`:'';
const prayer=hasPrayer?`<section id="oracion" class="prayer-box"><h2>Oración</h2><p>${escapeHtml(article.prayer)}</p></section>`:'';
rootElement.innerHTML=`<header class="article-header"><a class="series-back-link" href="articulos.html">← Centro de artículos</a><p class="article-eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="dek">${escapeHtml(article.excerpt)}</p><div class="article-meta"><span>${escapeHtml(article.author)}</span><span>${escapeHtml(article.publishedAt)}</span><span>${article.readingTime} min de lectura</span></div></header><div class="article-layout"><aside class="article-aside"><strong>En este artículo</strong>${sections.map((section,index)=>`<a href="#seccion-${index+1}">${escapeHtml(section.heading)}</a>`).join('')}${asideExtras}</aside><article class="article-body">${sections.map((section,index)=>`<section id="seccion-${index+1}"><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs||[]).map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('')}${reflection}${prayer}</article></div><section class="article-section"><div class="section-head"><div><p class="article-eyebrow">Continúa leyendo</p><h2>Artículos relacionados</h2></div></div><div class="related-grid">${related.map(item=>`<a href="${encodeURIComponent(item.id)}.html">${escapeHtml(item.title)} →</a>`).join('')}</div></section>`;
document.title=`${article.title} | No Labels, Designed by God`;
})();
