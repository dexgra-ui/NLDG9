(function(){
 const rootElement=document.getElementById('article-detail');
 if(!rootElement)return;
 const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const nested=/\/articles\/[^/]+\.html$/i.test(location.pathname);
 const pathSlug=nested?(location.pathname.split('/').pop()||'').replace(/\.html$/i,''):'';
 const slug=new URLSearchParams(location.search).get('slug')||pathSlug;
 const article=window.NLDG_ARTICLE_API?.bySlug(slug)||window.NLDG_ARTICLES?.[0];
 if(!article){rootElement.innerHTML='<p>Article not found.</p>';return;}
 const root=nested?'../':'';
 const canonicalPath=`articles/${article.slug}.html`;
 const media=Array.isArray(article.media)?article.media:[];
 const mediaUrl=value=>{const raw=String(value||'').trim();if(!raw)return'';if(/^https?:\/\//i.test(raw)||raw.startsWith('/'))return raw;return `${root}${raw.replace(/^\.\//,'')}`;};
 const renderMediaBlock=item=>{
  if(!item||!item.type)return'';
  const credit=item.credit?`<figcaption>${escapeHtml(item.credit)}</figcaption>`:'';
  if(item.type==='image'){
   const src=mediaUrl(item.src);if(!src)return'';
   return `<figure class="article-media article-media-image"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.alt||'')}" loading="lazy" decoding="async">${credit}</figure>`;
  }
  if(item.type==='image-stack'){
   const images=(item.images||[]).map(image=>{const src=mediaUrl(image.src);return src?`<img src="${escapeHtml(src)}" alt="${escapeHtml(image.alt||item.alt||'')}" loading="lazy" decoding="async">`:'';}).join('');
   return images?`<figure class="article-media article-media-stack"><div class="article-media-stack-frame">${images}</div>${credit}</figure>`:'';
  }
  return'';
 };
 const mediaAfter=(sectionIndex,paragraphIndex)=>media.filter(item=>Number(item.afterSection)===sectionIndex+1&&Number(item.afterParagraph)===paragraphIndex+1).map(renderMediaBlock).join('');
 const socialImage=article.socialImage?mediaUrl(article.socialImage):'https://nolabelsdesignedbygod.org/no-labels-approved-logo.png';
 window.NLDG_SEO?.update({
  title:article.title,
  description:article.excerpt,
  url:canonicalPath,
  type:'article',
  image:socialImage,
  schema:{
   '@context':'https://schema.org','@type':'Article',headline:article.title,description:article.excerpt,
   datePublished:article.publishedAt,dateModified:article.updatedAt||article.publishedAt,
   mainEntityOfPage:`https://nolabelsdesignedbygod.org/${canonicalPath}`,
   image:[socialImage],
   author:{'@type':'Person',name:article.author||'Dexter Graham'},
   publisher:{'@type':'Organization',name:'No Labels, Designed by God',logo:{'@type':'ImageObject',url:'https://nolabelsdesignedbygod.org/no-labels-approved-logo.png'}},
   articleSection:article.category,keywords:(article.topics||[]).join(', ')
  }
 });
 const sections=article.content||[];
 const related=window.NLDG_ARTICLE_API.related(article,3);
 const hasQuestions=Array.isArray(article.questions)&&article.questions.length>0;
 const hasPrayer=Boolean(String(article.prayer||'').trim());
 const asideExtras=`${hasQuestions?'<a href="#reflection">Reflection</a>':''}${hasPrayer?'<a href="#prayer">Prayer</a>':''}`;
 const reflection=hasQuestions?`<section id="reflection" class="reflection-box"><h2>Reflection Questions</h2><ol>${article.questions.map(question=>`<li>${escapeHtml(question)}</li>`).join('')}</ol></section>`:'';
 const prayer=hasPrayer?`<section id="prayer" class="prayer-box"><h2>Prayer</h2><p>${escapeHtml(article.prayer)}</p></section>`:'';
 const relatedHref=item=>nested?`${encodeURIComponent(item.slug)}.html`:`articles/${encodeURIComponent(item.slug)}.html`;
 const sectionHtml=sections.map((section,index)=>`<section id="section-${index+1}"><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs||[]).map((paragraph,paragraphIndex)=>`<p>${escapeHtml(paragraph)}</p>${mediaAfter(index,paragraphIndex)}`).join('')}</section>`).join('');
 rootElement.innerHTML=`<header class="article-header"><a class="series-back-link" href="${root}articles.html">← Article & Writing Center</a><p class="article-eyebrow">${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p class="dek">${escapeHtml(article.excerpt)}</p><div class="article-meta"><span>${escapeHtml(article.author)}</span><span>${escapeHtml(article.publishedAt)}</span><span>${article.readingTime} min read</span></div></header><div class="article-layout"><aside class="article-aside"><strong>In this article</strong>${sections.map((section,index)=>`<a href="#section-${index+1}">${escapeHtml(section.heading)}</a>`).join('')}${asideExtras}</aside><article class="article-body">${sectionHtml}${reflection}${prayer}</article></div><section class="article-section"><div class="section-head"><div><p class="article-eyebrow">Continue reading</p><h2>Related articles</h2></div></div><div class="related-grid">${related.map(item=>`<a href="${relatedHref(item)}">${escapeHtml(item.title)} →</a>`).join('')}</div></section>`;
})();
