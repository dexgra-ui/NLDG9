(()=>{
if(window.NLDG_SCRIPTURE_LINKS_LOADED)return;
window.NLDG_SCRIPTURE_LINKS_LOADED=true;
const BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Songs|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation';
const NUMBERED_BOOK_NAMES='Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John';
const RANGE_TAIL='(?:(?::\\d{1,3}(?:[-–—](?:\\d{1,3}(?::\\d{1,3})?))?)|(?:[-–—]\\d{1,3}(?::\\d{1,3})?))?';
const CORE=`\\d{1,3}${RANGE_TAIL}`;
const CONTINUATION=`\\d{1,3}(?!\\s+(?:${NUMBERED_BOOK_NAMES})\\b)${RANGE_TAIL}`;
const REFERENCE=new RegExp(`\\b(?:${BOOKS})\\s+${CORE}(?:\\s*,\\s*${CORE})*(?:\\s*;\\s*${CONTINUATION}(?:\\s*,\\s*${CORE})*)*`,'gi');
const SKIP='a,script,style,textarea,input,select,option,button,code,pre,[contenteditable="true"],.no-scripture-links';
const passageUrl=reference=>`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference.replace(/[–—]/g,'-'))}`;
const findReferences=text=>[...String(text||'').matchAll(REFERENCE)].map(match=>match[0]);
function linkTextNode(node){
 const text=node.nodeValue;
 REFERENCE.lastIndex=0;
 if(!text||!REFERENCE.test(text))return;
 REFERENCE.lastIndex=0;
 const fragment=document.createDocumentFragment();
 let last=0;
 for(const match of text.matchAll(REFERENCE)){
  if(match.index>last)fragment.append(text.slice(last,match.index));
  const reference=match[0];
  const link=document.createElement('a');
  link.className='scripture-reference-link';
  link.href=passageUrl(reference);
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.textContent=reference;
  link.setAttribute('aria-label',`Read ${reference} on Bible Gateway (opens in a new tab)`);
  fragment.append(link);
  last=match.index+reference.length;
 }
 if(last<text.length)fragment.append(text.slice(last));
 node.replaceWith(fragment);
}
function linkReferences(root=document.body){
 if(!root||root.nodeType===Node.ELEMENT_NODE&&(root.matches(SKIP)||root.closest(SKIP)))return;
 if(root.nodeType===Node.TEXT_NODE){linkTextNode(root);return}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement?.closest(SKIP)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(linkTextNode);
}
const style=document.createElement('style');
style.textContent='.scripture-reference-link{color:#8fe9b6;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;font-weight:750}.scripture-reference-link::after{content:"\\00a0↗";font-size:.72em;white-space:nowrap}.scripture-reference-link:hover,.scripture-reference-link:focus-visible{color:#ffd55f}.scripture-reference-link:focus-visible{outline:3px solid #ffd55f;outline-offset:3px;border-radius:3px}';
document.head.appendChild(style);
const start=()=>{
 linkReferences(document.body);
 let queued=false;
 const pending=new Set();
 const observer=new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>pending.add(node)));
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;const nodes=[...pending];pending.clear();nodes.forEach(linkReferences)});
 });
 observer.observe(document.body,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.NLDG_SCRIPTURE_LINKS={linkReferences,passageUrl,findReferences};
})();
