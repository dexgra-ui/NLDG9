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
 const siteOrigin='https://nolabelsdesignedbygod.org/';
 const media=Array.isArray(article.media)?article.media:[];

 if(media.length&&!document.querySelector('link[data-article-media]')){
  const stylesheet=document.createElement('link');
  stylesheet.rel='stylesheet';
  stylesheet.href=`${root}article-media.css?v=1.1.0`;
  stylesheet.dataset.articleMedia='true';
  document.head.appendChild(stylesheet);
 }

 const mediaUrl=value=>{
  const raw=String(value||'').trim();
  if(!raw)return'';
  if(/^https?:\/\//i.test(raw)||raw.startsWith('/'))return raw;
  return `${root}${raw.replace(/^\.\//,'')}`;
 };
 const absoluteMediaUrl=value=>{
  const raw=String(value||'').trim();
  if(!raw)return'';
  if(/^https?:\/\//i.test(raw))return raw;
  return `${siteOrigin}${raw.replace(/^\/?/,'')}`;
 };
 const safeExternalUrl=value=>{
  const raw=String(value||'').trim();
  return /^https?:\/\//i.test(raw)?raw:'';
 };
 const maxWidthStyle=item=>{
  const maxWidth=Number(item?.maxWidth);
  return Number.isFinite(maxWidth)&&maxWidth>0?` style="--article-media-max-width:${Math.round(maxWidth)}px"`:'';
 };
 const mediaCaption=item=>{
  const parts=[];
  if(item?.caption)parts.push(`<span class="article-media-caption">${escapeHtml(item.caption)}</span>`);
  if(item?.source?.label){
   const href=safeExternalUrl(item.source.url);
   parts.push(href?`<a class="article-media-credit" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.source.label)}</a>`:`<span class="article-media-credit">${escapeHtml(item.source.label)}</span>`);
  }else if(item?.credit){
   parts.push(`<span class="article-media-credit">${escapeHtml(item.credit)}</span>`);
  }
  return parts.length?`<figcaption>${parts.join('')}</figcaption>`:'';
 };
 const imageMarkup=(image,item)=>{
  const src=mediaUrl(image?.src);
  if(!src)return'';
  const eager=Boolean(item?.eager||image?.eager);
  const loading=eager?'eager':'lazy';
  const priority=eager?' fetchpriority="high"':'';
  const width=Number(image?.width)>0?` width="${Math.round(Number(image.width))}"`:'';
  const height=Number(image?.height)>0?` height="${Math.round(Number(image.height))}"`:'';
  return `<img class="article-media-asset" src="${escapeHtml(src)}" alt="${escapeHtml(image?.alt||item?.alt||'')}" loading="${loading}" decoding="async"${priority}${width}${height} style="max-width:100%;height:auto">`;
 };
 const renderMediaBlock=item=>{
  if(!item||!item.type)return'';
  const caption=mediaCaption(item);
  const style=maxWidthStyle(item);
  if(item.type==='image'){
   const image=imageMarkup(item,item);
   return image?`<figure class="article-media article-media-image"${style}><div class="article-media-frame">${image}</div>${caption}</figure>`:'';
  }
  if(item.type==='image-stack'){
   const images=(item.images||[]).map(image=>imageMarkup(image,item)).join('');
   return images?`<figure class="article-media article-media-stack"${style}><div class="article-media-frame article-media-stack-frame">${images}</div>${caption}</figure>`:'';
  }
  if(item.type==='video'){
   const poster=item.poster?` poster="${escapeHtml(mediaUrl(item.poster))}"`:'';
   const preload=item.eager?'metadata':'none';
   const sources=(Array.isArray(item.sources)?item.sources:[item]).map(source=>{
    const src=mediaUrl(source?.src);if(!src)return'';
    const type=source?.mimeType?` type="${escapeHtml(source.mimeType)}"`:'';
    return `<source src="${escapeHtml(src)}"${type}>`;
   }).join('');
   return sources?`<figure class="article-media article-media-video"${style}><div class="article-media-frame"><video class="article-media-asset" controls playsinline preload="${preload}"${poster} style="max-width:100%;height:auto">${sources}</video></div>${caption}</figure>`:'';
  }
  return'';
 };
 const placementFor=item=>item?.placement||{};
 const mediaAfter=(sectionIndex,paragraphIndex)=>media.filter(item=>{
  const placement=placementFor(item);
  const section=Number(placement.section??item.afterSection);
  const afterParagraph=Number(placement.afterParagraph??item.afterParagraph);
  return section===sectionIndex+1&&afterParagraph===paragraphIndex+1;
 }).map(renderMediaBlock).join('');

 const defaultSocialImage=`${siteOrigin}no-labels-approved-logo.png`;
 const socialImage=article.socialImage?absoluteMediaUrl(article.socialImage):defaultSocialImage;
 window.NLDG_SEO?.update({
  title:article.title,
  description:article.excerpt,
  url:canonicalPath,
  type:'article',
  image:socialImage,
  schema:{
   '@context':'https://schema.org','@type':'Article',headline:article.title,description:article.excerpt,
   datePublished:article.publishedAt,dateModified:article.updatedAt||article.publishedAt,
   mainEntityOfPage:`${siteOrigin}${canonicalPath}`,
   image:[socialImage],
   author:{'@type':'Person',name:article.author||'Dexter Graham'},
   publisher:{'@type':'Organization',name:'No Labels, Designed by God',logo:{'@type':'ImageObject',url:defaultSocialImage}},
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

 const removeFailedMedia=asset=>{
  const figure=asset.closest('.article-media');
  if(!figure)return;
  if(asset.tagName==='IMG'&&figure.classList.contains('article-media-stack')){
   asset.remove();
   if(!figure.querySelector('img'))figure.remove();
   return;
  }
  figure.remove();
 };
 rootElement.querySelectorAll('.article-media img,.article-media video').forEach(asset=>asset.addEventListener('error',()=>removeFailedMedia(asset),{once:true}));
})();
