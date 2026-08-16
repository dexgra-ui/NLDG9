(()=>{
if(window.NLDG_BOOK_BY_BOOK_LIBRARY_LOADED)return;
window.NLDG_BOOK_BY_BOOK_LIBRARY_LOADED=true;
const nested=/\/(?:articles|devotionals)\//i.test(location.pathname);
const root=nested?'../':'';
let loading=null;
const uniquePush=(list,item)=>{if(Array.isArray(list)&&!list.some(entry=>entry?.url===item.url))list.push(item)};
const parseBookCards=html=>{
 const doc=new DOMParser().parseFromString(html,'text/html');
 return [...doc.querySelectorAll('.book-card')].map(card=>{
  const title=card.querySelector('h2')?.textContent?.trim()||'';
  const description=card.querySelector('p')?.textContent?.trim()||'';
  const label=card.querySelector('span')?.textContent||'';
  const lessons=Number(label.match(/·\s*(\d+)\s+lessons?/i)?.[1]||0);
  const url=card.querySelector('a[href]')?.getAttribute('href')?.trim()||'';
  const scripture=(card.querySelector('small')?.textContent||'').replace(/^\s*📖\s*/,'').trim();
  if(!title||!lessons||!/^[a-z0-9-]+\.html$/i.test(url))return null;
  const slug=url.replace(/\.html$/i,'');
  return {
   id:`book-study-${slug}`,
   type:'Study',
   title,
   description:description||`Study ${title} book by book.`,
   url,
   category:'Bible Studies',
   series:'Book-by-Book Bible Study',
   scripture:scripture?[scripture]:[],
   book:title,
   topics:['Book-by-Book Bible Study',title],
   audience:['Adults','Small Groups','Individuals'],
   status:'published',
   lessons,
   bookStudy:true
  };
 }).filter(Boolean);
};
function mergeBooks(books){
 const library=window.NLDG_LIBRARY;
 if(!Array.isArray(library))return false;
 for(const book of books){
  const existing=library.find(item=>item?.url===book.url);
  const item=existing||book;
  if(!existing)library.push(item);
  uniquePush(window.NLDG_CONTENT,item);
  uniquePush(window.NLDG_STUDIES,item);
 }
 return true;
}
function load(){
 if(loading)return loading;
 if(!Array.isArray(window.NLDG_LIBRARY))return Promise.resolve([]);
 loading=fetch(`${root}book-by-book.html`)
  .then(response=>{if(!response.ok)throw new Error(`Book-by-Book catalog request failed with ${response.status}`);return response.text()})
  .then(html=>{
   const books=parseBookCards(html);
   if(books.length!==66)throw new Error(`Expected 66 Book-by-Book studies, found ${books.length}`);
   if(!mergeBooks(books))throw new Error('The ministry content library is not ready.');
   window.dispatchEvent(new CustomEvent('nldg-book-library-ready',{detail:{books:books.length}}));
   window.dispatchEvent(new Event('nldg-library-ready'));
   return books;
  })
  .catch(error=>{loading=null;console.warn('Book-by-Book search catalog could not be loaded.',error);return[]});
 return loading;
}
window.NLDG_BOOK_LIBRARY={load,parseBookCards};
const start=()=>{if(Array.isArray(window.NLDG_LIBRARY))load()};
window.addEventListener('nldg-library-ready',start,{once:true});
if(document.readyState==='complete')setTimeout(start,0);else window.addEventListener('load',()=>setTimeout(start,0),{once:true});
})();