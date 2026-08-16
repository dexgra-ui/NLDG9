(()=>{
if(window.NLDG_BOOK_SEARCH_INTEGRATION_LOADED)return;
window.NLDG_BOOK_SEARCH_INTEGRATION_LOADED=true;
const sourceUrl=new URL('book-by-book.html',document.currentScript?.src||location.href).href;
let started=false;

function hydrate(){
  if(started||!Array.isArray(window.NLDG_CONTENT))return;
  started=true;
  fetch(sourceUrl)
    .then(response=>{
      if(!response.ok)throw new Error(`Book-by-Book search catalog request failed with ${response.status}`);
      return response.text();
    })
    .then(html=>{
      const doc=new DOMParser().parseFromString(html,'text/html');
      const current=window.NLDG_CONTENT||[];
      const books=[...doc.querySelectorAll('.book-card')].map(card=>{
        const title=card.querySelector('h2')?.textContent?.trim()||'';
        const description=card.querySelector('p')?.textContent?.trim()||'';
        const label=card.querySelector('span')?.textContent||'';
        const lessons=Number(label.match(/·\s*(\d+)\s+lessons?/i)?.[1]||0);
        const url=card.querySelector('a[href]')?.getAttribute('href')?.trim()||'';
        const scripture=(card.querySelector('small')?.textContent||'').replace(/^\s*📖\s*/,'').trim();
        if(!title||!lessons||!/^[a-z0-9-]+\.html$/i.test(url))return null;
        const slug=url.replace(/\.html$/i,'');
        const existing=current.find(item=>item.url===url);
        return {
          ...(existing||{}),
          id:existing?.id||`book-search-${slug}`,
          type:'Study',
          title,
          description:description||existing?.description||`Study ${title} book by book.`,
          url,
          category:existing?.category||'Bible Studies',
          series:'Book-by-Book Bible Study',
          scripture:scripture?[scripture]:(existing?.scripture||[]),
          book:title,
          topics:[...new Set([...(existing?.topics||[]),'Book-by-Book Bible Study',title])],
          audience:existing?.audience||['Personal and group study'],
          status:'published',
          bookStudy:true,
          lessons
        };
      }).filter(Boolean);
      if(books.length!==66)throw new Error(`Expected 66 Book-by-Book studies, found ${books.length}`);
      const bookUrls=new Set(books.map(item=>item.url));
      window.NLDG_CONTENT=[...current.filter(item=>!bookUrls.has(item.url)),...books];
      window.NLDG_BOOK_SEARCH_CATALOG=books;
      window.dispatchEvent(new CustomEvent('nldg:book-search-ready',{detail:{books:books.length}}));
      window.dispatchEvent(new Event('nldg-library-ready'));
    })
    .catch(error=>{
      started=false;
      console.warn('Book-by-Book studies could not be added to site search.',error);
    });
}

if(Array.isArray(window.NLDG_CONTENT))hydrate();
else window.addEventListener('nldg-library-ready',hydrate,{once:true});
setTimeout(hydrate,0);
})();
